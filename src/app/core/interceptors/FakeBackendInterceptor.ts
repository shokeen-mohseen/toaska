import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, publish } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Role } from '../models/role';

const users: User[] = [{ alert: 'alert', validation: 'validation', path: 'ClientA', clientId:'10001', clientName:'clientA', id: 1, username: 'rizwan', password: '12345', firstName: 'Rizwan', lastName: 'Khan', role: Role.Admin }
  , { alert: 'alert', validation: 'validation',path: 'ClientB',clientId: '1002', clientName: 'clientB', id: 2, username: 'satyendra', password: '12345', firstName: 'Satyendra', lastName: 'Singh', role: Role.User }
];
const partograph: any[] = [
  {
    partId: 1,
    patientName: null,
    registrationNumber: '111222',
    physicianName: 'Dr. xyz',
    status: 'NORMAL',
    dateAdmittance: '10/05/2020',
    dateDischarge: '10/05/2020',
    action: ''
  },
  {
    partId: 2,
    patientName: 'Neelam',
    registrationNumber: '3333445',
    physicianName: 'xyz',
    status: 'NORMAL',
    dateAdmittance: '10/05/2020',
    dateDischarge: '10/05/2020',
    action: ''
  },
  {
    partId: 3,
    patientName: 'Sony',
    registrationNumber: '456677',
    physicianName: 'xyz',
    status: 'NORMAL',
    dateAdmittance: '10/05/2020',
    dateDischarge: '10/05/2020',
    action: ''
  }
  ,
  {
    partId: 4,
    patientName: 'Sony',
    registrationNumber: '456677',
    physicianName: 'xyz',
    status: 'NORMAL',
    dateAdmittance: '10/05/2020',
    dateDischarge: '10/05/2020',
    action: ''
  },
  {
    partId: 5,
    patientName: 'Sony',
    registrationNumber: '456677',
    physicianName: 'xyz',
    status: 'NORMAL',
    dateAdmittance: '10/05/2020',
    dateDischarge: '10/05/2020',
    action: ''
  }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
 
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    //console.log(request)
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
       switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.endsWith('/findpartograph') && method === 'GET':
          return getPartograph();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getPartograph() {
       //console.log(body)
       return ok(partograph); ;
    }
           
    
    function authenticate() {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        clientId: user.clientId,
        clientName: user.clientName,
        token: `fake-jwt-token.${user.id}`,
        path: user.path,
        alert: user.alert,
        validation: user.validation
      })
    }
    function getUsers() {
      if (!isAdmin()) return unauthorized();
      return ok(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      // only admins can access other user records
      if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

      const user = users.find(x => x.id === idFromUrl());
      return ok(user);
    }
    function currentUser() {
      if (!isLoggedIn()) return;
      const id = parseInt(headers.get('Authorization').split('.')[1]);
      return users.find(x => x.id === id);
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function isAdmin() {
      return isLoggedIn() && currentUser().role === Role.Admin;
    }

    //function getUsers() {
    //  if (!isLoggedIn()) return unauthorized();
    //  return ok(users);
    //}

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function error(message) {
      alert(message)
       return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
