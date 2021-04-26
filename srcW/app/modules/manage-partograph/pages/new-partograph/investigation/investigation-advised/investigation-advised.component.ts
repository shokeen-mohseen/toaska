import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../../shared/components/modal-content/add-complications/add-complications.component';

@Component({
  selector: 'app-investigation-advised',
  templateUrl: './investigation-advised.component.html',
  styleUrls: ['./investigation-advised.component.css']
})
export class InvestigationAdvisedComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }
}



