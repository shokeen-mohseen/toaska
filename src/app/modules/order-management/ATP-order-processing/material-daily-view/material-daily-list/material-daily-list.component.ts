import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-material-daily-list',
  templateUrl: './material-daily-list.component.html',
  styleUrls: ['./material-daily-list.component.css']
})
export class MaterialDailyListComponent implements OnInit {
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

  displayedColumns = ['selectRow', 'date', 'Secwnce', 'Activitytype', 'Orderno', 'Reservation', 'Unusedfor', 'Unusedreservation', 'Reservationavl', 'Inventory', 'Activityquntity', 'Assignqunt', 'Ending', 'Status','Edit'];

  displayedColumnsReplace = ['selectRow', 'key_Date', 'key_Sequencenu', 'key_Activitytype', 'key_OrderNo', 'key_Reservation', 'key_Unusedcustomer', 'key_Unusedreservationfromothers', 'key_Reservationavl', 'key_Inventoryavailability', 'key_Actqunt', 'key_Assigned', 'key_Endinginventory', 'key_Status', 'key_Edit'];
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
  constructor() { }
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }

}
export interface PeriodicElement {
  selectRow: string;
  date: string;
  Secwnce: string;
  Activitytype: string;
  Orderno: string;
  Reservation: string;
  Unusedfor: string;
  Unusedreservation: string;
  Reservationavl: string;
  Inventory: string;
  Activityquntity: string;
  Assignqunt: string;
  Ending: string;
  Status: string;
  Edit: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

  { selectRow: '', date: '11/02/20', Secwnce: '', Activitytype: 'Cust order', Orderno: '', Reservation: '0', Unusedfor: '0', Unusedreservation: '0', Reservationavl: '-5,318', Inventory: '-5,318', Activityquntity: '60', Assignqunt: '60', Ending: '-4,178', Status: '', Edit:'' },
];
