//TFSID 16694 Latent phase - Make the graph responsive.
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { XAxisTimeConversionService } from '@app/shared/services/xaxis-chart.services';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { SVGChart, OxytocinModalData, OxitocinChartScale, AmnioticMouldingChartScale } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { OxitocinChartPopupComponent } from '../../modal-content/oxitocin.chart.popup/oxitocin.chart.popup.component';
import { AuthService, User } from '@app/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '@app/shared/services';
import { ServerChartValues, ServerChartCommonComment } from '@app/modules/manage-partograph/modals/input-chart';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-oxitocinchart',
  templateUrl: './oxitocin.chart.component.html',
  styleUrls: ['./oxitocin.chart.component.css']
})
export class OxitocinChartComponent implements OnInit {
  @ViewChild('chartOxytocin', { static: true }) OxytocinchartContainer: ElementRef;
  @ViewChild('chartDrops', { static: true }) DropschartContainer: ElementRef;
  public chart: SVGChart; modalPopupData: OxytocinModalData;
  modalRef: NgbModalRef; chartTimeCalculation: ChartTimeConversionXAxis;
  isTimeExceed = 0; currentUser: User; inputChartServer: ServerChartValues;
  public OxytocinList: any = []; public DropsList: any = [];
  baseGraphViewModel: BaseChartViewModel;
  constructor(private chartinputservice: ChartInputService, private data: DataService, private toastr: ToastrService, private authenticationService: AuthService, public modalService: NgbModal,
    public timeConverService: XAxisTimeConversionService) {
    this.chart = new SVGChart();
    this.modalPopupData = new OxytocinModalData();
    this.currentUser = this.authenticationService.currentUserValue;

    this.baseGraphViewModel = new BaseChartViewModel();
    this.baseGraphViewModel.StagesId = 1;
    this.baseGraphViewModel.PatientId = ServerChartValues.GetPatientId();
    this.baseGraphViewModel.PartographId = ServerChartValues.GetPartpgraphId();
    this.baseGraphViewModel.ClientId = this.currentUser.ClientId;
    this.baseGraphViewModel.CreatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdatedBy = this.currentUser.LoginId;
    
    this.baseGraphViewModel.UpdateDateTimeBrowser = new Date();

  }

  ngOnInit(): void {
    

    this.LoadOxytocinData(this.baseGraphViewModel);
    this.LoadDropsMinData(this.baseGraphViewModel);

  }

  CreateChartOxytocin(dataOxytocinArray: any) {

    // TFSID 16475 Rizwan Khan, 28 July 2020, Aplied active condition on JSON data
    const dataOxytocin: any = dataOxytocinArray;//.filter(u => u.active == '1');

    let element;
    element = this.OxytocinchartContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // OxitocinChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartHeart')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([OxitocinChartScale.MinXAxisTicks, OxitocinChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([OxitocinChartScale.MinYAxisTicks, OxitocinChartScale.MaxYAxisTicks])
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
      .call(this.chart.xAxis.ticks(OxitocinChartScale.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return ``;
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');
    //svg.selectAll('.xaxis .tick text').style('font-weight', '200').style('font-size', '6px');

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.chart.yAxis.ticks(OxitocinChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
        return ``;
      }));
        

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left+102},${30})`)
      .attr('class', 'chartlabelname')
      .text('Oxytocin U/L');

    svg.selectAll("amnioticLables")
      .data(dataOxytocin)
      .enter()
      .append("text")
      .attr("x", (d) => this.chart.xScale((d['xAxisPosition']))+16)
      .attr("y", (d) => (AmnioticMouldingChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom + 5) / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) { return parseFloat(d['chartValue']).toFixed(1) })
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .attr('class', 'chartData')

  }

  CreateChartDrops(dataDropsArray: any) {

    // TFSID 16475 Rizwan Khan, 28 July 2020, Aplied active condition on JSON data
    const dataDrops: any = dataDropsArray;//.filter(u => u.active == '1');

    let element;
    element = this.DropschartContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // OxitocinChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartHeart')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([OxitocinChartScale.MinXAxisTicks, OxitocinChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([OxitocinChartScale.MinYAxisTicks, OxitocinChartScale.MaxYAxisTicks])
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
      .call(this.chart.xAxis.ticks(OxitocinChartScale.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return ``;
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');
    //svg.selectAll('.xaxis .tick text').style('font-weight', '200').style('font-size', '6px');

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.chart.yAxis.ticks(OxitocinChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
        return ``;
      }));


    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left + 102},${30})`)
      .attr('class', 'chartlabelname')
      .text('Drops/min');

    svg.selectAll("amnioticLables")
      .data(dataDrops)
      .enter()
      .append("text")
      .attr("x", (d) => this.chart.xScale((d['xAxisPosition'])) + 16)
      .attr("y", (d) => (AmnioticMouldingChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom + 5) / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) { return parseFloat(d['chartValue']).toFixed(1) })
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .attr('class', 'chartData')

  }

  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }

  GetChartDomainOnYAxis(): any {
    return AmnioticMouldingChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
  }
  // TFSID 16642 Rizwan Khan, 18 July 2020, Plotting chart data
  openModalOxytocin(): void {

    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {
      this.modalPopupData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.modalPopupData.timeZone = this.chartTimeCalculation.timeZone; 
      this.modalPopupData.currentTime = this.chartTimeCalculation.timeNow;
      this.modalPopupData.inputBy = '';
      this.modalPopupData.remarks = '';
      this.modalPopupData.modelName = 'partographChart.Key_OxytocinChart';
      this.modalPopupData.modelStagename = 'key_LatentPhase';

      this.modalPopupData.chartkeyName = 'partographChart.Key_OxytocinChart';
      this.modalPopupData.labelKeyName = 'partographChart.Key_OxytocinChartLabel'
      this.modalPopupData.stageId = 1;
      this.modalRef = this.modalService.open(OxitocinChartPopupComponent, { size: 'xl', backdrop: 'static' });

      this.modalRef.componentInstance.modalData = this.modalPopupData;
      this.modalRef.result.then((result) => {
        //console.log(result);
      }).catch((result) => {
        console.log(result);
      });

      

      this.modalRef.componentInstance.passEntryOxytocin.subscribe((receivedEntry) => {

        // TFSID 16972,Rizwan Khan,31 July 2020, Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }

        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 1;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.value.toString();
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.halfPlotting; //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = 0;
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveOxytocinUL(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadOxytocinData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.OXYTOCIN;
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
            this.OxytocinList = [];
            this.toastr.success("Error!");
          }
        );
        
      });

    }
    else {
      this.toastr.warning("Observation start time and current time exceed from 12 hours.");

    }

  }

  // Load Oxytocin API
  LoadOxytocinData(baseView) {
    this.chartinputservice.GetOxytocinULAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.OxytocinList = data.data;
      }      
      this.CreateChartOxytocin(this.OxytocinList);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.OxytocinList = [];
        this.CreateChartOxytocin(this.OxytocinList);
      }

    );
  }

  // Load DropsPerMin API
  LoadDropsMinData(baseView) {
    this.chartinputservice.GetDropsAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.DropsList = data.data;
      }
      this.CreateChartDrops(this.DropsList);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.DropsList = [];
        this.CreateChartDrops(this.DropsList);
      }

    );
  }
  // TFSID 16642 Rizwan Khan, 18 July 2020, Plotting chart data
  openModalDrops(): void {

    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {
      this.modalPopupData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.modalPopupData.timeZone = this.chartTimeCalculation.timeZone; 
      this.modalPopupData.currentTime = this.chartTimeCalculation.timeNow;
      this.modalPopupData.inputBy = '';
      this.modalPopupData.remarks = '';
      this.modalPopupData.chartkeyName = 'partographChart.Key_DropsChart';
      this.modalPopupData.labelKeyName = 'partographChart.Key_DropsChart';
      this.modalPopupData.stageId = 1;
      this.modalPopupData.modelName = 'partographChart.Key_DropsChart';
      this.modalPopupData.modelStagename = 'key_LatentPhase';
      this.modalRef = this.modalService.open(OxitocinChartPopupComponent, { size: 'xl', backdrop: 'static' });

      this.modalRef.componentInstance.modalData = this.modalPopupData;
      this.modalRef.result.then((result) => {
        //console.log(result);
      }).catch((result) => {
        console.log(result);
      });

      
      this.modalRef.componentInstance.passEntryDrops.subscribe((receivedEntry) => {
        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 1;
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId
        this.inputChartServer.ChartValue = receivedEntry.value.toString();
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.halfPlotting; //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = 0;
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveDropsMin(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadDropsMinData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.DROPS;
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
            this.DropsList = [];
            this.toastr.success("Error!");
          }
        );

      });

    }
    else {
      this.toastr.warning("Observation start time and current time exceed from 12 hours.");

    }

  }

  
}
