import { BasePatientInformation1 } from "./base-patient-information";
import { PaginationModel } from "../../../core/models/Pagination.Model";

//export interface IpatientInformation {
//  ReferenceNo: string;
//  TypeID?: number;
//  Code: string;
//  Name: string;
//  Description: string;
//  OperatingLocationID: number;
//  OrganizationID: number;
//  HierarchyID?: number;
//  RegistrationNo: string;
//  IsReferred: boolean;
//  ReferredByID?: number;
//  AdmissionDate: Date;
//  AdmittedBy: number;
//  StatusID: number;
//  UrgencyStatusID?: number;
//  IsDeleted: boolean;
//  ClientID: number;
//  SourceSystemID?: number;
//  UpdatedBy: number;
//  UpdateDateTimeBrowser: Date;
//  CreatedBy: number;
//  CreateDateTimeBrowser: Date;
//}


export class PartographPatientSetup extends BasePatientInformation1 {

  id: number;
  Code: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Prefix: string;
  Suffix: string;
  LocationId: number; 
  RegistrationNo: string;
  PatientCovidStatusID?: number;
  CovidDiagnosisDate: Date;
  loginId: string;
  IsActive: boolean;
  SetupCompleted: boolean;
  SetupCompletedDateTime?: string;
  SetupCompletedBy?: string;
}


export class criticalPatientInfo {
  patientId: number;
  patientName: string;
  crNo: number;
  mrdNo: number;
  unitNo: number;
  admissionDate: Date;
  constructor(
    ) {}

}


export class HistoryOfPresentIllness {
  
  public ReferenceNo: string;
  public PatientId: number;
  public PartographId: number;
  public AmenorrhoeaSince: number;
  public AmenorrhoeaDropBox: string;
  //public Covidstatus: string;
  //public Diagnosisdate: Date;
  public LabourPains: string;
  public LabourPainsDropBox: string;
  public BleedingPv: string;
  public BleedingPvdropBox: string;
  public Headache: string;
  public HeadacheDropBox: string;
  public ReducedabsentFetalMovements: string;
  public ReducedabsentFetalMovementsDropBox: string;
  public LeakingPv: string;
  public LeakingPvdropBox: string;
  public Convulsions: string;
  public ConvulsionsDropBox: string;
  public Vomiting: string;
  public VomitingDropBox: string;
  public Urinary: string;
  public UrinaryDropBox: string;
  public IsDeleted: boolean;
  public ClientId: number;
  public SourceSystemId: number;
  public UpdatedBy: string;
  public UpdateDateTimeServer: Date;
  public UpdateDateTimeBrowser: Date;
  public CreatedBy: string;
  public CreateDateTimeBrowser: Date;
  public CreateDateTimeServer: Date;
  constructor() {
    this.LabourPains = "";
    this.BleedingPv = "";
    this.Headache = "";
    this.ReducedabsentFetalMovements = "";
    this.LeakingPv = "";
    this.Convulsions = "";
    this.Vomiting = "";
    this.Urinary = "";    
  }

}

export class HospitalSetup extends PaginationModel {

  id: number;
  name: string;
  code: string;
  description: string;
  isPrimary: boolean;
  covidAccepting: boolean;
  organizationId: number;
  organisationName: string;
  countryCode: string;
  stateCode: string;
  cityCode: string;
  cityName: string;
  stateName: string;
  countryName: string;
  zipCode: string;
  transportationComment: string;
  setupCompleteBy: string;
  locationTypeCode: string;
  isActive: boolean;
  isSelected: boolean;
  clientId: number;
  constructor() {
    
    super();
    this.isSelected = false;
  }
}


export class HospitalSetup2 {

  id: number;
  name: string;
  code: string;
  description: string;
  isPrimary: boolean;
  covidAccepting: boolean;
  organizationId: number;
  organisationName: string;
  countryCode: string;
  stateCode: string;
  cityCode: string;
  cityName: string;
  stateName: string;
  countryName: string;
  zipCode: string;
  transportationComment: string;
  setupCompleteBy: string;
  locationTypeCode: string;
  isActive: boolean;
  isSelected: boolean;
  clientId: number;
}
