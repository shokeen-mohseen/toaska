//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16570
//Logic Description: this Auth guard use for to check user is authorized to access or
//                   check user session

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { projectkey } from 'environments/projectkey';

import { AuthService } from '@app/core/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) { }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     const currentUser = this.authenticationService.currentUserValue;
     
     if (currentUser) {
          return true;
    }

    if (projectkey.projectname == "tosca") {
      this.router.navigate(['/auth/tosca-login'], { queryParams: { returnUrl: state.url } });
    }
    else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    }
    // not logged in so redirect to login page with the return url
    
    return false;
  }
}
//TFS ID: 16570
