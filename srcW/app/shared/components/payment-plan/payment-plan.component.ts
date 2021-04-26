/// Code Implemented By Kapil Pandey
/// Date : 27-Aug-2020
/// Ref : 17196
/// Purpose : To save customer credit card information

import { Component, OnInit , EventEmitter , Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BillingInputService } from '../../../modules/plan/services/billing.server.input.services';
import { PaymentsCredentials } from '../../../modules/plan/modals/paymentsCredentials';
@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.css']
})
export class PaymentPlanComponent implements OnInit {

  paymentscredentialsForm: FormGroup;
  private CreditCardDetails  = new PaymentsCredentials();

  @Output()
  CreditCardSave: EventEmitter<string> = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder, private billingInputService: BillingInputService) { }

  ngOnInit(): void {

    var user = JSON.parse(localStorage.getItem('currentUser'));
    if (user != null && user != undefined) {
      

      this.CreditCardDetails.ClientId = user.ClientId;
      this.CreditCardDetails.UserId = user.UserId;
    }


    this.buildForm();
  }

  get f() {
    return this.paymentscredentialsForm.controls;
  }

  private buildForm(): void {
    this.paymentscredentialsForm = this.formBuilder.group({
      CardType: ['', [Validators.required, Validators.minLength(6)]],
      CardHolderName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(250)]],
      CreditCardNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      CreditCardMonth: ['', Validators.required],
      CreditCardYear: ['', Validators.required],
      CVV: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      IsAutoPay: ['', Validators.required]
    });
  }


  SaveCreditCardDetails() {
   
    if (!this.paymentscredentialsForm.valid) {
      return;
    }

    this.CreditCardDetails.CardHolderName = this.f.CardHolderName.value;
    this.CreditCardDetails.CardType = this.f.CardType.value;
    this.CreditCardDetails.CreditCardNo = this.f.CreditCardNumber.value;
    this.CreditCardDetails.Cvvno = this.f.CVV.value;
    this.CreditCardDetails.ExpiryMonth = this.f.CreditCardMonth.value;
    this.CreditCardDetails.ExpiryYear = this.f.CreditCardYear.value;
    this.CreditCardDetails.IsAutoPayment = this.f.IsAutoPay.value;
    this.CreditCardDetails.CreateDateTimeBrowser = new Date();
    this.CreditCardDetails.CardMaskedNumber = "124";

    this.billingInputService.SaveCreditCards(this.CreditCardDetails).subscribe(result => {

      if (result.Message == "Success") {
        
        this.paymentscredentialsForm.reset();
        this.CreditCardSave.emit("save");
      }

    });


  }

}
