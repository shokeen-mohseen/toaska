/*
Developer Name: Vinay Kumar
File Created By: Vinay Kumar
Date: Aug 29, 2020
TFS ID: 17214
Logic Description: added user component vai cli command
Start Code
*/
import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';

import { UsersViewModel, UseraccessService, PeriodicElement, UsersViewModelId, AuthService, UserRolesListViewModel, UsersContactViewModel, CommonCallListViewModel, UserConstant, UsersAddressViewModel, UserLocationListViewModel, AddressCallListViewModel } from '@app/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  AddEditAddressComponent,
  AddEditRoleComponent,
  AddEditPlanningLocationComponent,
  AddContactComponent
} from '@app/shared';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit, OnDestroy {
  returnUrl: string;
  error: string;
  isLoading: boolean;
  useraccessServiceSubcriber: Subscription;
  modalRef: NgbModalRef;

  usersViewModel: UsersViewModel = new UsersViewModel();
  userId: number = 0;
  @Input() dataSource: UsersViewModel[] = [];
  @Input() userRolesList: UserRolesListViewModel[] = [];
  organizationlist = [];
  isExist = false;

  @Input() userAddressList: UsersAddressViewModel[] = [];
  @Input() userContactList: UsersContactViewModel[] = [];
  userRolesListViewModel: UserRolesListViewModel = new UserRolesListViewModel();
  isRoleAllSelected: boolean = false;
  roleIds: string;
  isContactAllSelected: boolean = false;
  contactIds: string;
  @Input() mobilePhoneCode: string;

  isAddressAllSelected: boolean = false;
  addressIds: string;
  @Input() addressName: string;

  userPlanningLocationViewModel: UserLocationListViewModel = new UserLocationListViewModel();
  isPlanningLocationAllSelected: boolean = false;
  planningLocationIds: string;

  displayedColumns = ['userLocationListId', 'LocationTypeName', 'LocationName'];
  @Input() userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<UserLocationListViewModel>(true, []);
  @Input() size: number = 0;

  next: number = 0;
  loginId: string;
  isSelectdRow: boolean = false;
  indexId: number = 0;
  localTimeStr: string;
  isUserId: number = 0;
  isFirstName: number = 0;
  isLastName: number = 0;
  isValidFirstName: number = 0;
  isValidMiddleName: number = 0;
  isValidLastName: number = 0;
  isEmail: boolean = false;
  idsDeteted: string = '';
  pageActionType: string;
  

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
    private formBuilder: FormBuilder,
    public modalService: NgbModal,
    private toastrService: ToastrService, private useraccessService: UseraccessService,
    private authenticationService: AuthService
  ) {
    this.sessionAssign();
    this.pageActionType = UserConstant.ContactActionType;
  }

  ngOnDestroy(): void {
    if (!!this.useraccessServiceSubcriber)
      this.useraccessServiceSubcriber.unsubscribe();
  }

  ngAfterViewInit() {
    //if (!!this.userPlanningLocationList.data) {

    /*this.userPlanningLocationList.sort = this.sort;
    this.paginator.length = this.size;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);


    this.paginator.page.pipe(
      tap(() => this.initializationView())
    )
      .subscribe();*/
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
    //this.buildForm();
  }

  sessionAssign() {
    this.usersViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.localTimeStr = new Date(new Date().toISOString()).toLocaleString();
    this.usersViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    this.usersViewModel.createdBy = this.authenticationService.currentUserValue.LoginId;
    this.usersViewModel.updateDateTimeBrowser = new Date(new Date().toISOString());
    this.usersViewModel.createDateTimeBrowser = new Date(new Date().toISOString());
  }

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
      this.btn = 'btn2';
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
      })
      this.btn = 'btn4';
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
      this.modalRef.componentInstance.ContactById = this.usersViewModel.userId;
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
      this.modalRef.componentInstance.ContactById = this.usersViewModel.userId;
      this.modalRef.componentInstance.contactIds = this.contactIds;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserContact();
      });
      this.btn = 'btn11';
    }
    else if (action === "deleteContactButton") {
      this.btn = 'btn12';
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

  onSubmit() {
    
    if (!this.validation()) {
      return;
    } else {
      if (this.addUser(true)) {
        let emailids = [];
        let data: UsersViewModel[] = [];
        this.dataSource.map(x => emailids.push(x.loginId));

        emailids.filter(item => {
          let index = this.dataSource.find(x => x.loginId === item);
          const rowIndex = data.findIndex(item => item.loginId === index.loginId);
          if (!!index && rowIndex === -1) {
            data.push(index);
          }
        });
        data[0].orgnizationId = this.selectedOrganizationId;
        this.useraccessServiceSubcriber = this.useraccessService.addAllUser(data).subscribe(x => {
          let items = x.Data;
          this.dataSource = [];
          this.indexId = 0;
          items.map(row => {
            this.usersViewModel.clientId = row.ClientId;
            this.usersViewModel.loginId = row.LoginId;
            this.usersViewModel.firstName = row.FirstName;
            this.usersViewModel.lastName = row.LastName;
            this.usersViewModel.middleName = row.MiddleName;
            this.usersViewModel.prefix = row.Prefix;
            this.usersViewModel.suffix = row.Suffix;
            this.usersViewModel.orgnizationId = row.OrgnizationId;
            this.usersViewModel.userId = row.Id;
            this.usersViewModel.indexId = this.indexId;
            this.usersViewModel.createDateTimeBrowser = row.CreateDateTimeBrowser;
            this.usersViewModel.createdBy = row.CreatedBy;
            this.usersViewModel.updateDateTimeBrowser = row.UpdateDateTimeBrowser;
            this.usersViewModel.updatedBy = row.UpdatedBy;
            this.dataSource.push(Object.assign({}, this.usersViewModel));
            this.indexId++;
          });
          this.toastrService.success('User has been save successfully');
          this.next = this.dataSource.length - 1;
          this.indexId = this.next;
          this.userId = this.dataSource[this.next].userId;
          this.loginId = this.dataSource[this.next].loginId;
          this.usersViewModel = Object.assign({}, this.dataSource[this.next]);
          this.sessionAssign();
          this.getUserContact();
          this.getUserAddressList();
          this.getUserRoleList();
          this.getPlanningLocationList();
        });
      }
    }
  }

  updateUser() {
    const index = this.dataSource.findIndex(x => x.loginId === this.usersViewModel.loginId);
    if (index > -1) {
      this.sessionAssign();
      this.dataSource[index] = this.usersViewModel;
      this.dataSource[index].userId = !!this.userId ? this.userId : 0;
      this.toastrService.success('User has been temporary update successfully');
      this.isSelectdRow = false;
      this.usersViewModel = Object.assign({}, new UsersViewModel());
      this.sessionAssign();
    }
  }

  existUser() {
    this.isExist = false;
    this.useraccessService.getAllUserByLoginIds(this.usersViewModel.loginId).subscribe(x => {
      if (x.Data.length > 0) {
        let row = x.Data;
        const rowIndex = row.findIndex(item => item.LoginId === this.usersViewModel.loginId);
        if (rowIndex > -1) {
          this.isExist = true;
        }
      }
    });
  }

  validateName(value) {
    let isNameValid = false;
    if (!!value) {
      const re = /^[A-Za-z]+$/;
      isNameValid = !(re.test(value));
    }
    return isNameValid;
  }

  addUser(isSubmit: boolean = false): boolean {
    //this.existUser();
    if (this.dataSource.filter(x => x.loginId === this.loginId && x.indexId !== this.next).length === 1) {
      this.toastrService.error('Already in current list');
      this.usersViewModel = Object.assign({}, new UsersViewModel());
      this.sessionAssign();
      this.next = this.dataSource.length - 1;
      this.indexId = this.next;
      this.loginId = this.dataSource[this.next].loginId;
      return false;
    }
    else if (this.dataSource.filter(x => x.loginId === this.loginId && x.indexId === this.next).length === 1 && (!isSubmit)) {
      this.loginId = this.usersViewModel.loginId;
      this.updateUser();
      this.isSelectdRow = false;
      return isSubmit;
    } else {
      if (this.isExist) {
        this.toastrService.error('Already in database');
        return false;
      }
      this.sessionAssign();
      if (this.indexId === 0 && this.dataSource.length === 1) {
        this.indexId += 1;
        this.next += 1;
      }
      this.loginId = this.usersViewModel.loginId;
      this.userId = this.usersViewModel.userId;
      this.usersViewModel.indexId = this.indexId;
      this.dataSource.push(Object.assign({}, this.usersViewModel));
      if (!isSubmit)
        this.toastrService.success('User has been temporary save successfully');
      this.isSelectdRow = false;
      return true;
    }
  }

  validation(type: any = ''): boolean {
    let isValidated: boolean = true;
    if (!!!this.usersViewModel.loginId && (type == 'loginId' || type == '')) {
      this.isUserId = 1;
      isValidated = false;
    } else {
      this.isUserId = 0;
    }
    if (this.validateEmail(this.usersViewModel.loginId) && (type == 'loginId' || type == '')) {
      isValidated =  false;
    }
    if (this.isUserId == 0 && isValidated && type == 'loginId') {
      this.existUser();
    }
    if (!!!this.usersViewModel.firstName && (type == 'firstName' || type == '')) {
      this.isFirstName = 1;
      isValidated =  false;
    } else {
      this.isFirstName = 0;
    }
    if (!!!this.usersViewModel.lastName && (type == 'lastName' || type == '')) {
      this.isLastName = 1;
      isValidated = false;
    } else {
      this.isLastName = 0;
    }
    if (this.isExist) {
      isValidated = false;
    }
    if (this.validateName(this.usersViewModel.firstName)) {
      this.isValidFirstName = 1;
      isValidated = false;
    } else {
      this.isValidFirstName = 0;
    }
    if (this.validateName(this.usersViewModel.lastName)) {
      this.isValidLastName = 1;
      isValidated = false;
    } else {
      this.isValidLastName = 0;
    }
    if (!!this.usersViewModel.middleName) {
      if (this.validateName(this.usersViewModel.middleName)) {
        this.isValidMiddleName = 1;
        isValidated = false;
      } else {
        this.isValidMiddleName = 0;
      }
    }
      
    return isValidated;
  }


  selectNext() {
    if (!this.validation()) {
      return;
    } else {
      this.userId = this.usersViewModel.userId;
      this.loginId = this.usersViewModel.loginId;
      if (this.dataSource.length === 0) {
        // Add
        this.addUser();
        this.usersViewModel = Object.assign({}, new UsersViewModel());
        this.sessionAssign();
        this.userId = this.usersViewModel.userId;
        this.getUserRoleList();
        this.indexId += 1;
      }
      else {
        if ((this.dataSource.length - 1) === this.next && !this.isSelectdRow) {
          const flag = this.addUser();
          this.usersViewModel = Object.assign({}, new UsersViewModel());
          this.sessionAssign();
          this.userId = this.usersViewModel.userId;
          this.getUserRoleList();
          if (flag) {
            this.next += 1;
            this.indexId += 1;
          }
        }
        else if ((this.dataSource.length) > this.next) {
          
          if (this.dataSource.filter(x => x.loginId === this.loginId && x.indexId !== this.next).length === 1) {
            this.toastrService.error('Already in current list');
            this.usersViewModel = Object.assign({}, new UsersViewModel());
            this.sessionAssign();
            this.next = this.dataSource.length - 1;
            this.indexId = this.next;
            this.loginId = this.dataSource[this.next].loginId;
            return false;
          }
          else if (this.dataSource.filter(x => x.loginId === this.loginId && x.indexId === this.next).length === 1) {
            this.updateUser();
            this.next += 1
            this.setUserDetails(this.next);
            this.indexId += 1;
          }
        }
        else {
          this.addUser();
          this.next += 1
          this.indexId += 1;
          this.usersViewModel = Object.assign({}, new UsersViewModel());
          this.sessionAssign();
          this.userId = this.usersViewModel.userId;
          this.getUserRoleList();
          this.isSelectdRow = false;
        }
      }
    }
  }

  selectPrev() {
    if (0 < this.next) {
      if (!!this.usersViewModel.loginId) {
        this.dataSource[this.next] = this.usersViewModel;
      }
      this.next -= 1;
      this.setUserDetails(this.next);
      this.loginId = this.usersViewModel.loginId;
      this.isSelectdRow = true;
      this.indexId -= 1;
    }
  }

  selectedUser(index: number) {
    this.next = index;
    this.setUserDetails(this.next);
    this.indexId = this.next;
    this.isSelectdRow = true;
  }

  setUserDetails(index: number) {
    const nextResult = this.dataSource[this.next];
    this.userId = nextResult.userId;
    this.loginId = nextResult.loginId;
    this.usersViewModel = Object.assign(new UsersViewModel(), nextResult);
    this.getUserContact();
    this.getUserAddressList();
    this.getUserRoleList();
    this.getPlanningLocationList();
    this.organizationByIdList(this.usersViewModel.orgnizationId);
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

  loginForm: FormGroup;
  get f() {
    return this.loginForm.controls;
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      loginId: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validateEmail(email) {
    this.isEmail = false;
    if (!!email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.isEmail = !(re.test(String(email).toLowerCase()));
    }
    return this.isEmail;
  }

  getUserRoleList() {
    this.userRolesList = [];
    if (!!this.usersViewModel.userId && this.usersViewModel.userId > 0) {
      let userRolesListViewModel = new UserRolesListViewModel();
      userRolesListViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
      userRolesListViewModel.userId = this.usersViewModel.userId;
      this.isRoleAllSelected = false;
      this.useraccessService.getUserRoleslistList(userRolesListViewModel).subscribe(y => {
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
          });
        }
      });
    }
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

  getUserContact() {
    let commonCallListViewModel = new CommonCallListViewModel()
    commonCallListViewModel.ContactActionType = UserConstant.ContactActionType;
    commonCallListViewModel.ContactById = this.userId;
    this.isContactAllSelected = false;
    this.useraccessService.getUserContactList(commonCallListViewModel)
      .pipe()
      .subscribe(result => {
        this.userContactList = [];
        const rowList = result.data;
        if (!!rowList) {
          
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

  getUserAddressList() {
    let commonCallListViewModel = new AddressCallListViewModel()
    commonCallListViewModel.AddressActionType = UserConstant.ContactActionType;
    commonCallListViewModel.AddressbyId = this.userId;
    this.userAddressList = [];    
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

  ///
  ///
  getPlanningLocationList() {
    this.userPlanningLocationViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.userPlanningLocationViewModel.userId = this.usersViewModel.userId;
    this.userPlanningLocationViewModel.pageNo = this.paginator.pageIndex;
    this.userPlanningLocationViewModel.pageSize = this.paginator.pageSize;

    this.useraccessService.getPlanningLocationList(this.userPlanningLocationViewModel).subscribe(y => {
      let userPlanningLocationList: UserLocationListViewModel[] = [];
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
