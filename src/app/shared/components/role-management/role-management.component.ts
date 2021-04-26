import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, ViewChild} from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UseraccessService, AuthService, RolesViewModel, UserRolesListViewModel } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { ConfirmDeleteTabledataPopupComponent } from '../confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit, AfterViewInit {

  isAllSelected: boolean = false;
  public exampleData1: Array<Select2OptionData>;
  public value: string;
  public placeholder = 'Please Select';
  public exampleData: any[];
  public options: Options;
  rolesListModel: RolesViewModel = new RolesViewModel();
  displayedColumnsRoles = ['userRolesListId', 'roleName'];
  dataSource = new MatTableDataSource<UserRolesListViewModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<UserRolesListViewModel>(true, []);

  userRolesListViewModel: UserRolesListViewModel = new UserRolesListViewModel();
  modalRef: NgbModalRef;
  size: number = 0;
  rollids: [];
  @Input() existIds: string;
  rollDeletedids: string;
  @Input() userId: number;
  @Input() currentTab: string;
  @Input() data: UserRolesListViewModel[] = [];
  @Output() addEntry: EventEmitter<any> = new EventEmitter<any>();

  @Output() deleteEntry: EventEmitter<any> = new EventEmitter<any>();
  settingsA = {};
  constructor(private useraccessService: UseraccessService, public modalService: NgbModal,
    private toastrService: ToastrService, private authenticationService: AuthService) {
    //rolesList
  }
  ngAfterViewInit(): void {
    this.getRollBind();    
  }

  ngOnInit(): void {    
   
  }

  onAddEntry() {
    let modelList = [];
    let Roleids = [];
    Roleids = this.rollids.map(({ id }) => id);
    if (!!!Roleids || Roleids.length === 0) {
      this.toastrService.warning('Please select at least one Role.', null, {
        closeButton: true
      });
      return;
    }
    Roleids.map(x => {
      let model = new UserRolesListViewModel();
      model.userId = this.userId;
      model.roleId = Number(x);
      model.clientId = this.authenticationService.currentUserValue.ClientId;
      model.updatedBy = this.authenticationService.currentUserValue.LoginId;
      model.createdBy = this.authenticationService.currentUserValue.LoginId;
      model.updateDateTimeBrowser = new Date(new Date().toISOString());
      model.createDateTimeBrowser = new Date(new Date().toISOString());
      modelList.push(model);
    });
    this.useraccessService.addUserRoleslistList(modelList).subscribe(x => {      
      this.getRollBind();
      this.addEntry.emit(this.rollids);
      this.toastrService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE, null, {
        closeButton: true
      });
      this.rollids = [];
    });
  }

  onRefershEntry() {
    this.data = []=[];
    this.exampleData = [];
    this.getRollBind();
    this.addEntry.emit(this.data);
  }

  onDeleteEntry() {
    if (!!!this.deletedIds) {
      this.toastrService.warning('Please select at least one User Role.', null, {
        closeButton: true
      });
      return;
    }
    else if ((this.currentTab == "" || this.currentTab == "Existing") && this.isAllSelected) {
      this.toastrService.warning('All roles of Existing User can not be deleted', null, {
        closeButton: true
      });
      return;
    }
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {

      this.useraccessService.deleteUserRoleslistListByIds(this.deletedIds, this.authenticationService.currentUserValue.LoginId).subscribe(x => {
        this.getRollBind();
        this.deleteEntry.emit(this.rollDeletedids);
        this.deletedIds = "";
        this.toastrService.success('User role deleted successfully.', null, {
          closeButton: true
        });
      });
    }, (reason) => {
    }); 
  }

  setRollDropDown(data: any) {
    this.exampleData = [];
    data.map(item => {
      return {
        itemName: item.text,
        id: item.id
      };
    }).forEach(item => this.exampleData.push(item));

    this.options = {
      width: '300',
      multiple: true,
      tags: true
    };
     this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
       enableSearchFilter: true,
       enableCheckAll: false,
      addNewItemOnFilter: false,
      badgeShowLimit: 4,
      searchBy: ['itemName']
    };
   
  }

  getRollBind() {
    this.data = [];
    this.rolesListModel = new RolesViewModel();
    this.rolesListModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.useraccessService.rolesList(this.rolesListModel).subscribe(x => {
      const row = x.Data;
      if (!!row) {
        let rowData = [];
        row.map(item => {
          return {
            text: item.Name,
            id: item.Id
          };
        }).forEach(item => rowData.push(item));

        this.rolesListModel.UserId = this.userId;
        this.userRolesListViewModel.clientId = this.rolesListModel.ClientID;
        this.userRolesListViewModel.userId = this.userId;
        this.useraccessService.getUserRoleslistList(this.userRolesListViewModel).subscribe(y => {
          const rowList = y.Data;
          
          if (!!rowList) {
            rowList.filter(item => {
              let index = rowData.findIndex(x => x.id === item.RoleId)
              if (index > -1) {
                rowData.splice(index, 1);
              }
              let userRolesExist = new UserRolesListViewModel();
              userRolesExist.userId = item.UserId;
              userRolesExist.userRolesListId = item.UserRolesListId;
              userRolesExist.roleId = item.RoleId;
              userRolesExist.roleName = item.RoleName;
              userRolesExist.clientId = item.ClientId
              userRolesExist.isSelected = false;             
              this.data.push(userRolesExist);
            });
            this.size = this.data.length;
            this.dataSource.data = this.data;
          }
         
          rowData = rowData.filter((value, index, array) =>
            !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);
          this.setRollDropDown(rowData);
        });
      }
    });
  }

  selectAll(check: any) {
    this.isAllSelected = check.checked;
    this.data.forEach(row => { row.isSelected = this.isAllSelected; });
    this.setUserCheckBoxData();
  }

  selectCheckbox(value: any) {
    this.data.forEach(row => {
      if (row.userRolesListId == value.userRolesListId)
        row.isSelected = !value.isSelected;
     
    });
    this.isAllSelected = (this.data.length === (this.data.filter(x => x.isSelected   == true).length));
    this.setUserCheckBoxData();
  }

  deletedIds: string = '';
  setUserCheckBoxData() {
    let iDs: string = '';
    this.deletedIds = '';
    this.data.filter(x => {
      if (x.isSelected == true) iDs += `${x.userRolesListId},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.deletedIds = iDs;
    }
  }
}
