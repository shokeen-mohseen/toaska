import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModuleRolePermissionService } from '../services/modulerolepermission.services';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core';
import { modulePermission, moduleRole } from '../model/send-object';
import { CsvService } from '@app/core/services/csvconverter.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';



@Component({
  selector: 'app-add-modulerole',
  templateUrl: './add-modulerole.component.html',
  styleUrls: ['./add-modulerole.component.css']
})
export class AddModuleroleComponent implements OnInit {

  csvData: any;
  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns = ['selectRow', 'Module', 'Role', 'Permission'];
  dataSource;// = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  sendobject: modulePermission = new modulePermission();
  ModuleViewModel: moduleRole = new moduleRole();
  isAllSelected: boolean = false;
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    debugger;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  //isAllSelected() {
  //  const numSelected = this.selection.selected.length;
  //  const numRows = this.dataSource.data.length;
  //  return numSelected === numRows;
  //}

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isLinear = false;
  ModulePermissionID: number;
  public modulevalue: any;
  public rolevalue: any;
  public PermissionTypeList: any;
  public permissionTypeId: any;
  public countId: number;
  modalRef: NgbModalRef;
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
  RolesListTemp = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};

  count = 3;

  ngOnInit(): void {
    //this.FillGrid();
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.ItemList = new Array<any>();
    this.ApplicationModule();
    this.RoleList();
    this.PermissionList();
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
    this.FillRole();
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
    this.FillRole();
    this.rolevalue = this.selectedItemsB.map(({ id }) => id);
  }
  selectPemission(event) {
    this.permissionTypeId = event.target.value;
  }
  selectAll(check: any) {
    this.selection.clear();
    this.isAllSelected = check.checked;
    this.dataSource.data.forEach(row => {
      row.IsSeleted = this.isAllSelected;
      this.selection.toggle(row);
      if (check.checked) { this.ItemList.push(row); }
    });
    if (!check.checked) { this.ItemList.length = 0; }
  }

  AddRole() {
    if (this.modulevalue == null || this.modulevalue.length == 0) {
      this.toastService.error("Please select module");
      return false;
    }
    else if (this.rolevalue == null || this.rolevalue.length == 0) {
      this.toastService.error("Please select role");
      return false;
    }
    else if (this.permissionTypeId == null || this.permissionTypeId.length == 0) {
      this.toastService.error("Please select permission");
      return false;
    }
    var id = 0;
    var temData = [];
    var gridTemp = [];
    var that = this;
    this.rolevalue.map(x => {
    
      that.countId = that.countId + 1;
      let model = new modulePermission();
      model.ClientId = this.authService.currentUserValue.ClientId;
      model.ApplicationModuleId = this.modulevalue[0];
      model.RoleId = Number(x);
      model.PermissionTypeId = Number(this.permissionTypeId);
      model.CreatedBy = this.authService.currentUserValue.LoginId;
      model.CreateDateTimeBrowser = new Date(new Date().toISOString());
      model.Index = that.countId;
      temData.push(model);
      let grdData = new moduleRole();
      grdData.ID = (that.countId);
      grdData.Module = this.selectedItemsA.map(({ itemName }) => itemName)[0];
      grdData.Role = this.selectedItemsB.map(({ itemName }) => itemName)[id];
      that.PermissionTypeList.forEach(function (v) {
        if (v.id == that.permissionTypeId) {
          grdData.Permission = v.text;
        }
      });
      grdData.UpdatedBy = this.authService.currentUserValue.LoginId;
      grdData.UpdateDateTimeServer = new Date(new Date().toISOString());
      gridTemp.push(grdData);
      id++;
    });
    this.modulerolePermission.CheckExistPermission(temData)
      .subscribe(res => {
        if (res.Message == "Success") {
          if (res.Data == true) {
            this.toastService.error("Selected data already exist.");
            temData.length = 0;
            gridTemp.length = 0;
            return false;
          }
          else {
            temData.forEach(function (v) {
              that.Data.push(v);
            });
            gridTemp.forEach(function (s) {
              that.GridData.push(s);
            });
            this.FillGrid()
            this.selectedItemsA.length = 0;
            this.selectedItemsB.length = 0;
            this.permissionTypeId = null;
          }
        }
      });
    this.selectedItemsA.length = 0;
    this.selectedItemsB.length = 0;
    this.permissionTypeId = null;
    this.PermissionList();
  }
  FillRole() {
   // debugger;
    this.sendobject.ApplicationModuleId = Number(this.modulevalue);    
    if (this.sendobject.ApplicationModuleId > 0) {
    this.modulerolePermission.getRolesIds(this.sendobject)
      .subscribe(res => {        
        if (res.Message == "Success") {
        var result = res.Data;
        this.RolesList = this.RolesList.filter(function (array_el) {
            return result.filter(function (anotherOne_el) {
              return anotherOne_el.id == array_el.id;
            }).length == 0
          });
        }
      });
    }
    if (this.Data.length > 0) {
      var res = this.Data.filter(f => this.modulevalue.includes(f.ApplicationModuleId));
      if (res.length > 0) {
        var datares = res.map(({ RoleId }) => RoleId)
        this.RolesList = this.RolesList.filter(r => !datares.includes(r.id));
      }
      else {
        this.RolesList = this.RolesListTemp;
      }
    }
  }

  RecordSave() {
    
    if (this.modulevalue == null || this.modulevalue.length == 0) {
      this.toastService.error("Please select module");
      return false;
    }
    else if (this.rolevalue == null || this.rolevalue.length == 0) {
      this.toastService.error("Please select role");
      return false;
    }
    //else if (this.permissionTypeId == null || this.permissionTypeId.length == 0) {
    //  this.toastService.error("Please select permission");
    //  return false;
    //}
    else if (this.Data.length == 0 || this.Data == null) {
      this.toastService.error("Please add record in grid");
      return false;
    }
    this.modulerolePermission.InsertModuleRolePermission(this.Data)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.toastService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);          
          this.selectedItemsA = null;
          this.selectedItemsB = null;
          this.rolevalue = null;
          this.modulevalue = null;
          this.permissionTypeId = null;
          this.GridData = [];
          this.FillGrid();
          return true;
        }
        else {
          this.toastService.error("error");
          return false;
        }
      });
  }

  FillGrid() {
    //debugger;
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.ELEMENT_DATA = [];
    this.GridData.forEach((v) => {
      this.ELEMENT_DATA.push(v);
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
          this.paginator.pageSizeOptions = [40,100, 200, 500];
          this.paginator.pageSize = 40;
          this.paginator.showFirstLastButtons = true;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

    //this.modulerolePermission.GetModuleRolePermission(this.sendobject)
    //  .subscribe(res => {        
    //    if (res.Message == "Success") {
    //      this.ELEMENT_DATA = [];
    //      res.Data.forEach((value, index) => {
    //        this.ELEMENT_DATA.push({ ID: value.Id, Module: value.ApplicationModule, Role: value.Roles, Permission: value.PermissionType })
    //      })

    //      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    //      this.paginator.pageSizeOptions = [10, 50, 100, 200, 500];
    //      this.paginator.pageSize = 10;
    //      this.paginator.showFirstLastButtons = true;
    //      this.dataSource.paginator = this.paginator;
    //      this.dataSource.sort = this.sort;
    //    }
    //  });
  }


  

  ApplicationModule() {
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.modulerolePermission.GetModuleList(this.sendobject)
      .subscribe(apm => {
        //var filterResult = this.ELEMENT_DATA.map(({ ID }) => ID);
        //this.ModuleList = apm.filter(x => (!filterResult.includes(x.id)));
        this.ModuleList = apm;
        this.settingsA = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',          
          enableSearchFilter: true,
          addNewItemOnFilter: false
        };
      }
      );
  }

  RoleList() {
    this.modulerolePermission.GetRolesList()
      .subscribe(res => {
        this.RolesList = res;
        this.RolesListTemp = res;
        this.settingsB = {
          singleSelection: false,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false
        };
          
      }
      );
  }

  PermissionList() {
    this.modulerolePermission.GetPermissionTypeList()
      .subscribe(res => {
        this.PermissionTypeList = res;
      }
      );
  }
  selectedCheckbox(e: any, selectedData) {
   
    if (e.checked == true) {
      this.ItemList.push(selectedData);
    }
    else {
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
    //this.dataemit();
  }


  RemoveSelected() {
      this.GridData = this.GridData.filter(item => !this.ItemList.includes(item));
      var getmodule = this.ItemList.map(({ ID }) => ID);   
      this.Data = this.Data.filter(x => !getmodule.includes(x.Index));
      this.FillGrid();
      this.ItemList = null;
  }
}

export interface PeriodicElement {
  ID: number;
  Module: string;
  Role: string;
  Permission: string;
 
}


