import { PaginationModel } from "./Pagination.Model";

export class shipmentworkbenchModel extends PaginationModel{
  
  constructor() {
    super();
     
  } 
  ClientId: number;
  InboundOutbound: string;
  shipmentworkbenchFilterModel: ShipmentworkbenchFilterModel;
  UpdatedBy: string;
  //Id: string;

}

export class ShipmenteditModel {

  
}
 export class CommonListViewModel {

  ClientID: number;
  PageNo: number;
  PageSize: number;
  constructor() {
    this.PageNo = 0;
    this.PageSize = 10;
   
  }


}
export class ShipmentMaterialDeatails {
  ID: number;
  MaterialID: number;
  Quantity: number;
  ShowOnBOL: number;
  PriceMethodType: string;
  CommudityName: string;
  OrderNumber: string;
  MaterialName: string;
  LocationName: string;
  QuantityDiff: number;
  ShippedQuantity: number;
  
  
}


export class ShipmentworkbenchFilterModel {
  shipmentNumber: string;
  orderNumber: string;
  poNumber: string;
  shipWith: boolean;
  shipDate: Date;
  reqDeliveryDate: Date;
  mustArriveByDate: Date;
  pickupAppointment: Date;
  deliveryAppointment: Date;
  actDeliveryDate: Date;
  shipmentConditionSelected = [];
  shipmentStatusSelected = [];
  shipmentTypeSelected = [];
  locationTypeFromSelected = [];
  locationTypeToSelected = [];
  locationFromSelected = [];
  locationToSelected = [];
  tenderStatusSelected = [];
  carrierSelected = [];
  constructor() {
  }
}
