import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperatingLocationSessionService {

   
  private sendOperatingLocationSession = new BehaviorSubject(null);
  private editRights = new BehaviorSubject(true);
  currentMessage = this.sendOperatingLocationSession.asObservable();
  //private sendChartNotification = new BehaviorSubject(0);
  //alertNotification = this.sendChartNotification.asObservable();

  constructor() {

  }

  sendOperatingLocationListIds(dataSource: any[]) {
    
    this.sendOperatingLocationSession.next(dataSource);
  }

  SetSessionIds(hospitalIds: string) {
    this.sendOperatingLocationSession.next(hospitalIds);
  }

  IsEditableRights(isEdittable: boolean) {
    this.editRights.next(isEdittable);
  }
  GetEditableRights() {
    return this.editRights.getValue();
  }
  GetOperatingLocationSetupIds() {
    return this.sendOperatingLocationSession.getValue();
   
  }
  

  

  // END TFSID 16635
}
