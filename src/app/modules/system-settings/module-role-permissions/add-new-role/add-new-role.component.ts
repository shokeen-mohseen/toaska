import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '@app/core';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ResizeEvent } from 'angular-resizable-element';
import { ToastrService } from 'ngx-toastr';
import { EditNewRoleComponent } from '../edit-new-role/edit-new-role.component';
import { ClientRoleViewModel } from '../model/send-object';
import { ModuleRolePermissionService } from '../services/modulerolepermission.services';

export interface PeriodicElement {
  ID: number;
  RoleCode: string;
  RoleName: string;
  Description: string;
  IsSelected: boolean;
}


@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.css']
})
export class AddNewRoleComponent implements OnInit {
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
 
  ELEMENT_DATA: PeriodicElement[] = [];

  modalRef: NgbModalRef;
  selectRow: any;
  displayedColumns = ['selectRow', 'RoleCode', 'RoleName', 'Description'];
  displayedColumnsReplace = ['selectRow', 'key_RoleCode', 'key_RoleName', 'key_Description'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  sendobject: ClientRoleViewModel = new ClientRoleViewModel();
  //commonCallListViewModel: modulePermission = new modulePermission();
  filterValue = "";
  isAlllSelected: boolean = false;
  isLinear = false;
  data: any;
  error: any;
  list: any;
  temp: moduleAddNewRole[] = [];
  ItemList: moduleAddNewRole[];
  test: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('checkBoxClick') checkBoxClick = new EventEmitter<any>();
  @Input('modulesToSelect') modulesToSelect: moduleAddNewRole[];
 

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private router: Router,
    private modulerolePermission: ModuleRolePermissionService,
    private toastService: ToastrService,
    private authService: AuthService,
    private ptService: PreferenceTypeService
  ) { }

  async applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim();
    this.sendobject.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.BindAddUserList();
  }
  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.BindAddUserList();
    }

  }

  async getPageSize() {
    this.sendobject.pageNo = 0;
    this.sendobject.pageSize = 0;
    this.modulerolePermission.GetNewRole(this.sendobject).toPromise()
      .then(result => {
        
        this.sendobject.itemsLength = result.RecordCount;

      });

    this.sendobject.pageSize = await this.modulerolePermission.getDefaultPageSize();
  }
  
  //selectRow: any;
  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.sendobject.sortOrder = "DESC";
    // this.getTotalRecords();
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.ItemList = new Array<any>();
    await this.getPageSize();
    this.BindAddUserList();

  }

  selectedAllData(selectedData) {
   
    this.ItemList.push(selectedData);
  
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

  onSelectionChange(row: moduleAddNewRole, checked: boolean) {
   
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
    
    if (checked == true) {
      this.ItemList.push(selectedData);
      
    }
    else {
      
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
    
    this.checkBoxClick.emit(this.selection.selected);

  }

  

  getTotalRecords() {
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.modulerolePermission.getTotalRoleCount(this.sendobject)
      .subscribe(result => {
        this.sendobject.itemsLength = Number(result.Data);
        this.getDefaultPageSize();
      });
  }
  getDefaultPageSize() {
    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.sendobject.pageSize = Number(result.data.preferenceValue);
        this.BindAddUserList();
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
    this.BindAddUserList();
    this.sendobject.pageSize = event.pageSize;
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.sendobject.sortColumn = event.active;
      this.sendobject.sortOrder = event.direction.toLocaleUpperCase();
      this.BindAddUserList();
    }
  }

  ngOnChanges(changes: any) {
    this.setRowSelection();
  }

  BindAddUserList() {
    this.selection.clear();
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.selection.clear();
    this.sendobject.filterOn = this.filterValue;
    this.sendobject.sortColumn = "";   
    this.modulerolePermission.GetNewRole(this.sendobject)
      .subscribe(res => {
        this.ELEMENT_DATA = [];
        if (res.Message == "Success") {
          res.Data.forEach((value, index) => {
            this.ELEMENT_DATA.push({
              ID: value.ID, RoleCode: value.Code,
              RoleName: value.Name, Description: value.Description,
              IsSelected: false
            })
          })
          

          this.isAlllSelected = false;
          this.dataSource = new MatTableDataSource<moduleAddNewRole>();
          this.dataSource.data = this.ELEMENT_DATA;
          // this.dataSource.sort = this.sort;
          this.paginator.showFirstLastButtons = true;
          // this.dataSource.data = res.data;
          this.setRowSelection();
        }
      });
  }

  RemoveSelected(data: moduleAddNewRole[]) {

    var selectedIDs = '';

    var selecteddata = data.map(({ ID }) => ID);

    selecteddata.forEach((value, index) => {
      selectedIDs = selectedIDs + value.toString() + ',';
    });

    var ClientId = this.authService.currentUserValue.ClientId;

    this.modulerolePermission.DeleteNewRole(selectedIDs, ClientId).subscribe(result => {
      if (result.message == "Success" || result.Message == "Success") {
       
        this.BindAddUserList();
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
    this.BindAddUserList();
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

  openPopup(action) {
    if (action === "add") {
      this.ItemList = [];
      this.modalRef = this.modalService.open(EditNewRoleComponent, { size: 'md', backdrop: 'static' });
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.toastService.success("Records added successfully.");
        this.RefreshScreen();

      });
    }
    else if (action === "edit") {
      if (!!this.ItemList && this.ItemList.length > 0) {
        if (this.ItemList.length > 1) {
          this.toastService.warning('Please select one Role and not more than one');
          return;
        }
        else {
          this.modalRef = this.modalService.open(EditNewRoleComponent, { size: 'md', backdrop: 'static' });          
          var selectedId = this.ItemList.map(({ ID }) => ID);
          this.modalRef.componentInstance.Id = selectedId[0];
          this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
            this.ItemList = [];
            this.toastService.success("Records updated successfully.");
            this.RefreshScreen();
           
          });
        }
        
      } else {
        this.toastService.warning('Please select at least one Role');
        return;
      }
     
    }
    else if (action === "delete") {
      if (!!this.ItemList && this.ItemList.length > 0) {
       
          this.RemoveSelected(this.ItemList);
        this.ItemList = [];
      }
      else {
        this.toastService.warning('Please select at least one Role.');
        return;
      }
    }
  }

}

export class moduleAddNewRole {
  ID: number;
  IsSelected: boolean;
  RoleCode: string;
  RoleName: string;
  Description: string;

}

