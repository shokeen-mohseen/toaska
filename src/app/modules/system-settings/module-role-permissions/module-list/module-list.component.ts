import { Component, ViewChild, OnInit, EventEmitter, Output, Input, OnChanges, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModuleRolePermissionService } from '../services/modulerolepermission.services';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core';
import { modulePermission, moduleRole, ModulePaginatorListViewModel } from '../model/send-object';
import { CsvService } from '@app/core/services/csvconverter.service';
import { MatTabGroup } from '@angular/material/tabs';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
import { ResizeEvent } from 'angular-resizable-element';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent implements OnInit, AfterViewInit, OnChanges {
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
  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns = ['selectRow', 'Module', 'Role', 'Permission'];
  displayedColumnsReplace = ['selectRow', 'key_FeatureModule', 'key_Role', 'key_Permission'];
  //dataSource;
 // selection = new SelectionModel<moduleRole>(true, []);
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  sendobject: modulePermission = new modulePermission();
  //commonCallListViewModel: modulePermission = new modulePermission();
  filterValue = "";
  isAlllSelected: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @Output('checkBoxClick') checkBoxClick = new EventEmitter<any>();
  @Input('modulesToSelect') modulesToSelect: moduleRole[];
  //@Input() size: number = 1;

  async applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim();
    this.sendobject.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.FillGrid();
  }
  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.FillGrid();
    }

  }

  async getPageSize() {
    this.sendobject.pageNo = 0;
    this.sendobject.pageSize = 0;
    this.modulerolePermission.GetModuleRolePermission(this.sendobject).toPromise()
      .then(result => {
       
        this.sendobject.itemsLength = result.RecordCount;

      });

    this.sendobject.pageSize = await this.modulerolePermission.getDefaultPageSize();
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  //masterToggle() {
  //  this.isAllSelected ?
  //    this.ItemList.length = 0 :
  //    this.dataSource.data.forEach(row => { this.selectedAllData(row); this.selection.isSelected(row); });
  //}
  isLinear = false;

  modalRef: NgbModalRef;
  constructor(private csvService: CsvService, public modalService: NgbModal, private router: Router, private modulerolePermission: ModuleRolePermissionService, private toastService: ToastrService, private authService: AuthService, private ptService: PreferenceTypeService) {
    //this.sendobject = new modulePermission();
  }

  data: any;
  error: any;
  list: any;
  temp: moduleRole[] = [];
  ItemList: moduleRole[];
  test: any;
  selectRow: any;
  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.sendobject.sortOrder = "DESC";
   // this.getTotalRecords();
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.ItemList = new Array<any>();
    await this.getPageSize();
    this.FillGrid();

  }


  selectedAllData(selectedData) {
    this.ItemList.push(selectedData);
    this.dataemit();
  }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.IsSelected = true;
        this.ItemList.push(row);
        this.checkBoxClick.emit(this.selection.selected);
      });
  }
  //selectAll(check: any) {
  //  this.selection.clear();
  //  this.isAllSelected = check.checked;
  //  this.dataSource.data.forEach(row => {
  //    row.isSelected = this.isAllSelected;
  //    this.selection.toggle(row);
  //    if (check.checked) { this.ItemList.push(row); this.checkBoxClick.emit(this.ItemList); }
  //  });
  //  if (!check.checked) { this.ItemList.length = 0; this.checkBoxClick.emit(this.ItemList); }
  //}


  //selectedCheckbox(row: OriginOfGoods, checked: boolean) {
  //  row.isSelected = checked;
  //  this.selection.toggle(row);
  //  if (checked == true) {
  //    this.ItemList.push(row);
  //  }
  //  else {

  //    this.ItemList = this.ItemList.filter(m => m != row);
  //  }
  //  this.SelectedMaterial.emit(this.selection.selected);
  //}
  onSelectionChange(row: moduleRole, checked: boolean) {
    
    row.IsSelected = checked;
    this.selection.toggle(row);
    if (checked == true) {
      this.ItemList.push(row);
    }
    else {

      this.ItemList = this.ItemList.filter(m => m != row);
    }
    this.checkBoxClick.emit(this.selection.selected);
  }

  selectedCheckbox(checked: boolean, selectedData) {
    
    selectedData.isSelected = checked;
    this.selection.toggle(selectedData);
    //console.log('selecteddata', e.checked);
    // console.log('selecteddata', e, selectedData);

    //if (selectedData.index != 0 ) {

    //  this.updatetest(value, selectedData);
    if (checked == true) {
      this.ItemList.push(selectedData);
      // console.log('checked', selectedData)
    }
    else {
      // console.log('unchecked', selectedData)
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
    // console.log('output', this.ItemList)
  //  this.dataemit();
    this.checkBoxClick.emit(this.selection.selected);

  }


  dataemit() {
  
    //console.log('emit', this.ItemList);

  }

  getTotalRecords() {
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.modulerolePermission.getTotalCount(this.sendobject)
      .subscribe(result => {
        this.sendobject.itemsLength = Number(result.Data);
        this.getDefaultPageSize();
      });
  }
  getDefaultPageSize() {
    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.sendobject.pageSize = Number(result.data.preferenceValue);
        this.FillGrid();
      });
  }
  onPaginationEvent(event) {
    this.sendobject.filterOn = this.filterValue;
    this.sendobject.pageNo = event.pageIndex + 1;
    if (this.sendobject.pageNo > this.sendobject.itemsLength / event.pageSize) {
      this.sendobject.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.sendobject.pageSize = event.pageSize;
    }
    this.FillGrid();
    this.sendobject.pageSize = event.pageSize;
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.sendobject.sortColumn = event.active;
      this.sendobject.sortOrder = event.direction.toLocaleUpperCase();
      this.FillGrid();
    }
  }

  ngOnChanges(changes: any) {
    this.setRowSelection();
  }

  FillGrid() {
    this.selection.clear();
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.selection.clear();
    this.sendobject.filterOn = this.filterValue;
    this.modulerolePermission.GetModuleRolePermission(this.sendobject)
      .subscribe(res => {
        this.ELEMENT_DATA = [];
        if (res.Message == "Success") {
          res.Data.forEach((value, index) => {
            this.ELEMENT_DATA.push({ ID: value.Id, Module: value.Module, Role: value.Role, Permission: value.Permission, UpdatedBy: (value.UpdatedBy == null || value.UpdatedBy == "") ? value.CreatedBy : value.UpdatedBy, UpdateDateTimeServer: value.UpdateDateTimeServer, IsSelected: false })
          })
          this.isAlllSelected = false;
          this.dataSource = new MatTableDataSource<moduleRole>();
          this.dataSource.data = this.ELEMENT_DATA;
          // this.dataSource.sort = this.sort;
          this.paginator.showFirstLastButtons = true;
         // this.dataSource.data = res.data;
          this.setRowSelection();
        }
      });
  }

  RemoveSelected(data: moduleRole[]) {

    var selectedIDs = '';

    var selecteddata = data.map(({ ID }) => ID);

    selecteddata.forEach((value, index) => {
      selectedIDs = selectedIDs + value.toString() + ',';
    });

    var ClientId = this.authService.currentUserValue.ClientId;

    this.modulerolePermission.RemoveModuleRolePermission(selectedIDs, ClientId).subscribe(result => {
      if (result.message == "Success" || result.Message == "Success") {
        this.FillGrid();
        this.toastService.success("Records deleted successfully.");
      }
      else {
        this.toastService.warning("An error occurred during this operation. Please contact Tech Support");
      }
    }, error => {
      this.toastService.error(error);
    });
  }

  RefreshScreen() {
    this.FillGrid();
  }

  ExportCSV() {

    var today = new Date();
    var day = today.getDate() + "";
    var month = (today.getMonth() + 1) + "";
    var year = today.getFullYear() + "";
    var hour = today.getHours() + "";
    var minutes = today.getMinutes() + "";
    var seconds = today.getSeconds() + "";

    var fileName = "ModuleRole_" + day + month + year + hour + minutes + seconds;

    this.dataSource.connect().subscribe(d => this.csvData = d);
    this.csvService.downloadFile(this.csvData, ['Module', 'Role', 'Permission'], fileName);
  }

  setRowSelection() {
    if (this.modulesToSelect != null && this.modulesToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.modulesToSelect.findIndex(item => item.ID === row.ID) >= 0) {
          this.selection.select(row);
          row.IsSelected = true;
        }
        else {
          this.selection.deselect(row);
          row.IsSelected = false;
        }

      });
    }
  }
}
export interface PeriodicElement {
  ID: number;
  IsSelected: boolean;
  Module: string;
  Role: string;
  Permission: string;
  UpdateDateTimeServer: Date;
  UpdatedBy: string;
 // selectRow: string;
  //IsSelected: boolean;
}
