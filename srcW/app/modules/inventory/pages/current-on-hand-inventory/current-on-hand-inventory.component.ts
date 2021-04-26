import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { EditInventoryComponent } from './edit-inventory/edit-inventory.component';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-current-on-hand-inventory',
  templateUrl: './current-on-hand-inventory.component.html',
  styleUrls: ['./current-on-hand-inventory.component.css']
})
export class CurrentOnHandInventoryComponent implements OnInit, AfterViewInit {

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  tab1: boolean = true;
  tab1Data: boolean = true;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
  }

  actionHandler(type) {
    if (type === "add") {

      this.modalRef = this.modalService.open(AddInventoryComponent, { size: 'md', backdrop: 'static' });

    }
    else if (type === "edit") {

      this.modalRef = this.modalService.open(EditInventoryComponent, { size: 'md', backdrop: 'static' });

    }
    else if (type === "delete") {

    }
    else if (type === "import") {

    }
    else if (type === "export") {

    }
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
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

}
