import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';
import Stepper from 'bs-stepper';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})
export class ExaminationComponent implements OnInit {

  modalRef: NgbModalRef;
  private stepper: Stepper;
  constructor(public modalService: NgbModal) {
    
  }

  next() {
    this.stepper.next();
  }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper12'), {
      linear: false,
      animation: true
    });
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

}
