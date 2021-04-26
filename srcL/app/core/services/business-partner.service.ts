import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BPByLocation, BPByCarrier } from '../models/BusinessPartner.model';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
import { LocationFunctionViewModel } from '../models/LocationFunction';

@Injectable({
  providedIn: 'root'
})

export class BusinessPartnerService extends BaseService {

  businessPartnerHasReadOnlyAccess: boolean = false;
  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getBPByLocation(paginationModel: BPByLocation) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/GetByLocation`,
      paginationModel)
      .pipe(map(charge => {
        return charge;
      }));
  }

  getBPByCarrier(paginationModel: BPByCarrier) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/GetByCarier`,
      paginationModel)
      .pipe(map(charge => {
        return charge;
      }));
  }

  getLocationFunctionList(requestObj: any) {

    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/LocationFunction/list`,
      requestObj)
      .pipe(map(charge => {
        return charge;
      }));
  }

  getLocationFunctionListNew(ClientId: number) {
    var RequestObject = {
      ClientID: ClientId
    };
    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/LocationFunction/list`,
      RequestObject)
      .pipe(map(charge => {
        return charge;
      }));
  }
  getOrgnizationList(clientid: number) {
    var req = {
      ClientId: clientid
    }
    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/Organization/GetAllRecords`, req)
  }

  getSalesmanagerList() {
    return this.http.get<any>(`${this.SERVER_SERVICE_URL}/UserRoleList/AllUserListByRole?role=salesmanager`);
  }

  getCustomerBusinessPartnerBillingEntity(ClientId: number, locationTypeCode: string) {
    var RequestObject = {
      ClientID: ClientId,
      LocationTypeCode: locationTypeCode
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/GetCustomBillingEntity`,
      RequestObject);
  }


  getOrderStatusName(ClientId: number) {
    var RequestObject = {
      ClientID: ClientId
    };
    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/OrderStatus/List`,
      RequestObject);
  }


  getBillingEntityCarrier(ClientId: number) {
    var RequestObject = {
      ClientID: ClientId
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/GetBillingEntityCarrier`,
      RequestObject)
      .pipe(map(charge => {
        return charge;
      }));
  }

  updateBPByLocation(saveObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/update/BpByLocation`,
      saveObj)
      .pipe(map(charge => {
        return charge;
      }));
  }

  updateBPByCarrier(saveObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/update/BpByCarrier`,
      saveObj)
      .pipe(map(charge => {
        return charge;
      }));
  }
  mergeCharacteristicsData(updateList: any[]) {

    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartnerPropertyDetail/updateAll`, updateList)
      .pipe(map(result => {
        return result;
      }));
  }
  mergeCarrierCharacteristicsData(updateList: any[]) {

    return this.http.post<any>(`${this.BASE_SERVICE_URL}/CarrierPropertyDetail/updateAll`, updateList)
      .pipe(map(result => {
        return result;
      }));
  }
  getExistingCarrierCharacteristics(requestObj: { CarrierId: number; ClientId: number; }) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/CarrierPropertyDetail/GetExistingCharacteristics`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteCarrierCharacteristics(requestObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/CarrierPropertyDetail/DeleteExistingCharacteristics`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }


  addCarrier(requestObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/add/BpByCarrier`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }

  activeInactiveBP(ids: string, status: boolean) {
    var RequestObject = {
      iDs: ids,
      isActive: status
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/ActiveAll`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }
  activeInactiveCarrier(ids: string, status: boolean) {
    var RequestObject = {
      iDs: ids,
      isActive: status
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/ActiveCarrier`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllBusinessPartnerType(paginationModel: LocationFunctionViewModel) {
    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/LocationFunction/GetBusinessPartnerType`, paginationModel)
      .pipe(map(result => {
        return result;
      }));
  }
  saveBusinessPartnerType(paginationModel: LocationFunctionViewModel) {
    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/LocationFunction`, paginationModel)
      .pipe(map(result => {
        return result;
      }));
  }
  
  getLocationFunctionById(Id: number) {
    return this.http.get<any>(`${this.MASTER_SERVICE_URL}/LocationFunction/${Id}`)
      .pipe(map(result => {
        return result;
      }));
  }

  updateBusinessPartnerType(paginationModel: LocationFunctionViewModel) {
    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/LocationFunction/update`, paginationModel)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllLocationList(ClientId: number) {
     var RequestObject = {
       iDs: ClientId
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/Location/list`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }


  getBillingEntityList(ClientId: number) {
    var RequestObject = {
      ClientID: ClientId
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/GetBillingEntity`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  getBillingEntityListNew(ClientId: number, idslist: any) {
    var RequestObject = {
      ClientID: ClientId,
      BusinessPartnerTypeId: idslist
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/GetBillingEntity`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  getCustomerBillingListOrder(ClientId: number, code: string) {
    var RequestObject = {
      ClientID: ClientId,
      LocationTypeCode: code
    };
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/BusinessPartner/GetBillingEntity`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteBusinessPartnerType(id: number, updatedBy: string) {
    var RequestObject = {
      selectedId: id,
      updatedBy: updatedBy
    };
    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/LocationFunction/DeleteByID`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }
}
