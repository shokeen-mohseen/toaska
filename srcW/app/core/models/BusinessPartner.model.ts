import { PaginationModel } from "./Pagination.Model";

export class BPByLocation extends PaginationModel {
  isSelected: boolean;
  id: number;
  businessPartnerID: number;
  businessPartnerId: number;
  businessPartnerCode: string;
  businessPartnerDescription: string;
  businessPartnerName: string;
  organizationID: number;
  orgName: string;
  locationFunctionID: number;
  locationFunctionName: string;
  setupDone: boolean;
  setupDoneDateTime: Date;
  setupDoneBy: string;
  businessPartnerTypeName: string;
  billingEntityID: number;
  billingEntityName: string;
  groupNameID: number;
  groupName: string;
  enterpriseID: number;
  enterpriseName: string;
  referenceNo: string;
  isDeleted: boolean;
  isActive: boolean;
  clientID: number;
  sourceSystemID: number;
  masInventoryWarehouse: string;
  cityState: string;
  loadingComment: string;
  transportationComment: string;
  updateDateTimeBrowser: Date;
  updateDateTimeServer: Date;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  updatedBy: string;

  constructor() {
      super();
  }
 
}
export class BPByCarrier extends PaginationModel  {
  isSelected: boolean;
  id: number;
  businessPartnerID: number;
  businessPartnerId: number;
  businessPartnerCode: string;
  businessPartnerDescription: string;
  businessPartnerName: string;
  organizationID: number;
  orgName: string;
  setupDone: boolean;
  setupDoneDateTime: Date;
  setupDoneBy: string;
  businessPartnerTypeName: string;
  billingEntityID: number;
  billingEntityName: string;
  groupNameID: number;
  groupName: string;
  enterpriseID: number;
  enterpriseName: string;
  referenceNo: string;
  isDeleted: boolean;
  isActive: boolean;
  clientID: number;
  sourceSystemID: number;
  scacValue: string;
  cityState: string;
  loadingComment: string;
  transportationComment: string;
  updateDateTimeBrowser: Date;
  updateDateTimeServer: Date;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  updatedBy: string;
  createdBy: string;

  constructor() {
      super();
  }

}


export class BPLocationFunction {
  id: number;
  name: string;

  constructor() {
   
  }
}

export const BusinessConstant = {
  Active: 'Active',
  Locked: 'Locked',
  Declined: 'Declined',  
  PageActionBP: 'Location',
  PageActionCarrier:'Carrier',
  ScreenAction:'BP'
  
}


export class BusinessPartnerExistingCharacteristicsModel {
  isSelected: boolean;
  locationId: number;
  carrierId: number;
  id: number;
  entityPropertyID: number;
  displayName: string;
  propertiesUom: string;
  propertyValue: string;
  isDeleted = false;
  clientId: number;
  sourceSystemID: number;
  updatedBy: string;
  createdBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  constructor() {
  }

}
