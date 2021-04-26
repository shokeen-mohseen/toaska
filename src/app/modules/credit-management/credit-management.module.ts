import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditManagementRoutingModule } from './credit-management-routing.module';

import { SharedModule } from '@app/shared';
import { UiSwitchModule } from 'ngx-ui-switch';

import { MaterialModule } from 'app/material/material.module';
import { ResizableModule } from 'angular-resizable-element';

import { CreditUserListComponent } from './pages/credit-user-list/credit-user-list.component';
import { AllUserListComponent } from './pages/credit-user-list/all-user-list/all-user-list.component';
import { OrderDetailsComponent } from './pages/credit-user-list/order-details/order-details.component';
import { AddCommentComponent } from './pages/credit-user-list/add-comment/add-comment.component';
import { OrderNumberDetailsComponent } from './pages/credit-user-list/order-number-details/order-number-details.component';
import { InvoiceReportComponent } from './pages/credit-user-list/invoice-report/invoice-report.component';
import { InvoicePopupComponent } from './pages/credit-user-list/invoice-popup/invoice-popup.component';
import { InvoiceBodyComponent } from './pages/credit-user-list/invoice-body/invoice-body.component';


@NgModule({
  declarations: [CreditUserListComponent, AllUserListComponent, OrderDetailsComponent, AddCommentComponent, OrderNumberDetailsComponent, InvoiceReportComponent, InvoicePopupComponent, InvoiceBodyComponent],
  imports: [
    CommonModule,
    CreditManagementRoutingModule,
    SharedModule,
    MaterialModule,
    ResizableModule,
    UiSwitchModule
  ],
  exports: [
    AllUserListComponent,
    OrderDetailsComponent,
    AddCommentComponent,
    OrderNumberDetailsComponent,
    InvoiceReportComponent,
    InvoicePopupComponent,
    InvoiceBodyComponent
  ]
})
export class CreditManagementModule { }
