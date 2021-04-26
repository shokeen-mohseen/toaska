import { EntityclientPropertyControlValueViewModel } from "./Entity";
import { PaginationModel } from "./Pagination.Model";

export class Organization extends PaginationModel {
  isSelected: boolean;
  billingName: string;
  code: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  createdBy: string;
  description: string;
  enterPriseName: string;
  filterOn: string;
  groupName: string;
  id: number;
  isActive: boolean;
  isDeleted: boolean;
  name: string;
  setupComplete: boolean;
  setupCompleteBy: string;
  setupCompleteDateTime: Date;
  organizationFunction: string;
  organizationId: number;
  responseMessage: string;
  responseMessageCode: number;
  sortColumn: string;
  sortOrder: string;
  sourceSystemID: number;
  updateDateTimeBrowser: Date;
  updateDateTimeServer: Date;
  updatedBy: string;
  ClientID: number;
  pageNo: number;
  pageSize: number;
  SortOrder: string;
  constructor() {
    super();
  }

}

export class DefaultOrganiationCharacteristicsModel {
  id: number;
  description: string;
  isDeleted: boolean;
  entityPropertyID: number;
  entityClientPropertyId: number;
  entityPropertyCode: string;
  entityCode: string;
  webControlCode: string;
  requiredUom: boolean;
  entityclientPropertyControlValueViewModel: EntityclientPropertyControlValueViewModel[] = [];
  valueSelected: any;
  uomSeleceted = [];
}


export class OrganizationExistingCharacteristicsModel {
  isSelected: boolean;
  id: number;
  entityPropertyID: number;
  displayName: string;
  propertiesUom: string;
  propertyValue: string;
  isDeleted = false;
  sourceSystemId: number;
  clientId: number;
  updatedBy: string;
  createdBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  constructor() {
    this.isSelected = false;
  }

}

