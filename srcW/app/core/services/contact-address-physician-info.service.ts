import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { regularOrderModel, PeriodicElement, CommonOrderModel, SaveVerifyEquipmentMaterialProperty, MaterialPropertyGrid } from '../../core/models/regularOrder.model';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ContactAddressPhysicianInfo } from '../models/contact-address-physician-info.model';



@Injectable({
  providedIn: 'root'
})
export class ContactAdressPhysicainInfoService {

  constructor(private http: HttpClient) {
   
  }


  GetcontactaddressphysicainInfo(mobject: ContactAddressPhysicianInfo) {

    return this.http.post<any>(`${environment.commonServerUrl}/Contact/GetContactAddressPhysicianInfo`, mobject)
      .pipe(map(user => {
        return user;
      }));
  }



}

