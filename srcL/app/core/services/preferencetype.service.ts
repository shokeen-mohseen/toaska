import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { PreferenceType, PreferenceTypeViewModel } from '../models/preferencetype.model';

const MASTER_URL = env.masterServerUrl;
@Injectable({
  providedIn: 'root'
})

export class PreferenceTypeService {
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

  public ThresHoldPeriodDaysForCredit: BehaviorSubject<any>;
  public ThresHoldPeriodDaysForCreditObj: Observable<any>;
  public DefaultNumberOfdaysinShipmentMaterialPlaningReport: BehaviorSubject<any>;
 
  public DefaultNumberOfdaysinShipmentMaterialPlaningReportObj: Observable<any>;
  

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

    this.ThresHoldPeriodDaysForCredit = new BehaviorSubject<number>(0);
    this.ThresHoldPeriodDaysForCreditObj = this.ThresHoldPeriodDaysForCredit.asObservable();


    this.DefaultDecimalPlacesForMoney = new BehaviorSubject<number>(0);
    this.DefaultDecimalPlacesForMoneyObj = this.DefaultDecimalPlacesForMoney.asObservable();

    this.DefaultNumberOfdaysinShipmentMaterialPlaningReport = new BehaviorSubject<number>(0);
    this.DefaultNumberOfdaysinShipmentMaterialPlaningReportObj = this.DefaultNumberOfdaysinShipmentMaterialPlaningReport.asObservable();
    
    
  }

  

  getAllPreferenceType(ptModal: PreferenceType) {
    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetAllPreferenceType', ptModal, this.httpOptions)
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
