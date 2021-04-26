import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';
import { ToastrService } from 'ngx-toastr';
import { Charge } from '../../../core/models/charge.model';
import { AuthService } from '../../../core/services/auth.service';
import { ChargeService } from '../../../core/services/charge.service';
import { ChargeCategoryComponent } from './charge-category/charge-category.component';
import { ChargeListComponent } from './charge-list/charge-list.component';
import { ChargeTypeComponent } from './charge-type/charge-type.component';
import { MapComputationMethodComponent } from './map-computation-method/map-computation-method.component';
import { EditChargeComponent } from './edit-charge/edit-charge.component';
@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.css']
})
export class ChargeComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(EditChargeComponent) EditChargeComponent: EditChargeComponent;
  actionGroupConfig;
  ChargeList: string = "ChargeExport";

  modalRef: NgbModalRef;
  isChargeViewTab: boolean = true;
  isAddTab: boolean = false;
  isEditTab: boolean = false;
  isChargeViewData: boolean = true;
  isAddTabData: boolean = false;
  isEditData: boolean = false;
  IsTosca: boolean;
  @Input('chargeToSelect') chargeToSelect: Charge[];
  chargesSelected: Charge[];
  selectedChargeInEdit: Charge;

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild(ChargeListComponent, { static: false }) chargeListComponent: ChargeListComponent;
  constructor(private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private chargeService: ChargeService,
    public modalService: NgbModal,
    private changeDetector: ChangeDetectorRef) { }

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
    this.changeDetector.detectChanges();
  }

  tabChange($event) {
    this.refresh();
    if ($event.index === 0) {
      // this.chargesSelected == null;
      this.isChargeViewData = true;
      this.chargeListComponent.setRowSelection();
      this.btnBar.enableAction('edit');
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
        this.btnBar.disableAction('edit');
        //this.btnBar.disableAction('inactive');
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
      this.modalRef.result.then((result) => {
        console.log(`Closed with: ${result}`);
        this.refresh();
      }, (reason) => {
      });
    } else if (type === "active") {
      this.setAllSelectedChargesStatus(true);
    } else if (type === "inactive") {
      this.setAllSelectedChargesStatus(false);
    } else if (type === "refresh") {
      this.refresh();
    }
  }
 
  closeTab(action) {
    this.buttonPermission();
    this.isChargeViewTab = true;
    this.isAddTab = false;
    this.isEditTab = false;
    this.isChargeViewData = true;
    this.isAddTabData = false;
    this.isEditData = false;
    this.refresh();
    this.changeDetector.detectChanges();
  }
  chargesToSelect() {
    return this.chargesSelected;
  }
  editc: boolean;
  chargesToEdit() {
    return this.chargesSelected;
  }

  selectedCharges(chargesToEdit: any) {
    this.chargesSelected = chargesToEdit;
  }
  selectedChargeToEdit(chargeInEdit: Charge) {
    this.selectedChargeInEdit = chargeInEdit;
  }

  setAllSelectedChargesStatus(isActive: boolean) {
    if (this.chargesSelected != null && this.chargesSelected.length > 0) {
      var chargeToupdate = [];
      if (this.isEditData) {
        this.selectedChargeInEdit.isActive = isActive;
        this.selectedChargeInEdit.updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.selectedChargeInEdit.updateDateTimeBrowser = new Date();
        chargeToupdate.push(this.selectedChargeInEdit);
      } else {
        this.chargesSelected.forEach(x => {
          x.isActive = isActive;
          x.updatedBy = this.authenticationService.currentUserValue.LoginId;
          x.updateDateTimeBrowser = new Date();
          chargeToupdate.push(x);
        });
      }
      this.chargeService.updateCharge(chargeToupdate).subscribe(result => {
        if (result.statusCode == 200) {
          this.toastrService.success((isActive ? 'Activation' : 'Inactivation') + " successful.");
          if (this.isEditData) {
            this.EditChargeComponent.refreshComponent(isActive == true ? 'Active' : 'Inactive');
          }
        } else {
          this.toastrService.error((isActive ? 'Activation' : 'Inactivation') + " failed. Please try again later.");
        }        
       
        this.refresh();
      }
      );
    } else {
      this.toastrService.warning("Please select charges for " + (isActive ? 'activation.' : 'inactivation.'));
    }
    
  }

  refresh() {
    if (this.isEditData) {
      this.selectedCharges(this.chargesToEdit());
    } else {
      this.selectedCharges([]);
    }
    if (this.chargeListComponent)
      this.chargeListComponent.getChargeList();
  }
  //editscreen: any;
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
          if (!data || data[0].PermissionType == "Read and Modify"){
            this.btnBar.enableAction('edit');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
            this.chargeService.chargeScreenReadOnlyPermission = false;
          }
          else {
            // this.btnBar.disableAction('edit');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
            this.chargeService.chargeScreenReadOnlyPermission = true;
          }
        }
      });

  }
}
