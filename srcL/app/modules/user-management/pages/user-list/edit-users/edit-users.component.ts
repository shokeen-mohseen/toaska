import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddressCallListViewModel, AuthService, CommonCallListViewModel, UseraccessService, UserConstant, UserLocationListViewModel, UserRolesListViewModel, UsersAddressViewModel, UsersContactViewModel, UsersViewModel } from '@app/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddContactComponent } from 'app/shared/components/modal-content/add-contact/add-contact.component';
import { AddEditAddressComponent } from 'app/shared/components/modal-content/add-edit-address/add-edit-address.component';
import { AddEditPlanningLocationComponent } from 'app/shared/components/modal-content/add-edit-planning-location/add-edit-planning-location.component';
import { AddEditRoleComponent } from 'app/shared/components/modal-content/add-edit-role/add-edit-role.component';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';


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
  @Output() selectedUseratEdit: EventEmitter<any> = new EventEmitter<any>();
  userRolesListViewModel: UserRolesListViewModel = new UserRolesListViewModel();
  isRoleAllSelected: boolean = false;
  roleIds: string;
  isContactAllSelected: boolean = false;
  contactIds: string;
  @Input() mobilePhoneCode: string;
  pageActionType: string;
  lastUpdate: string;
  @Input() userAddressList: UsersAddressViewModel[] = [];
  isAddressAllSelected: boolean = false;
  addressIds: string;
  @Input() addressName: string;
  @Output() userRoleLength: EventEmitter<any> = new EventEmitter();
  @Output() isEditPage: EventEmitter<any> = new EventEmitter();
  userPlanningLocationViewModel: UserLocationListViewModel = new UserLocationListViewModel();
  isPlanningLocationAllSelected: boolean = false;
  planningLocationIds: string;
  isEditNextuser: boolean;
  displayedColumns = ['userLocationListId', 'LocationTypeName', 'LocationName'];
  displayedColumnsRoles = ['userRolesListId', 'userLogin', 'roleName'];
  displayedColumnsAddress = ['userAddressId', 'addressTypeName', 'name'];
  displayedColumnsContact = ['userContactId', 'firstName', 'email','mobilePhone'];
  @Input() userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<UserLocationListViewModel>(true, []);
  @Input() size: number = 0;
  @Input() currentTab: string = "";
  IsSave: boolean;
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

    let m1 = moment(new Date(new Date().toISOString()).toLocaleString()).format('MMMM DD, YYYY hh:mm A');
      let timeZone = moment.tz.guess();
    var timeZoneOffset = new Date(new Date(new Date().toISOString()).toLocaleString()).getTimezoneOffset();
      timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);

    this.localTimeStr = m1 + " " + timeZone;


    //this.localTimeStr = new Date(new Date().toISOString()).toLocaleString();
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
    this.isEditPage.emit(1);
  }

  onSubmit() {
    this.IsSave = true;
    this.UpdateUser();
    
  }
  //converttoSqlStringWithT(vdatetime) {
  //  if (vdatetime != null) {
  //    let dt = new Date(vdatetime);
  //    var date = dt.getDate();
  //    var month = dt.getMonth();
  //    var year = dt.getFullYear();
  //    var hour = dt.getHours();
  //    var minutes = dt.getMinutes();
  //    var hour1 = hour.toString().padStart(2, "0");
  //    var minutes1 = dt.getMinutes().toString().padStart(2, "0");
  //    var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + date.toString().padStart(2, "0") + "T" + hour1 + ":" + minutes1 + ":00.000")
  //    return datestring;
  //  }
  //  return null;
  //}
  //setDateMMddyyyy(date: Date) {

  //  return new Date(`${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`);
  //}
  convertDatetoStringDate(selectedDate: Date) {

    try {
      var date = selectedDate.getDate();
      var month = selectedDate.getMonth() + 1;
      var year = selectedDate.getFullYear();

      var hours = selectedDate.getHours();
      var minuts = selectedDate.getMinutes();
      var seconds = selectedDate.getSeconds();

      return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();
    }
    catch (e) {
      var dateNew = new Date(selectedDate);
      var datedd = dateNew.getDate();
      var monthmm = dateNew.getMonth() + 1;
      var yearyy = dateNew.getFullYear();

      var hourshh = dateNew.getHours();
      var minutsmm = dateNew.getMinutes();
      var secondsss = dateNew.getSeconds();

      return yearyy.toString() + "-" + monthmm.toString() + "-" + datedd.toString() + " " + hourshh.toString() + ":" + minutsmm.toString() + ":" + secondsss.toString();


    }


  }
  openPopup(action) {
    if (action === "addAddressButton") {
      this.modalRef = this.modalService.open(AddEditAddressComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = UserConstant.ContactActionType;
      this.modalRef.componentInstance.getAddresById = this.usersViewModel.userId;
      this.modalRef.componentInstance.isEditRights = true;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserAddressList();
      });
      this.btn = 'btn1';
    }
    else if (action === "editAddressButton") {
      if (!!!this.addressIds) {
        this.toastrService.warning('Please select at least one address');
        return;
      } else if (!!this.contactIds) {
        const splitaddressIds = this.addressIds.split(',');
        if (splitaddressIds.length > 1) {
          this.toastrService.warning('Please select only one address for editing');
          return;
        }
      }
      this.modalRef = this.modalService.open(AddEditAddressComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = UserConstant.ContactActionType;
      this.modalRef.componentInstance.getAddresById = this.usersViewModel.userId;
      this.modalRef.componentInstance.addressIds = this.addressIds;
      this.modalRef.componentInstance.isEdit = true;
      this.modalRef.componentInstance.isEditRights = true;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserAddressList();
      });  
      
      this.btn = 'btn2'
    }
    else if (action === "deleteAddressButton") {
      if (!!!this.addressIds) {
        this.toastrService.warning('Please select at least one address');
        return;
      }
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
      this.useraccessService.deleteUseAddressListByIds(this.idsAddressDeteted, this.authenticationService.currentUserValue.LoginId, UserConstant.ContactActionType).subscribe(x => {
        this.getUserAddressList();
        this.addressIds = "";
        this.toastrService.success('User address deleted successfully');
      });
        this.btn = 'btn3';
         }, (reason) => {
      }); 
    }

    else if (action === "addRolesButton") {
      this.modalRef = this.modalService.open(AddEditRoleComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.userId = this.usersViewModel.userId;
      this.modalRef.componentInstance.loginId = this.usersViewModel.loginId;
      this.modalRef.componentInstance.actionType = action;
      this.modalRef.componentInstance.currentTab = this.currentTab;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserRoleList();
      });
      this.btn = 'btn4'
    }
    else if (action === "deleteRolesButton") {      
      if (!!!this.roleIds) {
        this.toastrService.warning('Please select at least one User Role');
        return;
      }
      else if ((this.currentTab == "" || this.currentTab == "Existing") && this.isRoleAllSelected) {
        this.toastrService.warning('All roles of Existing User can not be deleted');
        return;
      }
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
      this.useraccessService.deleteUserRoleslistListByIds(this.idsDeteted, this.usersViewModel.loginId).subscribe(x => {
        this.getUserRoleList();
        this.roleIds = "";
        this.toastrService.success('User Role deleted successfully');
      });
        this.btn = 'btn6';
      }, (reason) => {
      }); 
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
        this.toastrService.warning('Please select at least one Planning Location');
        return;
      }
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
      this.useraccessService.deleteUserPlanningLocationListByIds(this.idsPlanningLocationDeteted, this.usersViewModel.loginId).subscribe(x => {
        this.getPlanningLocationList();
        this.planningLocationIds = "";
        this.toastrService.success('Planning Location deleted successfully');
      });
        this.btn = 'btn9';
      }, (reason) => {
      }); 
    }

    else if (action === "addContactButton") {
      this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
      //let commonCallListViewModel = new CommonCallListViewModel();
      this.modalRef.componentInstance.contactActionType = UserConstant.ContactActionType;
      this.modalRef.componentInstance.getContactById = this.usersViewModel.userId;
      this.modalRef.componentInstance.userId = this.usersViewModel.userId;
      this.modalRef.componentInstance.isEditRights = true;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserContact();
      });
      this.btn = 'btn10';
    }
    else if (action === "editContactButton") {
      
      if (!!!this.contactIds) {
        this.toastrService.warning('Please select at least one Contact');
        return;
      } else if (!!this.contactIds) {
        const splitContactIds = this.contactIds.split(',');
        if (splitContactIds.length > 1) {
          this.toastrService.warning('Please select only one Contact for editing');
          return;
        }
      }
      this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = UserConstant.ContactActionType;
      this.modalRef.componentInstance.getContactById = this.usersViewModel.userId;
      this.modalRef.componentInstance.contactIds = this.contactIds;
      this.modalRef.componentInstance.userId = this.usersViewModel.userId;
      this.modalRef.componentInstance.isEditRights = true;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getUserContact();
      });      
      this.btn = 'btn11'
    }
    else if (action === "deleteContactButton") {
      this.btn = 'btn12'
     
      if (!!!this.contactIds) {
        this.toastrService.warning('Please select at least one Contact');
        return;
      }
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
      this.useraccessService.deleteUserContactListByIds(this.idsContactDeteted, this.authenticationService.currentUserValue.LoginId).subscribe(x => {
        this.getUserContact();
        this.contactIds = "";
        this.toastrService.success('User Contact deleted successfully');
      });
    }, (reason) => {
    }); 
    }
  }

  selectNext() {
    this.IsSave = false;
    if (this.dataSource.length - 1 > this.next) {
      this.UpdateUser();
      if (this.dataSource[this.next].userId > 0) {
        this.dataSource[this.next] = this.usersViewModel;
      }
      this.next += 1;
      this.setUserDetails(this.next);
    }
    
    this.EnableDisableEditNextOrderBtn(this.next);
       
  }

  EnableDisableEditNextOrderBtn(index: number) {
    if (index >= this.dataSource.length - 1) {
      //diseble
      this.isEditNextuser = true;
    }
    else {
      //enable
      this.isEditNextuser = false;
    }
  }

  selectPrev() {
    if (0 < this.next) {
      if (!!this.usersViewModel.loginId) {
        this.dataSource[this.next] = this.usersViewModel;
      }
      this.next -= this.dataSource.length - 1;
      this.setUserDetails(this.next);
    }
  }

  selectedUser(index: number) {    
    this.next = index;
    this.setUserDetails(this.next);
  }
  //selectedUseratEdit: number = 0;
  
  setUserDetails(index: number) {
    const nextResult = this.dataSource[this.next];
    this.userId = nextResult.userId;
    this.usersViewModel = nextResult;
    this.getUserContact();
    this.getUserAddressList();
    this.getUserRoleList();
    this.getUserAddressList();
    this.getPlanningLocationList();
    //this.selectedUseratEdit = this.userId;
    this.selectedUseratEdit.emit(this.userId);
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
    
    this.addressName = "";
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
          this.addressName = rowList[0].name + " " + rowList[0].countryName + ", "
            + rowList[0].stateName + ", " + rowList[0].cityName + " " + rowList[0].zipCode;
          
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
    this.mobilePhoneCode = "";
    let commonCallListViewModel = new CommonCallListViewModel()
    commonCallListViewModel.ContactActionType = UserConstant.ContactActionType;
    commonCallListViewModel.ContactById = this.userId;
    commonCallListViewModel.UserId = this.userId; 
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
    //this.userPlanningLocationViewModel.pageNo = this.paginator.pageIndex;
    //this.userPlanningLocationViewModel.pageSize = this.paginator.pageSize;

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

  UpdateUser() {
    
    let data: UsersViewModel[] = [];
    let OutResult: UsersViewModel[] = [];
    let dataResult: UsersViewModel[] = [];
    this.dataSource.map(row => {
      let usersView = Object.assign({}, row);
      usersView.clientId = this.authenticationService.currentUserValue.ClientId;
      usersView.updatedBy = this.authenticationService.currentUserValue.LoginId;
      //usersView.updateDateTimeBrowser = new Date(new Date().toISOString());
     // usersView.updateDateTimeBrowser = this.convertDatetoStringDate(new Date());
      usersView.updateDateTimeBrowserStr = this.convertDatetoStringDate(new Date());
    //  usersView.updateDateTimeBrowser = this.convertDatetoStringDate(new Date());//new Date(new Date().toISOString());
    //  usersView.createDateTimeBrowser = this.convertDatetoStringDate(new Date()); //new Date(new Date().toISOString());
      data.push(usersView);

    });

    OutResult.push(data[this.next]);
    //OutResult.map(row => {
    //  let usersView = Object.assign({}, row);
    //  dataResult.push(usersView);
    //});
    

    this.useraccessServiceSubcriber = this.useraccessService.addAllUser(OutResult).subscribe(x => {
      let items = x.Data;
      var dataResultSource: UsersViewModel[] = [];
      dataResultSource = [];
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
        this.usersViewModel.updatedBy = !!row.UpdatedBy ? row.UpdatedBy : row.LoginId;
        this.usersViewModel.updateDateTimeBrowser = row.UpdateDateTimeBrowser;//setDateMMddyyyy
        this.usersViewModel.updatebyTimeBrowser = !!row.UpdateDateTimeBrowser ? new Date(row.UpdateDateTimeBrowser).toLocaleString() : '';
      
        dataResultSource.push(this.usersViewModel);
      });
      if (this.IsSave) {
        this.dataSource[this.next].lastName = this.usersViewModel.lastName;
        this.dataSource[this.next].clientId = this.usersViewModel.clientId;
        this.dataSource[this.next].loginId = this.usersViewModel.loginId;
        this.dataSource[this.next].firstName = this.usersViewModel.firstName;
        this.dataSource[this.next].lastName = this.usersViewModel.lastName;
        this.dataSource[this.next].middleName = this.usersViewModel.middleName;
        this.dataSource[this.next].prefix = this.usersViewModel.prefix;
        this.dataSource[this.next].suffix = this.usersViewModel.suffix;
        this.dataSource[this.next].orgnizationId = this.usersViewModel.orgnizationId;
        this.dataSource[this.next].userId = this.usersViewModel.userId;
        this.dataSource[this.next].updatedBy = this.usersViewModel.updatedBy;
        this.dataSource[this.next].updateDateTimeBrowser = this.usersViewModel.updateDateTimeBrowser;//setDateMMddyyyy
        this.dataSource[this.next].updatebyTimeBrowser = this.usersViewModel.updatebyTimeBrowser;

      }
      else {
        this.dataSource[this.next - 1].lastName = this.usersViewModel.lastName;
        this.dataSource[this.next - 1].clientId = this.usersViewModel.clientId;
        this.dataSource[this.next - 1].loginId = this.usersViewModel.loginId;
        this.dataSource[this.next - 1].firstName = this.usersViewModel.firstName;
        this.dataSource[this.next - 1].lastName = this.usersViewModel.lastName;
        this.dataSource[this.next - 1].middleName = this.usersViewModel.middleName;
        this.dataSource[this.next - 1].prefix = this.usersViewModel.prefix;
        this.dataSource[this.next - 1].suffix = this.usersViewModel.suffix;
        this.dataSource[this.next - 1].orgnizationId = this.usersViewModel.orgnizationId;
        this.dataSource[this.next - 1].userId = this.usersViewModel.userId;
        this.dataSource[this.next - 1].updatedBy = this.usersViewModel.updatedBy;
        this.dataSource[this.next - 1].updateDateTimeBrowser = this.usersViewModel.updateDateTimeBrowser;//setDateMMddyyyy
        this.dataSource[this.next - 1].updatebyTimeBrowser = this.usersViewModel.updatebyTimeBrowser;

      }
      //this.dataSource.map(x => { 
      //  if (x.indexId == this.next -1) {
          
      //  }
      //});

      //this.dataSource.push(dataResultSource[0]);
      this.toastrService.success('User is updated successfully');
      this.usersViewModel = Object.assign({}, this.dataSource[this.next]);
      this.usersViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
      if (this.dataSource.length === this.next) {
        this.next = this.dataSource.length - 1;
      } /*else {
        this.next += (this.next - 1);
      }*/
      this.userId = this.dataSource[this.next].userId;
      this.loginId = this.dataSource[this.next].loginId;
    });
  }
}
