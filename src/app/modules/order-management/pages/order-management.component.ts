import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { RecurrenceComponent } from './recurrence/recurrence.component';
import { ShipWithOrderComponent } from './ship-with-order/ship-with-order.component';
import { OrderManagementService } from '../../../core/services/order-management.service';
import { RegularOrderComponent } from './regular-order/regular-order.component';
import { OrderWorkbenchComponent } from './order-workbench/order-workbench.component';
import { ToastrService } from 'ngx-toastr';
import { OperationalExportComponent } from '../../../shared/components/operational-export/operational-export.component';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit, AfterViewInit {
  IsTosca: boolean;
  modalRef: NgbModalRef;
  // for ribben
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  OrderWorkbench: string = "OrderManagementExport";
  EditOrderNumberLink: any;

  constructor(private router: Router, public modalService: NgbModal, private orderManagementService: OrderManagementService, private toster: ToastrService) {
  }

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
    this.btnBar.showAction('regularOrder');
    this.btnBar.showAction('bulkOrder');
    this.btnBar.showAction('copy');
    this.btnBar.hideAction('add');
    this.btnBar.showAction('orderCancel');
    this.btnBar.showAction('approveAndMas');
    this.btnBar.showAction('resendToMas');
    this.btnBar.showAction('calculate');
    this.btnBar.disableAction('calculate');
    this.btnBar.showAction('shipWith');
    this.btnBar.hideAction('recurrence');
    this.btnBar.hideAction('active');
    this.btnBar.hideAction('inactive');
    this.btnBar.hideTab('key_View');
    this.btnBar.showAction('operationalExport');
  }

  shipwith() {
    this.router.navigateByUrl('/order-management/ship-with-order');
  }

  //tabs section
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild(RegularOrderComponent) ragularOrder: RegularOrderComponent;
  @ViewChild(OrderWorkbenchComponent) orderWorkbench: OrderWorkbenchComponent;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab4: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  tab4Data: boolean = false;
  btn: any
  btn1: any
  btn2: any
  btn3: any
  btn4: any
  LocationData: any;
  LocationDatalist = [];
  selectedItemsB = [];
  LocationId: number;
  SelectedOrderCode: any;
  orderType: any;
  ngbModalRef: NgbModalRef;

  EditedOrderNumber: string;

  tabChange($event) {
    if ($event.index === 0) { this.tab1Data = true; }
    else if ($event.index === 1) { this.tab2Data = true; }
    else if ($event.index === 2) { this.tab3Data = true; }
    else if ($event.index === 3) { this.tab4Data = true; }
  }
  actionHandler(type, isOrderLinkClick = false) {
    if (type === "regularOrder") {
      this.orderManagementService.SalesOrderforEdit = [];
      if (this.orderManagementService.SalesOrderforEdit.length > 0) {
        this.toster.info("Please deselect orders.");
      }
      else {
        this.tab1 = false;
        this.tab2 = true;
        this.tab3 = false;
        this.tab4 = false;
        this.tabGroup.selectedIndex = 0;
        this.tab1Data = false;
        this.tab3Data = false;
        this.tab4Data = false;
        this.tab2Data = true;
        this.btnBar.showAction('save');
        this.btnBar.showAction('saveAndNotify');
      }
    }
    else if (type === "bulkOrder") {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tab4 = false;
      this.tabGroup.selectedIndex = 1;
      this.tab4Data = false;
      this.tab3Data = true;
      this.tab2Data = false;
      this.tab1Data = false;
      this.btnBar.showAction('save');
      this.btnBar.showAction('saveAndNotify');
    }
    else if (type === "edit") {
      if (isOrderLinkClick) {
        this.OpenEditOrderScreen();
      }
      else if (this.orderWorkbench.SelectedsalesOrderCount > this.orderWorkbench.MaxEditedRecordsCountPreferences) {
        this.toster.info("You cannot edit more than " + this.orderWorkbench.MaxEditedRecordsCountPreferences + " records at a time.");
        return;
      }
      else if (this.orderManagementService.SalesOrderforEdit.length == undefined || this.orderManagementService.SalesOrderforEdit.length == 0) {
        this.toster.info("Please select at least one Order.");
      }
      else {
        this.OpenEditOrderScreen();
      }

    }
    else if (type === "copy") {

      if (this.orderManagementService.SalesOrderforEdit.length > 1) {
        this.toster.info("Please select an order to copy.");
      }
      this.orderWorkbench.CopyOrder();
    }
    else if (type === "delete") {
      this.orderWorkbench.DeleteOrder();
    }
    else if (type === "export") { }
    else if (type === "operationalExport") {
      //this.OrderWorkbench = "OrderManagementOperationExport"
      //this.ngbModalRef = this.modalService.open(OperationalExportComponent, { size: 'xl', backdrop: 'static' });
      //let pageTitle = document.querySelectorAll('h5')[0].innerText;
      //this.ngbModalRef.componentInstance.DocumentSectionTitle = pageTitle;
    }
    else if (type === "orderCancel") {
      // this.orderWorkbench.CancelOrder();
      if (this.ragularOrder != undefined && this.ragularOrder.isRegularScreen) {
        if (this.orderWorkbench != undefined) {
          this.orderWorkbench.isOrderWorkbenchScreen = false;
        }
        this.ragularOrder.CancelOrder();
      }
      else if (this.orderWorkbench.isOrderWorkbenchScreen) {
        if (this.ragularOrder != undefined) {
          this.ragularOrder.isRegularScreen = false;
        }
        this.orderWorkbench.CancelOrder();
      }
    }
    else if (type === "approveAndMas") {
      console.log("type approveAndMas start on Order Management Component  R");
      if (this.ragularOrder != undefined && this.ragularOrder.isRegularScreen) {
        if (this.orderWorkbench != undefined) {
          this.orderWorkbench.isOrderWorkbenchScreen = false;
        }
        console.log(this.ragularOrder);
        console.log("isRegularScreen " + this.ragularOrder.isRegularScreen);
        console.log("type approveAndMas ragularOrder.SendARChargesTOMAS() fire start on OMC screen  R");
        this.ragularOrder.SendARChargesTOMAS();
        console.log("type approveAndMas ragularOrder.SendARChargesTOMAS() fire end on OMC screen R");
      }
      else if (this.orderWorkbench.isOrderWorkbenchScreen) {
        if (this.ragularOrder != undefined) {
          this.ragularOrder.isRegularScreen = false;
        }
        console.log(this.orderWorkbench);
        console.log("isOrderWorkbenchScreen " + this.orderWorkbench.isOrderWorkbenchScreen);
        console.log("type approveAndMas orderWorkbench.SendARChargesTOMAS() fire start on OMC screen  R");
        this.orderWorkbench.SendARChargesTOMAS();
        console.log("type approveAndMas orderWorkbench.SendARChargesTOMAS() fire end on OMC screen  R");
      }
      //if (this.orderWorkbench == undefined)
      //  this.ragularOrder.SendARChargesTOMAS();
      //else
      //  this.orderWorkbench.SendARChargesTOMAS();

      console.log("type approveAndMas end on Order Management Component  R");
    }
    else if (type === "resendToMas") {
      this.orderWorkbench.ReSendARChargesTOMAS();
    }
    else if (type === "shipWith") {
      this.modalRef = this.modalService.open(ShipWithOrderComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.orderworkbenchInstance = this.orderWorkbench;
    }
    else if (type === "recurrence") {
      this.modalRef = this.modalService.open(RecurrenceComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type == "calculate") {

      if (this.ragularOrder != undefined && this.ragularOrder.isRegularScreen) {
        if (this.orderWorkbench != undefined) {
          this.orderWorkbench.isOrderWorkbenchScreen = false;
        }
        this.ragularOrder.calculateExistingOrder();
      }
      else if (this.orderWorkbench.isOrderWorkbenchScreen) {
        if (this.ragularOrder != undefined) {
          this.ragularOrder.isRegularScreen = false;
        }
        this.orderWorkbench.calculateExistingOrderFromWorkbench();
      }
    }

    else if (type == "save") {
      this.ragularOrder.SaveOrder();
    }
    else if (type == "saveAndNotify") {
      this.ragularOrder.SaveAndNotify();
    }
  }

  public closeTab() {
    localStorage.SelectedOrderIdLink = null;
    localStorage.SelectedOrderTypeIdLink = null;
    localStorage.isOrderLinkClick = null;
    localStorage.SelectedOrderType = null;

    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.tab4Data = false;
    this.btnBar.hideAction('save');
    this.btnBar.hideAction('saveAndNotify');
    // this.orderWorkbench.isCustomer = true;
    //setTimeout(function () {
    //alert();
    //this.orderWorkbench.isStockCollection = true;
    //}, 3000);

    this.orderManagementService.SalesOrderforEdit = [];
    this.orderWorkbench.selectedSalesOrderIds = [];
    this.orderWorkbench.selection.clear();
    this.orderWorkbench.selection1.clear();

    this.orderWorkbench.isCustomer = false;
    this.orderWorkbench.isStockCollection = false;
    this.orderWorkbench.ngOnInit();

    //this.orderWorkbench.isStockCollection = true;
  }

  modifyOrderNumber(event) {
    this.EditedOrderNumber = event;
  }
  modifyOrderNumberLink(event) {
    this.EditOrderNumberLink = event;
    this.actionHandler('edit', true);
  }
  OpenEditOrderScreen() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = true;
    this.tabGroup.selectedIndex = 2;
    this.tab1Data = true;
    this.tab3Data = false;
    this.tab2Data = false;
    this.tab4Data = true;
    this.btnBar.showAction('save');
    this.btnBar.showAction('saveAndNotify');

    if (this.orderWorkbench.SelectedTab.toLowerCase() == "outbound") {
      this.orderWorkbench.isCustomer = true;
      this.orderWorkbench.isStockCollection = false;
    } else if (this.orderWorkbench.SelectedTab.toLowerCase() == "inbound") {
      this.orderWorkbench.isCustomer = false;
      this.orderWorkbench.isStockCollection = true;
    }
  }
}
