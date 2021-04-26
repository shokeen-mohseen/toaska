
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLogin implements CanLoad {
  constructor(private router: Router,private authenticationService: AuthService) {}

  canLoad() {
    debugger
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      this.router.navigate(['/dashboard/home']);
        return false;
    }else{
        return true;
    }
  
  }
}
