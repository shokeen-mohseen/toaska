import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map  } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { IPayment } from '../modals/payment';
import { PaymentsCredentials } from '../modals/paymentsCredentials';

const BASE_URL = env.serverUrl;
@Injectable({
  providedIn: 'root'
})
export class BillingInputService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  private headers :HttpHeaders;
  constructor(private http: HttpClient) {
    
    var user = JSON.parse(localStorage.getItem('currentUser'));

    

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.AuthToken,
      'Accept': 'application/json'
    })

  }

  // TFSID 17169, Kapil Pandey , 26 Aug 2020, Implement ApI for Order Generate and Payment success Handle

  GenerateOrderDetails(inputPaymentValues: IPayment) {

    
    return this.http.post<any>(BASE_URL + '/payments/createorder', inputPaymentValues, { headers: this.headers })
      .pipe(map(paymentValues => {
        return paymentValues;
      }));
  }

  SavePaymentSuccess(inputPaymentValues: IPayment) {
   
    return this.http.post<any>(BASE_URL + '/payments/savepaymentdetail', inputPaymentValues, { headers: this.headers })
      .pipe(map(paymentValues => {
        return paymentValues;
      }));
  }


  SaveCreditCards(inputPaymentValues: PaymentsCredentials) {
   
    return this.http.post<any>(BASE_URL + '/PaymentCredentials', inputPaymentValues, { headers: this.headers })
      .pipe(map(paymentValues => {
        return paymentValues;
      }));
  }


  GetAllCreditCards(inputPaymentValues: PaymentsCredentials) {
    
    return this.http.post<any>(BASE_URL + '/PaymentCredentials/List', inputPaymentValues, { headers: this.headers })
      .pipe(map(paymentValues => {
        return paymentValues;
      }));
  }

  RemoveCreaditCard(inputPaymentValues: PaymentsCredentials) {
   
    return this.http.post<any>(BASE_URL + '/PaymentCredentials/delete', inputPaymentValues, { headers: this.headers })
      .pipe(map(paymentValues => {
        return paymentValues;
      }));
  }
  
  // Start Get API Data from Server 
  
  


  // END


  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
