import { Component, ViewChild, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ResizeEvent } from 'angular-resizable-element';

import { Router } from '@angular/router';

export interface PeriodicElement {
  selectRow: string;
  ShipDate: string;
  ReqDeliveryDate: string;
  MustArriveByDate: string;
  PickupAppointment: string;
  DeliveryAppointment: string;
  ActDeliveryDate: string;
  ShipmentNo: string;
  ShipmentType: string;
  ShipFrom: string;
  ShipTo: string;
  Carrier: string;
  Quantity: string;
  TenderStatus: string;
  ShipmentStatus: string;
  ShipmentCondition: string;
  OrderNo: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
];

@Component({
  selector: 'app-shipment-history-list',
  templateUrl: './shipment-history-list.component.html',
  styleUrls: ['./shipment-history-list.component.css']
})
export class ShipmentHistoryListComponent implements OnInit {

  displayedColumns = ['selectRow', 'ShipDate', 'ReqDeliveryDate', 'MustArriveByDate', 'PickupAppointment', 'DeliveryAppointment', 'ActDeliveryDate', 'ShipmentNo', 'ShipmentType', 'ShipFrom', 'ShipTo', 'Carrier', 'Quantity', 'TenderStatus', 'ShipmentStatus', 'ShipmentCondition', 'OrderNo'];
  //displayedColumns = ['hierarchyname', 'detail'];
  displayedColumnsReplace = ['selectRow', 'key_ShipDate', 'key_ReqDeliveryDate', 'key_MustArriveByDate', 'key_PickupAppointment', 'key_DeliveryAppointment', 'key_ActDeliveryDate', 'key_ShipmentNo', 'key_ShipmentType', 'key_ShipFrom', 'key_ShipTo', 'key_Carrier', 'key_Quantity', 'key_TenderStatus', 'key_ShipmentStatus', 'key_ShipmentCondition', 'key_OrderNo'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  
  selectRow: any;
  OrderNo: any;

  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.OrderNo = 'OrderNo';
  }

  openOrderHistory() {
    let url = '/order-management/order-history'
    this.route.navigate([url]);
    //window.open(url, '_blank')
  }

}
