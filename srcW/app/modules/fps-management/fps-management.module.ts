import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'app/material/material.module';
import { FpsRoutingModule } from './fps-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ResizableModule } from 'angular-resizable-element';
import { FpsSummaryComponent } from './fps-summary/fps-summary.component';
import { ByOrderComponent } from './fps-summary/by-order/by-order.component';
import { ByMaterialComponent } from './fps-summary/by-material/by-material.component';
import { ProductionTrackingComponent } from './production-tracking/production-tracking.component';
import { ProductionFilterComponent } from './production-tracking/production-filter/production-filter.component';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEditComponent } from './production-tracking/production-filter/add-edit/add-edit.component';
import { PrintLevelComponent } from './production-tracking/production-filter/print-level/print-level.component';
import { FpsWorkbenchInitialComponent } from './fps-workbench-initial/fps-workbench-initial.component';
import { WorkbenchInitialComponent } from './fps-workbench-initial/workbench-initial/workbench-initial.component';
import { FPSTimelineComponent } from './fps-schedule-timeline/fpstimeline/fpstimeline.component';
import { FPSScheduleTimelineComponent } from './fps-schedule-timeline/fps-schedule-timeline.component';

@NgModule({
  declarations: [FpsSummaryComponent, ByMaterialComponent,
    ByOrderComponent, ByMaterialComponent, ProductionTrackingComponent,
    ProductionFilterComponent, AddEditComponent, PrintLevelComponent,
    FpsWorkbenchInitialComponent, FPSTimelineComponent, FPSScheduleTimelineComponent,
    WorkbenchInitialComponent],
  imports: [
    CommonModule, SharedModule, HttpClientModule, MaterialModule,
    FpsRoutingModule, ResizableModule, AngularMultiSelectModule,
    DateRangePickerModule, DateTimePickerModule, DatePickerModule,
    NgbModule
  ]
})
export class FPSManagementModule { }
