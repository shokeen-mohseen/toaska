// TFSID 16604 this is use for client side error handler
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from './error.service';
import { throwError } from 'rxjs';
@Injectable()
export class ClientSideErrorsHandler implements ErrorHandler {
  constructor(
    private injector: Injector,
  ) { }
  handleError(error: Error) {
    if (error instanceof TypeError) {
      // handle client side error
      const errorsService = this.injector.get(ErrorsService);
      console.log(errorsService.log(error));
      return throwError(error);
    }

  }
}

