import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { MatTabGroup } from '@angular/material/tabs';


export interface PeriodicElement {
  selectRow: string;
  poNumber: string;
  businessPartner: string;
  dateIssued: string;
  deliveryStartDate: string;
  deliveryLocation: string;
  quantityOrdered: string;
  quantityReceived: string;
  orderamt: string;
  paidAmount: string;
  balance: string;
  status: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', poNumber: '56575', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Closed' },
  { selectRow: '', poNumber: '6767', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Open' },
  { selectRow: '', poNumber: '89686', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Cancel' },
  { selectRow: '', poNumber: '56575', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Closed' },
  { selectRow: '', poNumber: '6767', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Open' },
  { selectRow: '', poNumber: '89686', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Cancel' },
  { selectRow: '', poNumber: '56575', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Closed' },
  { selectRow: '', poNumber: '6767', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Open' },
  { selectRow: '', poNumber: '89686', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Cancel' },
];

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {

  filter: boolean = false;
  
  selectRow: any;
  displayedColumns = ['selectRow', 'poNumber', 'businessPartner', 'dateIssued', 'deliveryStartDate', 'deliveryLocation', 'quantityOrdered', 'quantityReceived', 'orderamt', 'paidAmount', 'balance', 'status'];
  displayedColumnsReplace = ['selectRow', 'key_PONumber', 'key_BusinessPartner', 'key_dateIssued', 'key_DeliveryStartDate', 'key_DeliveryLocation', 'key_quantityOrdered', 'key_quantityReceived', 'key_Orderamt', 'key_paidAmount', 'key_balance', 'key_Status'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }

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

  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

}

