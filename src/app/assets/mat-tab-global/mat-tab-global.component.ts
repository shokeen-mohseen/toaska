import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-mat-tab-global',
  templateUrl: './mat-tab-global.component.html',
  styleUrls: ['./mat-tab-global.component.css']
})
export class MatTabGlobalComponent implements OnInit, AfterViewInit {

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  
  tab1: boolean = true;
  tab2: boolean = true;
  tab3: boolean = false;
  tab4: boolean = false;
  tab5: boolean = false;
  tab6: boolean = false;

  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  tab4Data: boolean = false;
  tab5Data: boolean = false;
  tab6Data: boolean = false;

  tab2A: boolean = false;
  tab2DataA: boolean = false;

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
      
    }
    else if (type === "edit") {

      if (this.tabGroup.selectedIndex == 0) {
        this.tab5 = true;
        this.tab5Data = true;
        this.tab6 = false;
        this.tab6Data = false;
        this.tab1 = true;
        this.tab1Data = false;
        this.tab2 = false;
        this.tab2Data = false;
        this.tab2A = false;
        this.tab2DataA = false;
        this.tabGroup.selectedIndex = 1;
      }

      else if (this.tabGroup.selectedIndex == 1) {
        this.tab5 = false;
        this.tab5Data = false;
        this.tab6 = true;
        this.tab6Data = true;
        this.tab1 = false;
        this.tab1Data = false;
        this.tab2 = false;
        this.tab2Data = false;
        this.tab2A = true;
        this.tab2DataA = false;
        this.tabGroup.selectedIndex = 1;
      }

      
      
    }
    else if (type === "delete") {

    }
    else if (type === "import") {

    }
    else if (type === "export") {

    }
  }

  closeTab() {
    this.tab5 = false;
    this.tab5Data = false;
    this.tab6 = false;
    this.tab6Data = false;
    this.tab1 = true;
    this.tab1Data = true;
    this.tab2 = true;
    this.tab2A = false;
    this.tab2DataA = false;
    this.tabGroup.selectedIndex = 0;
  }

  constructor() { }

  ngOnInit(): void {
    this.actionGroupConfig = getGlobalRibbonActions();
  }

  ngAfterViewInit() {
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }


}
