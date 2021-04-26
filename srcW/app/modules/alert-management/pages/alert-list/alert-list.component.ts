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
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.css']
})
export class AlertListComponent implements OnInit {

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

  csvData: any;
  selectedEditID: number;
  
  selectRow: any;

  constructor(private csvService: CsvService,private toster: ToastrService,private router: Router, private services: AlertManagementService) { this.GetAllAlertsData();}

  ngOnInit(): void {
    this.selectRow = 'selectRow';
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
      this.toster.warning("Please select atleast record.");
      return false;
    }

    this.selectedEditID = Number(this.selection.selected[0].ID);

    return true;
    //var idEncrypted = this.EncryptUserAlertID(this.selection.selected[0].ID);
    //this.router.navigate(['/alert-management/edit-alert'],
    //  { queryParams: { id: this.selection.selected[0].ID } });
  };


  displayedColumns = ['selectRow', 'Name', 'Description', 'EmailTo', 'InternalUsers', 'ExternalContact', 'Active'];
  displayedColumnsReplace = ['selectRow', 'key_Name', 'Description', 'key_EmailTo', 'Internal Users', 'External Contact', 'Action'];
  dataSource;
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    
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

  GetAllAlertsData() { 
    this.services.GetAllAlertListForMainPage(1, 100).subscribe(result => {
      ELEMENT_DATA = [];
      if (result.message == "Success") {
        result.data.forEach((value, index) => {
          ELEMENT_DATA.push({ID:value.id, Name: value.name, Description: value.description, EmailTo: value.emailTO, InternalUsers: value.internalUsers, ExternalContact: value.externalContact, Active: value.active })
        })

        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.paginator.pageSizeOptions = [10,50,100,200,500];
        this.paginator.pageSize = 10;
        this.paginator.showFirstLastButtons = true;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        //ELEMENT_DATA = result.data;
      }
    });
  }

  /// De-Active selected rows
  updatetodeactive() {   
    var selectedIDs = '';

    if (this.selection.selected.length == 0) {
      this.toster.info("Please select at least one record.");
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
        this.toster.warning("Something went wrong.");
      }
    }, error => {
        this.toster.error("Records saved successfully.");
    });
  }

  /// Active selected rows
  updatetoactive() {

    var selectedIDs = '';

    if (this.selection.selected.length == 0) {
      this.toster.info("Please select at least one record.");
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
        this.toster.warning("Something went wrong.");
      }
    }, error => {
      this.toster.error("Records saved successfully.");
    });
  }


  RemoveSelectedUserAlerts() {

    var selectedIDs = '';

    if (this.selection.selected.length == 0) {
      this.toster.info("Please select at least one record.");
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
        this.toster.warning("Something went wrong.");
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
