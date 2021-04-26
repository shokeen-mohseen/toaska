import { PaginationModel } from "./Pagination.Model";
import { DecimalPipe } from "@angular/common";
import { Data } from "ngx-bootstrap/positioning/models";

export class FuelChargeIndex extends PaginationModel {
  isSelected: boolean;
  Id: number;
  fuelPriceTypeId: number;
  fuelPriceType: string;
  fromFuelPrice: number;
 toFuelPrice: number;
  fuelPriceUomid: number;
  fuelPriceUom: string;
 chargeRatePerMile: number;
  chargeRateUomid: number;
  chargeRateUom: string;
 effectiveStartDate: string | Date;
  effectiveEndDate: string | Date;
  createDateTimeBrowserStr: string | Date;
 isDeleted: boolean; 
  clientID: number;
 sourceSystemId: number;
 updatedBy: string;
 updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  updateDateTimeBrowserStr: string | Date;
 createdBy: string;
 createDateTimeBrowser: Date;
 createDateTimeServer: Date;
 id: any;
  selectRow: string;
}
export class FuelSurCharge {
  FuelPriceTypeId: number;
  FromFuelPrice: number;
  ToFuelPrice: number;
  FuelPriceUomid: number;
  ChargeRatePerMile: number;
  ChargeRateUomid: number;
  EffectiveStartDate: Date;
  EffectiveEndDate: Date;
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


