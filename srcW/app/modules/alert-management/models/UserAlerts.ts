export class UserAlerts {
  Id: number;
  UserID: number;
  SystemEventsId?: number;
  RecipientsID: number;
  RespectLocationMapping: boolean;
  Name: string;
  Description: string;
  MessageSubject: string;
  MessageBody: string;
  FileAttachments: string;
  UserAlertDescription: string;
  IsDeleted: boolean;
  SourceSystemID?: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  ClientID: number;
  PageNo: number;
  PageSize: number;
}

export class UserAlertSmall {
  active: boolean;
  alertActivationTypeId: number;
  clientId: number;
  code: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  createdBy: string;
  description: string;
  fileAttachments: string;
  id: number;
  isDeleted: boolean;
  messageBody: string;
  messageSubject: string;
  name: string;
  pageNo: number;
  pageSize: number;
  recipientsId: number;
  referenceNo: string;
  respectLocationMapping: boolean;
  responseMessage: string;
  responseMessageCode: number;
  sourceSystemId?: number;
  systemAlertId: number;
  systemEventsId: number;
  updateDateTimeBrowser: Date;
  updateDateTimeServer: Date;
  updatedBy: string;
  userAlertDescription: string;
  userId: number;
}
