import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BaseService } from '../../../../core/services/base.service';
import { PreferenceTypeService } from '../../../../core';
import { Geolocation } from '../models/geolocation';
import { routesConstrant } from '../../../../core/services/customer-by-location.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService extends BaseService {

  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }



  //UpdateOperationLocationSetup(operatingLocation: OperatingLocation) {
  //  return this.http.post<any>(CoreBASE_URL + '/Location/UpdateHospital', operatingLocation)
  //    .pipe(map(result => {
  //      return result;
  //    }));
  //}


  //activateanddeactivateHospitalsetupList(test: string): Observable<OperatingLocation[]> {
  //  debugger
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //  return this.http.post<any[]>(environment.coreBaseApiUrl + '/Location/ActiveAll', test, httpOptions)
  //    .pipe(map(result => {
  //      return result;
  //    }));
  //}

  // Get Hospital Location Type
  //GetAddedOperatingLocationList(ids: any) {
  //  return this.http.post<any>(CoreBASE_URL + '/OperatingLocation/GetAllByID', ids)
  //    .pipe(map(result => {
  //      return result;
  //    }));
  //}

  //GetOpeartingLocationList2(operatingLocation: OperatingLocation2) {
  //  var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  //  return this.http.post<any>(`${environment.coreBaseApiUrl}/Location/GetAllHospital`, operatingLocation, httpOptions)
  //    .pipe(map(charge => {
  //      return charge;
  //    }));
  //}

  GetGeolocationList(mobject: Geolocation) {
    return this.http.post<any>(`${environment.commonServerUrl}/Geolocation/GetGeoLocationList`, mobject)
      .pipe(map(result => {
        return result;
      }));
  }

  PostGeolocation(mobject: Geolocation) {
    return this.http.post<any>(`${environment.commonServerUrl}/Geolocation`, mobject)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteUserGeolocation(id: string, deletedBy: string) {
    return this.http.get<any>(`${environment.commonServerUrl}/Geolocation/DeleteGeolocation/${id}/${deletedBy}`)

    //return this.http.get<any>(`${environment.commonServerUrl}/Geolocation/delete/${id}/${deletedBy}`)
      .pipe(map(user => {
        return user;
      }));
  }



}

