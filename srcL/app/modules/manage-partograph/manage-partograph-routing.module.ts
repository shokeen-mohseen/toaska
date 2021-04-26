import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FindPartographComponent } from './pages/find-partograph/find-partograph.component';
import { PatientSetupComponent } from './pages/new-partograph/patient-setup/patient-setup.component';
import { PatientHistoryComponent } from './pages/new-partograph/patient-history/patient-history.component';
import { LatentPhaseLabourComponent } from './pages/new-partograph/latent-phase-labour/latent-phase-labour.component';
import { ActivePhaseLabourComponent } from './pages/new-partograph/active-phase-labour/active-phase-labour.component';
import { ThirdStageDeliveryComponent } from './pages/new-partograph/third-stage-delivery/third-stage-delivery.component';
import { FourthStageMonitoringComponent } from './pages/new-partograph/fourth-stage-monitoring/fourth-stage-monitoring.component';
import { SecondStageLabourComponent } from './pages/new-partograph/second-stage-labour/second-stage-labour.component';
import { AuthGuard, Role, RoleGuard } from '@app/core';
import { ExaminationComponent } from './pages/new-partograph/examination/examination.component';
import { PostpartumCareComponent } from './pages/new-partograph/postpartum-care/postpartum-care.component';
import { PartographMonitoringComponent } from './pages/new-partograph/partograph-monitoring/partograph-monitoring.component';
import { RegistrationComponent } from './pages/new-partograph/registration/registration.component';
import { PrepartumCareComponent } from './pages/new-partograph/prepartum-care/prepartum-care.component';
import { HospitalsetupComponent } from './pages/hospitalsetup/hospitalsetup.component';
import { HospitalstaffComponent } from './pages/hospitalstaff/hospitalstaff.component';
import { from } from 'rxjs';
import { PatientsetupComponent } from './pages/patientsetup/patientsetup.component';
import { PartographreportComponent } from './pages/partographreport/partographreport.component';


import { AddPatientComponent } from './pages/patient-details/add-patient/add-patient.component';
import { EditPatientComponent } from './pages/patient-details/edit-patient/edit-patient.component';
import { AddHospitalComponent } from './pages/hospital-details/add-hospital/add-hospital.component';
import { EditHospitalComponent } from './pages/hospital-details/edit-hospital/edit-hospital.component';
import { AddStaffComponent } from './pages/staff-detail/add-staff/add-staff.component';
import { EditStaffComponent } from './pages/staff-detail/edit-staff/edit-staff.component';

//import { Role } from '@app/core/models/role';
//import { RoleGuard } from '@app/core/guards/role-guard.service';

const routes: Routes = [
  {
    path: '',
    component: FindPartographComponent
  },
  {
    path: 'manage-partograph',
    component: FindPartographComponent
  },
  {
    path: 'new-partograph/patient-setup',
    component: PatientSetupComponent,
    //data: { role: [Role.Admin] },
   // canActivate: [RoleGuard]
  },
  {
    path: 'new-partograph/patient-history',
    component: PatientHistoryComponent
  },
  {
    path: 'new-partograph/examination',
    component: ExaminationComponent
  },
  {
    path: 'new-partograph/latent-phase-labour',
    component: LatentPhaseLabourComponent
  },
  {
    path: 'new-partograph/active-phase-labour',
    component: ActivePhaseLabourComponent
  },
  {
    path: 'new-partograph/second-phase-labour',
    component: SecondStageLabourComponent
  },
  {
    path: 'new-partograph/third-stage-delivery',
    component: ThirdStageDeliveryComponent
  },
  {
    path: 'new-partograph/postpartum-care',
    component: PostpartumCareComponent
  },
  {
    path: 'new-partograph/partograph-monitoring',
    component: PartographMonitoringComponent
  },
  {
    path: 'new-partograph/registration',
    component: RegistrationComponent
  },
  {
    path: 'new-partograph/prepartum-care',
    component: PrepartumCareComponent
  },
  {
    path: 'hospitalsetup',
    component: HospitalsetupComponent
  },
  {
    path: 'add-hospital',
    component: AddHospitalComponent
  },
  {
    path: 'edit-hospital',
    component: EditHospitalComponent
  },
  {
    path: 'hospitalstaff',
    component: HospitalstaffComponent
  },
  {
    path: 'add-staff',
    component: AddStaffComponent
  },
  {
    path: 'edit-staff',
    component: EditStaffComponent
  },
 
  {
    path: 'patientsetup',
    component: PatientsetupComponent
  },
  {
    path: 'add-patient',
    component: AddPatientComponent
  },
  {
    path: 'edit-patient',
    component: EditPatientComponent
  },
  {
    path: 'new-partograph/fourth-stage-monitoring',
    component: FourthStageMonitoringComponent, canActivate: [AuthGuard]
  },
  {
    path: 'partographreport',
    component: PartographreportComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePartographRoutingModule {
  constructor() {
    // console.log('Manage partograph module1')
  }
}
