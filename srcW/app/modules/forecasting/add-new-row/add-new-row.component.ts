import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-new-row',
  templateUrl: './add-new-row.component.html',
  styleUrls: ['./add-new-row.component.css']
})
export class AddNewRowComponent implements OnInit {

  modalRef: NgbModalRef;
  displayedColumns = ['selectRow', 'Location', 'Material', 'col1', 'col2', 'col3'];
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
  isLinear = false;

  constructor(private router: Router, public modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  editDefinechar() {
    //this.modalRef = this.modalService.open(AddEditDefineCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
  }

}


export interface PeriodicElement {
  selectRow: string;
  Location: string;
  Material: string;
  col1: string;
  col2: string;
  col3: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Location: '', Material: '', col1: '', col2: '', col3: '' }

];

