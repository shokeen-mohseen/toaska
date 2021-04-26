import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRolesListViewModel, UseraccessService, AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.css']
})
export class AddEditRoleComponent implements OnInit {

  @Input() public userId: number;
  @Input() public currentTab: string;
  @Input() public loginId: string;
  @Input() public actionType: string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();
  @Input() public roleIds: string;

  list: UserRolesListViewModel[] = [];
  modelList: UserRolesListViewModel[] = [];
  constructor(
    public activeModal: NgbActiveModal, private toastrService: ToastrService, private useraccessService: UseraccessService,
    private authenticationService: AuthService
  ) { }

  ngOnInit(): void {
  }
  
  deleteUserRolesList(values: any) {
    this.passEntry.emit(values);
  }

  addEditUserRolesList(values: any[]) {

    if (this.actionType === 'addRolesButton') {     
      this.passEntry.emit(values);
    }
  }

  close() {
    this.passEntry.emit(this.list);
    this.activeModal.dismiss('Cross click');
  }
}
