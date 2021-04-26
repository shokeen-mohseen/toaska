import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { AuthService } from '@app/core';
import { moduleRole } from './model/send-object';
//import { getExistingUsersActions, getNewUsersActions, getEditActions, getAddActions } from '../../../../shared/components/top-btn-group/page-actions-map';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { ToastrService } from 'ngx-toastr';
import { ModuleListComponent } from './module-list/module-list.component';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

//import { getModulerole } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-modulerolepermissions',
  templateUrl: './modulerolepermissions.component.html',
  styleUrls: ['./modulerolepermissions.component.css']
})
export class ModulerolepermissionsComponent implements OnInit, AfterViewInit {
  modalRef: NgbModalRef; 
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  IsTosca: boolean;
  ItemList: moduleRole[];

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild(ModuleListComponent, { static: false }) ListModule: ModuleListComponent;

  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;      
      this.ListModule.setRowSelection();
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
      
    } else if (type === "edit") {
      if (!!this.ItemList && this.ItemList.length > 0) {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;
        
      }
      else {
        this.toastrService.warning('Please Select At least One module');
        return;
      }
    }

    else if (type === "delete") {
      if (!!this.ItemList && this.ItemList.length > 0) { 
        this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.ListModule.RemoveSelected(this.ItemList);
        }, (reason) => {
        });
      }
      else {
        this.toastrService.warning('Please Select At least One module');
        return;
      }

    }
  }

  closeTab() {

    this.tabGroup.selectedIndex = 0;
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    
    this.refresh();
   // this.tabGroupTosca.selectedIndex = 0;
  }

  
  
  constructor(private router: Router, public modalService: NgbModal, private auth: AuthService, private toastrService: ToastrService) { }

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

  modulesToSelect() {
    return this.ItemList;
  }
  modulesToEdit() {
    return this.ItemList;
  }

  selectedListValues(event) {    
    this.ItemList = event;
   // console.log(" Parent = ", this.ItemList);
  }

  refresh() {
    this.selectedListValues([]);
    this.ListModule.FillGrid();
  }


  buttonPermission()
  {
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
        else {
           this.btnBar.disableAction('add');
           this.btnBar.disableAction('edit');
           this.btnBar.disableAction('delete');
        }
      });

  }
}


 

