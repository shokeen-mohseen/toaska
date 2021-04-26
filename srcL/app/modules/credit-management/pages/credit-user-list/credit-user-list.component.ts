import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { CreditSummaryCM } from '@app/core/models/creditManagementOrder.model';
import { AuthService } from '@app/core';
import { Router } from '@angular/router';
import { CreditManagementService } from '@app/core/services/CreditManagement.service';

@Component({
  selector: 'app-credit-user-list',
  templateUrl: './credit-user-list.component.html',
  styleUrls: ['./credit-user-list.component.css']
})
export class CreditUserListComponent implements OnInit, AfterViewInit {

  ItemList = [];
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  CreditUserList: string = "CreditManagementExport";
  creditSelected: CreditSummaryCM;
  modalRef: NgbModalRef;
  IsTosca: boolean;
  //toastrService: any;
  constructor(
    private router: Router,
    public modalService: NgbModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private creditManagementService: CreditManagementService
  ) {

  }



  ngOnInit(): void {
    this.buttonPermission();
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;

    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }

  ngAfterViewInit() {
    this.btnBar.showAction('showDetails');
    this.btnBar.showAction('invoice');
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

  selectedListValues(event) {
    this.ItemList = event;
    // console.log(" Parent = ", this.ItemList);
  }

  modulesToSelect() {
    return this.ItemList;
  }
  modulesToEdit() {
    debugger;
    return this.ItemList;
  }

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;


  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
    else if ($event.index === 2) {
      this.tab3Data = true;
    }
  }


  actionHandler(type) {
    if (type === "showDetails") {

      if (!!this.ItemList && this.ItemList.length == 1) {
        this.tab1 = true;
        this.tab2 = true;
        this.tab3 = false;
        this.tabGroup.selectedIndex = 1;
        this.tab1Data = false;
        this.tab3Data = false;
        this.tab2Data = true;
        console.log(this.ItemList);
      }
      else if (!!this.ItemList && this.ItemList.length == 0) {
        this.toastrService.warning('Please select one item to see its order');
        return;
      }
      else if (!!this.ItemList && this.ItemList.length > 1) {
        this.toastrService.warning('Please select one only one item to see its order');
        return;
      }
    }
    else if (type === "invoice") {

      if (!!this.ItemList && this.ItemList.length == 1) {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;
      }
      else if (!!this.ItemList && this.ItemList.length == 0) {
        this.toastrService.warning('Please select one item to see its invoice');
        return;
      }
      else if (!!this.ItemList && this.ItemList.length > 1) {
        this.toastrService.warning('Please select one only one item to see its invoice');
        return;
      }
    }
    else if (type === "export") {

    }
  }

  closeTab() {

    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
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
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all
          if (data != null || data != undefined) {
            if (data.length != 0) {
              if (!data || data[0].PermissionType == "Read and Modify") {
                // this.btnBar.enableAction('showDetails');
                this.creditManagementService.Permission = true;
              }
              else {
                //  this.btnBar.disableAction('showDetails');
                this.creditManagementService.Permission = false;
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
      });

  }
}



