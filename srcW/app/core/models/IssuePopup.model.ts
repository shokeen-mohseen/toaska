import { PaginationModel } from "./Pagination.Model";

export class IssuePopup extends PaginationModel {
  isSelected: boolean;
  startDate: Date;
  endDate: Date;
  id: number;
  entityId: number;
  entityKeyId: number;
  moduleId: number;
  moduleIds: string;
  moduleName: string;
  subModuleId: number;
  subModuleIds: string;
  subModuleName: string;
  subModuleDescrption: string;
  description: string;
  priority: string;
  ignoreFlag: string;
  actionTaken: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date
  selectRow: string;

}
export class Module  {
  id: number;
  ids: string;
  referenceNo: string;
  code: string;
  name: string;
  description: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date
  selectRow: string;
}
export class SubModule {
  id: number;
  ids: string;
  moduleId: number;
  referenceNo: string;
  code: string;
  name: string;
  description: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date
  selectRow: string;
}

