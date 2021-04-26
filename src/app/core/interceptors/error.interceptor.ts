import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ErrorsService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private injector: Injector, private authenticationService: AuthService) { }
  errorsService = this.injector.get(ErrorsService);
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }

          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          console.log(this.errorsService.log(error));
          //window.alert(errorMessage);
          return throwError(errorMessage);
          //return throwError(errorMessage);
        })
      )
  }

  //intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //  return next.handle(request).pipe(catchError(err => {
  //    if (err.status === 401) {
  //      // auto logout if 401 response returned from api
  //      this.authenticationService.logout();
  //      location.reload(true);
  //    }

  //    const error = err.error.message || err.statusText;
  //    return throwError(error);
  //  }))
  //}
}
