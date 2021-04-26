import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.css']
})
export class AddEditAddressComponent implements OnInit {
  @Input() public modalData;
  @Input("getAddresById") getAddresById: number;
  @Input("isEditRights") isEditRights: boolean;
  mode: string;
  @Input() contactActionType: string;
  //@Input() userId: number;
  //@Input() locationId: number;
  @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();
  @Input() addressIds: string;
  @Input() isEdit: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.mode = this.modalData;

  }

  addEditUserAddress(value) {
    this.passEntry.emit(value);
    if (!!this.addressIds) {
      this.activeModal.dismiss('Cross click');
    }
  }


}
