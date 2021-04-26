import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'momentDateWithZonePipe'
})
export class MomentDateWithZonePipe implements PipeTransform {

  transform(date: string): string {
   
    let m1 = moment(date).format('MMMM DD, YYYY hh:mm A');
    let timeZone = moment.tz.guess();
    var timeZoneOffset = new Date(date).getTimezoneOffset();
    timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);
    return m1 + " " + timeZone;
  }

}
