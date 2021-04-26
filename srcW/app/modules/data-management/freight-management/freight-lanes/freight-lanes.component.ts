import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { AddEditFreightlanesComponent } from './add-edit-freightlanes/add-edit-freightlanes.component';
import { ImportComponent } from './import/import.component';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-freight-lanes',
  templateUrl: './freight-lanes.component.html',
  styleUrls: ['./freight-lanes.component.css']
})
export class FreightLanesComponent implements OnInit, AfterViewInit {
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
      this.tab2Data = false;
    }
    else if ($event.index === 2) {
      this.tab3Data = false;
    }
  }
  ngAfterViewInit(): void {
    {
      this.btnBar.showAction('filter')
      this.btnBar.showAction('import')
      this.btnBar.enableAction('graph')
            
    }
  }
  actionHandler(type) {
    if (type === "add") {

      this.modalRef = this.modalService.open(AddEditFreightlanesComponent, { size: 'lg', backdrop: 'static' });

    } else if (type === "edit") {

      this.modalRef = this.modalService.open(AddEditFreightlanesComponent, { size: 'lg', backdrop: 'static' });

    }
    else if (type === "view") {

     

    }

    else if (type === "import") {

      this.modalRef = this.modalService.open(ImportComponent, { size: 'lg', backdrop: 'static' });

    }

    else if (type === "delete") {

      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'md', backdrop: 'static' });

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
    this.actionGroupConfig = getGlobalRibbonActions();
  }
 
}
