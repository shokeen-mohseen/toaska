import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { OperatingLocation, OperatingLocation2 } from '../model/operating-location';
import { environment as env } from '@env/environment';
import { BaseService } from '../../../../core/services/base.service';
import { PreferenceTypeService } from '../../../../core';
const CoreBASE_URL = env.coreBaseApiUrl;

@Injectable({
  providedIn: 'root'
})
export class OperatingLocationService extends BaseService {

  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }
  Permission: boolean = false;
  UpdateOperationLocationSetup(operatingLocation: OperatingLocation) {
    return this.http.post<any>(CoreBASE_URL + '/Location/UpdateHospital', operatingLocation)
      .pipe(map(result => {
        return result;
      }));
  }


  activateanddeactivateHospitalsetupList(test: string): Observable<OperatingLocation[]> {
    debugger
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(environment.coreBaseApiUrl + '/Location/ActiveAll', test, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  // Get Hospital Location Type
  GetAddedOperatingLocationList(ids: any) {
    return this.http.post<any>(CoreBASE_URL + '/OperatingLocation/GetAllByID', ids)
      .pipe(map(result => {
        return result;
      }));
  }

  GetOpeartingLocationList2(operatingLocation: OperatingLocation2) {
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Location/GetAllHospital`, operatingLocation, httpOptions)
      .pipe(map(charge => {
        return charge;
      }));
  }

  GetOpeartingLocationList(mobject: OperatingLocation) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Location/GetAllOperatingLocationList`, mobject)
      .pipe(map(result => {
        return result;
      }));
  }



}

