import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { PreferenceTypeService } from '.';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { PreferenceTypeService, UsersContactViewModel } from '..';
import { map } from 'rxjs/operators';
import { MessageViewModel } from '../models/message';
import { FuelChargeIndex, FuelSurCharge } from '../models/FuelChargeIndex.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends BaseService {

  constructor(private http: HttpClient, private authservices: AuthService,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getAllMessagesList(clientId: number) {
    var RequestObject = {
      ClientID: clientId
    };
    return this.http.post<any>(`${environment.masterServerUrl}/CommonMessage/list`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }
  

  getMessageByModuleCode(Code: string) {
    var RequestObject = {
      code: Code
    };
    return this.http.post<any>(`${environment.masterServerUrl}/CommonMessage/GetByModuleCode`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  getMessagesByModuleCode(Code: string, ClientId: number) {
    var RequestObject = {
      code: Code,
      clientId: ClientId
    };
    return this.http.post<any>(`${environment.masterServerUrl}/CommonMessage/GetByModuleCode`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }
}
