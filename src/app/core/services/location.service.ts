import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PreferenceTypeService } from '..';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class LocationService extends BaseService {

  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getLocationById(LocationId: number) {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/location/ID?id=` + LocationId)
      .pipe(map(response => {
        return response;
      }));
  }

  getExistingCharacteristics(requestObj: { LocationId: number; ClientId: number; }) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/GetExistingCharacteristics`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteCharacteristics(requestObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/DeleteExistingCharacteristics`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }

  getDefaultCharacteristics(requestObj: { EntityCode: string; ClientId: number; }) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/GetLocationCharacteristics`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }



}
