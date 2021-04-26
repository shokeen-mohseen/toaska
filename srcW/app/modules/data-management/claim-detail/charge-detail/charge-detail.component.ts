import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddEditchargeComponent } from '../add-editcharge/add-editcharge.component';
@Component({
  selector: 'app-charge-detail',
  templateUrl: './charge-detail.component.html',
  styleUrls: ['./charge-detail.component.css']
})
export class ChargeDetailComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(private router: Router, public modalService: NgbModal) { }

  ngOnInit(): void {
  }
  openaddCharge() {
    this.modalRef = this.modalService.open(AddEditchargeComponent, { size: 'lg', backdrop: 'static' });
  }
}
