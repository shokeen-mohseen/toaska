import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { Geolocation } from './models/geolocation';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { GeolocationService } from './services/geolocation.service';
import { CommodityService } from '../../../core/services/commodity.service';
import { AuthService } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.css']
})
export class GeoLocationComponent implements OnInit, AfterViewInit {
  filterValue = ""; iDs: string; DefaultCount: any; dataList: string; selectRow: string;
  ItemList: any[]; dataSource: MatTableDataSource<Geolocation>;
  selection = new SelectionModel<Geolocation>(true, []);
  geolocationObj = new Geolocation();
  displayedColumns = ['selectRow', 'countryName', 'stateName', 'cityName', 'zipCode'];
  displayedColumnsReplace = ['selectRow', 'key_Country', 'key_State', 'key_City', 'key_Zipcode'];
  isAllSelected: boolean = false;
  ModuleRolePermission: boolean = false;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  modalRef: NgbModalRef;
  addPage: boolean = false;
  editPage: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.GetGeolocationListData();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.GetGeolocationListData();
    }
  }

  constructor(private router: Router, private geolocationService: GeolocationService, private commodityService: CommodityService, private auth: AuthService, private toastr: ToastrService, public modalService: NgbModal) { }

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
    else if ($event.index === 2) {
      this.tab3Data = true;
    }
  }

  actionHandler(type) {
    if (type === "add") {

      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;
      this.addPage = true;
      this.editPage = false;

    }
    //else if (type === "edit") {

    //  this.tab1 = true;
    //  this.tab2 = false;
    //  this.tab3 = true;
    //  this.tabGroup.selectedIndex = 1;
    //  this.tab3Data = true;
    //  this.tab2Data = false;
    //  this.tab1Data = false;
    //  this.addPage = false;
    //  this.editPage = true;

    //}
  }

  closeTab() {

    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;

  }

  IsTosca: boolean;

  async ngOnInit() {
    this.iDs = '';
    this.buttonPermission();
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
    
    this.dataSource = new MatTableDataSource<Geolocation>();

    this.selectRow = 'selectRow';
    this.ItemList = new Array<any>();
    await this.getPageSize();
    this.GetGeolocationListData();
    this.paginator.showFirstLastButtons = true;
  }


  async getPageSize() {
    debugger;
    this.geolocationObj.clientId = this.auth.currentUserValue.ClientId;
    this.geolocationObj.pageSize = 0;
    await this.geolocationService.GetGeolocationList(this.geolocationObj).toPromise()
      .then(result => {
        this.geolocationObj.itemsLength = result.data.length;
      });
    // default page size
    this.geolocationObj.pageSize = await this.geolocationService.getDefaultPageSize();
    this.geolocationObj.pageSizeOptions.push(this.geolocationObj.pageSize);
  }


  GetGeolocationListData() {
    this.selection.clear();
    this.geolocationObj.sortOrder = "desc";
    this.geolocationObj.filterOn = this.filterValue;
    this.geolocationObj.clientId = this.auth.currentUserValue.ClientId;
    this.geolocationService.GetGeolocationList(this.geolocationObj).subscribe(result => {
      this.dataSource.data = result.data;

    });
  }

  ngAfterViewInit() {
    this.btnBar.hideAction('edit');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
    this.paginator.showFirstLastButtons = true; 
  }

  rowItemList: any = [];
  async setSelectedRows() {

    this.rowItemList = [];

    this.iDs = ""; let items: any = [];

    this.dataSource.data.filter(row => {
      if (row.isSelected == true) {
        items.push(row)
        this.rowItemList.push(row);
      }
    });

    if (items.length > 0) {

      this.DefaultCount = await this.commodityService.getMaxEditedRecordsCount();
      items = items.slice(0, this.DefaultCount);

      items.filter(row => {

        this.iDs += `${row.id},`;

      })

      if (this.iDs.length > 0) {
        this.iDs = this.iDs.substring(0, this.iDs.length - 1);
        //this.operatingLocationSessionService.SetSessionIds(this.iDs);

      }
      else {
        //this.operatingLocationSessionService.SetSessionIds(null);
      }

      //this.EnableDisableButton(false);
      //this.ActiveButtonDisable();
      //this.InActiveButtonDisable();
      //this.BothActiveInactiveButtonDisable();
      //this.operatingLocationSessionService.IsEditableRights(this.ModuleRolePermission);
     
    }
    else {
      //this.EnableDisableButton(true);
      //this.operatingLocationSessionService.IsEditableRights(this.ModuleRolePermission);
      

    }
  }
  selectedCheckbox(e: any, selectedData) {
    this.dataSource.data.forEach(row => {
      if (row.id == selectedData.id)
        row.isSelected = !selectedData.isSelected;
    });

    this.isAllSelected = (this.dataSource.data.length === (this.dataSource.data.filter(x => x.isSelected == true).length));

    //this.setPhysicianCheckBoxData();
    this.setSelectedRows();

  }
  // serve side pagination
  onPaginationEvent(event) {
    this.filterValue = "";
    this.geolocationObj.pageNo = event.pageIndex + 1;
    this.geolocationObj.pageSize = event.pageSize;
    //this.getPageSize()
    this.GetGeolocationListData();
  }

  // custom sorting 
  customSort(event) {
    this.geolocationObj.sortColumn = event.active;
    this.geolocationObj.sortOrder = event.direction.toLocaleUpperCase();
    this.GetGeolocationListData();
  }

  getClass(row: any): string {

    let rowcss = "";

    if (row.isSelected) {
      rowcss = "activeRow";
    }
    else {
      rowcss = "";
    }

    if (!row.isSelected) {

      if (!row.isActive) {
        rowcss = rowcss + " " + "snactive"
      }

      //if (row.updatedBy == 'Interface') {
      //  rowcss = rowcss + " " + "1snactive";
      //}
    }

    return rowcss;

  }

  EnableDisableButton(isEnable: boolean) {
    //this.btnBar.enableAction('add');
    if (isEnable) {
      this.btnBar.disableAction('edit');
      this.btnBar.disableAction('delete');
      this.btnBar.disableAction('active');
      this.btnBar.disableAction('inactive');
      if (this.iDs.length > 0) {
        this.btnBar.enableAction('edit');
      }
      else {
        this.btnBar.disableAction('edit');
      }
    }
    else {
      if (this.iDs.length > 0) {
        this.btnBar.enableAction('edit');
      }
      else {
        this.btnBar.disableAction('edit');
      }
      if (this.ModuleRolePermission && this.iDs.length > 0) {
        this.btnBar.enableAction('edit');
        this.btnBar.disableAction('delete');
        //this.btnBar.enableAction('active');
        //this.btnBar.enableAction('inactive');
      }
    }
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.auth.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    this.auth.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;

          if (data != null) {
            if (data != undefined) {
              if (data.length > 0) {

                this.iDs = '';
                if (data[0].PermissionType == "Read and Modify") {
                  this.ModuleRolePermission = true;
                  this.EnableDisableButton(false);
               

                }
                else {
                  this.ModuleRolePermission = false;
                  this.EnableDisableButton(true);
                 
                }

              }
              else {
                //this.router.navigate(['/manage-partograph/new-partograph/registration']);
                this.router.navigate(['/unauthorised']);
                this.ModuleRolePermission = false;
                
              }
            }
            else {
              this.router.navigate(['/unauthorised']);
              this.ModuleRolePermission = false;
              this.ModuleRolePermission = false;
              
            }
          }
          else {
            this.ModuleRolePermission = false;

          }
        }
      });

  }
}


