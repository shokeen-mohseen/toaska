import { PaginationModel } from "./Pagination.Model";
export class MessageViewModel extends PaginationModel {  
  
  id: number;
  messageTypeId: number;
  message1: string;
  sourceModuleId: number;
  sourceSubModuleId: number;
  isPrompt: number;
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
