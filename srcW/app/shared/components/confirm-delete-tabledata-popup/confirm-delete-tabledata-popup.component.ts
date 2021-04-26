import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-confirm-delete-tabledata-popup',
  templateUrl: './confirm-delete-tabledata-popup.component.html',
  styleUrls: ['./confirm-delete-tabledata-popup.component.css']
})
export class ConfirmDeleteTabledataPopupComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  closeModal(sendData) {
    debugger;
    this.activeModal.close(sendData);
  }
}
