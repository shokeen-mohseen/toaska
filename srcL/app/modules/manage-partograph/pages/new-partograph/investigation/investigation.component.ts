import { Component, OnInit } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';
import Stepper from 'bs-stepper';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OthersCommonComponent } from '../../../../../shared/components/modal-content/others-common/others-common.component';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.css']
})
export class InvestigationComponent implements OnInit {


  public btnStatus: ButtonPreviousNextStatus;
  private stepper: Stepper;
  modalRef: NgbModalRef;
  status: boolean = false;
  constructor(private data: DataService, public modalService: NgbModal) {
    this.btnStatus = new ButtonPreviousNextStatus();
  }


  next() {
    this.stepper.next();
  }
  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper11'), {
      linear: false,
      animation: true
    });

  }

  openNotes() {
    this.status = !this.status;
  }

  //to open modal
  openModal() {
    this.modalRef = this.modalService.open(OthersCommonComponent, { size: 'md', backdrop: 'static' });
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }



}
