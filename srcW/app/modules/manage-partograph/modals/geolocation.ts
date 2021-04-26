export interface IGeoLocation {
  ReferenceNo: string;
  Type: string;
  Code: string;
  Name: string;
  Description: string;
  Lattitude: number;
  Longitude: number;
  IsDeleted: boolean;
  ClientID?: number;
  SourceSystemID?: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: string;
}
