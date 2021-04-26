import { PaginationModel } from "./Pagination.Model";

export class ShipmentNaftaReportData extends PaginationModel {
  isSelected: boolean;
  Organization: string;
  organizationId: number;
  exporterName: string;
  exporterAddress1: string;
  exporterAddress2: string;
  fromCalendarYear: Date;
  toCalendarYear: Date;
  exporterTaxIdentificationNumber: string;
  importerName: string;
  importerAddress1: string;
  importerAddress2: string;
  importerTaxIdentificationNumber: string;
  descriptionofGood: string;
  hsTariffClassificationNumber: string;
  preferenceCriterion: string;
  producer: string;
  netCost: string;
  countryofOrigin: string;
  companyName: string;
  name: string;
  title: string;
  date: Date;
  telephoneNumberVoice: string;
  telephoneNumberFacsimile: string;
  expNo: string;
  authSignature: any;
  authorizedSignature: any;
  isDeleted: boolean; 
  clientId: number;
  SourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  id: any;
  selectRow: string;


}



