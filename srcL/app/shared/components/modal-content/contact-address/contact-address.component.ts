import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-address',
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.css']
})

  //TFSID 17370, Rizwan Khan, 10 Aug 2020, Add contact and address control 

export class ContactAddressComponent {
  @Input() public contactTypeCode;
  @Input() public contactData;
  @Input() public addressData;
 
  @Input() contactActionType: string;
  constructor(public activeModal: NgbActiveModal) { }

}
