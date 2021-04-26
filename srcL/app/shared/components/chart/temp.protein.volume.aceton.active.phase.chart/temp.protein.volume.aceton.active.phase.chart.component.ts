// TFSID 16566 Latent Phase: Protein/Acetone/Volume grid: Merge grid in Lamps 3.0
//TFSID 16694 Latent phase - Make the graph responsive.
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { XAxisTimeConversionService } from '@app/shared/services/xaxis-chart.services';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { SVGChart, UrineAcetonVolumeModalData, UrineAcetonVolumeChartScale, ProteinModalData, AcetonModalData, VolumeModalData } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { TempProteinVolumeAcetonChartPopupComponent } from '../../modal-content/temp.protein.volume.aceton.chart.popup/temp.protein.volume.aceton.chart.popup.component';
import { DataService } from '@app/shared/services';
import { User, AuthService } from '@app/core';
import { ServerChartValues, ServerChartCommonComment } from '@app/modules/manage-partograph/modals/input-chart';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { ToastrService } from 'ngx-toastr';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-tempproteinvolumeaceton-active-phasechart',
  templateUrl: './temp.protein.volume.aceton.active.phase.chart.component.html',
  styleUrls: ['./temp.protein.volume.aceton.active.phase.chart.component.css']
})

export class TempProteinVolumeAcetonActivePhaseChartComponent implements OnInit {
  currentUser: User; inputChartServer: ServerChartValues;
  @ViewChild('chartProtein', { static: true }) chartProteinContainer: ElementRef;
  @ViewChild('chartAcetone', { static: true }) chartAcetoneContainer: ElementRef;
  @ViewChild('chartVolume', { static: true }) chartVolumeContainer: ElementRef;
  public chart: SVGChart;  modalPopupData: UrineAcetonVolumeModalData;
  modalRef: NgbModalRef; chartTimeCalculation: ChartTimeConversionXAxis;
  isTimeExceed = 0; public proteinList: any = []; acetoneList: any = []; volumeList: any = [];
  objProtein: ProteinModalData; objAceton: AcetonModalData; objVolume: VolumeModalData;
  baseGraphViewModel: BaseChartViewModel;
  constructor(private toastr: ToastrService, private authenticationService: AuthService, private chartinputservice: ChartInputService,private data: DataService, public modalService: NgbModal,
    public timeConverService: XAxisTimeConversionService) {
    this.chart = new SVGChart();
    this.modalPopupData = new UrineAcetonVolumeModalData();
    this.objProtein = new ProteinModalData();
    this.objAceton = new AcetonModalData();
    this.objVolume = new VolumeModalData();
    this.currentUser = this.authenticationService.currentUserValue;

    this.baseGraphViewModel = new BaseChartViewModel();
    this.baseGraphViewModel.StagesId = 2;
    this.baseGraphViewModel.PatientId = ServerChartValues.GetPatientId();
    this.baseGraphViewModel.PartographId = ServerChartValues.GetPartpgraphId();
    this.baseGraphViewModel.ClientId = this.currentUser.ClientId;
    this.baseGraphViewModel.CreatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdatedBy = this.currentUser.LoginId;
  }

  ngOnInit(): void {

    this.LoadAcetonData(this.baseGraphViewModel);
    this.LoadVolumeData(this.baseGraphViewModel);
    this.LoadProtienData(this.baseGraphViewModel);
    
  }


  
  CreateProteinChart(dataProteinArray: any) {
    // TFSID 16646 Rizwan Khan, 17 July 2020, Aplied active condition on JSON data
    const dataProtein: any = dataProteinArray;//.filter(u => u.active == '1');

    let element;
    element = this.chartProteinContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // OxitocinChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartProtein')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinXAxisTicks, UrineAcetonVolumeChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);


    const xScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinXAxisTicks, UrineAcetonVolumeChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinYAxisTicks, UrineAcetonVolumeChartScale.MaxYAxisTicks])
      .range([this.chart.height, 0]);

    // create scales
    this.chart.xAxis = d3.axisBottom(this.chart.xScale).tickSizeInner(-this.chart.height)
      .tickSizeOuter(0)
      .tickPadding(this.chart.xAxistickPadding);

    this.chart.yAxis = d3.axisLeft(this.chart.yScale)
      .tickSizeInner(-this.chart.width).ticks(2, "f")
      .tickSizeOuter(0)
      .tickPadding(this.chart.yAxistickPadding);

    svg.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0,${this.chart.height})`)
      // tslint:disable-next-line:variable-name
      .call(this.chart.xAxis.ticks(UrineAcetonVolumeChartScale.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return ``;
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');
    svg.selectAll('.xaxis .tick text').style('font-weight', '200').style('font-size', '6px');

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.chart.yAxis.ticks(UrineAcetonVolumeChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
        return ``;
      }));

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left + 102},${30})`)
      .attr('class', 'chartlabelname')
      .text('Protein');
      

     // TFSID 16646 Rizwan Khan 17 July 2020 ,Applie margin text value as per required text
    svg.selectAll("proteinLables")
      .data(dataProtein)
      .enter()
      .append("text")
      .attr("x",
        //(d) => this.chart.xScale((d['x'])) + 30)
      function (d) {
        if (d['chartValue'] === 'Traces') {
          return xScale((d['xAxisPosition'])) + 25
      }
      else {
          return xScale((d['xAxisPosition'])) + 35
      }
    }
        // (d) => this.chart.xScale((d['x'])) + 5
      )

      .attr("y", (d) => (UrineAcetonVolumeChartScale.Height - this.chart.margin.top - this.chart.margin.bottom + 5) / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) { return d['chartValue'] })
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .attr('class', 'chartData')
  }
  CreateAcetoneChart(dataAcetoneArray: any) {
 // TFSID 16646 Rizwan Khan, 17 July 2020, Aplied active condition on JSON data
    const dataAcetone: any = dataAcetoneArray;//.filter(u => u.active == '1');

    let element;
    element = this.chartAcetoneContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // OxitocinChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartAcetone')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinXAxisTicks, UrineAcetonVolumeChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinYAxisTicks, UrineAcetonVolumeChartScale.MaxYAxisTicks])
      .range([this.chart.height, 0]);

    // create scales

    const xScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinXAxisTicks, UrineAcetonVolumeChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.xAxis = d3.axisBottom(this.chart.xScale).tickSizeInner(-this.chart.height)
      .tickSizeOuter(0)
      .tickPadding(this.chart.xAxistickPadding);

    this.chart.yAxis = d3.axisLeft(this.chart.yScale)
      .tickSizeInner(-this.chart.width).ticks(2, "f")
      .tickSizeOuter(0)
      .tickPadding(this.chart.yAxistickPadding);

    svg.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0,${this.chart.height})`)
      // tslint:disable-next-line:variable-name
      .call(this.chart.xAxis.ticks(UrineAcetonVolumeChartScale.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return ``;
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');
    svg.selectAll('.xaxis .tick text').style('font-weight', '200').style('font-size', '6px');

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.chart.yAxis.ticks(UrineAcetonVolumeChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
        return ``;
      }));


    /// TFSID 16938 Rizwan khan , 23 July 2020, Change Position
    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left + 102},${30})`)
      .attr('class', 'chartlabelname')
      .text('Acetone');
    
    svg.selectAll("acetoneLables")
      .data(dataAcetone)
      .enter()
      .append("text")
      .attr("x",
        function (d) {
          if (d['chartValue'] === 'Absent') {
            return xScale((d['xAxisPosition'])) + 20
          }
          else {
            return xScale((d['xAxisPosition'])) + 20
          }
        }
        // (d) => this.chart.xScale((d['x'])) + 5
      )
           //(d) => this.chart.xScale((d['x'])) + 25)
      .attr("y", (d) => (UrineAcetonVolumeChartScale.Height - this.chart.margin.top - this.chart.margin.bottom+5) / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) { return d['chartValue'] })
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .attr('class', 'chartData')
  }
  CreateVolumeChart(dataVolumeArray: any) {
  // TFSID 16646 Rizwan Khan, 17 July 2020, Aplied active condition on JSON data
    const dataVolume: any = dataVolumeArray;//.filter(u => u.active == '1');

    let element;
    element = this.chartVolumeContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // OxitocinChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartVolume')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinXAxisTicks, UrineAcetonVolumeChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinYAxisTicks, UrineAcetonVolumeChartScale.MaxYAxisTicks])
      .range([this.chart.height, 0]);

    // create scales

    const xScale = d3.scaleLinear()
      .domain([UrineAcetonVolumeChartScale.MinXAxisTicks, UrineAcetonVolumeChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.xAxis = d3.axisBottom(this.chart.xScale).tickSizeInner(-this.chart.height)
      .tickSizeOuter(0)
      .tickPadding(this.chart.xAxistickPadding);

    this.chart.yAxis = d3.axisLeft(this.chart.yScale)
      .tickSizeInner(-this.chart.width).ticks(2, "f")
      .tickSizeOuter(0)
      .tickPadding(this.chart.yAxistickPadding);

    svg.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0,${this.chart.height})`)
      // tslint:disable-next-line:variable-name
      .call(this.chart.xAxis.ticks(UrineAcetonVolumeChartScale.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return ``;
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');
    //svg.selectAll('.xaxis .tick text').style('font-weight', '200').style('font-size', '6px');

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.chart.yAxis.ticks(UrineAcetonVolumeChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
        return ``;
      }));


    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left + 102},${30})`)
      .attr('class', 'chartlabelname')
      .text('Volume');

    svg.selectAll("volumeLables")
      .data(dataVolume)
      .enter()
      .append("text")
      .attr("x",
        function (d) {
          if (d['chartValue'] === 'Inadequate') {
            return xScale((d['xAxisPosition'])) + 5
          }
          else {
            return xScale((d['xAxisPosition'])) + 8
          }
        }
        // (d) => this.chart.xScale((d['x'])) + 5
      )
      .attr("y", (d) => (UrineAcetonVolumeChartScale.Height - this.chart.margin.top - this.chart.margin.bottom+5) / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) { return d['chartValue'] })
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .attr('class', 'chartData')
  }
  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }

  GetChartDomainOnYAxis(): any {
    return UrineAcetonVolumeChartScale.Height - this.chart.margin.top - this.chart.margin.bottom;
  }

  openModal(modalKey: string) {
    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {
      // TFSID 16635, Rizwan Khan, 27 July 2020, Add time with timezone
      if (modalKey == "partographChart.key_ProtienChart") {
        this.objProtein.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
        this.objProtein.timeZone = this.chartTimeCalculation.timeZone;
        this.objProtein.currentTime = this.chartTimeCalculation.timeNow;
        this.objProtein.inputBy = '';
        this.objProtein.remarks = '';
        this.objProtein.modalpopupKey = modalKey;
        this.objProtein.modelName = 'partographChart.key_ProtienChart';
        this.objProtein.modelStagename = 'key_ActivePhase';
        this.objProtein.selectList = this.objProtein.selectList;
        this.objProtein.stageId = 2;
        this.modalRef = this.modalService.open(TempProteinVolumeAcetonChartPopupComponent, { size: 'xl', backdrop: 'static' });
        this.modalRef.componentInstance.modalData = this.objProtein;

        //this.modalRef = this.modalService.open(TempProteinVolumeAcetonChartPopupComponent, { size: 'xl', backdrop: 'static' });
        //this.modalRef.componentInstance.modalData = this.objProtein;
      }
      // TFSID 16635, Rizwan Khan, 27 July 2020, Add time with timezone
      else if (modalKey == "partographChart.key_AcetoneChart") {
        this.objAceton.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
        this.objAceton.timeZone = this.chartTimeCalculation.timeZone;
        this.objAceton.currentTime = this.chartTimeCalculation.timeNow;
        this.objAceton.inputBy = '';
        this.objAceton.remarks = '';
        this.objAceton.modalpopupKey = modalKey;
        this.objAceton.modelName = 'partographChart.key_AcetoneChart';
        this.objAceton.modelStagename = 'key_ActivePhase';
        this.objAceton.stageId = 2;
        this.objAceton.selectList = this.objAceton.selectList;
        this.modalRef = this.modalService.open(TempProteinVolumeAcetonChartPopupComponent, { size: 'xl', backdrop: 'static' });
        this.modalRef.componentInstance.modalData = this.objAceton;
      }
      else {
       
        this.objVolume.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
        this.objVolume.timeZone = this.chartTimeCalculation.timeZone;
        this.objVolume.currentTime = this.chartTimeCalculation.timeNow;
        this.objVolume.inputBy = '';
        this.objVolume.remarks = '';
        this.objVolume.modalpopupKey = modalKey;
        this.objVolume.modelName = 'partographChart.key_VolumeChart';
        this.objVolume.modelStagename = 'key_ActivePhase';
        this.objVolume.stageId = 2;
        this.objVolume.selectList = this.objVolume.selectList;
        this.modalRef = this.modalService.open(TempProteinVolumeAcetonChartPopupComponent, { size: 'xl', backdrop: 'static' });
        this.modalRef.componentInstance.modalData = this.objVolume;
      }
      
      this.modalRef.result.then((result) => {

        console.log(result);

      }).catch((result) => {

        // console.log('cancelling');

      });

      let data; data = []; let dataArray; dataArray = {};
      let OxitocinList = ''; let value = 0; let inputBy; let comments;
      this.modalRef.componentInstance.passProteinEntry.subscribe((receivedEntry) => {

        // TFSID 16972,Rizwan Khan,31 July 2020, Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }

        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 2;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.selectList;//this.chartTimeCalculation.xAxisInterval_Sys.toString();
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.xAxisInterval_Sys; //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = 0;// receivedEntry.selectList;// + "" + receivedEntry.TemperatureType; //receivedEntry.value.toString();
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveProtein(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadProtienData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");


              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.PROTEIN;
              commentBody.ClientId = Number(this.currentUser.ClientId);
              commentBody.ParentID = data.data.id;
              commentBody.CreatedBy = this.currentUser.LoginId;
              commentBody.UpdatedBy = this.currentUser.LoginId;
              commentBody.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
              commentBody.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
              commentBody.Description = receivedEntry.remarks;
              this.chartinputservice.SaveGraphCommonComment(commentBody).subscribe();

            }
            else {
              this.toastr.success("Data not saved!");
            }

          }

          ,
          error => {
            // .... HANDLE ERROR HERE 
            console.log(error);
            this.proteinList = [];

            this.toastr.success("Error!");
          }
        );

       
        this.CreateProteinChart(this.proteinList);


      });

      this.modalRef.componentInstance.passAcetoneEntry.subscribe((receivedEntry) => {

        // TFSID 16972,Rizwan Khan,31 July 2020, Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }

        this.inputChartServer = new ServerChartValues();
       
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 2;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.selectList;//this.chartTimeCalculation.xAxisInterval_Sys.toString();
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.xAxisInterval_Sys; //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = 0;// receivedEntry.selectList;// + "" + receivedEntry.TemperatureType; //receivedEntry.value.toString();
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveAceton(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadAcetonData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.ACETON;
              commentBody.ClientId = Number(this.currentUser.ClientId);
              commentBody.ParentID = data.data.id;
              commentBody.CreatedBy = this.currentUser.LoginId;
              commentBody.UpdatedBy = this.currentUser.LoginId;
              commentBody.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
              commentBody.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
              commentBody.Description = receivedEntry.remarks;
              this.chartinputservice.SaveGraphCommonComment(commentBody).subscribe();

            }
            else {
              this.toastr.success("Data not saved!");
            }

          }

          ,
          error => {
            // .... HANDLE ERROR HERE 
            console.log(error);
            this.proteinList = [];

            this.toastr.success("Error!");
          }
        );


      });

      this.modalRef.componentInstance.passVolumeEntry.subscribe((receivedEntry) => {

        // Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }

        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 2;
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.selectList;//this.chartTimeCalculation.xAxisInterval_Sys.toString();
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.xAxisInterval_Sys; //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = 0;//receivedEntry.selectList;// + "" + receivedEntry.TemperatureType; //receivedEntry.value.toString();
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveVolume(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadVolumeData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.VOlUME;
              commentBody.ClientId = Number(this.currentUser.ClientId);
              commentBody.ParentID = data.data.id;
              commentBody.CreatedBy = this.currentUser.LoginId;
              commentBody.UpdatedBy = this.currentUser.LoginId;
              commentBody.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
              commentBody.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
              commentBody.Description = receivedEntry.remarks;
              this.chartinputservice.SaveGraphCommonComment(commentBody).subscribe();

            }
            else {
              this.toastr.success("Data not saved!");
            }

          }

          ,
          error => {
            // .... HANDLE ERROR HERE 
            console.log(error);
            this.volumeList = [];

            this.toastr.success("Error!");
          }
        );

        
      });

    }
    else {
      alert('Observation start time and current time exceed from 12 hours.');
    }

  }
  // Protien API
  LoadProtienData(baseView) {
    this.chartinputservice.GetProteinAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.proteinList = data.data;
      }
      this.CreateProteinChart(this.proteinList);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.proteinList = [];
        this.CreateProteinChart(this.proteinList);
      }

    );
  }  
  
  // Aceton API
  LoadAcetonData(baseView) {
    this.chartinputservice.GetAcetonAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.acetoneList = data.data;
      }
      this.CreateAcetoneChart(this.acetoneList);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.acetoneList = [];
        this.CreateAcetoneChart(this.acetoneList);
      }

    );
  }

  // Volume API
  LoadVolumeData(baseView) {
    this.chartinputservice.GetVolumeAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.volumeList = data.data;
      }
      this.CreateVolumeChart(this.volumeList);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.volumeList = [];
        this.CreateVolumeChart(this.volumeList);
      }

    );
  }  
}
 
