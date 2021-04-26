export class BolReportShipment {
  id: number;
  shipDate: Date;
  carrierName: string;
  equipment: string;
  shipmentNumber: string;
  shipmentVersion: number;
  trailerNumber: string;
  trailerSealNumber: string;
  fromCarrierInTime: Date;
  fromCarrierOutTime: Date;
}
export class BolReportOrders {
  ID: number;
  route: number;
  orderId: string;
  orderNumber: string;
  mustArriveByDate: Date;
  purchaseOrderNumber: string;
  transportationComment: string;
  spanishTransportationComment: string;
  loadingComment: string;
  spanishLoadingComment: string;
  fromLocation: ReportLocationInfo;
  toLocation: ReportLocationInfo;
  billToLocation: ReportLocationInfo;
  orderDetails: BolReportOrderDetail[] = [];
}


export class ReportLocationInfo {
  locationId: number;
  name: string;
  address: string;
  cityState: string;
}


export class BolReportOrderDetail {
  id: number;
  materialName: string;
  orderNumber: string;
  weight: string;
  orderQuantity: number;
  materialID: number;
  salesOrderID: number;

}
