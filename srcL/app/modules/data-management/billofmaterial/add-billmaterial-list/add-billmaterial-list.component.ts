import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-add-billmaterial-list',
  templateUrl: './add-billmaterial-list.component.html',
  styleUrls: ['./add-billmaterial-list.component.css']
})
export class AddBillmaterialListComponent implements OnInit {

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
  displayedColumns = ['selectRow',  'Componentcode', 'Componentdescription', 'Amount', 'Uom', 'Optional'];
  displayedColumnsReplace = ['selectRow', 'key_Componentcode', 'key_Componentdescription', 'key_Amount', 'key_UOM', 'key_Optional'];
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
  Componentcode: string;
  Componentdescription: string;
  Amount: string;
  Uom: string;
  Optional: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

  { selectRow: '', Componentcode: '', Componentdescription: '', Amount: '', Uom: '', Optional: '' },

];
