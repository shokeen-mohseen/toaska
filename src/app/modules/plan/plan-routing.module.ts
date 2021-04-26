import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ProjectResolver } from './project-resolver.service';
import { PlanComponent } from 'app/modules/plan/pages/plan/plan.component';
import { BillingPaymentComponent } from './pages/billing-payment/billing-payment.component';
// import { ProjectDetailsComponent } from './pages/project-details/project-details.component';

export const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'plan',
          component: PlanComponent
        }
      ]
  },
  {
    path: 'billing-payment',
    component: BillingPaymentComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlanRoutingModule { }
