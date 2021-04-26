import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthService, CommonPaginatorListViewModel, CommonStatusListViewModel, PeriodicElement, UseraccessService, UserConstant, UsersViewModel, UserRolesListViewModel, CommonCallListViewModel, UsersContactViewModel, UsersAddressViewModel, AddressCallListViewModel, UserLocationListViewModel, User, Role } from '@app/core';
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
import moment from 'moment';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  modalRef: NgbModalRef;
  UserMangementList: string = "UserManagementExport";
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
  userRolesListById: UserRolesListViewModel[] = [];
  userContactList: UsersContactViewModel[] = [];
  userAddressList: UsersAddressViewModel[] = [];
  //userPlanningLocationList: UserLocationListViewModel[] = [];
  userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>();
  mobilePhoneCode: string;
  currentSelectedTab: string = '';
  addressName: string;
  currentRole: string;
  actionGroupConfig;
  currentUser: User;
  IsTosca: boolean;
  ResetPasswordBtn: boolean = false;
  constructor(
    public modalService: NgbModal, private useraccessService: UseraccessService,
    private router: Router,
    private authenticationService: AuthService,
    private toastrService: ToastrService,    
    private subscriptionService: SubscriptionPromotionService
  ) {

    this.existingUser();    
    //this.currentUser = this.authenticationService.currentUserValue;
    
    //this.currentRole = this.authenticationService.currentUserValue.Role;
    //alert(this.currentRole);
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
    this.getPageSize(type);
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
  iDsWithRoleCount: string = '';
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
    //this.currentSelectedTab = 'Existing';
  }

  tabChange($event) {
    this.size = 0;
    this.isActive = 0;
    this.isInActive = 0;
    this.iDs = '';
    this.data = new MatTableDataSource<PeriodicElement>();
    if ($event.index === 0 && this.tab1) {
      this.existingUser();
      this.currentSelectedTab = 'Existing';
      this.tab1Data = true;
      this.btnBar.showTab('key_Data');
      this.btnBar.showAction('active');
      this.btnBar.showAction('inactive');
      this.btnBar.showAction('resetPassword');
      this.btnBar.hideAction('approve');
      this.btnBar.hideAction('declined');
      this.btnBar.hideAction('unlock');
      this.btnBar.hideAction('accept');
      this.btnBar.showTab('key_Action');
    }
    if ($event.index === 1 && this.tab6) {
      this.btnBar.hideTab('key_Action');
    }
    else if ($event.index === 1 && this.tab2) {
      this.initializationView(UserConstant.NewUser)
      this.tab2Data = true;
      //this.actionGroupConfig = getNewUsersActions(this.IsTosca);
      this.currentSelectedTab = 'New';
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
      this.currentSelectedTab = 'Declined';
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
  async actionHandler(type) {

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
      this.btnBar.hideTab('key_Action');
      this.alertMessage = "User added successfully.";
    }
    else {
      if (type != "alerts" && type != "issue" && type != "changePassword" && type != "share" && type != "feedback" && type != "export") {
        if (!!!this.iDs) {
          this.toastrService.warning('Please select at least one User.');
          return;
        }
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
        this.btnBar.hideTab('key_Action');
        this.alertMessage = "User is updated successfully.";
      }
      else {
        if (this.dataType === 'existing' && type === "delete") {
          this.toastrService.warning("Existing User cannot be deleted.");
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
          //if (this.userRoleCount === 0) {
          //  this.toastrService.warning('There are no roles assigned to the user. A role is required for the account approval');
          //  return;
          //}
          var selectedUserIdEdit;
          if (this.isPageEdit && (this.selectedUserIdatEdit == 0)) {            
            var x = this.iDs.split(',');
            if (x.length > 0) {
              selectedUserIdEdit = x[0];
            }
            else {
              selectedUserIdEdit = this.iDs;
            }

          }
          else if (this.isPageEdit && (this.selectedUserIdatEdit != 0)) {            
            selectedUserIdEdit = String(this.selectedUserIdatEdit);
          }
          if (!this.isPageEdit) {
            var values = this.iDsWithRoleCount.split(',');
            if (values.length > 0) {
              this.iDs = '';
              values.forEach(x => {
                if (!!x) {
                  const k1 = x.split('#');
                  if (Number(k1[0]) > 0) {
                    this.iDs += k1[1] + ',';
                  }
                }
              });
              this.iDs = this.iDs.substring(0, this.iDs.length - 1);
              if (this.iDs == "") {
                this.toastrService.warning('There are no roles assigned to the user. A role is required for account approval.');
                return;
              }
            }
          }
          else {
            await this.getUserRoleListbyId(Number(selectedUserIdEdit));
            if (this.userRolesListById.length === 0) {
              this.toastrService.warning('There are no roles assigned to the user. A role is required for account approval.');
              return;
            }
            else {
              this.iDs = selectedUserIdEdit;
            }            
          }          
        }
        else if (type === "accept") {
          this.alertMessage = "User approved successfully.";
          // TODO: 
        }
        else if (type === "declined") {
          this.alertMessage = "User declined successfully.";
          // TODO:
        }
        else if (type === "resetPassword") {
          if (this.ResetPasswordBtn) {
            this.alertMessage = "Password reset successfully.";
          }
          else {
            this.toastrService.error("User don't have the permission to reset the password.");
            return;
          }
          // TODO:
        }
        else if (type === "inactive") {
          this.alertMessage = "User de-activated successfully.";
        }
        else if (type === "active") {
          this.alertMessage = "User activated successfully.";
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
              else if (this.tabGroup.selectedIndex == 1) {
                this.AllNewUsers();
              }
              else if (this.tabGroup.selectedIndex == 2) {
                this.AllDeclinedUsers();
              }
              else if (this.tabGroup.selectedIndex == 3) {
                this.AllLockedUsers();
              }
              if (type === "approve") {
                this.Alert(this.iDs);
              }
              if (type === "delete") {
                this.alertMessage ="User deleted successfully."
                this.toastrService.success(this.alertMessage);
              }
              else {
                this.toastrService.success(this.alertMessage);
              }
              
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
    this.btnBar.showTab('key_Action');
    //this.existingUser();
    if (this.currentSelectedTab == 'Existing') {
      this.tabGroup.selectedIndex = 0;
      this.existingUser();
      //this.currentSelectedTab = 'Existing';
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
    else if (this.currentSelectedTab == 'New') {
      this.tabGroup.selectedIndex = 1;
      this.initializationView(UserConstant.NewUser)
      this.tab2Data = true;

      //this.actionGroupConfig = getNewUsersActions(this.IsTosca);
      //this.currentSelectedTab = 'New';
      this.btnBar.hideTab('key_Data');
      this.btnBar.hideAction('active');
      this.btnBar.hideAction('inactive');
      this.btnBar.hideAction('resetPassword');
      this.btnBar.showAction('approve');
      this.btnBar.showAction('declined');
      this.btnBar.hideAction('unlock');
      this.btnBar.hideAction('accept');
    }
    else if (this.currentSelectedTab == 'Declined') {
      this.tabGroup.selectedIndex = 2;
      this.initializationView(UserConstant.Declined)
      this.tab4Data = true;
      //this.currentSelectedTab = 'Declined';
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


   async ngOnInit() {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    //this.actionGroupConfig = getExistingUsersActions(this.IsTosca);
    this.actionGroupConfig = getGlobalRibbonActions();    
    await this.checkUserRole();
    this.buttonPermission();
  }


  ngOnDestroy(): void {
    if (!!this.userContactServiceSubcriber) {
      this.userContactServiceSubcriber.unsubscribe();
    }
  }

  async getPageSize(type: string) {
    
    var commonCallListViewModel = new CommonPaginatorListViewModel();
    this.commonCallListViewModel.pageNo = 0;
    this.commonCallListViewModel.pageSize = 0;
    this.commonCallListViewModel.filterOn = "";
    this.commonCallListViewModel.Action = type;
    this.commonCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    await this.useraccessService.getUsersStatusList(this.commonCallListViewModel).toPromise()
      .then(result => {
        this.commonCallListViewModel.itemsLength = result.RecordCount;
      });
    // default page size
    
    this.commonCallListViewModel.pageSize = await this.useraccessService.getDefaultPageSize();
    this.commonCallListViewModel.pageSizeOptions.push(this.commonCallListViewModel.pageSize);
  }

  getUser() {
    this.userContactServiceSubcriber = this.useraccessService.getUsersStatusList(this.commonCallListViewModel)
      .subscribe(result => {
        this.data = new MatTableDataSource<PeriodicElement>(result.Data);
     this.size=   this.commonCallListViewModel.itemsLength = result.RecordCount;
        if (!!this.data.data) {
          this.data.data.forEach(row => { row.IsSeleted = false; });

        }
       this.useraccessService.pageSize.next(this.size);
       
      });
    
  }
  selectedUserIdatEdit: Number = 0;
  isPageEdit: boolean = false;
  getUserRoleLength(value: any) {    
    this.userRoleCount = value;
  }
  getUserIdfromEdit(value: any) {
    this.selectedUserIdatEdit = value;

  }
  getPageName(value: any) {
    if (value = 1) {
      this.isPageEdit = true;
    }
  }
  getEditClick(value: any) {
    if (value = 1) {
      this.isPageEdit = false;
    }
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
          //usersViewModelId.updatebyTimeBrowser = this.useraccessService.getLocalDateTime((row.UpdateDateTimeServer == null || row.UpdateDateTimeServer == "") ? row.CreateDateTimeServer : row.UpdateDateTimeServer);
         
          usersViewModelId.updatedBy = row.UpdatedBy;
          this.usersViewModelIdList.push(usersViewModelId);
        });
        if (this.usersViewModelIdList.length > 0) {
          this.userEdit.dataSource = this.usersViewModelIdList;
          this.userEdit.userId = this.usersViewModelIdList[0].userId;
          this.userEdit.loginId = this.usersViewModelIdList[0].loginId;
          this.userEdit.usersViewModel = this.usersViewModelIdList[0];
          this.userEdit.organizationByIdList(this.userEdit.userId);

          let m1 = moment(this.usersViewModelIdList[0].updateDateTimeBrowser).format('MMMM DD, YYYY hh:mm A');
          let timeZone = moment.tz.guess();
          var timeZoneOffset = new Date(this.usersViewModelIdList[0].updateDateTimeBrowser).getTimezoneOffset();
          timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);

          this.userEdit.lastUpdate = m1 + " " + timeZone;
          


          this.getUserContact();
          this.getUserAddressList();
          this.getUserRoleList();
          this.getPlanningLocationList();
        }
      });
  }

  
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
  async checkUserRole() {
    let userRolesListViewModel = new UserRolesListViewModel();
    userRolesListViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    userRolesListViewModel.userId = this.authenticationService.currentUserValue.UserId;
    await this.useraccessService.getUserRoleslistList(userRolesListViewModel).toPromise().then(y => {
      this.userRolesList = [];
      const rowList = y.Data;
      if (!!rowList) {
        rowList.filter(item => {
          let userRolesExist = new UserRolesListViewModel();
          userRolesExist.userId = item.UserId;
          userRolesExist.userRolesListId = item.UserRolesListId;
          userRolesExist.roleId = item.RoleId;
          userRolesExist.roleName = item.RoleName;
          if (item.RoleName == "Administrator") {
            this.ResetPasswordBtn = true;
          }
          userRolesExist.clientId = item.ClientId
          userRolesExist.isSelected = false;
          userRolesExist.userLogin = item.UserLogin;
          this.userRolesList.push(userRolesExist);
        });
      }
    });
  }
  async getUserRoleListbyId(userId: any) {
    let userRolesListViewModel = new UserRolesListViewModel();
    userRolesListViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    userRolesListViewModel.userId = userId;
    await this.useraccessService.getUserRoleslistList(userRolesListViewModel).toPromise().then(y => {
      this.userRolesListById = [];
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
          this.userRolesListById.push(userRolesExist);


        });
      }

    });
  }



  selectCheckBox(data: string) {

    this.dataType = '';
    this.dataStatus = '';
    this.iDs = '';
    this.iDsWithRoleCount = '';
    this.isActive = 0;
    this.isInActive = 0;
    this.isDelete = 0;
    var values = data.split(',');
    if (values.length > 0) {
      values.forEach(x => {
        if (!!x) {
          const k = x.split('~');
          this.dataType += k[0] + ',';
          this.iDsWithRoleCount += k[1] + ',';
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
  


  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authenticationService.currentUserValue.UserId;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          if (data != null || data != undefined) {
            if (data.length > 0) {
              if (data[0].PermissionType == "Read and Modify") {
                this.btnBar.enableAction('add');
                this.btnBar.enableAction('edit');
                this.btnBar.enableAction('delete');
                this.btnBar.enableAction('active');
                this.btnBar.enableAction('inactive');
                if (this.ResetPasswordBtn) {
                  this.btnBar.enableAction('resetPassword');
                }
                else {
                  this.btnBar.disableAction('resetPassword');
                }
                
                this.btnBar.enableAction('approve');
                this.btnBar.enableAction('declined');
                this.btnBar.enableAction('unlock');
                this.btnBar.enableAction('accept');
              }
              else {
                this.btnBar.disableAction('add');
                this.btnBar.disableAction('edit');
                this.btnBar.disableAction('delete');
                this.btnBar.disableAction('active');
                this.btnBar.disableAction('inactive');
                this.btnBar.disableAction('resetPassword');
                this.btnBar.disableAction('approve');
                this.btnBar.disableAction('declined');
                this.btnBar.disableAction('unlock');
                this.btnBar.disableAction('accept');
              }
            }
            else {
              this.router.navigate(['/unauthorized']);
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }
}
