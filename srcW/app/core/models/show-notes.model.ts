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
  createdBy: string;
  createDateTimeBrowser: Date;
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

