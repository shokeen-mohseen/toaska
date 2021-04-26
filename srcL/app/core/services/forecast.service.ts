import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { User, PreferenceTypeService } from '..';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { Forecast, DeleteForecastChildernMapping } from '../models/Forecast.model';
import { AuthService } from './auth.service';
const routes = {
    users: '/users'
};

@Injectable({
  providedIn: 'root'
})
 
export class ForecastService extends BaseService {

  forecastSelected: Forecast;
  ForecastingforEdit: any[] = [];

  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService, private authservices: AuthService) {
    super(preferenceService);
  }


  addForecast(forecast: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast`, forecast)
      .pipe(map(response => {
        return response;
      }));
  }

  getForecastDynamicColumnById(forecastId: any) {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/forecast/GetDynamicColumnById?id=${forecastId}`)
      .pipe(map(response => {
        return response;
      }));
  }

  getForecastDetailById(forecast: Forecast) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/GetForecastDetailById`, forecast)
      .pipe(map(response => {
        return response;
      }));
  }

  getStatusAggregateForecastDetailById(forecast: Forecast) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/GetStatusAggregateForecastDetailById`, forecast)
      .pipe(map(response => {
        return response;
      }));
  }

  getLastUpdatedForecast() {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/forecast/getLastUpdatedForecast`)
      .pipe(map(response => {
        return response;
      }));
  }

  getForecastTemplateById(forecast: Forecast) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/GetForecastTemplateById`, forecast)
      .pipe(map(response => {
        return response;
      }));
  }

  getForecastChildDetailsById(forecast: Forecast) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/GetChildForecastDetailById`, forecast)
      .pipe(map(response => {
        return response;
      }));
  }

  uploadForecast(saveForm: FormData) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/UploadForecast`, saveForm)
      .pipe(map(response => {
        return response;
      }));
  }

  getForecastList(forecast: Forecast) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/list`, forecast)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteChildForecast(forecast: Forecast) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/delete`, forecast)
      .pipe(map(response => {
        return response;
      }));
  }


  deleteChildForecastMapping(deleteForecastChildernMapping: DeleteForecastChildernMapping) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/DeleteChildForecastRelationById`, deleteForecastChildernMapping)
      .pipe(map(response => {
        return response;
      }));
  }

  getForecastByCalenderType(typeId: number) {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/forecast/ForecastByCalenderType?typeid=${typeId}`)
      .pipe(map(response => {
        return response;
      }));
  }

  updateForecastWithExistingForecast(requestObj) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/UpdateForecastWithExisting`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }
  deleteForecastDetails(deleteRequest) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/DeleteForecastDetailsById`, deleteRequest)
      .pipe(map(response => {
        return response;
      }));
  }
  deleteForecast(deleteRequest) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/delete`, deleteRequest)
      .pipe(map(response => {
        return response;
      }));
  }

  getMaterialforNewRows(ForecastID:number,LocationId: number) {
    
    var RequestObject = {
      ForecastID: ForecastID,
      LocationId: LocationId,
      ClientID: this.authservices.currentUserValue.ClientId
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Forecast/MaterialforNewRows`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  getPeriodStartCodes(ForecastID: number) {
    var RequestObject = {
      ForecastID: ForecastID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Forecast/PeriodStartCodesforNewRows`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  SaveForecastNewRows(ForecastNewRows: any) {
    var a = JSON.stringify(ForecastNewRows);
    console.log(a);
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Forecast/SaveForecastNewRows`, ForecastNewRows)
      .pipe(map(result => {
        return result;

      }));
  }


  getForecastDetailDataById(ids: any, clientId: number) {
  
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/forecast/GetForecastDetailByDetailId?ids=` + ids + "&clientId=" + clientId)
      .pipe(map(salesData => {
        return salesData;
      }));



  }
  UpdateAdjustFinalForecast(obj: any[]) {
  
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/AdjustFinalForecastUpdate`, obj)
      .pipe(map(forecast => {
        return forecast;
      }));
  }


}
