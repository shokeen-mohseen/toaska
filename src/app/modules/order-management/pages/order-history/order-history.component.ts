import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { OrderHistoryListComponent } from './order-history-list/order-history-list.component';
import { ToastrService } from 'ngx-toastr';
import { OrderManagementService } from '../../../../core/services/order-management.service';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(OrderHistoryListComponent) orderHistory: OrderHistoryListComponent;
  actionGroupConfig;
  OrderHistoryList: string = "OrderHistoryExport";
  modalRef: NgbModalRef;

  constructor(public modalService: NgbModal, private orderManagementService: OrderManagementService, private toster: ToastrService) { }

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
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
    else if ($event.index === 2) {
      this.tab3Data = true;
    }
  }

  actionHandler(type) {
    if (type === "showDetails") {    
      if (this.orderHistory.SelectedsalesOrderCount > this.orderHistory.MaxEditedRecordsCountPreferences) {
        this.toster.info("You cannot show records more then " + this.orderHistory.MaxEditedRecordsCountPreferences);
        return;
      }

      if (this.orderManagementService.SalesOrderforEdit.length == undefined || this.orderManagementService.SalesOrderforEdit.length == 0) {
        this.toster.info("Please select at least one Order");
      }
      else {
        this.tab1 = false;
        this.tab2 = true;
        this.tab3 = false;
        this.tabGroup.selectedIndex = 0;
        this.tab1Data = false;
        this.tab3Data = false;
        this.tab2Data = true;
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

  IsTosca: boolean;

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
    this.btnBar.showAction('showDetails');
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

}

