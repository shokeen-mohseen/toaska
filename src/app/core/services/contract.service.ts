import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, ɵCompiler_compileModuleAndAllComponentsAsync__POST_R3__ } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { Contract, ContractObjectViewModel, ContractDetails, ContractViewModel, DefineCharacteristics } from '../models/contract.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';


const BASE_URL = env.coreBaseApiUrl;
const Master_URL = env.masterServerUrl;
@Injectable({
  providedIn: 'root'
})

export class ContractService extends BaseService{
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  
  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }
  savedData: any;
  LocationID: number;
  ID: number;
  ContractTypeId: number;
  Permission: boolean = false;
  
  getContractTypeList(modal:Contract) {
    return this.http.post<any>(`${Master_URL}/contracttype/list`, modal , this.httpOptions)
      .pipe(map(contractTypeList => {
        return contractTypeList.data.map(r => ({ id: r.id, itemName: r.name }));
      }));
  }

  getContractTypeListNew(clientid: number) {
    var reqBody = {
      ClientId: clientid
    }
    return this.http.post<any>(`${Master_URL}/ContractType/List`, reqBody, this.httpOptions)
  }

  getContractBusinessPartner(clientid: number) {
    var reqBody = {
      clientID: clientid
    }
    return this.http.post<any>(`${Master_URL}/LocationFunction/List`, reqBody, this.httpOptions)
  }

  getCustomerShipLocation(model: Contract) {
    model.pageNo = 0;
    model.pageSize = 0;
    return this.http.post<any>(`${BASE_URL}/Location/list`, model, this.httpOptions)
      .pipe(map(customerShipList => {
        var locationdata = customerShipList.data.filter((e) => (e.isActive == true && e.isDeleted == false && e.setupComplete == true));      
        var location = locationdata.sort(this.sortOn("name"));
        return location.map(r => ({ id: r.id, itemName: r.code +' - '+r.name }));
      }));
  }

  GetBillingEntity(LocationTypeCode: string, ClientId: number): Observable<any> {
    var modal = { ClientId: ClientId, LocationTypeCode: LocationTypeCode };
    return this.http.post<any>(`${BASE_URL}/Location/GetLocation`, modal, this.httpOptions)
      .pipe(map(billingEntityList => {
        var locationdata = billingEntityList.data.filter((e) => (e.isActive == true && e.isDeleted == false && e.setupComplete == true));
        var location = locationdata.sort(this.sortOn("name"));
        return location.map(r => ({ id: r.id, itemName: r.code + ' - ' + r.name }));
      }));
  }

  getCustomerList(clientid: number, customer: string): Observable<any> {
    var reqBody = {
      ClientId: clientid,
      LocationTypeCode: customer
    }
    return this.http.post<any>(`${BASE_URL}/Location/GetLocation`, reqBody, this.httpOptions)
      .pipe(map(billingEntityList => {
        var locationdata = billingEntityList.data.filter((e) => (e.isActive == true && e.isDeleted == false && e.setupComplete == true));
        var location = locationdata.sort(this.sortOn("name"));
        return location.map(r => ({ id: r.id, itemName: r.code + ' - ' + r.name }));
      }));
  }

  getContractList(modal: Contract) {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/GetAllContract`, modal,this.httpOptions)
      .pipe(map(contractList => {
        return contractList;
      }));
  }
    
  getContractById(modal: ContractViewModel): Observable<any> {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/GetContractById`, { ClientID: modal.ClientID, ID: modal.ID, ContractTypeId:modal.ContractTypeId}, this.httpOptions)
      .pipe(map(contractList => {
        return contractList;
      }));
  }
  getContractLatestExist(modal: ContractViewModel): Observable<any> {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/CheckLatestExist`, { ClientID: modal.ClientID, ID: modal.ID, ContractTypeId: modal.ContractTypeId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getLocationIds(modal: ContractObjectViewModel): Observable<any> {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/GetLocationsIds`, { ClientId: modal.ClientId, ContractTypeId: modal.ContractTypeId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getTotalCount(modal: Contract): Observable<any> {
    modal.pageNo = 0;
    modal.pageSize = 0;
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/AllContractCount`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  saveContract(modal: ContractObjectViewModel): Observable<any> {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  CheckContract(modal: ContractObjectViewModel): Observable<any> {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/CheckExist`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  UpdateContract(modal: ContractObjectViewModel): Observable<any> {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/update`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getCommentsLocation(id: number) {
    return this.http.get<any>(`${env.coreBaseApiUrl}/Location/id?id=${id}`)
      .pipe(map(res => {
          return res;
      }));
  }
  SendApproveNotification(modal: ContractObjectViewModel): Observable<any> {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/SendApprovalNotification`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getModulePermission(ModuleRoleCode, ClientId, UserId) {
    return this.http.post<any>(`${env.serverUrl}/ModuleRolePermission/GetPermission`, { ModuleRoleCode, ClientId, UserId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getContractTypeId(id: number) {
    return this.http.get<any>(`${env.masterServerUrl}/ContractType/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
  setContractApprove(modal: ContractViewModel): Observable<any> {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/ContractApprove`, {ID:modal.ID,ContractTypeId:modal.ContractTypeId}, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getMaterialDescription(modal: Contract): Observable<any> {
    modal.pageNo = 1;
    modal.pageSize = 500;
    return this.http.post<any>(`${BASE_URL}/Material/List`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
   
  getChargeDescription(modal: Contract): Observable<any> {
    modal.pageNo = 1;
    modal.pageSize = 500;
    return this.http.post<any>(`${BASE_URL}/Charge/GetChargeDetails`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));     
  }
  getCommodityList(modal: Contract): Observable<any> {
    modal.pageNo = 1;
    modal.pageSize = 500;
    return this.http.post<any>(`${BASE_URL}/Commodity/GetAllCom`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getChargeComputationMethod(): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/ChargeComputationMethod/List`, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getPriceMethodTypeList(modal: Contract): Observable<any> {
     return this.http.post<any>(`${Master_URL}/PriceMethodType/List`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getPriceIncreaseMethodTypeList(modal: Contract): Observable<any> {
    return this.http.post<any>(`${Master_URL}/PriceIncreaseMethodType/List`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getSalesTaxList(modal: Contract): Observable<any> {   
    return this.http.post<any>(`${Master_URL}/SalesTaxClass/List`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getUomList(modal: Contract): Observable<any> {
    return this.http.post<any>(`${Master_URL}/Uom/List`, modal, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  SaveContractDetails(flagViewModel: ContractDetails[]): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/SaveContractDetails`, flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  DeleteContractDetails(viewModel: ContractDetails): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/DeleteContractDetails`, viewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getContractDetails(ClientId, ContractTypeId, ParentId): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/GetContractDetails`, { ClientId, ContractTypeId, ParentId}, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getContractDetailsByIds(ClientId, ContractTypeId, ParentId): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/GetContractDetailsByIds`, { ClientId, ContractTypeId, ParentId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getCharacteristics(): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/Contract/GetCharacteristic`, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  GetDefineCharacteristics(flagViewModel: ContractViewModel): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/GetCharacteristicById`, flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  SaveDefineCharacteristics(flagViewModel: DefineCharacteristics[]): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/SaveDefiningCharacteristics`, flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  DeleteDefiningCharacteristics(flagViewModel: DefineCharacteristics[]): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/DeleteDefiningCharacteristics`, flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  DeleteContract(model: ContractViewModel[]): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/DeleteContracts`, model, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  ActiveContracts(model: ContractViewModel[]): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/ActiveContracts`, model, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  InactiveContracts(model: ContractViewModel[]): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/InactiveContracts`, model, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getFuelPrice(locationId:number): Observable<any> {
    var entityPropertyCode = "MilesOverrideForCustomerFuelCharge";
    return this.http.post<any>(`${BASE_URL}/CustomerPropertyDetail/List`, { entityPropertyCode, locationId}, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getExistingCharacteristics(requestObj: { LocationId: number; ClientId: number; }) {
    return this.http.post<any>(`${BASE_URL}/location/GetExistingCharacteristics`, requestObj, this.httpOptions)
      .pipe(map(response => {
        return response;
      }));
  }

  GetChargesAndCharacteristicsFrom(modal: ContractObjectViewModel) {
    return this.http.post<any>(`${env.coreBaseApiUrl}/Contract/GetChargesAndCharacteristicsFrom`, modal, this.httpOptions)
      .pipe(map(contractList => {
        return contractList;
      }));
  }

  SaveAndUpdateContractDetails(flagViewModel: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/Contract/SaveAndUpdateContractDetail`, flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }


  sortOn(property) {
  return function (a, b) {
    if (a[property] < b[property]) {
      return -1;
    } else if (a[property] > b[property]) {
      return 1;
    } else {
      return 0;
    }
  }
  }


  GetAllCustomManageFilters(ClientId: number, UserId: number,Code:string) {
    return this.http.get<any>(`${env.coreBaseApiUrl}/SalesOrder/GetApplyCustomManageFilters?clientId=` + ClientId + "&userId=" + UserId + "&Code=" + Code)
      .pipe(map(customFilterData => {
        return customFilterData;
      }));
  }
}
