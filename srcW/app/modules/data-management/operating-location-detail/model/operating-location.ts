import { PaginationModel } from "../../../../core/models/Pagination.Model";

export class BaseOpearting extends PaginationModel{
  ClientId: number;
  isSelected: boolean;
}

export class OperatingLocation extends BaseOpearting  {
  LocationFunction: string;
  locationId: number;
  LocationFunctionId: number;
  Description: string;
  OrganizationId: number;
  LocationDescription: string;
  EnterPriseName: string;
  GroupName: string;
  BillingName: string;
  CityName: string;
  StateName: string;
  PropertyValue: string;
  SetupComplete: boolean;
  SetupCompleteBy: string;
  SetupCompleteDateTime: string;
  UpdateDateTimeBrowser: string;
  id: number;
  MasInventoryWarehouse: any;
  UpdatedBy: string;
  IsActive: boolean;
  SourceSystemID: number;
  IsDeleted: boolean;
  constructor() {
    super();
    this.isSelected = false;
  }
}

export class OperatingLocation2 {
  LocationFunction: string;
  LocationId: number;
  LocationFunctionID: number;
  LocationDescription: string;
  EnterPriseName: string;
  GroupName: string;
  BillingName: string;
  CityName: string;
  StateName: string;
  PropertyValue: string;
  SetupComplete: boolean;
  SetupCompleteDateTime: string;
  id: number;
  ClientId: number;
  MasInventoryWarehouse: any;
  isSelected: boolean; isActive: boolean;
  
  constructor() {
  }
}
