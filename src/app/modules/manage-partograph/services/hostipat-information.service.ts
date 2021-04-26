import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { HospitalType, InstituteName } from '../modals/hospital-information';
import { HospitalSetting } from '../../../core/models/location-unit';
import { HospitalSetup } from '../modals/patient-information';

const CoreBASE_URL = env.coreBaseApiUrl;
const BASE_URL = env.masterServerUrl;
const BASE_URL1 = env.serverUrl;
@Injectable({
  providedIn: 'root'
})
export class HospitalInformationService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(private http: HttpClient) {
  }


  // Get Hospital Location Type
  UpdateHospitalSetup(hospitalSetting: HospitalSetting) {
    return this.http.post<any>(CoreBASE_URL + '/Location/UpdateHospital', hospitalSetting)
      .pipe(map(result => {
        return result;
      }));
  }


  // Get Hospital Location Type
  GetHospitalContactAddressInfo(ids: any) {

    return this.http.post<any>(CoreBASE_URL + '/Location/LocationContactAddressinfo', ids)
      .pipe(map(result => {
        return result;
      }));
  }


  // Get Hospital Location Type
  GetAddedHospitalList(ids: any) {

    return this.http.post<any>(CoreBASE_URL + '/Location/GetAllByID', ids)
      .pipe(map(result => {
        return result;
      }));
  }

  // Save Location data in location table
  SaveHospital(hospitalSetting: any[]) {
    return this.http.post<any>(CoreBASE_URL + '/Location/SaveAll', hospitalSetting)
      .pipe(map(result => {
        return result;
      }));
  }

  // Get Hospital Location Type
  GetLocationFunction(locationTyepData: HospitalType) {

    return this.http.post<any>(BASE_URL + '/LocationFunction/List', locationTyepData)
      .pipe(map(LocationTypeList => {
        return LocationTypeList;
      }));
  }

  // Get Hospital Location Type
  GetHospitalLocationType(locationTyepData: HospitalType) {

    return this.http.post<any>(BASE_URL + '/LocationType/List', locationTyepData)
      .pipe(map(LocationTypeList => {
        return LocationTypeList;
      }));
  }


  // Get Institute Name
  GetInstituteName(instituteData: InstituteName) {
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(BASE_URL1 + '/Organization/List', instituteData, httpOptions)
      .pipe(map(InstituteList => {
        return InstituteList;
      }));
  }

  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
