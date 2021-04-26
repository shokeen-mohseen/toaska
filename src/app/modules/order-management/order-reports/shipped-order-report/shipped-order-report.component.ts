import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-shipped-order-report',
  templateUrl: './shipped-order-report.component.html',
  styleUrls: ['./shipped-order-report.component.css']
})
export class ShippedOrderReportComponent implements OnInit, AfterViewInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  IsTosca: boolean;

  ngAfterViewInit() {
    this.btnBar.showAction('back');
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideTab('key_Data');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

  actionHandler(type) {
    if (type === 'back') {
      this.route.navigate(['/order-management/planned-report']);
    }
  }

  constructor(
    private route: Router
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

}
