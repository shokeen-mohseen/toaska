import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PhysicianAddComponent } from '../../../../../shared/components/physician-add/physician-add.component';
@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styleUrls: ['./physicians.component.css']
})
export class PhysiciansComponent implements OnInit {
  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal,) { }

  ngOnInit(): void {
  }
  addPhy() {
    this.modalRef = this.modalService.open(PhysicianAddComponent, { size: 'lg', backdrop: 'static' });
  }
}
