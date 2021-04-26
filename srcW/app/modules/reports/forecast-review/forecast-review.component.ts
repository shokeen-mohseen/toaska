import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { ResizeEvent } from 'angular-resizable-element';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { projectkey } from 'environments/projectkey';

export interface PeriodicElement {
  Status: string;
  SalesManager: string;
  Enterprise: string;
  Group: string;
  BillingEntity: string;
  stl: string;
  bec: string;
  MaterialDescription: string;
  Commodity: string;
  DataSegment: string;
  total: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', bec: '4,174.00', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },

];

export interface Element {
  highlighted?: boolean;
}
@Component({
  selector: 'app-forecast-review',
  templateUrl: './forecast-review.component.html',
  styleUrls: ['./forecast-review.component.css']
})
export class ForecastReviewComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;

  itemList = [];
  selectedItems = [];
  settings = {};
  itemListB = [];
  selectedItemsB = [];
  settingsB = {};
  count = 6;
  actionGroupConfig;
  filter: boolean = false;
  IsTosca: boolean;
  displayedColumns = ['Status', 'SalesManager', 'Enterprise', 'Group', 'BillingEntity',
    'stl', 'bec', 'MaterialDescription', 'Commodity', 'DataSegment', 'total'];
  displayedColumnsReplace = ['key_Status', 'key_Salesmanager', 'key_Enterprise', 'key_Group', 'key_BillingEntity',
    'key_ShipToLocation', 'key_BillingEntityCode', 'key_MaterialDescription', 'key_Commodity', 'key_DataSegment', 'key_Total'];
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
  btn: any;

  constructor() { }

  ngOnInit(): void {
    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: false,
      text: "Select",
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //disabled: true
    };
    this.itemListB = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      //addNewItemOnFilter: true,
      //disabled: true
    };
    
      if(projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }
  actionHandler(type) {
    if (type === "filter") {
      this.filter = !this.filter;
    }
  }
  
  showFilter() {
    this.filter = !this.filter;
  }
  ngAfterViewInit() {
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('add');
    this.btnBar.showAction('filter');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
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
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
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

