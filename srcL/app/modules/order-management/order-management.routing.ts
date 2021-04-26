import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderManagementComponent } from './pages/order-management.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { PlannedOrderReportComponent } from './order-reports/planned-order-report/planned-order-report.component';
import { PlannedOrderreportPdfComponent } from './order-reports/planned-orderreport-pdf/planned-orderreport-pdf.component';
import { ShippedOrderReportComponent } from './order-reports/shipped-order-report/shipped-order-report.component';
import { OrderSummaryComponent } from './ATP-order-processing/order-summary/order-summary.component';
import { ATPProcessingComponent } from './ATP-order-processing/atpprocessing/atpprocessing.component';
import { MaterialDailyViewComponent } from './ATP-order-processing/material-daily-view/material-daily-view.component';
import { ShipFromRoutingComponent } from './ATP-order-processing/ship-from-routing/ship-from-routing.component';
import { ReservationActivityReportComponent } from './ATP-reports/reservation-activity-report/reservation-activity-report.component';
import { MaterialPlanningReportComponent } from './order-reports/material-planning-report/material-planning-report.component';



const routes: Routes = [

  {
    path: 'order-workbench',
    component: OrderManagementComponent
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent
  },
  {
    path: 'planned-report',
    component: PlannedOrderReportComponent
  },
  {
    path: 'material-planning-report',
    component: MaterialPlanningReportComponent
  },
  {
    path: 'order-reports/planned-orderreport-pdf',
    component: PlannedOrderreportPdfComponent
  },
  {
    path: 'order-reports/shipped-order-report',
    component: ShippedOrderReportComponent
  },
   {
     path: 'order-summary',
     component: OrderSummaryComponent
  },
  {
    path: 'atpprocessing',
    component: ATPProcessingComponent
  },
  {
    path: 'material-daily-view',
    component: MaterialDailyViewComponent
  },
  {
    path: 'ship-from-routing',
    component: ShipFromRoutingComponent
  },
  {
    path: 'reservation-activity-report',
    component: ReservationActivityReportComponent
  }
   
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManagementRoutingModule { }
