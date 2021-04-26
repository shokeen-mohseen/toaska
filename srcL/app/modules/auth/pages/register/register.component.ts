import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core';
import { SubscriptionPromotionService } from '@app/modules/plan/pages/services/subscription-promotion.services';
import { ClientRegistrationModal } from '@app/core/models/clientRegistration.model';
import { TranslateService } from '@ngx-translate/core'; 
import { first } from 'rxjs/operators';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerform: FormGroup;
  userData: ClientRegistrationModal= new ClientRegistrationModal();
  returnUrl: string;
  error: string;
  isLoading: boolean;
  PrefixValue:any;
  SuffixValue:any;
  newOrg: boolean = false;
  orgCode: boolean = false;
  suffixdata:string;
  prefixdata:string;
  countryCode: string;
  validate: boolean = true;
  EntityID: number; UserAlertID: number;
   

  constructor(private formBuilder: FormBuilder, public translate: TranslateService, private authService: AuthService, private subscriptionService: SubscriptionPromotionService, private router: Router, private toastrService: ToastrService) { 
    //this.buildForm();
    this.registerform = this.formBuilder.group({
     
    });
   
  }

  ngOnInit() {
    this.registerform = this.formBuilder.group({
      OrgName: [''],
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: ['', Validators.required],
      LoginId: ['', Validators.required],
      MobileNo: ['', Validators.required],
      //prefix: ['', Validators.required],
     // suffix: ['', Validators.required],
      CountryCode: ['', Validators.required],
    //   UserType :['', Validators.required],
      OrgCode:['']      
    });
   
    this.authService.getPrefix()
    .subscribe(
      data => 
      {     
        this.PrefixValue = data.data;        
      });
      this.authService.getSuffix()
      .subscribe(
        data => 
        {     
          this.SuffixValue = data.data;
        });
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

 

  selectOrg(num) {
    if (num == 1) {
      this.newOrg = true;
      this.orgCode = false;     
      this.registerform.controls.OrgCode.setValue('');
      this.validate = true;
      
    }
    else if (num == 2) {
      this.orgCode = true;
      this.newOrg = false;      
      this.registerform.controls.OrgName.setValue('');
      this.validate = true;
      //this.OrgName = "";
    } 
  }
 
  get formData() {
    return this.registerform.controls;
  }
  selectCountryCode(event){
    this.countryCode = event.target.value;
  }
  selectPrefix(event){
    this.prefixdata = event.target.value;
  }
  selectSuffix(event){
    this.suffixdata = event.target.value;
  }

  checkOrgname(event: any) {   
    if (event.target.value.length > 2) {
      this.validate = false;
    }
    else {
      this.validate = true;
    }
  }
  checkOrgcode() {
    this.validate = true;
  }

  checkOrg() {
    var orbanizationcode = this.formData.OrgCode.value;
    if (orbanizationcode == null || orbanizationcode == "") {
      return false;
    }
    this.authService.CheckOrganization(orbanizationcode)
      .subscribe(
        data => {         
          var response = data.Data;
          if (response) {
            this.validate = false;
          }
          else {
            this.validate = true;
            this.toastrService.error('Organization code is Invalid');
            return false;
          }
          
        });
  
  }
  
  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  Alert(UserId, Client) {

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
                this.toastrService.success("User is registered successfully");
                this.router.navigate(['/auth/login']);
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

  register() {
    //debugger;
    if (this.registerform.invalid) {
      return;
    }
    this.isLoading = true;
    var ClientName = "";
    var FirstName = this.formData.FirstName.value;
    var MiddleName = this.formData.MiddleName.value == null ? "" : this.formData.MiddleName.value;
    var LastName = this.formData.LastName.value;
    var Prefix = this.prefixdata == null ? "" : this.prefixdata;
    var Suffix = this.suffixdata == null ? "" : this.suffixdata;
    var LoginId = this.formData.LoginId.value;
    var MobilePhoneCountryCode = this.countryCode == null ? "+91" : this.countryCode;
    var MobileNo = this.formData.MobileNo.value;
    var tempassword = this.getRandomString(7);
    var Password = this.authService.functionencrypt(tempassword);
    var UserType:string;
    var OrgCode:string;
    if(this.newOrg)
    {
      UserType = "New";
      ClientName = this.formData.OrgName.value == null ? "" : this.formData.OrgName.value;
    }
    else
    {
      UserType = "Exist";
      OrgCode = this.formData.OrgCode.value == null ? "" : this.formData.OrgCode.value;
    }     
    

    this.authService.registerClient(ClientName, FirstName, MiddleName, LastName, Prefix, Suffix, LoginId,Password,MobilePhoneCountryCode,MobileNo,UserType,OrgCode)
      .subscribe(       
        data => 
        {
          // debugger;
          if (data != null && data.Message === "Success")
          {
              if(UserType == "New")
              {           
                  var ClientId = data.Data.Id;
                  this.authService.registerExistingClientUser(ClientId)
                  .subscribe(
                  result => 
                  {
                    this.router.navigate(['/plan/plan']);
                  });
              }

              else {
              
                var UserId = data.Data.Id;
                var ClientIds = data.Data.ClientId;
                this.Alert(UserId, ClientIds);
             // this.toastrService.success('User has been registered successfully');
             // this.router.navigate(['/auth/login']);
          }
            //this.router.navigate(['/plan/plan']);
          }
          else
          {
            this.error = "Contract could not be saved. Please check the data being entered or contact Tech Support";
            this.isLoading = false;
            this.router.navigate(['/auth/register']);
          }
        },
        error => {
          this.error = error;
          this.isLoading = false;
        }
        
        );
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


}
