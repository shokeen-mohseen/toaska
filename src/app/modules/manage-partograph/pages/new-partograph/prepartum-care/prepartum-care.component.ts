import { Component, Output, Input, EventEmitter, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OthersCommonComponent } from '../../../../../shared/components/modal-content/others-common/others-common.component';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-prepartum-care',
  templateUrl: './prepartum-care.component.html',
  styleUrls: ['./prepartum-care.component.css']
})
export class PrepartumCareComponent implements OnInit, AfterViewInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  public btnStatus: ButtonPreviousNextStatus;
  modalRef: NgbModalRef;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  tab4Data: boolean = false;
  tab5Data: boolean = false;
  constructor(private data: DataService, public modalService: NgbModal, private route: Router) {
    this.btnStatus = new ButtonPreviousNextStatus();
  }

  ngOnInit(): void {
    this.btnStatus.btnPrevious = true;
    this.btnStatus.btnNext = true;
    this.btnStatus.previousPage = '/manage-partograph/new-partograph/registration';
    this.btnStatus.nextPage = '/manage-partograph/new-partograph/partograph-monitoring';
    // send button status withe respect to page
    this.data.buttonStatus(this.btnStatus);

    // send stepper name on progress bar
    this.data.SendPartographSource('key_PrepartumCare');

    this.actionGroupConfig = getGlobalRibbonActions();
  }

  ngAfterViewInit() {

    this.btnBar.hideAction('refresh');
    this.btnBar.hideAction('cancel');
    this.btnBar.hideAction('showDetails');
    this.btnBar.hideAction('invoice');
    this.btnBar.hideAction('duplicateForecast');
    this.btnBar.hideAction('deleteSelectedRow');
    this.btnBar.hideAction('deleteSelectedForecast');
    this.btnBar.hideAction('refresh');
    this.btnBar.hideAction('regularOrder');
    this.btnBar.hideAction('bulkOrder');
    this.btnBar.hideAction('copy');
    this.btnBar.hideAction('updateContract');

    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('issue');
    this.btnBar.showAction('workBench');

    this.btnBar.hideTab('key_Data');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

  actionHandler(type) {
    if (type === 'workBench') {
      this.route.navigate(['/manage-partograph']);
    }
  }

  //to open modal
  openModal() {
    this.modalRef = this.modalService.open(OthersCommonComponent, { size: 'md', backdrop: 'static' });
  }

  selectNext(el) {
    el.selectedIndex += 1;
  }
  selectPrev(el) {
    el.selectedIndex -= 1;
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
    else if ($event.index === 3) {
      this.tab4Data = true;
    }
    else if ($event.index === 4) {
      this.tab5Data = true;
    }
  }
  

}
