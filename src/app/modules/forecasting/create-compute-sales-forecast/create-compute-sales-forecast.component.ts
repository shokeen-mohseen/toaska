import { Component, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges, Input } from '@angular/core';
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
import { parse } from 'error-stack-parser';
import { MessageService } from '../../../core/services/message.service';
import { Router } from '@angular/router';
import { projectkey } from '../../../../environments/projectkey';

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
  defaultAggregateDisplayedColumns = ['LocationStatus', 'DataSegment', 'Total'];
  aggregateDisplayedColumns = [];
  defaultAggregateDisplayedColumnsReplace = ['key_Status', 'key_DataSegment', 'key_Total'];
  aggregateDisplayedColumnsReplace = [];
  dataSource = new MatTableDataSource<Forecast>();
  aggregatedataSource = new MatTableDataSource();
  selection = new SelectionModel<Forecast>(true, []);
  forecastSelected: Forecast;
  paginationModel: Forecast = new Forecast();
  filterValue: string;
  IsLock: boolean;
  @Input() buttonBar: any;
  userMessages: any = [];
  IsReadAndModifyPermission: boolean = false;
  ControlPermissions: any = [];
  IsPublishModifyPermission: boolean = false;
  IsDeletePublishModifyPermission: boolean = false;

  @Output('selectedForecastList') selectedForecastList = new EventEmitter<Forecast[]>();




  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;
    await this.getPageSetupSize();
    this.paginationModel.sortColumn = "updateDateTimeServer";
    this.paginationModel.sortOrder = "Desc";
    this.getForecastDetail();
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
    this.forecastService.ForecastingforEdit = [];
    row.isSelected = checked;
    this.selection.toggle(row);
    this.forecastService.ForecastingforEdit = this.selection.selected;
    this.selectedForecastList.emit(this.selection.selected);
  }


  isLinear = false;


  constructor(
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public forecastService: ForecastService,
    public messageService: MessageService, private router: Router
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes && changes.forecastService.currentValue) {

    // }
  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }
  ngOnInit() {
    this.IsPublishModifyPermission = false;
    this.IsLock = false;
    this.IsReadAndModifyPermission = false;
    this.forecastService.ForecastingforEdit = [];
    this.selectRow = 'selectRow';
    this.getMessages();
    this.getPageControlsPermissions();
    this.buttonPermission();
   
    // this.setUpForecastSelected(null);
    //multi select options
    this.options = {
      multiple: true,
      tags: true,
      closeOnSelect: false,
    };
  }

  setUpForecastSelected(forecast: Forecast) {
  
    if (forecast) {
      this.forecastSelected = forecast;
      this.setUpForecastDynamicColumn();
      this.getPageSetupSize();
      this.paginationModel.sortColumn = "updateDateTimeServer";
      this.paginationModel.sortOrder = "Desc";
      this.paginationModel.id = this.forecastSelected.id;
      this.getForecastDetail();
    } else if (this.forecastService.forecastSelected) {
      this.forecastSelected = this.forecastService.forecastSelected;
      this.setUpForecastDynamicColumn();
      this.getPageSetupSize();
      this.paginationModel.sortColumn = "updateDateTimeServer";
      this.paginationModel.sortOrder = "Desc";
      this.getForecastDetail();
    } else {
      this.forecastService.getLastUpdatedForecast().subscribe(
        result => {
          if (result.data) {
            this.forecastSelected = result.data;

            this.getPageSetupSize();
            this.paginationModel.sortColumn = "updateDateTimeServer";
            this.paginationModel.sortOrder = "Desc";
            this.getForecastDetail();
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
              this.displayedColumns.push(item.replace(re, ''));
              this.displayedColumnsReplace.push(item.replace(re, ''));
              this.aggregateDisplayedColumns.push(item.replace(re, ''));
              this.aggregateDisplayedColumnsReplace.push(item.replace(re, ''));
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
          if (result.data != null) {
            this.dataSource.data = result.data;
            this.getForecastAggregateData();
            if (result.data.length > 0) {

              //To enable disable buttons
              var IsLock = result.data[0].IsLocked;
              var IsPublished = result.data[0].IsPublished;
              this.EnableDisebleButtons(IsLock, IsPublished);

              //to refresh top section in perent(lock/unlock status)
              this.selectedForecastList.emit(null);
            }
            else {
              this.dataSource = new MatTableDataSource<Forecast>();
              this.aggregatedataSource = new MatTableDataSource();
            }


          }
        }
        else {
          this.dataSource = new MatTableDataSource<Forecast>();
          this.aggregatedataSource = new MatTableDataSource();
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
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.paginationModel.id = this.forecastSelected.id;
    //this.paginator.showFirstLastButtons = true;

    await this.forecastService.getForecastDetailById(this.paginationModel).toPromise()
      .then(async result => {
        if (result.data && result.recordCount) {
          this.paginationModel.itemsLength = result.recordCount;
        }

        // default page size
        
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
        // initial load should sort by last updated by at first
       // this.paginationModel.sortColumn = 'UpdateDateTimeServer';
      //  this.paginationModel.sortOrder = 'Desc';

        //this.getForecastDetail();
      });
    this.paginationModel.pageSize = await this.forecastService.getDefaultPageSize();
    //// default page size
    //this.paginationModel.pageSize = await this.forecastService.getDefaultPageSize();
    //this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    //// initial load should sort by last updated by at first
    //this.paginationModel.sortColumn = 'UpdateDateTimeServer';
    //this.paginationModel.sortOrder = 'Desc';
  }
  
  onPaginationEvent(event) {
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getForecastDetail();
    this.paginationModel.pageSize = event.pageSize;
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

    if (!this.doNotAggregateColumn.includes(columnName) && this.dataSource.data && this.dataSource.data.length > 0) {
      return this.dataSource.data.map(x => parseFloat(x[columnName]) || 0).reduce((a, b) => a + b);
    }
    return '';
  }

  getMessages() {
    this.messageService.getMessagesByModuleCode("CSFOR", parseInt(localStorage.clientId)).subscribe(
      result => {
        if (result.data) {
          this.userMessages = result.data;
        }
      }
    );
  }
  getMessage(messageCode: string) {
    if (this.userMessages) {
      return this.userMessages.find(x => x.code == messageCode)?.message1;
    }
    return '';
  }

  LockUnLock(isLock: boolean = false) {

    this.IsLock = isLock;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    this.forecastService.LockForecast(this.paginationModel.id, isLock, ClientId).subscribe(
      result => {
        if (result != undefined && result != null && result != "" && result.message == "Success" && result.data == true) {
          if (this.IsLock)
            this.toastrService.success(this.getMessage("ForecastLockedSuccessfully"));
          else
            this.toastrService.success(this.getMessage("ForecastUnLockedSuccessfully"));

          //To refresh forecast grid         
          this.getForecastDetail();
        }
      }
    );
  }
  Publish(isPublish: boolean) {

    var ClientId = this.authenticationService.currentUserValue.ClientId;   

    this.forecastService.PublishForecast(this.paginationModel.id, isPublish, ClientId).subscribe(
      result => {
        if (result != undefined && result != null && result != "" && result.message == "Success" && result.data == true) {
          this.toastrService.success(this.getMessage("ForecastPublishedSuccessfully"));
          //To refresh forecast grid         
          this.getForecastDetail();
        }
      }
    );
  }

 buttonPermission() {

    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authenticationService.currentUserValue.UserId;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all
          if (data != null || data != undefined) {
            if (data.length != 0) {
              if (data[0].PermissionType == "Read and Modify") {
                this.IsReadAndModifyPermission = true;
                this.buttonBar.enableAction('add');
                this.buttonBar.enableAction('addRow');

                this.buttonBar.disableAction('deleteSelectedForecast');
                if (this.IsDeletePublishModifyPermission)
                  this.buttonBar.enableAction('deleteSelectedForecast');

                this.buttonBar.enableAction('duplicateForecast');
                this.buttonBar.enableAction('deleteSelectedRow');
                this.buttonBar.enableAction('AdjustFinalForecast');
                this.buttonBar.enableAction('updateForecast');
                //enable by module role permission
                //this.buttonBar.enableAction('publish');
                this.buttonBar.disableAction('publish');
                this.buttonBar.enableAction('lock');
                this.buttonBar.enableAction('unlock');

                this.buttonBar.enableAction('createsNewForecast');

              }
              else {
                this.IsReadAndModifyPermission = false;
                this.buttonBar.disableAction('add');
                this.buttonBar.disableAction('addRow');
                this.buttonBar.disableAction('deleteSelectedForecast');
                this.buttonBar.disableAction('duplicateForecast');
                this.buttonBar.disableAction('deleteSelectedRow');
                this.buttonBar.disableAction('AdjustFinalForecast');
                this.buttonBar.disableAction('updateForecast');
                this.buttonBar.disableAction('publish');
                this.buttonBar.disableAction('lock');
                this.buttonBar.disableAction('unlock');
                this.buttonBar.disableAction('flex');                          
                this.buttonBar.disableAction('filter');
                this.buttonBar.disableAction('importforecast');
                this.buttonBar.disableAction('export');
                this.buttonBar.disableAction('filter');
                this.buttonBar.disableAction('createsNewForecast');
                this.buttonBar.disableAction('uploadForecast');
                this.buttonBar.disableAction('issue');
                this.buttonBar.disableAction('alerts');

              }
            }
            else {
              this.router.navigate(['/unauthorized']);
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }

          //call this function here because (to fix all button enable again issue for locked/publish forecast)
          this.setUpForecastSelected(null);
        }
      });

  }

  getPageControlsPermissions() {
     
    var ModuleRoleCode = "CSFOR.PBS,CSFOR.PBSDelete";
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var LoginId = this.authenticationService.currentUserValue.LoginId;
    this.forecastService.getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.ControlPermissions = res.Data;

          //Publish
          var isPublishPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.trim() == "CSFOR.PBS");
          if (isPublishPermission != null && isPublishPermission != undefined) {
            if (isPublishPermission.length > 0) {
              if (isPublishPermission[0].PermissionType.toLowerCase() == "read and modify") {
                //Publish modify permission allow
                this.IsPublishModifyPermission = true;
              } else {
                //Publish modify permission not allow
                this.IsPublishModifyPermission = false;
              }
            }
          }
          //Delete Publish
          var isDeletePublishPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.trim() == "CSFOR.PBSDelete");
          if (isDeletePublishPermission != null && isDeletePublishPermission != undefined) {
            if (isDeletePublishPermission.length > 0) {
              if (isDeletePublishPermission[0].PermissionType.toLowerCase() == "read and modify") {
                //Delete Publish modify permission allow
                this.IsDeletePublishModifyPermission = true;
              } else {
                //Delete Publish modify permission not allow
                this.IsDeletePublishModifyPermission = false;
              }
            }
          }
        }
      });
  }

  EnableDisebleButtons(IsLock: string, IsPublished: string) {
    
    if (IsLock.trim() == "True") {
      //disable everything but some button will enable which are not efect in database
      // if (this.IsReadAndModifyPermission)
        this.buttonBar.enableAction('unlock');

      this.buttonBar.disableAction('lock');
      this.buttonBar.disableAction('addRow');
      this.buttonBar.disableAction('deleteSelectedRow');

      this.buttonBar.disableAction('deleteSelectedForecast');
      if (this.IsDeletePublishModifyPermission)
        this.buttonBar.enableAction('deleteSelectedForecast');

      this.buttonBar.disableAction('alerts');
      this.buttonBar.disableAction('issue');
      this.buttonBar.enableAction('duplicateForecast');
      this.buttonBar.disableAction('importforecast');
      this.buttonBar.disableAction('flex');   
      this.buttonBar.disableAction('AdjustFinalForecast');
      this.buttonBar.disableAction('updateForecast');  
      this.buttonBar.enableAction('filter');

    }
    if (IsLock.trim() == "False") {
      //enable everything but unlock is disable     
      this.buttonBar.disableAction('unlock');

      // if (this.IsReadAndModifyPermission) {
        this.buttonBar.enableAction('lock');
        this.buttonBar.enableAction('addRow');
        this.buttonBar.enableAction('deleteSelectedRow');

        this.buttonBar.disableAction('deleteSelectedForecast');
        if (this.IsDeletePublishModifyPermission)
          this.buttonBar.enableAction('deleteSelectedForecast');

        this.buttonBar.enableAction('alerts');
        this.buttonBar.enableAction('issue');
        this.buttonBar.enableAction('duplicateForecast');
        this.buttonBar.enableAction('importforecast');
        this.buttonBar.enableAction('flex');       
        this.buttonBar.enableAction('AdjustFinalForecast');
        this.buttonBar.enableAction('updateForecast');      
        this.buttonBar.enableAction('filter');
      // }
    }
    if (IsPublished.trim() == "True") {
      //every thing is disable
      this.buttonBar.disableAction('publish');
      this.buttonBar.disableAction('lock');
      this.buttonBar.disableAction('unlock');

      this.buttonBar.disableAction('addRow');
      this.buttonBar.disableAction('deleteSelectedRow');

      this.buttonBar.disableAction('deleteSelectedForecast');
      if (this.IsDeletePublishModifyPermission)
        this.buttonBar.enableAction('deleteSelectedForecast');

      this.buttonBar.disableAction('alerts');
      this.buttonBar.disableAction('issue');
      this.buttonBar.enableAction('duplicateForecast');
      this.buttonBar.disableAction('importforecast');
      this.buttonBar.disableAction('flex');    
      this.buttonBar.disableAction('AdjustFinalForecast');
      this.buttonBar.disableAction('updateForecast');      
      this.buttonBar.enableAction('filter');

    }
    if (IsPublished.trim() == "False") {
      if (this.IsReadAndModifyPermission && this.IsPublishModifyPermission)
        this.buttonBar.enableAction('publish');
    }
  }

}






