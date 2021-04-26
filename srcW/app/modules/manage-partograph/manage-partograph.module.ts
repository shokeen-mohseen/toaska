import { NgModule } from '@angular/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from '@app/shared';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MaterialModule } from 'app/material/material.module';
import { ResizableModule } from 'angular-resizable-element';
import { NgSelect2Module } from 'ng-select2';
import { ManagePartographRoutingModule } from './manage-partograph-routing.module';
import { NewPartographComponent } from './pages/new-partograph/new-partograph.component';
import { FindPartographComponent } from './pages/find-partograph/find-partograph.component';
import { PatientSetupComponent } from './pages/new-partograph/patient-setup/patient-setup.component';
import { PatientHistoryComponent } from './pages/new-partograph/patient-history/patient-history.component';
import { LatentPhaseLabourComponent } from './pages/new-partograph/latent-phase-labour/latent-phase-labour.component';
import { ActivePhaseLabourComponent } from './pages/new-partograph/active-phase-labour/active-phase-labour.component';
import { SecondStageLabourComponent } from './pages/new-partograph/second-stage-labour/second-stage-labour.component';
import { ThirdStageDeliveryComponent } from './pages/new-partograph/third-stage-delivery/third-stage-delivery.component';
import { FourthStageMonitoringComponent } from './pages/new-partograph/fourth-stage-monitoring/fourth-stage-monitoring.component';
import { DataService } from '@app/shared/services';
import { UserActivityLog } from '@app/core/models/useractivity';
import { ExaminationComponent } from './pages/new-partograph/examination/examination.component';
import { PostpartumCareComponent } from './pages/new-partograph/postpartum-care/postpartum-care.component';
import { PartographMonitoringComponent } from './pages/new-partograph/partograph-monitoring/partograph-monitoring.component';
import { RegistrationComponent } from './pages/new-partograph/registration/registration.component';
import { PrepartumCareComponent } from './pages/new-partograph/prepartum-care/prepartum-care.component';
import { PatientInformationComponent } from './pages/new-partograph/patient-information/patient-information.component';
import { HospitalDetailsComponent } from './pages/new-partograph/hospital-details/hospital-details.component';
import { PhysicianDetailsComponent } from './pages/new-partograph/physician-details/physician-details.component';
import { ContactInformationComponent } from './pages/new-partograph/contact-information/contact-information.component';
import { PartographreportComponent } from './pages/partographreport/partographreport.component';
import { HospitalsetupComponent } from './pages/hospitalsetup/hospitalsetup.component'
import { HospitalstaffComponent } from './pages/hospitalstaff/hospitalstaff.component';
import { ObstetricFormulaComponent } from './pages/new-partograph/obstetric-formula/obstetric-formula.component';
import { ModulerolepermissionsComponent } from './pages/modulerolepermissions/modulerolepermissions.component';
import { PatientsetupComponent } from './pages/patientsetup/patientsetup.component';
import { from } from 'rxjs';
import { InvestigationComponent } from './pages/new-partograph/investigation/investigation.component';
import { TreatmentComponent } from './pages/new-partograph/treatment/treatment.component';
import { DeliveryNotesComponent } from './pages/new-partograph/delivery-notes/delivery-notes.component';
import { BabyNotesComponent } from './pages/new-partograph/baby-notes/baby-notes.component';
import { MedicationComponent } from './pages/new-partograph/medication/medication.component';
import { PostpartumCareReportComponent } from './pages/new-partograph/postpartum-care-report/postpartum-care-report.component';
import { DischargeReportComponent } from './pages/new-partograph/discharge-report/discharge-report.component';
import { AddHospitalComponent } from './pages/hospital-details/add-hospital/add-hospital.component';

import { AddPatientComponent } from './pages/patient-details/add-patient/add-patient.component';
import { EditPatientComponent } from './pages/patient-details/edit-patient/edit-patient.component';

import { PhysiciansComponent } from './pages/patient-details/physicians/physicians.component';
import { PatientListComponent } from './pages/patient-details/patient-list/patient-list.component';
import { EditHospitalComponent } from './pages/hospital-details/edit-hospital/edit-hospital.component';
import { HospitalListComponent } from './pages/hospital-details/hospital-list/hospital-list.component';
import { AddStaffComponent } from './pages/staff-detail/add-staff/add-staff.component';
import { EditStaffComponent } from './pages/staff-detail/edit-staff/edit-staff.component';
import { StaffListComponent } from './pages/staff-detail/staff-list/staff-list.component';
import { CriticalPatientMonitoringComponent } from './pages/new-partograph/treatment/critical-patient-monitoring/critical-patient-monitoring.component';
import { MedicationChartComponent } from './pages/new-partograph/treatment/medication-chart/medication-chart.component';
import { NursingCareActivityComponent } from './pages/new-partograph/treatment/nursing-care-activity/nursing-care-activity.component';
import { HistoryOfPresentIllnessComponent } from './pages/new-partograph/patient-history/history-of-present-illness/history-of-present-illness.component';
import { MenstrualHistoryComponent } from './pages/new-partograph/patient-history/menstrual-history/menstrual-history.component';
import { ContraceptionHistoryComponent } from './pages/new-partograph/patient-history/contraception-history/contraception-history.component';
import { ObstetricHistoryComponent } from './pages/new-partograph/patient-history/obstetric-history/obstetric-history.component';
import { PersonalHistoryComponent } from './pages/new-partograph/patient-history/personal-history/personal-history.component';
import { PastHistoryComponent } from './pages/new-partograph/patient-history/past-history/past-history.component';
import { FamilyHistoryComponent } from './pages/new-partograph/patient-history/family-history/family-history.component';
import { GeneralPhysicalExaminationComponent } from './pages/new-partograph/investigation/general-physical-examination/general-physical-examination.component';
import { SystemicComponent } from './pages/new-partograph/investigation/systemic/systemic.component';
import { InvestigationAdvisedComponent } from './pages/new-partograph/investigation/investigation-advised/investigation-advised.component';
import { Examination1Component } from './pages/new-partograph/examination/examination1/examination1.component';
import { Examination2Component } from './pages/new-partograph/examination/examination2/examination2.component';
import { ModuleListComponent } from './pages/modulerolepermissions/module-list/module-list.component';
import { AddModuleroleComponent } from './pages/modulerolepermissions/add-modulerole/add-modulerole.component';
import { EditModuleroleComponent } from './pages/modulerolepermissions/edit-modulerole/edit-modulerole.component';
import { AddUnitDetailComponent } from './pages/hospital-details/add-unit-detail/add-unit-detail.component';
import { AddStaffRoleComponent } from './pages/staff-detail/add-staff-role/add-staff-role.component';






@NgModule({
  declarations: [NewPartographComponent,
    FindPartographComponent, PatientSetupComponent,
    PatientHistoryComponent, ExaminationComponent,
    LatentPhaseLabourComponent, ActivePhaseLabourComponent,
    SecondStageLabourComponent, ThirdStageDeliveryComponent,
    FourthStageMonitoringComponent, PostpartumCareComponent,
    PartographMonitoringComponent, RegistrationComponent,
    PrepartumCareComponent, PatientInformationComponent,
    HospitalDetailsComponent, PhysicianDetailsComponent, PartographreportComponent, HospitalsetupComponent,
    ContactInformationComponent, ModulerolepermissionsComponent, ObstetricFormulaComponent,
    HospitalstaffComponent, PatientsetupComponent, InvestigationComponent, TreatmentComponent,
    DeliveryNotesComponent, BabyNotesComponent, MedicationComponent, PostpartumCareReportComponent,
    DischargeReportComponent, AddHospitalComponent, EditHospitalComponent,
    AddModuleroleComponent, AddStaffComponent, EditStaffComponent, EditModuleroleComponent,
    AddPatientComponent,
    EditPatientComponent, PatientListComponent, PhysiciansComponent, HospitalListComponent,
    StaffListComponent, CriticalPatientMonitoringComponent, MedicationChartComponent, NursingCareActivityComponent,
    HistoryOfPresentIllnessComponent,
    MenstrualHistoryComponent,
    ContraceptionHistoryComponent,
    ObstetricHistoryComponent,
    PersonalHistoryComponent,
    PastHistoryComponent,
    FamilyHistoryComponent,
    GeneralPhysicalExaminationComponent,
    SystemicComponent,
    InvestigationAdvisedComponent,
    Examination1Component,
    Examination2Component,
    ModuleListComponent, AddUnitDetailComponent, AddStaffRoleComponent],
  imports: [
    ManagePartographRoutingModule,
    SharedModule,
    UiSwitchModule,
    MaterialModule,
    NgSelect2Module, ResizableModule,
    AngularMultiSelectModule
  ],
  exports: [
    PartographreportComponent
  ]
})
export class ManagePartographModule {

 
  objUserActivity: UserActivityLog;
 

  constructor(private dataService: DataService) {
    this.objUserActivity = new UserActivityLog();
    this.objUserActivity.moduleName = 'Manage partograph module'
    this.objUserActivity.componentName = "";
    this.dataService.SendActivity(this.objUserActivity);
   
  }
}
