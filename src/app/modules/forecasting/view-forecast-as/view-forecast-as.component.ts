import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  SalesManager: string;
  Enterprise: string;
  Group: string;
  BillingEntity: string;
  stl: string;
  geoLocationCode: string;
  geoLocation: string;
  Commodity: string;
  MaterialDescription: string;
  DataSegment: string;
  total: number;
  data202001: number;
  data202002: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { SalesManager: 'Doug Wilson', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', geoLocationCode: '23535', geoLocation: 'Rose Acre(Stuart Egg Farm)KR', Commodity: 'Eggs', MaterialDescription: 'WW-PALLET', DataSegment: 'Final Forecast', total: 0, data202001: 0, data202002: 0 },
  
  
];
export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-view-forecast-as',
  templateUrl: './view-forecast-as.component.html',
  styleUrls: ['./view-forecast-as.component.css']
})
export class ViewForecastAsComponent implements OnInit {
  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;

  displayedColumns = ['SalesManager', 'Enterprise', 'Group', 'BillingEntity',
    'stl', 'geoLocationCode', 'geoLocation', 'Commodity', 'MaterialDescription', 'DataSegment', 'total', 'data202001', 'data202002'];
  displayedColumnsReplace = ['key_Salesmanager', 'key_Enterprise', 'key_Group', 'key_BillingEntity',
    'key_ShipToLocation', 'key_GeoLocationCode', 'key_GeoLocation', 'key_Commodity', 'key_MaterialDescription',
    'key_DataSegment', 'key_Total', 'data202001', 'data202002'];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  getTotalCost() {
    return ELEMENT_DATA
      .map(t => t.total)
      .reduce((acc, value) => acc + value, 0);
  }

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
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: false,
      text: "Select",
      //enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //disabled: true
      badgeShowLimit: 3,
      searchBy: ['itemName'],
    };
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

  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
}
