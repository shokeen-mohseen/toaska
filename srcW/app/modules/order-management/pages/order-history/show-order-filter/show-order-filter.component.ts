import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ShiptoContactDetailpopupComponent } from '../shipto-contact-detailpopup/shipto-contact-detailpopup.component';
@Component({
  selector: 'app-show-order-filter',
  templateUrl: './show-order-filter.component.html',
  styleUrls: ['./show-order-filter.component.css']
})
export class ShowOrderFilterComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(public router: Router, public modalService: NgbModal) { }

  ngOnInit(): void {
  }
  openShiptocontact() {
    this.modalRef = this.modalService.open(ShiptoContactDetailpopupComponent, { size: 'md', backdrop: 'static' });
  }
}
