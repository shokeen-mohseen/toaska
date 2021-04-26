import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-dcinventory-lavel-list',
  templateUrl: './dcinventory-lavel-list.component.html',
  styleUrls: ['./dcinventory-lavel-list.component.css']
})
export class DcinventoryLavelListComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";
  modalRef: NgbModalRef;
  Period: any;
  Location: any;
  Item: any;
  Daysperiod: any;
  OrderFrequency: any;
  ServiceFactor : any;
  Forecast: any;
  AvgSupplyLeadTime: any;  
  StdDevSupplyLT: any;
  NSDofDemand: any;
  AvgDailyDemand: any;
  StdDD: any;
  MinLevel: any;
  OrderUpToLevel: any; 
  Daysofsales: any; 

  displayedColumns = ['selectRow', 'Period', 'Location', 'Item', 'Daysperiod', 'OrderFrequency', 'ServiceFactor', 'Forecast', 'AvgSupplyLeadTime', 'StdDevSupplyLT', 'NSDofDemand', 'AvgDailyDemand', 'StdDD', 'MinLevel', 'OrderUpToLevel', 'Daysofsales'];
  displayedColumnsReplace = ['selectRow', 'key_Period', 'key_Location', 'key_Item', 'key_DaysInPeriod', 'key_OrderFrequency', 'key_Servicefactor', 'key_Forecasts', 'key_AvgSupplyLeadTime', 'key_StdDevSupplyLT', 'key_NSDofdemand','key_AvgDailyDemand',  'key_StdDD', 'key_Minlevel', 'key_Orderuptolevel', 'key_Daysofsales'];
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
    this.Period = 'Period';
    this.Location = 'Location';
    this.Item = 'Item';
    this.Daysperiod = 'Daysperiod';
    this.OrderFrequency = 'OrderFrequency';
    this.ServiceFactor = 'ServiceFactor';
    this.Forecast = 'Forecast';
    this.AvgSupplyLeadTime = 'AvgSupplyLeadTime';
    this.StdDevSupplyLT = 'StdDevSupplyLT';
    this.NSDofDemand = 'NSDofDemand';
    this.AvgDailyDemand = 'AvgDailyDemand';   
    this.StdDD = 'StdDD';
    this.MinLevel = 'MinLevel';
    this.OrderUpToLevel = 'OrderUpToLevel';
    this.Daysofsales = 'Daysofsales';   
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
  ////addRow() {
  ////  ELEMENT_DATA.push({ selectRow: '', Period: '', Location: '', Item: '', Daysperiod: '', OrderFrequency: '', ServiceFactor: '', Forecast: '', AvgSupplyLeadTime: '', StdDevSupplyLT: '', NSDofDemand: '', AvgDailyDemand: '', StdDD: '', MinLevel: '', OrderUpToLevel: '', DaysofSales: '' })
  ////  this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  ////}


}



export interface PeriodicElement {
  selectRow: string;
  Period: string;
  Location: string;
  Item: string;
  Daysperiod: string;
  OrderFrequency: string;
  ServiceFactor : string;
  Forecast: string;
  AvgSupplyLeadTime: string;
  StdDevSupplyLT: string;
  NSDofDemand: string;
  AvgDailyDemand: string; 
  StdDD: string;
  MinLevel: string;
  OrderUpToLevel: string;
  Daysofsales: string; 
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Period: '', Location: '', Item: '', Daysperiod: '', OrderFrequency: '', ServiceFactor: '', Forecast: '', AvgSupplyLeadTime: '', StdDevSupplyLT: '', NSDofDemand: '', AvgDailyDemand: '', StdDD: '', MinLevel: '', OrderUpToLevel: '', Daysofsales: ''}
];
