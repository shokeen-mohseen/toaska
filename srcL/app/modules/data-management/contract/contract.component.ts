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
import { ContractService } from '../../../core/services/contract.service';
import { ContractCommonDataService } from '../../../core/services/contract-common-data.service';

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
  ContractExportList: string = "ContractExport";
  headerText: string = "Add New";

  IsTosca: boolean;
  ItemList: ContractViewModel[];
  blankList: ContractViewModel[] = [];

  constructor(private router: Router, public modalService: NgbModal,
    private auth: AuthService, private toastrService: ToastrService, private contractService: ContractService,private contractcommonservice : ContractCommonDataService) { }

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


    if (this.contractcommonservice.EditContractList != undefined && this.contractcommonservice.EditContractList.length > 0) {
      this.ItemList = this.contractcommonservice.EditContractList;
    }

    if (type === "add") {

      if (this.contractcommonservice.EditContractList != undefined && this.contractcommonservice.EditContractList.length > 0) {
        this.contractcommonservice.EditContractList.splice(0, this.contractcommonservice.EditContractList.length);
        this.ItemList.splice(0, this.ItemList.length);
      }

      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;
      this.btnBar.hideTab('key_Action');
    }
    else if (type === "edit") {
      if (!!this.ItemList && this.ItemList.length > 0) {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;
        this.btnBar.hideTab('key_Action');
      }
      else {
        this.toastrService.warning('Please select at least one contract');
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
        this.toastrService.warning('Please select at least one contract');
        return;
      }
    }
    else if (type === "active") {
      if (!!this.ItemList && this.ItemList.length > 0) {
        this.ContractList.ActiveContracts();
      }
      else {
        this.toastrService.warning('Please select at least one contract');
        return;
      }

    }
    else if (type === "inactive") {
      if (!!this.ItemList && this.ItemList.length > 0) {
        this.ContractList.InactiveContracts();
      }
      else {
        this.toastrService.warning('Please select at least one contract');
        return;
      }
    }
    else if (type === "export") { }
  }

  closeTab() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.btnBar.showTab('key_Action');
    this.tabGroup.selectedIndex = 0;

    if (this.contractcommonservice != undefined && this.contractcommonservice.EditContractList != undefined && this.contractcommonservice.EditContractList.length > 0) {
      this.contractcommonservice.EditContractList.splice(0, this.contractcommonservice.EditContractList.length);
    }
    
  }

  buttonPermission() {
    var ModuleRoleCode = "CNTR";
    var ClientId = this.auth.currentUserValue.ClientId;
    var UserId = this.auth.currentUserValue.UserId;
    this.contractService.getModulePermission(ModuleRoleCode, ClientId, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          if (res.Data[0].PermissionType == "Read and Modify") {
            this.btnBar.enableAction('add');
            // this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
            this.contractService.Permission = true;
          }
          else {
            this.btnBar.disableAction('add');
            //this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
            this.contractService.Permission = false;
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }

  buttonPermissionOld() {

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
            // this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
            this.contractService.Permission = true;
          }
          else {
            this.btnBar.disableAction('add');
            //this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
            this.contractService.Permission = false;
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }
  selectedListValues(event) {
    this.ItemList = event;
  }
  EditList(isEdit: number) {
    if (isEdit == 1) { return this.ItemList; }
    else { return this.blankList;}
  }

  HeaderReset(data: string) {
    this.headerText = data;
  }
}
