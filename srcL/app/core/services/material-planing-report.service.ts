import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MaterialPlaningreport, PeriodicElement, CommonOrderModel, SaveVerifyEquipmentMaterialProperty, MaterialPropertyGrid } from '../../core/models/regularOrder.model';
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
export class MaterialPlaningReportService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  
  //to handle custom filter
 

  constructor(private jsonApiService: JsonApiService, private http: HttpClient, private authservices: AuthService
    , preferenceService: PreferenceTypeService) {
    super(preferenceService);
   
   
  }

  ShipTypeData(ClientID: number, Code:string) {
    var RequestObject = {
      ClientID: ClientID,
      Code: Code
    };
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipTypeList`, RequestObject)
      .pipe(map(user => {
        return user;
      }));
  }

  ShipLocationData(ClientID: number, LocationFunctionID: number) {
    var RequestObject = {
      ClientID: ClientID,
      LocationTypeCode: LocationFunctionID
    };
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipLocationList`, RequestObject)
      .pipe(map(user => {
        return user;
      }));
  }

  GetMaterialPlaningreportDetailList(paginationModel: MaterialPlaningreport) {

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetMaterialPlaningreportList`,
      paginationModel)
      .pipe(map(salesOrder => {
        return salesOrder;
      }));
  }

  GetMaterialSummaryreportDetailList(paginationModel: MaterialPlaningreport) {

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetMaterialsummaryReportList`,
      paginationModel)
      .pipe(map(salesOrder => {
        return salesOrder;
      }));
  }

  getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId) {
    return this.http.post<any>(`${environment.serverUrl}/ModuleRolePermission/GetControlPermissionByRole`, { ModuleRoleCode, ClientId, LoginId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
}

