import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { FreightMode } from '../modals/freightmode';
import { AuthService } from '@app/core';
import { Router } from '@angular/router';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { FreightModeService } from '../services/freightmode.service';
import { ToastrService } from 'ngx-toastr';
import { ManageFreightModeStateService } from './freightMode-state.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteTabledataPopupComponent } from '../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { FreightListComponent } from './freight-list/freight-list.component';

@Component({
  selector: 'app-freight-mode',
  templateUrl: './freight-mode.component.html',
  styleUrls: ['./freight-mode.component.css'],
  providers: [ManageFreightModeStateService]
})
export class FreightModeComponent implements OnInit, AfterViewInit {
 
  ItemList: FreightMode[];
  DefaultCount: number = 0;
  modalRef: NgbModalRef;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild(FreightListComponent, { static: false }) FreightListComponent: FreightListComponent;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  FreightModeList: string = "FreightModeExport";
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
      if (this.manageFreightModeStateService.selectedFreightModes == null || this.manageFreightModeStateService.selectedFreightModes.length < 1) {
        this.toastrService.warning("Please select a freight mode to edit.");
        return;
      } else {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 1;
      this.tab3Data = true;
      this.tab2Data = false;
        this.tab1Data = false;
      }

    }
    else if (type === "delete") {

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
    this.manageFreightModeStateService.selectedFreightModes = [];

  }

  IsTosca: boolean;

  constructor(private router: Router, private manageFreightModeStateService: ManageFreightModeStateService,
    private toastrService: ToastrService, private auth: AuthService,
    private freightModeService: FreightModeService, public modalService: NgbModal) { }

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
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

  selectedListValues(event) {
  
    this.ItemList = event;
    
  }

  async checkBoxClick(dataSources: any) {
    this.ItemList = dataSources;
    this.DefaultCount = await this.freightModeService.getMaxEditedRecordsCount();
    this.ItemList = this.ItemList.slice(0, this.DefaultCount);
    this.manageFreightModeStateService.selectedFreightModes = this.ItemList;
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.auth.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.auth.currentUserValue.UserId;
    this.auth.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          if (data[0].PermissionType == "Read and Modify") {
            this.btnBar.enableAction('add');
            //this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');
            this.freightModeService.permission = true;
          }
          else {
            this.btnBar.disableAction('add');
           // this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
            this.freightModeService.permission = false;
          }
        }
      });

  }
}
