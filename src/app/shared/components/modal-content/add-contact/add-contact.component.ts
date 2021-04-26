import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonCallListViewModel } from '../../../../core';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  @Input() public modalData; 
  mode: string;
  @Input() contactActionType: string;
  @Input() ContactById: number;
  @Input() isEditRights: boolean;
  //@Input() locationId: number;
  //@Input() patientId: number;
  @Input() userId: number;
  @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();
  @Input() contactIds: string;
  

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.mode = this.modalData;
  }

  addEditUserContact(value) {
    this.passEntry.emit(value);
    if (!!this.contactIds) {
      this.activeModal.dismiss('Cross click');
    }
  }

}
