//TFSID 16564 Latent Phase: Pulse & BP chart  : Merge chart in Lamps 3.0
//TFSID 16694 Latent phase - Make the graph responsive.
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { XAxisTimeConversionService } from '@app/shared/services/xaxis-chart.services';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { SVGChart, BPModalData, PulseModalData, PulseBPChartScale, WrapperBPPulseModalData } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { PulsebpChartPopupComponent } from '../../modal-content/pulsebp.chart.popup/pulsebp.chart.popup.component';
import { DataService } from '@app/shared/services';
import { ServerChartValues, ServerChartCommonComment } from '../../../../modules/manage-partograph/modals/input-chart';
import { AuthService, User, JsonApiService } from '@app/core';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-pulsebp-active-phaseChart',
  templateUrl: './pulsebp-active-phase.chart.component.html',
  styleUrls: ['./pulsebp-active-phase.chart.component.css']
})
export class PulsebpActivePhaseChartComponent implements OnInit {
  currentUser: User;
  @ViewChild('PulseBPchartA', { static: true }) chartContainer: ElementRef;
  bpPlottingCenterPoint = 26; // add api point
  arraylistforBPlotting = [26,78,130,182,234,286,338,390,442,494,546,598,650,702,754,806,858,910,962,1014,1066,1118,1170,1222]
  pulseList: any = []; bpList: any = [];
  pulseData: PulseModalData; bpData: BPModalData;
  public chart: SVGChart; modalRef: NgbModalRef; baseGraphViewModel: BaseChartViewModel;
  modalPopupData: WrapperBPPulseModalData; chartTimeCalculation: ChartTimeConversionXAxis;
  chartMode: string;inputChartServer:ServerChartValues;
  constructor(private toastr: ToastrService,private chartinputservice: ChartInputService, private authenticationService: AuthService, private data: DataService, public modalService: NgbModal, public timeConverService: XAxisTimeConversionService) {
    this.currentUser = this.authenticationService.currentUserValue;

    this.chart = new SVGChart();
    this.pulseData = new PulseModalData();
    this.bpData = new BPModalData();
    this.modalPopupData = new WrapperBPPulseModalData();

    this.baseGraphViewModel = new BaseChartViewModel();
    this.baseGraphViewModel.StagesId = 2;
    this.baseGraphViewModel.PatientId = ServerChartValues.GetPatientId();
    this.baseGraphViewModel.PartographId = ServerChartValues.GetPartpgraphId();
    this.baseGraphViewModel.ClientId = this.currentUser.ClientId;
    this.baseGraphViewModel.CreatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdatedBy = this.currentUser.LoginId;
    
  }

  ngOnInit(): void {

    this.LoadChartData(this.baseGraphViewModel);

  }

 
  CreateChart(pulseDatasetArray: any, bpDatasetArray: any) {

    const pulseDataset: any = pulseDatasetArray;//.filter(u => u.active == '1');
    const bpDataset: any = bpDatasetArray//.filter(u => u.active == '1');

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
      .attr('id', 'd3chartPulseBp')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);


    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([PulseBPChartScale.MinXAxisTicks, PulseBPChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([PulseBPChartScale.MinYAxisTicks, PulseBPChartScale.MaxYAxisTicks])
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
      .call(this.chart.xAxis.ticks(PulseBPChartScale.MaxTicksDivisionRange)
        .tickFormat((domain, number) => {
          return '';
        }));

    // svg.selectAll(".tick line").attr("stroke", "#bbb");
    svg.append('g')
      .attr('class', 'yaxis')
      .call(this.chart.yAxis);

    svg.selectAll("g .yaxis .tick").attr("class", "chartleftseries");

    svg.append('text')
      .attr("transform", `translate(${-this.chart.margin.left + 15},${175})`)
      .attr('class', 'chartlabelname')
      .text('Pulse');

    svg.append('text')
      .attr("transform", `translate(${-85},${238})`)
      .attr('class', 'chartlabelname')
      .text('BP');


    let line;
    line = d3.line()
      // tslint:disable-next-line:no-string-literal
      .x((d, i) => this.chart.xScale(d['xAxisPosition']))
      // tslint:disable-next-line:no-string-literal
      .y(d => this.chart.yScale(d['yAxisPosition']));

    svg.append('path')
      .datum(pulseDataset)
      .attr('class', 'data-line glowed')
      .style('stroke', 'black')
      .style('stroke-width', 2)
      .style('fill', 'none')
      .attr('d', line);

    //draw points on lines	
    const circles = svg.selectAll('circle')
      .data(pulseDataset)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      // tslint:disable-next-line:no-string-literal
      .attr('cx', (d, i) => this.chart.xScale((d['xAxisPosition'])))
      .attr('cy', d => this.chart.yScale((d.yAxisPosition)))
      .attr('r', 2)
      .style('fill', 'black')
      .style('stroke', 'black')
      .style('stroke-width', 2);

    // end of pulse draw

    // outer pulse circle mark	 
    svg.append("circle").attr("transform", "translate(-50, 170)")
      .attr("r", 4);


    // outer BP Horizontal line					  
    svg.append("svg:defs").append("svg:marker")
      .attr("id", "triangle3")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "black");

    // outer Arrow	
    svg.append("svg:defs").append("svg:marker")
      .attr("id", "triangle2")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "black");



    // Outer vertical line	BP					  
    svg.append("line").attr("transform", "translate(-90, 185)")
      .attr("x1", 40)
      .attr("y1", 19)
      .attr("x2", 40)
      .attr("y2", 80)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .attr("marker-end", "url(#triangle3)")
      .attr("marker-start", "url(#triangle2)");


    // Outer BP Horizontal line					
    svg.append("line")
      .attr("transform", "translate(-85, 185)")
      .attr("x1", 24)
      .attr("y1", 85)
      .attr("x2", 48)
      .attr("y2", 85)
      .attr("stroke-width", 2)
      .attr("stroke", "black");
    // Outer BP Horizontal line							
    svg.append("line").attr("transform", "translate(-85, 185)")
      .attr("x1", 24)
      .attr("y1", 12)
      .attr("x2", 48)
      .attr("y2", 12)
      .attr("stroke-width", 2)
      .attr("stroke", "black");

    for (var i = 0; i < bpDataset.length; i++) {
      console.log(bpDataset[i].xAxisPosition)
      svg.append("line")
        .attr("x1", bpDataset[i].xAxisPosition)
        .attr("y1", bpDataset[i].upperBPValue)
        .attr("x2", bpDataset[i].xAxisPosition)
        .attr("y2", bpDataset[i].chartValue)
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("marker-end", "url(#triangle3)")
        .attr("marker-start", "url(#triangle2)");
    }

  }

  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }

  GetChartDomainOnYAxis(): any {
    return PulseBPChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
  }

  LoadChartData(baseView) {

    forkJoin(
      this.chartinputservice.GetPulseData(baseView),
      this.chartinputservice.GetBPAnalytics(baseView)
    ).subscribe(([res1, res2]) => {
      if (res1.data != null) {
        this.pulseList = res1.data;
      }
      if (res2.data != null) {
        this.bpList = res2.data;
      }
     
      this.CreateChart(this.pulseList, this.bpList);

    }
      ,
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.pulseList = [];
        this.bpList = [];

        this.CreateChart(this.pulseList, this.bpList);
      }
    );


  }

  // TFSID 16635, Rizwan Khan, 27 July 2020, Add time with timezone
  openModal() {
    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {

      this.pulseData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.pulseData.timeZone = this.chartTimeCalculation.timeZone;

      this.pulseData.currentTime = this.chartTimeCalculation.timeNow;
      this.pulseData.value = 0;
      this.pulseData.inputBy = '';
      this.pulseData.remarks = '';

      this.bpData.currentTime = this.chartTimeCalculation.timeNow;
      this.bpData.lowerbp = '0';
      this.bpData.upperbp = '0';
      this.bpData.inputBy = '';
      this.bpData.remarks = '';
      this.modalPopupData.pulseData = this.pulseData;
      this.modalPopupData.bpData = this.bpData;
      this.modalPopupData.modelStagename = 'key_ActivePhase';
      this.modalPopupData.stageId = 2;
      this.modalRef = this.modalService.open(PulsebpChartPopupComponent, { size: 'xl', backdrop: 'static' });
     
      this.modalRef.componentInstance.modalData = this.modalPopupData;
      this.modalRef.result.then((result) => {
      }).catch((result) => {
      
      });

      
      this.modalRef.componentInstance.passBackPulse.subscribe((receivedEntry) => {

        // TFSID 16972,Rizwan Khan,31 July 2020, Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }

        //if (localStorage.getItem('PulseData')) {
        //  pulseDatalist = localStorage.getItem('PulseData');
        //}

        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 2;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.XAxisPosition = Number(this.chartTimeCalculation.xAxisPulseBp);
        this.inputChartServer.YAxisPosition = Number(receivedEntry.value);
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date (this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.PulseChartServer(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadChartData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.PULSE;
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
            this.bpList = [];
            this.pulseList = [];
            this.toastr.success("Error!");
          }
        );

                 
      });

      this.modalRef.componentInstance.passBackBP.subscribe((receivedEntry) => {

        // Implement logic for start time display globally
        if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
          localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
          this.data.IsTimeEnable(true);
        }
        //if (localStorage.getItem('BPData')) {
        //  bpDatalist = localStorage.getItem('BPData');
        //}

        this.bpData.lowerbp = receivedEntry.lowerbp;
        this.bpData.upperbp = receivedEntry.upperbp;
        //inputBy = receivedEntry.inputBy;
        //comments = receivedEntry.remarks;

        if (parseFloat(this.bpData.lowerbp) > 0) {
          const lowerbpI = (((180 - parseFloat(this.bpData.lowerbp)) / 10) * 35).toFixed(2);
          this.bpData.lowerbp = lowerbpI;
        }
        if (parseFloat(this.bpData.upperbp) > 0) {
          const upperbpI = (((180 - parseFloat(this.bpData.upperbp)) / 10) * 33.7).toFixed(2);// parseFloat(((180 - parseFloat(this.bpData.upperbp)) / parseFloat(10)) * 31).toFixed(2);
          this.bpData.upperbp = upperbpI;
        }
        ////let BPAxis = '0';
      
        //if (this.chartTimeCalculation.xAxisBPonly > 0) {
        //  const BpAxisI = (this.chartTimeCalculation.xAxisBPonly + 33) - 60;
        //  BPAxis = parseFloat(BpAxisI.toString()).toFixed(2);
        //}

        // TFSID 16937 Rizwan Khan 23 July 2020, Applied active condition on BP plotting

        let plottingXBP = this.arraylistforBPlotting[this.chartTimeCalculation.halfPlotting]; //((this.chartTimeCalculation.halfPlotting + 1) * this.bpPlottingCenterPoint);

        this.inputChartServer = new ServerChartValues();
        this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
        this.inputChartServer.CreatedBy = this.currentUser.LoginId;
        this.inputChartServer.StagesID = 2;
        this.inputChartServer.OrganizationId = 0;
        this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        // this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = this.bpData.lowerbp.toString();
        this.inputChartServer.UpperBPValue = Number(this.bpData.upperbp);
        this.inputChartServer.XAxisPosition = plottingXBP;
        this.inputChartServer.YAxisPosition = Number(this.bpData.lowerbp);
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
      
        this.chartinputservice.SaveBloodPressure(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadChartData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.BLOOD_PRESSURE;
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
            this.bpList = [];
            this.pulseList = [];
            this.toastr.success("Error!");
          }
        );

       
        this.CreateChart(this.pulseList, this.bpList);

        //this.CreateChart(pulseDatalist.length > 0 ? JSON.parse(pulseDatalist) : pulseDatalist,
        //  bpDatalist.length > 0 ? JSON.parse(bpDatalist) : bpDatalist);


      });

    }
    else {
      alert('Observation start time and current time exceed from 12 hours.');
    }

  }

 
}
