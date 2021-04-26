import { PaginationModel } from "./Pagination.Model";

export class PatientStatus {

  PatientId: string;
  Mode: string;
  UpdatedBy: string;
  ClientID: number;
  UpdateDateTimeBrowser: Date;
}

export class PatientPartographBase {
  PatientID: number;
  ClientId: number;
  SourceSystemId: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  ReferenceNo: string;
  PageNo: number;
  PageSize: number;
  constructor() {
    this.PageNo = 1;
    this.PageSize = 0;
  }
}

export class PatientRegistration extends PatientPartographBase {

  ReferenceNo: string;
  PartographID: number;
  DOB: Date;
  Age: number;
  Sex: string;
  DateTimeOfAdmission: Date;
  CR_OutdoorNo: string;
  Booked_RegStered_Emergency: string;
  UnitNo: string;
  MRD_IndoorNo: string;
  VisitNo: number;
  UnitHead: string;
  LiteracyID_Wife: number;
  LiteracyID_Husband: number;
  Socio_economicStatus: string;
  SelfVisit: boolean
  ReferredFromResourceContactID: number;
  DateTimeForReferral: Date;
  ReasonForReferral: string;


}

export class PatientPartographDetail extends PatientPartographBase {
  Id: number;
  IsActive: boolean;
  Code: string;
  Name: string;
  Description: string;
  ReferenceNo: string;
  PatientRegistration: PatientRegistration;
  PartographComments: any[];
  PartographMedia: any[];
  Patient: any[];
}

export class PatientSerach {
  SearchMode: string;
  SearchKey: string;
}

export class PatientValue
{
  ID: number;
  ReferenceNo: string;
  PatientTypeID: number;
  Code: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Prefix: string;
  Suffix: string;
  Description: string;
  LocationId: number;
  OperatingLocationID: number;
  RegistrationNo: string;
  IsReferred: boolean;
  AdmissionDate: Date;
  AdmittedBy: string;
  PatientStatusID: number;
  IsDeleted: boolean;
  ClientID: number;
  SourceSystemID: number;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  ResponseMessageCode: String;

  
}

export class patientlist extends PaginationModel{
  id: number;
  PatientName: string;
  RegistrationNo: string;
  PhysicianName: string;
  HospitalName: string;
  AdmissionDate: Date;
  PatientConditionID: number;
  PatientConditionName: string;
  PatientStatusID: number;
  PatientStatusName: string;
  Active: string;
  isSelected: boolean;
  constructor() {
    
    super();
    this.isSelected = false;
  }

}

export class patientlist2 {
  id: number;
  PatientName: string;
  RegistrationNo: string;
  PhysicianName: string;
  HospitalName: string;
  AdmissionDate: Date;
  PatientConditionID: number;
  PatientConditionName: string;
  PatientStatusID: number;
  PatientStatusName: string;
  Active: string;
  isSelected: boolean
  itemsLength: number;

}
