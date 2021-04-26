import { PaginationModel } from "./Pagination.Model";

export class Contract extends PaginationModel {
  ClientId: number;
  LocationTypeId?: number;
  LocationID?: number;
  constructor() {
    super();
  }
} 
export class ContractViewModel {
  ID: number;
  Contract_Type: string;
  ContractTypeId: number;
  ClientID: number;
  Contract_No: string;
  Version: string;
  Description: string;
  Billing_Entity: string;
  Customer_Ship_To_Location: string;
  Business_Partner: string;
  Customer_Code: string; 
  Effective_Start: string;
  Effective_End: string;
  EarliestPriceEnd: string;
  Evergreen: string;
  End_Alert_Days: string;
  Status: string;
  ContractApproved: string;
  LocationStatus: boolean;
  LocationSetupComplete: boolean;
  Approved_Datetime: string;
  IsSelected: boolean = false;
}

export class ContractObjectViewModel {
  Id: number;
  Code: string;
  ContractNumber: string;
  Description: string;
  ParentId: number;
  LocationId: number;
  ContractTypeId: number;
  ContractVersion: number;
  ContractVersionString: string;
  TermStartDate: Date;
  TermEndDate: Date;
  ContractEndAlertDays: number;
  ShippingInstructions: string;
  SetupComplete: boolean;
  SetupCompleteDateTime: Date;
  TransportationComment: string;
  LoadingComment: string;
  RowVersion: number;
  ContractComment: string;
  IsActive: number;
  EarliestPriceEndDate: Date;
  OrderComment: string;
  IsDeleted: boolean;
  ClientId: number;
  SourceSystemId: number;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  UpdateDateTimeServer: Date;
}

export class LineItem {
  Id: number;
  Material: string;
  Charge: string;
  Rate: string;
  RateType: string;
  UOM: string;
  Quantity_per_UOM: string;
  Commodity: string;
  Sales_Tax_Price: string;
  PriceIncreaseMethod: string;
  ShowOnBOL: boolean;
  AutoAdded: boolean;
  AddPallet: boolean;
  MethodType: string;
  EffectiveStart: Date;
  EffectiveEnd: Date;
  Add_New: string;
  Delete: string;
  ChargeId: number;
  MaterialId: number;
  ContractTypeId: number;
  ParentId: number;
  IsDeleted: boolean;
  IsDisabledAddPallet: boolean = true;
}

export class ContractDetails {
  ContractTypeId: number;
  Id?: number;
  BusinessPartnerContractId?: number;
  CustomerContractId?: number;
  PriceMethodTypeId?: number;
  MaterialId?: number;
  ChargeId?: number;
  Uomid?: number;
  CommodityId?: number;
  QuantityPerUom?: number;
  DetailDescription: string;
  TermStartDate?: Date;
  TermEndDate?: Date;
  ShippingInstructionsNotRequired?: boolean;
  RateValue: number;
  ChargeComputationMethodId?: number;
  ShowOnBol?: number;
  IsRequired?: number;
  SalesTaxClassId?: number;
  PriceIncreaseMethodTypeId?: number;
  AddPalletBags?: number;
  IsDeleted: boolean;
  ClientId?: number;
  SourceSystemId?: number;
  CreatedBy: string;
  CreateDateTimeBrowser?: Date;
  CreateDateTimeServer: Date;
  UpdatedBy: string;
  UpdateDateTimeBrowser?: Date;
  UpdateDateTimeServer: Date;

}

export class DefineCharacteristics {
  Id?: number;
  ContractTypeId?: number;
  CustomerContractId?: number;
  BusinessPartnerContractId?: number;
  EntityPropertyId: number;
  PropertyValue: string;
  PropertiesUom: string;
  IsDeleted?: boolean;
  ClientId?: number;
  SourceSystemId?: number;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser?: Date;
  CreatedBy: string;
  CreateDateTimeBrowser?: Date;
  CreateDateTimeServer?: Date;
}

export class ContractFuelPrice {
  id: number;
  locationId: number;
  entityPropertyId: number;
  propertyValue: string;
  propertiesUom: string;
  isDeleted: boolean;
  clientID: number;
  sourceSystemID: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
}

// Developed By Kapil Pandey 22-Jan-2021


export class ContractFullDetails {
  id: number;
  Code: string;
  ContractNumber: string;
  Description: string;
  ParentId: number;
  LocationId: number;
  ContractTypeId: number;
  ContractVersion: number;
  ContractVersionString: string;
  TermStartDate: Date;
  TermEndDate: Date;
  TermStartDateStr: string;
  TermEndDateStr: string;
  ContractEndAlertDays: number;
  ShippingInstructions: string;
  SetupComplete: boolean;
  SetupCompleteDateTime: Date;
  TransportationComment: string;
  LoadingComment: string;
  RowVersion: number;
  ContractComment: string;
  IsActive: number;
  EarliestPriceEndDate: Date;
  OrderComment: string;
  IsDeleted: boolean;
  ClientId: number;
  SourceSystemId: number;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  CreateDateTimeBrowserStr: string;
  UpdateDateTimeBrowserStr: string;


  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  UpdateDateTimeServer: Date;
  lineItems: ContractLineItemDetails[] = [];
  contractCharacterstics: ContractCharacteriStics[] = [];
}

export class ContractLineItemDetails
{
 // selectRow: any;
  id: number;
  material: string;
  materialID: number;
  charge: string;
  chargeID: number;
  commodity: string;
  commodityID: number;
  rateType: string;
  rateTypeID: number;
  rate: number;
  uom: string;
  uomid: number;
  quantity_per_UOM: any;
  QuantityPerUom: number;
  DetailDescription: string;
  sales_Tax_Price: string;
  salesTaxClassID: number;
  methodType: string;
  priceMethodTypeID: number;
  showOnBOL: any;
  autoAdded: any;
  addPallet: any;
  priceIncreaseMethod: string;
  priceIncreaseMethodTypeID: number;
  effectiveStart: Date;
  effectiveStartStr: string;
  effectiveEnd: Date;
  effectiveEndStr: string;
  Add_New: string;
  Delete: string;
  IsDeleted: boolean;
  IsDisabledAddPallet: boolean;

  CustomerContractId: number;
  BusinessPartnerContractId: number;
  ContractTypeId: number;
  clientId: number;
  CreatedBy: string;
  UpdatedBy: string;
  CreateDateTimeBrowser: Date;
  UpdateDateTimeBrowser: Date;
}

export class ContractCharacteriStics
{
  selectRow: any;
  id: number;
  entityId: number;
  code: string;
  description: string;
  value: string;
  uom: string;

  constructor() {

    this.selectRow = false;
  }
}


