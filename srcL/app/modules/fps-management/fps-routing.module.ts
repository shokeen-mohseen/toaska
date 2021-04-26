import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FpsSummaryComponent } from './fps-summary/fps-summary.component';
import { ProductionTrackingComponent } from './production-tracking/production-tracking.component';
import { FpsWorkbenchInitialComponent } from './fps-workbench-initial/fps-workbench-initial.component';
import { FPSScheduleTimelineComponent } from './fps-schedule-timeline/fps-schedule-timeline.component';

const routes: Routes = [
  {
    path: 'fps-summary',
    component: FpsSummaryComponent,
  },
  {
    path: 'production-tracking',
    component: ProductionTrackingComponent,
  },
  {
    path: 'fps-workbench-initial',
    component: FpsWorkbenchInitialComponent,
  },
  {
    path: 'schedule-timeline',
    component: FPSScheduleTimelineComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FpsRoutingModule { }
