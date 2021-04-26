import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { IssueComponent } from '../../../../shared/components/issue/issue.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { ShipmentNaftaReportData } from '../../../../core/models/ShipmentNaftaReportData.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { NaftaReportListComponent } from './nafta-report-list/nafta-report-list.component';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';
@Component({
  selector: 'app-shipment-nafta-report',
  templateUrl: './shipment-nafta-report.component.html',
  styleUrls: ['./shipment-nafta-report.component.css']
})
export class ShipmentNaftaReportComponent implements OnInit, AfterViewInit {

  ShipmentNaftaReportSelected: ShipmentNaftaReportData[];
  @ViewChild(NaftaReportListComponent, { static: false }) NaftaReportListComponent: NaftaReportListComponent;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  NAFTAReportList: string = "NAFTAExport";
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  btn: any
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  constructor(
    private toastrService: ToastrService, private router: Router, private authenticationService: AuthService, public modalService: NgbModal,
    private shipmentManagementService: shipmentManagementService
  ) { }
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
      if (this.ShipmentNaftaReportSelected == null || this.ShipmentNaftaReportSelected.length < 1) {
        this.toastrService.warning("Please select Record to edit");
        return;
      } else if (this.ShipmentNaftaReportSelected.length > 1) {
        this.toastrService.warning("Please select only one Record to edit");
        return;
      }
      else {
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

      if (!!this.ShipmentNaftaReportSelected && this.ShipmentNaftaReportSelected.length > 0) {
        this.btn = 'btn3'
        this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
              this.NaftaReportListComponent.deleteNaftaReportList(this.ShipmentNaftaReportSelected);
        }, (reason) => {
        });
      }
      else {
        this.toastrService.warning('Please select at least one record');
        return;
      }
    }
    else if (type === "issue") {

      this.modalRef = this.modalService.open(IssueComponent, { size: 'xl', backdrop: 'static' });

    }
  }

  closeTab() {
    this.ShipmentNaftaReportSelected = null;
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;

  }
  modalRef: NgbModalRef;
  IsTosca: boolean;


  ngOnInit(): void {
    this.buttonPermission()
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }
  ShipmentNaftaReportDataToSelect() {
    return this.ShipmentNaftaReportSelected;
  }
  ShipmentNaftaReportDataToEdit() {
    return this.ShipmentNaftaReportSelected;
  }

  SelectedNaftaReport(ShipmentNaftaReportDataToEdit: any) {
    this.ShipmentNaftaReportSelected = ShipmentNaftaReportDataToEdit;
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
          if (data[0].PermissionType == "Read and Modify") {
            this.btnBar.enableAction('add');
            // this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
            this.shipmentManagementService.Permission = true;
          }
          else {
            this.btnBar.disableAction('add');
            //this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
            this.shipmentManagementService.Permission = false;
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }
}
