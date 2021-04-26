import { Component, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Options } from 'select2';
import { ResizeEvent } from 'angular-resizable-element';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core';
import { ForecastService } from '../../../core/services/forecast.service';
import { Forecast } from '../../../core/models/Forecast.model';

@Component({
  selector: 'app-create-compute-sales-forecast',
  templateUrl: './create-compute-sales-forecast.component.html',
  styleUrls: ['./create-compute-sales-forecast.component.css']
})
export class CreateComputeSalesForecastComponent implements OnInit, OnChanges {
  public options: Options;
  panelOpenState = false;
  selectRow: any;
  doNotAggregateColumn = ['selectRow', 'Status', 'SalesManagername', 'GroupName', 'MasCustomerCode', 'BillingEntityName',
    'MasLocationAddressCode', 'ShipToLocation', 'MaterialDescription', 'CommodityName', 'DataSegment'];
  defaultColumns = ['selectRow', 'Status', 'SalesManagername', 'GroupName', 'MasCustomerCode', 'BillingEntityName',
    'MasLocationAddressCode', 'ShipToLocation', 'MaterialDescription', 'CommodityName', 'DataSegment', 'Total'];
  displayedColumns = [];
  defaultColumnsReplace = ['selectRow', 'key_Status', 'key_SalesManager', 'key_Group', 'key_bilmascust', 'key_BillingEntity',
    'key_Customercode', 'key_ShipToLocation', 'key_MaterialDescription', 'key_Commodity', 'key_DataSegment', 'key_Total'];
  displayedColumnsReplace = [];
  defaultAggregateDisplayedColumns = ['LocationStatus', 'DataSegment','Total'];
  aggregateDisplayedColumns = [];
  defaultAggregateDisplayedColumnsReplace = ['key_Status', 'key_DataSegment', 'key_Total'];
  aggregateDisplayedColumnsReplace = [];
  dataSource = new MatTableDataSource<Forecast>();
  aggregatedataSource = new MatTableDataSource();
  selection = new SelectionModel<Forecast>(true, []);
  forecastSelected: Forecast;
  paginationModel: Forecast = new Forecast();
  filterValue: string;

  @Output('selectedForecastList') selectedForecastList = new EventEmitter<Forecast[]>();



  
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
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    this.selectedForecastList.emit(this.selection.selected);
  }

  /** On row selection send that row to parent component  */
  onSelectionChange(row: Forecast, checked: boolean) {
    debugger;
    row.isSelected = checked;
    this.selection.toggle(row);
    this.forecastService.ForecastingforEdit = this.selection.selected;
    this.selectedForecastList.emit(this.selection.selected);
  }


  isLinear = false;


  constructor(
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public forecastService: ForecastService
  )
  {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.forecastService.currentValue) {

    }
  }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.setUpForecastSelected(null);
    //multi select options
    this.options = {
      multiple: true,
      tags: true,
      closeOnSelect: false,
    };
  }

  setUpForecastSelected(forecast: Forecast ) {
    if (forecast) {
      this.forecastSelected = forecast;
      this.setUpForecastDynamicColumn();
      this.getPageSetupSize();
    } else if (this.forecastService.forecastSelected) {
      this.forecastSelected = this.forecastService.forecastSelected;
      this.setUpForecastDynamicColumn();
      this.getPageSetupSize();
    } else {
      this.forecastService.getLastUpdatedForecast().subscribe(
        result => {
          if (result.data) {
            this.forecastSelected = result.data;
            this.getPageSetupSize();
            this.setUpForecastDynamicColumn();
          }
        }
      );
    }
  }
  setUpForecastDynamicColumn() {
    this.displayedColumns = Object.assign([], this.defaultColumns);
    this.displayedColumnsReplace = Object.assign([], this.defaultColumnsReplace);
    this.aggregateDisplayedColumns = Object.assign([], this.defaultAggregateDisplayedColumns);
    this.aggregateDisplayedColumnsReplace = Object.assign([], this.defaultAggregateDisplayedColumnsReplace);
    this.forecastService.getForecastDynamicColumnById(this.forecastSelected.id).subscribe(
      result => {
        if (result.data) {
          var re = /-/gi;
          result.data
            .forEach(item => {
              this.displayedColumns.push(item);
              this.displayedColumnsReplace.push(item.replace(re,' '));
              this.aggregateDisplayedColumns.push(item);
              this.aggregateDisplayedColumnsReplace.push(item.replace(re, ' '));
            });
        }

      }
    );
  }

  getForecastDetail() {

    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.forecastService.getForecastDetailById(this.paginationModel).subscribe(
      result => {
        if (result.data) {
          debugger;
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

  async getPageSetupSize() {
    this.paginationModel.pageSize = 0;
    this.paginationModel.id = this.forecastSelected.id;
    await this.forecastService.getForecastDetailById(this.paginationModel).toPromise()
      .then(result => {
        if (result.data && result.recordCount) {
          this.paginationModel.itemsLength = result.recordCount;
        }
        this.getForecastDetail();
      });
    // default page size
    this.paginationModel.pageSize = await this.forecastService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    // initial load should sort by last updated by at first
    this.paginationModel.sortColumn = 'UpdateDateTimeServer';
    this.paginationModel.sortOrder = 'Desc';
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


  getAggregateValue(columnName: any) {

    if (!this.doNotAggregateColumn.includes(columnName) && this.dataSource.data && this.dataSource.data.length > 0)
    {
      return this.dataSource.data.map(x => parseFloat(x[columnName]) || 0).reduce((a, b) => a + b);
    }
    return '';
  }
  

}






