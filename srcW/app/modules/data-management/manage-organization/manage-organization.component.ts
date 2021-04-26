import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import {  NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { IssueComponent } from '../../../shared/components/issue/issue.component';
//import { getManageOrganization } from '@app/shared/components/top-btn-group/page-actions-map';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { Organization } from '../../../core/models/organization';
import { ManageOrganizationStateService } from './manage-organization-state.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../core';
@Component({
  selector: 'app-manage-organization',
  templateUrl: './manage-organization.component.html',
  styleUrls: ['./manage-organization.component.css'],
  providers: [ManageOrganizationStateService]
})
export class ManageOrganizationComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  modalRef: NgbModalRef;
  organizationsSelected: Organization[];
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  constructor(private router: Router, private auth: AuthService, public modalService: NgbModal, private toastr: ToastrService, private manageOrganizationState: ManageOrganizationStateService) { }

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
    if (type === "add") {

      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;
      this.btnBar.disableAction('add')

    } else if (type === "edit") {

      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 1;
      this.tab3Data = true;
      this.tab2Data = false;
      this.tab1Data = false;
      if (!this.manageOrganizationState.seletedOrganizations) {
        this.toastr.warning('Please select one Organizations');
        return;
      }
      

    }
  }

  closeTab() {
    if (this.tabGroup.selectedIndex !== 0) {
      this.manageOrganizationState.seletedOrganizations = [];
    }

    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;

  }

  selectedOrgnizations(organizationsToEdit: any) {
    this.manageOrganizationState.seletedOrganizations = organizationsToEdit;
  }
  
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


  ngAfterViewInit(): void {
    this.btnBar.disableAction('add');
    this.btnBar.disableAction('delete');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

  openissue() {
    this.modalRef = this.modalService.open(IssueComponent, { size: 'xl', backdrop: 'static' });
  }
  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.auth.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    this.auth.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          if (data[0].PermissionType == "Read and Modify") {
            //this.btnBar.enableAction('add');
            this.btnBar.enableAction('edit');
            //this.btnBar.enableAction('delete');
          }
          else {
            //this.btnBar.disableAction('add');
            this.btnBar.disableAction('edit');
            //this.btnBar.disableAction('delete');
          }
        }
      });

  }
}

