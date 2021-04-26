import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { AmnioticMouldingChartScale, SVGChart, FetalHeartChartXYAxisRange } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { User, AuthService } from '@app/core';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { ToastrService } from 'ngx-toastr';
import { ServerChartValues } from '@app/modules/manage-partograph/modals/input-chart';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
@Component({
  selector: 'app-caput-succedaneum',
  templateUrl: './caput-succedaneum.component.html',
  styleUrls: ['./caput-succedaneum.component.css']
})
export class CaputSuccedaneumComponent implements OnInit {
  @ViewChild('chart', { static: true }) chartContainer: ElementRef;
  public chart: SVGChart; currentUser: User; caputList: any = []; caputName: string;
  caputvalues = [
    {
      x: 200,
      name: "Small"
    },
    {
      x: 600,
      name: "Big"
    },
    {
      x: 1000,
      name: "Absent"
    }
  ];
  inputChartServer: ServerChartValues; baseGraphViewModel: BaseChartViewModel;
  constructor(private authenticationService: AuthService,private chartinputservice: ChartInputService, private toastr: ToastrService,) {
    this.chart = new SVGChart();
    this.caputName = '';
    this.currentUser = this.authenticationService.currentUserValue;

    this.baseGraphViewModel = new BaseChartViewModel();
    this.baseGraphViewModel.StagesId = 3;
    this.baseGraphViewModel.PatientId = ServerChartValues.GetPatientId();
    this.baseGraphViewModel.PartographId = ServerChartValues.GetPartpgraphId();
    this.baseGraphViewModel.ClientId = this.currentUser.ClientId;
    this.baseGraphViewModel.CreatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.IsVisible = true;
    this.baseGraphViewModel.UpdateDateTimeBrowser = new Date();
    this.baseGraphViewModel.PageNo = 1;
    this.baseGraphViewModel.PageSize = 100;

  }

  ngOnInit(): void {
    //this.createChart();
    this.LoadContractionData(this.baseGraphViewModel);
  }

  //  TFSID 17032, Rizwan Khan, 14 Aug 2020, Implement radio button type functionality and also fix alignment issue on caput
  // Plotting chart here
  createChart() {

    var self = this;
    this.chart.width = this.GetChartDomainOnXAxis(); 
    this.chart.height = this.GetChartDomainOnYAxis();
    
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;
    let element;
    element = this.chartContainer.nativeElement;
    element.innerHTML = '';

    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chart')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);


    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([AmnioticMouldingChartScale.MinXAxisTicks, 3])
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
      .call(this.chart.xAxis.ticks(3).tickFormat((domain, number) => {
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
      .text('Caput');


    svg.selectAll("amnioticLables")
      .data(this.caputvalues)
      .enter()
      .append("circle")
      .attr("id", (d) => d['x'])
      .attr("cx", (d) => d['x'])
      .attr("cy", 20)
      .attr("r", 8)
      .attr("name", (d) => d['name'])
      .style("fill", "white")
      .style("stroke", "black")
      .on('click',  function() {
       // console.log("click");
        d3.selectAll("circle").style("fill", "white");
        //d3.select(this).style("fill", "black");
        self.StoreCaputData(d3.select(this).attr("name"))

        //console.log(d3.select(this).attr("id"))
      });

    d3.selectAll("circle").each(function () {
      //console.log(self.caputName)
      if (self.caputName == d3.select(this).attr("name")) {
        //console.log(d3.select(this).attr("name"))
        d3.select(this).style("fill", "black")
      }
    });


    svg.selectAll("amnioticLables")
      .data(this.caputvalues)
      .enter()
      .append("text")
      .attr("x", (d) => d['x']+14)
      .attr("y", 25)
      .text(function (d) { return d['name'] })
      
  }

  StoreCaputData(caputName) {
    //console.log(caputName)
    this.inputChartServer = new ServerChartValues();
    this.inputChartServer.ClientId = Number(this.currentUser.ClientId);
    this.inputChartServer.CreatedBy = this.currentUser.LoginId;
    this.inputChartServer.StagesID = 3;
    this.inputChartServer.OrganizationId = 0;
    this.inputChartServer.PatientId = ServerChartValues.GetPatientId();
    this.inputChartServer.PartographId = ServerChartValues.GetPartpgraphId();
    this.inputChartServer.SourceSystemId = 1;
    this.inputChartServer.UpdatedBy = this.currentUser.LoginId;
    this.inputChartServer.ChartValue = caputName;
    this.inputChartServer.XAxisPosition = 0;
    this.inputChartServer.YAxisPosition = 0;
    this.inputChartServer.UpdateDateTimeBrowser = new Date();
    this.inputChartServer.CreateDateTimeBrowser = new Date();
    this.chartinputservice.SaveCaput(this.inputChartServer).subscribe(
      data => {

        if (data.message == "Success") {
          this.LoadContractionData(this.baseGraphViewModel);
          this.toastr.success("Data saved successfully!");

        }
        else {
          this.toastr.success("Data not saved!");
        }

      }

      ,
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.caputList = [];
        this.toastr.success("Error!");
      }
    );
  }


  LoadContractionData(baseView) {
    this.chartinputservice.GetCaputAnalytics(baseView).subscribe(data => {
      if (data.data != null) {
        this.caputList = data.data;
        this.caputName = this.caputList[0].chartValue;

      }
      this.createChart();
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.caputList = [];
        this.createChart();
      }

    );
  }
  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }
  GetChartDomainOnYAxis(): any {
    return AmnioticMouldingChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
  }

}
