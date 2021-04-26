import { PaginationModel } from "@app/core/models/Pagination.Model";


export class FreightMode extends PaginationModel {
  public IsSeleted: boolean;
  public id: number;
  public code: string;
  public name: string;
  public description: string;
  public fuelSurFreightModePercentageRate: number;
  public milesPerGallon: number;
  public milesPerHour: number;
  public driverHoursPerDay: number;
  public isDeleted: boolean;
  public clientID: number;
  public sourceSystemID: number;
  public createdBy: string;
  public createDateTimeBrowser: Date;
  public createDateTimeServer: Date;
  public updatedBy: string;
  public setupComplete: boolean;
  public setupCompleteDateTime: Date;
  public setupCompleteBy: string;
  public updateDateTimeServer: Date;
  public updateDateTimeBrowser: Date;
  public updatedDateTimeBrowserStr: string;
  public externalSourceFreightModeKey: string;
    Data: any;
    //data: any;
  //public data: any;
  constructor() {
    super();
  } 
  
}

export class FreightModeEitModel extends FreightMode {
  IsSeleted: boolean = false;
  Count: number = 0;
  id: number;
  constructor() {
    super();
  }
}

export class equipmenttype {


  public Id: number;
  public EquipmentClassId: number;
  public Code: string;
  public Name: string;
  public Description: string;
  public MaxPalletQty: number;
  public LeastFillPalletQty: number;
  public IsDeleted: boolean;
  public ClientId: number;
  public SourceSystemId: number;
  public UpdatedBy: string;
  public UpdateDateTimeServer: Date;
  public UpdateDateTimeBrowser: Date;
  public CreatedBy:	string;
  public CreateDateTimeBrowser: Date;
  public CreateDateTimeServer: Date; 
   


}

export class mapequipmenttypefreightmode {
  public id: number;
  public FreightModeID: number;
  public EquipmentTypeID: number;
  public IsDeleted: boolean;
  public ClientId: number;
  public SourceSystemId: number;
  public CreatedBy: string;
  public CreateDateTimeBrowser: Date;
  public CreateDateTimeServer: Date;
  public UpdatedBy: string;
  public UpdateDateTimeBrowser: Date;
  public UpdateDateTimeServer: Date;
  public EquipmentTypeName: string;

}



export class PeriodicElement {
  public EquipmentType: string;
}
