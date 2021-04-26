import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-add-edit-definecharacteristics',
  templateUrl: './add-edit-definecharacteristics.component.html',
  styleUrls: ['./add-edit-definecharacteristics.component.css']
})
export class AddEditDefinecharacteristicsComponent implements OnInit {

  modalRef: NgbModalRef;
  displayedColumns = ['selectRow', 'Description', 'Value', 'UOM'];
  displayedColumnsReplace = ['selectRow', 'key_Description', 'key_Value', 'key_UOM'];
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

  btnEdit = function () { this.router.navigateByUrl(''); };
  constructor(private router: Router, public modalService: NgbModal, public activeModal: NgbActiveModal) { }


  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }
 
}
export interface PeriodicElement {
  selectRow: string;
  Description: string;
  Value: string;
  UOM: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Description: '', Value: '', UOM: '' },

];

