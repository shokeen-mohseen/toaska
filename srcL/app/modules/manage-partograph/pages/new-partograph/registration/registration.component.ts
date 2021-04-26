import { Component, Output, Input, EventEmitter, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactAddressComponent } from 'app/shared/components/modal-content/contact-address/contact-address.component';
import { FormGroup } from '@angular/forms';
import { HospitalDetailsComponent } from '../hospital-details/hospital-details.component';
import { PatientInformationComponent } from '../patient-information/patient-information.component';
import { PartographSessionManagement, ServerChartValues } from '../../../modals/input-chart';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

import { Router } from '@angular/router';

@Component({
  providers: [PatientInformationComponent,HospitalDetailsComponent],
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, AfterViewInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  public btnStatus: ButtonPreviousNextStatus;
  @Input() form1: any
    ; FormStatus: string;
  @Input() EventFrom1: string;
  IsValidate: boolean = true;
  @Output() Formeventsend = new EventEmitter<any>();
  @Input() FormSaveInformation;
  IsEnableTab: boolean; IsEnableTab$: any;
  modalRef: NgbModalRef;
  isValidate: false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  constructor(private patientinformationComp: PatientInformationComponent,
    private hospitalComp: HospitalDetailsComponent, private data: DataService,
    public modalService: NgbModal, private route: Router) {
    this.btnStatus = new ButtonPreviousNextStatus();
    this.IsValidate = true;
  }

  // Add form Data 

  SendFormData(data: any) {
    this.form1 = data;
    //console.log(this.form1)
  }

  // add mode 

  SetPageName(data: any) {
    this.EventFrom1 = data;
  }

  ngOnInit(): void {

    this.btnStatus.btnPrevious = false;
    this.btnStatus.btnNext = true;
    this.btnStatus.previousPage = '';
   // this.btnStatus.isValidateSaveButton = true;
    this.btnStatus.nextPage = '/manage-partograph/new-partograph/prepartum-care';
    // send button status withe respect to page
    this.data.buttonStatus(this.btnStatus);
    // send stepper name on progress bar
    this.data.SendPartographSource('key_Register');

    //if (ServerChartValues.MatTabButtonEnable()) {
    //  this.IsEnableTab = true;
    //}
    //else {
    //  this.IsEnableTab = false;
    //}
    this.IsEnableTab$ = this.data.getMessage();

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
 

  OpenAddressContact() {
     this.modalRef = this.modalService.open(ContactAddressComponent, { size: 'xl', backdrop: 'static' });
  }

  selectNext(el) {
    el.selectedIndex += 1;
  }
  selectPrev(el) {
    el.selectedIndex -= 1;
    
  }
  //@Output() reloadData = new EventEmitter<string>();
  tabChange($event) {
    this.tab2Data = false;
    this.tab3Data = false;
    this.tab1Data = false;

    this.data.sendMessage1(ServerChartValues.MatTabButtonEnable());

    //if (this.form != undefined) {
    //  if (this.form.in)
    //  this.form.reset();
    //}

    //this.patientinformationComp.p1form.valueChanges.subscribe(x => {
    //  //console.log(this.p1form.invalid)
    //  if (this.patientinformationComp.p1form.invalid) {
    //    // this.patientsetup.IsEnable = true;
    //    this.eventsend.emit(this.p1form);
    //    return;
    //  }
    //})


   // this.patientinformationComp.p1form.reset();
    //this.hospitalComp.regForm.reset();
   // this.reloadData.emit("2");

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


  public IsEnable() {
    return ServerChartValues.MatTabButtonEnable();
    //let IsEnabletab = this.data.getStatus();
    //console.log(IsEnabletab)
    //return IsEnabletab
   
  }

}
