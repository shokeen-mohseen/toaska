import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-plant-inventory-lavel-list',
  templateUrl: './plant-inventory-lavel-list.component.html',
  styleUrls: ['./plant-inventory-lavel-list.component.css']
})
export class PlantInventoryLavelListComponent implements OnInit {

  remove(element) {
    this.dataSource.data.splice(ELEMENT_DATA.indexOf(element), 1);
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataSource.data);
  }

  public dateFormat: String = "MM-dd-yyyy";
  modalRef: NgbModalRef;
  Month: any;
  Location: any;
  Item: any;
  Daysperiod: any;
  Servicefactor: any;
  Forecasts: any;
  ObservedRate: any;
  Observedschedule: any;
  Expectedrate: any;
  Equivalentcycletime: any;
  ObserverdstdDevcycletime: any;
  NSDofdemand: any;
  Avgdailydemand: any;
  StdDD: any;
  Minlevel: any;
  Orderuptolevel: any;
  Daysofsales: any;
  
  Place: any;
  BtWt: any;
  Immunization: any;
  Complications: any;
  Delete: any;
  Add_New: any;

  displayedColumns = ['selectRow','Month', 'Location', 'Item', 'Daysperiod', 'Servicefactor', 'Forecasts', 'ObservedRate', 'Observedschedule', 'Expectedrate', 'Equivalentcycletime', 'ObserverdstdDevcycletime', 'NSDofdemand', 'Avgdailydemand', 'StdDD', 'Minlevel', 'Orderuptolevel','Daysofsales', 'Delete', 'Add_New'];
  displayedColumnsReplace = ['selectRow','key_Months', 'key_Location', 'key_Item', 'key_DaysInPeriod', 'key_Servicefactor', 'key_Forecasts', 'key_ObservedRate', 'key_Observedschedule', 'key_Expectedrate', 'key_Equivalentcycletime', 'key_ObserverdstdDevcycletime', 'key_NSDofdemand', 'key_Avgdailydemand', 'key_StdDD', 'key_Minlevel', 'key_Orderuptolevel','key_Daysofsales', 'key_Delete', 'key_addnew'];
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


  constructor(public modalService: NgbModal) { }
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Month = 'Month';
    this.Location = 'Location';
    this.Item = 'Item';
    this.Daysperiod = 'Daysperiod';
    this.Servicefactor = 'Servicefactor';
    this.Forecasts = 'Forecasts';
    this.ObservedRate = 'ObservedRate';
    this.Observedschedule = 'Observedschedule';
    this.Expectedrate = 'Expectedrate';
    this.Equivalentcycletime = 'Equivalentcycletime';
    this.ObserverdstdDevcycletime = 'ObserverdstdDevcycletime';
    this.NSDofdemand = 'NSDofdemand';
    this.Avgdailydemand = 'Avgdailydemand';
    this.StdDD = 'StdDD';
    this.Minlevel = 'Minlevel';
    this.Orderuptolevel = 'Orderuptolevel';
    this.Daysofsales = 'Daysofsales';
    this.Delete = 'Delete';
    this.Add_New = 'Add_New';
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
  addRow() {
    ELEMENT_DATA.push({ selectRow: '', Month: '', Location: '', Item: '', Daysperiod: '', Servicefactor: '', Forecasts: '', ObservedRate: '', Observedschedule: '', Expectedrate: '', Equivalentcycletime: '', ObserverdstdDevcycletime: '', NSDofdemand: '', Avgdailydemand: '', StdDD: '', Minlevel: '', Orderuptolevel: '', Daysofsales:'', Delete: '', Add_New: '' })
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }


}



export interface PeriodicElement {
  selectRow: string;
  Month: string;
  Location: string;
  Item: string;
  Daysperiod: string;
  Servicefactor: string;
  Forecasts: string;
  ObservedRate: string;
  Observedschedule: string;
  Expectedrate: string;
  Equivalentcycletime: string;
  ObserverdstdDevcycletime: string;
  NSDofdemand: string;
  Avgdailydemand: string;
  StdDD: string;
  Minlevel: string;
  Orderuptolevel: string;
  Daysofsales: string;
  Delete: string;
  Add_New: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Month: '', Location: '', Item: '', Daysperiod: '', Servicefactor: '', Forecasts: '', ObservedRate: '', Observedschedule: '', Expectedrate: '', Equivalentcycletime: '', ObserverdstdDevcycletime: '', NSDofdemand: '', Avgdailydemand: '', StdDD: '', Minlevel: '', Orderuptolevel: '', Daysofsales:'', Delete: '', Add_New: '' }
];
