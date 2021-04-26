import { PaginationModel } from "./Pagination.Model";

                                              
export class InventoryModel extends PaginationModel {
  IsSeleted: boolean;
  id: number;
  locationID: number;  
  materialID: number;
  inventoryTypeID: number;
  amount: number;
  amountUOMID: number;
  quantity: number;
  quantityUOMID: number;
  status: string;
  locationType: string;
  location: string;
  materialCode: string;
  materialName: string;
  uom: string;
  comment: string;
  isDeleted: false;
  clientID: number;
  sourceSystemID: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  constructor() {
    super();
  }
}

export class CommonModel {
  LocationFunctionId: number;
  clientID: number;
  constructor() {
  }
}

export class TotalSumQuantityModel {
  total: number;
  constructor() {
  }
}

export class CommentModel {
  id: number;
  comment: string;
  constructor() {
  }
}
