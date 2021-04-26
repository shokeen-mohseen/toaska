import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserActivityLog } from '@app/core/models/useractivity';
import { ServerChartValues } from '../../modules/manage-partograph/modals/input-chart';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private isShowNotificationMenu = new Subject<boolean>();
  private isShownotesin = new Subject<boolean>();
  private isShowBackBtn = new Subject<boolean>();
  private notificationCount = new Subject<number>();
  
  public getShowNotificationCounter(): Observable<number> {
      return this.notificationCount.asObservable();
  } 
  /*
  * @param {string} message : siblingMsg
  */
  public updateShowNotificationCounter(data) {
      this.notificationCount.next(data);
  }
  
  public getIsShownBackbtn(): Observable<boolean> {
      return this.isShowBackBtn.asObservable();
  } 
  /*
  * @param {string} message : siblingMsg
  */
  public updateIsShownBackbtn(data) {
      this.isShowBackBtn.next(data);
  }
  
  
  public getIsShownotesin(): Observable<boolean> {
      return this.isShownotesin.asObservable();
  } 
  /*
  * @param {string} message : siblingMsg
  */
  public updateIsShownotesin(data) {
      this.isShownotesin.next(data);
  }
 
  public getNotificationMenuShow(): Observable<boolean> {
      return this.isShowNotificationMenu.asObservable();
  }
  /*
  * @param {string} message : siblingMsg
  */
  public updateNotification(data) {
      this.isShowNotificationMenu.next(data);
  }

  public static partograph = ['key_Register', 'key_PrepartumCare',
    'key_PartographMonitoring', 'key_PostpartumCare'];

  public static pageurl = [
    '/manage-partograph/new-partograph/registration','/manage-partograph/new-partograph/prepartum-care',
    '/manage-partograph/new-partograph/partograph-monitoring', '/manage-partograph/new-partograph/postpartum-care'];

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

    if (localStorage.getItem("AlertCounter")) {
     this.subject.next(localStorage.getItem("AlertCounter"));
    }

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


  // TFSID 16635 Rizwan Khan, 8 june 2020, This is use to count total alert in application

  public get TotalPreviousAlertCount(): number {
    if (localStorage.getItem("AlertCounter")) {
       return parseInt(localStorage.getItem("AlertCounter"))
    }
    else {
     
      this.sendChartNotification.getValue();
    }
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
