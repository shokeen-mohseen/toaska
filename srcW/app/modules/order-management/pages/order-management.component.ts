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
    this.btnBar.showAction('shipWith');
    this.btnBar.showAction('recurrence');
    this.btnBar.hideAction('active');
    this.btnBar.hideAction('inactive');
    this.btnBar.hideTab('key_View');
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

  EditedOrderNumber: string;

  tabChange($event) {
    if ($event.index === 0) { this.tab1Data = true; }
    else if ($event.index === 1) { this.tab2Data = true; }
    else if ($event.index === 2) { this.tab3Data = true; }
    else if ($event.index === 3) { this.tab4Data = true; }
  }
  actionHandler(type) {
    if (type === "regularOrder") {
      //alert('regularOrder'); 
      this.orderManagementService.SalesOrderforEdit = [];
      if (this.orderManagementService.SalesOrderforEdit.length > 0) {
        this.toster.info("Please UnSelect Order.");
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
    }
    else if (type === "edit") {
      if (this.orderManagementService.SalesOrderforEdit.length == undefined || this.orderManagementService.SalesOrderforEdit.length == 0) {
        this.toster.info("Please Select at least One Order.");
      }
      else {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = true;
        this.tabGroup.selectedIndex = 2;
        this.tab1Data = true;
        this.tab3Data = false;
        this.tab2Data = false;
        this.tab4Data = true;
        
        if (this.orderWorkbench.SelectedTab.toLowerCase() == "outbound") {
          this.orderWorkbench.isCustomer = true;
          this.orderWorkbench.isStockCollection = false;
        } else if (this.orderWorkbench.SelectedTab.toLowerCase() == "inbound"){
          this.orderWorkbench.isCustomer = false;
          this.orderWorkbench.isStockCollection = true;
        }

        this.ragularOrder.ngOnInit();



      }

    }
    else if (type === "copy") { }
    else if (type === "delete") {
      this.orderWorkbench.DeleteOrder();
    }
    else if (type === "export") { }
    else if (type === "orderCancel") {
      this.orderWorkbench.CancelOrder();
    }
    else if (type === "approveAndMas") {
      this.ragularOrder.SendARChargesTOMAS();
    }
    else if (type === "resendToMas") { }
    else if (type === "shipWith") {
      this.modalRef = this.modalService.open(ShipWithOrderComponent, { size: 'lg', backdrop: 'static' });
    }
    else if (type === "recurrence") {
      this.modalRef = this.modalService.open(RecurrenceComponent, { size: 'xl', backdrop: 'static' });
    }
  }

  closeTab() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.tab4Data = false;

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

}
