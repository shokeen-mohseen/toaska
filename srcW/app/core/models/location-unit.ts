

export class LocationUnit {

  public ClientID: number;
  public LocationID: number;
  PageNo: number;
  PageSize: number;
  public ID: number; // LocationUnitID
  constructor() {

    this.PageNo = 1;
    this.PageSize = 100;
  }

}


export class HospitalSetting {
  id: number;
  LocationFunctionId: number;
  Name: string;
  CovidAccepting: string;
  OrganizationId: number;
  IsActive: boolean;
  IsPrimary: boolean;
  IsDeleted: boolean;
  ClientID: number;
  SourceSystemID: number;
  Code: string;
  UpdatedBy: string;
  UpdateDateTimeBrowser: string;
  CreatedBy: string;
  CreateDateTimeBrowser: string;
  SetupComplete: boolean;
  SetupCompleteBy: string;
  SetupCompleteDateTime: string;
}

export class HospitalSettingup {
  hospital: HospitalSetting[];
}
