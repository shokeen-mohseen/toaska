import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-unauthorized-access',
  templateUrl: './unauthorized-access.component.html',
  styleUrls: ['./unauthorized-access.component.css']
})
export class UnauthorizedAccessComponent implements OnInit, AfterViewInit {

  IsTosca: boolean;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  //tabs section
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  tab1: boolean = true;
  tab1Data: boolean = true;
 
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
    this.btnBar.hideAction('export');
    this.btnBar.hideTab('key_Data');
  }

 
  tabChange($event) {
    if ($event.index === 0) { this.tab1Data = true; }
  }
  actionHandler(type) { }


}

