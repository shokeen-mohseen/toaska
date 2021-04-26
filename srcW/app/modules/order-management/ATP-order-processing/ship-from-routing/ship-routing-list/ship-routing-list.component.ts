import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-ship-routing-list',
  templateUrl: './ship-routing-list.component.html',
  styleUrls: ['./ship-routing-list.component.css']
})
export class ShipRoutingListComponent implements OnInit {
  displayedColumns = ['selectRow', 'Fromloctype', 'fromloc', 'Toloc', 'Citystate', 'Material','Forecastpercentage','Routeform','Lockunlock'];
  displayedColumnsReplace = ['selectRow', 'key_Fromloctype', 'key_Fromloc', 'key_Tolocation', 'key_Citystat', 'key_Material', 'key_Forecastpercentage', 'key_Routefrom','key_Lockunlock'];
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
  Lockunlock: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Routeform = 'Routeform';
    this.Lockunlock = 'Lockunlock';
  }

}
export interface PeriodicElement {
  selectRow: string;
  Fromloctype: string;
  fromloc: string;
  Toloc: string;
  Citystate: string;
  Material: string;
  Forecastpercentage: string;
  Routeform: string;
  Lockunlock: string;
}

const ELEMENT_DATA: PeriodicElement[] = [ 
  { selectRow: '', Fromloctype: '', fromloc: '', Toloc: '', Citystate: '', Material: '', Forecastpercentage: '', Routeform: '', Lockunlock:'' },
];
