import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MaterialModule } from 'app/material/material.module';
import { NgSelect2Module } from 'ng-select2';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { InventoryRoutingModule } from './inventory-routing.module';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';


import { CurrentOnHandInventoryComponent } from './pages/current-on-hand-inventory/current-on-hand-inventory.component';
import { CurrentInventoryListComponent } from './pages/current-on-hand-inventory/current-inventory-list/current-inventory-list.component';
import { AddCommentComponent } from './pages/current-on-hand-inventory/add-comment/add-comment.component';
import { AddInventoryComponent } from './pages/current-on-hand-inventory/add-inventory/add-inventory.component';
import { EditInventoryComponent } from './pages/current-on-hand-inventory/edit-inventory/edit-inventory.component';
import { ResizableModule } from 'angular-resizable-element';
import { InventoryReservationComponent } from './pages/inventory-reservation/inventory-reservation.component';
import { BucketComponent } from './pages/bucket/bucket.component';
import { InventoryAvailabilityForecastComponent } from './pages/inventory-availability-forecast/inventory-availability-forecast.component';
import { InventoryReservationListComponent } from './pages/inventory-reservation/inventory-reservation-list/inventory-reservation-list.component'; 
import { AddEditInventoryReservationComponent } from './pages/inventory-reservation/add-edit-inventory-reservation/add-edit-inventory-reservation.component';


@NgModule({
  declarations: [CurrentOnHandInventoryComponent, CurrentInventoryListComponent, AddCommentComponent, AddInventoryComponent, EditInventoryComponent, InventoryReservationComponent, BucketComponent, InventoryAvailabilityForecastComponent, InventoryReservationListComponent, AddEditInventoryReservationComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
    UiSwitchModule,
    MaterialModule,
    NgSelect2Module,
    AngularMultiSelectModule, ResizableModule,
    DateRangePickerModule, DateTimePickerModule, DatePickerModule
  ]
})
export class InventoryModule { }
