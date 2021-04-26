//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16474
//Logic Description: This is Contraction chart plotting
//                   Secondstage Phase: Contraction Chart: Merge chart in Lamps 3.0

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { XAxisTimeConversionService } from '@app/shared/services/xaxis-chart.services';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { SVGChart, ContractionModalData, ContractionChartScale } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { ContractionModalPopUpComponent } from '../../modal-content/contraction.chart.popup/contraction.chart.popup.component';
import { AuthService, User } from '@app/core';
import { DataService } from '@app/shared/services';
import { ServerChartValues, ServerChartCommonComment } from '@app/modules/manage-partograph/modals/input-chart';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { ToastrService } from 'ngx-toastr';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';


@Component({
  selector: 'app-contractions-second-stage-chart',
  templateUrl: './contractions-second-stage-chart.component.html',
  styleUrls: ['./contractions-second-stage-chart.component.css']
})
export class ContractionsSecondStageChartComponent implements OnInit {
  inputChartServer: ServerChartValues; baseGraphViewModel: BaseChartViewModel;
  @ViewChild('chart', { static: true }) chartContainer: ElementRef;
  public chart: SVGChart;
  modalPopupData: ContractionModalData;
  modalRef: NgbModalRef;
  chartTimeCalculation: ChartTimeConversionXAxis;
  // tslint:disable-next-line:variable-name
  operator_mode: string;
  isTimeExceed = 0; currentUser: User;
  public ContractionData: any = [];
  constructor(private chartinputservice: ChartInputService, private toastr: ToastrService, private data: DataService, private authenticationService: AuthService, public modalService: NgbModal,
    public timeConverService: XAxisTimeConversionService) {
    this.chart = new SVGChart();
    this.modalPopupData = new ContractionModalData();
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
    //if (localStorage.getItem('ContractionData')) {
    //  this.ContractionData = JSON.parse(localStorage.getItem('ContractionData'));
    //}

    this.LoadContractionData(this.baseGraphViewModel);
    //this.CreateChart(this.ContractionData);

  }
  // chart plot area

  CreateChart(DataListArray: any) {
    const DataList: any = DataListArray; //.filter(u => u.active == '1');
    let element;
    element = this.chartContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // FetalHeartChartXYAxisRange.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // Developer Name: Rizwan Khan
    // Date: June 6, 2020
    // TFS ID: 16694
    // Logic Description: Make the graph responsive by using viewBox attribute

    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartContraction')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    // TFSID 16970, Rizwan khan , 28 july 2020, Start from 1 cell


    // TFSID 17030, Rizwan khan , 28 july 2020, Add legend on chart
    var keys = ["< 20", "20 - 40", "> 40"];

    // Usually you have a color scale in your chart already
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(['#FEC8C5', '#EAEA98', '#A6BEA6']);

    svg.append("rect")
      .attr("x", 1035)
      .attr("y", 1)
      .attr("width", 205)
      .attr("height", 84)
      .attr("stroke", "black")
      .style("fill", "#FBFACA")

    // Add one dot in the legend for each name.
    svg.selectAll("mydots")
      .data(keys)
      .enter()
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", 1050)
      .attr("y", function (d, i) { return 10 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
      //.attr("r", 7)
      .style("fill", function (d) { return color(d) })

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", 1080)
      .attr("y", function (d, i) { return 20 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
      //.style("fill", function (d) { return color(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

    // END TFSID 17030

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([1, ContractionChartScale.MaxXAxisTicks + 1])
      .range([0, this.chart.width]);

    const xScale = d3.scaleLinear()
      .domain([1, ContractionChartScale.MaxXAxisTicks + 1])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([ContractionChartScale.MinYAxisTicks, 6])
      .range([this.chart.height, 1]);

    // ContractionChartScale.MaxYAxisTicks
    const yScale = d3.scaleLinear()
      .domain([ContractionChartScale.MinYAxisTicks, 6])
      .range([this.chart.height, 1]);

    // create scales
    this.chart.xAxis = d3.axisBottom(this.chart.xScale).tickSizeInner(-this.chart.height)
      .tickSizeOuter(0)
      .tickPadding(this.chart.xAxistickPadding);

    this.chart.yAxis = d3.axisLeft(this.chart.yScale)
      .tickSizeInner(-this.chart.width).ticks(5, 'f')
      .tickSizeOuter(0)
      .tickPadding(this.chart.yAxistickPadding);

    svg.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0,${this.chart.height})`)
      // tslint:disable-next-line:variable-name
      .call(this.chart.xAxis.ticks(ContractionChartScale.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return '';
      }));

    svg.append('g')
      .attr('class', 'yaxis')
      .call(this.chart.yAxis);

    svg.selectAll('g .yaxis .tick').attr('class', 'chartleftseries');

    svg.selectAll("g .chartleftseries").selectAll("text").attr("dy", "-0.32em");
    svg.selectAll('.tick line').attr('stroke', '#bbb');

    svg.selectAll("g .chartleftseries:last-of-type text").remove();


    svg.append('text')
      .attr('text-anchor', 'end')
      .attr('transform', `translate(${-this.chart.margin.left + 95},${60})`)
      .attr('class', 'chartlabelname')
      .text('Contraction');

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr('transform', `translate(${-this.chart.margin.left + 95},${90})`)
      .attr('class', 'chartlabelname')
      .text('per 10 mins');


    // TFSID 16970, Rizwan khan , 28 july 2020, Check previous case point 
   
    svg.selectAll('.bar')
      .data(DataList)
      .enter().append('rect')
      .attr('fill',
        function (d) {
          if (d.patternValue == '1') {
            return 'url(#greaterThan20LessThan402)'
          }
          if (d.patternValue == '2') {
            return 'url(#greaterThan40_diagonal2)'
          }
          if (d.patternValue == '0') {
            return 'url(#LessThan20Sec_diagonal2)'
          }
        })
      .attr('x', function (d) {
        return xScale(Number(d.previousPosition) === 0 ? Number(d.xAxisPosition) : Number(d.previousPosition) + 1);
      })
      .attr('y', function (d) { return yScale(Number(d.yAxisPosition)); })
      .attr('width', function (d) {
        if (Number(d.intialPosition) === 1) {
          return 52 * (1);
        }
        else {
          //console.log((d.X_axis_Position - d.PreviousPoint === 0 ? 1 : d.X_axis_Position - d.PreviousPoint))
          return 52 * (Number(d.xAxisPosition) - Number(d.previousPosition) === 0 ? 1 : Number(d.xAxisPosition) - Number(d.previousPosition));
        }

      })
      .attr('height', function (d) {
       
        return 28 * Number(d.chartValue);
      })
      .attr('opacity', '.4');


  }
  openModal() {
    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // TFSID 16635, Rizwan Khan, 27 July 2020, Add time with timezone
    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {

      this.modalPopupData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.modalPopupData.timeZone = this.chartTimeCalculation.timeZone;
      this.modalPopupData.currentTime = this.chartTimeCalculation.timeNow;
      this.modalPopupData.frequencyList = this.modalPopupData.frequencyList;
      this.modalPopupData.contractionFrequency = 0;
      this.modalPopupData.inputBy = '';
      this.modalPopupData.remarks = '';
      this.modalPopupData.fId = 0;
      this.modalPopupData.ftListId = 1;
      this.modalPopupData.stageId = 3;
      this.modalPopupData.modelName = 'partographChart.Key_ContractionChart';
      this.modalPopupData.modelStagename = 'key_SecondStageLabour';
      this.modalPopupData.ftList = this.modalPopupData.ftList;
      this.modalRef = this.modalService.open(ContractionModalPopUpComponent, { size: 'xl', backdrop: 'static' });
      this.modalRef.componentInstance.modalData = this.modalPopupData;
      this.modalRef.result.then((result) => {

        // console.log('closed');

      }).catch((result) => {
        console.log(result);
        // console.log('cancelling');

      });

      let data; let checkInitialvalue = 0; data = []; let dataArray; dataArray = {};
      let ContractionData = ''; let value = 0; let inputBy; let comments;
      let previousPos = 0;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

        // TFSID 16972,Rizwan Khan,31 July 2020, Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }

        if (localStorage.getItem('ContractionData')) {
          ContractionData = localStorage.getItem('ContractionData');
        }
        value = receivedEntry.ftListId;
        inputBy = receivedEntry.inputBy;
        comments = receivedEntry.remarks;

        if (localStorage.getItem('ContractionData')) {
          ContractionData = localStorage.getItem('ContractionData');
        }
        let jsonData: any = [];
        if (ContractionData.length > 0) {
          jsonData = JSON.parse(ContractionData);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < jsonData.length; i++) {

            if (jsonData[i].x === this.chartTimeCalculation.halfPlotting + 1) {
              jsonData[i].active = 0;

            }
            // alert(jsonData[i].x)
            // tslint:disable-next-line:radix
            if (jsonData[i].active == 1) {
              previousPos = jsonData[i].x === 0 ? 1 : jsonData[i].x;
            }

          }

          ContractionData = jsonData;
        }

        //console.log(ContractionData)
        let dtlist: any = [];
        // check initial condition
        // TFSID 16970, Rizwan khan , 28 july 2020, check initial condition
        if (localStorage.getItem('ContractionData')) {
          const array = JSON.parse(localStorage.getItem('ContractionData'));
          dtlist = array.filter(u => u.active == 1);
          //alert(dtlist.length)
          if (dtlist.length == 0) {
            checkInitialvalue = 1;
          }

        }


        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 3;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.ftListId.toString();
        this.inputChartServer.XAxisPosition = (this.chartTimeCalculation.halfPlotting + 1);//this.chartTimeCalculation.xAxisPosition.toString(); //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = (parseInt(receivedEntry.ftListId) + parseInt('1'));
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.IntialPosition = 1;
        this.inputChartServer.PreviousPosition = 0;
        this.inputChartServer.PatternValue = receivedEntry.fId;

        this.chartinputservice.SaveContractions(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadContractionData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.CONTRACTION_PER_10MINS;
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
            this.ContractionData = [];
            this.toastr.success("Error!");
          }
        );


        //TFSID 16970, Rizwan khan, 29 July 2020, Same interval issue resolved when plotting

        //dataArray = {
        //  initialPos: checkInitialvalue == 1 ? 1 : (dtlist.length === undefined || dtlist.length === 0 || dtlist.length === 1) ? 1 : 0,
        //  x: this.chartTimeCalculation.halfPlotting + 1,
        //  // tslint:disable-next-line:radix
        //  y: parseInt(receivedEntry.ftListId) + parseInt('1'),
        //  yFrequency: receivedEntry.ftListId,
        //  pattern: receivedEntry.fId,
        //  previousPoint: previousPos,
        //  width: 52,
        //  comment: receivedEntry.remarks,
        //  inputby: this.currentUser.username,
        //  ObservationStartTime: this.chartTimeCalculation.TestingStartdate,
        //  CurrentTime: this.chartTimeCalculation.currentDate,
        //  active: 1
        //};


        //data.push(dataArray);

        //if (ContractionData.length > 0) {
        //  let oldData: any = [];
        //  oldData = ContractionData;
        //  oldData.push(dataArray);
        //  localStorage.setItem('ContractionData', JSON.stringify(oldData));
        //}
        //else {
        //  localStorage.setItem('ContractionData', JSON.stringify(data));
        //}

        //ContractionData = JSON.parse(localStorage.getItem('ContractionData'));
        //this.CreateChart(ContractionData);

      });
    }
    else {
      this.toastr.error('Observation start time and current time exceed from 12 hours.');
    }

  }


  // TFSID 17135, Rizwan Khan, 22 Aug 2020, Implement ContractIon API
  LoadContractionData(baseView) {
    this.chartinputservice.GetContractionAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.ContractionData = data.data;
      }
      
      this.CreateChart(this.ContractionData);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.ContractionData = [];
        this.CreateChart(this.ContractionData);
      }

    );
  }

  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }

  GetChartDomainOnYAxis(): any {
    return ContractionChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
  }
}
//TFS ID: 16474

