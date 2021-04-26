import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { User, PreferenceTypeService } from '..';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { Forecast, DeleteForecastChildernMapping } from '../models/Forecast.model';

const routes = {
    users: '/users'
};

@Injectable({
  providedIn: 'root'
})
export class ForecastService extends BaseService{

    forecastSelected: Forecast;

    constructor(private http: HttpClient,
      preferenceService: PreferenceTypeService) {
      super(preferenceService);
    }

  

    addForecast(forecast: any) {
      return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast`,forecast)
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

}
