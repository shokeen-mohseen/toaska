import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { FuelListComponent } from './fuel-list/fuel-list.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { FuelChargeIndex } from '../../../core/models/FuelChargeIndex.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDeleteTabledataPopupComponent } from '../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { ManageFuelChargeStateService } from './fuelcharge-state.service';
@Component({
  selector: 'app-fuel-surcharge',
  templateUrl: './fuel-surcharge.component.html',
  styleUrls: ['./fuel-surcharge.component.css'],
  providers: [ManageFuelChargeStateService]
})
export class FuelSurchargeComponent implements OnInit, AfterViewInit {
  fuelChargesSelected: FuelChargeIndex[];
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild(FuelListComponent, { static: false }) FuelListComponent: FuelListComponent;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;

  actionGroupConfig;
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
    if (type === "add") {

      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;

    } else if (type === "edit") {

      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 1;
      this.tab3Data = true;
      this.tab2Data = false;
      this.tab1Data = false;

    }
    else if (type === "delete") {
      if (!!this.manageFuelChargeStateService.seletedFuelCharges && this.manageFuelChargeStateService.seletedFuelCharges.length > 0) {
        this.btn = 'btn3'
        this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.FuelListComponent.deleteFuelSurchargeList(this.manageFuelChargeStateService.seletedFuelCharges);
        }, (reason) => {
        });
      }
      else {
        this.toastrService.warning('Please Select At least One Data');
        return;
      }
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

  modalRef: NgbModalRef;
  IsTosca: boolean;
  constructor(private authenticationService: AuthService, private toastrService: ToastrService,
    private router: Router, public modalService: NgbModal,
    private manageFuelChargeStateService: ManageFuelChargeStateService) { }

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
  selectedFuelCharges(fuelChargesToEdit: any) {
    this.manageFuelChargeStateService.seletedFuelCharges = fuelChargesToEdit;
  }
  FuelSurchargeIndexToSelect() {
    return this.fuelChargesSelected;
  }
  FuelSurchargeIndexToEdit() {
    return this.fuelChargesSelected;
  }
  SelectedFuelSurchargeIndex(fuelChargesToEdit: any) {
    this.fuelChargesSelected = fuelChargesToEdit;
  }
  ngAfterViewInit() {
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
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
