import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PreferenceTypeService, UsersContactViewModel, AuthService } from '..';
import { environment } from '../../../environments/environment';
import { CustomerByLocation, CustomerByLocationStatusModel, CustomerByLocationEditModel } from '../models/CustomerByLocation.model';
import { AddressLocation } from '../models/geolocation';
import { CommonCallListViewModel, CustomerPropertyDetails, LocationAddressCallListViewModel, LocationPreferredMaterialViewModel, ShippingLocationDefaultPackagingMaterialViewModel, LocationListViewModel, LocationAverageShipFromMileMappingViewModel, ToFromLocationViewModel } from '../models/Location';
import { BaseService } from './base.service';

//import { CommonCallListViewModel, CommonStatusListViewModel, PeriodicElement, RolesViewModel, UserRolesListViewModel, UsersContactViewModel, UsersViewModel, AddressCallListViewModel, UserLocationListViewModel } from '..';

@Injectable({
  providedIn: 'root'
})
export class CustomerByLocationService extends BaseService{
 
  


  constructor(private http: HttpClient,
    private authenticationService: AuthService,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }
  Permission: boolean = false;

  getLocationContactList(locationModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactGetAllList}`, locationModal)
      .pipe(map(location => {
        return location;
      }));
  }

  getLocationContactById(Id: number) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/GetLocationContactById/${Id}`)
      .pipe(map(location => {
        return location;
      }));
  }

  getCarrierContactById(Id: number) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/getbyid/${Id}/Carrier`)
      .pipe(map(location => {
        return location;
      }));
  }


  getOrganizationContactById(Id: number) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/getbyid/${Id}/Organization`)
      .pipe(map(location => {
        return location;
      }));
  }

  getSearchContact(locationModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactList}`, locationModal)
      .pipe(map(user => {        
        return user;
      }));
  }
  getUserContactCount(locationModal: UsersContactViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactlistcount}`, locationModal)
      .pipe(map(user => {
        return user;
      }));
  }
  editLocationContactListByIds(id: string) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contactlistbyIds}/${id}`)
      .pipe(map(user => {
        return user;
      }));
  }

  deleteUserContactListByIds(id: string, deletedBy: string) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/deleteContact/${id}/${deletedBy}`)
      .pipe(map(user => {
        return user;
      }));
  }

  deleteContactListByIds(id: string, deletedBy: string, actionType: string) {

   // console.log(environment.commonServerUrl.trim() + routesConstrant.contact.trim() + '/id/' + `${id}/${deletedBy}/${actionType}`)

    return this.http.get<any>(environment.commonServerUrl.trim() + routesConstrant.contact.trim() + '/id/' + `${id}/${deletedBy}/${actionType}`)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }
  getUserAddressList(locationModal: LocationAddressCallListViewModel) {
    
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactAddressGetAllList}`, locationModal)
      .pipe(map(result => {
        return result;
      }));
  }

  getAddressType(locationModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.masterServerUrl}${routesConstrant.addressType}`, locationModal)
      .pipe(map(result => {
        return result;
      }));
  }

  editLocationAddressListByIds(id: string, actionType: string) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contactAddress}/getlocationaddressbyid/${id}/${actionType}`)
      .pipe(map(result => {
        return result;
      }));
  }

  getSearchAddressList(locationModal: LocationAddressCallListViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactAddresslList}`, locationModal)
      .pipe(map(result => {
        return result;
      }));
  }

  updateLocationAddress(locationModal: AddressLocation) {
    locationModal.SourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;
    locationModal.ClientID = this.authenticationService.currentUserValue.ClientId;
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactAddress}/update`, locationModal)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteLocationAddressListByIds(id: string, deletedBy: string) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contactAddress}/deleteAddress/${id}/${deletedBy}`)
      .pipe(map(result => {
        return result;
      }));
  }


  GetMaterialList(orderID: number, sectionID: number, clientID: number, orderTypeID?:number) {

    var RequestObject = {
      OrderID: orderID,
      ClientID: clientID,
      SectionID: sectionID,
      OrderTypeID: orderTypeID
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/OrderMaterialList`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }

  GetPalletList(orderID: number, sectionID: number, clientID: number) {

    var RequestObject = {
      OrderID: orderID,
      ClientID: clientID,
      SectionID: sectionID
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/palletlist`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }

  GetUOMData() {
    return this.http.get<any>(`${environment.masterServerUrl}/OrderUom/JoinList`)
      .pipe(map(result => {
        return result;
      }));
  }

  GetPreferredMaterialList(commanModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationPreferredMaterial/list`, commanModal)
      .pipe(map(result => {
        return result;
      }));
  }


  AddEditPreferredMaterial(materialModal: LocationPreferredMaterialViewModel) {
    materialModal.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationPreferredMaterial`, materialModal)
      .pipe(map(result => {
        return result;
      }));
  }

  AddPreferredEquipmentType(viewModal: CustomerPropertyDetails) {
    viewModal.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/CustomerPropertyDetail`, viewModal)
      .pipe(map(result => {
        return result;
      }));
  }

  editMaterialDetailbyId(commanModal: CommonCallListViewModel) {
    
    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationPreferredMaterial/getbyid`, commanModal)
      .pipe(map(LocationList => {
        return LocationList;
      }));

    
  }

  updatePreferredMaterial(materialModal: LocationPreferredMaterialViewModel) {
    materialModal.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationPreferredMaterial/update`, materialModal)
      .pipe(map(result => {
        return result;
      }));
  }

  deletePreferredMaterialListByIds(commanModal: CommonCallListViewModel) {

    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationPreferredMaterial/deletebyIds`, commanModal)
      .pipe(map(result => {
        return result;
      }));
  }

  AddDefaultPallet(palletModal: ShippingLocationDefaultPackagingMaterialViewModel) {
    palletModal.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShippingLocationDefaultPackagingMaterial`, palletModal)
      .pipe(map(result => {
        return result;
      }));
  }

  GetDefaultPalletList(commanModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShippingLocationDefaultPackagingMaterial/list`, commanModal)
      .pipe(map(result => {
        return result;
      }));
  }

  GetPreferredEquipmentList(viewModal: CustomerPropertyDetails) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/CustomerPropertyDetail/list`, viewModal)
      .pipe(map(result => {
        return result;
      }));
  }

  GetContractList(screenAction: string, locationId: number) {
    var RequestObject = {
      ScreenAction: screenAction,
      LocationId: locationId      
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Contract/list`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }



  deleteDefaultPalletListByIds(commanModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShippingLocationDefaultPackagingMaterial/deletebyIds`, commanModal)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteDefaultEquipmentListByIds(commanModal: CommonCallListViewModel) {
    
    return this.http.post<any>(`${environment.coreBaseApiUrl}/CustomerPropertyDetail/deletebyIds`, commanModal)
      .pipe(map(result => {
        return result;
      }));
  }

  getEquipmentType(commanModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/EquipmentType/list`, commanModal)
      .pipe(map(result => {
        return result;
      }));
  }

  getLocationFunctionList(commanModal: CommonCallListViewModel) {
   
    return this.http.post<any>(`${environment.serverUrl}/LocationFunction/getbycode`, commanModal)
      .pipe(map(result => {
        return result;
      }));
  }

  getLocationList(viewModal: LocationListViewModel) {
    
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Location/list`, viewModal)
      .pipe(map(result => {
        return result;
      }));
  }

  getDistance(viewModal: ToFromLocationViewModel) {

    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationAverageShipFromMileMapping/getDistance`, viewModal)
      .pipe(map(result => {
        return result;
      }));
  }

  addMilesdata(viewModal: LocationAverageShipFromMileMappingViewModel) {
    viewModal.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationAverageShipFromMileMapping`, viewModal)
      .pipe(map(result => {
        return result;
      }));
  }

  updateMilesdata(viewModal: LocationAverageShipFromMileMappingViewModel) {
    viewModal.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    return this.http.put<any>(`${environment.coreBaseApiUrl}/LocationAverageShipFromMileMapping/update`, viewModal)
      .pipe(map(result => {
        return result;
      }));
  }

  getCustomerByLocation(paginationModel: CustomerByLocation) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/CustomerByLocation/GetByLocation`,
      paginationModel)
      .pipe(map(customerByLocation => {
        return customerByLocation;
      }));
  }

  getToFromLocation(commanModal: CommonCallListViewModel) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/Location/GetToFromLocation`,
      commanModal)
      .pipe(map(customerByLocation => {
        return customerByLocation;
      }));
  }

  getShipFromLocationList(viewModal: LocationAverageShipFromMileMappingViewModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationAverageShipFromMileMapping/list`, viewModal)
      .pipe(map(result => {
        return result;
      }));
  }
  getShipFromLocationListbyId(id: number) {

    return this.http.get<any>(`${environment.coreBaseApiUrl}/LocationAverageShipFromMileMapping/getbyid/${id}`)
      .pipe(map(LocationList => {
        return LocationList;
      }));


  }

  deleteMilesListByIds(viewModal: LocationAverageShipFromMileMappingViewModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/LocationAverageShipFromMileMapping/deletebyIds`, viewModal)
      .pipe(map(result => {
        return result;
      }));
  }
  getUserbyRole(rolename: string) {
    return this.http.get<any>(`${this.SERVER_SERVICE_URL}/userrolelist/role?role=` + rolename)
      .pipe(map(response => {
        return response;
      }));
  }
  getSalesBroker(locationModel: CustomerByLocation) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/salesBroker`,
      locationModel)
      .pipe(map(response => {
        return response;
      }));
  }

  setCustomerByLocationStatus(locationModel: CustomerByLocationStatusModel[]) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/status`,
      locationModel)
      .pipe(map(response => {
        return response;
      }));
  }

  saveCustomerByLocation(locationModel: CustomerByLocationEditModel) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/CustomerByLocation/update`,
      locationModel)
      .pipe(map(response => {
        return response;
      }));
  }


  getForecastMaterialByLocation(id: any) {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/locationforecastmaterial/Id?locationId=` + id)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteForecastMaterialByLocation(deleteObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/locationforecastmaterial/deletebyIds`,  deleteObj)
      .pipe(map(response => {
        return response;
      }));
  }
  addCustomerLocationForecastMaterial(addObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/locationforecastmaterial/`, addObj)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteCustomerByLocation(deleteObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/deletebyIds`, deleteObj)
      .pipe(map(response => {
        return response;
      }));
  }

  getExistingCharacteristics(requestObj: { LocationId: number; ClientId: number; }) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/GetExistingCharacteristics`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteCharacteristics(requestObj: any) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/DeleteExistingCharacteristics`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }

  getDefaultCharacteristics(requestObj: { EntityCode: string; ClientId: number; }) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/location/GetLocationCharacteristics`, requestObj)
      .pipe(map(response => {
        return response;
      }));
  }


  mergeCharacteristicsData(updateList: any[]) {

    return this.http.post<any>(`${this.BASE_SERVICE_URL}/CustomerPropertyDetail/updateAll`, updateList)
      .pipe(map(result => {
        return result;
      }));
  }

  UpdateOperatingLocationCharacteristics(updateList: any[]) {

    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/OperatingLocationProperty/UpdateAll`, updateList)
      .pipe(map(result => {
        return result;
      }));
  }
}

export const routesConstrant = {
  contactlistbyIds: '/Contact/GetListByIds',
  contact: '/Contact',
  contactList: '/Contact/list',
  contactGetAllList: '/Contact/getAll/list',
  contactlistcount: '/Contact/listcount',
  contactAddressGetAllList: '/ContactAddress/getAll/list',
  addressType: '/AddressType/list',
  contactAddress: '/ContactAddress',
  contactAddresslList: '/ContactAddress/list',
  
  
}
