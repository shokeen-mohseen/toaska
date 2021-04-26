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
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(false, []);
  sendobject: modulePermission = new modulePermission();
  //commonCallListViewModel: modulePermission = new modulePermission();
  filterValue = "";
  isAllSelected: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 // @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @Output('checkBoxClick') checkBoxClick = new EventEmitter<any>();
  @Input('modulesToSelect') modulesToSelect: moduleRole[];
  //@Input() size: number = 1;

  applyFilter(filterValue: string) {
   
    this.filterValue = filterValue.trim();
    this.FillGrid();
  }
  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.FillGrid();
    }

  }
  

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
     this.isAllSelected ?
      this.ItemList.length = 0 :
      this.dataSource.data.forEach(row => { this.selectedAllData(row); this.selection.isSelected(row);});
  }
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
    this.getTotalRecords();
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.ItemList = new Array<any>();    
    this.FillGrid();

  }

  selectedAllData(selectedData) {
    this.ItemList.push(selectedData);
    this.dataemit();
  }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;

  }

  selectAll(check: any) {
    this.selection.clear();
    this.isAllSelected = check.checked;
    this.dataSource.data.forEach(row => {
      row.IsSelected = this.isAllSelected;
      this.selection.toggle(row);
      if (check.checked) { this.ItemList.push(row); this.checkBoxClick.emit(this.ItemList); }      
    });
    if (!check.checked) { this.ItemList.length = 0; this.checkBoxClick.emit(this.ItemList); }
   }
  

  selectedCheckbox(e: any, selectedData) {

    //console.log('selecteddata', e.checked);
   // console.log('selecteddata', e, selectedData);

    //if (selectedData.index != 0 ) {

    //  this.updatetest(value, selectedData);
    if (e.checked == true) {
      this.ItemList.push(selectedData);
     // console.log('checked', selectedData)
    }
    else {
     // console.log('unchecked', selectedData)
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
   // console.log('output', this.ItemList)
    this.dataemit();


  }


  dataemit() {
     this.checkBoxClick.emit(this.ItemList);
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
    this.filterValue = "";
    this.sendobject.pageNo = event.pageIndex + 1;
    this.sendobject.pageSize = event.pageSize;
    this.FillGrid();
  }

  customSort(event) {
    this.sendobject.sortColumn = event.active;
    this.sendobject.sortOrder = event.direction.toLocaleUpperCase();
    this.FillGrid();
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
          this.isAllSelected = false;
          this.dataSource = new MatTableDataSource<PeriodicElement>();
          this.dataSource.data = this.ELEMENT_DATA;
         // this.dataSource.sort = this.sort;
          this.paginator.showFirstLastButtons = true;
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
        this.toastService.warning("Something went wrong.");
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
  Module: string;
  Role: string;
  Permission: string;
  UpdateDateTimeServer: Date;
  UpdatedBy: string;
  IsSelected: boolean;
}


