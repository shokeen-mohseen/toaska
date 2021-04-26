import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChargeTypeComponent } from './charge-type/charge-type.component';
import { ChargeCategoryComponent } from './charge-category/charge-category.component';
import { MapComputationMethodComponent } from './map-computation-method/map-computation-method.component';
import { projectkey } from 'environments/projectkey';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
//import { getCharge } from '@app/shared/components/top-btn-group/page-actions-map';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { Charge } from '../../../core/models/charge.model';
import { ChargeService } from '../../../core/services/charge.service';
import { ChargeListComponent } from './charge-list/charge-list.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.css']
})
export class ChargeComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  modalRef: NgbModalRef;
  isChargeViewTab: boolean = true;
  isAddTab: boolean = false;
  isEditTab: boolean = false;
  isChargeViewData: boolean = true;
  isAddTabData: boolean = false;
  isEditData: boolean = false;
  IsTosca: boolean;

  chargesSelected: Charge[];

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild(ChargeListComponent, { static: false }) chargeListComponent: ChargeListComponent;
  constructor(private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private chargeService: ChargeService,
    public modalService: NgbModal) { }

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
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('delete');   
    this.btnBar.hideTab('key_View');
    this.btnBar.showAction('chargeType');
    this.btnBar.showAction('ChargeCategory');
    this.btnBar.showAction('MapComputation');
  }

  tabChange($event) {
    if ($event.index === 0) {
      // this.chargesSelected == null;
      this.isChargeViewData = true;
      this.chargeListComponent.setRowSelection();
    }
    else if ($event.index === 1) {
      this.isAddTabData = true;
    }
    else if ($event.index === 2) {
      this.isEditData = true;
    }
  }

  actionHandler(type) {
    if (type === "edit") {
      if (this.chargesSelected == null || this.chargesSelected.length < 1) {
        this.toastrService.warning("Please select a charge to edit.");
        return;
      } else {
        this.isChargeViewTab = true;
        this.isAddTab = false;
        this.isEditTab = true;
        this.tabGroup.selectedIndex = 2;
        this.isEditData = true;
        this.isChargeViewData = false;
        this.isAddTabData = true;
      }
    }
    else if (type === "chargeType") {
      this.modalRef = this.modalService.open(ChargeTypeComponent, { size: 'lg', backdrop: 'static' });
    }
    else if (type === "ChargeCategory") {
      this.modalRef = this.modalService.open(ChargeCategoryComponent, { size: 'lg', backdrop: 'static' });
    }
    else if (type === "MapComputation") {
      this.modalRef = this.modalService.open(MapComputationMethodComponent, { size: 'xl', backdrop: 'static' });
    } else if (type === "active") {
      this.setAllSelectedChargesStatus(true);
    } else if (type === "inactive") {
      this.setAllSelectedChargesStatus(false);
    } else if (type === "refresh") {
      this.refresh();
    }
  }
 
  closeTab(action) {
    this.isChargeViewTab = true;
    this.isAddTab = false;
    this.isEditTab = false;
    this.isChargeViewData = true;
    this.isAddTabData = false;
    this.isEditData = false;
    this.refresh();
  }
  chargesToSelect() {
    return this.chargesSelected;
  }
  chargesToEdit() {
    return this.chargesSelected;
  }

  selectedCharges(chargesToEdit: any) {
    this.chargesSelected = chargesToEdit;
  }

  setAllSelectedChargesStatus(isActive: boolean) {
    if (this.chargesSelected != null && this.chargesSelected.length > 0) {
      this.chargesSelected.forEach(x => {
        x.isActive = isActive;
        x.updatedBy = this.authenticationService.currentUserValue.LoginId;
        x.updateDateTimeBrowser = new Date();
      });
      this.chargeService.updateCharge(this.chargesSelected).subscribe(result => {
        if (result.statusCode == 200) {
          this.toastrService.success((isActive ? 'Activation' : 'Inactivation') + " successful.")
          this.refresh();
        } else {
          this.toastrService.error((isActive ? 'Activation' : 'Inactivation') + " failed. Please try again later.");
          this.refresh();
        }
      }
      );
    } else {
      this.toastrService.warning("Please select charges for " + (isActive ? 'activation.' : 'inactivation.'));
    }
    
  }

  refresh() {
    this.selectedCharges([]);
    this.chargeListComponent.getChargeList();
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
            this.btnBar.enableAction('edit');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
          }
          else {
            this.btnBar.disableAction('edit');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
          }
        }
      });

  }
}
