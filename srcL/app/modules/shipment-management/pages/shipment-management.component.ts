import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { WorkbenchComponent } from './workbench/workbench.component';
import { AddNewComponent } from './add-new/add-new.component';
import { shipmentManagementService } from '../../../core/services/shipment-management.service';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ViewBolComponent } from './bol-report-template/viewbol.component';
import { NaftaReportComponent } from './nafta-report-template/nafta-report.component';
import { AuthService } from '@app/core';
import { CCIReportComponent } from './cci-report-template/cci-report.component';
import { ProformaInvoiceComponent } from './proforma-invoice/proforma-invoice.component';

@Component({
  selector: 'shipment-management',
  templateUrl: './shipment-management.component.html',
  styleUrls: ['./shipment-management.component.css']
})
export class shipmentManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(WorkbenchComponent) shipmentComponent: WorkbenchComponent;
  actionGroupConfig;
  ShipMangementList: string = 'ShipmentExport';
  EditedShipmentNumber: any;
  ngbModalRef: NgbModalRef;
  ApproveanMasMulti: boolean = true;
  constructor(private router: Router,
    private shipmentManagementService: shipmentManagementService,
    private toster: ToastrService,
    public modalService: NgbModal,
    private auth: AuthService) {

  }

  IsTosca: boolean;

  @ViewChild(WorkbenchComponent) private workbenchComponent: WorkbenchComponent;
  @ViewChild(AddNewComponent) private addNewComponent: AddNewComponent;


  ngOnInit(): void {

    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
    // this.buttonPermission();
  }

  ngAfterViewInit() {
    this.btnBar.hideAction('active');
    this.btnBar.hideAction('inactive');
    this.btnBar.hideAction('tender');
    this.btnBar.showAction('ship');
    this.btnBar.showAction('approveAndMas');
    this.btnBar.showAction('resendToMas');
    this.btnBar.showAction('cancel');
    this.btnBar.showAction('tonu');
    this.btnBar.showAction('document');
    this.btnBar.showAction('receive');
    this.btnBar.hideTab('key_View');
    this.btnBar.showAction('edit');
    this.btnBar.hideAction('add');




  }

  //tabs section
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tabEditData: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) { this.tab2Data = true; }
    else if ($event.index === 2) { this.tabEditData = true; }
  }

  actionHandler(type, isShipmentLinkClick = false) {  
    if (type === "add") {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tabEditData = false;
      this.tab2Data = true;
    }
    else if (type === "edit") {
      if (isShipmentLinkClick) {
        this.OpenEditShipmentScreen();
      }
      else if (this.shipmentComponent.SelectedsalesOrderCount > this.shipmentComponent.MaxEditedRecordsCountPreferences) {
        this.toster.info("You can't edit records more then " + this.shipmentComponent.MaxEditedRecordsCountPreferences);
        return;
      }
      else if (this.shipmentManagementService.ShipmentsforEdit.length == undefined || this.shipmentManagementService.ShipmentsforEdit.length == 0) {
        this.toster.info("Please select at least one shipment");
      }
      else {
        this.OpenEditShipmentScreen();
      }
    }
    else if (type === "delete") { }
    else if (type === "export") { }
    else if (type === "receive") { this.addNewComponent.ReceiveSelectedShipment(); }
    else if (type === "tender") { }
    else if (type === "ship") {
      this.addNewComponent.ShipSelectedShipment();
     
      //if (this.shipmentManagementService.ShipmentsforEdit.length == 0) {
      //  this.closeTab();
      //}
    }
    else if (type === "resendToMas") {
      if (this.ApproveanMasMulti) {
       
        this.shipmentComponent.ReSendShipmentForMASMulti();
      }
      else { this.addNewComponent.ReSendShipmentForMAS(); }

    }
    else if (type === "approveAndMas") {
      if (this.ApproveanMasMulti) {
        this.shipmentComponent.ApproveandSendShipmentForMASMulti();
      }
      else {
        this.addNewComponent.ApproveandSendShipmentForMAS(false);
      }
    }
    else if (type === "cancel") { this.addNewComponent.Cancel(); }
    else if (type === "tonu") { this.addNewComponent.Tonu(); }
    else if (type === "document") { }
    else if (type === "viewBOL") { this.openBOLReport() }
    else if (type == "viewcci") { this.openCCIReport() }
    else if (type == "performaInvoice") { this.openShipmentProformaInvoice() }
    else if (type === "viewLoadingSheet") { this.openLoadSheet(); }
    else if (type === "viewnafta") { this.openNaftaReport() }
    else if (type === "save") { this.addNewComponent.SaveShipment(); }
  }

  closeTab() {
    localStorage.SelectedShipmentId = null;
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tabEditData = false;
    this.btnBar.hideAction('save');
    this.ApproveanMasMulti = true;
  }
  getShipmentForBol() {
    return this.tabEditData
      ? this.shipmentManagementService.ShipmentsforEdit.find(c => c.id == this.shipmentManagementService.EditingShipmentID)
      : this.shipmentManagementService.ShipmentsforEdit[0];
  }

  openBOLReport() {
    var requestObject = [];
    var shipments = this.getShipmentForBol();
    if (!this.tabEditData) {
      for (var shipment of this.shipmentManagementService.ShipmentsforEdit) {
        requestObject.push({ "id": shipment.id });
      }
    } else {
      requestObject.push({ "id": shipments.id });
    }
    this.shipmentManagementService.GetShipmentBOLReport(requestObject).subscribe(
      (response) => {
        console.log(response.data);
        var count = 1;
        for (let data of response.data) {
          let file = new Blob([this.base64ToArrayBuffer(data)], { type: 'application/pdf' });
          let fileURL = URL.createObjectURL(file);
          let topPosition = 100 + (20 * count);
          setTimeout(function () {
            window.open(
              fileURL
              , '_blank' + count++
              , "height=600,width=900,toolbar=0,top=" + topPosition + ",left=" + topPosition + ",menubar=0")
          }, 500);
          count += count;
        }

      },
      (error) => {
        this.toster.warning("Loading report failed. Please contact tech support.");
        console.log(error);
      }
    )
  }

  openLoadSheet() {
    var requestObject = [];
    var shipments = this.getShipmentForBol();
    if (!this.tabEditData) {
      for (var shipment of this.shipmentManagementService.ShipmentsforEdit) {
        requestObject.push({ "id": shipment.id, "clientID": this.auth.currentUserValue.ClientId });
      }
    } else {
      requestObject.push({ "id": shipments.id, "clientID": this.auth.currentUserValue.ClientId });
    }
    this.shipmentManagementService.GetShipmentLoadingsheetReport(requestObject).subscribe(
      (response) => {
        console.log(response.data);
        var count = 1;
        for (let data of response.data) {
          let file = new Blob([this.base64ToArrayBuffer(data)], { type: 'application/pdf' });
          let fileURL = URL.createObjectURL(file);
          let topPosition = 100 + (20 * count);
          setTimeout(function () {
            window.open(
              fileURL
              , '_blank' + count++
              , "height=600,width=900,toolbar=0,top=" + topPosition + ",left=" + topPosition + ",menubar=0")
          }, 500);
          count += count;
        }

      },
      (error) => {
        this.toster.warning("Loading report failed.Please contact tech support.");
        console.log(error);
      }
    )
  }

  base64ToArrayBuffer(base64: any): ArrayBuffer {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }


  openNaftaReport() {
    if ((this.shipmentManagementService.ShipmentsforEdit.length == undefined
      || this.shipmentManagementService.ShipmentsforEdit.length != 1)
      && !this.tabEditData) {
      this.toster.warning("Please select a shipment to view report.");
    }
    else {
      this.ngbModalRef = this.modalService.open(NaftaReportComponent, { size: 'lg', backdrop: 'static' })
      this.ngbModalRef.componentInstance.shipmentForReport = this.getShipmentForBol();
    }

  }

  openCCIReport() {
    if ((this.shipmentManagementService.ShipmentsforEdit.length == undefined
      || this.shipmentManagementService.ShipmentsforEdit.length != 1)
      && !this.tabEditData) {
      this.toster.warning("Please select a shipment to view report.");
    }
    else {
      this.ngbModalRef = this.modalService.open(CCIReportComponent, { size: 'lg', backdrop: 'static' })
      this.ngbModalRef.componentInstance.shipmentForReport = this.getShipmentForBol();
    }

  }

  openShipmentProformaInvoice() {
    //if (this.shipmentManagementService.ShipmentsforEdit.length == undefined
    //  || this.shipmentManagementService.ShipmentsforEdit.length != 1) {
    //  this.toster.warning("Please select a shipment to view report");
    //}
    //else {

    this.ngbModalRef = this.modalService.open(ProformaInvoiceComponent, { size: 'lg', backdrop: 'static' })
    this.ngbModalRef.componentInstance.shipmentForReport = this.shipmentManagementService.EditingShipmentID;
    //}

  }


  //buttonPermission() {
  //  var ModuleNavigation = this.router.url;
  //  var ClientId = this.auth.currentUserValue.ClientId;
  //  var projectKey = projectkey.projectname;
  //  this.auth.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
  //    .subscribe(res => {

  //      if (res.Message == "Success") {
  //        var data = res.Data;
  //        if (data[0].PermissionType == "Read and Modify") {
  //          this.btnBar.enableAction('add');
  //          this.btnBar.enableAction('edit');
  //          this.btnBar.enableAction('delete');
  //          this.btnBar.enableAction('active');
  //          this.btnBar.enableAction('inactive');
  //        }
  //        else {
  //          this.btnBar.disableAction('add');
  //          this.btnBar.disableAction('edit');
  //          this.btnBar.disableAction('delete');
  //          this.btnBar.disableAction('active');
  //          this.btnBar.disableAction('inactive');
  //        }
  //      }
  //      else {
  //        this.router.navigate(['/unauthorized']);
  //      }
  //    });
  //}

  modifyShipment(event) {
    this.EditedShipmentNumber = event;
    this.actionHandler('edit', true);
  }
  OpenEditShipmentScreen() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = true;
    this.tabGroup.selectedIndex = 1;
    this.tabEditData = true;
    this.tab2Data = false;
    this.tab1Data = false;
    this.ApproveanMasMulti = false;
    if (this.addNewComponent != undefined) {
      this.addNewComponent.GetShipmentEditlist();
    }
    this.btnBar.hideAction('edit');
    this.btnBar.showAction('save');
    this.shipmentManagementService.isEdited
  }

}
