import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map  } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import {  FreightLane } from '../models/FreightLane.model';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
import { AuthService } from './auth.service';
import { UsersContactViewModel } from '../models';
import { FreightLaneExcelUpload } from '../models/FreightLaneExcelUpload.model';

const BASE_URL = env.coreBaseApiUrl;
const Master_URL = env.masterServerUrl;
const COMMON_URL = env.commonServerUrl;
@Injectable({
  providedIn: 'root'
})
export class FreightLaneService extends BaseService{
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
 
  constructor(private http: HttpClient, preferenceService: PreferenceTypeService, private authservices: AuthService) {
    super(preferenceService);
  }
  Permission: boolean = false;
  UploadExcel(data:any[]) {

    const body = { data: data }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(BASE_URL + '/FreightLane/UploadExcel', data)
      .pipe(map(response => {
        return response;
      }));
  }  
  GetAllFreightLaneDetails(FreightLane: FreightLane) {
    return this.http.post<any>(BASE_URL + '/FreightLane/GetAllRecords', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  GetFreightLaneExcelDetails(FreightLaneExcelUpload: FreightLaneExcelUpload) {
    return this.http.post<any>(BASE_URL + '/FreightLane/GetErrorReport', FreightLaneExcelUpload)
      .pipe(map(response => {
        return response;
      }));
  }
  
  GetGeoLocationList(FreightLane: FreightLane) {
    FreightLane.clientId = this.authservices.currentUserValue.ClientId;
    return this.http.post<any>(COMMON_URL + '/Geolocation/GetGeoLocationList', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  
  GetFreightModeddl(FreightLane: FreightLane) {
    return this.http.post<any>(BASE_URL + '/FreightLane/GetFreightModeddl', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  GetRecordById(FreightLane: FreightLane) {
    return this.http.post<any>(BASE_URL + '/FreightLane/GetRecordById', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  
  GetDistance(FreightLane: FreightLane) {
    return this.http.post<any>(BASE_URL + '/FreightLane/GetDistance', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  GetFreightLaneList() {
    return this.http.get<any>(BASE_URL +'/FreightLane/list')
      .pipe(map(response => {
        return response;
      }));
  }
  GetFreightModeList(FreightLane: FreightLane) {
    return this.http.post<any>(BASE_URL + '/FreightMode/list', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  GetEquipmentList(FreightLane: FreightLane) {
    return this.http.post<any>(Master_URL + '/EquipmentType/list', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  GetCarrierList(FreightLane: FreightLane) {
    return this.http.post<any>(Master_URL + '/Carrier/list', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  GetUOMList(FreightLane: FreightLane) {
    FreightLane.clientId = this.authservices.currentUserValue.ClientId;
    return this.http.post<any>(Master_URL + '/Uom/list', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  
  GetFilterData(FreightLane: FreightLane) {
    return this.http.post<any>(BASE_URL + '/FreightLane/GetFilterRecords', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  SaveAllData(FreightLane: FreightLane[]) {
    return this.http.post<any>(BASE_URL + '/FreightLane/SaveAll', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  UpdateAllData(FreightLane: FreightLane[]) {
    return this.http.post<any>(BASE_URL + '/FreightLane/updateall', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  deleteAllFreightLane(ids: string) {

    const body = { IDs: ids }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FreightLane>(BASE_URL +'/FreightLane/DeleteAll', body, this.httpOptions);
  }
  deleteFreightLaneDet(ids: string) {

    const body = { IDs: ids }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FreightLane>(BASE_URL + '/FreightLane/DeleteFreightDet', body, this.httpOptions);
  }
  
  //// Get Geolocation Location
  //GetLocationID(geolocation: Geoloction) {

  //  return this.http.post<any>(BASE_URL + '/Geolocation/GetGeolocationId', geolocation)
  //    .pipe(map(LocationList => {
  //      return LocationList;
  //    }));
  //}


  //// Add Patient Adress
  //AddPatientAddress(addressLocation: AddressLocation) {

  //  return this.http.post<any>(BASE_URL + '/ContactAddress', addressLocation)
  //    .pipe(map(LocationList => {
  //      return LocationList;
  //    }));
  //}

  //// Get Contact Adrress [Patient , user, customer etc.]
  //GetAddressInformation(addressLocation: AddressLocation) {

  //  return this.http.post<any>(BASE_URL + '/ContactAddress/List', addressLocation)
  //    .pipe(map(LocationList => {
  //      return LocationList;
  //    }));
  //}

  //UpdateAddressInformation(addressLocation: AddressLocation) {

  //  return this.http.put<any>(BASE_URL + '/ContactAddress/Update', addressLocation);
  //}
  //// Get Contact Adrress [Patient , user, customer etc.]
  //GetContactInformation(addressLocation: UsersContactViewModel) {

  //  return this.http.post<any>(BASE_URL + '/Contact/List', addressLocation)
  //    .pipe(map(LocationList => {
  //      return LocationList;
  //    }));
  //}

  
  
}
