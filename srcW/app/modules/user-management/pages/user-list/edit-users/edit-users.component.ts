import { Component, OnInit, Input, AfterViewInit, OnDestroy, AfterViewChecked, ViewChild, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddEditAddressComponent } from 'app/shared/components/modal-content/add-edit-address/add-edit-address.component';
import { AddEditRoleComponent } from 'app/shared/components/modal-content/add-edit-role/add-edit-role.component';
import { AddEditPlanningLocationComponent } from 'app/shared/components/modal-content/add-edit-planning-location/add-edit-planning-location.component';
import { AddContactComponent } from 'app/shared/components/modal-content/add-contact/add-contact.component';
import { UsersViewModelId, UsersViewModel, UseraccessService, AuthService, UserRolesListViewModel, CommonCallListViewModel, UserConstant, UsersContactViewModel, UsersAddressViewModel, AddressCallListViewModel, ThemeService, UserLocationListViewModel } from '@app/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit, OnDestroy {

  modalRef: NgbModalRef;
  usersViewModel: UsersViewModel = new UsersViewModel();
  userId: number;
  @Input() dataSource: UsersViewModel[] = [];
  organizationlist = [];
  useraccessServiceSubcriber: Subscription;
  loginId: string;
  next: number = 0;
  localTimeStr: string;
  updateBy: string;
  @Input() userRolesList: UserRolesListViewModel[] = [];
  @Input() userContactList: UsersContactViewModel[] = [];
  userRolesListViewModel: UserRolesListViewModel = new UserRolesListViewModel();
  isRoleAllSelected: boolean = false;
  roleIds: string;
  isContactAllSelected: boolean = false;
  contactIds: string;
  @Input() mobilePhoneCode: string;
  pageActionType: string;

  @Input() userAddressList: UsersAddressViewModel[] = [];
  isAddressAllSelected: boolean = false;
  addressIds: string;
  @Input() addressName: string;
  @Output() userRoleLength: EventEmitter<any> = new EventEmitter();

  userPlanningLocationViewModel: UserLocationListViewModel = new UserLocationListViewModel();
  isPlanningLocationAllSelected: boolean = false;
  planningLocationIds: string;

  displayedColumns = ['userLocationListId', 'LocationTypeName', 'LocationName'];
  @Input() userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<UserLocationListViewModel>(true, []);
  @Input() size: number = 0;

  btn: any
  btn1: any
  btn2: any
  btn3: any
  btn4: any
  btn5: any
  btn6: any
  btn7: any
  btn8: any
  btn9: any
  btn10: any
  btn11: any
  btn12: any

  constructor(
    public modalService: NgbModal, private useraccessService: UseraccessService,
    private toastrService: ToastrService, private authenticationService: AuthService
  ) {
    this.usersViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.localTimeStr = new Date(new Date().toISOString()).toLocaleString();
    this.updateBy = this.authenticationService.currentUserValue.LoginId;
    this.pageActionType = UserConstant.ContactActionType;
  }

  ngOnDestroy(): void {
    if (!!this.useraccessServiceSubcriber)
      this.useraccessServiceSubcriber.unsubscribe();
  }

  ngAfterViewInit() {
    
    this.userPlanningLocationList.sort = this.sort;
    this.paginator.length = this.size;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);


    this.paginator.page.pipe(
      tap(() => this.initializationView())
    )
      .subscribe();
    //}
  }
  initializationView() {
    this.getPlanningLocationList();
    this.isPlanningLocationAllSelected = false;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.userPlanningLocationList.filter = filterValue;
  }

  ngOnInit(): void {

  }

  onSubmit() {
    let userList: UsersViewModel[] = [];
    this.dataSource.map(row => {
      let usersView = Object.assign({}, row);
      usersView.clientId = this.authenticationService.currentUserValue.ClientId;
      usersView.updatedBy = this.authenticationService.currentUserValue.LoginId;
      usersView.updateDateTimeBrowser = new Date(new Date().toISOString());
      userList.push(usersView);
    });
    this.useraccessServiceSubcriber = this.useraccessService.addAllUser(userList).subscribe(x => {
      let items = x.Data;
      this.dataSource = [];
      items.map(row => {
        this.usersViewModel = Object.assign({}, new UsersViewModel());
        this.usersViewModel.clientId = row.ClientId;
        this.usersViewModel.loginId = row.LoginId;
        this.usersViewModel.firstName = row.FirstName;
        this.usersViewModel.lastName = row.LastName;
        this.usersViewModel.middleName = row.MiddleName;
        this.usersViewModel.prefix = row.Prefix;
        this.usersViewModel.suffix = row.Suffix;
        this.usersViewModel.orgnizationId = row.OrgnizationId;
        this.usersViewModel.userId = row.Id;
        this.usersViewModel.updatedBy = !!row.UpdatedBy ? row.UpdatedBy: row.LoginId;
        this.usersViewModel.updateDateTimeBrowser = row.UpdateDateTimeBrowser;
        this.usersViewModel.updatebyTimeBrowser = !!this.usersViewModel.updateDateTimeBrowser ? new Date(row.UpdateDateTimeBrowser).toLocaleString() : '';
        this.dataSource.push(this.usersViewModel);
      });
      this.toastrService.success('User has been update successfully');
      this.usersViewModel = Object.assign({}, this.dataSource[this.next]);
      this.usersViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
      this.next = this.dataSource.length - 1;
      this.userId = this.dataSource[this.next].userId;
      this.loginId = this.dataSource[this.next].loginId;
    });
  }

  openPopup(action) {
    if (action === "addAddressButton") {
      this.modalRef = this.modalService.open(AddEditAddressComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = UserConstant.ContactActionType;
      this.modalRef.componentInstance.getAddresById = this.usersViewModel.userId;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserAddressList();
      });
      this.btn = 'btn1';
    }
    else if (action === "editAddressButton") {
      if (!!!this.addressIds) {
        this.toastrService.warning('Please Select At least One Address');
        return;
      } else if (!!this.contactIds) {
        const splitaddressIds = this.addressIds.split(',');
        if (splitaddressIds.length > 1) {
          this.toastrService.warning('Please Select only one Address for edit');
          return;
        }
      }
      this.modalRef = this.modalService.open(AddEditAddressComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = UserConstant.ContactActionType;
      this.modalRef.componentInstance.getAddresById = this.usersViewModel.userId;
      this.modalRef.componentInstance.addressIds = this.addressIds;
      this.modalRef.componentInstance.isEdit = true;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserAddressList();
      });  
      
      this.btn = 'btn2'
    }
    else if (action === "deleteAddressButton") {
      if (!!!this.addressIds) {
        this.toastrService.warning('Please Select At least One Address');
        return;
      }
      this.useraccessService.deleteUseAddressListByIds(this.idsAddressDeteted, this.authenticationService.currentUserValue.LoginId, UserConstant.ContactActionType).subscribe(x => {
        this.getUserAddressList();
        this.toastrService.success('User Address deleted successfully');
      });
      this.btn = 'btn3';
    }

    else if (action === "addRolesButton") {
      this.modalRef = this.modalService.open(AddEditRoleComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.userId = this.usersViewModel.userId;
      this.modalRef.componentInstance.loginId = this.usersViewModel.loginId;
      this.modalRef.componentInstance.actionType = action;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserRoleList();
      });
      this.btn = 'btn4'
    }
    else if (action === "deleteRolesButton") {
      if (!!!this.roleIds) {
        this.toastrService.warning('Please Select At least One User Role');
        return;
      }
      this.useraccessService.deleteUserRoleslistListByIds(this.idsDeteted, this.usersViewModel.loginId).subscribe(x => {
        this.getUserRoleList();
        this.toastrService.success('User Role deleted successfully');
      });
      this.btn = 'btn6';
    }

    else if (action === "addPLocationButton") {
      this.modalRef = this.modalService.open(AddEditPlanningLocationComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.userId = this.usersViewModel.userId;
      this.modalRef.componentInstance.loginId = this.usersViewModel.loginId;
      this.modalRef.componentInstance.actionType = action;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getPlanningLocationList();
      });
      this.btn = 'btn7';
    }
   
    else if (action === "deletePLocationButton") {
      if (!!!this.planningLocationIds) {
        this.toastrService.warning('Please Select At least One Planning Location');
        return;
      }
      this.useraccessService.deleteUserPlanningLocationListByIds(this.idsPlanningLocationDeteted, this.usersViewModel.loginId).subscribe(x => {
        this.getPlanningLocationList();
        this.toastrService.success('Planning Location deleted successfully');
      });
      this.btn = 'btn9';
    }

    else if (action === "addContactButton") {
      this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
      //let commonCallListViewModel = new CommonCallListViewModel();
      this.modalRef.componentInstance.contactActionType = UserConstant.ContactActionType;
      this.modalRef.componentInstance.getContactById = this.usersViewModel.userId;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserContact();
      });
      this.btn = 'btn10';
    }
    else if (action === "editContactButton") {
      
      if (!!!this.contactIds) {
        this.toastrService.warning('Please Select At least One Contact');
        return;
      } else if (!!this.contactIds) {
        const splitContactIds = this.contactIds.split(',');
        if (splitContactIds.length > 1) {
          this.toastrService.warning('Please Select only one Contact for edit');
          return;
        }
      }
      this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = UserConstant.ContactActionType;
      this.modalRef.componentInstance.getContactById = this.usersViewModel.userId;
      this.modalRef.componentInstance.contactIds = this.contactIds;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserContact();
      });      
      this.btn = 'btn11'
    }
    else if (action === "deleteContactButton") {
      this.btn = 'btn12'
     
      if (!!!this.contactIds) {
        this.toastrService.warning('Please Select At least One Contact');
        return;
      }

      this.useraccessService.deleteUserContactListByIds(this.idsContactDeteted, this.authenticationService.currentUserValue.LoginId).subscribe(x => {
        this.getUserContact();
        this.toastrService.success('User Contact deleted successfully');
      });
    }
  }

  selectNext() {
    if ((this.dataSource.length - 1) > this.next) {
      
      if (this.dataSource[this.next].userId > 0) {
        this.dataSource[this.next] = this.usersViewModel;
      }
      this.next += 1;
      this.setUserDetails(this.next);
    }    
  }

  selectPrev() {
    if (0 < this.next) {
      if (!!this.usersViewModel.loginId) {
        this.dataSource[this.next] = this.usersViewModel;
      }
      this.next -= 1;
      this.setUserDetails(this.next);
    }
  }

  selectedUser(index: number) {
    this.next = index;
    this.setUserDetails(this.next);
  }

  setUserDetails(index: number) {
    const nextResult = this.dataSource[this.next];
    this.userId = nextResult.userId;
    this.usersViewModel = nextResult;

    this.getUserContact();
    this.getUserAddressList();
    this.getUserRoleList();
    this.getUserAddressList();
    this.getPlanningLocationList();
  }


  organizationByIdList(id: number) {
    this.useraccessService.organizationByUserIdList(id)
      .subscribe(result => {
        var datas = result.Data;
        this.setSorganizationDropDown(result.Data);
      });
  }
  
  setSorganizationDropDown(data: any) {
    this.organizationlist = [];
    data.map(item => {
      return {
        name: item.firstName,
        id: item.id
      };
    }).forEach(item => this.organizationlist.push(item));
  }

  onOrganizationSelected(value: any) {

  }

  getUserRoleList() {
    this.userRolesListViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.userRolesListViewModel.userId = this.usersViewModel.userId;
    this.useraccessService.getUserRoleslistList(this.userRolesListViewModel).subscribe(y => {
      this.userRolesList = [];
      this.isRoleAllSelected = false;
      const rowList = y.Data;
      if (!!rowList) {
        rowList.filter(item => {
          let userRolesExist = new UserRolesListViewModel();
          userRolesExist.userId = item.UserId;
          userRolesExist.userRolesListId = item.UserRolesListId;
          userRolesExist.roleId = item.RoleId;
          userRolesExist.roleName = item.RoleName;
          userRolesExist.clientId = item.ClientId
          userRolesExist.isSelected = false;
          userRolesExist.userLogin = item.UserLogin;
          this.userRolesList.push(userRolesExist);

          this.userRoleLength.emit(this.userRolesList.length);
        });
      }
    });
  }


  selectRoleAll(check: any) {
    this.isRoleAllSelected = check.checked;
    this.userRolesList.forEach(row => {
      row.isSelected = this.isRoleAllSelected;
    });
    this.setUserRoleCheckBoxData();
  }

  selectRoleCheckbox(value: any) {
    this.userRolesList.forEach(row => {
      if (row.userRolesListId == value.userRolesListId)
        row.isSelected = !value.isSelected;
    });

    this.isRoleAllSelected = (this.userRolesList.length === (this.userRolesList.filter(x => x.isSelected == true).length));

    this.setUserRoleCheckBoxData();
  }

  removeUserFromEditList(userToRemove: UsersViewModel) {
    this.dataSource.splice(this.dataSource.findIndex(item => item.userId === userToRemove.userId), 1);
    //this.customersInEdit.emit(this.selectedCustomers);
  }

  idsDeteted: string = '';
  setUserRoleCheckBoxData() {
    let iDs: string = '';
    this.roleIds = '';
    this.idsDeteted = '';
    this.userRolesList.filter(x => {
      if (x.isSelected == true) {
        iDs += `${x.userRolesListId}#${x.roleId},`;
        this.idsDeteted += `${x.userRolesListId},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsDeteted = this.idsDeteted.substring(0, this.idsDeteted.length - 1);      
      this.roleIds = iDs;
    }
  }

  getUserAddressList() {
    let commonCallListViewModel = new AddressCallListViewModel()
    commonCallListViewModel.AddressActionType = UserConstant.ContactActionType;
    commonCallListViewModel.AddressbyId = this.userId;
    this.useraccessService.getUserAddressList(commonCallListViewModel)
      .pipe()
      .subscribe(result => {
        this.userAddressList = [];
        this.isAddressAllSelected = false;
        const rowList = result.data;
        if (!!rowList) {
          this.addressName = rowList[0].name + " " + rowList[0].countryCode + " " + rowList[0].countryName + " "
            + rowList[0].stateCode + " " + rowList[0].stateName + " " + rowList[0].cityCode + " " + rowList[0].cityName + " " + rowList[0].zipCode;
          
          rowList.filter(item => {
            let userAddressExist = new UsersAddressViewModel();
            userAddressExist = item;
            userAddressExist.isAddressSelected = false;
            userAddressExist.userAddressId = item.id;
            this.userAddressList.push(userAddressExist);
          });
        }
      });
  }

  selectAddressAll(check: any) {
    this.isAddressAllSelected = check.checked;
    this.userAddressList.forEach(row => {
      row.isAddressSelected = this.isAddressAllSelected;
    });
    this.setUserAddressCheckBoxData();
  }

  selectAddressCheckbox(value: any) {
    this.userAddressList.forEach(row => {
      if (row.userAddressId == value.userAddressId)
        row.isAddressSelected = !value.isAddressSelected;
    });

    this.isAddressAllSelected = (this.userAddressList.length === (this.userAddressList.filter(x => x.isAddressSelected == true).length));

    this.setUserAddressCheckBoxData();
  }

  idsAddressDeteted: string = '';
  setUserAddressCheckBoxData() {
    let iDs: string = '';
    this.addressIds = '';
    this.idsAddressDeteted = '';
    this.userAddressList.filter(x => {
      if (x.isAddressSelected == true) {
        iDs += `${x.userAddressId},`;
        this.idsAddressDeteted += `${x.userAddressId},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsAddressDeteted = this.idsAddressDeteted.substring(0, this.idsAddressDeteted.length - 1);
      this.addressIds = iDs;
    }
  }

  getUserContact() {
    let commonCallListViewModel = new CommonCallListViewModel()
    commonCallListViewModel.ContactActionType = UserConstant.ContactActionType;
    commonCallListViewModel.ContactById = this.userId;
    this.useraccessService.getUserContactList(commonCallListViewModel)
      .pipe()
      .subscribe(result => {
        this.userContactList = [];
        this.isContactAllSelected = false;
        const rowList = result.data;
        if (!!rowList) {
          this.mobilePhoneCode = !!rowList[0].mobilePhone ? rowList[0].mobilePhoneCountryCode + " " + rowList[0].mobilePhone :
            !!rowList[0].workPhone ? rowList[0].workPhoneCountryCode + " " + rowList[0].workPhone : '';
          rowList.filter(item => {
            let userContactExist = new UsersContactViewModel();
            userContactExist = item;
            userContactExist.isSelected = false;
            this.userContactList.push(userContactExist);
          });
        }
      });
  }

  selectContactAll(check: any) {
    this.isContactAllSelected = check.checked;
    this.userContactList.forEach(row => {
      row.isSelected = this.isContactAllSelected;
    });
    this.setUserContactCheckBoxData();
  }

  selectContactCheckbox(value: any) {
    this.userContactList.forEach(row => {
      if (row.userContactId == value.userContactId)
        row.isSelected = !value.isSelected;
    });

    this.isContactAllSelected = (this.userContactList.length === (this.userContactList.filter(x => x.isSelected == true).length));

    this.setUserContactCheckBoxData();
  }

  idsContactDeteted: string = '';
  setUserContactCheckBoxData() {
    let iDs: string = '';
    this.contactIds = '';
    this.idsContactDeteted = '';
    this.userContactList.filter(x => {
      if (x.isSelected == true) {
        iDs += `${x.userContactId},`;
        this.idsContactDeteted += `${x.userContactId},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsContactDeteted = this.idsContactDeteted.substring(0, this.idsContactDeteted.length - 1);
      this.contactIds = iDs;
    }
  }


  ///
  getPlanningLocationList() {
    this.userPlanningLocationViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.userPlanningLocationViewModel.userId = this.usersViewModel.userId;
    this.userPlanningLocationViewModel.pageNo = this.paginator.pageIndex;
    this.userPlanningLocationViewModel.pageSize = this.paginator.pageSize;

    this.useraccessService.getPlanningLocationList(this.userPlanningLocationViewModel).subscribe(y => {
      let userPlanningLocationList: UserLocationListViewModel[] = [];
      this.userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>([]);
      this.isPlanningLocationAllSelected = false;
      this.size = 0;
      const rowList = y.Data;
      if (!!rowList) {
        rowList.filter(item => {
          let userPlanningLocationExist = new UserLocationListViewModel();
          userPlanningLocationExist.userId = item.UserId;
          userPlanningLocationExist.userLocationListId = item.Id;
          userPlanningLocationExist.locationId = item.LocationId;
          userPlanningLocationExist.LocationName = item.LocationName;
          userPlanningLocationExist.clientId = item.ClientId
          userPlanningLocationExist.isPLocationSelected = false;
          userPlanningLocationExist.LocationTypeName = item.LocationTypeName;
          userPlanningLocationExist.planinglocationIds = item.PlaninglocationIds;
          userPlanningLocationExist.planinglocationCount = item.PlaninglocationCount;
          this.size = item.PlaninglocationCount;
          userPlanningLocationList.push(userPlanningLocationExist);          
        });
        this.userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>(userPlanningLocationList);
        //this.userPlanningLocationList.data.forEach(row => { row.isPLocationSelected = false; });
        this.paginator.length = this.size;
        this.isPlanningLocationAllSelected = false;
      }
    });
  }


  selectPlanningLocationAll(check: any) {
    this.selection.clear();
    this.isPlanningLocationAllSelected = check.checked;
    this.userPlanningLocationList.data.forEach(row => {
      row.isPLocationSelected = this.isPlanningLocationAllSelected;
    });
    this.setPlanningLocationCheckBoxData();
  }

  selectPlanningLocationCheckbox(value: any) {
    this.userPlanningLocationList.data.forEach(row => {
      if (row.userLocationListId == value.userLocationListId)
        row.isPLocationSelected = !value.isPLocationSelected;
    });

    this.isPlanningLocationAllSelected = (this.userPlanningLocationList.data.length === (this.userPlanningLocationList.data.filter(x => x.isPLocationSelected == true).length));

    this.setPlanningLocationCheckBoxData();
  }

  idsPlanningLocationDeteted: string = '';
  setPlanningLocationCheckBoxData() {
    let iDs: string = '';
    this.planningLocationIds = '';
    this.idsPlanningLocationDeteted = '';
    this.userPlanningLocationList.data.filter(x => {
      if (x.isPLocationSelected == true) {
        iDs += `${x.userLocationListId},`;
        this.idsPlanningLocationDeteted += `${x.userLocationListId},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsPlanningLocationDeteted = this.idsPlanningLocationDeteted.substring(0, this.idsPlanningLocationDeteted.length - 1);
      this.planningLocationIds = iDs;
    }
  }
  selectedOrganizationId: number;
  getOrganizationId(value: any) {
    this.selectedOrganizationId = value;
    this.usersViewModel.orgnizationId = value;
    
  }
}
