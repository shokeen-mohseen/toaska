import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserActivityLog } from '@app/core/models/useractivity';
import { ServerChartValues } from '../../modules/manage-partograph/modals/input-chart';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private subject = new BehaviorSubject(null);
  _subject = this.subject.asObservable();

  private subjectSourcePartograph = new BehaviorSubject("");
  private subjectSource = new BehaviorSubject(null);
  currentStatusSource = this.subjectSource.asObservable();
  currentpartograph = this.subjectSourcePartograph.asObservable();

  private sendChartNotification = new BehaviorSubject(0);
  alertNotification = this.sendChartNotification.asObservable();


  private sendNotification = new BehaviorSubject(0);
  enabledisableNotification = this.sendNotification.asObservable();

  private cUserActivity = new BehaviorSubject(null);
 // public publishUserActivity: Observable<any>;
 //this.cUserActivity = new BehaviorSubject<any>(null);
  publishUserActivity = this.cUserActivity.asObservable();


  // TFSID 16936 Rizwan khan, 23 July 2020, hide and show time series when Test is started or not
  private TimeSourceChartPartograph = new BehaviorSubject(false);
  TimecurrentMessage = this.TimeSourceChartPartograph.asObservable();



  constructor() {

    
  }

  // TFSID 16936 Rizwan khan, 23 July 2020, this is function use for time display

  IsTimeEnable(IsDisplay: boolean) {
    this.TimeSourceChartPartograph.next(IsDisplay)
  }

  buttonStatus(buttonState: any) {
    console.log(buttonState)
    this.subjectSource.next(buttonState);
  }

  SendPartographSource(stepperName: string) {
    
    this.subjectSourcePartograph.next(stepperName);
  }

  SendActivity(UserActivity: UserActivityLog) {

    this.cUserActivity.next(UserActivity);
  }

  public get currentUserActivity(): UserActivityLog {
    return this.cUserActivity.getValue();
  }


  
  Notify(notify: any) {
    this.sendNotification.next(notify);
  }

  SendChartAlertNotification(notificationNo: number) {
    this.sendChartNotification.next(notificationNo);
  }

  // Alert Counter
  
  sendMessage(message: string) {
    this.subject.next(message);
  }

  sendMessage1(message: boolean) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  getStatus(): Observable<boolean> {
    return this.subject.getValue();
  }
  sendEnableDisable_WhenPatientIdnotfound() {
    //console.log(IsValidate)
    this.subject.next(ServerChartValues.MatTabButtonEnable());

  }

  

  // END TFSID 16635
}
