import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocationListViewModel } from '../../../../core';

@Component({
  selector: 'app-add-edit-planning-location',
  templateUrl: './add-edit-planning-location.component.html',
  styleUrls: ['./add-edit-planning-location.component.css']
})
export class AddEditPlanningLocationComponent implements OnInit {

  @Input() public userId: number;
  @Input() public loginId: string;
  @Input() public actionType: string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();

  list: UserLocationListViewModel[] = [];
  modelList: UserLocationListViewModel[] = [];
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }
  
  deleteUserLocationList(values: any) {
    this.passEntry.emit(values);
  }

  addEditUserLocationList(values: any[]) {     
      this.passEntry.emit(values);
  }

  close() {
    this.passEntry.emit(this.list);
    this.activeModal.dismiss('Cross click');
  }

}
