export interface IClient {
  ReferenceNo: string;
  Name: string;
  ContectId: number;
  ApprovedBy: string;
  ApprovedDateTimeBrowser?: Date;
  EffectiveFrom: Date;
  EffectiveTo: Date;
  SuspensionFrom: Date;
  SuspensionTo: Date;
  IsActive: boolean;
  IsDeleted: boolean;
  SourceSystemID?: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;

}
