import { PaginationModel } from "./Pagination.Model";

export class FreightLane extends PaginationModel {
  isSelected: boolean;
  mode: string;
  name: string;
  code: string;
  Index: number;
  id: number;
  addlist: number;
  freightLaneDetId: number;
  freightMode: string;
  fromCountry: string;
  fromState: string;
  fromCity: string;
  fromZipcode: string;
  toCountry: string;
  toState: string;
  toCity: string;
  toZipcode: string;
  carrier: string;
  ratePerLoad: number;
  ratePerUom: string;
  equipmentType: string;
  freightLaneTypeId: number;
  freightModeId: number;
  fromGeoLocationId: number;
  toGeoLocationId: number;
  fromGeoLocation: string;
  toGeoLocation: string;
  isActive: boolean;
  distance: number;
  distanceUOM: string;
  distanceUomid: number;
  travelTime: number;
  travelTimeUomid: number;
  travelTimeInDays: number;
  freightLaneId: number;
  carrierID: number;
  equipmentTypeID: number;
  materialId: number;
  quantity: number;
  quantityUomid: number;
  costPerUnit: number;
  costUOMID: number;
  selectRow: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  addedlistDisplay: string;
  countryCode: string;
  


}


