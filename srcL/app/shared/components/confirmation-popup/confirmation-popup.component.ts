import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html'
})
export class confirmationpopup implements OnInit {

  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal) { }
  @Input()
  msg: string = '';

  @Input()
  isYesNO: boolean = true;

  @Input()
  isOK: boolean = false;

  ngOnInit(): void {
  }

  closeModal(sendData) {    
    this.activeModal.close(sendData);
  }
}
