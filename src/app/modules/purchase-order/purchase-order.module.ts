import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/material/material.module';
import { NgSelect2Module } from 'ng-select2';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ResizableModule } from 'angular-resizable-element';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';


import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderWorkbechComponent } from './purchase-order-workbech/purchase-order-workbech.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { AddPurchaseOrderComponent } from './add-purchase-order/add-purchase-order.component';
import { EditPurchaseOrderComponent } from './edit-purchase-order/edit-purchase-order.component';


@NgModule({
  declarations: [PurchaseOrderWorkbechComponent, PurchaseOrderListComponent, AddPurchaseOrderComponent, EditPurchaseOrderComponent],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule,
    SharedModule,
    MaterialModule,
    NgSelect2Module,
    DateRangePickerModule, DateTimePickerModule, DatePickerModule,
    AngularMultiSelectModule,
    ResizableModule
  ]
})
export class PurchaseOrderModule { }
