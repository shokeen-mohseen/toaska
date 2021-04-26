import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'app/material/material.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { OrderManagementRoutingModule } from './order-management.routing';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';


import { OrderWorkbenchComponent } from './pages/order-workbench/order-workbench.component';
import { OrderManagementComponent } from './pages/order-management.component';
import { RegularOrderComponent } from './pages/regular-order/regular-order.component';
import { AddMaterialComponent } from './pages/regular-order/add-material/add-material.component';
import { AdjustShippingMaterialsComponent } from './pages/regular-order/adjust-shipping-materials/adjust-shipping-materials.component';
import { FinalOrderSummaryComponent } from './pages/regular-order/final-order-summary/final-order-summary.component';
import { UserOrderFeedbackComponent } from './pages/regular-order/user-order-feedback/user-order-feedback.component';
import { BulkOrderComponent } from './pages/bulk-order/bulk-order.component';
import { ShipWithOrderComponent } from './pages/ship-with-order/ship-with-order.component';
import { RecurrenceComponent } from './pages/recurrence/recurrence.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { OrderHistoryListComponent } from './pages/order-history/order-history-list/order-history-list.component';
import { ShowDetailComponent } from './pages/order-history/show-detail/show-detail.component';
import { FilterOrderHistoryComponent } from './pages/order-history/filter-order-history/filter-order-history.component';
import { ShowOrderFilterComponent } from './pages/order-history/show-order-filter/show-order-filter.component';
import { OrderDetailComponent } from './pages/order-history/order-detail/order-detail.component';
import { OrderAdjustChargeComponent } from './pages/order-history/order-adjust-charge/order-adjust-charge.component';
import { ShiptoContactDetailpopupComponent } from './pages/order-history/shipto-contact-detailpopup/shipto-contact-detailpopup.component';
import { PlannedOrderReportComponent } from './order-reports/planned-order-report/planned-order-report.component';
import { ResizableModule } from 'angular-resizable-element';
import { PlannedOrderreportPdfComponent } from './order-reports/planned-orderreport-pdf/planned-orderreport-pdf.component';
import { ShippedOrderReportComponent } from './order-reports/shipped-order-report/shipped-order-report.component';
import { OrderSummaryComponent } from './ATP-order-processing/order-summary/order-summary.component';
import { AtpOrderFilterComponent } from './ATP-order-processing/order-summary/atp-order-filter/atp-order-filter.component';
import { OrderSummaryListComponent } from './ATP-order-processing/order-summary/order-summary-list/order-summary-list.component';
import { ATPProcessingComponent } from './ATP-order-processing/atpprocessing/atpprocessing.component';
import { AptProcessingFilterComponent } from './ATP-order-processing/atpprocessing/apt-processing-filter/apt-processing-filter.component';
import { AtpDetailComponent } from './ATP-order-processing/atpprocessing/atp-detail/atp-detail.component';
import { AtpTblListComponent } from './ATP-order-processing/atpprocessing/atp-tbl-list/atp-tbl-list.component';
import { MatDailyViewdetailComponent } from './ATP-order-processing/atpprocessing/mat-daily-viewdetail/mat-daily-viewdetail.component';
import { AtpOrderDetailPopupComponent } from './ATP-order-processing/atpprocessing/mat-daily-viewdetail/atp-order-detail-popup/atp-order-detail-popup.component';
import { MaterialDailyViewComponent } from './ATP-order-processing/material-daily-view/material-daily-view.component';
import { MaterialDailyListComponent } from './ATP-order-processing/material-daily-view/material-daily-list/material-daily-list.component';
import { MaterialViewFilterComponent } from './ATP-order-processing/material-daily-view/material-view-filter/material-view-filter.component';
import { ShipFromRoutingComponent } from './ATP-order-processing/ship-from-routing/ship-from-routing.component';
import { AddShipRoutingComponent } from './ATP-order-processing/ship-from-routing/add-ship-routing/add-ship-routing.component';
import { EditShipRoutingComponent } from './ATP-order-processing/ship-from-routing/edit-ship-routing/edit-ship-routing.component';
import { ShipRoutingListComponent } from './ATP-order-processing/ship-from-routing/ship-routing-list/ship-routing-list.component';
import { ReservationActivityReportComponent } from './ATP-reports/reservation-activity-report/reservation-activity-report.component';
import { LocationReportsComponent } from './ATP-reports/reservation-activity-report/location-reports/location-reports.component';
import { CustomerReportsComponent } from './ATP-reports/reservation-activity-report/customer-reports/customer-reports.component';



@NgModule({
  declarations: [OrderWorkbenchComponent, OrderManagementComponent, RegularOrderComponent,
    AddMaterialComponent,
    AdjustShippingMaterialsComponent,FinalOrderSummaryComponent, UserOrderFeedbackComponent, BulkOrderComponent,
    ShipWithOrderComponent, RecurrenceComponent,
    OrderHistoryComponent, OrderHistoryListComponent,
    ShowDetailComponent, FilterOrderHistoryComponent,
    ShowOrderFilterComponent, OrderDetailComponent,
    OrderAdjustChargeComponent, ShiptoContactDetailpopupComponent,
    PlannedOrderReportComponent, PlannedOrderreportPdfComponent,
    ShippedOrderReportComponent, OrderSummaryComponent,
    AtpOrderFilterComponent, OrderSummaryListComponent,
    ATPProcessingComponent, AptProcessingFilterComponent,
    AtpDetailComponent, AtpTblListComponent, MatDailyViewdetailComponent,
    AtpOrderDetailPopupComponent, MaterialDailyViewComponent, MaterialDailyListComponent, MaterialViewFilterComponent, ShipFromRoutingComponent, AddShipRoutingComponent, EditShipRoutingComponent, ShipRoutingListComponent, ReservationActivityReportComponent, LocationReportsComponent, CustomerReportsComponent],
  imports: [
    OrderManagementRoutingModule, CommonModule, MaterialModule, MatExpansionModule,
    SharedModule, HttpClientModule, AngularMultiSelectModule, NgbModule,
    ResizableModule, DateRangePickerModule, DateTimePickerModule, DatePickerModule
  ]
})
export class OrderManagementModule { }
