import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { PlanComponent } from 'app/modules/plan/pages/plan/plan.component';
import { PlanRoutingModule } from './plan-routing.module';
import { SharedModule } from '@app/shared';
import { BillingPaymentComponent } from './pages/billing-payment/billing-payment.component';
import { MaterialModule } from '@app/material/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HintMessageComponent } from './popup/hint-message/hint-message.component';
 
@NgModule({
  declarations: [PlanComponent, BillingPaymentComponent, HintMessageComponent],
  imports: [
    // CommonModule,
    SharedModule,
    PlanRoutingModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
   
   
  ]
})
export class PlanModule {
}
