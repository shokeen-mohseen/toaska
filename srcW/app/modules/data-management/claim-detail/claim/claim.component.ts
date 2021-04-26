import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions  } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;


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
  ngAfterViewInit() {  
    
    this.btnBar.hideTab('key_Action')
    this.btnBar.hideTab('key_View')
  }
  actionHandler(type) {
    if (type === "add") {

      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;

    } else if (type === "edit") {

      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 1;
      this.tab3Data = true;
      this.tab2Data = false;
      this.tab1Data = false;

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
  modalRef: NgbModalRef;
  IsTosca: boolean;
  constructor(private router: Router, public modalService: NgbModal) { }

  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions ();
  }

}
