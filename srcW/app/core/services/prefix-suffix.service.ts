import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrefixSuffixService {

  

  constructor(private http: HttpClient, private authservices: AuthService
  ) {
    
  }

  PrefixList() {
 
    return this.http.post<any>(`${environment.masterServerUrl}/Prefix/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }

  SuffixList() {

    return this.http.post<any>(`${environment.masterServerUrl}/Suffix/List`, {})
      .pipe(map(user => {
        return user;
      }));
  }



}

