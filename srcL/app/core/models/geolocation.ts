

export class Geoloction {

  public mode: string;
  public Id: number;
  public name: string;
  public code: string;
  public countryCode: string;
  constructor() {
    

  }

}


export class AddressLocation {
  id: number;
  ContactAddressId: number;
  PatientID: number;
  UserId: number;
  AddressActionType: string;
  ReferenceNo: string;
  AddressTypeId: number;
  ClientID: number;
  Code: string; //"LPS",
  SourceSystemID: number;
  Name: string; //"Sahibabd Fortis",
  LocationId: number;
  StreetName1: string;
  StreetName2: string;
  StreetName3: string;
  CountryCode: string;
  CountryName: string;
  StateCode: string;
  StateName: string;
  CityCode: string;
  CityName: string;
  ZipCode: string;
  CreateDateTimeBrowser: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  UpdatedBy: string;
  AddressbyId: number;
}

export enum ActionType {
  pActionType = "Patient",
  Newsletter = "NEWSLETTER",
  Magazine = "MAGAZINE",
  Book = "BOOK"
}
