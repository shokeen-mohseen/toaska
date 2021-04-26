import { PaginationModel } from "./Pagination.Model";

export class CustomerByLocation extends PaginationModel {
  isSelected: boolean;
  id: number;
  customerId: number;
  customerCode: string;
  customerDescription: string;
  customerName: string;
  organizationID: number;
  orgName: string;
  setupDone: boolean;
  setupDoneDateTime: Date;
  setupDoneBy: string;
  customerTypeName: string;
  billingEntityID: number;
  billingEntityName: string;
  groupNameID: number;
  groupName: string;
  enterpriseID: number;
  enterpriseName: string;
  referenceNo: string;
  masInventoryWarehouse: string;
  organizationIsActive: boolean;
  loadingComment: string;
	transportationComment: string;
	defaultCommodityID: number;
	salesManagerId: number;
	salesBrokerId: number;
  cityState: string;
  isDeleted: boolean;
  isActive: boolean;
  clientID: number;
  sourceSystemID: number;
  updateDateTimeBrowser: Date;
  updateDateTimeServer: Date;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  updatedBy: string;

  constructor() {
      super();
  }
 
}

export class CustomerByLocationStatusModel {
  id: number;
  isActive: boolean;
  updateDateTimeBrowser: string;
  updatedBy: string;
  constructor() {
  }

}


export class CustomerByLocationEditModel {
  customerId: number;
  isActive: boolean;
  loadingComment: string;
  transportationComment: string;
  defaultCommodityID: number;
  salesManagerId: number;
  salesBrokerId: number;
  setupDone: boolean;
  setupDoneDateTime: Date;
  setupDoneDateTimeSave: string;
  setupDoneBy: string;
  updateDateTimeBrowser: Date;
  updateDateTimeBrowserSave: string;
  updatedBy: string;
}

export class CustomerByLocationForecastMaterailAddModel {
  locationId: number;
  materialId: number;
  selectedMaterialIds: string;
  updateDateTimeBrowser: Date;
  updatedBy: string;
  createdBy: string;
  createDateTimeBrowser: Date;
  isDeleted = false;
  clientId: number;
  constructor() {
  }

}

// added by rizwan 
export class LocationExistingCharacteristicsModel {
  isSelected: boolean;
  locationId: number;
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
  isnew: boolean;
  constructor() {
  }

}





