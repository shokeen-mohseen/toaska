import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PeriodicElement } from '../../core/models/regularOrder.model';
import { shipmentworkbenchModel } from '../../core/models/shipmentworkbench.model';
import { OriginOfGoods } from '../models/OriginOfGoods.model';
import { ShipmentNaftaReportData } from '../models/ShipmentNaftaReportData.model';
import { CommonListViewModel } from '../models/shipmentworkbench.model';
import { AuthService } from './auth.service';
import { BaseService } from './base.service';
import { JsonApiService } from './json-api.service';
import { PreferenceTypeService } from './preferencetype.service';

@Injectable({
  providedIn: 'root'
})
export class shipmentManagementService extends BaseService {
  

  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  public userAccess: Observable<any>;
  public userAccessSubject: BehaviorSubject<any>;
  public ShipmentsforEdit: any = [];
  public ShipmentforEditOrders: any = [];
  public EditingShipment: any;
  public EditingShipmentID: any;
  public EditingVersion: any;
  public LocationsData: any = [];
  public OrderType: string;
  public SelectTab: string;

  //to handle custom filter
  isEdited = false;
  isSelected: boolean;
  Id: number;
  Permission: boolean = false;
  constructor(private jsonApiService: JsonApiService, private http: HttpClient, private authservices: AuthService, preferenceService: PreferenceTypeService ) {
    super(preferenceService);
    this.userAccessSubject = new BehaviorSubject<Array<PeriodicElement>>([]);
    this.userAccess = this.userAccessSubject.asObservable();
  }

  OrderTypeList() {
   // return this.http.get<any>(`${environment.masterServerUrl}${routesConstrant.OrderType}/${Id}`)
    return this.http.get<any>(`${environment.coreBaseApiUrl}/shipment/GetOrderTypeForShipment`)
      .pipe(map(result => {
        return result;
      }));
  }

  shipmentStatusList() {
   // return this.http.get<any>(`${environment.masterServerUrl}/OrderStatus/GetByID?id=` + id)
    return this.http.get<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentStatusForShipment`)
      
      .pipe(map(result => {
        return result;
      }));
  }

  ShipmentConditionList() {
    // return this.http.get<any>(`${environment.masterServerUrl}/OrderStatus/GetByID?id=` + id)
    return this.http.get<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentConditionForShipment`)
      .pipe(map(result => {
        return result;
      }));
  }

  CarrierList(CommonListViewModel: CommonListViewModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/Carrier/List`, {})
      .pipe(map(result => {
       
        return result;
      }));
  }

  EquipmentTypeData(CommonListViewModel: CommonListViewModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/EquipmentType/List`, {})
      .pipe(map(result => {
        return result;
      }));
  }
 
  GetChargeType(apchargeBusinessPartnerID=null, apchargeChargeType=null, shipmentID=null) {
    var RequestObject = {
      BusinessPartnerID: parseInt(apchargeBusinessPartnerID),
      ChargeType: apchargeChargeType,
      ShipmentID: shipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetChargetypeforApcharges`, RequestObject)
      .pipe(map(data => { return data; }));
  }

  GetChargeCategory() {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/ChargeCategory/list`)
      .pipe(map(data => { return data; }));
  }
    
  GetFrieghtMode() {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FreightMode/list`, {})
      .pipe(map(data => {
        return data;
      }));
  }

  GetShippingOrders(ShipmentID: number) {
    var RequestObject = {
      ShipmentID: ShipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentOrders`, RequestObject)
      .pipe(map(data => {
          return data;
        }));
  }

  GetShipmentOrderDetailsforSID(ShipmentID:number) {
    var RequestObject = {
      ShipmentID: ShipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentOrdersDetailsForShipmentId`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }

  GetApcharges(ShipmentID: number) {
    var RequestObject = {
      ShipmentID: ShipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetApcharges`, RequestObject)
      .pipe(map(data => {
        
        return data;
      }));
  }

  GetOrderAmountforApcharges(apchargeBusinessPartnerID, apchargeChargeType, shipmentID) {
    var RequestObject = {
      BusinessPartnerID: parseInt(apchargeBusinessPartnerID),
      ChargeType: apchargeChargeType,
      ShipmentID:shipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetOrderAmountforAPCharges`, RequestObject)
      .pipe(map(data => {
       return data;
      }));
  }

  GetShipmentDetails(ShipmentID: number) {
    var RequestObject = {
      ShipmentID: ShipmentID
    };
     return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentdetails`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }

  GetAllShipmentDetails(paginationModel: shipmentworkbenchModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentDetailsAll`,
      paginationModel)
      .pipe(map(salesOrder => {
        return salesOrder;
      }));
  }

  GetAllShipmentDetailsCount(paginationModel: shipmentworkbenchModel) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentDetailsAllCount`,
      paginationModel)
      .pipe(map(salesOrder => {
        return salesOrder;
      }));
  }

  GetLocationsforDD() {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/shipment/GetLoctionsForShipment`)
       .pipe(map(data => {
        return data;
      }));
  }

  GetTenderstatusforDD() {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/shipment/GetTenderStatusForShipment`)
      .pipe(map(data => {
        return data;
      }));
  }

  SaveNaftaReport(ShipmentNaftaReportData: ShipmentNaftaReportData[]) {
    

    ShipmentNaftaReportData[0].clientId = this.authservices.currentUserValue.ClientId;
    ShipmentNaftaReportData[0].SourceSystemId = this.authservices.currentUserValue.SourceSystemID;
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShipmentNaftaReportData`, ShipmentNaftaReportData[0], httpOptions)
      .pipe(map(response => {
        return response;
      }));
  }

  SaveOriginOfGoods(OriginOfGoods: OriginOfGoods[]) {
 
    OriginOfGoods[0].ClientId = this.authservices.currentUserValue.ClientId;
    OriginOfGoods[0].SourceSystemId = this.authservices.currentUserValue.SourceSystemID;
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/CountryOfOriginOfMaterial`, OriginOfGoods[0], httpOptions)
      .pipe(map(response => {
        return response;
      }));
  }
  updateOriginOfGoods(OriginOfGoods: OriginOfGoods[]) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/CountryOfOriginOfMaterial/update`, OriginOfGoods[0])
      .pipe(map(response => {
        return response;
      }));
  }
  updateNaftaReport(ShipmentNaftaReportData: ShipmentNaftaReportData[]) {
   
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShipmentNaftaReportData/update`, ShipmentNaftaReportData[0])
      .pipe(map(response => {
        return response;
      }));
  }
  getShipmentNaftaReportDataList() {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/ShipmentNaftaReportData/list`)
      .pipe(map(response => {
        return response;
      }));
  }
  getOriginOfGoodsList() {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/CountryOfOriginOfMaterial/list`)
      .pipe(map(response => {
        return response;
      }));
  }
  deleteAllOriginOfGoods(ids: string) {
  
    const body = { IDs: ids }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<OriginOfGoods>(`${environment.coreBaseApiUrl}/CountryOfOriginOfMaterial/DeleteAll`, body, this.httpOptions);
  }
  deleteAllNaftaReport(ids: string) {
  
    const body = { IDs: ids }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<OriginOfGoods>(`${environment.coreBaseApiUrl}/ShipmentNaftaReportData/DeleteAll`, body, this.httpOptions);
  }
  getOriginOfGoodsDetailsList(paginationModel: OriginOfGoods) {
   
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/CountryOfOriginOfMaterial/GetOriginOfGoodsDetails`, paginationModel, httpOptions)
      .pipe(map(response => {
       
        return response;
      }));
  }
  getAllShipmentNaftaReportDataList(paginationModel: ShipmentNaftaReportData) {

    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShipmentNaftaReportData/GetShipmentNaftaReportData`, paginationModel, httpOptions)
      .pipe(map(response => {

        return response;
      }));
  }
  GetNetCost(EntityCode: string, EntityPropertyCode: string) {
    
    var AllData = { EntityCode: EntityCode, EntityPropertyCode: EntityPropertyCode };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShipmentNaftaReportData/getNetCostData`, AllData)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  SaveShipment(ShipmentSaveDetails) {
    var ShipmentDetails1: any = {};

    ShipmentDetails1.id = ShipmentSaveDetails.id;
    ShipmentDetails1.orderTypeID = ShipmentSaveDetails.orderTypeID;
    ShipmentDetails1.statusID =ShipmentSaveDetails.statusID;
    ShipmentDetails1.conditonID = ShipmentSaveDetails.conditonID;
    ShipmentDetails1.shipDate =ShipmentSaveDetails.shipDate;
    ShipmentDetails1.carrierID = ShipmentSaveDetails.carrierID;
    ShipmentDetails1.shipmentTenderStatusID = parseInt(ShipmentSaveDetails.shipmentTenderStatusID);
    ShipmentDetails1.equipmentID = ShipmentSaveDetails.EquipmentID;
    ShipmentDetails1.modeID = ShipmentSaveDetails.modeID;
    ShipmentDetails1.trailerNumber = ShipmentSaveDetails.trailerNumber;
    ShipmentDetails1.trailerSealNumber = ShipmentSaveDetails.trailerSealNumber;
    ShipmentDetails1.approvedBy = ShipmentSaveDetails.approvedBy;
    if (ShipmentSaveDetails.approvedDateTime != "") {
      ShipmentDetails1.approvedDateTime = ShipmentSaveDetails.approvedDateTime;
    }
    else {
      ShipmentDetails1.approvedDateTime =null;
    }

    ShipmentDetails1.compliedWithShippingInstructions = ShipmentSaveDetails.compliedWithShippingInstructions;
    ShipmentDetails1.dropTrailer = ShipmentSaveDetails.dropTrailer;
    ShipmentDetails1.trailerCheckInTime = ShipmentSaveDetails.trailerCheckInTime;
    ShipmentDetails1.trailerCheckOutTime = ShipmentSaveDetails.trailerCheckOutTime;
    ShipmentDetails1.sortStartTime = ShipmentSaveDetails.sortStartTime;
    ShipmentDetails1.sortEndTime = ShipmentSaveDetails.sortEndTime;
    ShipmentDetails1.cpdata = ShipmentSaveDetails.CarrierPickupData;
    ShipmentDetails1.csddata = ShipmentSaveDetails.CarrierStopData;
    ShipmentDetails1.orderComments = ShipmentSaveDetails.OrderComments;
    ShipmentDetails1.apcharges = ShipmentSaveDetails.apcharges;
    ShipmentDetails1.salesOrderDetail = ShipmentSaveDetails.salesOrderDetail;
    ShipmentDetails1.deletesalesOrderDetail = ShipmentSaveDetails.deletesalesOrderDetail;
    ShipmentDetails1.Locations = ShipmentSaveDetails.Locations;
    ShipmentDetails1.Appointments = ShipmentSaveDetails.Appointments;
    ShipmentDetails1.clientID = ShipmentSaveDetails.clientID;
    ShipmentDetails1.updateby = ShipmentSaveDetails.updateby;
    ShipmentDetails1.browserDateTime = ShipmentSaveDetails.BrowserDateTime;
    ShipmentDetails1.ApchargesModidifed = ShipmentSaveDetails.ApchargesModidifed;
    ShipmentDetails1.SourceSystemID = ShipmentSaveDetails.SourceSystemID;
    console.log(JSON.stringify(ShipmentDetails1));
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/SaveShipment`, ShipmentDetails1)
      .pipe(map(data => {
       
        return data;
      }));
  }

  GetShippingOrdersDetails(ShipmentID: number) {
    var RequestObject = {
      ShipmentID: ShipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentOrdersDetails`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }
  GetAdjustChargesDefault(RequestObject: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/GetAdjustChargesDefaultData`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  OrderStatusList() {
    // return this.http.get<any>(`${environment.masterServerUrl}/OrderStatus/GetByID?id=` + id)
     return this.http.get<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentStatusForShipment`)
       
       .pipe(map(result => {
         return result;
       }));
   }
   
  GetMaterialQuantity(data: any[], RequestObject: any) {
    var AllData = { Materials: data, MaterialQuantityRequestModel: RequestObject };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/AllMaterialquantity`, AllData)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }
  GetPalletsCalculation(ClientID, SalesOrderID, ShipmentTypeCode) {    
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/GetMaterialPalletsCalculation`, { ClientID, SalesOrderID, ShipmentTypeCode})
      .pipe(map(materialDetails => {
        return materialDetails;
      }));
  }
  
  ApproveandSendShipmentForMAS(shipmentID: number, CarrierInDate: Date, CarrierOutDate: Date, fromlocationid: number) {
    var RequestObject = {
      ShipmentID: shipmentID
    };
   // var AllData = { shipmentID: Number(shipmentID), carrierInTime: CarrierInDate.toString(), carrierOutTime: CarrierOutDate.toString(), clientID: this.authservices.currentUserValue.ClientId, FromLocationID: Number(fromlocationid)};
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/ApproveSendShipmentToMAS`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }
  
  SendShipmentTOMAS(shipmentID: number, CarrierInDate: Date, CarrierOutDate: Date, fromlocationid : number) {
    var AllData = { shipmentID: Number(shipmentID), carrierInTime: CarrierInDate.toString(), carrierOutTime: CarrierOutDate.toString(), clientID: this.authservices.currentUserValue.ClientId, FromLocationID: Number(fromlocationid)};
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/SendShipmentToMAS`, AllData)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  ReSendShipmentToMAS(shipmentID: number) {
    var RequestObject = {
      ShipmentID: shipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/ReSendShipmentToMAS`, RequestObject)
      .pipe(map(result => {
       
        return result;
      }));
  }
    
  convertDateTimeToStringDateTime(selectedDate: Date) {
        if (selectedDate == undefined || selectedDate == null)
      selectedDate = new Date();

    var date = selectedDate.getDate();
    var month = selectedDate.getMonth() + 1;
    var year = selectedDate.getFullYear();
    var hours = selectedDate.getHours();
    var minuts = selectedDate.getMinutes();

    return date.toString() + "-" + month.toString() + "-" + year.toString() + "-" + hours.toString() + "-" + minuts.toString();
  }

  GetMaterialCommodity(data: any[], RequestObject: any) {
    var AllData = { Materials: data, MaterialQuantityRequestModel: RequestObject };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/DefaultMaterialCommodity`, AllData)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  GetDefaultMaterialProperty(RequestObject: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/DefaultMaterialProperty`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }
  GetOrderMaterialList(sectionID: number) {
  
    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      SectionID: sectionID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/OrderMaterialList`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }
  GetOrganizationList() {
 
    var RequestObject = {

      ClientId: this.authservices.currentUserValue.ClientId,
 
    };

    return this.http.post<any>(`${environment.masterServerUrl}/Organization/GetOrganizationListForNafta`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }
  GetCountryList() {

    return this.http.get<any>(`${environment.serverUrl}/Country/GetCountryList`)
      .pipe(map(CountryDetails => {
        return CountryDetails;
      }));

  }

  GetManufacturerList(sectionID: number) {
  
    var RequestObject = {

      ClientID: this.authservices.currentUserValue.ClientId,
      SectionID: sectionID
      
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Location/ManufacturerList`, RequestObject)
      .pipe(map(ManufacturerDetails => {
        return ManufacturerDetails;
      }));

  }

  Tonu(RequestObject: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/Tonu`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }

  Cancel(RequestObject: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/Cancel`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }

  getLocationDetails(id: number) {
    var LocationId = id;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Location/GetToFromLocation`, { LocationId})
      .pipe(map(res => {
        return res;
      }));
  }

  SaveShipmentOrders(ShipmentOrders) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/SaveShipmentOrders`, ShipmentOrders)
      .pipe(map(data => {
        return data;
      }));
  }

  ShipSelecteShipment(ShipmentSaveDetails) {
    var ShipmentDetails1: any = {};

    ShipmentDetails1.id = ShipmentSaveDetails.id;
    ShipmentDetails1.orderTypeID = ShipmentSaveDetails.orderTypeID;
    ShipmentDetails1.statusID = ShipmentSaveDetails.statusID;
    ShipmentDetails1.conditonID = ShipmentSaveDetails.conditonID;
    ShipmentDetails1.shipDate = ShipmentSaveDetails.shipDate;
    ShipmentDetails1.carrierID = ShipmentSaveDetails.carrierID;
    ShipmentDetails1.shipmentTenderStatusID = parseInt(ShipmentSaveDetails.shipmentTenderStatusID);
    ShipmentDetails1.equipmentID = ShipmentSaveDetails.EquipmentID;
    ShipmentDetails1.modeID = ShipmentSaveDetails.modeID;

    ShipmentDetails1.trailerNumber = ShipmentSaveDetails.trailerNumber;
    ShipmentDetails1.trailerSealNumber = ShipmentSaveDetails.trailerSealNumber;
    ShipmentDetails1.approvedBy = ShipmentSaveDetails.approvedBy;
    if (ShipmentSaveDetails.approvedDateTime != "") {
      ShipmentDetails1.approvedDateTime = ShipmentSaveDetails.approvedDateTime;
    }
    else {
      ShipmentDetails1.approvedDateTime = null;
    }
    ShipmentDetails1.compliedWithShippingInstructions = ShipmentSaveDetails.compliedWithShippingInstructions;
    ShipmentDetails1.dropTrailer = ShipmentSaveDetails.dropTrailer;
    ShipmentDetails1.trailerCheckInTime = ShipmentSaveDetails.trailerCheckInTime;
    ShipmentDetails1.trailerCheckOutTime = ShipmentSaveDetails.trailerCheckOutTime;
    ShipmentDetails1.sortStartTime = ShipmentSaveDetails.sortStartTime;
    ShipmentDetails1.sortEndTime = ShipmentSaveDetails.sortEndTime;
    ShipmentDetails1.cpdata = ShipmentSaveDetails.CarrierPickupData;
    ShipmentDetails1.csddata = ShipmentSaveDetails.CarrierStopData;
    ShipmentDetails1.orderComments = ShipmentSaveDetails.OrderComments;
    ShipmentDetails1.apcharges = ShipmentSaveDetails.apcharges;
    ShipmentDetails1.salesOrderDetail = ShipmentSaveDetails.salesOrderDetail;
    ShipmentDetails1.deletesalesOrderDetail = ShipmentSaveDetails.deletesalesOrderDetail;
    ShipmentDetails1.Locations = ShipmentSaveDetails.Locations;
    ShipmentDetails1.Appointments = ShipmentSaveDetails.Appointments;
    ShipmentDetails1.clientID = ShipmentSaveDetails.clientID;
    ShipmentDetails1.BrowserDateTime = ShipmentSaveDetails.BrowserDateTime;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/ShipSelectedShipment`, ShipmentDetails1)
      .pipe(map(data => {
        return data;
      }));
  }
    
  ReceiveSelectedShipment(ShipmentSaveDetails) {
    var ShipmentDetails1: any = {};
    ShipmentDetails1.id = ShipmentSaveDetails.id;
    ShipmentDetails1.orderTypeID = ShipmentSaveDetails.orderTypeID;
    ShipmentDetails1.statusID = ShipmentSaveDetails.statusID;
    ShipmentDetails1.conditonID = ShipmentSaveDetails.conditonID;
    ShipmentDetails1.shipDate = ShipmentSaveDetails.shipDate;
    ShipmentDetails1.carrierID = ShipmentSaveDetails.carrierID;
    ShipmentDetails1.shipmentTenderStatusID = ShipmentSaveDetails.shipmentTenderStatusID;
    ShipmentDetails1.equipmentID = ShipmentSaveDetails.EquipmentID;
    ShipmentDetails1.modeID = ShipmentSaveDetails.modeID;
    ShipmentDetails1.trailerNumber = ShipmentSaveDetails.trailerNumber;
    ShipmentDetails1.trailerSealNumber = ShipmentSaveDetails.trailerSealNumber;
    ShipmentDetails1.approvedBy = ShipmentSaveDetails.approvedBy;
    if (ShipmentSaveDetails.approvedDateTime != "") {
      ShipmentDetails1.approvedDateTime = ShipmentSaveDetails.approvedDateTime;
    }
    else {
      ShipmentDetails1.approvedDateTime = null;
    }
    ShipmentDetails1.compliedWithShippingInstructions = ShipmentSaveDetails.compliedWithShippingInstructions;
    ShipmentDetails1.dropTrailer = ShipmentSaveDetails.dropTrailer;
    ShipmentDetails1.trailerCheckInTime = ShipmentSaveDetails.trailerCheckInTime;
    ShipmentDetails1.trailerCheckOutTime = ShipmentSaveDetails.trailerCheckOutTime;
    ShipmentDetails1.sortStartTime = ShipmentSaveDetails.sortStartTime;
    ShipmentDetails1.sortEndTime = ShipmentSaveDetails.sortEndTime;
    ShipmentDetails1.cpdata = ShipmentSaveDetails.CarrierPickupData;
    ShipmentDetails1.csddata = ShipmentSaveDetails.CarrierStopData;
    ShipmentDetails1.orderComments = ShipmentSaveDetails.OrderComments;
    ShipmentDetails1.apcharges = ShipmentSaveDetails.apcharges;
    ShipmentDetails1.salesOrderDetail = ShipmentSaveDetails.salesOrderDetail;
    ShipmentDetails1.deletesalesOrderDetail = ShipmentSaveDetails.deletesalesOrderDetail;
    ShipmentDetails1.Locations = ShipmentSaveDetails.Locations;
    ShipmentDetails1.Appointments = ShipmentSaveDetails.Appointments;
    ShipmentDetails1.clientID = ShipmentSaveDetails.clientID;
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/ReceiveSelectedShipment`, ShipmentDetails1)
      .pipe(map(data => {
        return data;
      }));
  }

  GetShippingNaftaReport(ShipmentID: number) {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/shipmentnaftareportdata/GetNaftaReportById/${ShipmentID}`)
      .pipe(map(data => {
        return data;
      }));
  }

  GetLocationTypeFromList(clientID) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Shipment/GetshipFromtypeAll`, { clientID})
      .pipe(map(data => {
        return data;
      }));
  }
  GetLocationTypeToList(clientID) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Shipment/GetshiptotypeAll`, { clientID})
      .pipe(map(data => {
        return data;
      })); 
  }
  GetLocationFromList(clientID) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Shipment/GetshipFromAllData`, { clientID })
      .pipe(map(data => {
        return data;
      }));
  }
  GetLocationToList(clientID) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Shipment/GetshipToAllData`, { clientID })
      .pipe(map(data => {
        return data;
      }));
  }

  getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId) {
   
    return this.http.post<any>(`${environment.serverUrl}/ModuleRolePermission/GetControlPermissionByRole`, { ModuleRoleCode, ClientId, LoginId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  GetShippingCCIData(shippingId : number) {

    return this.http.get<any>(`${this.BASE_SERVICE_URL}/shipment/getccireportbyid/${shippingId}`)
      .pipe(map(res => {
        return res;
      }));
  }

  ValidateMaterialProperty(allMaterial: any[], equipmentTypeID:number) {
    var RequestObject = {
      EquipmentTypeId: equipmentTypeID,
      MaterialsList: allMaterial

    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/ValidateMaterialsInputs`, RequestObject)
      .pipe(map(validationDetails => {
        return validationDetails;
      }));
  }

  SendtoMASTPQFail(ShipmentID: number) {
    
    var RequestObject = {
      ShipmentID: ShipmentID
    };
    
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/TPQFailSendShipmentToMAS`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }
  converttoSqlString(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var minutes = dt.getMinutes();
      var ampm = 'AM';
      var hour1 = hour.toString().padStart(2, "0");
      var minutes1 = dt.getMinutes().toString().padStart(2, "0");
      //  2021 - 01 - 02T16: 10: 00.000
      var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + date.toString().padStart(2, "0") + " " + hour1 + ":" + minutes1 + ".000")
      return datestring;
    }
    return null;
  }
  //manage custome filter
  CreateManageFilter(RequestObject: any) {   
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Shipment/CreateManageFilter`, RequestObject)
      .pipe(map(manageFilter => {
        return manageFilter;
      }));
  }
  GetAllCustomManageFilters(ClientId: number, UserId: number, SelectedTab: string) {   
    return this.http.get<any>(`${environment.coreBaseApiUrl}/Shipment/GetAllCustomManageFilters?clientId=` + ClientId + "&userId=" + UserId + "&selectedTab=" + SelectedTab)
      .pipe(map(customFilterData => {
        return customFilterData;
      }));
  }
  UpdateManageFilter(RequestObject: any) { 
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Shipment/UpdateManageFilter`, RequestObject)
      .pipe(map(manageFilter => {
        return manageFilter;
      }));
  }
  DeleteManageFilter(RequestObject: any) {  
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Shipment/DeleteManageFilter`, RequestObject)
      .pipe(map(manageFilter => {
        return manageFilter;
      }));
  }
  GetUOMforApcharespopup() {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/shipment/GetUOMforApcharespopup`)
      .pipe(map(data => {
        return data;
      }));
  }

  GetAllLocationsforDD(ShipmentType: number, ClientID: number) {
    var RequestObject = {

      ShipmentType: ShipmentType,
      ClientID: ClientID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetLoctionsForShipment`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }


  GetProformaInvoiceData(ShipmentID: number) {
    var RequestObject = { ShipmentID: ShipmentID };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetProformaInvoiceData`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }

  GetProformaInvoiceOrgAddressData(ShipmentID: number) {
    var RequestObject = { ShipmentID: ShipmentID };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetProformaInvoiceOrganizationAddress`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }

  GetApchargesLocChage(apchargeLocChangedata: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetApchargesDuetoLocChange`, apchargeLocChangedata)
      .pipe(map(data => {  return data;  }));
  }



  GetShipmentOrdersDetailsForBOL(ShipmentID: number) {
    var RequestObject = {
      ShipmentID: ShipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentOrdersDetailsForBOL`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }


  GetShipmentBOLReport(ShipmentIds: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShipmentReporting/GetBolReport`, ShipmentIds)
      .pipe(map(data => {
        return data;
      }));
  }
  
  GetShipmentLoadingsheetReport(ShipmentIds: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ShipmentReporting/GetLoadingsheetReport`, ShipmentIds)
      .pipe(map(data => {
        return data;
      }));
  }



  GetTenderStatusTracking(ShipmentID: number) {
    var RequestObject = {
      ShipmentID: ShipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentTenderStatusTracking`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }


  GetStatusTracking(ShipmentID: number) {
    var RequestObject = {
      ShipmentID: ShipmentID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/shipment/GetShipmentStatusTracking`, RequestObject)
      .pipe(map(data => {
        return data;
      }));
  }


}

export const routesConstrant = {
  
  OrderType: '/OrderType',


}
