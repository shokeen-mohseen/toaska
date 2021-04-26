import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ChangePasswordform: FormGroup;
  isLoading: boolean;
  password;
  show = false;
  constructor(private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal, private authService: AuthService, private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.ChangePasswordform = this.formBuilder.group({
      userexistpassword: ['', Validators.required],     
      usernewpassword: [
        '',
        [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#-_~^()])[A-Za-z\d$@$!%*?&#-_~^()].{7,20}')
        ]
      ],
      userconfirmpassword: [
        '',
        [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#-_~^()])[A-Za-z\d$@$!%*?&#-_~^()].{7,20}')
        ]
      ]     

    });
    this.password = 'password';
  }

  showPassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  get f() {
    return this.ChangePasswordform.controls;
  }

  ChangePassword() {
    debugger;
    if (this.ChangePasswordform.invalid) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
   
    if (this.f.usernewpassword.value != this.f.userconfirmpassword.value) {
      this.toastrService.error('New Password and Confirm Password are not matching. Please reenter the passwords');
      this.isLoading = false;
      return;
    }
    var UserId = this.authService.currentUserValue.UserId;
    var existpassword = this.authService.functionencrypt(this.f.userexistpassword.value);
    var newPassword = this.authService.functionencrypt(this.f.usernewpassword.value);

    this.authService.CheckExistPassword(UserId, existpassword)
      .subscribe(
        data => {
          var response = data.Data;
          if (response) {

            this.authService.ChangeExistPassword(UserId, newPassword)
              .subscribe(
                res => {
                  var response2 = res.Data;
                  if (response2) {
                    this.authService.currentUserValue.IsTempPassword = false;
                    this.toastrService.success('Password changed successfully.');
                    this.isLoading = false;
                    this.activeModal.dismiss('Cross click');
                    return false;
                  }
                });
          }
          else {
          
            this.toastrService.error('Current Password is not correct. Please reenter the password.');
            this.isLoading = false;
            return false;
          }

        });

  }

}
