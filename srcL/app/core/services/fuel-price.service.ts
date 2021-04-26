import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
//import { PreferenceTypeService } from '.';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { PreferenceTypeService, UsersContactViewModel } from '..';
import { map } from 'rxjs/operators';
import { FuelPriceViewModel } from '../models/fuel';
import { FuelChargeIndex, FuelSurCharge } from '../models/FuelChargeIndex.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FuelPriceService extends BaseService{

  constructor(private http: HttpClient, private authservices: AuthService,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }
  permission: boolean = false;

  

  getCountryList(clientId: number) {
    var RequestObject = {
      ClientID: clientId
    };
    return this.http.post<any>(`${environment.serverUrl}/Country/GetCountryListForFuelPrice`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  getFuelPriceById(viewModel: FuelPriceViewModel) {
    //var RequestObject = {
    //  selectedIds: id
    //};
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelPrice/GetById`, viewModel)
      .pipe(map(result => {
        return result;
      }));
  }
  getFuelPriceTypeList(clientId: number) {    
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/GetFuelPriceType?ClientID=${clientId}`, clientId)
      .pipe(map(result => {
        return result;
      }));
  }

  getAdditionalFuelCharge(code: string) {
    const reqBody = {
      Code: code
    }
    return this.http.post<any>(`${environment.masterServerUrl}/PreferenceType/GetPreferenceTypeByCode`, reqBody);
  }

  deleteAllFuelSurchargeIndex(ids: string) {
    const body = { IDs: ids }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FuelChargeIndex>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/DeleteAll`, body, httpOptions);
  }

  getChargeRateUOMList(clientId: number) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/ChargeRateUOM?ClientID=${clientId}`, clientId)
      .pipe(map(result => {
        return result;
      }));
  }
  getFuelSurchargeIndexList() {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/list`)
      .pipe(map(response => {
        return response;
      }));
  }
  getAllFuelSurchargeIndexList(paginationModel: FuelChargeIndex) {

    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/getAll`, paginationModel, httpOptions)
      .pipe(map(response => {

        return response;
      }));
  }

  getTotalCount(paginationModel: FuelChargeIndex): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/Count`, paginationModel, httpOptions);
  }


  SaveFuelSurChargeIndex(FuelChargeIndex: FuelChargeIndex[]) {
    FuelChargeIndex[0].clientID = this.authservices.currentUserValue.ClientId;
    FuelChargeIndex[0].sourceSystemId = this.authservices.currentUserValue.SourceSystemID;
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/Post`, FuelChargeIndex[0], httpOptions)
      .pipe(map(response => {
        return response;
      }));
  }

  saveAllFuelSurChargeIndex(FuelChargeIndex: any[]) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/SaveAll`, FuelChargeIndex, httpOptions);
  }

  updateSurChargeIndex(FuelChargeIndex: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FuelChargeIndex>(`${environment.coreBaseApiUrl}/FuelSurChargeIndx/UpdateFuelIndex`, FuelChargeIndex, httpOptions);
  }

  getFuelUOMList(clientId: number) {
    var RequestObject = {     
      ClientID: clientId
    };

    return this.http.post<any>(`${environment.masterServerUrl}/UOM/UomListFuel`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  saveFuelPrice(viewModel: FuelPriceViewModel) {
    viewModel.sourceSystemId = this.authservices.currentUserValue.SourceSystemID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelPrice`, viewModel)
      .pipe(map(result => {
        return result;
      }));
  }

  checkDuplicateValue(viewModel: FuelPriceViewModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelPrice/CheckDuplicate`, viewModel)
      .pipe(map(result => {
        return result;
      }));
  }

  updateFuelPrice(viewModel: FuelPriceViewModel) {
    viewModel.sourceSystemId = this.authservices.currentUserValue.SourceSystemID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelPrice/update`, viewModel)
      .pipe(map(result => {
        return result;
      }));
  }

  getFuelPriceList(paginationModel: FuelPriceViewModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelPrice/GetFuelList`,
      paginationModel)
      .pipe(map(result => {
        return result;
      }));
  }
  deleteFuelPriceById(viewModel: FuelPriceViewModel) {
    //var RequestObject = {
    //  selectedIds: id
    //};
    //viewModel.sourceSystemId = this.authservices.currentUserValue.SourceSystemID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FuelPrice/deletebyIds`, viewModel)
      .pipe(map(result => {
        return result;
      }));
  }

  getPrefrenceValueByCode(code: string) {
    var RequestObject = {
      Code: code
    };
    return this.http.post<any>(`${environment.masterServerUrl}/PreferenceType/GetPreferenceTypeByCode`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }
}
