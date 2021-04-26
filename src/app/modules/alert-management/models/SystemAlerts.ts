export class SystemAlerts {
  Id: number;
  AlertTypeId: number;
  SystemEventsId: number;
  ReferenceNo: string;
  Code: string;
  Name: string;
  Description: string;
  AssociatedRoles: string;
  IsDeleted: boolean;
  SourceSystemID?: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  ClientID: number;
}
