import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/material/material.module';
import { NgSelect2Module } from 'ng-select2';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ResizableModule } from 'angular-resizable-element';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { MpsRoutingModule } from './mps-routing.module';
import { MpsSummaryWorkbenchComponent } from './mps-summary-workbench/mps-summary-workbench.component';
import { OrderQtyDetailsComponent } from './mps-summary-workbench/order-qty-details/order-qty-details.component';
import { RawMaterialDemandComponent } from './raw-material-demand/raw-material-demand.component';


@NgModule({
  declarations: [MpsSummaryWorkbenchComponent, OrderQtyDetailsComponent, RawMaterialDemandComponent],
  imports: [
    CommonModule,
    SharedModule,
    MpsRoutingModule,
    MaterialModule,
    NgSelect2Module,
    DateRangePickerModule, DateTimePickerModule, DatePickerModule,
    AngularMultiSelectModule,
    ResizableModule
  ]
})
export class MpsModule { }
