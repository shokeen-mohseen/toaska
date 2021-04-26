import { Component, ViewChild, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  selectRow: string;
  Description: string;
  CreatedBy: string;
  CreateDatetime: string;
  UpdatedBy: string;
  UpdateDate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    selectRow: '',
    Description: 'Bright Prmium',
    CreatedBy: 'lampsdemo',
    CreateDatetime: '01/24/2017',
    UpdatedBy: 'lampsdemo',
    UpdateDate: '01/24/2017'
  },
  {
    selectRow: '',
    Description: 'Test',
    CreatedBy: 'lampsdemo',
    CreateDatetime: '12/11/2017',
    UpdatedBy: 'lampsdemo',
    UpdateDate: '12/11/2017'
  },
];

@Component({
  selector: 'app-packaging-material-list',
  templateUrl: './packaging-material-list.component.html',
  styleUrls: ['./packaging-material-list.component.css']
})
export class PackagingMaterialListComponent implements OnInit {

  selectRow: any;

  displayedColumns = ['selectRow', 'Description', 'CreatedBy', 'CreateDatetime', 'UpdatedBy', 'UpdateDate'];
  displayedColumnsReplace = ['selectRow', 'key_Description', 'key_CreatedBy', 'key_CreateDateTime', 'key_UpdatedBy', 'key_UpdateDate'];
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
