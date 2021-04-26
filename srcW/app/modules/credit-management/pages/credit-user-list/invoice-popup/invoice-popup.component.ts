import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoice-popup',
  templateUrl: './invoice-popup.component.html',
  styleUrls: ['./invoice-popup.component.css']
})
export class InvoicePopupComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
