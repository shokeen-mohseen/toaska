import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';

@Component({
  selector: 'app-micro-indicator',
  templateUrl: './micro-indicator.component.html',
  styleUrls: ['./micro-indicator.component.css']
})
export class MicroIndicatorComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  IsTosca: boolean;

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  constructor(private router: Router) { }


  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }
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
  ngAfterViewInit(): void {
    this.btnBar.hideTab('key_View');
  }

  actionHandler(type) {
    if (type === "add") {
      this.tab1 = true;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 1;
      this.tab2Data = true;
      this.tab1Data = false;
      this.tab3Data = false;
    }
    else if (type === "edit") {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 2;
      this.tab3Data = true;
      this.tab1Data = false;
      this.tab2Data = true;
    }
  }
  closeTab(action) {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
  }

}

