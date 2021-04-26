import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, delay, finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/core';
import * as CryptoJS from 'crypto-js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MultipleClientComponent } from 'app/modules/auth/pages/multiple-client/multiple-client.component';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-tosca-login',
  templateUrl: './tosca-login.component.html',
  styleUrls: ['./tosca-login.component.css']
})
export class ToscaLoginComponent implements OnInit {
  returnUrl: string;
  error: string;
  isLoading: boolean;
  loginForm: FormGroup;
  modalRef: NgbModalRef;
  password;
  show = false;

  favIcon: HTMLLinkElement = this.document.querySelector('#appIcon');
  loader = this.loadingBar.useRef();
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingBar: LoadingBarService,
    public loadingController: LoadingController,
    private authService: AuthService, public modalService: NgbModal, private titleService: Title
  ) {
    titleService.setTitle("LAMPS Tosca");
    this.buildForm();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 200000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  ngOnInit(): void {debugger
    this.password = 'password';
    this.favIcon.href = 'assets/images/tosca.png'; 
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.router.navigate(['/dashboard/home']);
       
    }
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
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;

    const credentials = this.loginForm.value;
    var password = this.functionencrypt(this.f.password.value);
    
    // localStorage.setItem('clientId','12030');
    // let user={UserId:'123456',AuthToken:'12345678',ClientId:'123456',Organizetion:'Test'};
    // this.authService.loginUserTest(user);
    // this.router.navigate(['/dashboard/home']);
    
    // return;
    //debugger
    this.authService.loginUser(this.f.username.value, password)
      .pipe(first())
      .subscribe(
        data => {
          if (data != null && data.ResponseMessage === "Success") {
           // debugger;
            if (data.ClientCount > 1) {
              this.modalRef = this.modalService.open(MultipleClientComponent, { size: 'lg', backdrop: 'static' });
            }
            else {
              this.router.navigate(['/dashboard/home']);
            }
          }
          else {
            this.error = "Invalid Login Password";
            this.isLoading = false;
          }
        },
        error => {
          this.error = error;
          this.isLoading = false;
        }

      );

    //this.authService.login(credentials)
    //  .pipe(
    //    delay(5000),
    //    tap(user => this.router.navigate(['/dashboard/home'])),
    //    finalize(() => this.isLoading = false),
    //    catchError(error => of(this.error = error))
    //  ).subscribe();
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['lampsdemo@adectec.com', [Validators.required, Validators.minLength(6)]],
      password: ['Toscatest1', Validators.required]
    });
  }

  functionencrypt(password: any) {
    var saltKey = "eyEic@dm!n$1234asr";
    // random salt for derivation
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(16);
    // well known algorithm to generate key
    var key = CryptoJS.PBKDF2(saltKey, salt, {
      keySize: keySize / 32,
      iterations: 100
    });
    // random IV
    var iv = CryptoJS.lib.WordArray.random(128 / 8);
    // specify everything explicitly
    var encrypted = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    // combine everything together in base64 string
    var result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
    return result;
  }

  multiple() {
    this.modalRef = this.modalService.open(MultipleClientComponent, { size: 'lg', backdrop: 'static' });
  }

}
