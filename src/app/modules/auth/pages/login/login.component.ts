import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, delay, finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/core';
import * as CryptoJS from 'crypto-js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MultipleClientComponent } from '../multiple-client/multiple-client.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  error: string;
  isLoading: boolean;
  loginForm: FormGroup;
  modalRef: NgbModalRef;
  password;
  show = false;
  favIcon: HTMLLinkElement = this.document.querySelector('#appIcon');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService, public modalService: NgbModal,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.password = 'password';
    this.favIcon.href = 'assets/images/partoFav.png';
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
    
    this.authService.loginUser(this.f.username.value, password)
      .pipe(first())
      .subscribe(
        data => 
        {
          if (data != null && data.ResponseMessage === "Success")
          {
            
            if (data.ClientCount > 1) {
              this.modalRef = this.modalService.open(MultipleClientComponent, { size: 'lg', backdrop: 'static' });
            }
            else {
              this.router.navigate(['/dashboard/home']);
            }
          }
          else
          {
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
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', Validators.required]
    });
  }

  functionencrypt (password:any) {
		var saltKey = "eyEic@dm!n$1234asr";
		// random salt for derivation
		var keySize = 256;
		var salt = CryptoJS.lib.WordArray.random(16);
		// well known algorithm to generate key
		var key = CryptoJS.PBKDF2(saltKey, salt, {
			keySize: keySize/32,
			iterations: 100
		  });
		// random IV
		var iv = CryptoJS.lib.WordArray.random(128/8);      
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
