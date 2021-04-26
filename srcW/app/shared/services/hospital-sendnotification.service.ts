import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalNotificationService {

   
  private sendHospitalSession = new BehaviorSubject(null);
  currentMessage = this.sendHospitalSession.asObservable();
  //private sendChartNotification = new BehaviorSubject(0);
  //alertNotification = this.sendChartNotification.asObservable();

  constructor() {

  }

  sendHospitalListIds(dataSource: any[]) {
    
    this.sendHospitalSession.next(dataSource);
  }

  SetSessionIds(hospitalIds: string) {
    this.sendHospitalSession.next(hospitalIds);
  }

  GetHospitalSetupIds() {
    return this.sendHospitalSession.getValue();
   
  }
  

  

  // END TFSID 16635
}
