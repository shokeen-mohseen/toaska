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
  UploadExcel(data: any[]) {
    let freightLane = new FreightLane();
   var updatedBy = this.authservices.currentUserValue.LoginId;
    var updateDateTimeBrowserStr = this.convertDatetoStringDate(new Date());
    const body = { data: data, updatedBy, updateDateTimeBrowserStr}
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(BASE_URL + '/FreightLane/UploadExcel', body)
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

  GetMultipleByIdsFreightlane(ids: any) {
    var req = {
      IDs: ids
    }
    return this.http.post<any>(BASE_URL + '/FreightLane/GetMultipleFreightlaneByID', req)
      .pipe(map(response => {
        return response;
      }))
  }

  getExcelUploadDetails(updateUser: string) {
    var reqBody = {
      UpdatedBy: updateUser
    };
    return this.http.post<any>(BASE_URL + '/FreightLane/ExcelUploadStatus', reqBody)
      .pipe(map(response => {
        return response;
      }))
  }

  GetGeoLocationList(clientid: number) {
    var reqBody = {
      ClientId: clientid
    };
    return this.http.post<any>(COMMON_URL + '/Geolocation/GetGeoLocationList', reqBody)
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
  GetFreightLaneexcelList() {
    return this.http.get<any>(BASE_URL + '/FreightLane/errorlist')
      .pipe(map(response => {
        return response;
      }));
  }
  GetFreightModeList(clientid: number) {
  var reqBody = {
    ClientId: clientid
  };
    return this.http.post<any>(BASE_URL + '/FreightMode/list', reqBody)
    .pipe(map(response => {
      return response;
    }));
  }
  GetEquipmentList(clientid: number) {
  var reqBody = {
    ClientId: clientid
  };
    return this.http.post<any>(Master_URL + '/EquipmentType/list', reqBody)
    .pipe(map(response => {
      return response;
    }));
  }

  GetEquipmentFreightMode(clientid: number, freightmodeid: number) {
    var reqBody = {
      ClientID: clientid,
      FreightModeID: freightmodeid
    };
    return this.http.post<any>(Master_URL + '/EquipmentType/GetEquipmentsonFreightMode', reqBody)
  }

  GetEquipmentListNew(FreightLane: FreightLane) {
    
    return this.http.post<any>(Master_URL + '/EquipmentType/list', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }
  GetCarrierList(clientid: number) {
  var reqBody = {
    ClientId: clientid
  };
    return this.http.post<any>(Master_URL + '/Carrier/GetCarrierList', reqBody)
    .pipe(map(response => {
      return response;
    }));
  }

  GetCarrierListNew(FreightLane: FreightLane) {
   
    return this.http.post<any>(Master_URL + '/Carrier/list', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }

  GetUOMListNew(FreightLane: FreightLane) {
    
    return this.http.post<any>(Master_URL + '/Uom/list', FreightLane)
      .pipe(map(response => {
        return response;
      }));
  }

  GetUOMList(clientid: number) {
  var reqBody = {
    ClientId: clientid
  };
    return this.http.post<any>(Master_URL + '/Uom/list', reqBody)
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
  
  GetById(ids: string) {
    const body = { IDs: ids }
    return this.http.post<any>(BASE_URL + '/FreightLane/GetFrightLaneListByIDs', body)
      .pipe(map(response => {
        return response;
      }));
  }
  
  
}
