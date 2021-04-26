import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  location: string;
  orderType: string;
  orderNumber: string;
  MaterialCode: string;
  MaterialDescription: string;
  Orderqty: number;
  dueDate: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { location: '354t-TH', orderType: 'Demo', orderNumber: '', MaterialCode: '', MaterialDescription: '', Orderqty: 0.00, dueDate: ''},
  { location: '354t-TH', orderType: 'Demo', orderNumber: '', MaterialCode: '', MaterialDescription: '', Orderqty: 0.00, dueDate: ''},
  { location: '354t-TH', orderType: 'Demo', orderNumber: '', MaterialCode: '', MaterialDescription: '', Orderqty: 0.00, dueDate: ''},
  { location: '354t-TH', orderType: 'Demo', orderNumber: '', MaterialCode: '', MaterialDescription: '', Orderqty: 0.00, dueDate: ''},
];

export interface Element {
  highlighted?: boolean;
}


@Component({
  selector: 'app-order-qty-details',
  templateUrl: './order-qty-details.component.html',
  styleUrls: ['./order-qty-details.component.css']
})
export class OrderQtyDetailsComponent implements OnInit {

  displayedColumns = ['location', 'orderType', 'orderNumber', 'MaterialCode', 'MaterialDescription', 'Orderqty', 'dueDate'];
  displayedColumnsReplace = ['key_Location', 'key_Ordertype', 'key_OrderNumber', 'key_MaterialCode', 'key_MaterialDescription', 'key_OrderQuantity','key_DueDate'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  getTotalCost() {
    return ELEMENT_DATA
      .map(t => t.Orderqty)
      .reduce((acc, value) => acc + value, 0);
  }

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
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
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

}
