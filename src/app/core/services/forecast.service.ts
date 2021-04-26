import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { User, PreferenceTypeService } from '..';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
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
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  forecastSelected: Forecast;
  ForecastingforEdit: any[] = [];
  forecastId: number = 0;
  forecastCId: number = 0;

  constructor(private http: HttpClient, handler: HttpBackend,
    preferenceService: PreferenceTypeService, private authservices: AuthService) {
    super(preferenceService);
    this.http = new HttpClient(handler);
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

  GetDynamicColumnByMultipleIds(forecastIds: any) {

    var RequestObject = {
      IDs: forecastIds
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/GetDynamicColumnByMultipleIds`, RequestObject)
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

  CheckDuplicateForecast(name: string) {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/forecast/DuplicateExists?name=${name}`)
      .pipe(map(response => {
        return response;
      }));
  }

  uploadNewForecast(saveForm: FormData) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/UploadNewForecast`, saveForm)
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
  deleteForecast(ForecastID: any) {

    var RequestObject = {
      ForecastID: ForecastID.id
    };
    //return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/DeleteForecastSelected`, deleteRequest)
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/DeleteForecastSelected`, RequestObject)
      .pipe(map(response => {
        return response;
      }));
  }

  getMaterialforNewRows(ForecastID: number, LocationId: number) {

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
  UpdateAdjustFinalForecast(data: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/forecast/AdjustFinalForecastUpdate`, data)
      .pipe(map(forecast => {
        return forecast;
      }));
  }


  DuplicateForecast(Forecast: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Forecast/DuplicateForecast`, Forecast)
      .pipe(map(result => {
        return result;

      }));
  }

  SaveFlexForecast(ForecastId: string, LocationId: string, MaterialId: string, headerStr: string, valueStr: string) {

    return this.http.get<any>(`${this.BASE_SERVICE_URL}/forecast/FlexForecastUpdate?forecastId=` + ForecastId + "&locationId=" + LocationId + "&materialId=" + MaterialId + "&headerData=" + headerStr + "&percentageData=" + valueStr)
      .pipe(map(forecast => {
        return forecast;
      }));
  } 
  UpdateForecast(Forecast: any) {

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Forecast/UpdateForecast`, Forecast)
      .pipe(map(result => {
        return result;

      }));
  }
  getForecastCompareList(forecast: Forecast) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Forecast/GetForecastCompareList`, forecast)
      .pipe(map(result => {
        return result;

      }));
  }

  LockForecast(ForecastId: number, IsLock: boolean, ClientId: number) {
   
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/forecast/LockUnLockForecast?forecastId=` + ForecastId + "&isLock=" + IsLock + "&clientId=" + ClientId)
      .pipe(map(forecast => {
        return forecast;
      }));
  }
  PublishForecast(ForecastId: number, IsPublish: boolean, ClientId: number) {
   
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/forecast/PublishForecast?forecastId=` + ForecastId + "&isPublish=" + IsPublish + "&clientId=" + ClientId)
      .pipe(map(forecast => {
        return forecast;
      }));
  }
  getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId) {
    return this.http.post<any>(`${environment.serverUrl}/ModuleRolePermission/GetControlPermissionByRole`, { ModuleRoleCode, ClientId, LoginId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
 

  getStatusAggregateForecastCompareDetails(forecast: Forecast) {

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Forecast/GetStatusAggregateForecastCompare`, forecast)
      .pipe(map(result => {
        return result;

      }));
  }
  ForecastLockstatus(Forecast: any) {    
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Forecast/GetForecastLockstatus`, Forecast)
      .pipe(map(result => {
        return result;
      }));
  }


}
