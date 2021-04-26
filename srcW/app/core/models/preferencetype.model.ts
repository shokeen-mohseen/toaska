import { PaginationModel } from "./Pagination.Model";
export class PreferenceType extends PaginationModel{
  Id: number;
  GroupName: string;
  code: string;  
  description: string;
  typeValue: string;
  ModifiedValue: string;
  Uomid: number;
  IsEditable: boolean;
  webControlTypeID: number;
  PreferenceTypeCategoryId: number;
  PreferenceDetailDescription: string;
  userPreferenceModifiedValue: string;
  userPreferenceModifiedValueIDs: string;
  id: number
  preferenceTypeId:number
  IsDeleted: boolean;
  ClientId: number;
  SourceSystemId: number;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  responseMessageCode: number;
  responseMessage: string;
  pageNo: number;
  pageSize: number;
    isSelected: boolean;
}

export class PreferenceTypeViewModel {
  groupName: string;
  code: string;
  description: string;
  typeValue: string;
  uomid: number;
  isEditable: boolean;
  preferenceTypeCategoryId: number;
  preferenceDetailDescription: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
}
