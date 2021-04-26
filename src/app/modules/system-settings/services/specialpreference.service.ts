import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { environment as env } from '@env/environment';
import { PreferenceType, PreferenceTypeViewModel } from '../../../core/models/preferencetype.model';
import { PreferenceTypeCategory } from '../../../core/models/preferencetypecategory.model';
import { SendObject } from '../../plan/pages/models/send-object';
import { regularOrderModel } from '../../../core/models/regularOrder.model';
import { PreferenceTypeService } from '../../../core';
import { BaseService } from '../../../core/services/base.service';
import { AuthService } from '../../../core';
const MASTER_URL = env.masterServerUrl;
const BASE_URL = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})

export class SpecialPreferenceService {
  Permission: boolean = false;
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  public pageSize: BehaviorSubject<any>;
  public pageSizeObj: Observable<any>;
  public editRecordCount: BehaviorSubject<any>; //MaximumValueForNoOfPalletsInAnEquipment
  public editCountObj: Observable<any>;
  public DefaultDecimalPlacesForMoney: BehaviorSubject<any>;
  public DefaultDecimalPlacesForMoneyObj: Observable<any>;
  public MaxValForNoOfUnitsOnAPallet: BehaviorSubject<any>;
  public MaxValForNoOfUnitsOnAPalletObj: Observable<any>;
  public MaxLengthOfMaterialDesc: BehaviorSubject<any>;
  public MaxLengthOfMaterialDescObj: Observable<any>;
  public MaxValForNoOfUnitsInAnEquipment: BehaviorSubject<any>;
  public MaxValForNoOfUnitsInAnEquipmentObj: Observable<any>;
  public MaxValForNoOfPalletsInAnEquipment: BehaviorSubject<any>;
  public MaxValForNoOfPalletsInAnEquipmentObj: Observable<any>;
  constructor(private http: HttpClient, private authenticationService: AuthService) {
    this.pageSize = new BehaviorSubject<number>(0);
    this.pageSizeObj = this.pageSize.asObservable();
    this.editRecordCount = new BehaviorSubject<number>(0);
    this.editCountObj = this.editRecordCount.asObservable();
    this.MaxValForNoOfUnitsOnAPallet = new BehaviorSubject<number>(0);
    this.MaxValForNoOfUnitsOnAPalletObj = this.MaxValForNoOfUnitsOnAPallet.asObservable();
    this.MaxLengthOfMaterialDesc = new BehaviorSubject<number>(0);
    this.MaxLengthOfMaterialDescObj = this.MaxLengthOfMaterialDesc.asObservable();
    this.MaxValForNoOfUnitsInAnEquipment = new BehaviorSubject<number>(0);
    this.MaxValForNoOfUnitsInAnEquipmentObj = this.MaxValForNoOfUnitsInAnEquipment.asObservable();
    this.MaxValForNoOfPalletsInAnEquipment = new BehaviorSubject<number>(0);
    this.MaxValForNoOfPalletsInAnEquipmentObj = this.MaxValForNoOfPalletsInAnEquipment.asObservable();
    this.DefaultDecimalPlacesForMoney = new BehaviorSubject<number>(0);
    this.DefaultDecimalPlacesForMoneyObj = this.DefaultDecimalPlacesForMoney.asObservable();
  }
  getAllPreferenceType(ptModal: PreferenceType) {
    ptModal.ClientId = this.authenticationService.currentUserValue.ClientId;
    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetAllPreferenceType', ptModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  getPreferenceCategoryType(ptcModal: PreferenceTypeCategory) {
    ptcModal.clientId = this.authenticationService.currentUserValue.ClientId;
    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetPreferenceCategoryType', ptcModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  getPreferenceTypeDataList() {
    return this.http.get<any>(MASTER_URL + '/PreferenceType/list')
      .pipe(map(response => {
        return response;
      }));
  }
  getAllRecords(ptModal: PreferenceType) {
     ptModal.ClientId = this.authenticationService.currentUserValue.ClientId;
    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetAllRecords', ptModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  getCarrierList(clientid: number) {
    var reqBody = {
      ClientId: clientid
    };
    return this.http.post<any>(MASTER_URL + '/Carrier/GetCarrierList', reqBody, this.httpOptions)
  }

  getOperatingLocation(clientid: number) {
    var req = {
      ClientID: clientid
    };
    return this.http.post<any>(BASE_URL + '/Location/GetAllOperatingLocationList', req, this.httpOptions)
  }

  getMaterialList(orderid: number, sectionid: number, clientid: number) {
    var reqBody = {
      OrderID: orderid,
      SectionID: sectionid,
      ClientId: clientid
    };
    return this.http.post<any>(BASE_URL + '/Material/OrderMaterialList', reqBody, this.httpOptions)
  }
  getEquipmentTypeList(clientid: number) {
    var reqBody = {
      ClientId: clientid
    };
    return this.http.post<any>(MASTER_URL + '/EquipmentType/List', reqBody, this.httpOptions)
  }
  getPreferenceTypeByCode(ptCode: string) {
    var data = {
      Code: ptCode
    };
    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetPreferenceTypeByCode', data, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  updatePreferenceType(ptModal: PreferenceType) {
    ptModal.ClientId = this.authenticationService.currentUserValue.ClientId;
    return this.http.post<any>(MASTER_URL + '/PreferenceType/UpdatePreference', ptModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  deleteAllPrefernceType(ids: string) {
    const body = { IDs: ids }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<PreferenceType>(MASTER_URL + '/PreferenceType/DeleteAll', body, this.httpOptions);
  }
}






