import { Injectable } from '@angular/core';
import { ChartTimeConversionXAxis } from './../../core/models/chart.axis.time.conversion.model';
import { Observable, of } from 'rxjs';
import moment from 'moment';
import 'moment-timezone';
@Injectable({
  providedIn: 'root'
})

export class XAxisTimeConversionService {
  diffInMilliSeconds = 0;
  minuteDifference = 0;
  xAxisInterval = 80;
  xAxisInterval_Sys = 0;

  halfHoursPlotting = 0;

  GetTimeConversionXaxis(chart: ChartTimeConversionXAxis): Observable<ChartTimeConversionXAxis> {
    chart.isTimeExceed = 0;
    chart.observationStartTime = localStorage.getItem('StartTime');
    chart.xAxisPulseBp = 60; chart.xAxisPosition = 0;
    const minuteDifference = 0;
    let hoursDifference = 0;
    let currentTime: Date;
    let ObservedTime: Date;
    currentTime = new Date();
    chart.currentDate = new Date();

    // TFSID 16635 Rizwan khan, 27 July 2020,  Add moment script for date Time round
    // Applied the rounding condition on time by using startof of function 

    let m = moment(new Date());
    // TFSID 16635 Rizwan Khan , 27 july 2020, add Current time with time zone
    let m1 = moment().format('MMMM DD, YYYY hh:mm A');
    chart.DisplayCurrentTime = m1.toString();

    var roundDown = m.startOf('hour');
    chart.timeNow = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    if (localStorage.getItem('StartTime')) {
     
      chart.TestingStartdate = new Date(chart.observationStartTime);
      ObservedTime = chart.observationStartTime;

    }
    else {

      chart.currentDate = new Date(roundDown.toString())
      chart.TestingStartdate = new Date(roundDown.toString());
      chart.observationStartTime = chart.TestingStartdate;
      ObservedTime = new Date(roundDown.toString());
    }
    let utiCalucation: number;

    utiCalucation = Math.abs(new Date(ObservedTime).getTime() - new Date(currentTime).getTime());

   // utiCalucation = Math.abs(new Date(ObservedTime).getTime() - new Date(currentTime).getTime());

    const minutes = Math.floor(utiCalucation / 60000);
    //alert(minutes);
    // Calculate hours
    const hours = Math.floor(minutes / 60);

    //alert(minutes)
   // alert(hours)
    //alert(Math.round(minutes / 30))
    if (minutes < 30) {
      chart.halfPlotting = 0;
    }
    else {
      const HalfHours = Math.floor(minutes / 30);
      // alert(HalfHours)
      this.halfHoursPlotting = HalfHours;
      chart.halfPlotting = this.halfHoursPlotting;
    }
    // alert(chart.halfPlotting)
    // utiCalucation -= hours * 3600;
    hoursDifference = hours;
    this.xAxisInterval_Sys = hours;


    //alert(chart.halfPlotting)
    let timeInMinutes = 0;
    if (hours >= 0) {
      timeInMinutes = Math.abs(minutes - (hours * 60));
    }
    this.minuteDifference = timeInMinutes;
    // alert(timeInMinutes)
    chart.isTimeExceed = this.checkTimeDurationExceed(hours, minutes);
    let DiffMin = 0;
    if (this.minuteDifference > 30) {
      DiffMin = this.minuteDifference - 30;
    }

    // X Axis time conversion logic
    // tslint:disable-next-line:max-line-length
    chart.xAxisPosition = (this.xAxisInterval + (hoursDifference * 2)) + (this.minuteDifference < 30 ? ((this.minuteDifference / 30)) : ((1 + (DiffMin / 30))));
    const xCervixTime = ((hoursDifference * 2)) + (this.minuteDifference < 30 ? ((this.minuteDifference / 30)) : ((1 + (DiffMin / 30))));

    chart.xCervixTime = xCervixTime;
    let attinterval = 1;
    let mintdiff = 0;
    if (hoursDifference > 0) {
      attinterval = attinterval * 2 * hoursDifference;
    }
    if (this.minuteDifference <= 30) {
      mintdiff = -this.minuteDifference + 30;
      mintdiff = 52 - mintdiff;
    }
    else if (this.minuteDifference > 30) {
      mintdiff = this.minuteDifference - 30;
      mintdiff = 52 + mintdiff;
    }
    //console.log(hoursDifference)

    chart.xAxisBPonly = ((((hoursDifference * 2) * 52) + attinterval) + mintdiff);

    //alert(chart.xAxisBPonly)
    chart.xAxisPulseBp = chart.xAxisPulseBp + ((hoursDifference * 2)) + (this.minuteDifference < 30 ? ((this.minuteDifference / 30)) : ((1 + (DiffMin / 30)))); //((((hoursDifference * 2) * 52) + attinterval) + mintdiff);
    //chart.xAxisPulseBp = chart.xAxisPulseBp;
    //alert(chart.xAxisPulseBp)
    // Cantraction x axis time conversion

    if (this.minuteDifference <= 30 && hoursDifference === 0) {
      chart.xAxisPositionContraction = 0;

    }
          


    var dt = new Date();
   // Time zone functionality

    var timeZone = moment.tz.guess();
    var timeZoneOffset = dt.getTimezoneOffset();

    // console.log(moment.tz.zone(timeZone).abbr(timeZoneOffset));
    chart.timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);

    if (this.minuteDifference > 30 && hoursDifference === 0) {
      chart.xAxisPositionContraction = 54;
    }
    if (this.minuteDifference <= 30 && hoursDifference > 0) {
      chart.xAxisPositionContraction = (54 * 2 * hoursDifference) + hoursDifference;
    }

    if (this.minuteDifference > 30 && hoursDifference > 0) {
      chart.xAxisPositionContraction = (54 * 2 * hoursDifference);
    }

    chart.xAxisInterval_Sys = this.xAxisInterval_Sys;
    return of(chart);
  }

  checkTimeDurationExceed(hours, minutes) {
    let timeExceed = 0;
    if (hours >= 12) {
      if (minutes >= 0) {
        timeExceed = 1;
      }
    }
    else {
      timeExceed = 0;
    }
    return timeExceed;
  }


 

}
