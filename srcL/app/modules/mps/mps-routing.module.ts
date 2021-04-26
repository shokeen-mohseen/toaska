import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MpsSummaryWorkbenchComponent } from './mps-summary-workbench/mps-summary-workbench.component';
import { RawMaterialDemandComponent } from './raw-material-demand/raw-material-demand.component';


const routes: Routes = [
  {
    path: 'mps-summary-workbench',
    component: MpsSummaryWorkbenchComponent
  },
  {
    path: 'raw-material-demand',
    component: RawMaterialDemandComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MpsRoutingModule { }
