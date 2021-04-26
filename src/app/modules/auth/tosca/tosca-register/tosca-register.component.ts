import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core';
import { SubscriptionPromotionService } from '@app/modules/plan/pages/services/subscription-promotion.services';
import { ClientRegistrationModal } from '@app/core/models/clientRegistration.model';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component';
@Component({
  selector: 'app-tosca-register',
  templateUrl: './tosca-register.component.html',
  styleUrls: ['./tosca-register.component.css']
})
export class ToscaRegisterComponent implements OnInit {

  registerform: FormGroup;
  userData: ClientRegistrationModal = new ClientRegistrationModal();
  returnUrl: string;
  error: string;
  isLoading: boolean;
  PrefixValue: any;
  SuffixValue: any;
  suffixdata: string;
  prefixdata: string;
  EntityID: number; UserAlertID: number;
  validate: boolean = true;
  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal, private formBuilder: FormBuilder, public translate: TranslateService, private authService: AuthService, private subscriptionService: SubscriptionPromotionService, private router: Router, private toastrService: ToastrService, private titleService: Title) {
    //this.buildForm();
    titleService.setTitle("LAMPS Tosca");
    this.registerform = this.formBuilder.group({

    });

  }

  ngOnInit(): void {
    this.registerform = this.formBuilder.group({      
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: ['', Validators.required],
      LoginId: ['', Validators.required]
    });

    this.authService.getPrefix()
      .subscribe(
        data => {
          this.PrefixValue = data.data;
        });
    this.authService.getSuffix()
      .subscribe(
        data => {
          this.SuffixValue = data.data;
        });
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }



  get formData() {
    return this.registerform.controls;
  }
  
  selectPrefix(event) {
    this.prefixdata = event.target.value;
  }
  selectSuffix(event) {
    this.suffixdata = event.target.value;
  }

  

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  EmailValidate(event: any) {
    var email = event.target.value;
    if (email == "") {
      return false;
    }
    var serchfind: boolean;
    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    serchfind = regexp.test(email);
    if (!serchfind) {
      this.toastrService.error("Login ID (E-mail) is invalid.");
      return false;
    }

  }

  register() {
   
    if (this.registerform.invalid) {
      return;
    }
    this.isLoading = true;
    var FirstName = this.formData.FirstName.value;
    var MiddleName = this.formData.MiddleName.value == null ? "" : this.formData.MiddleName.value;
    var LastName = this.formData.LastName.value;
    var Prefix = this.prefixdata == null ? "" : this.prefixdata;
    var Suffix = this.suffixdata == null ? "" : this.suffixdata;
    var LoginId = this.formData.LoginId.value;
    var tempassword = this.getRandomString(7);
    var Password = this.authService.functionencrypt(tempassword);

    this.authService.CheckToscaUser(LoginId)
      .subscribe(
        res => {
          var response = res.Data;
          if (!response) {
            this.authService.registerClientTosca(FirstName, MiddleName, LastName, Prefix, Suffix, LoginId, Password)
              .subscribe(

                data => {
                
                  if (data != null && data.Message === "Success") {
                    var UserId = data.Data.Id;
                    var ClientId = 100;
                    this.Alert(UserId, ClientId);
                    //  this.toastrService.success('User has been registered successfully');
                    //  this.router.navigate(['/auth/login']);

                    //this.router.navigate(['/plan/plan']);
                  }
                  else {
                    this.toastrService.error('Contract could not be saved. Please check the data being entered or contact Tech Support');
                    this.isLoading = false;
                    this.router.navigate(['/auth/tosca-register']);
                  }
                },
                error => {
                  this.error = error;
                  this.isLoading = false;
                }

              );
          }
          else {
            this.toastrService.warning("Login ID (E-mail) has already been used.");
            this.isLoading = false;
            return false;
          }
        });
  }

  Alert(UserId,Client) {

    let ClientId = null;
    let Name = "Users";

    // let entityId: number;
    this.subscriptionService.getEntityDetails(ClientId, Name).subscribe(res => {
      if (res.message == "Success") {
        this.EntityID = res.data.id;
        // alert(res.data.id);
        Name = "User Registration Request - To User";
        this.subscriptionService.getUserAlertDetails(ClientId, Name).subscribe(result => {
          if (result.message == "Success") {
            this.UserAlertID = result.data.id;
            let EntityKeyId = UserId;

            this.subscriptionService.SaveAlertSystem(this.UserAlertID, this.EntityID, EntityKeyId, Client).subscribe(res => {
              if (res.message == "Success") {
                this.isLoading = false;
                this.toastrService.success("User is registered successfully.");
                //this.router.navigate(['/auth/tosca-login']);
                this.modalRef = this.modalService.open(WelcomeModalComponent, { size: 'lg', backdrop: 'static' });
              }
              else {
                this.toastrService.success("Error");
              }
            });
          }
          else {
            this.UserAlertID = 0;
          }
        });
      }
      else {
        this.EntityID = 0;
      }
    });



  }

  /*validation(): boolean {
    if (!!!this.userData.FirstName) {
      this.toastrService.error('Please enter First Name');
      return false;
    }
    if (!!!this.userData.LastName) {
      this.toastrService.error('Please enter Last Name');
      return false;
    }
    if (!!!this.userData.LoginId) {
      this.toastrService.error('Please enter User Id');
      return false;
    }
    else if (this.userData.LoginId.length < 6) {
      this.toastrService.error('Please enter User Id more then 5 character');
      return false;
    }

   
    return true;
  }*/

  welcome() {
    this.modalRef = this.modalService.open(WelcomeModalComponent, { size: 'lg', backdrop: 'static' });
  }
}
