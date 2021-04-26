export interface IAddressType {
  Code: string;
  Name: string;
  Description: string;
  IsDeleted: boolean;
  ClientID?: number;
  SourceSystemID?: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
}
