import { PaginationModel } from "./Pagination.Model";

export class UserAlertHistory extends PaginationModel {
  alertType: string;
  alertId: string;
  startDate?: string;
  endDate?: string;
  isSelected: boolean;
  id: number;
  referenceNo: string;
  code: string;
  name: string;
  description: string;
  userAlertId: number;
  entityId: number;
  entityKeyId: number;
  dateDispatched: Date;
  dispatchedNotificationSubject: string;
  dispatchNotificationBody: string;
  sentToEmailAddress: string;
  notificationPreference: number;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date
  selectRow: string;
}


