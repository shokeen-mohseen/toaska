import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-tbl-popup',
  templateUrl: './update-tbl-popup.component.html',
  styleUrls: ['./update-tbl-popup.component.css']
})
export class UpdateTblPopupComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal(sendData) {    
    this.activeModal.close(sendData);
  }
}
