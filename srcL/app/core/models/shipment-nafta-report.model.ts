export class ShipmentNaftaReportShipment {
  id: number;
  shipDate: Date;
  carrierName: string;
  equipment: string;
  shipmentNumber: string;
  trailerNumber: string;
  trailerSealNumber: string;
  fromCarrierInTime: Date;
  fromCarrierOutTime: Date;
}
export class ShipmentNaftaReportOrders {
  id: number;
  orderID: number;
  orderNumber: string;
  materialID: number;
  countryId: number;
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
  authorizedSignature: string;
  isDeleted: boolean;
  clientID: number;
  sourceSystemID: string;
  updatedBy: string;
  updateDateTimeServer: string;
  updateDateTimeBrowser: string;
  createdBy: string;
  createDateTimeBrowser: string;
  createDateTimeServer: string;
  orgAddress: string;
  cityState: string;
  tin: string;
  organization: string;
  organizationId: string;
  authSignature: any;
  referenceNo: string;
  userId: string;
  fromLocation: ShipmentNaftaLocationInfo;
  toLocation: ShipmentNaftaLocationInfo;
  billToLocation: ShipmentNaftaLocationInfo;
  orderDetails: ShipmentNaftaOrderDetail[] = [];
}


export class ShipmentNaftaLocationInfo {
  locationId: number;
  name: string;
  address: string;
  cityState: string;
  organizationId: number;
  tin: string;

}


export class ShipmentNaftaOrderDetail {
  id: number;
  materialName: string;
  orderNumber: string;
  weight: string;
  orderQuantity: number;
  materialID: number;
  salesOrderID: number;

}
