export class ShipmentProformaInvoice {
  shipmentId: number;
  shipmentNumber: string;
  shipmentVersion: string;
  orderNumber: string;
  orderVersionNumber: string;
  fromLocationID: string;
  fromLocationName: string;
  fromLocationCode: string;
  fromLocationAddress: string;
  fromLocationCityStateZip: string;
  toLocationID: string;
  toLocationName: string;
  toLocationCode: string;
  toLocationAddress: string;
  toLocationCityStateZip: string;
  purchaserID: string;
  purchaserName: string;
  purchaserCode: string;
  purchaserAddress: string;
  purchaserCityStateZip: string;
  transportation: string;
  shipDate: string;
  bolNumber: string;
  commercialInvoiceNumber: string;
  totalQuantity: string;
  totalPackages: string;
  grossWeight: string;
  totalTotal: string;
  netWeight: string;
  vendorEinNumber: string;
  customerReference: string;
  shipmentProformaInvoiceOrderDetail: ShipmentProformaInvoiceOrderDetail[];
}

export class ShipmentProformaInvoiceOrderDetail {
  id: number;
  noOfPackages: string;
  specificationOfCommodity: string;
  weight: string;
  quantity: string;
  unitPrice: string;
  total: string;
}

export class ShipmentProformaInvoiceLocationInfo {
  locationId: number;
  name: string;
  address: string;
  cityState: string;
  organizationId: number;
  tin: string;

}



