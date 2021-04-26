import { PaginationModel } from "./Pagination.Model";

export class ChargeType extends PaginationModel {
  selectRow: string;
  id: number;
  code: string;
  name: string;
  description: string;
  isDeleted: string;
  clientId: number;
  createdBy: string;
  updatedBy: string;
  updateDateTimeBrowser: string;
  updateDateTimeServer: string;
  createDateTimeBrowser: string;
  createDateTimeServer: string;

  constructor() {
      super();
  }
 
}
export class ChargeCategory extends PaginationModel  {
  id: number;
  code: string;
  name: string;
  description: string;
  isDeleted: string;
  clientId: number;
  sourceSystemId: number;
  createdBy: string;
  updatedBy: string;
  updateDateTimeBrowser: string;
  updateDateTimeServer: string;
  createDateTimeBrowser: string;
  createDateTimeServer: string;

  constructor() {
      super();
  }

}
export class ChargeMapComputationMethod extends PaginationModel {
  id: number;
  code: string;
  name: string;
  description: string;
  chargeComputationMethodComments: string;
  clientId: number;
  sourceSystemId: number;
  isDeleted: string;
  createdBy: string;
  updatedBy: string;
  updateDateTimeBrowser: string;
  updateDateTimeServer: string;
  createDateTimeBrowser: string;
  createDateTimeServer: string;

  constructor() {
      super();
  }

}

export class ChargeMapComputationMethodMapping extends PaginationModel {
  id: number;
  isSelected: boolean;
  ChargeId: number;
  ChargeCategoryDescription: string;
  ChargeTypeDescription: string;
  ChargeDescription: string;
  ComputationMappingDescription: string;
  computationMappings: [];
  clientId: number;
  sourceSystemId: number;
  isDeleted: string;
  createdBy: string;
  updatedBy: string;
  updateDateTimeBrowser: Date;
  updateDateTimeServer: Date;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  isEdited = false;

  constructor() {
    super();
  }
}

export class Charge extends PaginationModel {
  isSelected: boolean;
  id: number;
  code: string;
  description: string;
  chargeTypeId: number;
  chargeTypeDescription: string;
  chargeCategoryId: number;
  chargeCategoryDescription: string;
  chargeComputationMethodId: number;
  chargeComputationMethodDescription: string;
  isActive: boolean = false;
  status: string;
  domesticOnly: boolean = false;
  exportOnly: boolean = false;
  domesticExportBoth: boolean = false;
  applyContractFor: string;
  updatedBy: string;
  updateDateTimeBrowser: Date;
  updateDateTimeServer: Date;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;

  constructor() {
      super();
  }
}

