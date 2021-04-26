import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
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
  displayedColumns = ['selectRow', 'Name', 'Department', 'Institutename', 'Role', 'Primaryphy', 'Active'];
  displayedColumnsReplace = ['selectRow', 'key_Name', 'key_Department', 'key_Insname', 'key_Roles', 'key_Primaryphysician', 'key_Active'];
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
  constructor(public modalService: NgbModal ) { }
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }

}
export interface PeriodicElement {
  selectRow: string;
  Name: string;
  Department: string;
  Institutename: string;
  Role: string;
  Primaryphy: string;
  Active: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Name: 'John', Department: 'N/A', Institutename: 'Medical Institute Dept of Family Practice', Role: 'N/A', Primaryphy: 'Dr. Jain', Active: 'Active' },
  { selectRow: '', Name: 'John', Department: 'N/A', Institutename: 'Medical Institute Dept of Family Practice', Role: 'N/A', Primaryphy: 'Dr. Jain', Active: 'Active' },
  { selectRow: '', Name: 'John', Department: 'N/A', Institutename: 'Medical Institute Dept of Family Practice', Role: 'N/A', Primaryphy: 'Dr. Jain', Active: 'Active' },
  { selectRow: '', Name: 'John', Department: 'N/A', Institutename: 'Medical Institute Dept of Family Practice', Role: 'N/A', Primaryphy: 'Dr. Jain', Active: 'Active' },
  { selectRow: '', Name: 'John', Department: 'N/A', Institutename: 'Medical Institute Dept of Family Practice', Role: 'N/A', Primaryphy: 'Dr. Jain', Active: 'Active' },
  { selectRow: '', Name: 'John', Department: 'N/A', Institutename: 'Medical Institute Dept of Family Practice', Role: 'N/A', Primaryphy: 'Dr. Jain', Active: 'Active' },
  { selectRow: '', Name: 'John', Department: 'N/A', Institutename: 'Medical Institute Dept of Family Practice', Role: 'N/A', Primaryphy: 'Dr. Jain', Active: 'Active' },

];
