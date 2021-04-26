import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
export class OrderManagementService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  public userAccess: Observable<any>;
  public userAccessSubject: BehaviorSubject<any>;
  public SalesOrderforEdit: any[] = [];
  public SalesOrderSendToMass = [];
  public SalesOrderReSendToMass = [];
  public EditingSalesOrder: any;
  public CurrentEditOrderNumber: string;
  public SelectTab: string;
  //to handle custom filter
  isEdited = false;
  isSelected: boolean;
  Id: number;
  public SalesOrderforEditSameShipmentNo: any[] = [];
  public SalesOrderforEditLinkOrders: any[] = [];

  constructor(private jsonApiService: JsonApiService, private http: HttpClient, private authservices: AuthService
    , preferenceService: PreferenceTypeService) {
    super(preferenceService);
    this.userAccessSubject = new BehaviorSubject<Array<PeriodicElement>>([]);
    this.userAccess = this.userAccessSubject.asObservable();
  }

  OrderTypeList() {

    return this.http.post<any>(`${environment.masterServerUrl}/OrderType/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }

  OrderStatusList(id: number, ordertypeid: number = 0) {
    return this.http.get<any>(`${environment.masterServerUrl}/OrderStatus/GetByID?id=` + id + '&ordertypeid=' + ordertypeid + '&clientid=' + this.authservices.currentUserValue.ClientId)
      .pipe(map(user => {
        return user;
      }));
  }


  CarrierList(OrderTypeViewModel: regularOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/Carrier/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }

  //workbench filter
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

  ShipFromAllData(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/List`, {})
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

  ShipToTypeAllData(commonOrderModel: CommonOrderModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipToTypeAllDataList`, commonOrderModel)
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

  //SalesManagersList(userRolesListViewModel: UserRolesListViewModel) {
  //  return this.http.post<any>(`${environment.serverUrl}/UserRoleList/List`, userRolesListViewModel)
  //    .pipe(map(user => {
  //      return user;
  //    }));
  //}
  SalesManagersList(role: string) {
    return this.http.get<any>(`${environment.serverUrl}/UserRoleList/AllUserListByRole?role=` + role)
      .pipe(map(user => {
        return user;
      }));
  }

  EquipmentTypeData(OrderTypeViewModel: regularOrderModel) {
    OrderTypeViewModel.pageSize = 0;
    return this.http.post<any>(`${environment.masterServerUrl}/EquipmentType/List`, OrderTypeViewModel)
      .pipe(map(user => {
        return user;
      }));
  }

  LocationTypeData(OrderTypeViewModel: regularOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationType/List`, {})
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


  LocationGetByID(id: number) {

    return this.http.get<any>(`${environment.coreBaseApiUrl}/Location/GetByID?id=` + id)
      .pipe(map(user => {
        return user;
      }));
  }

  ////GetAllLocation() {
  ////  //debugger;
  ////  return this.http.post<any>(`${ environment.coreBaseApiUrl } / Location / List`, {})
  ////    .pipe(map(location => {
  ////      //debugger;
  ////      return location;
  ////    }));
  ////}

  GetAllShipToDataByOrderIDAndFromID(id: number, clientId: number, selectdTab: string) {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetAllShipToDataList?id=` + id + "&clientId=" + clientId + "&SelectedTab=" + selectdTab)
      .pipe(map(shiptodata => {
        return shiptodata;
      }));
  }

  //getChargeDetailList(paginationModel: Charge) {
  //  return this.http.post<any>(`${ this.BASE_SERVICE_URL } / charge / GetChargeDetails`,
  //    paginationModel)
  //    .pipe(map(charge => {
  //      return charge;
  //    }));
  //}

  GetSalesOrderDetailList(paginationModel: regularOrderModel) {

    paginationModel.UserLoginID = this.authservices.currentUserValue.LoginId;

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetSalesOrderList`,
      paginationModel)
      .pipe(map(salesOrder => {
        return salesOrder;
      }));
  }

  GetSalesOrderListDataCount(paginationModel: regularOrderModel) {
    //var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    //return this.http.post<any>(`${ environment.coreBaseApiUrl } / SalesOrder / GetSalesOrderListDataCount`, paginationModel, httpOptions)
    //  .pipe(map(salesOrder => {
    //    return salesOrder;
    //  }));

    paginationModel.UserLoginID = this.authservices.currentUserValue.LoginId;

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetSalesOrderListDataCount`,
      paginationModel)
      .pipe(map(salesOrder => {
        return salesOrder;
      }));

  }


  GetMaterialList() {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }

  GetUOMData() {
    return this.http.get<any>(`${environment.masterServerUrl}/OrderUom/JoinList`)
      .pipe(map(user => {
        return user;
      }));
  }

  ///////////////////////////////////
  //// Developed By Kapil Pandey
  ///  On 17-Sep-2020
  ///////////////////////////////////

  ///this method get the sales manager list. and display sales manager name on order workbench ragular order or edit order.
  GetAllSalesManagerList(locationID: number) {

    var RequestObject = {
      LocationID: locationID,
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/GetSalesManager`, RequestObject)
      .pipe(map(salesmanagerlist => {
        return salesmanagerlist;
      }));

  }

  GetOrderDetails(orderID: number, orderTypeID: number) {

    var RequestObject = {
      OrderID: orderID,
      OrderTypeID: orderTypeID,
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/GetDetail`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }

  GetOrderMaterialList(orderID: number, sectionID: number, orderTypeID: number = 0) {

    var RequestObject = {
      OrderID: orderID,
      ClientID: this.authservices.currentUserValue.ClientId,
      SectionID: sectionID,
      OrderTypeID: null
    };

    if (orderTypeID != undefined && orderTypeID != null && orderTypeID > 0) {
      RequestObject.OrderTypeID = orderTypeID;
    }

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/OrderMaterialList`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }

  /// Code Ended Here ///////////////////
  ShipTypeData(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shiptotypelist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  ShipFromTypeData(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shipfromtypelist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  ShipFromData(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shipfromlist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  ShipToData(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shiptolist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }

  ShipToContactData(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shiptocontactlist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }

  ShipToEndUser(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shiptoenduserlist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  ShipToAddressName(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shiptoaddressnamelist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  ShipToContractTo(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shiptocontracttolist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }

  GetEquipment(LocationID: any, ClientID: any) {
    var RequestObject = {
      LocationID: LocationID,
      ClientID: this.authservices.currentUserValue.ClientId

    };
    return this.http.post<any>(`${environment.masterServerUrl}/EquipmentType/GetByID`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }
  MaterialQuantity(EquipmentTypeID: number, MaterialId: number, ClientID: number, EntityPropertyCode: string) {
    var RequestObject = {
      EquipmentTypeID: EquipmentTypeID,
      MaterialId: MaterialId,
      ClientID: this.authservices.currentUserValue.ClientId,
      EntityPropertyCode: EntityPropertyCode
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/Materialquantity`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  LocationMaterial(LocationID: number, ClientID: number, EntityPropertyCode: string, EquipmentID: number, OrderID?: number, OrderTypeID?: number) {
    var RequestObject = {
      LocationID: LocationID,
      ClientID: this.authservices.currentUserValue.ClientId,
      EntityPropertyCode: EntityPropertyCode,
      EquipmentTypeID: EquipmentID,
      OrderID: null,
      OrderTypeID: null
    };

    if (OrderID != undefined && OrderID != null && OrderID > 0) {
      RequestObject.OrderID = OrderID;
      RequestObject.OrderTypeID = OrderTypeID;
    }

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/LocationMaterial`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  LocationAllMaterial(LocationID: number, ClientID: number, EntityPropertyCode: string, EquipmentID: number, OrderID?: number, OrderTypeID?: number) {
    var RequestObject = {
      LocationID: LocationID,
      ClientID: this.authservices.currentUserValue.ClientId,
      EntityPropertyCode: EntityPropertyCode,
      EquipmentTypeID: EquipmentID,
      OrderID: null,
      OrderTypeID: null
    };

    if (OrderID != undefined && OrderID != null && OrderID > 0) {
      RequestObject.OrderID = OrderID;
      RequestObject.OrderTypeID = OrderTypeID;
    }

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/LocationAllMaterial`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }



  GetCharges() {

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Charge/GetAll`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }

  GetCommodities() {

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Commodity/GetAll`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }

  GetPriceMethods() {

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.masterServerUrl}/PriceMethodType/List`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }

  GetRateType() {

    var RequestObject = {
      Code: GlobalConstants.PriceMethodCateoryCode,
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.masterServerUrl}/ChargeComputationMethod/List`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

  }


  GetRefershPriceMethod(matrialID: number, contractID: number, shipToLocationID: number, chargeID: number) {
    var RequestObject = {
      MaterialID: matrialID,
      ChargeID: chargeID,
      ShipTOLocationID: shipToLocationID,
      ContractID: contractID,
      Code: GlobalConstants.PriceMethodCateoryCode,
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/GetPriceMethodByMaterialAndCharge`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  GetRefershComputationMethod(chargeID: number) {
    var RequestObject = {
      ChargeID: chargeID,
      ClientID: this.authservices.currentUserValue.ClientId
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/ChargeComputationMethodMapping/GetRateTypeOfChargeID`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  ShipToContactFromData(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/shiptocontactfromlist`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }
  Tocontract(LocationID: number, RequestDate: any, OrderTypeID: number) {
    var RequestObject = {
      LocationID: LocationID,
      RequestDate: RequestDate,
      OrderTypeID: OrderTypeID
    };
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipToContractToList`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  GetContractForOrder(LocationID: number, RequestDate: any, OrderTypeID: number, OrderID: number = null, IsToContract: boolean = false) {
    var RequestObject = {
      LocationID: LocationID,
      ApplyDate: this.convertDatetoStringDate(RequestDate),
      OrderTypeID: OrderTypeID,
      OrderID: null,
      IsToContract: IsToContract
    };

    if (OrderID != null && OrderID > 0) {
      RequestObject.OrderID = OrderID
    }

    return this.http.post<any>(`${environment.coreBaseApiUrl}/Contract/GetRegualrOrderContract`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  Fromcontract(LocationID: number, RequestDate: any, OrderTypeID: number) {
    var RequestObject = {
      LocationID: LocationID,
      RequestDate: RequestDate,
      OrderTypeID: OrderTypeID
    };
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipFromContractToList`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  GetAdjustChargesDefault(RequestObject: any) {

    RequestObject.ClientID = this.authservices.currentUserValue.ClientId;

    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/GetAdjustChargesDefaultData`, RequestObject)
      .pipe(map(orderDetails => {

        return orderDetails;
      }));

  }

  getRateTypeWithUOM() {
    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId
    };
    return this.http.post<any>(`${environment.masterServerUrl}/ChargeComputationMethod/RateTypeOFUOM`, RequestObject)
      .pipe(map(RateTypeList => {
        return RateTypeList;
      }));
  }

  LocationShippingMaterial(LocationID: number, ClientID: number, OrderID?: number, OrderTypeID?: number) {

    var RequestObject = {
      LocationID: LocationID,
      ClientID: ClientID,
      OrderID: null,
      OrderTypeID: null
    };

    if (OrderID != undefined && OrderID != null && OrderID > 0 && OrderTypeID != undefined && OrderTypeID != null && OrderTypeID > 0) {

      RequestObject.OrderID = OrderID;
      RequestObject.OrderTypeID = OrderTypeID;
    }
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/LocationShippingMaterial`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }


  GetShippingUOM() {
    return this.http.get<any>(`${environment.masterServerUrl}/OrderUom/JoinList`)
      .pipe(map(user => {
        return user;
      }));
  }

  GetAvailableCreditOfLocation(locationID: number, RequestDate: any) {

    var RequestObject = {
      LocationID: Number(locationID),
      RequestedOrderDate: RequestDate,
      RequestedOrderDateStr: this.convertDatetoStringDate(RequestDate),
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/GetAvailableCredit`, RequestObject)
      .pipe(map(salesmanagerlist => {
        return salesmanagerlist;
      }));

  }

  GetFuleCharges(locationID: number, RequestDate: any) {

    var RequestObject = {
      LocationID: locationID,
      RequestedOrderDateStr: this.convertDatetoStringDate(RequestDate),
      ClientID: this.authservices.currentUserValue.ClientId
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/GetFuelCharges`, RequestObject)
      .pipe(map(fuleCharges => {
        return fuleCharges;
      }));

  }



  SaveOrder(data: any[], OrderData: {}, materialData: any[]) {
    var AllData = { locationMaterial: data, salesorder: OrderData, materialsList: materialData };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/SaveAll`, AllData)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  ValidateMaterialInOrder(materialList: any, EquipmentID: number) {
    var AllData = {
      EquipmentID: EquipmentID, MaterialList: materialList,
      ClientID: this.authservices.currentUserValue.ClientId
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/ValidateMaterialInOrder`, AllData)
      .pipe(map(validationDetails => {
        return validationDetails;
      }));
  }


  GetFreightMode(EquipmentTypeID: any, ClientID: any) {
    var RequestObject = {
      EquipmentTypeID: EquipmentTypeID,
      ClientID: ClientID

    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FreightMode/GetByID`, RequestObject)
      .pipe(map(order => {
        return order;
      }));
  }


  GetComment(ContractID: any, LocationID: any, ClientID: any) {
    var RequestObject = {
      ContractID: ContractID,
      LocationID: LocationID,
      ClientID: ClientID


    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetComment`, RequestObject)
      .pipe(map(order => {
        return order;
      }));
  }

  ValidateOrderCore(data: any[], OrderData: {}, allMaterial: any[]) {
    var AllData = { locationMaterial: data, salesorder: OrderData, materialsList: allMaterial };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/ValidateOrderCoreInputs`, AllData)
      .pipe(map(validationDetails => {
        return validationDetails;
      }));
  }

  ToSelectedContract(data: any[], OrderType: string, ClientID: number, LocationID: number) {

    var AllData = { ContractList: data, OrderType: OrderType, ClientID: ClientID, LocationID };
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ToContractSelect`, AllData)
      .pipe(map(validationDetails => {
        return validationDetails;
      }));
  }

  SelectedContractFrom(data: any[], OrderType: string, ClientID: number, LocationID: number) {

    var AllData = { ContractList: data, OrderType: OrderType, ClientID: ClientID, LocationID };
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/FromContractSelect`, AllData)
      .pipe(map(validationDetails => {
        return validationDetails;
      }));
  }




  DefaultCarrier(ClientID: any, UserID: any) {
    var RequestObject = {
      ClientID: ClientID,
      UserID: UserID

    };
    return this.http.post<any>(`${environment.masterServerUrl}/Carrier/Default`, RequestObject)
      .pipe(map(carrier => {
        return carrier;
      }));
  }

  SaveBulkOrder(data: any[], sendNotification: boolean) {

    var RequestObject = {
      BulkOrderViewModelList: data,
      SendNotification: sendNotification
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/SaveBulkOrder`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  ApproveAndSendTOMAS(OrderIdsArray: any, SalesOrdertypesArray: any) {
    var OrderIdStrList = OrderIdsArray.toString();
    var SalesOrdertypes = SalesOrdertypesArray.toString();

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderIdStr: OrderIdStrList,
      SelectedTab: SalesOrdertypes

    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/SendARChargesToMASS`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  CancelOrder(OrderIdsArray: any, SelectedTab: string) {
    var OrderIdStrList = OrderIdsArray.toString();

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderIdStr: OrderIdStrList,
      SelectedTab: SelectedTab
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/CancelSelectedOrders`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));


    //GetAllShipToDataByOrderIDAndFromID(id: number, clientId: number) {
    //  return this.http.get<any>(`${ environment.coreBaseApiUrl } / SalesOrder / GetAllShipToDataList ? id = ` + id + "&clientId=" + clientId)
    //    .pipe(map(shiptodata => {
    //      return shiptodata;
    //    }));
    //}
  }


  VerifyEquipmentMaterialPropertyOrder(MaterialId: number, EquipmentTypeId: number) {
    var RequestObject = {
      MaterialId: Number(MaterialId),
      EquipmentTypeId: Number(EquipmentTypeId)
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetVerifyEquipmentMaterialPropertyOrder`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  VerifyEquipmentMultipleMaterialPropertyOrder(MaterialId: string, EquipmentTypeId: number) {
    var RequestObject = {
      MaterialId: MaterialId,
      EquipmentTypeId: EquipmentTypeId
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetVerifyEquipmentMultipleMaterialPropertyOrder`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  DeleteOrder(OrderIdsArray: any, SelectedTab: string) {
    var OrderIdStrList = OrderIdsArray.toString();

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderIdStr: OrderIdStrList,
      SelectedTab: SelectedTab
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/DeleteSelectedOrders`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }


  SaveUpdateVerifyEquipmentMaterial(orderVerification: SaveVerifyEquipmentMaterialProperty) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/SaveUpdateVerifyEquipmentMaterial`, orderVerification)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }


  SaveMulitpleMaterialProperties(materialProperties: MaterialPropertyGrid[]) {
    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      UserName: this.authservices.currentUserValue.LoginId,
      materialPropertiesGrids: materialProperties
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/OrderCalculation/SaveBulkMaterialProperties`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }


  ShipToAddressData(commonOrderModel: CommonOrderModel) {
    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipToAddress`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }


  verifySavedLocation(locationVerify: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Location/VerifyOrderLocationStatus`, locationVerify)
      .pipe(map(user => {
        return user;
      }));
  }



  GetStatuswithcondition(locationID: number, Credit: string, RequestedDelieveryDate: string = null, OrderID: any, OrderTypeID: any) {

    var RequestObject = {
      LocationID: Number(locationID),
      Credit: Credit,
      RequestedDelievryDate: null,
      RequestedDelievryDateStr: '',
      OrderID: null,
      OrderTypeID: null

    };

    if (RequestedDelieveryDate != undefined && RequestedDelieveryDate != null && RequestedDelieveryDate.length > 8) {
      RequestObject.RequestedDelievryDate = RequestedDelieveryDate;

    }

    if (OrderID != undefined && OrderTypeID != undefined) {
      RequestObject.OrderID = Number(OrderID);
      RequestObject.OrderTypeID = Number(OrderTypeID);
    }

    return this.http.post<any>(`${environment.masterServerUrl}/OrderStatus/OrderStatus`, RequestObject)
      .pipe(map(status => {
        return status;
      }));

  }

  FindMissingMaterialPropertyOrder(MaterialId: string, EquipmentTypeId: number) {
    var RequestObject = {
      materialId: MaterialId,
      equipmentTypeId: EquipmentTypeId
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/FindMissingMaterialPropertyOrder`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  SalesOrderDataByOrderId(OrderId: any) {
    var RequestObject = {
      OrderId: OrderId
    };
    return this.http.get<any>(`${environment.masterServerUrl}/SalesOrder/Id?Id=`, OrderId)
      .pipe(map(salesorder => {
        return salesorder;
      }));
  }

  //CancelOrder(OrderIdsArray: any) {




  //}
  SaveLinkOrder(OrderIdsArray: any, ParentOrderId, SelectedTab) {

    var OrderIdStrList = OrderIdsArray.toString();
    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderIdStr: OrderIdStrList,
      UserName: this.authservices.currentUserValue.LoginId,
      ParentOrderId: ParentOrderId,
      SelectedTab: SelectedTab
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/SaveSalesOrderLinkData`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  MoveUpDownOrderRouteSequence(OrderId, SwapWithOrderId, RouteSequence, SwapWithRouteSequence, ShipWithOrderID, SwapWithShipWithOrderID) {

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderId: OrderId,
      SwapWithOrderId: SwapWithOrderId,
      RouteSequence: RouteSequence,
      SwapWithRouteSequence: SwapWithRouteSequence,
      UserName: this.authservices.currentUserValue.LoginId,
      ShipWithOrderID: ShipWithOrderID,
      SwapWithShipWithOrderID: SwapWithShipWithOrderID
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/MoveUpDownOrderRouteSequence`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  RemoveSelectedLinkOrder(orderId, shipWithOrderID, SelectedTab) {
    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderId: orderId,
      shipWithOrderID: shipWithOrderID,
      SelectedTab: SelectedTab
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/RemoveSelectedLinkOrder`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  SalesOrderDataByOrderIdwithClientID(OrderId: number, ClientId: number, OrderType: string) {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/SalesOrder/${OrderId}/${ClientId}/${OrderType}`)
      .pipe(map(salesorder => {
        return salesorder;
      }));
  }

  GetOrderDataToLinkOrder(OrderId: number, ClientId: number, InboundOutbound: string) {

    return this.http.get<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetOrderDataByOrderIdForShipWithPopup?ClientId=` + ClientId + "&OrderId=" + OrderId + "&InboundOutbound=" + InboundOutbound)
      .pipe(map(salesData => {
        return salesData;
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

  CopyOrder(OrderIdsArray: any, SelectedTab: string) {
    var OrderIdStrList = OrderIdsArray.toString();

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderIdStr: OrderIdStrList,
      SelectedTab: SelectedTab
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/CopyOrders`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }



  GetCarrierList(ClientID: any) {
    var RequestObject = {
      ClientID: ClientID,
      Code: null

    };
    return this.http.post<any>(`${environment.masterServerUrl}/Carrier/GetCarrierList`, RequestObject)
      .pipe(map(carrier => {
        return carrier;
      }));
  }



  GetCheckStatusForSendtoMass(OrderIdsArray: any, SelectedTab: string) {
    var OrderIdStrList = OrderIdsArray.toString();

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderIdStr: OrderIdStrList,
      SelectedTab: SelectedTab
    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetCheckStatusForSendtoMass`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  GetCheckStatusReSendtoMass(OrderIdsArray: any, SelectedTab: string) {
    var OrderIdStrList = OrderIdsArray.toString();

    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderIdStr: OrderIdStrList,
      SelectedTab: SelectedTab
    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetCheckStatusReSendtoMass`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));

    //return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetCheckStatusForSendtoMass`, RequestObject)
    //  .pipe(map(orderDetails => {
    //    return orderDetails;
    //  }));
  }

  ReApproveAndSendTOMAS(OrderIdsArray: any, SalesOrdertypesArray: any) {
    var OrderIdStrList = OrderIdsArray.toString();
    var SalesOrdertypes = SalesOrdertypesArray.toString();
    var RequestObject = {
      ClientID: this.authservices.currentUserValue.ClientId,
      OrderIdStr: OrderIdStrList,
      SelectedTab: SalesOrdertypes

    };

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/ReSendARChargesToMASS`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }

  CreateManageFilter(RequestObject: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/CreateManageFilter`, RequestObject)
      .pipe(map(manageFilter => {
        return manageFilter;
      }));
  }
  GetAllCustomManageFilters(ClientId: number, UserId: number, SelectedTab: string) {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/SalesOrder/GetAllCustomManageFilters?clientId=` + ClientId + "&userId=" + UserId + "&selectedTab=" + SelectedTab)
      .pipe(map(customFilterData => {
        return customFilterData;
      }));
  }
  UpdateManageFilter(RequestObject: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/UpdateManageFilter`, RequestObject)
      .pipe(map(manageFilter => {
        return manageFilter;
      }));
  }
  DeleteManageFilter(RequestObject: any) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/DeleteManageFilter`, RequestObject)
      .pipe(map(manageFilter => {
        return manageFilter;
      }));
  }
  getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId) {
    return this.http.post<any>(`${environment.serverUrl}/ModuleRolePermission/GetControlPermissionByRole`, { ModuleRoleCode, ClientId, LoginId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  ShipToUserAddressName(commonOrderModel: CommonOrderModel) {

    return this.http.post<any>(`${environment.masterServerUrl}/LocationFunction/ShipToUserAddressNameList`, commonOrderModel)
      .pipe(map(user => {
        return user;
      }));
  }


  TransplaceOrderCommentvalidation(Commentstring: string) {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/SalesOrder/ConvertCulture?commentstring=` + Commentstring)
      .pipe(map(customFilterData => {
        return customFilterData;
      }));
  }


  ContractMaterial(ClientID: Number, LocationID: number, ContractID: number) {

    var RequestObject = {
      ClientID: ClientID,
      LocationID: LocationID,
      ContractID: ContractID

    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/Material/ContractMaterial`, RequestObject)
      .pipe(map(orderDetails => {
        return orderDetails;
      }));
  }



  RecalculateOrder(orderDetails: any) {

    return this.http.post<any>(`${environment.coreBaseApiUrl}/SalesOrder/RecalculateOrder`, orderDetails)
      .pipe(map(user => {
        return user;
      }));
  }
  RecalculateOrderFromWorkbench(orderIds: any, orderTypes: any) {

    return this.http.get<any>(`${environment.coreBaseApiUrl}/SalesOrder/RecalculateOrderFromWorkbench?orderIdStr=` + orderIds + '&orderTypeIdStr=' + orderTypes)
      .pipe(map(user => {
        return user;
      }));
  }

  getMessageByModuleCodeForOrder(Code: string, ClientId: number) {
    var RequestObject = {
      code: Code,
      clientId: ClientId
    };
    return this.http.post<any>(`${environment.masterServerUrl}/CommonMessage/GetByModuleCode`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  convertDatetoStringDate(selectedDate: Date) {
    try {
      var date = selectedDate.getDate();
      var month = selectedDate.getMonth() + 1;
      var year = selectedDate.getFullYear();

      var hours = selectedDate.getHours();
      var minuts = selectedDate.getMinutes();
      var seconds = selectedDate.getSeconds();

      return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();
    }
    catch (e) {
      var dateNew = new Date(selectedDate);
      var datedd = dateNew.getDate();
      var monthmm = dateNew.getMonth() + 1;
      var yearyy = dateNew.getFullYear();

      var hourshh = dateNew.getHours();
      var minutsmm = dateNew.getMinutes();
      var secondsss = dateNew.getSeconds();

      return yearyy.toString() + "-" + monthmm.toString() + "-" + datedd.toString() + " " + hourshh.toString() + ":" + minutsmm.toString() + ":" + secondsss.toString();

    }


  }


}

