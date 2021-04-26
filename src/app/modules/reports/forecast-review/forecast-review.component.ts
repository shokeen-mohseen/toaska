import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { ResizeEvent } from 'angular-resizable-element';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { projectkey } from 'environments/projectkey';
import { ForecastService } from '../../../core/services/forecast.service';
import { Forecast } from '../../../core/models/Forecast.model';

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
  forecastSettings = {};
  itemListB = [];
  selectedItemsB = [];
  settingsB = {};
  count = 6;
  forecastList = [];
  actionGroupConfig;
  filter: boolean = false;
  IsTosca: boolean;
  panelOpenState = false;
  paginationModel: Forecast = new Forecast();
  PageName: string = "ForecastReviewExport";
  //doNotAggregateColumn = ['Status', 'SalesManager', 'Enterprise', 'Group', 'BillingEntity',
  //  'stl', 'bec', 'MaterialDescription', 'Commodity', 'DataSegment'];
  //defaultColumns = ['Status', 'SalesManager', 'Enterprise', 'Group', 'BillingEntity',
  //  'stl', 'bec', 'MaterialDescription', 'Commodity', 'DataSegment', 'total'];
  //displayedColumns = [];
  //defaultColumnsReplace = ['key_Status', 'key_Salesmanager', 'key_Enterprise', 'key_Group', 'key_BillingEntity',
  //  'key_ShipToLocation', 'key_BillingEntityCode', 'key_MaterialDescription', 'key_Commodity', 'key_DataSegment', 'key_Total'];
  //displayedColumnsReplace = [];
  //defaultAggregateDisplayedColumns = ['Status', 'DataSegment', 'Total'];
  //aggregateDisplayedColumns = [];
  //defaultAggregateDisplayedColumnsReplace = ['key_Status', 'key_DataSegment', 'key_Total'];
  //aggregateDisplayedColumnsReplace = [];
  doNotAggregateColumn = ['Status', 'SalesManagername', 'GroupName', 'MasCustomerCode', 'BillingEntityName',
    'MasLocationAddressCode', 'ShipToLocation', 'MaterialDescription', 'CommodityName', 'DataSegment'];
  defaultColumns = ['Status', 'SalesManagername', 'GroupName', 'MasCustomerCode', 'BillingEntityName',
    'MasLocationAddressCode', 'ShipToLocation', 'MaterialDescription', 'CommodityName', 'DataSegment', 'Total'];
  displayedColumns = [];
  defaultColumnsReplace = ['key_Status', 'key_SalesManager', 'key_Group', 'key_bilmascust', 'key_BillingEntity',
    'key_Customercode', 'key_ShipToLocation', 'key_MaterialDescription', 'key_Commodity', 'key_DataSegment', 'key_Total'];
  displayedColumnsReplace = [];
  defaultAggregateDisplayedColumns = ['LocationStatus', 'DataSegment', 'Total'];
  aggregateDisplayedColumns = [];
  defaultAggregateDisplayedColumnsReplace = ['key_Status', 'key_DataSegment', 'key_Total'];
  aggregateDisplayedColumnsReplace = [];
  dataSource = new MatTableDataSource<Forecast>();
  selection = new SelectionModel<Forecast>(true, []);
  

  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;
    this.getPageSetupSize();
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
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    //this.selectedForecastList.emit(this.selection.selected);
  }
  btn: any;

  constructor(public forecastService: ForecastService) { }

  ngOnInit(): void {
    this.displayedColumns = Object.assign([], this.defaultColumns);
    this.displayedColumnsReplace = Object.assign([], this.defaultColumnsReplace);
    this.aggregateDisplayedColumns = Object.assign([], this.defaultAggregateDisplayedColumns);
    this.aggregateDisplayedColumnsReplace = Object.assign([], this.defaultAggregateDisplayedColumnsReplace);
    this.dataSource = new MatTableDataSource<Forecast>([]);
    this.getForecastList();
    this.forecastSettings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      searchBy: ['name'],
      labelKey: ['name']
    };

    

    this.settings = {
      singleSelection: false,
      text: "Select",
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2,
      searchBy: ['itemName']
      //disabled: true
    };
    

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName']
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
  
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    //console.log(item);
    //console.log(this.selectedItems);
    this.displayedColumns = Object.assign([], this.defaultColumns);
    this.displayedColumnsReplace = Object.assign([], this.defaultColumnsReplace);
    this.aggregateDisplayedColumns = Object.assign([], this.defaultAggregateDisplayedColumns);
    this.aggregateDisplayedColumnsReplace = Object.assign([], this.defaultAggregateDisplayedColumnsReplace);
    this.dataSource = new MatTableDataSource<Forecast>([]);
    this.aggregatedataSource = new MatTableDataSource([]);
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
  forecastSelected: Forecast;
  filterValue: string;
  aggregatedataSource = new MatTableDataSource();
  async getPageSetupSize() {
    this.forecastService.forecastId = this.forecastSelected[0].id;
    this.setUpForecastDynamicColumn();
    this.paginationModel.pageSize = 0;
    this.paginationModel.id = this.forecastSelected[0].id;
    this.paginator.showFirstLastButtons = true;

    await this.forecastService.getForecastDetailById(this.paginationModel).toPromise()
      .then(async result => {
        if (result.data && result.recordCount) {
          this.paginationModel.itemsLength = result.recordCount;
        }

        // default page size
        this.paginationModel.pageSize = await this.forecastService.getDefaultPageSize();
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
        // initial load should sort by last updated by at first
        this.paginationModel.sortColumn = 'UpdateDateTimeServer';
        this.paginationModel.sortOrder = 'Desc';

        this.getForecastDetail();
      });
    //// default page size
    //this.paginationModel.pageSize = await this.forecastService.getDefaultPageSize();
    //this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    //// initial load should sort by last updated by at first
    //this.paginationModel.sortColumn = 'UpdateDateTimeServer';
    //this.paginationModel.sortOrder = 'Desc';
  }

  getForecastDetail() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.forecastService.getForecastDetailById(this.paginationModel).subscribe(
      result => {
        if (result.data) {
          console.log(result.data)
          this.dataSource.data = result.data;
          this.getForecastAggregateData();
        }
      }
    );
  }

  getForecastAggregateData() {
    this.forecastService.getStatusAggregateForecastDetailById(this.paginationModel).subscribe(
      result => {
        if (result.data) {
          this.aggregatedataSource.data = result.data;
        }
      }
    );
  }
  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getForecastDetail();
  }
  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getForecastDetail();
    }
  }
  setUpForecastDynamicColumn() {
    this.displayedColumns = Object.assign([], this.defaultColumns);
    this.displayedColumnsReplace = Object.assign([], this.defaultColumnsReplace);
    this.aggregateDisplayedColumns = Object.assign([], this.defaultAggregateDisplayedColumns);
    this.aggregateDisplayedColumnsReplace = Object.assign([], this.defaultAggregateDisplayedColumnsReplace);
    this.forecastService.getForecastDynamicColumnById(this.forecastSelected[0].id).subscribe(
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

  getAggregateValue(columnName: any) {

    if (!this.doNotAggregateColumn.includes(columnName) && this.dataSource.data && this.dataSource.data.length > 0) {
      return this.dataSource.data.map(x => parseFloat(x[columnName]) || 0).reduce((a, b) => a + b);
    }
    return '';
  }
}

