import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DatePickerModule, DateRangePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ResizableModule } from 'angular-resizable-element';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
/*import { HotTableModule } from '@handsontable/angular';*/
import { NgSelect2Module } from 'ng-select2';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared';
import { AddNewComponent } from './pages/add-new/add-new.component';
import { AddOriginOfGoodsComponent } from './pages/origin-of-goods/add-origin-of-goods/add-origin-of-goods.component';
import { EditOriginOfGoodsComponent } from './pages/origin-of-goods/edit-origin-of-goods/edit-origin-of-goods.component';
import { OriginOfGoodsListComponent } from './pages/origin-of-goods/origin-of-goods-list/origin-of-goods-list.component';
import { OriginOfGoodsComponent } from './pages/origin-of-goods/origin-of-goods.component';
import { ReasonCodeComponent } from './pages/shipment-history/reason-code/reason-code.component';
import { ShipmentHistoryFilterComponent } from './pages/shipment-history/shipment-history-filter/shipment-history-filter.component';
import { ShipmentHistoryListComponent } from './pages/shipment-history/shipment-history-list/shipment-history-list.component';
import { ShipmentHistoryComponent } from './pages/shipment-history/shipment-history.component';
import { ShipmentShowDetailComponent } from './pages/shipment-history/shipment-show-detail/shipment-show-detail.component';
import { shipmentManagementComponent } from './pages/shipment-management.component';
import { AddNaftaReportComponent } from './pages/shipment-nafta-report/add-nafta-report/add-nafta-report.component';
import { DelSignComponent } from './pages/shipment-nafta-report/del-sign/del-sign.component';
import { EditNaftaReportComponent } from './pages/shipment-nafta-report/edit-nafta-report/edit-nafta-report.component';
import { NaftaReportListComponent } from './pages/shipment-nafta-report/nafta-report-list/nafta-report-list.component';
import { ShipmentNaftaReportComponent } from './pages/shipment-nafta-report/shipment-nafta-report.component';
import { WorkbenchComponent } from './pages/workbench/workbench.component';
import { shipmentManagementRoutingModule } from './shipment-management-routing.module';
import { ViewBolComponent } from './pages/bol-report-template/viewbol.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NaftaReportComponent } from './pages/nafta-report-template/nafta-report.component';
import { CCIReportComponent } from './pages/cci-report-template/cci-report.component';

import { CalendarModule } from 'primeng/calendar';

import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MatListModule } from '@angular/material/list';
import { ProformaInvoiceComponent}  from './pages/proforma-invoice/proforma-invoice.component';


@NgModule({
  declarations: [WorkbenchComponent, OriginOfGoodsListComponent,
    AddOriginOfGoodsComponent, EditOriginOfGoodsComponent,
    OriginOfGoodsComponent, shipmentManagementComponent, AddNewComponent,
    ShipmentNaftaReportComponent, NaftaReportListComponent, AddNaftaReportComponent,
    EditNaftaReportComponent, DelSignComponent, ShipmentHistoryComponent,
    ShipmentHistoryListComponent, ShipmentHistoryFilterComponent, ShipmentShowDetailComponent,
    ReasonCodeComponent, ViewBolComponent, NaftaReportComponent, CCIReportComponent, ProformaInvoiceComponent],
  imports: [
    shipmentManagementRoutingModule,  MaterialModule,
    SharedModule, HttpClientModule, ResizableModule, AngularMultiSelectModule,
    NgSelect2Module, AngularEditorModule,
    DateRangePickerModule,
    DateTimePickerModule,
    DatePickerModule,
    CommonModule,
    NgxBarcodeModule,

    CalendarModule, DropdownModule, MatListModule,
    ButtonModule
    /*HotTableModule*/
  ]
  , providers: [CurrencyPipe]
})
export class ShipmentManagementModule { }
/*
platformBrowserDynamic().bootstrapModule(ShipmentManagementModule).catch(err => { console.error(err) });
*/
