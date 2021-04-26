import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
import { CommonOrderModel, regularOrderModel } from '../models/regularOrder.model';



@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };


  constructor(private jsonApiService: JsonApiService, private http: HttpClient, private authservices: AuthService
    , preferenceService: PreferenceTypeService) {
    super(preferenceService);

  }

  OrderTypeList() {
    return this.http.post<any>(`${environment.masterServerUrl}/OrderType/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }
  CarrierListAll() {
    return this.http.post<any>(`${environment.masterServerUrl}/Carrier/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }
  OrderStatusAllList() {
    return this.http.post<any>(`${environment.masterServerUrl}/OrderStatus/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }

  OrderConditionList() {
    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.masterServerUrl}/OrderStatus/OrderConditionList`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  ShipToTypeAllData(commonOrderModel: CommonOrderModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipToTypeAllDataList`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  ShipFromTypeAllData(commonOrderModel: CommonOrderModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipFromTypeAllDataList`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  ShipFromLocationAllData(commonOrderModel: CommonOrderModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/GetShipFromLocationAllDataList`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }

  ShipToLocationAllData(commonOrderModel: CommonOrderModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/GetShipToLocationAllDataList`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  GetMaterialList() {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }

  InvoiceDataList(ClientId: number) {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetAllInvoiceNo?ClientId=` + ClientId)
      .pipe(map(user => {
        return user;
      }));
  }

  SourceDataList(ClientId: number) {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetAllSourceList?ClientId=` + ClientId)
      .pipe(map(source => {
        return source;
      }));
  }
  SalesManagersList(role: string) {
    return this.http.get<any>(`${environment.serverUrl}/UserRoleList/AllUserListByRole?role=` + role)
      .pipe(map(user => {
        return user;
      }));
  }
  GetSalesOrderHistoryDetailList(paginationModel: regularOrderModel) {
    paginationModel.UserLoginID = this.authservices.currentUserValue.LoginId;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetSalesOrderHistoryList`,
      paginationModel)
      .pipe(map(salesOrder => {
        return salesOrder;
      }));
  }

  GetSalesOrderData(ClientID: number, OrderID: number, OrderType: string) {
    var AllData = { ClientID: ClientID, OrderID: OrderID, OrderType: OrderType};
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetSalesOrderHistoryData`, AllData)
      .pipe(map(FilterData => {
        return FilterData;
      }));
  }


  GetSalesOrderDetailsData(ClientID: number, OrderID: number, OrderType: string) {
    var AllData = { ClientID: ClientID, OrderID: OrderID, OrderType: OrderType};
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetSalesOrderDetailsHistoryData`, AllData)
      .pipe(map(FilterData => {
        return FilterData;
      }));
  }
}

