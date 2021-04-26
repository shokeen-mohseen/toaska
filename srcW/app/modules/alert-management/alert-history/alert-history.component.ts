import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { UserAlertHistory } from '../../../core/models/UserAlertHistory.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertHistortListComponent } from './alert-histort-list/alert-histort-list.component';
import { ConfirmDeleteTabledataPopupComponent } from '../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
@Component({
  selector: 'app-alert-history',
  templateUrl: './alert-history.component.html',
  styleUrls: ['./alert-history.component.css']
})
export class AlertHistoryComponent implements OnInit, AfterViewInit {
  modalRef: NgbModalRef; 
  UserAlertHistorySelected: UserAlertHistory[];
  @ViewChild(AlertHistortListComponent, { static: false }) alertHistortListComponent: AlertHistortListComponent;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  btn: any
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
      
      if (this.UserAlertHistorySelected == null || this.UserAlertHistorySelected.length < 1) {
        this.toastrService.warning("Please select Record to View");
        return;
      } else if (this.UserAlertHistorySelected.length > 1) {
        this.toastrService.warning("Please select only one Record to View");
        return;
      }
    
    else {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;

    }
  }
    else if (type === "delete") {
      
      if (!!this.UserAlertHistorySelected && this.UserAlertHistorySelected.length > 0) {
        this.btn = 'btn3'
        this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          
          this.alertHistortListComponent.deleteAlertHistoryList(this.UserAlertHistorySelected);
        }, (reason) => {
        });
      }
      else {
        this.toastrService.warning('Please Select At least One Record');
        return;
      }
    }
    //else if (type === "edit") {
    //  this.tab1 = true;
    //  this.tab2 = false;
    //  this.tab3 = true;
    //  this.tabGroup.selectedIndex = 1;
    //  this.tab3Data = true;
    //  this.tab2Data = false;
    //  this.tab1Data = false;

    //}
  }

  closeTab() {
    this.UserAlertHistorySelected = null;
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;

  }
  IsTosca: boolean;
  constructor(public modalService: NgbModal, private toastrService: ToastrService, private router: Router, private authenticationService: AuthService) { }

  ngOnInit(): void {
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
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }
  UserAlertHistoryToSelect() {
    return this.UserAlertHistorySelected;
  }
  UserAlertHistoryToView() {
    return this.UserAlertHistorySelected;
  }

  SelectedUserAlertHistory(UserAlertHistoryToView: any) {
    this.UserAlertHistorySelected = UserAlertHistoryToView;
  }
  buttonPermission() {
    
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all
          if (!data || data[0].PermissionType == "Read and Modify") {
            this.btnBar.enableAction('add');
            this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');
          }
          else {
            this.btnBar.disableAction('add');
            this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
          }
        }
      });

  }
}
