import { PaginationModel } from "./Pagination.Model";
export class LocationFunctionViewModel extends PaginationModel {  
  isSelected: boolean;
  id: number;
  selectedIds: string;  
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
  createDateTimeServer: Date;
  PageNo: number;
  PageSize: number;
  constructor() {
    super();
  }
}

