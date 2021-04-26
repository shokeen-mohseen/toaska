import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { AlertListComponent } from './alert-list/alert-list.component';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { AuthService } from '../../../core';
import { AlertManagementService } from '../services/alert-management.server.input.services';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, AfterViewInit {

  // for ribben
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  ManageUserAlertList: string = 'ManageUserAlertExport';

  constructor(private router: Router, private services: AlertManagementService, private authenticationService: AuthService) { }

  @ViewChild(AlertListComponent) alertList: AlertListComponent;
  editIndexID: number = -1;
  IsTosca: boolean;
 


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
    this.btnBar.hideTab('key_View');
    this.btnBar.disableAction('add');    
    this.btnBar.disableAction('delete');
    if (!this.services.Permission) {
      this.btnBar.disableAction('active');
      this.btnBar.disableAction('inactive');
    }
    else {
      this.btnBar.enableAction('active');
      this.btnBar.enableAction('inactive');
    }
  }

  //tabs section
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
      this.btnBar.showTab('key_Action');
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
      this.btnBar.hideTab('key_Action');
    }
    else if ($event.index === 2) { this.tab3Data = true; }
  }
  actionHandler(type) {
    if (type === "add") {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;
    }
    else if (type === "edit") {
      if (this.alertList.btnEdit()) {
        this.editIndexID = this.alertList.selectedEditID;

        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;

        this.btnBar.hideTab('key_Action');

      }

    }
    else if (type === "delete") {
      this.alertList.RemoveSelectedUserAlerts();

    }
    else if (type === "export") {
      this.alertList.ExportCSV();
    }
    else if (type === "refersh") {
      this.alertList.RefreshScreen();
    }
    else if (type === "active") {
      this.alertList.updatetoactive();
      //this.updatetoactive()
    }
    else if (type === "inactive") {
      this.alertList.updatetodeactive();
    }
  }

  closeTab() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.btnBar.showTab('key_Action');
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
            if (!data || data[0].PermissionType == "Read and Modify") {
              this.services.Permission = true;
              //this.btnBar.disableAction('add');
              //this.btnBar.enableAction('edit');
              ////this.btnBar.disableAction('delete');
              //this.btnBar.enableAction('active');
              //this.btnBar.enableAction('inactive');             
            }
            else {
              this.services.Permission = false;
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
