import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-edit-business-partner-type-popup',
  templateUrl: './add-edit-business-partner-type-popup.component.html',
  styleUrls: ['./add-edit-business-partner-type-popup.component.css']
})
export class AddEditBusinessPartnerTypePopupComponent implements OnInit {

  

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
