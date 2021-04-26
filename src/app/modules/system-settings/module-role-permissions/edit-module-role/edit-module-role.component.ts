import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { moduleRole, modulePermission } from '../model/send-object';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { FormBuilder, NgForm } from '@angular/forms';
import { ModuleRolePermissionService } from '../services/modulerolepermission.services';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core';
import { CsvService } from '@app/core/services/csvconverter.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';

@Component({
  selector: 'app-edit-module-role',
  templateUrl: './edit-module-role.component.html',
  styleUrls: ['./edit-module-role.component.css']
})
export class EditModuleRoleComponent implements OnInit {

  csvData: any;
  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns = ['Module', 'Role', 'Permission'];
  dataSource;// = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  sendobject: modulePermission = new modulePermission();
  radioSelected: string;
  next: number = 0;

  ModuleViewModel: moduleRole = new moduleRole();

  @Input() modulesToEdit: moduleRole[];
  @Output('checkBoxClick') checkBoxClick = new EventEmitter<any>();

  selectedDatasources: moduleRole;

  //applyFilter(filterValue: string) {
  //  filterValue = filterValue.trim(); // Remove whitespace
  //  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //  this.dataSource.filter = filterValue;
  //}

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

  modalRef: NgbModalRef;
  selectedPosition = 0;
  index: number = 0;
  isLinear = false;
  ModulePermissionID: number;
  public modulevalue: any;
  public rolevalue: any;
  public PermissionTypeList: any;
  public permissionTypeId: any;
  public permissionTypeName: any;
  public ModuleID: number;
  public countId: number;
  ItemList: moduleRole[];
  constructor(private actRoute: ActivatedRoute, private csvService: CsvService, public router: Router, public modalService: NgbModal, private modulerolePermission: ModuleRolePermissionService, private toastService: ToastrService, private authService: AuthService) {
    this.modulevalue = null;
    this.rolevalue = null;
    this.permissionTypeId = null;
    this.countId = 0;
  }
  GridData = [];
  Data = [];
  ModuleList = [];
  RolesList = [];
  apply: boolean;
  editnext: boolean;
  selectedItemsA = [];
  settingsA = {};
  
  selectedItemsB: any[] = [];
  settingsB = {};

  public exampleData: Array<Select2OptionData>;
  public options: Options;
  public value: string;
  count = 3;


  async ngOnInit() {
    this.apply = true;
    if (this.modulesToEdit.length <= 1) {
      this.editnext = true;
    }
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    await this.setModulesToEdit();
    this.ModuleViewModel = this.modulesToEdit[this.selectedPosition];
    this.ModuleID = this.ModuleViewModel.ID;
    this.ApplicationModule();
    this.RoleList();
    this.PermissionList();
    this.FillGrid();
    this.radioSelected = this.ModuleViewModel.Permission;
  }
  ngOnDestroy(): void {
    this.modulesToEdit.length = 0;
  }
  onAddItemA(data: string) {

    this.count++;
    this.ModuleList.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {

    this.count++;
    this.RolesList.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    this.modulevalue = this.selectedItemsA.map(({ id }) => id);
    this.rolevalue = this.selectedItemsB.map(({ id }) => id);
  }
  OnItemDeSelect(item: any) {
    this.modulevalue = this.selectedItemsA.map(({ id }) => id);
    this.rolevalue = this.selectedItemsB.map(({ id }) => id);
  }
  onSelectAll(items: any) {
    this.modulevalue = this.selectedItemsA.map(({ id }) => id);
    this.rolevalue = this.selectedItemsB.map(({ id }) => id);
  }
  onDeSelectAll(items: any) {
    this.modulevalue = this.selectedItemsA.map(({ id }) => id);
    this.rolevalue = this.selectedItemsB.map(({ id }) => id);
  }
  selectPemission(event) {
    this.apply = false;
    this.permissionTypeId = event.target.value;
  }


  Remove(index: number) {
    this.modulesToEdit.splice(index, 1);
    this.checkBoxClick.emit(this.modulesToEdit);

  }

  selected(index: number) {
    this.next = index;
    this.setModuleDetails(this.next);
  }

  async setModulesToEdit() {
    var defaultCount = await this.modulerolePermission.getMaxEditedRecordsCount();
    this.modulesToEdit = this.modulesToEdit.slice(0, defaultCount);
    this.checkBoxClick.emit(this.modulesToEdit);
  }

  selectNext() {
    if ((this.Data.length == 0)&&(this.apply==false)) {
      this.toastService.error("Please click Apply to select data.");
      return false;
    }
    if (this.Data.length > 0){

      this.SavedFinal(this.next, this.GridData);
      this.selectedItemsA = null;
      this.selectedItemsB = null;
      // this.GridData.length = 0;
      // this.Data.length = 0;
    }
    if ((this.modulesToEdit.length - 1) > this.next) {

      if (this.modulesToEdit[this.next].ID > 0) {
        this.modulesToEdit[this.next] = this.ModuleViewModel;
      }
      this.next += 1;
      this.setModuleDetails(this.next);
    }

  }

  setModuleDetails(index: number) {
    //if (this.Data.length > 0) {
    //  this.SavedFinal();
    //  this.selectedItemsA = null;
    //  this.selectedItemsB = null;
    //  this.GridData.length = 0;
    //  this.Data.length = 0;
    //}

    this.ModuleViewModel = this.modulesToEdit[this.next];
    this.ModuleID = this.ModuleViewModel.ID;

    this.ApplicationModule();
    this.RoleList();
    this.permissionTypeName = this.ModuleViewModel.Permission;
    this.permissionTypeId = this.PermissionTypeList.filter(f => this.permissionTypeName.includes(f.text)).map(function (a) { return a["id"]; });
    // this.GridData.length = 0;
    this.FillGrid();
  }



  EditRole() {
    if (this.modulevalue == null) {
      this.toastService.error("Please select a module.");
      return false;
    }
    else if (this.rolevalue == null) {
      this.toastService.error("Please select a role.");
      return false;
    }
    else if (this.permissionTypeId == null) {
      this.toastService.error("Please select permission to apply.");
      return false;
    }
    this.GridData.length = 0;
    this.Data.length = 0;
    var id = 0;
    var that = this;
    that.countId = that.countId + 1;
    let model = new modulePermission();
    model.Id = this.ModuleViewModel.ID;
    model.ClientId = this.authService.currentUserValue.ClientId;
    model.ApplicationModuleId = this.modulevalue[0];
    model.RoleId = this.rolevalue[0];
    model.PermissionTypeId = Number(this.permissionTypeId);
    model.UpdatedBy = this.authService.currentUserValue.LoginId;
    model.CreateDateTimeBrowser = new Date(new Date().toISOString());
    this.Data.push(model);
    let grdData = new moduleRole();
    grdData.ID = this.ModuleViewModel.ID;
    grdData.Module = this.selectedItemsA.map(({ itemName }) => itemName)[0];
    grdData.Role = this.selectedItemsB.map(({ itemName }) => itemName)[id];
    that.PermissionTypeList.forEach(function (v) {
      if (v.id == that.permissionTypeId) {
        grdData.Permission = v.text;
      }
    });
    grdData.UpdatedBy = this.authService.currentUserValue.LoginId;
    grdData.UpdateDateTimeServer = new Date(new Date().toISOString());
    this.GridData.push(grdData);
    id++;
    this.FillGrid();
    // this.selectedItemsA = null;
    // this.selectedItemsB = null;
    //this.modulerolePermission.CheckExistPermission(this.Data)
    //  .subscribe(res => {
    //    if (res.Message == "Success") {
    //      if (res.Data == true) {
    //        this.toastService.error("Selected data already exist.");
    //        this.Data.length = 0;
    //        this.GridData.length = 0;
    //        return false;
    //      }
    //      else {
    //        this.FillGrid()
    //        this.selectedItemsB = null;
    //      }
    //    }
    //  });
    //this.rolevalue = null;
    //this.FillGrid();
  }

  FillGrid() {
    var that = this;
    this.ELEMENT_DATA = [];
    if (that.GridData.length > 0) {
      this.GridData.forEach((v) => {
        this.ELEMENT_DATA.push(v);
      });
    }
    else {
      this.ELEMENT_DATA.push(this.ModuleViewModel);
    }
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

    //this.paginator.pageSizeOptions = [40, 100, 200, 500];
    //this.paginator.pageSize = 40;
    //// this.paginator.showFirstLastButtons = true;
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  SavedFinal(index: number, GridData: any) {
    if (this.Data.length == 0) {
      this.toastService.error("Please click Apply to select data.");
      return false;
    }
    this.modulerolePermission.UpdateModuleRolePermission(this.Data)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.toastService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
          var mdata = new moduleRole();
          mdata.ID = Number(GridData.map(({ ID }) => ID));
          mdata.Module = String(GridData.map(({ Module }) => Module));
          mdata.Permission = String(GridData.map(({ Permission }) => Permission));
          mdata.Role = String(GridData.map(({ Role }) => Role));
          var updateddate = String(GridData.map(({ UpdateDateTimeServer }) => UpdateDateTimeServer));
          mdata.UpdateDateTimeServer = new Date(updateddate);
          mdata.UpdatedBy = String(GridData.map(({ UpdatedBy }) => UpdatedBy));
          this.modulesToEdit[index] = mdata;
          this.ModuleViewModel = mdata;
          this.GridData.length = 0;
          this.Data.length = 0;
          // this.FillGrid();
          return true;
        }
        else {
          this.toastService.error("error");
          return false;
        }
      });
  }

  ApplicationModule() {
    var that = this;
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.modulerolePermission.GetModuleList(this.sendobject)
      .subscribe(apm => {
        var modulename = this.ModuleViewModel.Module;
        var datarole = apm.filter(f => modulename.includes(f.itemName));
        that.selectedItemsA = [];
        datarole.forEach(function (v) {
          if (v.itemName === modulename) {
            that.selectedItemsA.push(v);
          }
        });
        this.ModuleList = this.selectedItemsA;
        this.modulevalue = this.selectedItemsA.map(({ id }) => id);
        this.settingsA = {
          singleSelection: true,
          text: "Select",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          searchBy: ['itemName']
        };
      });
  }

  RoleList() {
    var that = this;
    this.modulerolePermission.GetRolesList(this.sendobject)
      .subscribe(res => {
        // this.RolesList = res;
        var modulerole = this.ModuleViewModel.Role.split(',').map(function (item) {
          return item.trim();
        });
        var datarole = res.filter(f => modulerole.includes(f.itemName));
        this.RolesList = res.filter(f => modulerole.includes(f.itemName));
        this.selectedItemsB = [];
        datarole.forEach(function (v) {
          that.selectedItemsB.push(v);
        });
        // this.RolesList = that.selectedItemsB;
        this.rolevalue = that.selectedItemsB.map(({ id }) => id);
        this.settingsB = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          searchBy: ['itemName']
        };

      }
      );
  }

  PermissionList() {
    this.modulerolePermission.GetPermissionTypeList(this.sendobject)
      .subscribe(res => {
        this.PermissionTypeList = res;
        this.permissionTypeName = this.ModuleViewModel.Permission;
        this.permissionTypeId = this.PermissionTypeList.filter(f => this.permissionTypeName.includes(f.text)).map(function (a) { return a["id"]; });
      }
      );
  }

}
export interface PeriodicElement {
  ID: number;
  Module: string;
  Role: string;
  Permission: string;

}
