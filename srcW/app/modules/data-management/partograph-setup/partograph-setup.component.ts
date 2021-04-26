import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddContactComponent } from '../../../shared/components/modal-content/add-contact/add-contact.component';
import { OthersCommonComponent } from '../../../shared/components/modal-content/others-common/others-common.component';
import { AddEditRoleComponent } from '../../../shared/components/modal-content/add-edit-role/add-edit-role.component';


@Component({
  selector: 'app-partograph-setup',
  templateUrl: './partograph-setup.component.html',
  styleUrls: ['./partograph-setup.component.css']
})
export class PartographSetupComponent implements OnInit {
  
  isLinear = false;
  startScreen = true;
  nextScreen = false;
  wizardTab = false;
  currentTab = 0;
  modalRef: NgbModalRef;
  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    
  }

  openContact() {
    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
  }

  openAddress() {
    this.modalRef = this.modalService.open(OthersCommonComponent, { size: 'lg', backdrop: 'static' });
  }

  openRolePopup() {
    this.modalRef = this.modalService.open(AddEditRoleComponent, { size: 'lg', backdrop: 'static' });
  }

  startClick() {
    this.startScreen = false;
    this.nextScreen = true;
    this.wizardTab = true;
  }
  changeTab(index: number): void {
    this.currentTab += index;
  }


}
