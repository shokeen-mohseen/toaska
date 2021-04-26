import { PaginationModel } from "./Pagination.Model";

export class regularOrderModel extends PaginationModel {

  constructor() {
    super();
    this.SurpressEmailNotification = false;
  }
  orderWorkbenchFilterModal = new OrderWorkbenchFilterModal();
  OrderType: any;
  OrganizationID: number;
  ClientId: number;
  UserType: string;
  OrgCode: string;
  OrderStatus: number;
  ShipTo: number;
  ShipFrom: number;
  SurpressEmailNotification: boolean;
  SalesManager: string;
  purchaseOrderNumber: string;
  AvailableCredit: string;
  invoiceNo: string;
  allocatedFreightCharge: number;
  ajustmentChagresMaterialID: number;
  ajustmentChagresChargeID: number;
  shippingToContractID: number;
  LocationType: string;
  RoleName: string;
  InboundOutbound: string;
  UserLoginID: string;
}

export class PeriodicElement {
  Id: number;
  LoginId: string;
  UserName: string;
  CodeMobilePhone: string;
  OrganizationName: string;
  RoleName: string;
  LocationName: string;
  Status: string;
  IsSeleted: boolean = false;
  constructor() {
    this.IsSeleted = false;
  }

}

export class CommonOrderModel {
  OrderTypeId: number;
  ClientID: number;
  LocationFunctionID: number;
  LocationID: number;
  Action: string;
}

export class CommonShipModel {
  id: number;
  code: number;
  name: string;
  toLocationAddressName: string;
  fromLocationAddressName: string;
  defaultCommodityID: number;
  addressID: number;
  organizationName: string;
  locationtypecode: string;
}

export class AdjustChargesModel {

  constructor() {
    this.isManual = false;
    this.overrideCommodityID = 0;
    this.overrideCommodityName = '';
    this.overridePriceMethodID = 0;
    this.overridePriceMethodName = '';
    this.overrideRateTypeID = 0;
    this.overrideRateTypeName = '';
    this.overrideRateValue = 0;
    this.isEdited = false;
    this.overrideShowOnBOL = false;
    this.chargeUnit = 1;
    this.fullAmount = this.amount + this.overrideAmount;
  }
  materialName: string;
  materialID: number;
  chargeName: string;
  chargeID: number;
  showOnBOL: boolean;
  orderQuantity: number;
  shippedQuantity: number;
  priceMethod: string;
  priceMethodID: number;
  rateValue: number;
  rateTypeName: string;
  rateTypeID: number;
  amount: any;
  commodityName: string;
  commodityID: number;
  isManual: boolean;
  type: string;
  overrideShowOnBOL: boolean;
  overrideRateValue: number = 0;
  overrideCommodityID: number = 0;
  overrideCommodityName: string = '';
  overrideRateTypeID: number = 0;
  overrideRateTypeName: string = '';
  overridePriceMethodID: number = 0;
  overridePriceMethodName: string = '';
  overrideAmount = 0;
  isEdited: boolean = false;
  chargeUnit: number;
  fullAmount: number = this.amount + this.overrideAmount;
  isAutoAddedExclude: boolean = false;

  IsAutoAdded: boolean;
  IsDefault: boolean;
  IsModified: boolean;

}



export class OrderManagement {
  Id: number;
  OrderTypeId: number;
  OrderTypeCode: string;
  FromLocationId: number;
  FromLocationTypeCode: string;
  ToLocationId: number;
  ToLocationTypeCode: string;
  OrderStatusId: number;
  OrderStatusCode: string;
  ClientId: number;
  EquipmentTypeId: number;
  ShipFromLocationContactId: number;
  CarrierId: number;
  RequestedDeliveryDate: Date;
  RequestedDeliveryDateStr: string;
  ScheduledShipDate: Date;
  ScheduledShipDateStr: string;
  ShipToLocationContactId: number;
  FromCustomerContractId: number;
  ToCustomerContractId: number;
  FromBusinessPartnerContractId: number;
  ToBusinessPartnerContractId: number;
  PurchaseOrderNumber: string;
  InvoiceNo: string;
  TrailerNumber: string;
  TrailerSealNumber: string;
  FreightModeID: number;
  TransportationComment: string;
  LoadingComment: string;
  TransplaceOrderComment: string;
  TransplaceDeliveryComment: string;
  ShipFromTypeId: number;
  FromAddressId: number;
  ToAddressId: number;
  AllocatedFreightCharge: number;
  AllocatedFreightChargeStr: string;
  SupressEmailConfirmation: string;
  Comments: string;
  MustArriveByDate: Date;
  MustArriveByDateStr: string;
  FromAddres: string;
  FromContractId: number;
  ShipToTypeId: number;
  ToAddress: string;
  EndUserId: number;
  AddressName: string;
  ToContractId: number;
  AvailableCredit: string;
  SalesManager: string;
  MilesOverrideforCustomer: string;
  RatePerMiles: string;
  CustomerFuelCost: string;
  DeliveryAppointment: Date;
  PickupApplointment: Date;
  DeliveryAppointmentString: string;
  PickupApplointmentString: string;
  adjustChargesSectionMaterialID: number = -1;
  adjustChargesSectionChargeID: number = -1;
  adjustChargesRateTypeID: number = -1;
  adjustChargesPriceMethodID: number = -1;
  adjustChargesQuantity: number = 0;
  adjustChargesRateValue: number = 0;
  adjustChargesCommodityID: number = -1;
  adjustChargesSectionMaterialName: string = '';
  adjustChargesSectionChargeName: string = '';
  adjustChargesRateTypeName: string = '';
  adjustChargesPriceMethodName: string = '';
  adjustChargesCommodityName: string = '';
  adjustChargesShowOnBOL: boolean = false;
  adjustChargesAmount: number = 0;
  fuelChargesMiles: string;//number=0;
  fuelChargesRatePerMile: string;// number = 0;
  fuelChargesPercentage: number = 0;
  CreatedBy: string = '';
  orderNumber: string;
  orderTypeName: string;
  shipToLocationName: string;
  materialName: string;
  orderQuantity: number;
  equipmentTypeName: string;
  carierName: string;
  EquipNumber: string;
  Code: string;
  ChargeUnits: number;
  OrderStatusName: string;
  OrderConditionCode: string;
  UpdateDateTimeServerStrFromat: string;
  ShipmentID: number;
  ARChargesSentToAccounting: number = 0;
  OrderVersionNumber: number = 0;
  OrderCondition: string;
  ShipmentNumber: string;
  ShipmentVersion: string;
  ShipmentStr: string;
  OverrideCreditHold: boolean;
  OldToLocationID: number;
  UpdateDate: Date;
  CreateDate: Date;
  UpdatedBy: string;
  InboundOutbound: string = "";
  SaveAndNotifyHit: boolean = false;
  CreateDateTimeBrowserStr: string;
  UpdateDateTimeBrowserStr: string;
  LinkOrders: string;
  constructor() {
    this.FreightModeID = 0;
    this.ShipFromTypeId = 0;
    this.FromLocationId = 0;
    this.FromAddres = "";
    this.ShipToLocationContactId = 0;
    this.ShipFromLocationContactId = 0;
    this.FromContractId = 0;
    this.CarrierId = 0;
    this.EquipmentTypeId = 0;
    this.TrailerSealNumber = "";
    this.TrailerNumber = "";
    this.ChargeUnits = 1;


    this.ShipToTypeId = 0;
    this.ToLocationId = 0;
    this.ToAddress = "";


    this.EndUserId = 0;
    this.AddressName = "";
    this.ToContractId = 0;
    this.PurchaseOrderNumber = "";
    this.AvailableCredit = "";
    this.SalesManager = "";
    this.InvoiceNo = "";
    this.AllocatedFreightCharge = 0;
    this.MilesOverrideforCustomer = "";
    this.RatePerMiles = "";
    this.CustomerFuelCost = "";
    this.OldToLocationID = 0;
    
  }
}

export class RateTypeWithUOM {
  uomid: number;
  uomName: string;
  rateTypeID: number;
  rateTypeName: string;
}


export class SalesOrder {
  Id: number;
  OrderTypeId: number;
  OrderNumber: string;
}

export class CalculationAmountVM {

  RateTypeName: string;
  RateValue: number;
  Quantity: number;
  ChargeUnit: number;
  TotalAmount: number;
  TotalPallets: number;
  MaxPallets: number;
  TotalQuantity: number;
  ChargeRatePerMile: number = 0;
  PerMileCharge: number = 0;
  PassthrowPercentage: number = 0;


}


export class BulkOrderManagement {
 // bulkOrderID: number;
  OrderTypeId: number;
  FromLocationId: number;
  ToLocationId: number;
  OrderStatusId: number;
  ClientId: number;
  EquipmentTypeId: number;
  ShipFromLocationContactId: number;
  CarrierId: number;
  ShipToLocationContactId: number;
  FromCustomerContractId: number;
  ToCustomerContractId: number;
  FromBusinessPartnerContractId: number;
  ToBusinessPartnerContractId: number;
  TransplaceOrderComment: string;
  TransplaceDeliveryComment: string;
  ShipFromTypeId: number;
  FromAddressId: number;
  ToAddressId: number;
  AllocatedFreightCharge: number;
  SupressEmailConfirmation: string;
  Comments: string;
  FromAddres: string;
  FromContractId: number;
  ShipToTypeId: number;
  CreatedBy: string = '';
  orderTypeName: string;
  shipToLocationName: string;
  materialID: number;
  materialName: string;
  orderQuantity: number;
  equipmentTypeName: string;
  OrderNum: number;
  Organization: string;
  ShipToLocation: string;
  MaterialDescription: string;
  OrderQuantity: number;
  RequestedDeliveryDate: Date;
  ScheduledShipDate: Date;
  MustArriveByDate: Date;
  PONum: string;
  EquipNum: string;
  ContractNo: string;
  Carrier: string;
  IsfinalSeleted: boolean;
  Index: number;
  IsDisable: boolean;

  MaterialName: string;
  ShipToLocationName: string;
  ShipToTypeName: string;
  ToContractName: string;
  ShipFromTypeName: string;
  FromContractName: string;
  FromLocationName: string;
  EquipmentTypeName: string;
  EquivalentPallets: number;
  ContractType: string;
  propertyValue: number;

  constructor() {

    this.ShipFromTypeId = 0;
    this.FromLocationId = 0;
    this.FromAddres = "";
    this.ShipToLocationContactId = 0;
    this.ShipFromLocationContactId = 0;
    this.FromContractId = 0;
    this.CarrierId = 0;
    this.EquipmentTypeId = 0;
    this.ShipToTypeId = 0;
    this.ToLocationId = 0;
    this.ContractNo = '';
    this.PONum = "";
  }
}

export class ShipmentAdjustChargesModel {

  constructor() {
    this.isManual = false;
    this.overrideCommodityID = 0;
    this.overrideCommodityName = '';
    this.overridePriceMethodID = 0;
    this.overridePriceMethodName = '';
    this.overrideRateTypeID = 0;
    this.overrideRateTypeName = '';
    this.overrideRateValue = 0;
    this.isEdited = false;
    this.overrideShowOnBOL = false;
    this.id = 0;
    this.quantityDiff = 0;
    this.orderNumber = '';
    this.toLocationId = 0;
    this.locationName = '';
    this.salesOrderID = 0;
    this.newMaterial = 0;
  }
  id: number;
  quantityDiff: number;
  orderNumber: string;
  toLocationId: number;
  locationName: string;

  materialName: string;
  materialID: number;
  chargeName: string;
  chargeID: number;
  showOnBOL: boolean;
  orderQuantity: number;
  shippedQuantity: number;
  priceMethod: string;
  priceMethodID: number;
  rateValue: number;
  rateTypeName: string;
  rateTypeID: number;
  amount: any;
  commodityName: string;
  commodityID: number;
  isManual: boolean;
  type: string;
  overrideShowOnBOL: boolean;
  overrideRateValue: number = 0;
  overrideCommodityID: number = 0;
  overrideCommodityName: string = '';
  overrideRateTypeID: number = 0;
  overrideRateTypeName: string = '';
  overridePriceMethodID: number = 0;
  overridePriceMethodName: string = '';
  overrideAmount = 0;
  isEdited: boolean = false;
  propertyValue: string;
  mcode: string;
  code: string;
  salesOrderID: number;
  newMaterial: number;
  entityCode: string;
  equivalentPallets: number;
  flag: number;
}

export class FinalShipmentAdjustChargesModel {

  constructor() {
    this.finalisManual = false;
    this.finaloverrideCommodityID = 0;
    this.finaloverrideCommodityName = '';
    this.finaloverridePriceMethodID = 0;
    this.finaloverridePriceMethodName = '';
    this.finaloverrideRateTypeID = 0;
    this.finaloverrideRateTypeName = '';
    this.finaloverrideRateValue = 0;
    this.finalisEdited = false;
    this.finaloverrideShowOnBOL = false;
    this.finalid = 0;
    this.finalquantityDiff = 0;
    this.finalorderNumber = '';
    this.finaltoLocationId = 0;
    this.finallocationName = '';
    this.finalsalesOrderID = 0;
    this.finalnewMaterial = 0;
  }
  finalid: number;
  finalquantityDiff: number;
  finalorderNumber: string;
  finaltoLocationId: number;
  finallocationName: string;
  finalmaterialName: string;
  finalmaterialID: number;
  finalchargeName: string;
  finalchargeID: number;
  finalshowOnBOL: boolean;
  finalorderQuantity: number;
  finalshippedQuantity: number;
  finalpriceMethod: string;
  finalpriceMethodID: number;
  finalrateValue: number;
  finalrateTypeName: string;
  finalrateTypeID: number;
  finalamount: any;
  finalcommodityName: string;
  finalcommodityID: number;
  finalisManual: boolean;
  finaltype: string;
  finaloverrideShowOnBOL: boolean;
  finaloverrideRateValue: number = 0;
  finaloverrideCommodityID: number = 0;
  finaloverrideCommodityName: string = '';
  finaloverrideRateTypeID: number = 0;
  finaloverrideRateTypeName: string = '';
  finaloverridePriceMethodID: number = 0;
  finaloverridePriceMethodName: string = '';
  finaloverrideAmount = 0;
  finalisEdited: boolean = false;
  finalpropertyValue: string;
  finalmCode: string;
  finalcode: string;
  finalsalesOrderID: number;
  finalnewMaterial: number;
  finalentityCode: string;
  finalequivalentPallets: number;
  finalflag: number;
}


export class BulkSalesOrder {
  RequestedDeliveryDate: string;
  ScheduledShipDate: string;
  MustArriveByDate: string;
  PurchaseOrderNumber: string;
  TrailerNumber: string;
  MaterialID: number;
  CarrierId: number;
  ToLocationId: number;
  ShipToTypeId: number;
  ToContractId: number;
  TransplaceOrderComment: string;
  TransplaceDeliveryComment: string;
  CreatedBy: string;
  OrderNumber: string;
  OrderStatusId: number;
  OrderTypeId: number;
  EquipmentTypeId: number;
  ClientId: number;
  ShipFromTypeId: number;
  FromCustomerContractId: number;
  FromLocationId: number;
  SupressEmailConfirmation: string;
  Code: string;
  OrderQuantity: number;
  MaterialName: string;
  Carrier: string;
  ToLocationName: string;
  ShipToTypeName: string;
  ToContractName: string;
  ShipFromTypeName: string;
  FromContractName: string;
  FromLocationName: string;
  EquipmentTypeName: string;
  TotalEquivalentPallets: number;
  EquivalentPallets: number;
  ContractType: string;
  Organization: string;
  PropertyValue: number;
  ExternalReferenceNumber: number;
  OrderSourceSystem: string;
}

export class EditFinalElement {
  MaterialDescription: string;
  TruckOrderQty: number;
  PalletQty: number;
  TransplaceOrderComment: string;
  TransplaceDeliveryComment: string;
  ToCustomerContractId: number;
  ToContractName: string;
  CarrierId: number;
  Carrier: string;
  OrderNum: number;
  materialID: number;
  PropertyValue: number;

}

export class EditVerifyEquipmentMaterialProperty {
  materialID: number;
  equipmentTypeID: number;
  id: number;
  code: string;
  propertyValue: number;
  propertiesUOM: string;
  sno: number;
  propertyValueUP: number;
  propertyValuePE: number;
  propertyValueUE: number;
  materialWeight: number;
  materialName: string;
  idUP: number;
  codeUP: string;
  propertiesUOMUP: string;
  idPE: number;
  codePE: string;
  propertiesUOMPE: string;
  idUE: number;
  codeUE: string;
  propertiesUOMUE: string;
  equipmentTypeName: string;
}

export class SaveVerifyEquipmentMaterialProperty {
  materialID: number;
  equipmentTypeID: number;
  propertyValueUP: number;
  propertyValuePE: number;
  propertyValueUE: number;
  materialWeight: number;
  idUP: number;
  idPE: number;
  idUE: number;
  codeUP: string;
  codePE: string;
  codeUE: string;
  propertiesUOMPE: string;
  propertiesUOMUP: string;
  propertiesUOMUE: string;
  clientID: number;
  createdBy: string;

}

export class MaterialPropertyGrid {
  materialID: number;
  materialName: string;
  equipmentID: number;
  materialWeight: number;
  unitInPallet: number;
  unitInEquipement: number;
  palletInEquipement: number;

}

export class OrderWorkbenchFilterModal {
  OrderNo: string;
  selectedOrderTypeItems = [];
  selectedOrderStatusItems = [];
  selectedOrderConditionItems = [];
  MaxOrderAmount: number;
  MinOrderAmount: number;
  selectedShipFromItems = [];
  selectedShipToItems = [];
  selectedShipFromTypeItems = [];
  selectedShipToTypeItems = [];
  ShipmentNo: string;
  PONo: string;
  selectedMaterialItems = [];
  selectedCarrierItems = [];
  isShipWith: boolean;
  ScheduledShipDateN: string;
  ReqDeliveryDateN: string;
  SourceN: string;
  selectedSalesManagersItems = [];
  selectedInvoiceNoItems = [];
  selectedAllVersionItems = [];
  selectedSourceItems = [];
  MustArriveByDateN: string;
  ShipWithOption:string


}


export class MaterialPlaningreport extends PaginationModel{
  LoginId: string;
  LocationFunctionIDs: string;
  SearchcalendarDate: string;
  FromshipdatecalendarDate: string;
  AssignedToShipment: string;
  ShipmentNumber: string;
  OrderNumber: string;
  ShipDate: string;
  ShipFrom: string;
  ShipTo: string;
  Carrier: string;
  Mode: string;
  Equipment: string;
  Item: string;
  ItemQuantity: string;
  OrderComment: string;
  TransportationComment: string;
  LoadingComment: string;
  OrderId: number;
}


