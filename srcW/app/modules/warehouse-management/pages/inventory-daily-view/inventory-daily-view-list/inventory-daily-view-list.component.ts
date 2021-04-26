import { Component, ViewChild, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  Date: string;
  ActivityType: string;
  OrderNoJobNo: string;
  InOutInventory: string;
  Quantity: string;
  EndingInventory: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Date: '',
    ActivityType: '',
    OrderNoJobNo: '',
    InOutInventory: '',
    Quantity: '',
    EndingInventory: ''
  },
];

@Component({
  selector: 'app-inventory-daily-view-list',
  templateUrl: './inventory-daily-view-list.component.html',
  styleUrls: ['./inventory-daily-view-list.component.css']
})
export class InventoryDailyViewListComponent implements OnInit {

  displayedColumns = ['Date', 'ActivityType', 'OrderNoJobNo', 'InOutInventory', 'Quantity', 'EndingInventory'];
  displayedColumnsReplace = ['key_Date', 'key_ActivityType', 'key_OrderNoJobNo', 'key_InOutInventory', 'key_Quantity', 'key_EndingInventory'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

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

  constructor() { }

  ngOnInit(): void {

  }

}
