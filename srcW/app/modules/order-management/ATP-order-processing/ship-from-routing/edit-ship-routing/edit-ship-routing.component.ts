import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-edit-ship-routing',
  templateUrl: './edit-ship-routing.component.html',
  styleUrls: ['./edit-ship-routing.component.css']
})
export class EditShipRoutingComponent implements OnInit {

  displayedColumns = ['selectRow',  'fromloc', 'Toloc',  'Material', 'Forecastpercentage', 'Routeform'];
  displayedColumnsReplace = ['selectRow', 'key_Fromloc', 'key_Tolocation', 'key_Material', 'key_Forecastpercentage', 'key_Routefrom'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
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
  constructor() { }
  selectRow: any;
  Routeform: any;
  Forecastpercentage: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Routeform = 'Routeform';
    this.Forecastpercentage = 'Forecastpercentage';
  }

}
export interface PeriodicElement {
  selectRow: string; 
  fromloc: string;
  Toloc: string; 
  Material: string;
  Forecastpercentage: string;
  Routeform: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', fromloc: '', Toloc: '',  Material: '', Forecastpercentage: '', Routeform: '' },
];
