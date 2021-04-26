import { PaginationModel } from "../../../../core/models/Pagination.Model";

export class Geolocation extends PaginationModel {
  id: number;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityName: string;
  zipCode: string;
  updatedBy: string;
  updateDateTimeBrowser: string;
  createDateTimeBrowser: string;
  createdBy: string;
  cityCode: string;
  clientId: number;
  isSelected: boolean;
  isActive: boolean;
  sourceSystemID: number;
  }
