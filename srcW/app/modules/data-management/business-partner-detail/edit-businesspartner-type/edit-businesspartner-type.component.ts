import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddEditBusinessPartnerTypePopupComponent } from '../add-edit-business-partner-type-popup/add-edit-business-partner-type-popup.component';

@Component({
  selector: 'app-edit-businesspartner-type',
  templateUrl: './edit-businesspartner-type.component.html',
  styleUrls: ['./edit-businesspartner-type.component.css']
})
export class EditBusinesspartnerTypeComponent implements OnInit {
 
  btnEdit = function () { this.router.navigateByUrl(''); };
 
  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal, public modalService: NgbModal) { }
  displayedColumns = ['selectRow', 'Business'];
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
  ngOnInit(): void {
   
  }

  openPopup(action) {
    if (action === "add") {
      this.modalRef = this.modalService.open(AddEditBusinessPartnerTypePopupComponent, { size: 'md', backdrop: 'static' });
    }
    else if (action === "edit") {
      this.modalRef = this.modalService.open(AddEditBusinessPartnerTypePopupComponent, { size: 'md', backdrop: 'static' });
    }
  }

}
export interface PeriodicElement {
  selectRow: string;
  Business: string;

}

const ELEMENT_DATA: PeriodicElement[] = [

  { selectRow: '', Business: 'Wash Facility' },
  { selectRow: '', Business: 'Warehouse' },
  { selectRow: '', Business: 'Sort Facility' },
  { selectRow: '', Business: 'Wash Facility' },
  { selectRow: '', Business: 'Wash Facility' },
  { selectRow: '', Business: 'Wash Facility' },
  { selectRow: '', Business: 'Wash Facility' },
  { selectRow: '', Business: 'Wash Facility' },
  { selectRow: '', Business: 'Wash Facility' },
];
