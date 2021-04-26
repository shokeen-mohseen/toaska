export class Feedback {
  id: number;
  applicationModuleId: number;
  description: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  userId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeBrowserSave: string;
  createDateTimeServer: Date;
}

export class modelCommon {
  clientId: number;
}
export class UserModel {
  id: string;
}
