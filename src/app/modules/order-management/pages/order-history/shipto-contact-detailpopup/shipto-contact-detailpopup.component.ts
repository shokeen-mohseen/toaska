import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-shipto-contact-detailpopup',
  templateUrl: './shipto-contact-detailpopup.component.html',
  styleUrls: ['./shipto-contact-detailpopup.component.css']
})
export class ShiptoContactDetailpopupComponent implements OnInit {
  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal) { }


  ngOnInit(): void {
  }
 
}
