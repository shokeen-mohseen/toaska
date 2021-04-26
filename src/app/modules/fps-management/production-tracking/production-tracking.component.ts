import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { TopBtnGroupComponent } from '../../../shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '../../../shared/components/top-btn-group/page-actions-map';

@Component({
  selector: 'app-production-tracking',
  templateUrl: './production-tracking.component.html',
  styleUrls: ['./production-tracking.component.css']
})
export class ProductionTrackingComponent implements OnInit, AfterViewInit {


  IsTosca: boolean;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  constructor() { }

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
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('active');
    this.btnBar.hideAction('inactive');
    this.btnBar.hideTab('key_View');
    this.btnBar.hideTab('key_Action');
  }

  //tabs section
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  tab1: boolean = true;
  tab1Data: boolean = true;
  tabChange($event) {
    if ($event.index === 0) { this.tab1Data = true; }
  }
  actionHandler(type) { }

  closeTab() {
    this.tab1 = true;
    this.tab1Data = true;
  }

}

