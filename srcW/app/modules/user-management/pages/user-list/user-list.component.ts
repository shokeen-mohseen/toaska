import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthService, CommonPaginatorListViewModel, CommonStatusListViewModel, PeriodicElement, UseraccessService, UserConstant, UsersViewModel, UserRolesListViewModel, CommonCallListViewModel, UsersContactViewModel, UsersAddressViewModel, AddressCallListViewModel, UserLocationListViewModel } from '@app/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { ExistingUserComponent } from './existing-user/existing-user.component';
import { SubscriptionPromotionService } from '@app/modules/plan/pages/services/subscription-promotion.services';

import { projectkey } from 'environments/projectkey';
//import { getExistingUsersActions, getNewUsersActions, getLockedUsersActions, getDeclinedUsersActions } from '../../../../shared/components/top-btn-group/page-actions-map';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '../../../../shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  modalRef: NgbModalRef;
  commonStatusListViewModel: CommonStatusListViewModel = new CommonStatusListViewModel();
  //commonCallListViewModel: CommonCallListViewModel = new CommonCallListViewModel();
  commonCallListViewModel: CommonPaginatorListViewModel = new CommonPaginatorListViewModel();
  data = new MatTableDataSource<PeriodicElement>();
  size: number = 1;
  sizeLocation: number = 1;
  dataNewUser = new MatTableDataSource<PeriodicElement>();
  sizeNewUser: number = 1;
  userContactServiceSubcriber: Subscription;
  usersViewModelIdList: UsersViewModel[] = [];
  userRolesList: UserRolesListViewModel[] = [];
  userContactList: UsersContactViewModel[] = [];
  userAddressList: UsersAddressViewModel[] = [];
  //userPlanningLocationList: UserLocationListViewModel[] = [];
  userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>();
  mobilePhoneCode: string;
  addressName: string;

  actionGroupConfig;

  IsTosca: boolean;

  constructor(
    public modalService: NgbModal, private useraccessService: UseraccessService,
    private router: Router,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
    private subscriptionService: SubscriptionPromotionService
  ) {
  
    this.existingUser();
  }
    ngAfterViewInit(): void {
      if (!!this.data.data && this.data.data.length > 0) {
        this.existingusers.dataSource = this.data;


      }

      if (!this.IsTosca) {
        //this.btnBar.hideTab('key_Home');
       // this.btnBar.enableAction('issue');
      }

      this.btnBar.showAction('resetPassword');
      this.btnBar.hideTab('key_View');

  }

  initializationView(type: string) {
    this.commonCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.commonCallListViewModel.Action = type;
    this.getUser();
  }

  @ViewChild('userEdit') userEdit: EditUsersComponent;

  @ViewChild('existinguser') existingusers: ExistingUserComponent;

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  tab1: boolean = true;
  tab2: boolean = true;
  tab3: boolean = true;
  tab4: boolean = true;
  tab5: boolean = false;
  tab6: boolean = false;

  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  tab4Data: boolean = false;
  tab5Data: boolean = false;
  tab6Data: boolean = false;

  dataType: string = '';
  dataStatus: string = '';
  iDs: string = '';
  isActive: number = 0;
  isInActive: number = 0;
  isDelete: number = 0;
  userRoleCount: number = 0;

  existingUser() {
    this.size = 0;
    this.data = new MatTableDataSource<PeriodicElement>();
    this.tab1Data = true;
    this.initializationView(UserConstant.Active);
    //this.actionGroupConfig = getExistingUsersActions(this.IsTosca);

  }

  tabChange($event) {
    this.size = 0;
    this.isActive = 0;
    this.isInActive = 0;
    this.iDs = '';
    this.data = new MatTableDataSource<PeriodicElement>();
    if ($event.index === 0 && this.tab1) {
     this.existingUser();
      this.tab1Data = true;
      this.btnBar.showTab('key_Data');
      this.btnBar.showAction('active');
      this.btnBar.showAction('inactive');
      this.btnBar.showAction('resetPassword');
      this.btnBar.hideAction('approve');
      this.btnBar.hideAction('declined');
      this.btnBar.hideAction('unlock');
      this.btnBar.hideAction('accept');
    }
    else if ($event.index === 1 && this.tab2) {
      this.initializationView(UserConstant.NewUser)
      this.tab2Data = true;
      //this.actionGroupConfig = getNewUsersActions(this.IsTosca);
      this.btnBar.hideTab('key_Data');
      this.btnBar.hideAction('active');
      this.btnBar.hideAction('inactive');
      this.btnBar.hideAction('resetPassword');
      this.btnBar.showAction('approve');
      this.btnBar.showAction('declined');
      this.btnBar.hideAction('unlock');
      this.btnBar.hideAction('accept');
    }
    //else if ($event.index === 2) {
    //  this.initializationView(UserConstant.Locked)
    //  this.tab3Data = true;      
    //  //this.actionGroupConfig = getLockedUsersActions(this.IsTosca);
    //  this.btnBar.hideTab('key_Data');
    //  this.btnBar.hideAction('active');
    //  this.btnBar.hideAction('inactive');
    //  this.btnBar.hideAction('resetPassword');
    //  this.btnBar.hideAction('approve');
    //  this.btnBar.hideAction('declined');
    //  this.btnBar.showAction('unlock');
    //  this.btnBar.hideAction('accept');
    //}
    else if ($event.index === 2) {
      this.initializationView(UserConstant.Declined)
      this.tab4Data = true;
      //this.actionGroupConfig = getDeclinedUsersActions(this.IsTosca);
      this.btnBar.hideTab('key_Data');
      this.btnBar.hideAction('active');
      this.btnBar.hideAction('inactive');
      this.btnBar.hideAction('resetPassword');
      this.btnBar.hideAction('approve');
      this.btnBar.hideAction('declined');
      this.btnBar.hideAction('unlock');
      this.btnBar.showAction('accept');
    }
  }
  alertMessage: string;
  actionHandler(type) {
    
    if (type === "add") {
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5 = true;
      this.tab6 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab2Data = false;
      this.tab3Data = false;
      this.tab4Data = false;
      this.tab5Data = true;
      this.tab6Data = false;
      this.alertMessage = "User added suuccessfully!!!";
    }

    else {
      if (!!!this.iDs) {
        this.toastrService.warning('Please Select At least One User');
        return;
      }
      let ids: string = '';
      if (!!this.useraccessService.userAccess) {
        this.useraccessService.userAccess.subscribe((data: string) => {
          ids = data;
        });
        if (!(!!ids && ids.length > 0)) {         
            this.closeTab();
            return;
        }
      } else {
        this.closeTab();
        return;
      }
      this.selectCheckBox(ids);

      if (type === "edit") {
       
        this.usersViewModelIdList = [];
        if (!!this.iDs && this.iDs.length > 0)
          this.getUserByIds(this.iDs);
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab1Data = false;
        this.tab2Data = false;
        this.tab3Data = false;
        this.tab4Data = false;
        this.tab5Data = false;
        this.tab6Data = true;

        this.alertMessage = "User updated suuccessfully!!!";
      }
      else {
        if (this.dataType === 'existing' && type === "delete" ) {
          this.toastrService.warning("Existing User cann't be deleted.");
          return;
        }

        if (type === "delete" && this.isDelete == 1) {

          // TODO: 
        }
        else if (type === "export") {
          // TODO: 
        }
        else if (type === "active" && this.isInActive === 0) {
          return;
        }
        else if (type === "inactive" && this.isActive === 0) {
          return;
          // TODO:
        }
        else if (type === "unlock") {
          // TODO: 
        }
        else if (type === "approve") {
          this.alertMessage = "User approved successfully.";
          if (this.userRoleCount === 0) {
            this.toastrService.warning('There are no role assigned to the user. A role is required for the account approval.');
            return;
          }
        }
        else if (type === "accept") {
          this.alertMessage = "User accepted successfully.";
          // TODO: 
        }
        else if (type === "declined") {
          this.alertMessage = "User declined successfully.";
          // TODO:
        }
        else if (type === "resetPassword") {
          this.alertMessage = "Password reset successfully.";
          // TODO:
        }
        else if (type === "inactive") {
          this.alertMessage = "Inactivation successfull.";
        }
        else if (type === "active") {
          this.alertMessage = "activation successfull.";
        }
        this.commonStatusListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonStatusListViewModel.UpdateBy = this.authenticationService.currentUserValue.LoginId;
        this.commonStatusListViewModel.UpdateDateTimeBrowser = new Date(new Date().toLocaleString());
        this.commonStatusListViewModel.Action = type;
        this.commonStatusListViewModel.Ids = this.iDs;
        this.useraccessService.setUserStatusList(this.commonStatusListViewModel)
          .subscribe(result => {
          },
            error => {
              this.toastrService.error(error);
            },
            () => {
              if (this.tabGroup.selectedIndex == 0) {
                this.existingUser();
              }
              else if (this.tabGroup.selectedIndex == 1)  {
                this.AllNewUsers();
              }
              else if (this.tabGroup.selectedIndex == 2) {
                this.AllLockedUsers();
              }
              else if (this.tabGroup.selectedIndex == 3) {
                this.AllDeclinedUsers();
              }  
              if (type === "approve") {
                this.Alert(this.iDs);
              }
              this.toastrService.success(this.alertMessage);
              this.useraccessService.setGridUserDetails('');
            }
        );

        this.isActive = 0;
        this.isInActive = 0;
        this.isDelete = 0;
      }
    }
  }

  AllNewUsers() {
    this.size = 0;
    this.data = new MatTableDataSource<PeriodicElement>();
    this.tab2Data = true; //tab2
    this.initializationView(UserConstant.NewUser);
  }
  AllLockedUsers() {
    this.size = 0;
    this.data = new MatTableDataSource<PeriodicElement>();
    this.tab3Data = true;
    this.initializationView(UserConstant.Locked);
  }
  AllDeclinedUsers() {
    this.size = 0;
    this.data = new MatTableDataSource<PeriodicElement>();
    this.tab4Data = true;
    this.initializationView(UserConstant.Declined);
  }

  closeTab() {
    this.useraccessService.userAccessSubject.next(null);
    this.tab1 = true;
    this.tabGroup.selectedIndex = 0;
    this.tab2 = true;
    this.tab3 = true;
    this.tab4 = true;
    this.tab5 = false;
    this.tab6 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.tab4Data = false;
    this.tab5Data = false;
    this.tab6Data = false;
    this.iDs = '';
    this.existingUser();
  }


  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    //this.actionGroupConfig = getExistingUsersActions(this.IsTosca);
    this.actionGroupConfig = getGlobalRibbonActions();
  }


  ngOnDestroy(): void {
    if (!!this.userContactServiceSubcriber) {
      this.userContactServiceSubcriber.unsubscribe();
    }
  }

  getUser() {
    this.userContactServiceSubcriber = this.useraccessService.getUserStatusList(this.commonCallListViewModel)
      .subscribe(result => {
        this.data = new MatTableDataSource<PeriodicElement>(result.Data);
        this.size = result.RecordCount;
        if (!!this.data.data) {
          this.data.data.forEach(row => { row.IsSeleted = false; });
         
        }
        this.useraccessService.pageSize.next(this.size);
      });
  }

  getUserRoleLength(value: any) {    
    this.userRoleCount = value;
  }

  getUserByIds(ids: string) {
    this.userContactServiceSubcriber = this.useraccessService.getUserDetailByIdsList(ids)
      .subscribe(result => {
        var datas = result.Data;
        datas.forEach(row => {
          let usersViewModelId: UsersViewModel = new UsersViewModel();
          row.IsSeleted = false;
          usersViewModelId.userId = row.Id;
          usersViewModelId.clientId = row.ClientId;
          usersViewModelId.loginId = row.LoginId;
          usersViewModelId.firstName = row.FirstName;
          usersViewModelId.lastName = row.LastName;
          usersViewModelId.middleName = row.MiddleName;
          usersViewModelId.prefix = row.Prefix;
          usersViewModelId.suffix = row.Suffix;
          usersViewModelId.orgnizationId = row.OrgnizationId;
          usersViewModelId.createDateTimeBrowser = row.CreateDateTimeBrowser;
          usersViewModelId.createdBy = row.CreatedBy;
          usersViewModelId.updateDateTimeBrowser = row.UpdateDateTimeBrowser;
          usersViewModelId.updatebyTimeBrowser = !!row.UpdateDateTimeBrowser ? new Date(row.UpdateDateTimeBrowser).toLocaleString() : ''; 
          usersViewModelId.updatedBy = row.UpdatedBy;
          this.usersViewModelIdList.push(usersViewModelId);
        });
        if (this.usersViewModelIdList.length > 0) {
          this.userEdit.dataSource = this.usersViewModelIdList;
          this.userEdit.userId = this.usersViewModelIdList[0].userId;
          this.userEdit.loginId = this.usersViewModelIdList[0].loginId;
          this.userEdit.usersViewModel = this.usersViewModelIdList[0];
          this.userEdit.organizationByIdList(this.userEdit.userId);
          this.getUserContact();
          this.getUserAddressList();
          this.getUserRoleList();
          this.getPlanningLocationList();
        }
      });
  }

  getUserRoleList() {
    let userRolesListViewModel = new UserRolesListViewModel();
    userRolesListViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    userRolesListViewModel.userId = this.userEdit.userId;
    this.useraccessService.getUserRoleslistList(userRolesListViewModel).subscribe(y => {
      this.userRolesList = [];
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
  
  selectCheckBox(data: string) {
  
    this.dataType = '';
    this.dataStatus = '';
    this.iDs = '';
    this.isActive = 0;
    this.isInActive = 0;
    this.isDelete = 0;
    var values = data.split(',');
    if (values.length > 0) {
      values.forEach(x => {
        if (!!x) {
          const k = x.split('~');
          this.dataType += k[0] + ',';
          const k1 = k[1].split('#');
          this.dataStatus += k1[0] + ',';
          this.iDs += k1[1] + ',';
        }
      });
      if (this.dataType.length > 0)
        this.dataType = this.dataType.split(',')[0];
      if (this.dataStatus.length > 0) {
        this.dataStatus = this.dataStatus.substring(0, this.dataStatus.length - 1);
        let status: any;
        if (this.dataStatus.split(',').length > 1) {
          status = this.dataStatus.split(',');
          var filteredArray = status.filter(function (item, pos) {
            return status.indexOf(item) == pos;
          });
          if (filteredArray.length > 1) {
            status = '';
            filteredArray.map(x => {
              status += `${x},`;
            });
            status = status.substring(0, status.length - 1);
          } else {
            status = filteredArray[0];
          }
        } else {
          status = this.dataStatus;
        }
        if (status.split(',').length === 1) {        
          this.isActive = 0;
          this.isInActive = 0;
          // oppositive
          if (this.dataType === 'existing') {
            this.isActive = !(status == 'Active') ? 0 : 1;
            this.isInActive = !(status == 'Inactive') ? 0 : 1;
            // TODO: 
          }
          if (this.dataType === 'newUser') {
            //database hit for check the relationship with others tablse
            if (this.userRoleCount == 0) {
              this.userRoleCount = Number(status);
            }            
            if (this.userRoleCount > 0) {
              this.isDelete = 1;
            }           
          }
          if (this.dataType === 'locked') {
            //this.isActive = !(status[0] == 'active');
            //this.isInActive = !(status[0] == 'inactive');
          }
          if (this.dataType === 'declined') {
            //this.isActive = !(status[0] == 'active');
            //this.isInActive = !(status[0] == 'inactive');
          }
        }
      }
      if (this.dataType.length > 0)
        this.iDs = this.iDs.substring(0, this.iDs.length - 1);
    }
  }

  getUserContact() {
    let commonCallListViewModel = new CommonCallListViewModel()
    commonCallListViewModel.ContactActionType = UserConstant.ContactActionType;
    commonCallListViewModel.ContactById = this.userEdit.userId;
    this.useraccessService.getUserContactList(commonCallListViewModel)
      .pipe()
      .subscribe(result => {
        this.userContactList = [];
        const rowList = result.data;
        if (!!rowList) {
          this.mobilePhoneCode = !!rowList[0].mobilePhone ? rowList[0].mobilePhoneCountryCode + " " + rowList[0].mobilePhone :
            !!rowList[0].workPhone ? rowList[0].workPhoneCountryCode + " " + rowList[0].workPhone : '';
          this.userEdit.mobilePhoneCode = this.mobilePhoneCode;
          rowList.filter(item => {
            let userContactExist = new UsersContactViewModel();
            userContactExist = item;
            userContactExist.isSelected = false;
            this.userContactList.push(userContactExist);
          });
        }
      });
  }

  getUserAddressList() {
    let commonCallListViewModel = new AddressCallListViewModel()
    commonCallListViewModel.AddressActionType = UserConstant.ContactActionType;
    commonCallListViewModel.AddressbyId = this.userEdit.userId;
    this.useraccessService.getUserAddressList(commonCallListViewModel)
      .pipe()
      .subscribe(result => {
        this.userAddressList = [];
        const rowList = result.data;
        if (!!rowList) {
          this.addressName = rowList[0].name + " " +  rowList[0].countryCode + " " + rowList[0].countryName + " "
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


  getPlanningLocationList() {
    let userRolesListViewModel = new UserLocationListViewModel();
    userRolesListViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    userRolesListViewModel.userId = this.userEdit.userId;
    this.useraccessService.getPlanningLocationList(userRolesListViewModel).subscribe(y => {
      let userPlanningLocationList: UserLocationListViewModel[] = [];
      this.userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>([]);
      this.sizeLocation = 0;
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
          this.sizeLocation = item.PlaninglocationCount;
          userPlanningLocationList.push(userPlanningLocationExist);
        });
        this.userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>(userPlanningLocationList);
      }
    });
  }

  Alert(UserIds) {
   
    var usersids = new Array();
    usersids = UserIds.split(",");
    for (let numval in usersids) {
     
      let Client = 100;
      let ClientId = null;
      let Name = "Users";
      let EntityID: number;
      let UserAlertID: number;
      // let entityId: number;
      this.subscriptionService.getEntityDetails(ClientId, Name).subscribe(res => {
      
        if (res.message == "Success") {
          EntityID = res.data.id;
          // alert(res.data.id);
          Name = "LAMPS: User Registration - Approval";
          this.subscriptionService.getUserAlertDetails(ClientId, Name).subscribe(result => {
           
            if (result.message == "Success") {
              UserAlertID = result.data.id;
              let EntityKeyId = Number(usersids[numval]);

              this.subscriptionService.SaveAlertSystem(UserAlertID, EntityID, EntityKeyId, Client).subscribe(res => {
                if (res.message == "Success") {
                  
                }
              });
            }
          });
        }
      });
    }
  }
}
