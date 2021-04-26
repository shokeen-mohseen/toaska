import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
//import { PlanComponent } from '@app/modules/plan/pages/plan/plan.component';
import { TeamSetupRoutingModule } from './team-setup.routing.module';
import { SharedModule } from '@app/shared';
@NgModule({
  //declarations: [PlanComponent],
  declarations: [],
  imports: [
    // CommonModule,
    SharedModule,
    TeamSetupRoutingModule
  ]
})
export class PlanModule { } 
