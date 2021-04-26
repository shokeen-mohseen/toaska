import { PaginationModel } from "./Pagination.Model";
export class FuelPriceViewModel extends PaginationModel {  
  isSelected: boolean;
  isFirstEnabled: boolean = false;
  id: number;
  selectedIds: string;
  countryId: number;
  countryCode: string;
  fuelPriceTypeId: number;
  priceType: string;
  fuelPriceDateTimePicker: string;
  fuelPriceDateTime: Date;
  rate: number;
  uomid: number;
  uom: string;
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
