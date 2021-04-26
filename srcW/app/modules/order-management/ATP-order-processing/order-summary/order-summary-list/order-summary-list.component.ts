import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-order-summary-list',
  templateUrl: './order-summary-list.component.html',
  styleUrls: ['./order-summary-list.component.css']
})
export class OrderSummaryListComponent implements OnInit {
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
  displayedColumns = ['selectRow', 'Orderdate', 'Scheduleshipdate', 'Shipfromloc', 'Ordertype', 'Orderno','Shiptoloc','Priority','Activeline','Orderquantity','Assignquntity','Shippedqunt','Remainingship','Atpprocessing','Comment'];
  displayedColumnsReplace = ['selectRow', 'key_OrderDate', 'key_ScheduledShipDate', 'key_ShipFromLocation', 'key_Ordertype', 'key_OrderNo', 'key_Shipto', 'key_Priority', 'key_Activeline', 'key_OrderQuantity', 'key_Assigned', 'key_Shipqunt', 'key_Remaining', 'key_Atpprocessing','key_OrderComments'];
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
  Orderdate: string;
  Scheduleshipdate: string;
  Shipfromloc: string;
  Ordertype: string;
  Orderno: string;
  Shiptoloc: string;
  Priority: string;  
  Activeline: string;
  Orderquantity: string;
  Assignquntity: string;
  Shippedqunt: string;
  Remainingship: string;
  Atpprocessing: string;
  Comment: string; 
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  { selectRow: '', Orderdate: '', Scheduleshipdate: '', Shipfromloc: '', Ordertype: '', Orderno: '', Shiptoloc: '', Priority: '', Activeline: '', Orderquantity: '', Assignquntity: '', Shippedqunt: '', Remainingship: '', Atpprocessing: '', Comment:'' },
  
];
