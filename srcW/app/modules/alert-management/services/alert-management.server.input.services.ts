import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { SystemAlerts } from '../models/SystemAlerts';
import { AuthService } from '../../../core';
import { AlertTemplateParameters  } from '../models/AlertTemplateParameters';
import { SystemEvents } from '../models/SystemEvents';
import { Roles } from '../models/Roles';
import { ContactType } from '../models/ContactType';
import { DocumentType } from '../models/DocumentType';
import { UserAlertRecipients , AlertTemplates } from '../models/UserAlertRecipients';
import { UserAlerts } from '../models/UserAlerts';

const BASE_URL = env.coreBaseApiUrl;
const Master_URL = env.masterServerUrl;
const Security_URL = env.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class AlertManagementService {
  systemAlter: SystemAlerts = new SystemAlerts();
  systemEvents: SystemEvents = new SystemEvents();
  alertTemplateParameters: AlertTemplateParameters = new AlertTemplateParameters();
  Roles: Roles = new Roles();
  ContactType: ContactType = new ContactType();
  DocumentType: DocumentType = new DocumentType();
  UserAlert: UserAlerts = new UserAlerts();

  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  private headers: HttpHeaders;
  constructor(private http: HttpClient, private authservices: AuthService) {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authservices.currentUserValue.AuthToken,
      'Accept': 'application/json'
    })

  }

  // TFSID 17205, Kapil Pandey , 05 Sep 2020, Implement ApI for Order Generate and Payment success Handle

  GetSystemAlerts() {

    this.systemAlter.ClientID = this.authservices.currentUserValue.ClientId;
    this.systemAlter.IsDeleted = false;

    return this.http.post<any>(BASE_URL + '/SystemAlert/List', this.systemAlter, { headers: this.headers })
      .pipe(map(systemAlerts => {
        return systemAlerts;
      }));
  }

  GetSystemEvents() {

    this.systemEvents.ClientID = this.authservices.currentUserValue.ClientId;
    this.systemEvents.IsDeleted = false;

    return this.http.post<any>(Master_URL + '/SystemEvents/List', this.systemEvents, { headers: this.headers })
      .pipe(map(systemEvents => {
        return systemEvents;
      }));
  }


  GetAlertTemplateList(eventId: number) {
   
    this.alertTemplateParameters.ClientID = this.authservices.currentUserValue.ClientId;
    this.alertTemplateParameters.SystemEventID = eventId;

    return this.http.post<any>(Master_URL + '/AlertTemplateParameters/List', this.alertTemplateParameters, { headers: this.headers })
      .pipe(map(alertTemplateParameters => {
        return alertTemplateParameters;
      }));
  }

  GetAllRoles() {

    this.Roles.ClientID = this.authservices.currentUserValue.ClientId;

    return this.http.post<any>(Security_URL + '/Roles/List', this.Roles, { headers: this.headers })
      .pipe(map(Roles => {
        return Roles;
      }));
  }

  GetAllContactType() {

    this.ContactType.ClientID = this.authservices.currentUserValue.ClientId;

    return this.http.post<any>(Master_URL + '/ContactType/List', this.ContactType, { headers: this.headers })
      .pipe(map(ContactType => {
        return ContactType;
      }));
  }

  GetAllDocumentType() {

    this.DocumentType.ClientID = this.authservices.currentUserValue.ClientId;
    return this.http.post<any>(Master_URL + '/DocumentType/List', this.DocumentType, { headers: this.headers })
      .pipe(map(DocumentType => {
        return DocumentType;
      }));
  }

  SaveUserRecipient(UserAlertRecipient: UserAlertRecipients) {
    UserAlertRecipient.ClientID = this.authservices.currentUserValue.ClientId;
    UserAlertRecipient.CreatedBy = this.authservices.currentUserValue.LoginId;
    UserAlertRecipient.CreateDateTimeBrowser = new Date();
    return this.http.post<any>(Master_URL + '/UserAlertRecipients', UserAlertRecipient)
      .pipe(map(result => {
        return result;
      }));
  }

  SaveUserAlertTemplate(useralertTemplate: AlertTemplates []) {
   
    useralertTemplate.forEach((value, index) => {
      //value.Code = '';
      //value.Description = '';       
      value.UpdatedBy = this.authservices.currentUserValue.LoginId;
      value.UpdateDateTimeBrowser = new Date();
      value.ClientID = this.authservices.currentUserValue.ClientId;     
    });

    return this.http.post<any>(Master_URL + '/AlertTemplateParameters/UpdateAll', useralertTemplate, { headers: this.headers })
     .pipe(map(alertTemplateParameters => {
       return alertTemplateParameters;
     }));
  }

  

  GetAllAlertListForMainPage(PageNumber, PageSize) {
    this.UserAlert.ClientID = this.authservices.currentUserValue.ClientId;
    this.UserAlert.PageNo = PageNumber;
    this.UserAlert.PageSize = PageSize;

    return this.http.post<any>(BASE_URL + '/useralert/list', this.UserAlert, { headers: this.headers })
      .pipe(map(DocumentType => {
        return DocumentType;
      }));
  }

  SaveUserAlertData(userAlert: UserAlerts) {
   
    userAlert.ClientID = this.authservices.currentUserValue.ClientId;
    userAlert.IsDeleted = false;
    userAlert.CreatedBy = this.authservices.currentUserValue.LoginId;


    return this.http.post<any>(BASE_URL + '/useralert', userAlert, { headers: this.headers })
      .pipe(map(result => {
        return result;
      }));
  }

  UpdateUserAlertStatus(idslist:string,status:boolean) {

    var data = {
      IDs: idslist,
      IsActive : status
    };

    return this.http.post<any>(BASE_URL + '/useralert/ActiveAll', data, { headers: this.headers })
      .pipe(map(result => {
        return result;
      }));
  }

  RemoveUsersAlerts(idslist: string) {

    var data = {
      IDs: idslist
    };

    return this.http.post<any>(BASE_URL + '/useralert/DeleteALl', data, { headers: this.headers })
      .pipe(map(result => {
        return result;
      }));
  }

  GetUserAlertInformation(Id: number) {
    var userAlertVM = {
      ID: Id,
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(BASE_URL + '/useralert/GetByID', userAlertVM, { headers: this.headers })
      .pipe(map(result => {
        return result;
      }));
  }

  UpdateUserRecipient(UserAlertRecipient: UserAlertRecipients) {
    UserAlertRecipient.ClientID = this.authservices.currentUserValue.ClientId;
    UserAlertRecipient.UpdatedBy = this.authservices.currentUserValue.LoginId;
    UserAlertRecipient.UpdateDateTimeBrowser = new Date();
    return this.http.post<any>(Master_URL + '/UserAlertRecipients/Update', UserAlertRecipient)
      .pipe(map(result => {
        return result;
      }));
  }


  UpdateUserAlertData(userAlert: UserAlerts) {

    userAlert.ClientID = this.authservices.currentUserValue.ClientId;
    userAlert.IsDeleted = false;
    userAlert.UpdatedBy = this.authservices.currentUserValue.LoginId;
    userAlert.UpdateDateTimeBrowser = new Date();


    return this.http.post<any>(BASE_URL + '/useralert/Update', userAlert, { headers: this.headers })
      .pipe(map(result => {
        return result;
      }));
  }

  GetRecipientDetails(Id: number) {
   
    var userAlertRecipient = {
      ID: Id,
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(Master_URL + '/UserAlertRecipients/GetByID', userAlertRecipient, { headers: this.headers })
      .pipe(map(result => {
       
        return result;
      }));
  }


  // Start Get API Data from Server 




  // END


  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
