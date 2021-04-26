// TFSID 16474 Latent Phase: Contraction Chart: Merge chart in Lamps 3.0
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SVGChart, CervixDescentChartXYAxisRange, AmnioticMouldingChartScale } from '@app/core/models/d3chart/d3.chart.modal.popup';
import * as d3 from 'd3';
import { DataService } from '@app/shared/services';
import moment from 'moment';
@Component({
  selector: 'app-timechart',
  templateUrl: './time.chart.component.html',
  styleUrls: ['./time.chart.component.css']
})
export class TimeChartComponent implements OnInit {
  public chart: SVGChart;
  @ViewChild('cervixchartTime', { static: true }) chartTimeContainer: ElementRef;
  dataTimeSeries: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  dataTimeHours: any = [];
  IsTimeSeriesDraw = 1;
  constructor(public data: DataService) {
    this.chart = new SVGChart();
  }

  ngOnInit(): void {

    // TFSID 16936 Rizwan khan, 23 July 2020, subscribe time service for displaying time series
    
    this.data.TimecurrentMessage.subscribe(
      (data) => {
        if (data) {
          this.GetHoursSeries();
          this.IsTimeSeriesDraw = 0;
          this.RenderTimeChart();
        }
        else {
          this.IsTimeSeriesDraw = 1;
        }
      
      }); 

    if (this.IsTimeSeriesDraw == 1) {
      this.GetHoursSeries();
      this.RenderTimeChart();
    }

  }

  // TFSID 16936 Rizwan khan, 24 July 2020, Implement hours Series extend to 12 hours interval
  GetHoursSeries() {
    this.dataTimeHours = [];
    if (localStorage.getItem("StartTime")) {
      const dt = new Date(localStorage.getItem('StartTime'));
      let i = 1;
      for (let hour = 0; hour < 12; hour++) {
        this.dataTimeHours.push(
          {
            i: i,
            Hours: moment(dt).add(hour, "hour").format('LT')
            //moment({ hour }).format('LT')
          }
        )
        i++;
      }
    }
  }
  
  RenderTimeChart() {

    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = 110 - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;
    let element;
    element = this.chartTimeContainer.nativeElement;
    element.innerHTML = '';

    // chart plot area
    let svg;
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartTimeCervixDescent')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);


    // define X & Y domains
    //this.chart.xScale = d3.scaleLinear()
    //  .domain([CervixDescentChartXYAxisRange.MinXAxisTicks, CervixDescentChartXYAxisRange.MaxXAxisTicks])
    //  .range([0, this.chart.width]);

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
      .call(this.chart.xAxis.ticks(12).tickFormat((domain, number) => {
        return '';
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');

   // svg.selectAll(".tick line").attr("stroke", "#C9C9C9");
    // svg.selectAll(".xaxis .tick text").style("font-weight", "200").style("font-size", "6px");

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left + 95},${20})`)
      .attr('class', 'chartlabelname')
      .text('Time');

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left + 95},${60})`)
      .attr('class', 'chartlabelname')
      .text('Hours');

    svg.append("g")
      .attr("class", "yaxis")
      .attr('class', 'chartlabelname')
      .call(this.chart.yAxis.ticks(2).tickFormat((domain, number) => {
        return "";
      }));

    // TFSID 16639 RIZWAN KHAN 16July 2020 , Implement Hours plotting here

    if (localStorage.getItem("StartTime")) {
      svg.selectAll("amnioticLables")
        .data(this.dataTimeSeries)
        .enter()
        .append("text")
        .attr("x", (d) => this.chart.xScale((d)) - 60)
        .attr("y", (d) => (AmnioticMouldingChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom + 3) / 2) // 100 is where the first dot appears. 25 is the distance between dots
        .text(function (d) { return d })
        .attr("text-anchor", "start")
        .style("alignment-baseline", "middle")
        .attr('class', 'chartData')
     
     // Implement Hours 24 JULY 2020 , Rizwan Khan 
      svg.selectAll("amnioticLables1")
        .data(this.dataTimeHours)
        .enter()
        .append("text")
        .attr("x",
          function (d) {

            if (d.Hours.length == 8) {
              return xScale((d.i)) - 95
            }
            else if (d.Hours.length == 7) {
              return xScale((d.i)) - 86
            }
            else {
              return xScale((d.i)) - 100
            }

          })
         .attr("y", (d) => (140 - this.chart.margin.top - this.chart.margin.bottom+10) / 2) // 100 is where the first dot appears. 25 is the distance between dots
        .text(function (d) {
          return d.Hours;
        })
        .attr("text-anchor", "start")
        .style("alignment-baseline", "middle")
        .attr('class', 'chartData') 
    }

  }
  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }
}
