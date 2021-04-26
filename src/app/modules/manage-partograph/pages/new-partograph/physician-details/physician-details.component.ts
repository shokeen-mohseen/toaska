import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddContactComponent } from '../../../../../shared/components/modal-content/add-contact/add-contact.component';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';

@Component({
  selector: 'app-physician-details',
  templateUrl: './physician-details.component.html',
  styleUrls: ['./physician-details.component.css']
})
export class PhysicianDetailsComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openContact() {
    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
  }
  AddMoreComplication() {

    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

}
