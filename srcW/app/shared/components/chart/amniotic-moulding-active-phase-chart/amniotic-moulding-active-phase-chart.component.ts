
//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16003
//Logic Description: Latent Phase: Amniotic Fluid Chart: Merge chart in Lamps 3.0
//                   here is amniotic & moulding chart plotting logic 

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SVGChart, AmnioticModalData, MouldingModalData, AmnioticMouldingChartScale } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { XAxisTimeConversionService, DataService } from '@app/shared/services';
import * as d3 from 'd3';
import { AmnioticChartPopupComponent } from '../../modal-content/amniotic.chart.popup/amniotic.chart.popup.component';
import { MouldingChartPopupComponent } from '../../modal-content/moulding.chart.popup/moulding.chart.popup.component';
import { ToastrService } from 'ngx-toastr';
import { User, AuthService } from '@app/core';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { ServerChartValues, ServerChartCommonComment } from '@app/modules/manage-partograph/modals/input-chart';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-amniotic-moulding-active-phasechart',
  templateUrl: './amniotic-moulding-active-phase-chart.component.html',
  styleUrls: ['./amniotic-moulding-active-phase-chart.component.css']
})
export class AmnioticMouldingActivePhasechartComponent implements OnInit {
  inputChartServer: ServerChartValues; baseGraphViewModel: BaseChartViewModel;
  @ViewChild('chartAmniotic', { static: true }) chartAmnioticContainer: ElementRef;
  @ViewChild('chartMoulding', { static: true }) chartMouldingContainer: ElementRef;
  public chart: SVGChart; currentUser: User;
  modalPopupDatafor_Amniotic: AmnioticModalData;
  modalPopupDatafor_Moulding: MouldingModalData;
  modalRef: NgbModalRef; chartTimeCalculation: ChartTimeConversionXAxis;
  isTimeExceed = 0; public amnioticJsonData: any = []; public mouldingJsonData: any = [];
  constructor(private chartinputservice: ChartInputService, private data: DataService, private authenticationService: AuthService, private toastr: ToastrService, public modalService: NgbModal,
    public timeConverService: XAxisTimeConversionService) {

    this.currentUser = this.authenticationService.currentUserValue;
    this.chart = new SVGChart();
    this.modalPopupDatafor_Amniotic = new AmnioticModalData();
    this.modalPopupDatafor_Moulding = new MouldingModalData();

    this.baseGraphViewModel = new BaseChartViewModel();
    this.baseGraphViewModel.StagesId = 2;
    this.baseGraphViewModel.PatientId = ServerChartValues.GetPatientId();
    this.baseGraphViewModel.PartographId = ServerChartValues.GetPartpgraphId();
    this.baseGraphViewModel.ClientId = this.currentUser.ClientId;
    this.baseGraphViewModel.CreatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.SourceSystemID = 1;
    this.baseGraphViewModel.UpdateDateTimeBrowser = new Date();
    this.baseGraphViewModel.PageNo = 1;
    this.baseGraphViewModel.PageSize = 100;

  }

  ngOnInit(): void {

    this.LoadAmnioticData(this.baseGraphViewModel);
    this.LoadMouldingData(this.baseGraphViewModel);
    //this.CreateAmnioticChart([]);
    //this.CreateMouldingChart([]);
  }


  // Amniotic API
  LoadAmnioticData(baseview) {
    this.chartinputservice.GetAmnioticFluidAnalytics(baseview).subscribe(data => {
     
      this.amnioticJsonData = data.data;
      this.CreateAmnioticChart(this.amnioticJsonData);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.amnioticJsonData = [];
        this.CreateAmnioticChart(this.amnioticJsonData);
      }

    );
  }

  // Amniotic API
  LoadMouldingData(baseview) {
    this.chartinputservice.GetMouldingAnalytics(baseview).subscribe(data => {
      this.mouldingJsonData = data.data;
      this.CreateMouldingChart(this.mouldingJsonData);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.mouldingJsonData = [];
        this.CreateMouldingChart(this.mouldingJsonData);
      }

    );
  }

  // Render Amniotic chart
  CreateAmnioticChart(dataAmnioticArray: any) {
    // TFSID 16475 Rizwan Khan, 17 July 2020, Aplied active condition on JSON data
    const dataAmniotic: any = dataAmnioticArray;//.filter(u => u.active == '1');

    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // FetalHeartChartXYAxisRange.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;
    let element;
    element = this.chartAmnioticContainer.nativeElement;
    element.innerHTML = '';

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chart')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);


    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([AmnioticMouldingChartScale.MinXAxisTicks, AmnioticMouldingChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([AmnioticMouldingChartScale.MinYAxisTicks, AmnioticMouldingChartScale.MaxYAxisTicks])
      .range([this.chart.height, 0]);

    // create scales
    this.chart.xAxis = d3.axisBottom(this.chart.xScale).tickSizeInner(-this.chart.height)
      .tickSizeOuter(0)
      .tickPadding(this.chart.xAxistickPadding);

    this.chart.yAxis = d3.axisLeft(this.chart.yScale)
      .tickSizeInner(-this.chart.width)
      .tickSizeOuter(0)
      .tickPadding(this.chart.yAxistickPadding);

    svg.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0,${this.chart.height})`)
      // tslint:disable-next-line:variable-name
      .call(this.chart.xAxis.ticks(AmnioticMouldingChartScale.MaxXAxisTicks).tickFormat((domain, number) => {
        return '';
      }));

    svg.selectAll(".tick line").attr("stroke", "#C9C9C9");

    svg.append("g")
      .attr("class", "yaxis")
      .call(this.chart.yAxis.ticks(AmnioticMouldingChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
      }));

    svg.selectAll("g .yaxis .tick").attr("class", "chartleftseries");

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left + 95},${30})`)
      .attr('class', 'chartlabelname')
      .text('Amniotic');
    console.log(dataAmniotic)

    svg.selectAll("amnioticLables")
      .data(dataAmniotic)
      .enter()
      .append("text")
      .attr('x', d => this.chart.xScale((d.xAxisPosition)) + 44)
      // .attr("x", (d) => this.chart.xScale((d['xAxisPosition']))+44)
      .attr("y", (d) => (AmnioticMouldingChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom + 5) / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) { return d['chartValue'] })
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .attr('class', 'chartData')


  }

  // Render Moulding chart
  CreateMouldingChart(dataMouldingArray: any) {

    // TFSID 16475 Rizwan Khan, 17 July 2020, Aplied active condition on JSON data
    const dataMoulding: any = dataMouldingArray;//.filter(u => u.active == '1');

    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // FetalHeartChartXYAxisRange.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;
    let element;
    element = this.chartMouldingContainer.nativeElement;
    element.innerHTML = '';

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartV')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);


    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([AmnioticMouldingChartScale.MinXAxisTicks, AmnioticMouldingChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    const xScale = d3.scaleLinear()
      .domain([AmnioticMouldingChartScale.MinXAxisTicks, AmnioticMouldingChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([AmnioticMouldingChartScale.MinYAxisTicks, AmnioticMouldingChartScale.MaxYAxisTicks])
      .range([this.chart.height, 0]);

    // create scales
    this.chart.xAxis = d3.axisBottom(this.chart.xScale).tickSizeInner(-this.chart.height)
      .tickSizeOuter(0)
      .tickPadding(this.chart.xAxistickPadding);

    this.chart.yAxis = d3.axisLeft(this.chart.yScale)
      .tickSizeInner(-this.chart.width)
      .tickSizeOuter(0)
      .tickPadding(this.chart.yAxistickPadding);

    svg.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0,${this.chart.height})`)
      // tslint:disable-next-line:variable-name
      .call(this.chart.xAxis.ticks(AmnioticMouldingChartScale.MaxXAxisTicks).tickFormat((domain, number) => {
        return '';
      }));

    svg.selectAll(".tick line").attr("stroke", "#C9C9C9");
    // svg.selectAll(".xaxis .tick text").style("font-weight", "200").style("font-size", "6px");

    svg.append("g")
      .attr("class", "y axis")
      .call(this.chart.yAxis.ticks(AmnioticMouldingChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
        //if (number == 0)
        //return "Amniotic";
      }));

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left + 95},${30})`)
      .attr('class', 'chartlabelname')
      .text('Moulding');

    // TFSID 16637 Rizwan Khan 17 July 2020 ,Applie margin text value as per required text
    svg.selectAll("mouldingsLables")
      .data(dataMoulding)
      .enter()
      .append("text")
      .attr("x",
        function (d) {
          if (d['chartValue'] === '0') {
            return xScale((d['xAxisPosition'])) + 44
          }
          else {
            return xScale((d['xAxisPosition'])) + 35
          }
        }
        // (d) => this.chart.xScale((d['x'])) + 5
      )
      //(d) => this.chart.xScale((d['x'])) + 35)
      .attr("y", (d) => (AmnioticMouldingChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom + 5) / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) { return d['chartValue'] })
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

  // Open Modal Popup for Amniotic input
  openModalAmniotic(): void {

    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {
      this.modalPopupDatafor_Amniotic.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.modalPopupDatafor_Amniotic.currentTime = this.chartTimeCalculation.timeNow;
      this.modalPopupDatafor_Amniotic.inputBy = '';
      this.modalPopupDatafor_Amniotic.remarks = '';
      this.modalPopupDatafor_Amniotic.modelName = 'partographChart.Key_AmnioticChart'
      this.modalPopupDatafor_Amniotic.modelStagename = 'key_ActivePhase'
      this.modalPopupDatafor_Amniotic.stageId = 2;
      this.modalPopupDatafor_Amniotic.timeZone = this.chartTimeCalculation.timeZone;
      this.modalRef = this.modalService.open(AmnioticChartPopupComponent, { size: 'xl', backdrop: 'static' });

      this.modalRef.componentInstance.modalData = this.modalPopupDatafor_Amniotic;
      this.modalRef.result.then((result) => {
        //console.log(result);
      }).catch((result) => {
        console.log(result);
      });


      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

        // Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }


        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesId = 2;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.selectValue === 'I' ? '-' : receivedEntry.selectValue;;
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.xAxisInterval_Sys; //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = 0;
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);


        //this.inputChartServer = new ServerChartValues();
        //this.inputChartServer.ClientId = Number(this.currentUser.clientId);
        //this.inputChartServer.CreatedBy = this.currentUser.firstName + " " + this.currentUser.lastName;
        //this.inputChartServer.StagesID = 1;
        //this.inputChartServer.OrganizationId = 0;
        //this.inputChartServer.PaientId = 1;
        //this.inputChartServer.PartographId = 1;
        //this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone; 
        //this.inputChartServer.UpdatedBy = this.currentUser.firstName + " " + this.currentUser.lastName;
        //this.inputChartServer.ChartValue = receivedEntry.selectValue === 'I' ? '-' : receivedEntry.selectValue;
        //this.inputChartServer.X_axis_Position = this.chartTimeCalculation.xAxisInterval_Sys.toString(); //this.chartTimeCalculation.xAxisPulseBp.toString();
        //this.inputChartServer.Y_axis_Position = "0";
        //this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        //this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveAmnioticFluid(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadAmnioticData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.AMNIOTIC;
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
            this.amnioticJsonData = [];

            this.toastr.success("Error!");
          }
        );


      });

    }
    else {
      this.toastr.warning("Observation start time and current time exceed from 12 hours.");

    }

  }

  // Open Modal Popup for Moulding input
  openModalMoulding(): void {

    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {
      this.modalPopupDatafor_Moulding.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.modalPopupDatafor_Moulding.currentTime = this.chartTimeCalculation.timeNow;
      this.modalPopupDatafor_Moulding.inputBy = '';
      this.modalPopupDatafor_Moulding.remarks = '';
      this.modalPopupDatafor_Moulding.stageId = 2;
      this.modalPopupDatafor_Moulding.modelName = 'partographChart.Key_MouldingChart';
      this.modalPopupDatafor_Moulding.modelStagename = 'key_ActivePhase';
      this.modalPopupDatafor_Moulding.timeZone = this.chartTimeCalculation.timeZone;
      this.modalRef = this.modalService.open(MouldingChartPopupComponent, { size: 'xl', backdrop: 'static' });
      this.modalRef.componentInstance.modalData = this.modalPopupDatafor_Moulding;
      this.modalRef.result.then((result) => {
        //console.log(result);
        // console.log('closed');

      }).catch((result) => {
        //console.log(result);
        // console.log('cancelling');

      });


      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        // Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }

        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesId =2;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();

        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.selectValue.toString();
        this.inputChartServer.XAxisPosition = Number(this.chartTimeCalculation.xAxisInterval_Sys); //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = 0;
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveMoulding(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadMouldingData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.MOULDING;
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
            this.mouldingJsonData = [];

            this.toastr.success("Error!");
          }
        );



      });

    }



  }

}
//TFS ID: 16003

