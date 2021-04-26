import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { AuthService } from '@app/core';
import { Contract, ContractViewModel } from '@app/core/models/contract.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteTabledataPopupComponent } from '@app/shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractListComponent } from './pages/contract-list/contract-list.component';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit, AfterViewInit {
  // for ribben
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(ContractListComponent, { static: false }) ContractList: ContractListComponent;
  modalRef: NgbModalRef; 
  actionGroupConfig;
  
  IsTosca: boolean;
  ItemList: ContractViewModel[];

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
    this.btnBar.hideTab('key_View');
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
    if ($event.index === 0) { this.tab1Data = true; }
    else if ($event.index === 1) { this.tab2Data = true; }
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
        this.toastrService.warning('Please Select At least One contract');
        return;
      }
    }
    else if (type === "delete") {
      if (!!this.ItemList && this.ItemList.length > 0) {
        this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.ContractList.RemoveContract();

        }, (reason) => {
        });
      }
      else {
        this.toastrService.warning('Please Select At least One contract');
        return;
      }
    }
    else if (type === "active") {
      if (!!this.ItemList && this.ItemList.length > 0) {
        this.ContractList.ActiveContracts();
      }
      else {
        this.toastrService.warning('Please Select At least One contract');
        return;
      }

    }
    else if (type === "inactive") {
      if (!!this.ItemList && this.ItemList.length > 0) {
        this.ContractList.InactiveContracts();
      }
      else {
        this.toastrService.warning('Please Select At least One contract');
        return;
      }
    }
    else if (type === "export") {  }
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
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
          }
          else {
            this.btnBar.disableAction('add');
            this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
          }
        }
      });
  }
  selectedListValues(event) {
    this.ItemList = event;
  }
  EditList() {
    return this.ItemList;
  }
}
