//TFSID 16565 Latent Phase: Temprature grid: Merge grid in Lamps 3.0
//TFSID 16694 Latent phase - Make the graph responsive.
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { XAxisTimeConversionService } from '@app/shared/services/xaxis-chart.services';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { SVGChart, TempratureModalData, TempratureChartScale } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { TempratureChartPopupComponent } from '../../modal-content/temprature.chart.popup/temprature.chart.popup.component';
import { DataService } from '@app/shared/services';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { ServerChartValues, ServerChartCommonComment } from '@app/modules/manage-partograph/modals/input-chart';
import { User, AuthService } from '@app/core';
import { ToastrService } from 'ngx-toastr';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-temprature-active-phasechart',
  templateUrl: './temprature-active-phase.chart.component.html',
  styleUrls: ['./temprature-active-phase.chart.component.css']
})
export class TempratureActivePhaseChartComponent implements OnInit {
  currentUser: User;
  @ViewChild('chart', { static: true }) chartContainer: ElementRef;
  public chart: SVGChart; modalPopupData: TempratureModalData;
  modalRef: NgbModalRef; chartTimeCalculation: ChartTimeConversionXAxis; baseGraphViewModel: BaseChartViewModel;
  isTimeExceed = 0; public tempList: any = []; inputChartServer: ServerChartValues;
  constructor(private toastr: ToastrService, private authenticationService: AuthService, private chartinputservice: ChartInputService,private data: DataService, public modalService: NgbModal,
    public timeConverService: XAxisTimeConversionService) {
    this.chart = new SVGChart();
    this.modalPopupData = new TempratureModalData();
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

    this.LoadTemperatureData(this.baseGraphViewModel);
  }

  CreateTempChart(dataTempArray: any) {
    
    // TFSID 16485 Rizwan Khan, 17 July 2020, Aplied active condition on same interval JSON data
    const dataTemp: any = dataTempArray;//.filter(u => u.active == '1');
    let element;
    element = this.chartContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // OxitocinChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartTemp')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([TempratureChartScale.MinXAxisTicks, TempratureChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([TempratureChartScale.MinYAxisTicks, TempratureChartScale.MaxYAxisTicks])
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
      .call(this.chart.xAxis.ticks(TempratureChartScale.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return ``;
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');
    //svg.selectAll('.xaxis .tick text').style('font-weight', '200').style('font-size', '6px');

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.chart.yAxis.ticks(TempratureChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
        return ``;
      }));
       
    // TFSID 16938 Rizwan khan , 23 July 2020, Change Temp °C to Temperature
    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left+102},${30})`)
      .attr('class', 'chartlabelname')
      .text('Temperature'); // Temp °C


    svg.selectAll("tempLables")
      .data(dataTemp)
      .enter()
      .append("text")
      .attr("x", (d) => this.chart.xScale((d['xAxisPosition'])) + 40)
      .attr("y", (d) => (TempratureChartScale.Height - this.chart.margin.top - this.chart.margin.bottom+5) / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function (d) { return d['chartValue'] })
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .attr('class', 'chartData')
  }
  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }

  GetChartDomainOnYAxis(): any {
    return TempratureChartScale.Height - this.chart.margin.top - this.chart.margin.bottom;
  }

  openModal() {
    this.chartTimeCalculation = new ChartTimeConversionXAxis();

    this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
      .subscribe(timeserv => this.chartTimeCalculation = timeserv);

    // call when hours not exceed from 12 hours
    if (this.chartTimeCalculation.isTimeExceed === 0) {

      // TFSID 16635, Rizwan Khan, 27 July 2020, Add time with timezone
      this.modalPopupData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
      this.modalPopupData.timeZone = this.chartTimeCalculation.timeZone; 
      this.modalPopupData.currentTime = this.chartTimeCalculation.timeNow;
      this.modalPopupData.value = '';
      this.modalPopupData.inputBy = '';
      this.modalPopupData.remarks = '';
      this.modalPopupData.tempName = '°F';
      this.modalPopupData.modelName = 'partographChart.Key_TempratureChart';
      this.modalPopupData.modelStagename = 'key_ActivePhase';
      this.modalPopupData.stageId = 2;
      this.modalPopupData.dtTempList = this.modalPopupData.dtTempList;
      this.modalRef = this.modalService.open(TempratureChartPopupComponent, { size: 'xl', backdrop: 'static' });
      this.modalRef.componentInstance.modalData = this.modalPopupData;
      this.modalRef.result.then((result) => {

       // console.log(result);

      }).catch((result) => {

        console.log('cancelling');

      });

      
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

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
        this.inputChartServer.SourceSystemId = 1;
        this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
        this.inputChartServer.BrowserTimeZone = this.chartTimeCalculation.timeZone;
        this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
        this.inputChartServer.ChartValue = receivedEntry.value + "" + receivedEntry.TemperatureType;//.toString();//+ "" + receivedEntry.TemperatureType ;
        this.inputChartServer.XAxisPosition = this.chartTimeCalculation.xAxisInterval_Sys; //this.chartTimeCalculation.xAxisPulseBp.toString();
        this.inputChartServer.YAxisPosition = 0; //receivedEntry.value.toString();
        this.inputChartServer.UpdateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);
        this.inputChartServer.CreateDateTimeBrowser = new Date(this.chartTimeCalculation.observationStartTime);

        this.chartinputservice.SaveTemperature(this.inputChartServer).subscribe(
          data => {

            if (data.message == "Success") {
              this.LoadTemperatureData(this.baseGraphViewModel);
              this.toastr.success("Data saved successfully!");

              const commentBody = new ServerChartCommonComment();
              commentBody.CommentModule = GlobalConstants.TEMPERATURE;
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
            this.tempList = [];

            this.toastr.success("Error!");
          }
        );



      });
    }
    else {
      this.toastr.error('Observation start time and current time exceed from 12 hours.');
    }

  }

  // Protien API
  LoadTemperatureData(baseView) {
    this.chartinputservice.GetTemperatureAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.tempList = data.data;
      }
      this.CreateTempChart(this.tempList);
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.tempList = [];
        this.CreateTempChart(this.tempList);
      }

    );
  }  
}
