import { PaginationModel } from "./Pagination.Model";

export class Forecast extends PaginationModel {
  isSelected: boolean = false;
  id: number;
  forecastTypeId: number;
  ForecastId: number;
  ForecastCId: number;
  code: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startDateStr: string;
  endDateStr: string;
  salesManagerIds: any;
  isActive: string;
  historicalForecastId: string;
  calendarTypeId: number;
  noOfDaysInAperiod: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  updateDateTimeBrowserStr: string;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  isPublished: boolean;
  isLocked: boolean;
}


export class ForecastChildern extends Forecast {
  id: number;
  importedBy: string;
  importedDateTime: Date;
}


export class DeleteForecastChildernMapping {
  parentForecastId: number;
  childForecastIdToDelete: number[];
}


export class CommonOrderModel {
  OrderTypeId: number;
  ClientID: number;
  LocationFunctionID: number;
  LocationID: number;
  Action: string;
}

