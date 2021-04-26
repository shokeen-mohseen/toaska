// TFSID 16563 Latent Phase: Drugs Given and IV Fluids grid: Merge grid in Lamps 3.0
//TFSID 16694 Latent phase - Make the graph responsive.

//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16563
//Logic Description: This is Drug chart plotting
//                   Latent Phase: Drugs Given and IV Fluids grid: Merge grid in Lamps 3.0


import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { XAxisTimeConversionService } from '@app/shared/services/xaxis-chart.services';
import { ChartTimeConversionXAxis } from '@app/core/models/chart.axis.time.conversion.model';
import { SVGChart, DrugModalData, DrugChartScale } from '@app/core/models/d3chart/d3.chart.modal.popup';
import { DrugsChartPopupComponent } from '../../modal-content/drugs.chart.popup/drugs.chart.popup.component';
import { DataService } from '@app/shared/services';
declare var $: any;

@Component({
  selector: 'app-drugs-active-phaseChart',
  templateUrl: './drugs-active-phase.chart.component.html',
  styleUrls: ['./drugs-active-phase.chart.component.css']
})
export class DrugsActivePhaseChartComponent implements OnInit {
  IsPopup = -1;
  @ViewChild('chart', { static: true }) chartContainer: ElementRef;
  public chart: SVGChart;
  modalPopupData: DrugModalData; modalRef: NgbModalRef; chartTimeCalculation: ChartTimeConversionXAxis;
  isTimeExceed = 0; public drugList: any = [];
  constructor(private data: DataService, public modalService: NgbModal,
    public timeConverService: XAxisTimeConversionService) {
    this.chart = new SVGChart();
    this.modalPopupData = new DrugModalData();
  }

  ngOnInit(): void {
    if (localStorage.getItem('DrugData')) {
      this.drugList = JSON.parse(localStorage.getItem('DrugData'));
    }
    this.CreateChart(this.drugList);
  
  }

  // Plotting chart logic 

  CreateChart(dataDrugArray: any) {
    // TFSID 16643 Rizwan Khan, 17 July 2020, Aplied active condition on JSON data
    const dataDrug: any = dataDrugArray.filter(u => u.active == '1');

    let element;
    element = this.chartContainer.nativeElement;
    element.innerHTML = '';
    this.chart.width = this.GetChartDomainOnXAxis(); // this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
    this.chart.height = this.GetChartDomainOnYAxis();
    // DrugChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
    const svgWidth = this.chart.width + this.chart.margin.left + this.chart.margin.right;
    const svgHeight = this.chart.height + this.chart.margin.top + this.chart.margin.bottom;

    // chart plot area
    let svg;

    //Developer Name: Rizwan Khan
    //Date: June 6, 2020
    //TFS ID: 16694
    //Logic Description: Make the graph responsive.
              
    svg = d3.select(element).append('svg')
      .attr('id', 'd3chartDrug')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .append(`g`)
     // on("click", () => this.openModal('-1'))
      .attr('transform', `translate(${this.chart.margin.left},${this.chart.margin.top})`);

    //TFS ID: 16694

    // define X & Y domains
    this.chart.xScale = d3.scaleLinear()
      .domain([DrugChartScale.MinXAxisTicks, DrugChartScale.MaxXAxisTicks])
      .range([0, this.chart.width]);

    this.chart.yScale = d3.scaleLinear()
      .domain([DrugChartScale.MinYAxisTicks, DrugChartScale.MaxYAxisTicks])
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
      .call(this.chart.xAxis.ticks(DrugChartScale.MaxTicksDivisionRange).tickFormat((domain, number) => {
        return ``;
      }));

    svg.selectAll('.tick line').attr('stroke', '#bbb');
    // svg.selectAll('.xaxis .tick text').style('font-weight', '200').style('font-size', '6px');

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.chart.yAxis.ticks(DrugChartScale.MaxYAxisTicks).tickFormat((domain, number) => {
        return ``;
      }));

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left+100},${75})`)
      .attr('class', 'chartlabelname')
      .text('Drugs Given');

    svg.append('text')
      .attr('text-anchor', 'end')
      .attr("transform", `translate(${-this.chart.margin.left+100},${95})`)
      .attr('class', 'chartlabelname')
      .text('& IV Fluids');

    // TFSID 16643 , Rizwan khan, 30 July 2020, Latent Phase - Drugs Given and IV Fluids - Implement the chart.
    svg.selectAll("drugsLables")
      .data(dataDrug)
      .enter()
      .append("text")
      .attr("x", (d) => this.chart.xScale((d['x'])))
      .attr("y", "1") // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", "22px")
      .text(function (d) {

        //console.log(d['DrugValue'][d['DrugValue'].length - 1])
        let append = '';
        let arrP: any = []; let arrN: any = [];
        append = d['DrugValue'][d['DrugValue'].length - 1].Drugs;
        append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Dose;
        append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Route
        append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Frequency
        append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Days
        append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Instructions
        // TFSID 16643 , Rizwan Khan, 31 July 2020, checking if data is empty
        if (d['DrugValue'][d['DrugValue'].length - 1].Drugs1 != "") {
          append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Drugs1
          append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Dose1
          append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Route1
          append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Frequency1
          append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Days1
          append = append + ", " + d['DrugValue'][d['DrugValue'].length - 1].Instructions1
        }

        //arrP.push(d['DrugValue'][d['DrugValue'].length - 1].Drugs)
        //arrP.push(d['DrugValue'][d['DrugValue'].length - 1].Dose)
        //arrP.push(d['DrugValue'][d['DrugValue'].length - 1].Route)
        //arrP.push(d['DrugValue'][d['DrugValue'].length - 1].Frequency)
        //arrP.push(d['DrugValue'][d['DrugValue'].length - 1].Days)
        //arrP.push(d['DrugValue'][d['DrugValue'].length - 1].Instruction)

        //arrN.push(d['DrugValue'][d['DrugValue'].length - 1].Drugs1)
        //arrN.push(d['DrugValue'][d['DrugValue'].length - 1].Dose1)
        //arrN.push(d['DrugValue'][d['DrugValue'].length - 1].Route1)
        //arrN.push(d['DrugValue'][d['DrugValue'].length - 1].Frequency1)
        //arrN.push(d['DrugValue'][d['DrugValue'].length - 1].Days1)
        //arrN.push(d['DrugValue'][d['DrugValue'].length - 1].Instruction1)
        // let printArray = JSON.stringify(arrP,null) + ", " + JSON.stringify(arrN, null)
        //return printArray.length > 60 ? printArray.substr(0, 61) + "..." : printArray//+"<a>Edit<a>";

        return append.length > 30 ? append.substr(0, 29) + "..." : append;
      })
      .attr("text-anchor", "start")
      .style("writing-mode", "middle")
      .style("alignment-baseline", "middle")
      .attr('class', 'chartData')
      .on("click", (d) => this.ClickArrow(d['x']))
      .call(this.TextWrap, 50)

    
  }
  ClickArrow(xInterval) {
    this.openModal(xInterval);
    }

  

  // TFSID 16482 Rizwan Khan 23 July 2020 , Implement Text Wrapping function for breaking the words in charts cell
  TextWrap(text, width) {
  text.each(function () {
    let text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 1.1,
      i = 0,
      tspan = text.text(null).append("tspan").attr("x", parseFloat(x) + parseFloat("5")).attr("y", y).attr("dy", dy + "em")
         
     while (word = words.pop()) {
      if (word.length > 10) {
       
        let wordb = word.match(/.{1,9}/g)
       // console.log(wordb)
        for (i = 0; i < wordb.length; i++) {
          line.push(wordb[i]);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [wordb[i]]
            if (word == ",") {
              //tspan = text.append("tspan").attr("x", parseFloat(x) + parseFloat("5")).
              //  attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em")
              //  .text(word);
              lineNumber = lineNumber - 1;
            }
            else {
              tspan = text.append("tspan").attr("x", parseFloat(x) + parseFloat("5")).
                attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em")
                .text(wordb[i]);
            }
          }
 
          }

      } else {
       
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", parseFloat(x) + parseFloat("5")).
              attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
         
        }
      }

     
    }

    tspan = text.append("tspan").
      html("<a title='Arrow sign'  style='cursor:pointer'>>></a>")//.style("fill", "#d1ffd5")
      .attr("dy", "8.5em").attr("x", parseFloat(x) + parseFloat("60")).
      attr("y", 1).
      attr("title","Arrow sign")
  });
  }


  GetChartDomainOnXAxis(): any {
    return this.chart.globalwidth - this.chart.margin.left - this.chart.margin.right;
  }

  GetChartDomainOnYAxis(): any {
    return DrugChartScale.Hieght - this.chart.margin.top - this.chart.margin.bottom;
  }

  openModal(xInterval) {
    
    if (this.IsPopup == -1) {
      this.IsPopup = 0;
      this.chartTimeCalculation = new ChartTimeConversionXAxis();
     
      this.timeConverService.GetTimeConversionXaxis(this.chartTimeCalculation)
        .subscribe(timeserv => this.chartTimeCalculation = timeserv);
      //console.log(this.chartTimeCalculation.xAxisInterval_Sys)
      //console.log(xInterval)
      let Drugulist: any = [];
      this.modalPopupData.ListArray = null;
      this.modalPopupData.IsDisable = false;
      this.modalPopupData.remarks = '';
      // call when hours not exceed from 12 hours
      if (this.chartTimeCalculation.isTimeExceed === 0) {
        if (localStorage.getItem('DrugData')) {
          Drugulist = JSON.parse(localStorage.getItem('DrugData'));
        }
        let dataDrugOrgList: any = Drugulist.filter(u => u.active == '1');
        // TFSID 16643 , Rizwan Khan, 31 July 2020,Get exact time slot value from local storage
        if (dataDrugOrgList.length > 0) {
          //console.log(dataDrugOrgList[dataDrugOrgList.length - 1].DrugValue)
          let xTimeValue = dataDrugOrgList[dataDrugOrgList.length - 1].x;
          
          if (xInterval == '-1') {
            if (xTimeValue == this.chartTimeCalculation.xAxisInterval_Sys) {
              this.modalPopupData.ListArray = dataDrugOrgList[dataDrugOrgList.length - 1].DrugValue;
              this.modalPopupData.remarks = dataDrugOrgList[dataDrugOrgList.length - 1].comment;
              this.modalPopupData.IsDisable = false;
            }

          }
          else if (xInterval == this.chartTimeCalculation.xAxisInterval_Sys) {
            let Index = 0;
            for (let i = 0; i < dataDrugOrgList.length; i++) {
              if (dataDrugOrgList[i].x == xInterval) {
                Index = i;
              }
            }

            this.modalPopupData.ListArray = dataDrugOrgList[Index].DrugValue;
            this.modalPopupData.remarks = dataDrugOrgList[Index].comment;
            this.modalPopupData.IsDisable = false;
            

          }
          else if (xInterval != '-1') {
            let Index = 0;

            for (let i = 0; i < dataDrugOrgList.length; i++) {
              if (dataDrugOrgList[i].x == xInterval) {
                Index = i;
              }
            }

            this.modalPopupData.ListArray = dataDrugOrgList[Index].DrugValue;
            this.modalPopupData.remarks = dataDrugOrgList[Index].comment;
            this.modalPopupData.IsDisable = true;
          }
          else {
            this.modalPopupData.ListArray = null;
            this.modalPopupData.remarks = ''
            this.modalPopupData.IsDisable = false;
          }
        }
        else {
          this.modalPopupData.ListArray = null;
          this.modalPopupData.remarks = ''
          this.modalPopupData.IsDisable = false;
        }
        this.modalPopupData.modelName = 'partographChart.key_DrugChart';
        this.modalPopupData.modelStagename = 'key_ActivePhase';
        this.modalPopupData.timeZone = this.chartTimeCalculation.timeZone;
        this.modalPopupData.DisplayTime = this.chartTimeCalculation.DisplayCurrentTime;
        this.modalPopupData.value = ''; this.modalPopupData.inputBy = '';
        this.modalRef = this.modalService.open(DrugsChartPopupComponent, { size: 'xl', backdrop: 'static' });
        this.modalRef.componentInstance.modalData = this.modalPopupData;
        this.modalRef.result.then((result) => {
          this.IsPopup = -1;
          // console.log(result);
          // console.log('closed');

        }).catch((result) => {
          this.IsPopup = -1;
          console.log('cancelling');

        });



        let data; data = []; let dataArray; dataArray = {};
        let DrugList = ''; let value = 0; let inputBy; let comments;
        this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

          // Implement logic for start time display globally
          if (localStorage.getItem('StartTime') == null || localStorage.getItem('StartTime') == undefined) {
            localStorage.setItem('StartTime', this.chartTimeCalculation.currentDate.toString());
            this.data.IsTimeEnable(true);
          }

          if (localStorage.getItem('DrugData')) {
            DrugList = localStorage.getItem('DrugData');
          }
          value = receivedEntry.drugSpecifications;
          inputBy = receivedEntry.inputBy;
          comments = receivedEntry.remarks;


          let jsonData: any = [];
          if (DrugList.length > 0) {
            jsonData = JSON.parse(DrugList);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < jsonData.length; i++) {

              if (jsonData[i].x === this.chartTimeCalculation.xAxisInterval_Sys) {
                jsonData[i].active = 0;
                // alert(jsonData[i].active);

              }
            }

            DrugList = jsonData;
          }


          dataArray = {
            x: this.chartTimeCalculation.xAxisInterval_Sys, y: 0,
            DrugValue: value,
            ObservationStartTime: this.chartTimeCalculation.TestingStartdate,
            CurrentTime: this.chartTimeCalculation.observationStartTime,
            comment: comments, inputby: inputBy,
            active: 1
          };

          data.push(
            dataArray
          );

          if (DrugList.length > 0) {
            //let oldData = [];

            let oldData: any = [];
            oldData = DrugList;
            oldData.push(dataArray);

            //oldData = JSON.parse(DrugList);
            //oldData.push(dataArray);
            localStorage.setItem('DrugData', JSON.stringify(oldData));
          }
          else {
            localStorage.setItem('DrugData', JSON.stringify(data));
          }

          this.drugList = localStorage.getItem('DrugData');

          this.CreateChart(JSON.parse(this.drugList));


        });
      }
      else {
        alert('Observation start time and current time exceed from 12 hours.');
      }

      return false;

    }
  }



}

//TFS ID: 16563
