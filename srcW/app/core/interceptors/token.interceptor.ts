//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16570
//Logic Description: This is the interceptor class used to modified the HTTP request and response
                     // need to send user's auditing or logging information on server against user action.
                     // view report=> send userid , pagename, component name, module etc. 

import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { DataService } from '@app/shared/services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  started: Date;
  useractivity:any
  constructor(private authenticationService: AuthService, private dataService: DataService, private route: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //this.authenticationService.publishUserActivity.subscribe(userAct => this.objUserActivity = userAct);
    //skip language set url
    if (!(request.url.startsWith('/assets/i18n'))) {
      const userActivitylog = this.dataService.currentUserActivity;
      //console.log(userActivitylog)
      const currentUser = this.authenticationService.currentUserValue;
      /*
        Developer Name: Vinay Kumar
        File Modify By: Vinay Kumar
        Date: Aug 29, 2020
        TFS ID: 17214
        Logic Description: Token variable is coming in API "AuthToken".
        Start Code
        Line number 38, 45
        */
      const isLoggedIn = currentUser && currentUser.AuthToken;
      const isApiUrl = request.url.startsWith(environment.serverUrl);
      const commonServerUrl = request.url.startsWith(environment.commonServerUrl);
      const masterServerUrl = request.url.startsWith(environment.masterServerUrl);
      const coreBaseApiUrl = request.url.startsWith(environment.coreBaseApiUrl);
      // add auth header with jwt if user is logged in and request into the api url
    
      if (isLoggedIn && (isApiUrl || commonServerUrl || coreBaseApiUrl || masterServerUrl)) {
        request = request.clone({
          setHeaders: {          
            Authorization: `Bearer ${currentUser.AuthToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          /*TFS ID: 17214
           End Code*/
          }
        });

        
       // modify the request and pass user activity in request body
        // skip user login api because user session is not save in localstorage
        if (!(request.url.endsWith('/users/authenticate'))) {
          //const myBody = this.GetUserActivity(userActivitylog,currentUser, request);
          //request = request.clone<any>({ body: myBody });
        }
        
      }
    }

    return next.handle(request);
  }

  // return User activity from request
  GetUserActivity(userActivitylog:any, currentUser: any, request: any): any {
    return ({
      clientId: currentUser.clientId,
      clientName: currentUser.clientName,
      userId: currentUser.id.toString(),
      userName: currentUser.firstName + " " + currentUser.lastName,
      moduleName: userActivitylog.moduleName,
      componentName: userActivitylog.componentName,
      pageUrl: this.route.routerState.snapshot.url,
      actionId: userActivitylog.actiononPage,
      logDateTime: new Date()
    })

    
  }

}

//TFS ID: 16570
