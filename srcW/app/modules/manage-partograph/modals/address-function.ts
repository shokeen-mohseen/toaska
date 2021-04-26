export interface IAddressFunction {
  ReferenceNo: string;
  Code: string;
  Name: string;
  Description: string;
  IsDeleted: boolean;
  ClientID?: number;
  SourceSystemID?: number;
  UpdateDateTimeBrowser: Date;
  CreateDateTimeBrowser: Date;
  CreatedBy: string;
  UpdatedBy: string
 }
