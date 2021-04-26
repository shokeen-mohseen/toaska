import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactAddressComponent } from '@app/shared/components/modal-content/contact-address/contact-address.component';
@Component({
  selector: 'app-patient-setup',
  templateUrl: './patient-setup.component.html',
  styleUrls: ['./patient-setup.component.css']
})
export class PatientSetupComponent implements OnInit {
  modalRef: NgbModalRef;
  public btnStatus: ButtonPreviousNextStatus;
  constructor(public modalService: NgbModal,private data: DataService) {
    this.btnStatus = new ButtonPreviousNextStatus();
  }

  ngOnInit() {
    //this.btnStatus.btnPrevious = false;
    //this.btnStatus.btnNext = true;
    //this.btnStatus.previousPage = '';
    //this.btnStatus.nextPage = '/manage-partograph/new-partograph/examination';
    // send button status withe respect to page
    //this.data.buttonStatus(this.btnStatus);
    // send stepper name on progress bar
    //this.data.SendPartographSource('key_Register');

  }

  //TFSID 17370, Rizwan Khan, 10 Aug 2020, Open contact and address control 

  //OpenAddressContact() {

  //  this.modalRef = this.modalService.open(ContactAddressComponent, { size: 'xl', backdrop: 'static' });

  //  this.modalRef.result.then((result) => {
  //    //console.log(result);
  //  }).catch((result) => {
  //    console.log(result);
  //  });

  //}
}





