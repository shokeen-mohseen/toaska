import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-adjust-final-forecast',
  templateUrl: './adjust-final-forecast.component.html',
  styleUrls: ['./adjust-final-forecast.component.css']
})
export class AdjustFinalForecastComponent implements OnInit {
  oct: any;
  nov: any;
  dec: any;
  displayedColumns = ['lc', 'location', 'Material', 'oct', 'nov', 'dec'];
  displayedColumnsReplace = ['key_LocationCode', 'key_Location', 'key_Material', 'key_Oct20', 'key_Nov20', 'key_Dec20'];
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

  constructor(private router: Router, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.oct = 'oct';
    this.nov = 'nov';
    this.dec = 'dec';
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

}
export interface PeriodicElement {
  lc: string;
  location: string;
  Material: string;
  oct: string;
  nov: string;
  dec: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: ''},
  { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: ''},
  { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: ''},
  { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: ''},
  { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: ''},
  { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: ''},
  { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: ''},
  { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: ''},
  ]

