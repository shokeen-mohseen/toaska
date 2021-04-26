export class ShowNotes {
  id: number;
  applicationModuleId: number;
  description: string;
  isUrgent: boolean;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  parentCommentId: number;
  userId: number;
  isRead: boolean;
  fullName: string;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  updateDateTimeBrowserStr: string;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeBrowserStr: string;
  createDateTimeServer: Date;
  isEditableMode: boolean = false;
}

export class CommonModel {
  applicationModuleId: number;
  clientId: number;
}
export class UserModel {
  id: string;
}

