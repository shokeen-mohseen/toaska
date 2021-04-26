import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertManagementService } from '../../services/alert-management.server.input.services';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { CsvService } from '../../services/csvconverter.service';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { AlertViewModel } from '../../../../core/models/Alert';
import { AuthService, PreferenceTypeService } from '../../../../core';
import { UserAlerts } from '../../models/UserAlerts';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.css']
})
export class AlertListComponent implements OnInit {

/*  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }*/

  csvData: any;
  selectedEditID: number;
  paginationModel = new UserAlerts();
  selectRow: any;

  constructor(private authenticationService: AuthService,
    private csvService: CsvService,
    private toster: ToastrService,
    private router: Router,
    private ptService: PreferenceTypeService,
    private services: AlertManagementService) {  }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.paginationModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    await this.getPageSize();
    this.GetAllAlertsData();
  }
  btnAdd = function () {
    this.router.navigateByUrl('/alert-management/add-new-alert');
  };
  btnEdit = function ()  {


    if (this.selection.selected.length > 1) {
      this.toster.info("Please select only one record.");
      return false;
    }

    if (this.selection.selected.length == 0) {
      this.toster.warning("Please select at least one record.");
      return false;
    }

    this.selectedEditID = Number(this.selection.selected[0].ID);

    return true;
    //var idEncrypted = this.EncryptUserAlertID(this.selection.selected[0].ID);
    //this.router.navigate(['/alert-management/edit-alert'],
    //  { queryParams: { id: this.selection.selected[0].ID } });
  };


  displayedColumns = ['selectRow', 'Name', 'Description', 'EmailTo', 'InternalUsers', 'ExternalContact', 'Active'];
  displayedColumnsReplace = ['selectRow', 'key_Name', 'Description', 'key_EmailTo', 'Internal Users', 'External Contact', 'key_Active'];
  dataSource;
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }
  filterValue: string;
  async applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.GetAllAlertsData();
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
    this.GetAllAlertsData();
    this.paginationModel.pageSize = event.pageSize;
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

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.GetAllAlertsData();
    }
  }

  /// De-Active selected rows
  updatetodeactive() {   
    var selectedIDs = '';

    if (this.selection.selected.length == 0) {
      this.toster.info("Please select at least one record");
      return false;
    }

    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.ID.toString()+',';
    });

    this.services.UpdateUserAlertStatus(selectedIDs, false).subscribe(result => {
      if (result.message == "Success" || result.Message == "Success") {
        this.GetAllAlertsData();
        this.toster.success("Records saved successfully.");
      }
      else {
        this.toster.warning("An error occurred during this operation. Please contact Tech Support");
      }
    }, error => {
        this.toster.error("Records saved successfully.");
    });
  }

  /// Active selected rows
  updatetoactive() {

    var selectedIDs = '';

    if (this.selection.selected.length == 0) {
      this.toster.info("Please select at least one record");
      return false;
    }

    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.ID.toString() + ',';
    });

    this.services.UpdateUserAlertStatus(selectedIDs, true).subscribe(result => {
      if (result.message == "Success" || result.Message == "Success") {
        this.GetAllAlertsData();
        this.toster.success("Records saved successfully.");
      }
      else {
        this.toster.warning("An error occurred during this operation. Please contact Tech Support");
      }
    }, error => {
      this.toster.error("Records saved successfully.");
    });
  }

  async getPageSize() {
 
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.services.GetAllAlertListForMainPage(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;

      });

    this.paginationModel.pageSize = await this.services.getDefaultPageSize();
  }
  getDefaultPageSize() {
    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.paginationModel.pageSize = Number(result.data.preferenceValue);
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
        this.paginationModel.sortColumn = 'UpdateDateTimeServer';
        this.paginationModel.sortOrder = 'Desc';
        this.GetAllAlertsData();
      });
  }
  index: any;
  
  GetAllAlertsData() {
    //this.paginationModel.pageNo = 1;
    //this.paginationModel.pageSize = 100;
    this.index = [];
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.services.GetAllAlertListForMainPage(this.paginationModel).subscribe(result => {
      //this.dataSource = result.data;
      ELEMENT_DATA = [];
      if (result.data != null) {
        result.data.forEach((value, index) => {
          ELEMENT_DATA.push({ ID: value.id, Name: value.name, Description: value.description, EmailTo: value.emailTo, InternalUsers: value.internalUsers, ExternalContact: value.externalContact, Active: value.active })
        })

        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        //this.paginator.pageSizeOptions = [10, 20, 30, 40, 50];
        //this.paginator.pageSize = 40;
        //this.paginator.showFirstLastButtons = true;
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;

        //ELEMENT_DATA = result.data;
        //this.paginator.showFirstLastButtons = true;
        //this.setRowSelection();
      }
      else {
        this.dataSource = [];
      }
    });
  }
  RemoveSelectedUserAlerts() {

    var selectedIDs = '';

    if (this.selection.selected.length == 0) {
      this.toster.info("Please select at least one record");
      return false;
    }

    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.ID.toString() + ',';
    });

    this.services.RemoveUsersAlerts(selectedIDs).subscribe(result => {
      if (result.message == "Success" || result.Message == "Success") {
        this.GetAllAlertsData();
        this.toster.success("Records saved successfully.");
      }
      else {
        this.toster.warning("An error occurred during this operation. Please contact Tech Support");
      }
    }, error => {
      this.toster.error("Records saved successfully.");
    });
  }

  EncryptUserAlertID(id: any) {
    var saltKey = "eyEic";
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(id), saltKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  RefreshScreen() {
    this.GetAllAlertsData();
  }
 
  ExportCSV() {
    
    var today = new Date();
    var day = today.getDate() + "";
    var month = (today.getMonth() + 1) + "";
    var year = today.getFullYear() + "";
    var hour = today.getHours() + "";
    var minutes = today.getMinutes() + "";
    var seconds = today.getSeconds() + "";

    var fileName = "AlertData_" + day + month + year + hour + minutes + seconds;

    this.dataSource.connect().subscribe(d => this.csvData = d);
    this.csvService.downloadFile(this.csvData, ['Name', 'Description', 'EmailTo', 'InternalUsers', 'ExternalContact', 'Active'], fileName);
  }

  openAlertView() {

    this.toster.info("This page is under construction");
  }

  

}//export-class end



export interface PeriodicElement {
  ID: number;
  Name: string;
  Description: string;
  EmailTo: string;
  InternalUsers: string;
  ExternalContact: string;
  Active: string;
}

//const ELEMENT_DATA: PeriodicElement[] = [
//  { Name: 'Alert For Load File Issue', Description: 'Receive a notification when load file processing fails.', EmailTo: 'alert@osoftec.com', InternalUsers: '', ExternalContact: '', Active: 'true' },
//  { Name: 'Alert For Load File Issue', Description: 'Critical Missing Setup Data', EmailTo: 'alert@osoftec.com', InternalUsers: '', ExternalContact: '', Active: 'true' },
//  { Name: 'Alert For Load File Issue', Description: 'Critical Missing Setup Data', EmailTo: 'alert@osoftec.com', InternalUsers: '', ExternalContact: '', Active: 'true' },
//  { Name: 'User Account Request - To Admin', Description: 'Critical Missing Setup Data', EmailTo: 'alert@osoftec.com', InternalUsers: '', ExternalContact: '', Active: 'true' },
//  { Name: 'User Account Request - To Admin', Description: 'Critical Missing Setup Data', EmailTo: 'alert@osoftec.com', InternalUsers: '', ExternalContact: '', Active: 'true' },
// { Name: 'User Account Request - To Admin', Description: 'Critical Missing Setup Data', EmailTo: 'alert@osoftec.com', InternalUsers: '', ExternalContact: '', Active: 'true' },
//];

var ELEMENT_DATA: PeriodicElement[] = [];
