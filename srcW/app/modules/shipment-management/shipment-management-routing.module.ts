import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { shipmentManagementComponent } from './pages/shipment-management.component';
import { ShipmentNaftaReportComponent } from './pages/shipment-nafta-report/shipment-nafta-report.component';
import { OriginOfGoodsComponent } from './pages/origin-of-goods/origin-of-goods.component';
import { ShipmentHistoryComponent } from './pages/shipment-history/shipment-history.component';


const routes: Routes = [

  {
    path: 'shipment-workbench',
    component: shipmentManagementComponent
  },
  {
    path: 'shipment-nafta-report',
    component: ShipmentNaftaReportComponent
  },
  {
    path: 'origin-of-goods',
    component: OriginOfGoodsComponent
  },
  {
    path: 'shipment-history',
    component: ShipmentHistoryComponent
  }
  
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class shipmentManagementRoutingModule { }
