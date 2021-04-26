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


@Component({
  selector: 'shipment-management',
  templateUrl: './shipment-management.component.html',
  styleUrls: ['./shipment-management.component.css']
})
export class shipmentManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  
  ngbModalRef: NgbModalRef; 
  constructor(private router: Router,
    private shipmentManagementService: shipmentManagementService,
    private toster: ToastrService,
    public modalService: NgbModal)
  {

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
  }

  ngAfterViewInit() {
    this.btnBar.hideAction('active');
    this.btnBar.hideAction('inactive');
    this.btnBar.showAction('tender');
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
  tab3Data: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
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
     
      if (this.shipmentManagementService.ShipmentsforEdit.length == undefined || this.shipmentManagementService.ShipmentsforEdit.length == 0)
      {
        this.toster.info("Please Select at least One Shipment.");
      }
      else 
      {
        this.tab1 = true; 
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;

        if (this.addNewComponent != undefined) {
          this.addNewComponent.GetShipmentEditlist();
        }
        this.btnBar.hideAction('edit');
      }
      
    }
    else if (type === "delete") {  }
    else if (type === "export") {  }
    else if (type === "receive") { this.addNewComponent.ReceiveSelectedShipment(); }
    else if (type === "tender") {  }
    else if (type === "ship") {
      this.addNewComponent.ShipSelectedShipment();
      //  this.addNewComponent.SendShipmentForMAS(true);
    }
    else if (type === "resendToMas") {}
    else if (type === "approveAndMas") {this.addNewComponent.SendShipmentForMAS(false);}
    else if (type === "cancel") { this.addNewComponent.Cancel();  }
    else if (type === "tonu") { this.addNewComponent.Tonu(); }
    else if (type === "document") {  }
    else if (type === "viewBOL") {
      this.openBOLReport()
    }
    else if (type === "viewLoadingSheet") {
      this.addNewComponent.openLoadSheet();
    } else if (type === "viewnafta") {
      this.openNaftaReport()
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

  
  
 

  openBOLReport() {
    if (this.shipmentManagementService.ShipmentsforEdit.length == undefined
      || this.shipmentManagementService.ShipmentsforEdit.length != 1) {
      this.toster.warning("Please select one shipment to view report.");
    }
    else {
      this.ngbModalRef = this.modalService.open(ViewBolComponent, { size: 'lg', backdrop: 'static' })
      this.ngbModalRef.componentInstance.shipmentForReport = this.shipmentManagementService.ShipmentsforEdit[0];
    }
    
  }

  openNaftaReport() {
    if (this.shipmentManagementService.ShipmentsforEdit.length == undefined
      || this.shipmentManagementService.ShipmentsforEdit.length != 1) {
      this.toster.warning("Please select one shipment to view report.");
    }
    else {
      this.ngbModalRef = this.modalService.open(NaftaReportComponent, { size: 'xl', backdrop: 'static' })
      this.ngbModalRef.componentInstance.shipmentForReport = this.shipmentManagementService.ShipmentsforEdit[0];
    }

  }


}
