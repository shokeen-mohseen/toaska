import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment as env, environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
import { Claim, ClaimModel } from '../models/claim.model';

const BASE_URL = env.coreBaseApiUrl;
const Master_URL = env.masterServerUrl;
@Injectable({
  providedIn: 'root'
})

export class ClaimService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  public ClaimforEdit: any[] = [];
  public ClaimFilterDataList: any[] = [];
  public ClaimData: any;

  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }


  GetClaimStatus(modal: Claim): Observable<any> {
    return this.http.post<any>(`${Master_URL}/claimstatus/list`, modal, this.httpOptions)
      .pipe(map(claimStatusList => {
        return claimStatusList.data.map(r => ({ id: r.id, itemName: r.name, Code: r.code }));
      }));
  }
  GetBillingEntity(LocationTypeCode: string, ClientId: number): Observable<any> {
    var modal = { ClientId: ClientId, LocationTypeCode: LocationTypeCode };
    return this.http.post<any>(`${BASE_URL}/Location/GetLocation`, modal, this.httpOptions)
      .pipe(map(billingEntityList => {
        var locationdata = billingEntityList.data.filter((e) => (e.isActive == true && e.isDeleted == false && e.setupComplete == true));
        return locationdata;
      }));
  }
  GetShipmentDetails(modal: Claim): Observable<any> {
    var modalobject = { InboundOutbound: 'outbound', ClientId: modal.ClientId, SortOrder: 'DESC', UpdatedBy: modal.UpdatedBy }
    return this.http.post<any>(`${BASE_URL}/shipment/GetShipmentDetailsAll`, modalobject, this.httpOptions)
      .pipe(map(shipmentList => {
        return shipmentList;
      }));
  }

  GetClaimList(modal: Claim): Observable<any> {
    var modalobject = {
      ClientID: modal.ClientId, SortOrder: modal.sortOrder, SortColumn: modal.sortColumn, FilterOn: modal.filterOn,
      PageNo: modal.pageNo, PageSize: modal.pageSize
    }
    return this.http.post<any>(`${BASE_URL}/Claim/GetClaimList`, modalobject, this.httpOptions)
      .pipe(map(claimList => {
        return claimList;
      }));
  }
  DeleteClaimRecords(UserId: number, ClientID: number, SelectedRecords: any) {

    return this.http.get<any>(`${BASE_URL}/Claim/DeleteClaimSelectedRecords?userId=` + UserId + '&clientID=' + ClientID + '&selectedRecords=' + SelectedRecords)
      .pipe(map(claimData => {
        return claimData;
      }));
  }

  getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId) {
    return this.http.post<any>(`${environment.serverUrl}/ModuleRolePermission/GetControlPermissionByRole`, { ModuleRoleCode, ClientId, LoginId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  GetClaimByClaimId(ClaimId: number, ClientId: number): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/Claim/GetClaimByClaimId?ClaimId=` + ClaimId + '&ClientId=' + ClientId)
      .pipe(map(claimData => {
        return claimData;
      }));
  }

  GetClaimFor(modal: Claim): Observable<any> {
    return this.http.post<any>(`${Master_URL}/ClaimFor/list`, modal, this.httpOptions)
      .pipe(map(claimforList => {
        return claimforList.data.map(r => ({ id: r.id, itemName: r.name, Code: r.code }));
      }));
  }

  GetClaimFilterData(ShipmentID: number, ClientID: number, OrderID: number, ClaimID: number, ClaimFor: number) {

    var AllData = { ShipmentID: ShipmentID, ClientID: ClientID, OrderID: OrderID, ClaimID: ClaimID, ClaimFor: ClaimFor };
    return this.http.post<any>(`${BASE_URL}/Claim/GetFilterClaimData`, AllData)
      .pipe(map(ClaimFilterData => {
        return ClaimFilterData;
      }));
  }
  SetCompleteSetupAndNotify(ClientId: number, ClaimId: number, IsSetupAndNotify: boolean, ClaimStatusId: number, UserId: number, updateDateTimeBrowserStr: string): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/Claim/SetCompleteSetupAndNotify?clientId=` + ClientId + '&claimId=' + ClaimId + '&isCompleteSetupAndNotify=' + IsSetupAndNotify + '&claimStatusId=' + ClaimStatusId + '&userId=' + UserId + '&updateDateTimeBrowserStr=' + updateDateTimeBrowserStr)
      .pipe(map(claimData => {
        return claimData;
      }));
  }

  GetBillingEntityForBP(ClientId: number): Observable<any> {
    var modal = { ClientId: ClientId };
    return this.http.post<any>(`${BASE_URL}/Location/GetBillingEntityForBP`, modal, this.httpOptions)
      .pipe(map(billingEntityList => {
        var locationdata = billingEntityList.data;
        return locationdata;
      }));
  }
  //GetBillingEntityForCustomer
  GetBillingEntityForCustomer(ClientId: number): Observable<any> {
    var modal = { ClientId: ClientId };
    return this.http.post<any>(`${BASE_URL}/Location/GetBillingEntityForCustomer`, modal, this.httpOptions)
      .pipe(map(billingEntityList => {
        var locationdata = billingEntityList.data;
        return locationdata;
      }));
  }


  GetShipmentNumberDetails(modal: ClaimModel): Observable<any> {
    var modalobject = { ClientID: modal.ClientID, shipdatefrom: modal.FromshipdatecalendarDate, shipdateto: modal.ToshipdatecalendarDate }
    return this.http.post<any>(`${BASE_URL}/SalesOrder/GetShipmentNumberDetails`, modalobject, this.httpOptions)
      .pipe(map(shipmentList => {
        return shipmentList;
      }));
  }

  GetOrderNumberDetails(modal: ClaimModel): Observable<any> {
    var modalobject = { ClientID: modal.ClientID, shipdatefrom: modal.FromshipdatecalendarDate, shipdateto: modal.ToshipdatecalendarDate }
    return this.http.post<any>(`${BASE_URL}/SalesOrder/GetOrderNumberDetails`, modalobject, this.httpOptions)
      .pipe(map(shipmentList => {
        return shipmentList;
      }));
  }

  GetShipmentIdNumberDetails(modal: ClaimModel, ShipmentID: number): Observable<any> {
    var modalobject = { ClientID: modal.ClientID, shipdatefrom: modal.FromshipdatecalendarDate, shipdateto: modal.ToshipdatecalendarDate, ShipmentID: ShipmentID }
    return this.http.post<any>(`${BASE_URL}/SalesOrder/GetShipmentNumberWithShipmentID`, modalobject, this.httpOptions)
      .pipe(map(shipmentList => {
        return shipmentList;
      }));
  }

  GetOrderIdNumberDetails(modal: ClaimModel, ShipmentID: number): Observable<any> {
    var modalobject = { ClientID: modal.ClientID, shipdatefrom: modal.FromshipdatecalendarDate, shipdateto: modal.ToshipdatecalendarDate, ShipmentID: ShipmentID }
    return this.http.post<any>(`${BASE_URL}/SalesOrder/GetOrderNumberWithShipmentID`, modalobject, this.httpOptions)
      .pipe(map(shipmentList => {
        return shipmentList;
      }));
  }

  SetApprovedClaim(ClientId: number, ClaimId: number, IsApproved: boolean, ClaimStatusId: number, UserId: number, updateDateTimeBrowserStr: string): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/Claim/ClaimApproved/?clientId=` + ClientId + '&claimId=' + ClaimId + '&isApproved=' + IsApproved + '&claimStatusId=' + ClaimStatusId + '&userId=' + UserId + '&updateDateTimeBrowserStr=' + updateDateTimeBrowserStr)
      .pipe(map(claimData => {
        return claimData;
      }));
  }
  GetCharge(ClientID: number, Category: number) {

    var AllData = { ClientID: ClientID, Category: Category };
    return this.http.post<any>(`${BASE_URL}/Charge/GetCharge`, AllData)
      .pipe(map(ClaimFilterData => {
        return ClaimFilterData;
      }));
  }

  Save(RequestedObject: any) {

    return this.http.post<any>(`${BASE_URL}/Claim/SaveClaimDetail`, RequestedObject)
      .pipe(map(ClaimFilterData => {
        return ClaimFilterData;
      }));
  }

  Saveclaim(RequestedObject: any) {

    return this.http.post<any>(`${BASE_URL}/Claim/SaveClaim`, RequestedObject)
      .pipe(map(ClaimFilterData => {
        return ClaimFilterData;
      }));
  }

  SaveMultiData(multiClaimModel: any) {

    return this.http.post<any>(`${BASE_URL}/Claim/SaveMultiClaimDetail`, multiClaimModel)
      .pipe(map(ClaimFilterData => {
        return ClaimFilterData;
      }));
  }

  DeleteMultiData(multiClaimModel: any) {

    return this.http.post<any>(`${BASE_URL}/Claim/DeleteClaimDetail`, multiClaimModel)
      .pipe(map(ClaimFilterData => {
        return ClaimFilterData;
      }));
  }

}
