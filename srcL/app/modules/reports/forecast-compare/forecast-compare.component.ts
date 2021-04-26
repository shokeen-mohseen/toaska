import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { projectkey } from 'environments/projectkey';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  Status: string;
  SalesManager: string;
  Enterprise: string;
  Group: string;
  BillingEntity: string;
  stl: string;
  MaterialDescription: string;
  Commodity: string;
  DataSegment: string;
  total: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { Status: 'Active_New', SalesManager: 'Alexis Hartman', Enterprise: 'Tosca', Group: 'Dole Fresh Vegetables', BillingEntity: 'Dole Fresh Vegetables', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },

];
export interface PeriodicElementB {
  Status: string;
  DataSegment: string;
  total: number;
  numA: number;
  numB: number;
  numC: number;
  numD: number;
  numE: number;
  numF: number;
  numG: number;
}
const ELEMENT_DATAB: PeriodicElementB[] = [
  { Status: 'Inactive', DataSegment: 'Final Forecast', total: 0, numA: 206516.00, numB: 206516.00, numC: 206516.00, numD: 206516.00, numE: 206516.00, numF: 206516.00, numG: 206516.00 },
  { Status: 'Active_New', DataSegment: 'Final Forecast', total: 0, numA: 206516.00, numB: 206516.00, numC: 206516.00, numD: 206516.00, numE: 206516.00, numF: 206516.00, numG: 206516.00 }
];
export interface Element {
  highlighted?: boolean;
}
@Component({
  selector: 'app-forecast-compare',
  templateUrl: './forecast-compare.component.html',
  styleUrls: ['./forecast-compare.component.css']
})
export class ForecastCompareComponent implements OnInit, AfterViewInit {
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
    'stl', 'MaterialDescription', 'Commodity', 'DataSegment', 'total'];
  displayedColumnsReplace = ['key_Status', 'key_Salesmanager', 'key_Enterprise', 'key_Group', 'key_BillingEntity',
    'key_ShipToLocation', 'key_MaterialDescription', 'key_Commodity', 'key_DataSegment', 'key_Total'];
  displayedColumnsB = ['Status', 'DataSegment', 'total', 'numA', 'numB', 'numC', 'numD', 'numE', 'numF', 'numG',];
  displayedColumnsReplaceB = ['key_Status', 'key_DataSegment', 'key_Total', '201701', '201702', '201703', '201704', '201705', '201706', '201707'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  dataSourceB = new MatTableDataSource<PeriodicElementB>(ELEMENT_DATAB);
  selectionB = new SelectionModel<PeriodicElementB>(true, []);

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
      badgeShowLimit: 2,
      searchBy: ['itemName'],
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
      searchBy: ['itemName'],
      //addNewItemOnFilter: true,
      //disabled: true
    };

    if (projectkey.projectname == "tosca") {
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
  ngAfterViewInit() {
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('add');
    this.btnBar.showAction('filter');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
    this.itemListB.push({ "id": this.count, "itemName": data });
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

