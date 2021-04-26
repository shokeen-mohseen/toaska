export class UserAlertRecipients {
  Id: number;
  SendToType: number;
  NotificationType: number;
  ReferenceNo: string;
  Code: string;
  Name: string;
  Description: string;
  EmailTo: string;
  EmailCC: string;
  EmailBCC: string;
  MobileEmailTo: string;
  InternalUserFilter: string;
  ExternalContactFilter: string;
  EmailAttachments: string;
  IsDeleted: boolean;
  SourceSystemID?: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  ClientID: number;
  EmailPriority: string;

}

export class AlertTemplates {
  Code: string;
  Description: string;
  DefaultValue: string;
  ClientID?: number;
  UpdatedBy: string;

  UpdateDateTimeBrowser: Date;

}
