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

@Component({
  selector: 'app-freight-mode',
  templateUrl: './freight-mode.component.html',
  styleUrls: ['./freight-mode.component.css']
})
export class FreightModeComponent implements OnInit, AfterViewInit {
 
  ItemList: FreightMode[];
  DefaultCount: number = 0;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

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
      if (this.ItemList == null || this.ItemList.length <= 0) {
        this.toastrService.warning("Please select a freight mode to edit");
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

  }

  IsTosca: boolean;

  constructor(private router: Router, private toastrService: ToastrService, private auth: AuthService, private freightModeService: FreightModeService) { }

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
    //debugger;
    this.ItemList = event;
    console.log(" Parent = ", this.ItemList);
  }

  async checkBoxClick(dataSources: any) {
    this.ItemList = dataSources;
    this.DefaultCount = await this.freightModeService.getMaxEditedRecordsCount();
    this.ItemList = this.ItemList.slice(0, this.DefaultCount);
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
