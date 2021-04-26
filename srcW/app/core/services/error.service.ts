// TFSID 16604 return error log
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, Event, NavigationError } from '@angular/router';
import * as StackTraceParser from 'error-stack-parser/error-stack-parser';
import { AuthService } from '.';
import { User } from '../models';

@Injectable()
export class ErrorsService {
  private currentUser: User;
  constructor(
    private authenticationService: AuthService , private injector: Injector,
    private router: Router,
  ) {
    // Subscribe to the NavigationError

  }

  log(error): any {

    // TFSID 16969, Rizwan Khan, 28 july 2020,check user session 
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      const errorToSend = this.addContextInfo(error);
      // console.log(errorToSend)
      return errorToSend;
      
    }
    //else {
    //  alert("Session expired!");
    //  this.router.navigate(['/auth/login']);
    //}

    
  }

  addContextInfo(error) {
    // You can include context details here (usually coming from other services: UserService...)
    const name = error.name || null;
    const appId = '1000';
    const user = this.currentUser.username
    const time = new Date().getTime();
    const id = `${appId}-${user}-${time}`;
    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);

    const errorWithContext = { name, appId, user, time, id, url, status, message, stack };
    return errorWithContext;
  }

}
