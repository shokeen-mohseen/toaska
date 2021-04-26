import { IAddressFunction } from "./address-function";
import { IClient } from "./client";
import { IAddressType } from "./address-type";
import { IGeoLocation } from "./geolocation";

export interface IAddressInformation {
  ReferenceNo: string;
  TypeID: number;
  FunctionID: number;
  Code: string;
  Name: string;
  GeoLocationHierarchyID?: number;
  StreetName1: string;
  StreetName2: string;
  StreetName3: string;
  ExternalSourceAddressKey: string;
  //public System.Data.Entity.Spatial.DbGeography GeoCode { get; set; }
  IsActive?: boolean;
  IsDeleted: boolean;
  ClientID?: number;
  SourceSystemID?: number;
  UpdatedBy: number;
  UpdateDateTimeBrowser: Date;
  AddressFunction: IAddressFunction;
  Client: IClient;
  AddressType: IAddressType;
  GeoLocation: IGeoLocation
 }
