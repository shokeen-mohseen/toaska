import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';
import { ReasonCodeComponent } from './reason-code/reason-code.component';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-shipment-history',
  templateUrl: './shipment-history.component.html',
  styleUrls: ['./shipment-history.component.css']
})
export class ShipmentHistoryComponent implements OnInit, AfterViewInit {

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  tab1: boolean = true;
  tab2: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
  }

  actionHandler(type) {
    if (type === "showDetails") {

      this.tab1 = true;
      this.tab2 = true;
      this.tabGroup.selectedIndex = 1;
      this.tab2Data = true;
      this.tab1Data = false;

    }
    else if (type === "refresh") {
    }
    else if (type === "export") {
    }
    else if (type === "reasonCode")
    {
      this.modalRef = this.modalService.open(ReasonCodeComponent, { size: 'xl', backdrop: 'static' });
    }
  }

  closeTab() {

    this.tab1 = true;
    this.tab2 = false;
    this.tab1Data = true;
    this.tab2Data = false;
  }

  modalRef: NgbModalRef;
  IsTosca: boolean;
  constructor(
    public modalService: NgbModal
  ) { }

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
    this.btnBar.hideAction('delete');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

}
