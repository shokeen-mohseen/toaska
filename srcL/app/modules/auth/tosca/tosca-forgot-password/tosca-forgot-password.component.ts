import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { UseraccessService } from '@app/core/services/useraccess.service';
import { CommonStatusListViewModel } from '@app/core/models/user.model';
import { Title } from '@angular/platform-browser';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-tosca-forgot-password',
  templateUrl: './tosca-forgot-password.component.html',
  styleUrls: ['./tosca-forgot-password.component.css']
})
export class ToscaForgotPasswordComponent implements OnInit {
  forgotform: FormGroup;
  isLoading: boolean;
  LoginId: string;
  Check: boolean = true;
  object: CommonStatusListViewModel = new CommonStatusListViewModel();
  modalRef: NgbModalRef;
  constructor(private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private useraccessService: UseraccessService,
    public modalService: NgbModal,) {
    titleService.setTitle("LAMPS Tosca");
    this.forgotform = this.formBuilder.group({
      LoginId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //this.favIcon.href = 'assets/images/tosca.png';
  }
  get formData() {
    return this.forgotform.controls;
  }
  EmailValidate(event: any) {
    if (event.target.value == "") {
      return false;
    }
     this.authService.CheckToscaUser(event.target.value)
      .subscribe(
        res => {
          var response = res.Data;
          if (!response) {
            this.toastrService.error("Login ID (E-mail) is invalid.");
            return false;
          }
        });
  }

  submit() {
    if (this.forgotform.invalid) {
      return;
    }
    this.isLoading = true;
    var LoginId = this.formData.LoginId.value;
    this.useraccessService.getAllUserByLoginIds(LoginId)
      .subscribe(
        res => {
          var response = res.Data;
          if (response.length > 0) {
            this.object.Ids = response[0].Id;
            this.object.Action = "forgotPassword";
            if (this.Check) {
              this.Check = false;
              this.useraccessService.setUserStatusList(this.object)
                .subscribe(res => {
                  if (res.Data) {
                    //this.toastrService.success("New password has been sent to your email.");
                    this.formData.LoginId.setValue("");
                    this.isLoading = false;
                   // this.router.navigate(['/auth/tosca-login']);
                    this.modalRef = this.modalService.open(ForgotPasswordModalComponent, { size: 'md', backdrop: 'static' });
                   
                  }
                });
            }
          }
          else {
            this.toastrService.error("Login ID (E-mail) is invalid.");
            this.isLoading = false;
            return false;
          }
        });
  }
}
