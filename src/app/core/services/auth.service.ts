import { Injectable } from '@angular/core';
import { of, Observable, throwError, BehaviorSubject, observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { map, tap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { formatDate } from '@angular/common';

export class ILoginContext {
  username: string;
  password: string;
  token: string;
}


const defaultUser = {
  username: 'rizwan',
  password: '12345',
  token: '12345'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  token: string;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
    
  constructor(private http: HttpClient) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }

 
  public get currentUserValue(): User {
    if (localStorage.getItem('currentUser')) {
      return this.currentUserSubject.getValue();
    }
    else {
      return null;
    }
  }

  login(loginContext: ILoginContext): Observable<User> {
    if (
      loginContext.username === defaultUser.username &&
      loginContext.password === defaultUser.password) {
      return of(defaultUser);
    }

    return throwError('Invalid username or password');
  }
    
  loginUser(Email: string, Password: string) {
    console.log("mytest");
    console.log(Password);
    return this.http.post<any>(`${environment.serverUrl}/authentication/login`, { Email, Password })
      .pipe(tap(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userId', user.UserId);
        localStorage.setItem('authToken', user.AuthToken);
        localStorage.setItem('clientId', user.ClientId);
        localStorage.setItem('organizetionId', user.Organizetion);
        this.currentUserSubject.next(user);
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("SubscriptionHint");
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('clientId');
    localStorage.removeItem('organizetionId');
    this.currentUserSubject.next(null);

  }

  getToken(): string {
    return localStorage.getItem('authToken');
  }
  isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting 
    // whether or not the token available 
    return !!token;
  }

  //Register User for Tosca

  registerClientTosca(FirstName, MiddleName, LastName, Prefix, Suffix, LoginId, Password) {
      return this.http.post<any>(`${environment.serverUrl}/authentication/ToscaUserRegister`, { FirstName, MiddleName, LastName, Prefix, Suffix, LoginId, Password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes      
        this.currentUserSubject.next(user);
        return user;
      }));
  }
  //Check duplicate login tosca
  CheckToscaUser(LoginId) {
    var ClientId = 100;
    return this.http.post<any>(`${environment.serverUrl}/authentication/CheckToscaUser`, {LoginId, ClientId })
      .pipe(map(result => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes      
        //this.currentUserSubject.next(user);
        return result;
      }));
  }


  registerClient(ClientName, FirstName, MiddleName, LastName, Prefix, Suffix, LoginId, Password, MobilePhoneCountryCode, MobileNo, UserType, OrgCode) {
    //TODO : need to call API for registration page
    
    // localStorage.setItem('userDetails', JSON.stringify(userDetails)); 
    return this.http.post<any>(`${environment.serverUrl}/authentication/ClientRegister`, { ClientName, FirstName, MiddleName, LastName, Prefix, Suffix, LoginId, Password, MobilePhoneCountryCode, MobileNo, UserType, OrgCode })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
      
        localStorage.setItem('currentUser', JSON.stringify(user));
        //localStorage.setItem('userId', user.UserId);
      //  localStorage.setItem('authToken', user.AuthToken);
        //localStorage.setItem('clientId', user.ClientId);
        //localStorage.setItem('organizetionId', user.Organizetion);
        this.currentUserSubject.next(user);
        return user;
      }));

  }
  registerExistingClientUser(ClientId) {
    //TODO : need to call API for registration page

    // localStorage.setItem('userDetails', JSON.stringify(userDetails)); 
    return this.http.post<any>(`${environment.serverUrl}/authentication/UserRegisterClient`, { ClientId })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
      
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userId', user.UserId);
        localStorage.setItem('authToken', user.AuthToken);
        localStorage.setItem('clientId', user.ClientId);
        localStorage.setItem('organizetionId', user.Organizetion);
        this.currentUserSubject.next(user);
        return user;
      }));

  }

  registerExistingClientUserss(Id: any) {
    //TODO : need to call API for registration page
    
    // localStorage.setItem('userDetails', JSON.stringify(userDetails)); 
    return this.http.post<any>(`${environment.serverUrl}/Carrier/Get`, { Id })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes

        
        return user;
      }));

  }
  getPrefix() {
    return this.http.post<any>(`${environment.masterServerUrl}/Prefix/List`, {})
      .pipe(map(User => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem('currentUser', JSON.stringify(User));
        this.currentUserSubject.next(User);
        return User;
      }));
  }
  getSuffix() {
    return this.http.post<any>(`${environment.masterServerUrl}/Suffix/List`, {})
      .pipe(map(User => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        //  localStorage.setItem('currentUser', JSON.stringify(User));
        this.currentUserSubject.next(User);
        return User;
      }));
  }
  getClient() {    
   var Id = localStorage.getItem('userId');
    return this.http.post<any>(`${environment.serverUrl}/authentication/Client`, { Id})
      .pipe(map(User => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem('currentUser', JSON.stringify(User));
        this.currentUserSubject.next(User);
        return User;
      }));
  }

  CheckOrganization(orbanizationcode) {
    var OrgCode = orbanizationcode;
    return this.http.post<any>(`${environment.serverUrl}/authentication/CheckOrganization`, { OrgCode })
      .pipe(map(result => {        
        this.currentUserSubject.next(result);
        return result;
      }));
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
  
  CheckExistPassword(UserId, Password) {
    var ID = Number(UserId);
    var ClientID = 123;
    return this.http.post<any>(`${environment.serverUrl}/authentication/CheckExistPassword`, { ID, Password, ClientID }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  ChangeExistPassword(UserId, Password) {
    var ID = Number(UserId);
    var ClientID = 123;
    return this.http.post<any>(`${environment.serverUrl}/authentication/ChangeExistPassword`, { ID, Password, ClientID }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId?:number) {
    return this.http.post<any>(`${environment.serverUrl}/ModuleRolePermission/GetModulePermission`, { ModuleNavigation, ClientId, projectKey, UserId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  GetModuleWiseMenu(ClientId, UserId) {
    return this.http.post<any>(`${environment.serverUrl}/ModuleRolePermission/GetModuleWiseMenu`, { ClientId, UserId }, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
}
