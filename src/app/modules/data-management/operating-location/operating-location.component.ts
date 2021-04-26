import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { IssueComponent } from '../../../shared/components/issue/issue.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { MatTableDataSource } from '@angular/material/table';
import { OperatingLocation, OperatingLocation2 } from '../operating-location-detail/model/operating-location';
import { SelectionModel } from '@angular/cdk/collections';
import { OperatingLocationService } from '../operating-location-detail/services/operating-location.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core';
import { CommodityService } from '../../../core/services/commodity.service';
import { OperatingLocationSessionService } from '../operating-location-detail/services/hospital-sendnotification.service';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { MatPaginator } from '@angular/material/paginator';
//import { ResizeEvent } from 'angular-resizable-element';
import { ConfirmDeleteTabledataPopupComponent } from '../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
@Component({
  selector: 'app-operating-location',
  templateUrl: './operating-location.component.html',
  styleUrls: ['./operating-location.component.css']
})
export class OperatingLocationComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  isAllSelected: boolean = false; locationModel2 = new OperatingLocation2();
  operatingLocation: OperatingLocation = new OperatingLocation();
  OpratingLocationList: string = "OPExport";
  editSelectedId: Number = 0;
  List: OperatingLocation[] = [];
  datamodel: OperatingLocation[] = [];
  displayedColumns = ['selectRow', 'locationFunction', 'groupName', 'billingName', 'locationDescription', 'cityName', 'masInventoryWarehouse', 'isActive', 'setupComplete', 'setupCompletedDateTime', 'updatedBy'];
  displayedColumnsReplace = ['selectRow', 'key_Function', 'key_Group', 'key_BillingEntity', 'key_Locationname', 'key_Citystate', 'key_MASInventoryWarehouse', 'key_Status', 'key_SetupDone', 'key_Setupdate', 'key_Lastupdated'];
  dataSource = new MatTableDataSource<OperatingLocation>();
  selection = new SelectionModel<OperatingLocation>(true, []);
  filterValue = "";
  iDs: string;
  DefaultCount: any;
  dataList: string;
  selectRow: string;
  ItemList: any[];

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
  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.operatingLocation.filterOn = this.filterValue;
    await this.getPageSize();
    this.GetOperatingLocationData();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.GetOperatingLocationData();
    }
  }


  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
      // this.tab2Data = false;
      // this.tab3Data = false;
    }
    else if ($event.index === 1) {
      // this.tab1Data = false;
      this.tab2Data = true;
      // this.tab3Data = false;
    }
    else if ($event.index === 2) {
      // this.tab1Data = false;
      // this.tab2Data = false;
      this.tab3Data = true;
    }
  }
  ngAfterViewInit(): void {
    if (this.IsTosca) {

      this.btnBar.disableAction('add')
      this.btnBar.hideTab('key_View');

    }
    if (this.selection.select.length > 0) {
      this.EnableDisableButton(true);
    }
    else {
      this.EnableDisableButton(false);
    }

    this.paginator.showFirstLastButtons = true;
    this.btnBar.disableAction('delete');
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

    } else if (type === "edit") {

      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 1;
      this.tab3Data = true;
      this.tab2Data = false;
      this.tab1Data = false;
    }
    else if (type === "active") {
      //console.log("Active");
      this.activatepatient();
    }
    else if (type === "inactive") {
      //console.log("Inactive");
      this.deactivatepatient();
    }
  }

  closeTab() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.iDs = '';
    this.EnableDisableButton(false);
    //await this.getPageSize();
    this.operatingLocation.sortOrder = "ASC";
    this.GetOperatingLocationData();

    //this.GetOperatingLocationData();
    //this.selection.clear();    
  }
  modalRef: NgbModalRef;
  IsTosca: boolean;
  constructor(private operatingLocationSessionService: OperatingLocationSessionService, private commodityService: CommodityService, private auth: AuthService, private toastr: ToastrService,
    private operattingLocationService: OperatingLocationService,
    private router: Router, public modalService: NgbModal) { }

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
    this.dataSource = new MatTableDataSource<OperatingLocation>();

    this.selectRow = 'selectRow';
    this.ItemList = new Array<any>();
    await this.getPageSize();
    this.GetOperatingLocationData();
    if (this.selection.select.length === 0) {
      this.EnableDisableButton(false);
    }
  }

  getdata() {
    this.operatingLocation.filterOn = this.filterValue;
    this.selection.clear();
    this.datamodel.push(Object.assign({}, this.operatingLocation));
    this.isAllSelected = false;
    this.operattingLocationService.GetOpeartingLocationList(this.operatingLocation).subscribe(
      result => {
        this.dataSource.data = result.data;
      });
  }

  GetOperatingLocationData() {
    this.selection.clear();
    this.operatingLocation.filterOn = this.filterValue;
    this.operatingLocation.ClientId = this.auth.currentUserValue.ClientId;
    this.operattingLocationService.GetOpeartingLocationList(this.operatingLocation).subscribe(result => {
      this.dataSource.data = result.data;
    });
  }

  getdataOnLoad() {
    this.operatingLocation.filterOn = this.filterValue;
    this.selection.clear();
    this.datamodel.push(Object.assign({}, this.operatingLocation));
    this.isAllSelected = false;
    this.operatingLocation.sortOrder = "ASC";
    this.operatingLocation.ClientId = this.auth.currentUserValue.ClientId;
    this.operattingLocationService.GetOpeartingLocationList(this.operatingLocation).subscribe(
      result => {

        this.dataSource.data = result.data;
        //this.operatingLocation.itemsLength = result.data.length
        //console.log(this.dataSource.data)
      });
  }
  private Data(): OperatingLocation2 {
    this.locationModel2.ClientId = this.auth.currentUserValue.ClientId;
    this.locationModel2.id = 0;
    this.locationModel2.BillingName = "";
    this.locationModel2.LocationDescription = "";
    //this.locationModel2.cityCode = "";
    this.locationModel2.StateName = "";
    this.locationModel2.StateName = "";
    this.locationModel2.CityName = "";
    this.locationModel2.BillingName = "";
    //this.locationModel2.isSelected = false;
    this.locationModel2.LocationFunction = "";
    //this.locationModel2.isActive = true;
    return this.locationModel2;
  }


  //getPageSize() {

  //  this.selection.clear();
  //  this.locationModel2 = this.Data();
  //  this.operattingLocationService.GetOpeartingLocationList2(this.locationModel2).subscribe(
  //    result => {
  //      this.List = result.data;

  //      this.operatingLocation.itemsLength = this.List.length;
  //      console.log(this.operatingLocation.itemsLength)
  //      //this.dataSource.data = result.data;

  //    });
  //}

  async getPageSize() {
    //this.locationModel2 = this.Data();
    this.operatingLocation.ClientId = this.auth.currentUserValue.ClientId;
    this.operatingLocation.pageNo = 0;
    this.operatingLocation.pageSize = 0;
    await this.operattingLocationService.GetOpeartingLocationList(this.operatingLocation).toPromise()
      .then(result => {
        this.operatingLocation.itemsLength = result.recordCount;
      });
    // default page size
    this.operatingLocation.pageSize = await this.operattingLocationService.getDefaultPageSize();
    this.paginator.pageIndex = 0;
    //this.operatingLocation.pageSizeOptions.push(this.operatingLocation.pageSize);
  }

  //async getPageSize() {
  //  this.operatingLocation = new OperatingLocation();
  //  this.operatingLocation.ClientId = this.auth.currentUserValue.ClientId;
  //  this.operatingLocation.pageSize = 0;
  //  await this.operattingLocationService.GetOpeartingLocationList2(this.locationModel2).toPromise()
  //    .then(result => {
  //      this.List = result.data;
  //      this.operatingLocation.itemsLength = result.recordCount;
  //    });
  //  // default page size
  //  this.operatingLocation.pageSize = await this.operattingLocationService.getDefaultPageSize();
  //  this.operatingLocation.pageSizeOptions.push(this.operatingLocation.pageSize);
  //}

  openissue() {
    this.modalRef = this.modalService.open(IssueComponent, { size: 'xl', backdrop: 'static' });
  }

  EnableDisableButton(isEnable: boolean) {
    //this.btnBar.enableAction('add');
    if (isEnable) {
      this.btnBar.disableAction('edit');
      //this.btnBar.disableAction('delete');
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
      if (this.selection.select.length > 0) {
        this.btnBar.enableAction('edit');
      }
      else {
        this.btnBar.disableAction('edit');
      }
      if (this.ModuleRolePermission && this.iDs.length > 0) {
        //if (this.selection.select.length > 0) {
        this.btnBar.enableAction('edit');
        //this.btnBar.disableAction('delete');
        this.btnBar.enableAction('active');
        this.btnBar.enableAction('inactive');
        //}        
      }
      else if (this.iDs.length > 0) {
        this.btnBar.enableAction('edit');
      }
    }
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
  selectAll(check: any) {

    this.isAllSelected = check.checked;
    this.dataSource.data.forEach(row => {
      // console.log(this.isPhysicianAllSelected)
      row.isSelected = this.isAllSelected;
      // console.log(row)
    });

    // console.log(this.dataSource.data)
    this.setSelectedRows();
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
    //if (this.ModuleRolePermission) {
    if (items.length > 0) {

      this.DefaultCount = await this.operattingLocationService.getMaxEditedRecordsCount();
      items = items.slice(0, this.DefaultCount);

      items.filter(row => {

        this.iDs += `${row.locationId},`;

      })

      if (this.iDs.length > 0) {
        this.iDs = this.iDs.substring(0, this.iDs.length - 1);
        this.operatingLocationSessionService.SetSessionIds(this.iDs);

      }
      else {
        this.operatingLocationSessionService.SetSessionIds(null);
      }

      this.EnableDisableButton(false);
      this.ActiveButtonDisable();
      this.InActiveButtonDisable();
      this.BothActiveInactiveButtonDisable();
      this.operatingLocationSessionService.IsEditableRights(this.ModuleRolePermission);
      //this.changingPatientValue.next(iDs);
      //localStorage.setItem("AddedPatientList", iDs);
      //this.patientinformationservice.getpatientsetuplist(iDs);
    }
    else {
      this.EnableDisableButton(true);
      this.operatingLocationSessionService.IsEditableRights(this.ModuleRolePermission);
      //this.changingPatientValue.next(null);
      // localStorage.removeItem("AddedPatientList");

    }
    //}
    //else {
    //  if (items.length > 0) {
    //    this.EnableDisableButton(false);
    //  }
    //}
  }
  selectedCheckbox(e: any, selectedData) {
    this.dataSource.data.forEach(row => {
      if (row.locationId == selectedData.locationId)
        row.isSelected = !selectedData.isSelected;
    });

    this.isAllSelected = (this.dataSource.data.length === (this.dataSource.data.filter(x => x.isSelected == true).length));

    //this.setPhysicianCheckBoxData();
    this.setSelectedRows();
    this.IsEditPage = false;
  }
  // serve side pagination
  onPaginationEvent(event) {
    this.operatingLocation.filterOn = this.filterValue;
    this.operatingLocation.pageNo = event.pageIndex + 1;
    if (this.operatingLocation.pageNo > this.operatingLocation.itemsLength / event.pageSize) {
      this.operatingLocation.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.operatingLocation.pageSize = event.pageSize;
    }
    this.GetOperatingLocationData();
    this.operatingLocation.pageSize = event.pageSize;
  }

  // custom sorting 
  customSort(event) {
    if (event.active != 'selectRow') {
      this.operatingLocation.sortColumn = event.active;
      this.operatingLocation.sortOrder = event.direction.toLocaleUpperCase();
      this.GetOperatingLocationData();
    }
  }

  // activate record
  activatepatient() {
    if (this.IsEditPage) {
      this.iDs = String(this.editSelectedId);
    }
    if (this.iDs.length - 1 < 0) {
      this.toastr.warning(GlobalConstants.OperatingLocation_SelectActive);
    } else {


      this.dataList = ('{"IDs": "' + this.iDs + '", "isActive":true }');

      this.operattingLocationService.activateanddeactivateHospitalsetupList(this.dataList).subscribe(x => {

        this.toastr.success(GlobalConstants.OperatingLocation_Active);
        this.getPageSize();
        this.getdataOnLoad()
        this.btnBar.disableAction('active');
        this.btnBar.enableAction('inactive');
      });
    }
  }


  setActiveInactive(value: any) {
    if (value) {
      this.btnBar.disableAction('active');
      this.btnBar.enableAction('inactive');
    } else {
      this.btnBar.disableAction('inactive');
      this.btnBar.enableAction('active');
    }
  }

  // Active and inactive button addd
  BothActiveInactiveButtonDisable() {
    if (this.ModuleRolePermission) {
      var activecheck = false; var deactivecheck = false;

      this.rowItemList.forEach(row => {

        if (row.isSelected) {
          if (row.isActive) {
            activecheck = true;
          }
          if (!row.isActive) {
            deactivecheck = true;
          }


        }
      });

      if (activecheck && deactivecheck) {
        this.btnBar.disableAction('active');
        this.btnBar.disableAction('inactive');
        // this.toastr.warning("Only Inactive record can be selected.");
        return;
      }
    }
  }

  ActiveButtonDisable() {
    if (this.ModuleRolePermission) {
      var activecheck = false;

      this.rowItemList.forEach(row => {

        if (row.isSelected) {
          if (row.isActive) {
            activecheck = true;
          }

        }
      });

      if (activecheck) {
        this.btnBar.disableAction('active');
        this.btnBar.enableAction('inactive');
        // this.toastr.warning("Only Inactive record can be selected.");
        return;
      }
    }
  }
  IsEditPage: boolean = false;
  setIsPageEdit(value: any) {
    if (value == 1) {
      this.IsEditPage = true;
    }
    //else if (value == 2) {
    //  this.IsEditPage = false;
    //}
  }

  InActiveButtonDisable() {
    if (this.ModuleRolePermission) {
      var activecheck = false;

      this.rowItemList.forEach(row => {

        if (row.isSelected) {
          if (!row.isActive) {
            activecheck = true;
          }

        }
      });

      if (activecheck) {
        this.btnBar.enableAction('active');
        this.btnBar.disableAction('inactive');
        //this.toastr.warning("Only Active record can be selected.");
        return;
      }
    }
  }
  setEditSelectedId(value: any) {
    this.editSelectedId = Number(value);
  }
  // deactivate record
  deactivatepatient() {
    if (this.IsEditPage) {
      this.iDs = String(this.editSelectedId);
    }

    if (this.iDs.length - 1 < 0) {
      this.toastr.warning(GlobalConstants.OperatingLocation_SelectInActive);
    }
    else {

      this.dataList = ('{"IDs": "' + this.iDs + '", "isActive":false }');


      //this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      //this.modalRef.result.then((result) => {

      this.operattingLocationService.activateanddeactivateHospitalsetupList(this.dataList).subscribe(x => {

        this.toastr.success(GlobalConstants.OperatingLocation_InActive);
        this.getPageSize();
        this.getdataOnLoad()
        this.btnBar.disableAction('inactive');
        this.btnBar.enableAction('active');

        //});

        //}, (reason) => {
      })
    }

  }
  // Moule role permission

  ModuleRolePermission: boolean = false;

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.auth.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.auth.currentUserValue.UserId;
    this.auth.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;

          if (data != null) {
            if (data != undefined) {
              if (data.length > 0) {

                this.iDs = '';
                if (data[0].PermissionType == "Read and Modify") {
                  this.ModuleRolePermission = true;
                  // this.EnableDisableButton(false);
                  this.btnBar.disableAction('add');
                  this.btnBar.enableAction('edit');
                  //this.btnBar.enableAction('delete');
                  this.btnBar.enableAction('active');
                  this.btnBar.enableAction('inactive');

                  this.operattingLocationService.Permission = true;
                }
                else {
                  this.ModuleRolePermission = false;
                  // this.EnableDisableButton(true);
                  this.btnBar.disableAction('add');
                  //this.btnBar.disableAction('edit');
                  //this.btnBar.disableAction('delete');
                  this.btnBar.disableAction('active');
                  this.btnBar.disableAction('inactive');

                  this.operattingLocationService.Permission = false;
                }

              }
              else {
                //this.router.navigate(['/manage-partograph/new-partograph/registration']);
                this.router.navigate(['/unauthorized']);
                this.ModuleRolePermission = false;
                //this.btnBar.disableAction('add');
                //this.btnBar.disableAction('edit');
                //this.btnBar.disableAction('delete');
                //this.btnBar.disableAction('active');
                //this.btnBar.disableAction('inactive');
              }
            }
            else {
              this.router.navigate(['/unauthorized']);
              this.ModuleRolePermission = false;

              //this.btnBar.disableAction('add');
              //this.btnBar.disableAction('edit');
              //this.btnBar.disableAction('delete');
              //this.btnBar.disableAction('active');
              //this.btnBar.disableAction('inactive');
            }
          }
          else {
            this.ModuleRolePermission = false;
            this.router.navigate(['/unauthorized']);
            //this.btnBar.disableAction('add');
            //this.btnBar.disableAction('edit');
            //this.btnBar.disableAction('delete');
            //this.btnBar.disableAction('active');
            //this.btnBar.disableAction('inactive');
          }
        }
      });

  }
}
