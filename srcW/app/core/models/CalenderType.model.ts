import { PaginationModel } from "./Pagination.Model";

export class CalendarType extends PaginationModel {
  Id: number;
  ReferenceNo: string;
  Code: string;
  Name: string;
  Description: string;
  CalenderStartDate: string;
  CalenderIntervaldays: string;
  IsDeleted: boolean;
  ClientId: number;
  SourceSystemId: number;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
}



