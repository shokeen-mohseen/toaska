import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-delete-commoditytype-popup',
  templateUrl: './delete-commoditytype-popup.component.html',
  styleUrls: ['./delete-commoditytype-popup.component.css']
})
export class DeleteCommoditytypePopupComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  closeModal(sendData) {
    this.activeModal.close(sendData);
  }
}
