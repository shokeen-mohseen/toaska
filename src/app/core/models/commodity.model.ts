import { PaginationModel } from "./Pagination.Model";

export class CommodityCallListViewModel{

  ClientID: number;   
  constructor() {
    
  }
}

export class CommodityTypeListViewModel {

  ClientID: number;
  constructor() {
    
  }
}

export class PeriodicElement {
  id: number;
  Commoditytype: string;
  CommodityName: string;
  SegmentDescription: string;   
  IsSeleted: boolean = false;
  Count: number = 0;
  constructor() {
    this.IsSeleted = false;
    this.Count = 0;
  }
}


export class CommodityPaginatorListViewModel{

  ClientID: number;
  constructor() {
    
  }
}

export interface CommodityType {
  ID: number;
  Code: string;
  Name: string;
  Description: string;
  IsDeleted: false;
  ClientID: number;
  SourceSystemID: null;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  responseMessageCode: number;
  responseMessage: string;
  pageNo: number;
  pageSize: number;
}

export interface CommodityTypeViewModel {  
  code: string;
  name: string;
  description: string;
  isDeleted: false;
  clientID: number;
  sourceSystemID: null;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  responseMessageCode: number;
  responseMessage: string;  
}

export interface SegmentType {
  ID: number;
  DepartmentTypeID: number;
  Code: string;
  Name: string;
  Description: string;
  IsDeleted: false;
  ClientID: number;
  SourceSystemID: null;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  responseMessageCode: number;
  responseMessage: string;
  pageNo: number;
  pageSize: number;

}

export class Commodity {  
  commodityTypeID: number;
  commodityTypeName: string;
  departmentID: number;
  segmentDescription: string;
  code: string;
  name: string;
  description: string;
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
  }
}
export class CommodityEitModel extends Commodity {
  IsSeleted: boolean = false;
  Count: number = 0;
  id: number;
  constructor() {
    super();
  }
}

export class CommodityNewModel extends PaginationModel{
  IsSeleted: boolean;
  Count: number;
  id: number;
  commodityTypeID: number;
  commodityTypeName: string;
  departmentID: number;
  segmentDescription: string;
  code: string;
  name: string;
  description: string;
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

export class CommodityCheckModel {
  IsSeleted: boolean;
  Count: number;
  id: number;
  commodityTypeID: number;
  commodityTypeName: string;
  departmentID: number;
  segmentDescription: string;
  code: string;
  name: string;
  description: string;
  isDeleted: false;
  clientID: number;
  sourceSystemID: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  constructor() { }
}
export interface CommodityTypeEitModel extends CommodityTypeViewModel {

  id: number;
}
