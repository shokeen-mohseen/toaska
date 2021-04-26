import { Component, ViewChild, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicElement {
  Date: string;
  Module: string;
  ReferenceNumber: string;
  AddedBy: string;
  FieldName: string;
  OldValue: string;
  NewValue: string;
  ReasonCode: string;
  Comments: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Date: '', Module: '', ReferenceNumber: '', AddedBy: '', FieldName: '', OldValue: '', NewValue: '', ReasonCode: '', Comments: '' },
];

@Component({
  selector: 'app-reason-code',
  templateUrl: './reason-code.component.html',
  styleUrls: ['./reason-code.component.css']
})
export class ReasonCodeComponent implements OnInit {

  displayedColumns = ['Date', 'Module', 'ReferenceNumber', 'AddedBy', 'FieldName', 'OldValue', 'NewValue', 'ReasonCode', 'Comments'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
