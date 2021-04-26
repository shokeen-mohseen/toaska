import { PaginationModel } from "./Pagination.Model";
import { FreightMode } from "../../modules/system-settings/modals/freightmode";
export class EquipmentViewModel extends PaginationModel {  
  isSelected: boolean;
  id: number;
  selectedIds: string;
  equipmentClassID: number;
  code: string;
  name: string;
  description: string;
  maxPalletQty: number;
  leastFillPalletQty: number;
  tmsCode: string;
  equipmentMappingwithFreightModes: EquipmentTypeFreightModeMapModel[];
  freightmodeEquipmentTypeMappingViewModel: FreightModeEquipmentTypeModel[];
  setupComplete: boolean;
  setupCompleteDateTime: Date;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  PageNo: number;
  PageSize: number;
  constructor() {
    super();
  }
}

export class EquipmentTypeAEModel{
  isSelected: boolean;
  id: number;  
  equipmentClassID: number;
  code: string;
  name: string;
  description: string;
  maxPalletQty: number;
  leastFillPalletQty: number;
  tmsCode: string;
  setupComplete: boolean;
  setupCompleteDateTime: Date;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  freightmodeEquipmentTypeMappingViewModel: FreightModeEquipmentTypeMapModel[];
  constructor() {    
  }
}

export class EquipmentTypeCheckModel {
  isSelected: boolean;
  id: number;
  selectedIds: string;
  equipmentClassID: number;
  code: string;
  name: string;
  description: string;
  maxPalletQty: number;
  leastFillPalletQty: number;
  tmsCode: string;
  equipmentMappingwithFreightModes: EquipmentTypeFreightModeMapModel[];
  freightmodeEquipmentTypeMappingViewModel: FreightModeEquipmentTypeModel[];
  setupComplete: boolean;
  setupCompleteDateTime: Date;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  PageNo: number;
  PageSize: number;
  constructor() {
  }
}


export class EquipmentTypeSaveModel {
  //IsSelected: boolean;
  ID: number;
  //EquipmentClassID: number;
  Code: string;
  Name: string;
  description: string;
  MaxPalletQty: number;
  LeastFillPalletQty: number;
  //TmsCode: string;
  SetupComplete: boolean;
  SetupCompleteDateTime: string;
  IsDeleted: boolean;
  ClientID: number;
  SourceSystemID: number;
  //EquipmentMappingwithFreightModes: null;
  UpdatedBy: string;
  //UpdateDateTimeServer: Date;
  //UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  //CreateDateTimeBrowser: Date;
  //CreateDateTimeServer: Date;  
  freightmodeEquipmentTypeMappingViewModel: FreightModeEquipmentTypeMapModel[];
  constructor() {
  }
}

export class FreightModeEquipmentTypeMapModel {  
  FreightModeId: number;  
  IsDeleted: boolean;
  ClientId: number;
  SourceSystemId: number;
  constructor() {
  }
}

export class FreightModeEquipmentTypeModel {
  freightModeId: number;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  constructor() {
  }
}

export class EquipmentTypeFreightModeMapModel {
  clientID: number;
  equipmentTypeID: number;
  equipmentMapId: number;
  freightModeID: number;
  freightModeCode: string;
  freightModeName: string;
  freightModeDescription: string;
  constructor() {
  }
}

export class CopyEquipmentPropertyModel {
  EquipmentCodeGlobal: string;
  EquipmentCodeDropDown: string;
  ClientID: number;
  constructor() {
  }
}

export class MaterialPropertyDetailByEquipmentModel extends PaginationModel {
  id: number;
  equipmentTypeID: number;
  materialID: number;
  entityPropertyID: number;
  MaterialIDs: string;
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
