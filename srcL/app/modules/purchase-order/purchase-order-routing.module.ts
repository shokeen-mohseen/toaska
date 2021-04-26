import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderWorkbechComponent } from './purchase-order-workbech/purchase-order-workbech.component';


const routes: Routes = [
  {
    path: 'purchase-order-workbench',
    component: PurchaseOrderWorkbechComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
