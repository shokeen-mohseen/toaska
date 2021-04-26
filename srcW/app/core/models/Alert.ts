import { PaginationModel } from "./Pagination.Model";
export class AlertViewModel extends PaginationModel {  
  ID: number;
  Name: string;
  Description: string;
  EmailTo: string;
  InternalUsers: string;
  ExternalContact: string;
  Active: string;
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
