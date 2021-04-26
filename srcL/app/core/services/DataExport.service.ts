import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { regularOrderModel, PeriodicElement, CommonOrderModel, SaveVerifyEquipmentMaterialProperty, MaterialPropertyGrid } from '../../core/models/regularOrder.model';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
import { UserRolesListViewModel, User } from '..';

@Injectable({
  providedIn: 'root'
})
export class DataExportService extends BaseService {

  public userAccess: Observable<any>;
  public userAccessSubject: BehaviorSubject<any>;
  public SalesOrderforEdit: any[] = [];
  public SalesOrderSendToMass = [];
  public SalesOrderReSendToMass = [];
  public EditingSalesOrder: any;
  public CurrentEditOrderNumber: string;

  constructor(private jsonApiService: JsonApiService, private http: HttpClient, private authservices: AuthService
    , preferenceService: PreferenceTypeService) {
    super(preferenceService);
    this.userAccessSubject = new BehaviorSubject<Array<PeriodicElement>>([]);
    this.userAccess = this.userAccessSubject.asObservable();
  }

  GenerateExportReport(jsonFilter: string,reportCode:string) {
    var exportRequestObject = {
      DocumentTypeCode: reportCode,
      ClientID: this.authservices.currentUserValue.ClientId,
      SourceSystemID: this.authservices.currentUserValue.SourceSystemID,
      CreatedBy: this.authservices.currentUserValue.LoginId,
      FilterParameter: jsonFilter,
      CreateDateTimeBrowser : new Date()
    };

    return this.http.post<any>(`${environment.commonServerUrl}/ExportReport/GenerateExcelReport`, exportRequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

 

  GetExportReport( reportCode: string) {
    var exportRequestObject = {
      DocumentTypeCode: reportCode,
      ClientID: this.authservices.currentUserValue.ClientId,
      SourceSystemID: this.authservices.currentUserValue.SourceSystemID,
      CreatedBy: this.authservices.currentUserValue.LoginId     
    };

    return this.http.post<any>(`${environment.commonServerUrl}/ExportReport/GetAllReportList`, exportRequestObject)
      .pipe(map(result => {
        return result;
      }));
  }
  
}

