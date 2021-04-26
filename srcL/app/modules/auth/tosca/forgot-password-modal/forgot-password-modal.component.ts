import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-forgot-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css']
})
export class ForgotPasswordModalComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  loginRedirect() {
     this.activeModal.dismiss('Cross click');
     this.router.navigate(['/auth/tosca-login']);
  }

}
