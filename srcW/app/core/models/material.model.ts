import { PaginationModel } from "./Pagination.Model";

export class MaterialCommodityMap extends PaginationModel {
  isSelected: boolean;
  id: number;
  code: string;
  sku: string;
  name: string;
  description: string;
  materialHierarchyID: number;
  materialHierarchyName: string;
  effectiveStartDate: Date;
  effectiveEndDate: Date;
  setupComplete: boolean = false;
  setupDone: string;
  setupCompleteDateTime: Date;
  status: string;
  isReserveStr: string;
  isReserve: boolean = false;
  defaultCommodityID: number;
  externalSourceMaterialKey: string;
  referenceNo: string;
  defaultCommodity: string;
  isActive: boolean = false;
  isDeleted: boolean = false;
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

export class MaterialGroupModel extends PaginationModel{
  id: number;
  code: string;
  name: string;
  description: string;
  parentGroupID: number;
  parentCode: string;
  isDeleted: boolean = false;
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

export class MaterialGroupDetailModel extends PaginationModel{
  id: number;
  materialGroupID: number;
  materialGroupValue: string;
  materialGroupValueDesc: string;
  isDeleted: boolean = false;
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

export class MaterialHierarchyModel extends PaginationModel {
  id: number;
  code: string;
  name: string;
  description: string;
  isDeleted: boolean = false;
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

export class MaterialHierarchyDetailModel extends PaginationModel {
  id: number;
  materialHierarchyID: number;
  materialGroupDetailID: number;
  materialGroupID: number;
  materialGroupValue: string;
  materialGroupValueDesc: string;
  isDeleted: boolean = false;
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

export class MaterialPropertyModel {
  id: number;
  code: string;
  description: string;
  controlTypeName: string;
  materialPropertyValueUom: string;
  validationId: number;
  isVisible: boolean = false;
  isEditable: boolean = false;
  requiredUom: boolean = false;
  isDeleted: boolean = false;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  constructor() {
  }
}

export class MaterialPropertyDetailModel {
  isSelected: boolean;
  materialPropertyID: number;
  materialID: number;
  code: string;
  description: string;
  materialPropertyValue: string;
  materialPropertyValueUOM: string;
  matpDID: number;
  matCode: string;
  matName: string;
  validationID: number;
  isVisible: boolean = false;
  isEditable: boolean = false;
  requiredUom: boolean = false;
  isDeleted: boolean = false;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  constructor() {
  }
}

export class UOMModel {
  id: number;
  code: string;
  name: string;
  description: string;
  dataType: string;
  dataTypeScale: boolean = false;
  dataTypePrecision: string;
  isDeleted: boolean = false;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  constructor() {
  }
}

export class MaterialPropertyDetailEditModel {
  isSelected: boolean;
  materialPropertyID: number;
  materialID: number;
  code: string;
  description: string;
  controlDisplayValue: string;
  materialPropertyValue: string;
  materialPropertyValueUOM: string;
  matpDID: number;  
  matCode: string;
  matName: string;
  validationID: number;
  isVisible: boolean = false;
  isEditable: boolean = false;
  requiredUom: boolean = false;
  isDeleted: boolean = false;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  constructor() {
  }
}

export class SaveUpdateModel {
  id: number;
  MaterialID: number;
  MaterialPropertyID: number;
  MaterialPropertyValue: string;
  MaterialPropertyValueUOM: string;
  ValidationID: number;
  IsVisible: boolean;
  IsEditable: boolean;
  RequiredUom: boolean;
  IsDeleted: boolean;
  ClientId: number;
  SourceSystemID: number;
  UpdatedBy: string;
  CreateDateTimeServer: Date;
  CreateDateTimeBrowser: Date;
  CreatedBy: string;
  UpdateDateTimeBrowser: Date;
  UpdateDateTimeServer: Date;
  constructor() {
  }
}

export class CopyMaterialPropertyModel {
  First: number;
  Second: number;
  constructor() {
  }
}

export class CopyEquipmentMaterialPropertyModel {
  MaterialCodeGlobal: string;
  MaterialCodeDropDown: string;
  ClientID: number;
  constructor() {
  }
}

export class EquipmentTypeMaterialPropertyDetailModel extends PaginationModel{
  id: number;
  equipmentTypeID: number;
  materialID: number;
  entityPropertyID: number;
  equipmentTypeIDs: string;
  propertyValue: string;
  propertiesUOM: string;
  equipmentTypeCode: string;
  equipmentTypeDescription: number;
  entityPropertyCode: string;
  entityPropertyDescription: string;
  materialCode: string;
  materialDescription: string;
  isDeleted: boolean;
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

export class SaveUpdateEquipmentMaterialModel {
  id: number;
  EquipmentTypeID: number;
  MaterialID: number;
  EntityPropertyID: number;  
  PropertyValue: string;
  PropertiesUOM: string;  
  IsDeleted: boolean;
  ClientID: number;
  SourceSystemID: number;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  constructor() {
  }
}

export class MapForecastCustomerLocationModel extends PaginationModel {
  id: number;
  materialID: number;
  locationID: number;
  locationCode: string;
  locationName: string;
  entityPropertyID: number;
  code: string;
  displayName: string;
  propertyValue: string;
  propertiesUOM: string;  
  isDeleted: boolean;
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

export class CustomerLocationDDModel {
  id: number;
  locationID: number;
  locationCode: string;
  locationName: string;
  entityPropertyID: number;
  dropDownValue: string;  
  propertyValue: string;
  propertiesUOM: string;
  isDeleted: boolean;
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

export class MapForecastCustomerLocationEditModel {
  ID: number;
  MaterialID: number;
  LocationID: number;  
  EntityPropertyID: number;  
  PropertyValue: string;
  PropertiesUOM: string;
  IsDeleted: boolean;
  ClientID: number;
  SourceSystemID: number;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  constructor() {
  }
}

export class MaterialPropertyControlValueModel {
  code: string;
  description: string;
  controlTypeName: string;  
  materialPropertyID: number;
  controlDisplayValue: string;
  controlDatabaseValue: string;
  materialPropertyValueUOM: string;
  validationID: number;
  isVisible: boolean;
  isEditable: boolean;
  requiredUom: boolean;  
  constructor() {
  }
}
export class commonModel {
  ClientID: number;
  constructor() {
  }
}
