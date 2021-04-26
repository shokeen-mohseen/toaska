import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { EditInventoryComponent } from './edit-inventory/edit-inventory.component';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { CurrentInventoryListComponent } from './current-inventory-list/current-inventory-list.component';
import { InventoryModel } from '../../../../core/models/inventory.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core';

@Component({
  selector: 'app-current-on-hand-inventory',
  templateUrl: './current-on-hand-inventory.component.html',
  styleUrls: ['./current-on-hand-inventory.component.css']
})
export class CurrentOnHandInventoryComponent implements OnInit, AfterViewInit {

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(CurrentInventoryListComponent) currentInventoryListComponent: CurrentInventoryListComponent;
  actionGroupConfig;
  InventoryList: string = "CurrentInventoryExport";
  inventorySelected = new InventoryModel();
  tab1: boolean = true;
  tab1Data: boolean = true;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
  }

  actionHandler(type) {
    if (type === "add") {
      this.modalRef = this.modalService.open(AddInventoryComponent, { size: 'md', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        this.currentInventoryListComponent.getInventoryList();
        this.currentInventoryListComponent.getTotalSumQuantity();
      }), (reason) => {
      };
    }
    else if (type === "edit") {
      if (this.currentInventoryListComponent.selection.selected.length <= 0) {
        this.toastrService.warning("Please select a record to edit.");
        return;
      }
      else if (this.currentInventoryListComponent.selection.selected.length > 1
        || this.currentInventoryListComponent.selection.selected == null) {
        this.toastrService.warning("Please select a record to edit.");
        return;
      }
      else {
        this.modalRef = this.modalService.open(EditInventoryComponent, { size: 'md', backdrop: 'static' });
        this.inventorySelected = this.currentInventoryListComponent.selection.selected[0];
        this.modalRef.componentInstance.data = this.inventorySelected;
        this.modalRef.result.then((result) => {
          this.currentInventoryListComponent.getInventoryList();
          this.currentInventoryListComponent.getTotalSumQuantity();
        }), (reason) => {
        };
      }
    }
    else if (type === "delete") {
      this.currentInventoryListComponent.RemoveSelectedInventory();
    }
    else if (type === "import") {

    }
    else if (type === "export") {

    }
  }

  modalRef: NgbModalRef;
  IsTosca: boolean;

  constructor(private router: Router,
    public modalService: NgbModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
  ) { }

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
            this.router.navigate(['/unauthorized']);
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });

  }

}
