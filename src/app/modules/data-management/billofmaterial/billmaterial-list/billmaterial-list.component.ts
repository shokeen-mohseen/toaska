import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-billmaterial-list',
  templateUrl: './billmaterial-list.component.html',
  styleUrls: ['./billmaterial-list.component.css']
})
export class BillmaterialListComponent implements OnInit {

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
  displayedColumns = ['selectRow', 'Location', 'Material', 'Materiadec', 'Bom', 'Effectivestrt', 'Effectiveend'];
  displayedColumnsReplace = ['selectRow', 'key_Location', 'key_Material', 'key_MaterialDescription', 'key_Bomcode', 'key_Effectivestrt', 'key_Effectiveend'];
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


  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal) { }
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }

}
export interface PeriodicElement {
  selectRow: string;
  Location: string;
  Material: string;
  Materiadec: string;
  Bom: string;
  Effectivestrt: string;
  Effectiveend: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
 
  { selectRow: '', Location: '', Material: '', Materiadec: '', Bom: '', Effectivestrt: '', Effectiveend: '' },

];
