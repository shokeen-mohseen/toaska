//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16570
//Logic Description: This role guard is use for checking the page authorization against the user's role.
     
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this._authService.currentUserValue;
     if (user.role === next.data.role.find(e => !!e)) {
      return true;
    }

    // navigate to not found page
    this._router.navigate(['/unauthorised']);
    return false;
  }

}

//TFS ID: 16570
