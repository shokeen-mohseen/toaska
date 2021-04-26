//Developer Name: Rizwan Khan
//Date: Aug 6, 2020
//TFS ID: 17033
//Logic Description: Secong Stage - Remove cervix chart. Descent of head will remain.

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { XAxisTimeConversionService } from '@app/shared/services/xaxis-chart.services';
import { SVGChart, CervixChartModalPopup, DescentChartModalPopup, CervixDescentChartXYAxisRange, CervixDescentChartWrapper } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { CervixDescentModalPopUpComponent } from '../../modal-content/cervix-descent.chart.popup/cervix-descent.chart.popup.component';
import { DataService } from '@app/shared/services';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { ServerChartValues, ServerChartCommonComment } from '@app/modules/manage-partograph/modals/input-chart';
import { User, AuthService } from '@app/core';
import { ToastrService } from 'ngx-toastr';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';


@Component({
  selector: 'app-cervix-descent-second-phase',
  templateUrl: './cervix-descent-second-phase.component.html',
  styleUrls: ['./cervix-descent-second-phase.component.css']
})
export class CervixDescentSecondPhaseComponent implements OnInit {
  @ViewChild('cervixchart', { static: true }) chartContainer: ElementRef;
  CervixData: any = []; DescentData: any = [];
  cervixData: CervixChartModalPopup; descentData: DescentChartModalPopup;
  public chart: SVGChart; modalRef: NgbModalRef; modalPopupData: CervixDescentChartWrapper;
  chartTimeCalculation: ChartTimeConversionXAxis; chartMode: string; currentUser: User;
  baseGraphViewModel: BaseChartViewModel; inputChartServer: ServerChartValues;
  constructor(private chartinputservice: ChartInputService, private toastr: ToastrService,private authenticationService: AuthService,private data: DataService, public modalService: NgbModal,
    public timeConverService: XAxisTimeConversionService) {
    this.chart = new SVGChart();
    this.cervixData = new CervixChartModalPopup();
    this.descentData = new DescentChartModalPopup();
    this.modalPopupData = new CervixDescentChartWrapper();
    this.currentUser = this.authenticationService.currentUserValue;

    this.baseGraphViewModel = new BaseChartViewModel();
    this.baseGraphViewModel.StagesId = 3;
    this.baseGraphViewModel.PatientId = ServerChartValues.GetPatientId();
    this.baseGraphViewModel.PartographId = ServerChartValues.GetPartpgraphId();
    this.baseGraphViewModel.ClientId = this.currentUser.ClientId;
    this.baseGraphViewModel.CreatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdateDateTimeBrowser = new Date();
    this.baseGraphViewModel.PageNo = 1;
    this.baseGraphViewModel.PageSize = 100;

  }

  ngOnInit(): void {

    this.LoadChartData(this.baseGraphViewModel);
    //if (localStorage.getItem('DescentData')) {
    //  this.DescentData = JSON.parse(localStorage.getItem('DescentData'));
    //}
    //this.createChart(this.DescentData);
  }

  // Create Chart Logic 

  createChart(DescentDataset: any) {

    let element;
    element = this.chartContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartCervixDescent')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([CervixDescentChartXYAxisRange.MinXAxisTicks, CervixDescentChartXYAxisRange.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([CervixDescentChartXYAxisRange.MinYAxisTicks, CervixDescentChartXYAxisRange.MaxYAxisTicks])
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
      .call(this.chart.xAxis.ticks(CervixDescentChartXYAxisRange.MaxXAxisTicks).tickFormat((domain, number) => {
        return '';
      }));

    svg.selectAll(".tick line").attr("stroke", "#bbb");

    svg.append('g')
      .attr('class', 'yaxis')
      .call(this.chart.yAxis);

    svg.selectAll("g .yaxis .tick").attr("class", "chartleftseries");

    // draw Cervix Line outside of chart
    //this.DrawCervixExternalLine(svg);
    // draw Descent Line Outside of Chart
    this.DrawDescentExternalLine(svg);

    svg.append('text')
      .attr('text-anchor', 'start')
      .attr('class', 'chartlabelname')
      .attr('transform', `translate(${-this.chart.margin.left + 80},320) rotate(-90)`)
      .text('Descent of head');
           
    const lineCervix = d3.line()
      .x((d, i) => this.chart.xScale(d.xAxisPosition))
      .y(d => this.chart.yScale(d.yAxisPosition));

    // line plot
      // draw line
    const lineDescent = d3.line()
      .x((d, i) => this.chart.xScale(d.xAxisPosition))
      .y(d => this.chart.yScale(d.yAxisPosition));

    svg.append('path')
      .datum(DescentDataset)
      .attr('class', 'data-line glowed')
      .style('stroke', 'orange')
      .style('stroke-width', CervixDescentChartXYAxisRange.InsideLineChartWidth)
      .style('fill', 'none')
      .attr('d', lineDescent);

   
    const circlesDescent = svg.selectAll('s')
      .data(DescentDataset)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('cx', (d, i) => this.chart.xScale((d.xAxisPosition)))
      .attr('cy', d => this.chart.yScale((d.yAxisPosition)))
      .attr('r', CervixDescentChartXYAxisRange.CirclePointOnLine)
      .style('fill', 'orange')
      .style('stroke', 'orange')
      .style('stroke-width', CervixDescentChartXYAxisRange.circlePointWidth)

  }

  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }

  GetChartDomainOnYAxis(): any {
    return CervixDescentChartXYAxisRange.Height - this.chart.margin.top - this.chart.margin.bottom;
  }

  // Green Areas
  DrawGreenAreaOnChart(svg: any): void {
    //for (let i = 0; i < CervixDescentChartXYAxisRange.GreenChartAreaMax; i++) {
    //  svg.append('line')
    //    .attr('x1', 0)
    //    .attr('y1', CervixDescentChartXYAxisRange.GreenChartAreaMax - i)
    //    .attr('x2', CervixDescentChartXYAxisRange.GreenChartAreaLineInLoopY1 - i)
    //    .attr('y2', 1)
    //    .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
    //    .attr('stroke', '#CDEFD5')
    //    .attr('fill', 'transparent')
    //    .attr('opacity', '.5');
    //}
    svg.append('line')
      .attr('x1', 828)
      .attr('y1', 240)
      .attr('x2', 0)
      .attr('y2', 339)
      .attr('stroke-width', 2)
      .attr('stroke', 'black');

  }

  DrawRedAreaOnChart(svg: any): void {

    //var element = d3.select('#d3chartCervixDescent .xaxis').node();
    //alert(element.getBoundingClientRect().width);


    for (let i = 0; i < CervixDescentChartXYAxisRange.GreenChartAreaMax; i++) {
      let svgredColor1;
      svgredColor1 = svg.append('line');
      svgredColor1
        .attr('x1', (this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right)) //CervixDescentChartXYAxisRange.RedAreaLineInLoopX1 - 20
        .attr('y1', i + 1)
        .attr('x2', ((this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right) * 8 / 24)) /// 4) - (this.chart.margin.right+) + this.chart.margin.left )//CervixDescentChartXYAxisRange.RedAreaLineInLoopX2
        .attr('y2', CervixDescentChartXYAxisRange.GreenChartAreaMax)
        .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
        .attr('stroke', '#FBDBE1')
        .attr('fill', 'transparent')
        .attr('opacity', '.7');
    }

    for (let i = 0; i < CervixDescentChartXYAxisRange.RedChartAreaMax; i++) {
      svg.append('line')
        .attr('x1', CervixDescentChartXYAxisRange.RedAreaLineInLoopX1 - i)
        .attr('y1', 1)
        .attr('x2', ((this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right) * 8 / 24))
        .attr('y2', CervixDescentChartXYAxisRange.GreenChartAreaMax)
        .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
        .attr('stroke', '#FBDBE1')
        .attr('fill', 'transparent')
        .attr('opacity', '.2');
    }

    svg.append('line')
      .attr('x1', (((this.chart.globalwidth - this.chart.margin.left) * 20 / 24) - this.chart.margin.right + 5))
      .attr('y1', 1)
      .attr('x2', ((this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right) * 8 / 24))
      .attr('y2', CervixDescentChartXYAxisRange.GreenChartAreaMax)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');
  }

  DrawYellowAreaOnChart(svg: any): void {
    for (let i = 0; i < CervixDescentChartXYAxisRange.YellowLineAreaMax; i++) {
      svg.append('line').attr('x1', 1052 - i)
        .attr('y1', 1)
        .attr('x2', CervixDescentChartXYAxisRange.YellowLineAreaMax - i)
        .attr('y2', CervixDescentChartXYAxisRange.GreenChartAreaMax)
        .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
        .attr('stroke', '#F8F7A6')
        .attr('fill', 'transparent')
        .attr('opacity', '.4');
    }
  }

  DrawCervixExternalLine(svg: any) {
    // plot vertical bottom main line cervix
    svg.append('line')
      .attr("transform", `translate(${-this.chart.margin.left},${185})`)
      .attr('x1', CervixDescentChartXYAxisRange.CervixVerticalX1)
      .attr('y1', CervixDescentChartXYAxisRange.CervixVerticalY1 + 22)
      .attr('x2', CervixDescentChartXYAxisRange.CervixVerticalX2)
      .attr('y2', CervixDescentChartXYAxisRange.CervixVerticalY2)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');

    // plot horizontal bottom base line cervix
    svg.append('line')
      //.attr('transform', 'translate(-75, 185)')
      .attr("transform", `translate(${-this.chart.margin.left + 30},${185})`)
      .attr('x1', CervixDescentChartXYAxisRange.CervixHorizontalX1)
      .attr('y1', CervixDescentChartXYAxisRange.CervixHorizontalY1)
      .attr('x2', CervixDescentChartXYAxisRange.CervixHorizontalX2)
      .attr('y2', CervixDescentChartXYAxisRange.CervixHorizontalY2)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');

    // plot vertical top line cervix
    svg.append('line')
      .attr("transform", `translate(${-this.chart.margin.left},${185})`)
      .attr('x1', CervixDescentChartXYAxisRange.CervixVerticalX1)
      .attr('y1', CervixDescentChartXYAxisRange.CervixVerticalTopY1)
      .attr('x2', CervixDescentChartXYAxisRange.CervixVerticalX2)
      .attr('y2', CervixDescentChartXYAxisRange.CervixVerticalTopY2 + 12)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');

    // plot horizontal top base line cervix
    svg.append('line')
      .attr("transform", `translate(${-this.chart.margin.left + 30},${185})`)
      .attr('x1', CervixDescentChartXYAxisRange.CervixHorizontalX1)
      .attr('y1', CervixDescentChartXYAxisRange.CervixVerticalTopBaseY1)
      .attr('x2', CervixDescentChartXYAxisRange.CervixHorizontalX2)
      .attr('y2', CervixDescentChartXYAxisRange.CervixVerticalTopBaseY2)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');
  }
  DrawDescentExternalLine(svg: any) {
    // plot base vertical line descent
    svg.append('line')
      .attr("transform", `translate(${-this.chart.margin.left + 8},${235})`)
      .attr('x1', CervixDescentChartXYAxisRange.DrawVDescentX1)
      .attr('y1', 87)
      .attr('x2', CervixDescentChartXYAxisRange.DrawVDescentX2)
      .attr('y2', CervixDescentChartXYAxisRange.DrawVDescentY2)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');


    // horizontal base bottom line Descent
    svg.append('line')
      .attr("transform", `translate(${-this.chart.margin.left + 12},${235})`)
      .attr('x1', 45)
      .attr('y1', CervixDescentChartXYAxisRange.DrawHDescentY1)
      .attr('x2', 75)
      .attr('y2', CervixDescentChartXYAxisRange.DrawHDescentY2)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');

    // vertical bottom line Descent
    svg.append('line')
      .attr("transform", `translate(${-this.chart.margin.left + 20},${215})`)
      .attr('x1', 55)
      .attr('y1', -32)
      .attr('x2', 55)
      .attr('y2', -49)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');

    // plot horizontal base top line Descent
    svg.append('line')
      .attr("transform", `translate(${-this.chart.margin.left + 15},${220})`)
      .attr('x1', 45)
      .attr('y1', -55)
      .attr('x2', 75)
      .attr('y2', -55)
      .attr('stroke-width', CervixDescentChartXYAxisRange.LineWidth)
      .attr('stroke', 'black');

  }

  // Open Modal Popup

  openModal(mode: string) {
    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {
      this.cervixData.currentTime = this.chartTimeCalculation.timeNow;
      this.cervixData.yAxisPosition = 0;
      this.cervixData.inputBy = 'N';
      this.cervixData.remarks = '';
      this.descentData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.descentData.timeZone = this.chartTimeCalculation.timeZone;
      this.descentData.currentTime = this.chartTimeCalculation.timeNow;
      this.descentData.yAxisPosition = 0;
      this.descentData.inputBy = 'N';
      this.descentData.remarks = '';
      this.cervixData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.cervixData.timeZone = this.chartTimeCalculation.timeZone;

      this.modalPopupData.cervixModal = this.cervixData;

      this.modalPopupData.descentModal = this.descentData;
      this.modalPopupData.stageId = 3;
      //this.modalPopupData.modelName = 'partographChart.Key_ContractionChart';
      this.modalPopupData.modelStagename = 'key_SecondStageLabour';
     // this.modalPopupData.stageId = 3;
      this.modalRef = this.modalService.open(CervixDescentModalPopUpComponent, { size: 'xl', backdrop: 'static' });
      this.modalRef.componentInstance.modalData = this.modalPopupData;
      this.modalRef.result.then((result) => {
        //console.log(result);
        console.log('closed');

      }).catch((result) => {
        console.log(result);
        console.log('cancelling');

      });


      this.modalRef.componentInstance.passBackDescent.subscribe((receivedEntry) => {

        // Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }

        console.log(JSON.stringify(receivedEntry))
        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 3;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.yAxisPosition1.toString();
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.xCervixTime; //this.chartTimeCalculation.xAxisPulseBp.toString();

        this.inputChartServer.YAxisPosition = Number(receivedEntry.yAxisPosition1);
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveDescentofHead(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadChartData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");
              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.DESCENT_OF_HEAD;
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
            this.CervixData = [];
            this.DescentData = [];
            this.toastr.success("Error!");
          }
        );


      });

    }
    else {
      this.toastr.error('Observation start time and current time exceed from 12 hours.');
    }

  }

  LoadChartData(baseView) {
    this.chartinputservice.GetDecentofHeadAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.DescentData = data.data;
      }
      this.createChart(this.DescentData);
    })

  }

  //openModal(mode: string) {
  //  this.chartTimeCalculation = new ChartTimeConversionXAxis();

  //  this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
  //    .subscribe(timeserv => this.chartTimeCalculation = timeserv);

  //  // call when hours not exceed from 12 hours
  //  if (this.chartTimeCalculation.isTimeExceed === 0) {
  //    this.cervixData.currentTime = this.chartTimeCalculation.timeNow;
  //    this.cervixData.yAxisPosition = 0;
  //    this.cervixData.inputBy = 'N';
  //    this.cervixData.remarks = '';
  //    this.descentData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
  //    this.descentData.timeZone = this.chartTimeCalculation.timeZone;
  //    this.descentData.currentTime = this.chartTimeCalculation.timeNow;
  //    this.descentData.yAxisPosition = 0;
  //    this.descentData.inputBy = 'N';
  //    this.descentData.remarks = '';
  //    this.cervixData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
  //    this.cervixData.timeZone = this.chartTimeCalculation.timeZone;
     
  //    this.modalPopupData.cervixModal = this.cervixData;

  //    this.modalPopupData.descentModal = this.descentData;
  //    this.modalPopupData.stageId = 3;
  //    //this.modalPopupDatafor_Amniotic.modelName = 'partographChart.Key_AmnioticChart'
  //    this.modalPopupData.modelStagename = 'key_SecondStageLabour'
  //    //this.modalPopupData.modelStagename = 'key_ActivePhase';
  //    this.modalRef = this.modalService.open(CervixDescentModalPopUpComponent, { size: 'xl', backdrop: 'static' });
  //    this.modalRef.componentInstance.modalData = this.modalPopupData;
  //    this.modalRef.result.then((result) => {
  //      //console.log(result);
  //      console.log('closed');

  //    }).catch((result) => {
  //      console.log(result);
  //      console.log('cancelling');

  //    });

  //    let data;
  //    data = [];
  //    let dataArray;
  //    dataArray = {};
  //    let CervixData = ''; let DescentData = ''; let value = 0; let inputBy; let comments;

  //    this.modalRef.componentInstance.passBackDescent.subscribe((receivedEntry) => {

  //      // Implement logic for start time display globally
  //      if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
  //        localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
  //        this.data.IsTimeEnable(true);
  //      }

  //      if (localStorage.getItem('DescentData')) {
  //        DescentData = localStorage.getItem('DescentData');
  //      }

  //      value = receivedEntry.yAxisPosition;
  //      inputBy = receivedEntry.inputBy;
  //      comments = receivedEntry.remarks;

  //      dataArray = {
  //        x: this.chartTimeCalculation.xCervixTime, y: value,
  //        ObservationStartTime: this.chartTimeCalculation.TestingStartdate,
  //        CurrentTime: this.chartTimeCalculation.observationStartTime,
  //        comment: comments, inputby: inputBy
  //      };

  //      data.push(
  //        dataArray
  //      );

  //      if (DescentData.length > 0) {
  //        let oldData = [];
  //        oldData = JSON.parse(DescentData);
  //        oldData.push(dataArray);
  //        localStorage.setItem('DescentData', JSON.stringify(oldData));
  //      }
  //      else {
  //        localStorage.setItem('DescentData', JSON.stringify(data));
  //      }

  //      DescentData = localStorage.getItem('DescentData');
        
  //      this.createChart(DescentData.length > 0 ? JSON.parse(DescentData) : DescentData);


  //    });

  //  }
  //  else {
  //    alert('Observation start time and current time exceed from 12 hours.');
  //  }

  //}

}

//TFS ID: 16694

