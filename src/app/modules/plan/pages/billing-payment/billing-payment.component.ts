import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BillingInputService } from '../../services/billing.server.input.services';
import { WindowRefService } from '../../services/window-ref.service';
import { ToastrService } from 'ngx-toastr';
import { IPayment } from '../../modals/payment';
import { PaymentsCredentials } from '../../modals/paymentsCredentials';
import { environment as env } from '@env/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-billing-payment',
  templateUrl: './billing-payment.component.html',
  styleUrls: ['./billing-payment.component.css']
})
export class BillingPaymentComponent implements OnInit, AfterViewInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  private PaymentDetails = new IPayment();
  creditcards = [];
  private creditCardVM = new PaymentsCredentials(); 
  isPaymentDone: boolean = false;
  Currency: string;
  Amount: number;
  currencies = [
    { id: 'INR', name: "INR" },
    { id: 'EUR', name: "EUR" },
    { id: 'USD', name: "USD" }   
  ];
  paymentForm: FormGroup;
  

  constructor(private formBuilder: FormBuilder,private planInputService: BillingInputService, private winref: WindowRefService, private toastr: ToastrService) { }

  ngOnInit(): void {
    /******************** Later this section code will be dynamic ********/

    this.creditCardVM.PageNo = 1;
    this.creditCardVM.PageSize = 2000;


    var user = JSON.parse(localStorage.getItem('currentUser'));

    if (user != null && user != undefined) {
      this.creditCardVM.ClientId = user.ClientId;
      this.creditCardVM.UserId = user.UserId;
      this.creditCardVM.IsDeleted = false;

      this.PaymentDetails.IsDeleted = false;

      this.PaymentDetails.ClientID = user.ClientId;

    }

  /******************************** End Here *************************/

    this.buildForm();
    this.getPaymentInformation();
    this.getAllCreditCards();


  /******************************** This is for Global Ribbon *************************/
    this.actionGroupConfig = getGlobalRibbonActions();    

  }

  ngAfterViewInit() {

    this.btnBar.hideAction('refresh');
    this.btnBar.hideAction('cancel');
    this.btnBar.hideAction('showDetails');
    this.btnBar.hideAction('invoice');
    this.btnBar.hideAction('duplicateForecast');
    this.btnBar.hideAction('deleteSelectedRow');
    this.btnBar.hideAction('deleteSelectedForecast');
    this.btnBar.hideAction('refresh');
    this.btnBar.hideAction('regularOrder');
    this.btnBar.hideAction('bulkOrder');
    this.btnBar.hideAction('copy');
    this.btnBar.hideAction('updateContract');

    this.btnBar.disableAction('add');
    this.btnBar.disableAction('edit');
    this.btnBar.disableAction('delete');
    this.btnBar.disableAction('issue');

    this.btnBar.hideTab('key_Data');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

  actionHandler(type) {}

  private buildForm(): void {
    this.paymentForm = this.formBuilder.group({
      Amount: ['', Validators.required],
      Currency: ['', Validators.required]
    });
  }

  get f() {
    return this.paymentForm.controls;
  }


  PaymentSubmit() {
    this.PaymentDetails.Amount = this.Amount * 100;  /// convert rupees to paisa (Razor payment gateway only accept paisa)
    this.PaymentDetails.Currency = this.Currency;
    this.PaymentDetails.CreateDateTimeBrowser = new Date();
    this.PaymentDetails.UpdateDateTimeBrowser = new Date();

    this.planInputService.GenerateOrderDetails(this.PaymentDetails).subscribe((data) => {

      if (data.Message == "Success") {
        this.PaymentDetails.OrderID = data.Data.OrderID;
        this.PayWithRazor();
      }
      else {

      }
    });

  }


  PayWithRazor() {
    const options: any = {
      key: env.RazorKey,
      amount: this.PaymentDetails.Amount,
      currency: this.PaymentDetails.Currency,
      name: 'Buy Subcription Plan',
      description: 'Buy Subcription Plan',
      image: './assets/images/logo.png',
      order_id: this.PaymentDetails.OrderID, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);

      this.PaymentDetails.PaymentID = response.razorpay_payment_id;
      this.PaymentDetails.Signature = response.razorpay_signature;

      this.planInputService.SavePaymentSuccess(this.PaymentDetails).subscribe((data) => {

        if (data.Message == "Success") {
          //after successfully saved data
          //code here for subscription table and other table

          this.toastr.success("Your data saved successfully.", "Congratulation");
        }
        else {

        }
      });
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });

    const rzp = new this.winref.nativeWindow.Razorpay(options);
    rzp.open();
  }


  getAllCreditCards() {
    this.creditCardVM.IsDeleted = false;
    //this.creditcards = [];
    
    this.planInputService.GetAllCreditCards(this.creditCardVM).subscribe((data) => {     
      if (data.Message == "Success") {
        this.creditcards = data.Data;

        this.creditcards.forEach(function (val, index) {
          val.CreditCardNo = val.CreditCardNo.substring(val.CreditCardNo.length - 4);
        });
      }
      else {

      }
    });


  }

  refreshcardlist(eventdata) {
    this.getAllCreditCards();
  }

  RemoveCard(cardNumber: number) {

    this.creditCardVM.Id = cardNumber;
    this.planInputService.RemoveCreaditCard(this.creditCardVM).subscribe((data) => {
      this.getAllCreditCards();
    });
  }

  getPaymentInformation() {

  /******* this Code will repace after generating latest bill which comes from API*****/
    this.Amount = 45.25;
    this.Currency = "INR";

    this.PaymentDetails.MerchantID = "1";
    this.PaymentDetails.ReceiptNo = "Invoice01";
    this.PaymentDetails.SourceSystemID = 101;
    this.PaymentDetails.SubscriptionID = 13;


  /************************ End Here***********************/
  }

}
