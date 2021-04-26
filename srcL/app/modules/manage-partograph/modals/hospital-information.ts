
export interface HospitalType {
  id: number;
  code: string;
  name: string,
  description: string;
  isDeleted: false;
  clientID: number;
  sourceSystemID: null;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  responseMessageCode: number;
  responseMessage: string;
  pageNo: number;
  pageSize: number;
  PageActionType: string;
}


export interface InstituteName {
  id: number;
  code: string;
  name: string,
  description: string;
  isDeleted: false;
  clientID: number;
  sourceSystemID: null;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
}
