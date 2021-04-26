import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { OrderDetailsCM, InvoiceDetailsCM, CreditSummaryCM } from '../models/creditManagementOrder.model'
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
import { environment as env } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { AuthService } from '.';

const BASE_URL = env.coreBaseApiUrl;
const MASTER_URL = env.masterServerUrl;

@Injectable({
  providedIn: 'root'
})

export class CreditManagementService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  Permission: boolean = false;
  constructor(private http: HttpClient,
    private authservices: AuthService,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getOrderDetails(orderDetailsCM: OrderDetailsCM) {
    return this.http.post<any>(BASE_URL + '/SalesOrder/OrderList', orderDetailsCM, this.httpOptions)
      .pipe(map(orderList => {
        return orderList;
        //console.log("inside list");
        //console.log(orderList);
        //console.log("after list");
        //return orderList.data.map(r => ({
        //  orderDate: r.orderDate,
        //  orderNumber: r.orderNumber,
        //  shipToAddress: r.shipToAddress,
        //  deliveryDate: r.deliveryDate,
        //  orderStatus: r.orderStatus,
        //  availableCreditLimit: r.availableCreditLimit,
        //  orderAmount: r.orderAmount,
        //  remainingcredit: r.remainingcredit,
        //  overrideCreditLimit: r.overrideCreditHold,
        //  comment: r.comment,
        //  isOverridden: false,
        //  Id: r.salesOrderHeaderID,
                    
        //}
        //));
        
      }));
  }

  setOverRideCreditLimit(Id:number) {
        return this.http.post<any>(BASE_URL + '/SalesOrder/SetOverRideCreditLimit', {Id}, this.httpOptions)
      .pipe(map(orderCount => {
        return orderCount;
      }));
  }

  saveComment(orderDetailsCM: OrderDetailsCM) {
    return this.http.post<any>(BASE_URL + '/SalesOrder/SaveCMComment', orderDetailsCM, this.httpOptions)
      .pipe(map(comment => {
        return comment;
      }));
  }


  getOrderList(orderDetailsCM: OrderDetailsCM) {
    return this.http.post<any>(BASE_URL + '/SalesOrder/GetListOrder', orderDetailsCM, this.httpOptions)
      .pipe(map(orderCount => {
        return orderCount;
      }));
  }

  getInvoiceList(invoiceDetailsCM: InvoiceDetailsCM) {
    return this.http.post<any>(BASE_URL + '/ARInvoiceAge/GetInvoiceList', invoiceDetailsCM, this.httpOptions)
      .pipe(map(orderCount => {
        return orderCount;
      }));
  }
    
  getInvoiceDetails(invoiceDetailsCM: InvoiceDetailsCM) {
    return this.http.post<any>(BASE_URL + '/ARInvoiceAge/GetInvoiceDetails', invoiceDetailsCM, this.httpOptions)
      .pipe(map(invoiceList => {
        return invoiceList;
      }));
  }

  getCreditListCount(creditSummaryCM: CreditSummaryCM) {
    return this.http.post<any>(BASE_URL + '/CreditSummary/GetCreditSummaryListCount', creditSummaryCM, this.httpOptions)
      .pipe(map(orderCount => {
        return orderCount;
      }));
  }


  getCreditSummary(creditSummaryCM: CreditSummaryCM) {
   // debugger;
    return this.http.post<any>(BASE_URL + '/CreditSummary/GetCreditSummaryList', creditSummaryCM, this.httpOptions)
      .pipe(map(creditSummaryList => {
        console.log(creditSummaryList);
        console.log(creditSummaryList);
        return creditSummaryList;
      }));
  }

  getEntityDetails(ClientId, Name): Observable<any> {
    return this.http.post<any>(MASTER_URL + '/Entity/GetDetail', { ClientId, Name }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getUserAlertDetails(ClientId, Name): Observable<any> {
    return this.http.post<any>(BASE_URL + '/useralert/GetDetail', { ClientId, Name }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  SaveAlertSystem(UserAlertID, EntityID, EntityKeyId, ClientId): Observable<any> {

    var today = new Date();
    var AlertDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
    var DispatchState = 0;
    var ReferenceNo = "";
    var Name = "Credit Override Approval";
    var Description = "Credit Override Approval";
    var IsDeleted = false;
    var CreateDateTimeBrowser = formatDate(today, 'yyyy-MM-dd', 'en-US');
    var Code = "";
    var CreatedBy = this.authservices.currentUserValue.LoginId;
    return this.http.post<any>(BASE_URL + '/SystemAlertCalender', { UserAlertID, EntityID, EntityKeyId, AlertDate, DispatchState, ReferenceNo, Name, Description, IsDeleted, ClientId, CreateDateTimeBrowser, Code, CreatedBy }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }




}
