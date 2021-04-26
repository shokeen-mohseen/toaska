export interface IContactDetail {
  ReferenceNo: string;
  TypeID: number;
  Code: string;
  Name: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Prefix: string;
  Suffix: string;
  NickName: string;
  StatusID: number;
  Description: string;
  IsActive: boolean
  ExternalSourceKey: string;
  IsDeleted: boolean;
  ClientID: number;
  SourceSystemID?: number;
  UpdatedBy: number;
  CreatedBy: number;
  CreateDateTimeBrowser: Date;
  UpdateDateTimeBrowser: Date;
}
