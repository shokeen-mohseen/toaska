import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendObject, Sunbscription } from '../models/send-object';
import { map  } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { FormArray } from '@angular/forms';
import { CountryPackages } from '../models/country-packages';
import { formatDate } from '@angular/common';

const BASE_URL = env.serverUrl;
const COREBASE_URL = env.coreBaseApiUrl;
const MASTER_URL = env.masterServerUrl;
//const BASE_URL = env.CoreSecurityApi;
@Injectable({
  providedIn: 'root'
})
export class SubscriptionPromotionService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(private http: HttpClient) {
  }

  // TFSID 17168, Rizwan Khan , 29 Aug 2020, Implement Api
   
  // Get GetPackageList API
  GetPackageList(flagViewModel: SendObject) {
    return this.http.post<any>(BASE_URL + '/Plan/PackageList', flagViewModel, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get GetPackageList API
  GetPromotionList(flagViewModel: SendObject): Observable<any> {
    return this.http.post<any>(BASE_URL + '/promotion/List', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));

  }

  // Get SubscriptionPackageTypeList API
  SubscriptionPackageTypeList(flagViewModel: SendObject): Observable<any> {
    return this.http.post<any>(BASE_URL + '/Plan/SubscriptionPackageTypeList', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));

  }



  // Delete api for subscription list API
  DeleteSubscriptionListUserWise(flagViewModel: SendObject): Observable<any> {
    //console.log(flagViewModel)
    return this.http.post<any>(BASE_URL + '/Subscription/SubscriptionInActive', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));

  }



  // Get GetPackageList API
  GetClientWisePromotionList(flagViewModel: SendObject): Observable<any> {
    return this.http.post<any>(BASE_URL + '/promotion/ClientPromotiontionList', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));

  }

  // Get GetPackageList API
  GetClientWiseSubscriptionList(flagViewModel: SendObject): Observable<any> {
    return this.http.post<any>(BASE_URL + '/Subscription/ClientSubscriptionList', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));

  }




  // Get SaveSubscription API
  SaveSubscription(flagViewModel: Sunbscription[]): Observable<any> {
    //console.log(flagViewModel)
    return this.http.post<any>(BASE_URL + '/Subscription', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));

  }




  // CheckSubscription by Client API
  CheckSubscriptionPromotion(flagViewModel: SendObject): Observable<any> {
   // console.log(flagViewModel)
    return this.http.post<any>(BASE_URL + '/Subscription/checkPromotion', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));

  }


  getCountryWisePackagesAsFormArray(flagViewModel: SendObject): Observable<FormArray> {

    return this.getAll(flagViewModel).pipe(map((countrypackage: CountryPackages[]) => {
     // console.log(countrypackage)
      // Maps all the albums into a formGroup defined in model CountryPackages.ts
      const fgs = countrypackage.map(CountryPackages.asFormGroup);
     // console.log(fgs)
      return new FormArray(fgs);
    }));

  }
  
  getAll(flagViewModel: SendObject): Observable<CountryPackages[]> {

    //return this.http.post<any>(BASE_URL + '/Plan/PackageList', flagViewModel, this.httpOptions);
    debugger;
    return this.http.post<any>(BASE_URL + '/Plan/PackageList', flagViewModel, this.httpOptions)
      .pipe(map(countrypackage => {
        return countrypackage.Data;
      }));   
  }

  getEntityDetails(ClientId, Name): Observable<any> {
    return this.http.post<any>(MASTER_URL + '/Entity/GetDetail', { ClientId,Name}, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  getUserAlertDetails(ClientId, Name): Observable<any> {
    return this.http.post<any>(COREBASE_URL + '/useralert/GetDetail', { ClientId, Name }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  SaveAlertSystem(UserAlertID, EntityID, EntityKeyId, ClientId): Observable<any> {
    
    var today = new Date();
    var AlertDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
    var DispatchState = 0;
    var ReferenceNo = "";
    var Name = "User Registration";
    var Description = "User Registration";
    var IsDeleted = false;
    var CreateDateTimeBrowser = formatDate(today, 'yyyy-MM-dd', 'en-US');
    var Code = "";
    return this.http.post<any>(COREBASE_URL + '/SystemAlertCalender', { UserAlertID, EntityID, EntityKeyId, AlertDate, DispatchState, ReferenceNo, Name, Description, IsDeleted, ClientId, CreateDateTimeBrowser, Code}, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }


  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
