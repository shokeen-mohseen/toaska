
//16696 Task Latent Phase - Remove duplicate code from chart design.

//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16694
//Logic Description: This is Fetal Heart chart plotting logic

import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../../modal-content/heart-rate/modal-content.component';
import { XAxisTimeConversionService } from '@app/shared/services/xaxis-chart.services';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { SVGChart, FetalHeartChartModalPopup, FetalHeartChartXYAxisRange } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@app/shared/services';
import { Subscription } from 'rxjs';
import { FetalHeartAlertPopupComponent } from '../../modal-content/fetal-heart.alert.popup/fetal-heart.alert.popup.component';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '@app/core/services/alert.service';
import { AuthService, User, JsonApiService } from '@app/core';
import { AlertSystem } from '@app/core/models/d3chart/alert.model';
import { ServerChartValues, ServerChartCommonComment } from '@app/modules/manage-partograph/modals/input-chart';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-fetal-heart-active-phase-linechart',
  templateUrl: './fetal-heart-active-phase-linechart.component.html',
  styleUrls: ['./fetal-heart-active-phase-linechart.component.css'],
})

export class FetalHeartActivePhaseLinechartComponent implements OnInit {
  baseGraphViewModel: BaseChartViewModel;
  inputChartServer: ServerChartValues;
  subscriptionTime: Subscription;
  @ViewChild('chart', { static: true }) chartContainer: ElementRef;
  @ViewChild('spanNote', { static: true }) SpanContainer: ElementRef;
  public chart: SVGChart;
  modalPopupData: FetalHeartChartModalPopup;
  fetalHeart: FetalAlertModel;
  modalRef: NgbModalRef; currentUser: User;
  chartTimeCalculation: ChartTimeConversionXAxis;
  isTimeExceed = 0; subscription: Subscription;
  alertMessage: boolean; public previousNotification = 0;
  alertText = ''; heartInputValue = 0;
  public HeartRateList: any = []; clientPath: string; clientAlert: string;
  alerttype: any; alertmes: any;
  alertobj: AlertSystem; objAlertCondition: any = [];
  previousAlert: any = [];
  Timemessage: string;
  arrBirds: string[];

  @Output() notificationEmitter = new EventEmitter<string>();
  constructor(private chartinputservice: ChartInputService, private jsonService: JsonApiService, private authenticationService: AuthService,
               private toastr: ToastrService, private data: DataService, public translate: TranslateService, public modalService: NgbModal,
    public timeConverService: XAxisTimeConversionService) {

    //this.baseGraphViewModel = new BaseChartViewModel();
    //this.initilasizePageLevelPropertiesBaseViewModel();
    this.chart = new SVGChart();
    this.modalPopupData = new FetalHeartChartModalPopup();
    this.fetalHeart = new FetalAlertModel();
    this.alertMessage = false;
    this.alertobj = new AlertSystem();
    this.currentUser = this.authenticationService.currentUserValue;
    this.clientPath = this.currentUser.path;
    this.clientAlert = this.currentUser.alert;
    this.GetAlertConditionList();

    this.baseGraphViewModel = new BaseChartViewModel();
    this.baseGraphViewModel.StagesId = 2;
    this.baseGraphViewModel.PatientId = ServerChartValues.GetPatientId();
    this.baseGraphViewModel.PartographId = ServerChartValues.GetPartpgraphId();
    this.baseGraphViewModel.ClientId = this.currentUser.ClientId;
    this.baseGraphViewModel.CreatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.SourceSystemID = 1;
    this.baseGraphViewModel.UpdateDateTimeBrowser = new Date();

  }

  //initilasizePageLevelPropertiesBaseViewModel() {
  //  this.baseGraphViewModel.StagesId = 2;
  //  this.baseGraphViewModel.PatientId = 1014;
  //  this.baseGraphViewModel.PartographId = 1005;
  //}

  // TFSID 16755 RIZWAN KHAN 14 july 2020 Get client specific alert list service from JSON temp file.
  public GetAlertConditionList() {
    this.jsonService.GetProjectConfigurationList(this.clientPath, this.clientAlert).subscribe(data => {
      this.objAlertCondition = data
      
    });
       

  }
   

  ngOnInit(): void {
    this.LoadFetalHeartRateData(this.baseGraphViewModel);
    
  }
  
  // Plotting chart here
  createChart(dataset: any) {

    d3.select('body').append("text")
      .classed('chart-tooltip', true)
      .style('display', 'none');

    let element;
    element = this.chartContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
     // FetalHeartChartXYAxisRange.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartHeart')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    //var tooltip = d3.select("#d3chartHeart").append("div")
    //  .attr("class", "tooltip")
    //  .style("opacity", 0);

      // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([FetalHeartChartXYAxisRange.MinXAxisTicks, FetalHeartChartXYAxisRange.MaxXAxisTicks])
      .range([0, this.chart.width]);

    const xScale = d3.scaleLinear()
      .domain([FetalHeartChartXYAxisRange.MinXAxisTicks, FetalHeartChartXYAxisRange.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([FetalHeartChartXYAxisRange.MinYAxisTicks, FetalHeartChartXYAxisRange.MaxYAxisTicks])
      .range([this.chart.height, 0]);

    const  yScale= d3.scaleLinear()
      .domain([FetalHeartChartXYAxisRange.MinYAxisTicks, FetalHeartChartXYAxisRange.MaxYAxisTicks])
     
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
      .call(this.chart.xAxis.ticks(FetalHeartChartXYAxisRange.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return ``;
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');
   // svg.selectAll('.xaxis .tick text').attr("class", "chartleftseries");
   
    svg.append('g')
        .attr('class', 'yaxis')
        .call(this.chart.yAxis);

    svg.selectAll("g .yaxis .tick").attr("class", "chartleftseries");

    // TFSID 16335 Rizwan Khan 8 june text rotate 
     svg.append('text')
      .attr('text-anchor', 'start')
      .attr('y', -55)
       .attr('x', -this.chart.margin.left-175)
      .attr('class', 'chartlabelname')
      .attr('transform', 'rotate(-90)')
      .text('Fetal Heart Rate');
    
    //svg.append('text')
    //  .attr("transform", `translate(${-this.chart.margin.left},${100})`)
    //  .attr('class', 'chartlabelname')
    //  .text('Fetal Heart Rate');
    
    var line = d3.line()
      .x(function (d) { return xScale(d.xAxisPosition); })
      .y(function (d) {
       // console.log(d.y);
        return yScale(d.yAxisPosition);
      })
      

      // d => this.chart.yScale(d['y']));

    svg.append('path')
        .datum(dataset)
        .attr('class', 'data-line glowed')
        .style('stroke', 'black')
        .style('stroke-width', FetalHeartChartXYAxisRange.LineWidth)
        .style('fill', 'none')
        .attr('d', line);
    var focus;
    const circles = svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr("class", "overlay")
      // tslint:disable-next-line:no-string-literal
      .attr('cx', (d, i) => this.chart.xScale((d['xAxisPosition'])))
      .attr('cy', d => this.chart.yScale((d.yAxisPosition)))
      .attr('r', FetalHeartChartXYAxisRange.CirclePointOnLine)
      .style('fill', 'black')
      .style('stroke', 'black')
      .style('stroke-width', 4);
      

    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    }
  }

  GetChartDomainOnXAxis(): any{
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }

  GetChartDomainOnYAxis(): any{
    return FetalHeartChartXYAxisRange.Hieght - this.chart.margin.top - this.chart.margin.bottom;
  }

    // Open chart popup 
  openModal() {
   
    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.subscriptionTime = this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {

      // TFSID 16635 Rizwan Khan , 27 july 2020, add Current time with time zone
      this.modalPopupData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.modalPopupData.yAxisPosition = 0;
      this.modalPopupData.inputBy = '';
      this.modalPopupData.remarks = '';
      this.modalPopupData.stageId = 2;
      this.modalPopupData.modelName = 'partographChart.Key_FetalHeartChart'
      this.modalPopupData.modelStagename = 'key_ActivePhase'
      this.modalPopupData.timeZone = this.chartTimeCalculation.timeZone;
      this.modalRef = this.modalService.open(ModalContentComponent, { size: 'xl', backdrop: 'static' });
      this.modalRef.componentInstance.modalData = this.modalPopupData;
      this.modalRef.result.then((result) => {
        }).catch((result) => {
        });
     
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {


        // Implement logic for start time globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
           this.data.IsTimeEnable(true);
        }

        //if (localStorage.getItem('HeartRateData') === undefined || localStorage.getItem('HeartRateData') == null) {
        //  localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
        //  // TFSID 16936 Rizwan khan, 23 July 2020, Send notification to data services for isplay the time series
          
        //}
        //if (localStorage.getItem('HeartRateData')) {
        //    HeartRateList = localStorage.getItem('HeartRateData');
        //}
        
        // TFSID 16635 Rizwan Khan 7 june 2020 Set alert notification here on specifie condition
        this.heartInputValue = receivedEntry.yAxisPosition;

        //this.alertText = receivedEntry.yAxisPosition <= 100 ? 'High alert' :
        //  receivedEntry.yAxisPosition > 100 && receivedEntry.yAxisPosition <= 110 ? 'Medium alert' :
        //    receivedEntry.yAxisPosition > 140 && receivedEntry.yAxisPosition < 160 ? 'Medium alert' :
        //      receivedEntry.yAxisPosition > 160 ? 'High alert' : '';


        this.previousNotification = this.data.TotalPreviousAlertCount;

        if (this.previousNotification == undefined || this.previousNotification == null) {
          this.previousNotification = 0;
        }

        //if (receivedEntry.yAxisPosition < parseInt(this.objAlertCondition.FetalHeartAlertMessage.AlertLessThan110 != undefined ? this.objAlertCondition.FetalHeartAlertMessage.AlertLessThan110 : '110') && receivedEntry.yAxisPosition >= parseInt(this.objAlertCondition.FetalHeartAlertMessage.AlertLessThan100 != undefined ? this.objAlertCondition.FetalHeartAlertMessage.AlertLessThan100 : '100')) {
        //  this.modalRef = this.modalService.open(FetalHeartAlertPopupComponent, { size: 'md', backdrop: 'static' });
        //  this.fetalHeart.alertMessage = 'partographChart.key_FetalHeartAlertMessageLessThan110'
        //  this.fetalHeart.alertType = 'partographChart.Key_FetalHeartAlertTypeLessThan110';
        //  this.fetalHeart.alertColor = '#FB9A5B'
        //  this.previousNotification = this.previousNotification + 1;
        //  this.data.sendMessage(this.previousNotification.toString());
        //  this.modalRef.componentInstance.modalAlertData = this.fetalHeart;
        //  localStorage.setItem("AlertCounter", this.previousNotification.toString());
        //  this.SaveAlert(receivedEntry.yAxisPosition,'MA');
          
        //}

        //else if (receivedEntry.yAxisPosition < parseInt(this.objAlertCondition.FetalHeartAlertMessage.AlertLessThan100 != undefined ? this.objAlertCondition.FetalHeartAlertMessage.AlertLessThan100 : '100')) {
        //  this.modalRef = this.modalService.open(FetalHeartAlertPopupComponent, { size: 'md', backdrop: 'static' });
        //  this.fetalHeart.alertMessage = 'partographChart.key_FetalHeartAlertMessageLessThan100'
        //  this.fetalHeart.alertType = 'partographChart.Key_FetalHeartAlertTypeLessThan100';
        //  this.fetalHeart.alertColor = '#ff0000'
        //  this.previousNotification = this.previousNotification + 1;
        //  this.data.sendMessage(this.previousNotification.toString());
        //  this.modalRef.componentInstance.modalAlertData = this.fetalHeart;
        //  localStorage.setItem("AlertCounter", this.previousNotification.toString());
        //  this.SaveAlert(receivedEntry.yAxisPosition,'HA');
        //}

        //else if (receivedEntry.yAxisPosition > parseInt(this.objAlertCondition.FetalHeartAlertMessage.AlertGreaterThan140 != undefined ? this.objAlertCondition.FetalHeartAlertMessage.AlertGreaterThan140 : '140') && receivedEntry.yAxisPosition <= parseInt(this.objAlertCondition.FetalHeartAlertMessage.AlertGreaterThan160 != undefined ? this.objAlertCondition.FetalHeartAlertMessage.AlertGreaterThan160: '160')) {
        //  this.modalRef = this.modalService.open(FetalHeartAlertPopupComponent, { size: 'md', backdrop: 'static' });
        //  this.fetalHeart.alertMessage = 'partographChart.key_FetalHeartAlertMessageGreaterThan140'
        //  this.fetalHeart.alertType = 'partographChart.Key_FetalHeartAlertTypeGreaterThan140';
        //  this.fetalHeart.alertColor = '#FB9A5B'
        //  this.previousNotification = this.previousNotification + 1;
        //  this.data.sendMessage(this.previousNotification.toString());
        //  this.modalRef.componentInstance.modalAlertData = this.fetalHeart;
        //  localStorage.setItem("AlertCounter", this.previousNotification.toString());
        //  this.SaveAlert(receivedEntry.yAxisPosition,'MA');
        //}

        //else if (receivedEntry.yAxisPosition > parseInt(this.objAlertCondition.FetalHeartAlertMessage.AlertGreaterThan160 != undefined ? this.objAlertCondition.FetalHeartAlertMessage.AlertGreaterThan160 : '160')) {
        //  this.modalRef = this.modalService.open(FetalHeartAlertPopupComponent, { size: 'md', backdrop: 'static' });
        //  this.fetalHeart.alertMessage = 'partographChart.key_FetalHeartAlertMessageGreaterThan160'
        //  this.fetalHeart.alertType = 'partographChart.Key_FetalHeartAlertTypeGreaterThan160';
        //  this.fetalHeart.alertColor = '#ff0000'
        //  this.previousNotification = this.previousNotification + 1;
        //  this.data.sendMessage(this.previousNotification.toString());
        //  this.modalRef.componentInstance.modalAlertData = this.fetalHeart;
        //  localStorage.setItem("AlertCounter", this.previousNotification.toString());
        //  this.SaveAlert(receivedEntry.yAxisPosition,'HA');
        //}


        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 2;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone; 
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = this.chartTimeCalculation.xAxisPosition.toString();
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.xAxisPosition; //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = Number(receivedEntry.yAxisPosition);
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
       
        this.chartinputservice.SaveFetalHeartRate(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadFetalHeartRateData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.FETAL_HEART_RATE;
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
            this.HeartRateList = [];

            this.toastr.success("Error!");
          }
        );

      });
    }
    else
    {
      this.toastr.warning("Observation start time and current time exceed from 12 hours.");
      // alert('Observation start time and current time exceed from 12 hours.');
    }
    this.subscriptionTime.unsubscribe();
  }
  // Fetal Heart API
  LoadFetalHeartRateData(baseGraphViewModel) {
    this.chartinputservice.GetFetalHeartRateAnalytics(baseGraphViewModel).subscribe(data => {
      this.HeartRateList = data.data;
      this.createChart(this.HeartRateList);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.HeartRateList = [];
        this.createChart(this.HeartRateList);
      }

    );
  }

  ClearHtml() {
    this.alertMessage = false;
    this.alertText = ''
  }

  SaveAlert(yAxisPosition,alertType) {
    let data; data = []; let arrayList = [];
    let oldData = []; let previousAlert = '';
    let dataArray;
    dataArray = {};

    if (localStorage.getItem('AlertMessageList')) {
      previousAlert = localStorage.getItem('AlertMessageList');
      arrayList.push(localStorage.getItem('AlertMessageList'));

    }

    // TFSID 16745 Rizwan Khan 15 July 2020, Add alert type like Medium alert , High Alert Icon
    dataArray = {
      AlertId: arrayList.length+1,
      UserId: this.currentUser.id,
      UserName: this.currentUser.username,
      InputValue: yAxisPosition,
      AlertMessageKey: 'partographChart.key_FetalHeartAlertMessageLessThan110',
      AlertTypeKey: 'partographChart.Key_FetalHeartAlertTypeLessThan110',
      ActualTime: this.chartTimeCalculation.timeNow,
      CreatedDate: this.chartTimeCalculation.observationStartTime,
      Path: 'Latent Phase',
      ChartName: 'Fetal Heart Rate',
      AlertType: alertType
    }

    data.push(
      dataArray
    );

    
    
    if (previousAlert.length > 0) {
      oldData = JSON.parse(previousAlert);
      oldData.push(dataArray);
      localStorage.setItem('AlertMessageList', JSON.stringify(oldData));
    }
    else {
      localStorage.setItem('AlertMessageList', JSON.stringify(data));
    }

  }

}

export class FetalAlertModel {

  alertType: string;
  alertMessage: string;
  alertColor: string;

}

//TFS ID: 16694
