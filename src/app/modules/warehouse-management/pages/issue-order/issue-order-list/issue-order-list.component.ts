import { Component, ViewChild, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  selectRow: string;
  IssueType: string;
  IssueOrderNo: string;
  IssueDate: string;
  IssuedFrom: string;
  IssueTo: string;
  IssueQuantity: string;
  IssuedBy: string;
  ReceivedBy: string;
  ReceiveDate: string;
  DueDate: string;
  Track: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    selectRow: '',
    IssueType: '',
    IssueOrderNo: '',
    IssueDate: '',
    IssuedFrom: '',
    IssueTo: '',
    IssueQuantity: '',
    IssuedBy: '',
    ReceivedBy: '',
    ReceiveDate: '',
    DueDate: '',
    Track: ''
  },
];

@Component({
  selector: 'app-issue-order-list',
  templateUrl: './issue-order-list.component.html',
  styleUrls: ['./issue-order-list.component.css']
})
export class IssueOrderListComponent implements OnInit {

  selectRow: any;

  displayedColumns = ['selectRow', 'IssueType', 'IssueOrderNo', 'IssueDate', 'IssuedFrom', 'IssueTo', 'IssueQuantity', 'IssuedBy', 'ReceivedBy', 'ReceiveDate', 'DueDate', 'Track'];
  displayedColumnsReplace = ['selectRow', 'key_IssueType', 'key_IssueOrderNo', 'key_IssueDate', 'key_IssuedFrom', 'key_IssueTo', 'key_IssueQuantity', 'key_IssuedBy', 'key_ReceivedBy', 'key_ReceiveDate', 'key_DueDate', 'key_Track'];
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
