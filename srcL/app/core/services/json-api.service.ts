import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { config } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class JsonApiService {

  tempJson_BASEURL = '../../../assets/temp';
  extenstion = '.json';
  uservalidationlist: any = [];
    constructor(private httpClient: HttpClient) { }

    fetch(url): Observable<any> {
        return this.httpClient.get(this.getBaseUrl() +  config.API_URL + url)
            .pipe(
                delay(100),
                catchError(this.handleError)
            );
    }

    private getBaseUrl() {
        return `${location.protocol}//${location.hostname + (location.port ? ':' + location.port : '')}/`;
    }

    private handleError(error: any) {
        const errorMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        return Observable.throw(errorMsg);
    }

  // TFSID 16755 RIZWAN KHAN 13 july 2020 Get client specific validation service from JSON temp file,
  // alert conditions etc,

  GetProjectConfigurationList(clientPath, filename): Observable<any []> {
     return this.httpClient.get<any[]>(this.tempJson_BASEURL + '/' + clientPath + '/' + filename + '' + this.extenstion);  
 }

  // ValiationList({ clientPath, filename }: { clientPath: any; filename: any; }): any {

  //  this.httpClient.get(this.tempJson_BASEURL + '/' + clientPath + '/' + filename).subscribe(
  //    data => {
  //      this.uservalidationlist = data as string[];	 // FILL THE ARRAY WITH DATA.
  //      console.log(this.uservalidationlist);
  //    },
  //    (err: HttpErrorResponse) => {
  //      console.log(err.message);
  //    }
  //  );

  //  return this.uservalidationlist;

  //}
}
