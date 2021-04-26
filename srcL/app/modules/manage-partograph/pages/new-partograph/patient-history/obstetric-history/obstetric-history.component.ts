import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../../shared/components/modal-content/add-complications/add-complications.component';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  SrNo: string;
  TimePeriod: string;
  Mode: string;
  Outcome: string;
  Place: string;
  BtWt: string;
  Immunization: string;
  Complications: string;
  Delete: string;
  Add_New: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { SrNo: '', TimePeriod: '', Mode: '', Outcome: '', Place: '', BtWt: '', Immunization: '', Complications: '', Delete: '', Add_New: '' }
];

@Component({
  selector: 'app-obstetric-history',
  templateUrl: './obstetric-history.component.html',
  styleUrls: ['./obstetric-history.component.css']
})
export class ObstetricHistoryComponent implements OnInit {

  modalRef: NgbModalRef;
  SrNo: any;
  TimePeriod: any;
  Mode: any;
  Outcome: any;
  Add_New: any;
  Place: any;
  BtWt: any;
  Immunization: any;
  Complications: any;
  Delete: any;

  displayedColumns = ['SrNo', 'TimePeriod', 'Mode', 'Outcome', 'Place', 'BtWt', 'Immunization', 'Complications', 'Delete', 'Add_New'];
  displayedColumnsReplace = ['Key_SrNo', 'Key_TimePeriod', 'Key_Mode', 'Key_Outcome', 'Key_Place', 'Key_BtWt', 'Key_Immunization', 'Key_Complications', 'key_Delete', 'key_addnew'];
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

  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
    this.SrNo = 'SrNo';
    this.TimePeriod = 'TimePeriod';
    this.Mode = 'Mode';
    this.Outcome = 'Outcome';
    this.Place = 'Place';
    this.BtWt = 'BtWt';
    this.Immunization = 'Immunization';
    this.Complications = 'Complications';
    this.Delete= 'Delete';
    this.Add_New = 'Add_New';
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
  addRow() {
    ELEMENT_DATA.push({ SrNo: '', TimePeriod: '', Mode: '', Outcome: '', Place: '', BtWt: '', Immunization: '', Complications: '', Delete: '', Add_New: '' })
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }
}



