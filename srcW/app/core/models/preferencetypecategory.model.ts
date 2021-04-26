import { PaginationModel } from "./Pagination.Model";
export class PreferenceTypeCategory extends PaginationModel{
  id: number;
  referenceNo: string;
  code: string;  
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
  responseMessageCode: number;
  responseMessage: string;
  pageNo: number;
  pageSize: number;
}

