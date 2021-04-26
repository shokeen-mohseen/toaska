import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-del-sign',
  templateUrl: './del-sign.component.html',
  styleUrls: ['./del-sign.component.css']
})
export class DelSignComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
