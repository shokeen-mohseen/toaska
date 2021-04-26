import { Component, ViewChild, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  selectRow: string;
  ReceiptType: string;
  PONumber: string;
  OrderNumber: string;
  ShipmentNumber: string;
  LocationReceived: string;
  ReceivedFrom: string;
  Material: string;
  OrderQuantity: string;
  ReceivedQuantity: string;
  AcceptedQty: string;
  OpenBalance: string;
  ReceivedDatetime: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    selectRow: '',
    ReceiptType: '',
    PONumber: '',
    OrderNumber: '',
    ShipmentNumber: '',
    LocationReceived: '',
    ReceivedFrom: '',
    Material: '',
    OrderQuantity: '',
    ReceivedQuantity: '',
    AcceptedQty: '',
    OpenBalance: '',
    ReceivedDatetime: ''
  },
];

@Component({
  selector: 'app-receipt-order-list',
  templateUrl: './receipt-order-list.component.html',
  styleUrls: ['./receipt-order-list.component.css']
})
export class ReceiptOrderListComponent implements OnInit {

  selectRow: any;

  displayedColumns = ['selectRow', 'ReceiptType', 'PONumber', 'OrderNumber', 'ShipmentNumber', 'LocationReceived', 'ReceivedFrom', 'Material', 'OrderQuantity', 'ReceivedQuantity', 'AcceptedQty', 'OpenBalance', 'ReceivedDatetime'];
  displayedColumnsReplace = ['selectRow', 'key_ReceiptType', 'key_PONumber', 'key_OrderNumber', 'key_ShipmentNumber', 'key_LocationReceived', 'key_ReceivedFrom', 'key_Material', 'key_OrderQuantity', 'key_ReceivedQuantity', 'key_AcceptedQty', 'key_OpenBalance', 'key_ReceivedDatetime'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  constructor() { }

  ngOnInit(): void {

    this.selectRow = 'selectRow';

  }

}
