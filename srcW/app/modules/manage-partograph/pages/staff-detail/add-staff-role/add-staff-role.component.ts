import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddEditRoleComponent } from '../../../../../shared/components/modal-content/add-edit-role/add-edit-role.component';
@Component({
  selector: 'app-add-staff-role',
  templateUrl: './add-staff-role.component.html',
  styleUrls: ['./add-staff-role.component.css']
})
export class AddStaffRoleComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(public router: Router, public modalService: NgbModal) { }

  ngOnInit(): void {
  }
  openRole() {
    this.modalRef = this.modalService.open(AddEditRoleComponent, { size: 'lg', backdrop: 'static' });
  }
}
