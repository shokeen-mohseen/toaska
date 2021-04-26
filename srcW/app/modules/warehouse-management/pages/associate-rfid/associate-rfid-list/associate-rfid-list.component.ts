import { Component, ViewChild, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  selectRow: string;
  Asset: string;
  AssetType: string;
  PropertyValue: string;
  AssociateRFID: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    selectRow: '',
    Asset: '',
    AssetType: '',
    PropertyValue: '',
    AssociateRFID: ''
  },
];

@Component({
  selector: 'app-associate-rfid-list',
  templateUrl: './associate-rfid-list.component.html',
  styleUrls: ['./associate-rfid-list.component.css']
})
export class AssociateRfidListComponent implements OnInit {

  selectRow: any;

  displayedColumns = ['selectRow', 'Asset', 'AssetType', 'PropertyValue', 'AssociateRFID'];
  displayedColumnsReplace = ['selectRow', 'key_Asset', 'key_AssetType', 'key_PropertyValue', 'key_AssociateRFID'];
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
