import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { EditSpecialPrefrenceComponent } from './edit-special-prefrence/edit-special-prefrence.component';

@Component({
  selector: 'app-special-preference',
  templateUrl: './special-preference.component.html',
  styleUrls: ['./special-preference.component.css'],

})
export class SpecialPreferenceComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;

  modalRef: NgbModalRef;
  IsTosca: boolean;

  tabChange($event) {
    
  }

  actionHandler(type) {
    if (type === 'edit') {
      this.modalRef = this.modalService.open(EditSpecialPrefrenceComponent, { size: 'md', backdrop: 'static' });
    }
  }

  constructor(private router: Router, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: false,
      text: "Select",
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //disabled: true
    };
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  ngAfterViewInit() {
    this.btnBar.hideAction('add');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

}
