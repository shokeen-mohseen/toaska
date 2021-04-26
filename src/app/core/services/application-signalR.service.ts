import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
import * as signalR  from '@aspnet/signalr'



@Injectable({
  providedIn: 'root'
})
export class ApplicationSignalR extends BaseService {

  public hubConnection: signalR.HubConnection

  constructor(preferenceService: PreferenceTypeService) {
    super(preferenceService);
   
  }

  public stratconnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.commonServerUrl.replace('api','')}ExcelReportingManagerHubSystem`)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }


  
}

