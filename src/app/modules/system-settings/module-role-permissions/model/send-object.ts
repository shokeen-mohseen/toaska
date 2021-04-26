import { PaginationModel } from "@app/core/models/Pagination.Model";

export class modulePermission extends PaginationModel {
  Id: number;
  ApplicationModuleId: number;
  RoleId: number;
  PermissionTypeId: number;
  ClientId: number;
  IsActive: boolean
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  Index: number;
  constructor() {
    super();
  }
  
}
export class ModulePaginatorListViewModel extends PaginationModel {

  ClientId: number;
  constructor() {
    super();
  }
}

export class moduleRole {
  ID: number;
  IsSelected: boolean;
  Module: string;
  Role: string;
  Permission: string;
  UpdateDateTimeServer: Date;  
  UpdatedBy: string;

}

export class ClientRoleViewModel extends PaginationModel{
  ID: number;
  Code: string;
  Name: string;
  Description: string;
  UpdateDateTimeBrowserStr: string;
  CreateDateTimeBrowserStr: string;
  ReferenceNo: string;
  ClientId: number;
  IsActive: boolean
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  constructor() {
    super();
  }
}





 
