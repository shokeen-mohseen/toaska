import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CharacteristicsComponent } from '../../../shared/components/modal-content/characteristics/characteristics.component';
@Component({
  selector: 'app-business-characteristics',
  templateUrl: './business-characteristics.component.html',
  styleUrls: ['./business-characteristics.component.css']
})
export class BusinessCharacteristicsComponent implements OnInit {
  displayedColumns = ['selectRow', 'Code', 'Value', 'UOM'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  modalRef: NgbModalRef;
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


  constructor(public modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
  }
  openCharacteristics() {
    this.modalRef = this.modalService.open(CharacteristicsComponent, { size: 'lg', backdrop: 'static' });
  }
}
export interface PeriodicElement {
  selectRow: string;
  Code: string;
  Value: string;
  UOM: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Code: 'Shipping On Saturday Allowed?', Value: 'Yes', UOM: '' },
  { selectRow: '', Code: 'Shipping On Saturday Allowed?', Value: 'Yes', UOM: '' },
  { selectRow: '', Code: 'Shipping On Saturday Allowed?', Value: 'Yes', UOM: '' },
  { selectRow: '', Code: 'Shipping On Saturday Allowed?', Value: 'Yes', UOM: '' },
 

];
