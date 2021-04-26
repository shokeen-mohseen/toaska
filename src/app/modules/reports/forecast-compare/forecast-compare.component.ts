import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { projectkey } from 'environments/projectkey';
import { ResizeEvent } from 'angular-resizable-element';
import { ForecastService } from '../../../core/services/forecast.service';
import { Forecast } from '../../../core/models/Forecast.model';
import { ToastrService } from 'ngx-toastr';

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
  forecastList = [];
  forecastList2 = [];
  forecastListSelected = [];
  forecastCompareListSelected = [];
  forecastSelected: Forecast;
  forecastSettings = {};
  ComparedForecastList: any;
  settingsB = {};
  count = 6;
  actionGroupConfig;
  filter: boolean = false;
  panelOpenState = false;
  IsTosca: boolean;
  IsFilterOn: boolean;
  filterValue: string;
  PageName: string = "ForecastCompareExport";
  paginationModel: Forecast = new Forecast();
  doNotAggregateColumn = ['Status', 'SalesManagername', 'EnterpriseName', 'GroupName', 'BillingEntityName',
    'ShipToLocation', 'MaterialDescription', 'CommodityName', 'DataSegment'];
  displayedColumns = [];
  displayedColumnsReplace = [];
  defaultColumns = ['Status', 'SalesManagername', 'EnterpriseName', 'GroupName', 'BillingEntityName',
    'ShipToLocation', 'MaterialDescription', 'CommodityName', 'DataSegment', 'Total'];
  defaultColumnsReplace = ['key_Status', 'key_Salesmanager', 'key_Enterprise', 'key_Group', 'key_BillingEntity',
    'key_ShipToLocation', 'key_MaterialDescription', 'key_Commodity', 'key_DataSegment', 'key_Total'];
  
  defaultAggregateDisplayedColumns = ['Status', 'DataSegment', 'Total'];
  aggregateDisplayedColumns = [];
  defaultAggregateDisplayedColumnsReplace = ['key_Status', 'key_DataSegment', 'key_Total'];
  aggregateDisplayedColumnsReplace = [];
  aggregatedataSource = new MatTableDataSource();
  dataSource = new MatTableDataSource<Forecast>([]);
  selection = new SelectionModel<PeriodicElement>(true, []);
  dataSourceB = new MatTableDataSource<PeriodicElementB>(ELEMENT_DATAB);
  selectionB = new SelectionModel<PeriodicElementB>(true, []);

  //getTotalCost() {
  //  return this.dataSource.data
  //    .map(t => t.Total)
  //    .reduce((acc, value) => acc + value, 0);
  //}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterText: string) {
    
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;
    this.onButtonClick();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  //masterToggle() {
  //  this.isAllSelected() ?
  //    this.selection.clear() :
  //    this.dataSource.data.forEach(row => this.selection.select(row));
  //}
  
  constructor(public forecastService: ForecastService,
   private toastrService: ToastrService) { }

  async ngOnInit() {
    this.displayedColumns = Object.assign([], this.defaultColumns);
    this.displayedColumnsReplace = Object.assign([], this.defaultColumnsReplace);
    this.aggregateDisplayedColumns = Object.assign([], this.defaultAggregateDisplayedColumns);
    this.aggregateDisplayedColumnsReplace = Object.assign([], this.defaultAggregateDisplayedColumnsReplace);
    this.dataSource = new MatTableDataSource<Forecast>([]);
    this.aggregatedataSource = new MatTableDataSource([]);
    this.dataSource.data = null;
    
    this.getForecastList();
    this.getForecastList2();
    this.itemList = [
      { "id": 1, "itemName": "Diff" }
    ];
    this.selectedItems.push({ "id": 1, "itemName": "Diff" });
    this.forecastSettings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      searchBy: ['name'],
      labelKey: ['name']
    };
    

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
  async ngAfterViewInit() {
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('add');
    this.btnBar.showAction('filter');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');

    this.paginator.showFirstLastButtons = true;
    this.paginationModel.pageSize = await this.forecastService.getDefaultPageSize();
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    //console.log(item);
    //console.log(this.selectedItems);
    this.forecastCompareListSelected.filter(y => {
      let index = this.forecastList.findIndex(x => x.id == y.id)
      if (index > -1) {
        this.forecastList.splice(index, 1);
      }
    });
  }
  onForecastSelect(item: any) {


    //var abc = this.forecastListSelected;

    this.forecastListSelected.filter(y => {
      let index = this.forecastList2.findIndex(x => x.id == y.id)
      if (index > -1) {
        this.forecastList2.splice(index, 1);
      }
    });

    //console.log(item);
    //console.log(this.selectedItems);
  }
  OnForecastDeSelect(item: any) {
    this.getForecastList2();
  }
  OnForecastCompareDeSelect(item: any) {
    this.getForecastList();
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  getForecastList() {
    this.forecastService.getForecastList(new Forecast()).subscribe(
      result => {
        if (result.data) {
          this.forecastList = result.data;
          //this.forecastListSelected = this.forecastList.filter(x => x.id == this.forecastSelected.id);

          

          this.forecastList.sort((x, y) => x.name.localeCompare(y.name));
        }
      }
    );
  }

  getForecastList2() {
    this.forecastService.getForecastList(new Forecast()).subscribe(
      result => {
        if (result.data) {
          this.forecastList2 = result.data;
          //this.forecastListSelected = this.forecastList.filter(x => x.id == this.forecastSelected.id);



          this.forecastList2.sort((x, y) => x.name.localeCompare(y.name));
        }
      }
    );
  }

  async getForecastCompareList() {
    var FId = this.forecastListSelected[0].id;
    var FCId = this.forecastCompareListSelected[0].id;
    this.forecastService.forecastId = FId;
    this.forecastService.forecastCId = FCId;
    var selectedForecastIds = String(FId) + ',' + String(FCId);
    await this.setUpForecastDynamicColumn(selectedForecastIds);
    //await this.getPageSetupSize();
    this.paginationModel.filterOn = this.filterValue;

    await this.forecastService.getForecastCompareList(this.paginationModel).toPromise().then(
      result => {
        if (result.data) {
          this.ComparedForecastList = result.data;
          this.dataSource.data = result.data.forecastRow;
          this.getForecastAggregateData();
          //this.dataSource.data.map
          //this.dataSource.data
          //.map(t => t.Total)
          //.reduce((acc, value) => acc + value, 0);
          //this.forecastListSelected = this.forecastList.filter(x => x.id == this.forecastSelected.id);
          //this.forecastList.sort((x, y) => x.name.localeCompare(y.name));
        }
      }
    );
  }

  getAggregateValue(columnName: any) {
    if (this.ComparedForecastList != undefined) {
      if (!this.doNotAggregateColumn.includes(columnName) && this.ComparedForecastList.forecastTotal && this.ComparedForecastList.forecastTotal.length > 0) {
        return this.ComparedForecastList.forecastTotal.map(x => parseFloat(x[columnName]) || 0).reduce((a, b) => a + b);
      }
    }
    else {
      if (!this.doNotAggregateColumn.includes(columnName) && this.dataSource.data && this.dataSource.data.length > 0) {
        return this.dataSource.data.map(x => parseFloat(x[columnName]) || 0).reduce((a, b) => a + b);
      }
    }
    
    return '';
  }
  async onButtonClick() {
    await this.getPageSetupSize();
    await this.getForecastCompareList();
  }
  
  async setUpForecastDynamicColumn(Ids: string) {
    
      this.displayedColumns = Object.assign([], this.defaultColumns);
      this.displayedColumnsReplace = Object.assign([], this.defaultColumnsReplace);
      this.aggregateDisplayedColumns = Object.assign([], this.defaultAggregateDisplayedColumns);
      this.aggregateDisplayedColumnsReplace = Object.assign([], this.defaultAggregateDisplayedColumnsReplace);
    await this.forecastService.GetDynamicColumnByMultipleIds(Ids).toPromise().then(
      result => {
        if (result.data) {
          var re = /-/gi;
          result.data
            .forEach(item => {
              this.displayedColumns.push(item.replace(re, ''));
              this.displayedColumnsReplace.push(item.replace(re, ''));
              this.aggregateDisplayedColumns.push(item.replace(re, ''));
              this.aggregateDisplayedColumnsReplace.push(item.replace(re, ''));
            });
        }

      }
    );
  }
  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getForecastCompareList();
  }
  async getPageSetupSize() {
    this.paginationModel.pageSize = 0;
    //this.paginationModel.id = this.forecastSelected.id;
    this.paginator.showFirstLastButtons = true;
    this.paginationModel.ForecastId = this.forecastListSelected[0].id;
    this.paginationModel.ForecastCId = this.forecastCompareListSelected[0].id;

    await this.forecastService.getForecastCompareList(this.paginationModel).toPromise()
      .then(async result => {
        if (result.data && result.data.forecastRow.length > 0) {
          this.paginationModel.itemsLength = result.data.forecastRow.length;
        }

        // default page size
        this.paginationModel.pageSize = await this.forecastService.getDefaultPageSize();
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
        // initial load should sort by last updated by at first
        //this.paginationModel.sortColumn = 'UpdateDateTimeServer';
        //this.paginationModel.sortOrder = 'Desc';

        //this.getForecastDetail();
        //this.getForecastCompareList();
      });
    //// default page size
    //this.paginationModel.pageSize = await this.forecastService.getDefaultPageSize();
    //this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    //// initial load should sort by last updated by at first
    //this.paginationModel.sortColumn = 'UpdateDateTimeServer';
    //this.paginationModel.sortOrder = 'Desc';
  }




  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getForecastCompareList();
    }
  }
  ResetFilter() {
    this.forecastListSelected = []
    this.forecastCompareListSelected = []
    this.dataSource = new MatTableDataSource<Forecast>([]);
    this.dataSource.data = null;
    this.displayedColumns = Object.assign([], this.defaultColumns);
    this.displayedColumnsReplace = Object.assign([], this.defaultColumnsReplace);
  }

  getForecastAggregateData() {
    this.forecastService.getStatusAggregateForecastCompareDetails(this.paginationModel).subscribe(
      result => {
        if (result.data) {
          this.aggregatedataSource.data = result.data;
        }
      }
    );
  }
}

