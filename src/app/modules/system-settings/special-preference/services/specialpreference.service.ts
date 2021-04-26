import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment as env } from '@env/environment';
import { PreferenceType } from '../../../../core/models/preferencetype.model';
import { PreferenceTypeCategory } from '../../../../core/models/preferencetypecategory.model';


const MASTER_URL = env.masterServerUrl;
@Injectable({
  providedIn: 'root'
})

export class SpecialPreferenceService {
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
  constructor(private http: HttpClient) {

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
    ptModal.ClientId = 100;

    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetAllPreferenceType', ptModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  getPreferenceCategoryType(ptcModal: PreferenceTypeCategory) {
    ptcModal.clientId = 100;

    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetPreferenceCategoryType', ptcModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  getPreferenceTypeDataList() {
    return this.http.get<any>(MASTER_URL +'/PreferenceType/list')
      .pipe(map(response => {
        return response;
      }));
  }
  getAllRecords(ptModal: PreferenceType) {
    ptModal.ClientId = 100;

    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetAllRecords', ptModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
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
  
}






