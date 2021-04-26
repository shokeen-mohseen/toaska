import { Component, OnInit, Input } from '@angular/core';

import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { User, AuthService } from '@app/core';
import { Router } from '@angular/router';
import { Role } from '@app/core/models/role';
import { DataService } from '@app/shared/services';
import { Subscription } from 'rxjs';
import { NotificationPopupComponent } from '@app/shared/components/modal-content/notification.popup/notification.popup.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PartographSetupComponent } from 'app/modules/data-management/partograph-setup/partograph-setup.component';
import { ChangePasswordComponent } from '../../modules/auth/pages/change-password/change-password.component';
import { projectkey } from '@env/projectkey';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  version = environment.version;
  currentUser: User;
  isUserLogin: boolean = false;
  @Input() previousNotification: number;
  modalRef: NgbModalRef;
  message$: any;
  modalAlertData: any = [];
  subscription: Subscription;
   constructor(
     public modalService: NgbModal, private data: DataService, public translate: TranslateService, private router: Router,
    private authenticationService: AuthService) {
    //this.previousNotification = this.data.TotalPreviousAlertCount;
    this.currentUser = this.authenticationService.currentUserValue;
   // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser) {
      this.isUserLogin = true; 
    }      
      
  
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  fetchTranslation(key: string, params = {}) {
    return this.translate.instant(key, params);
  }

  ngOnInit() {
    
   // this.data.sendMessage(this.previousNotification.toString());
    this.message$ = this.data.getMessage();
  }
  logout() {
    this.authenticationService.logout();
    this.currentUser = null;
    //for tosca redirection
    if (projectkey.projectname == 'tosca') {       
      this.router.navigate(['/auth/tosca-login']);
    }
    else {
      this.router.navigate(['/auth/login']);
    }
   
   
  }


  //TFSID 16745 Rizwan Khan 14 July 2020 send notification list to alert popup

  OpenNotificationPopup(): void {

    this.previousNotification = this.data.TotalPreviousAlertCount;

    if (this.previousNotification > 0) {

      if (localStorage.getItem("AlertMessageList")) {
        this.modalAlertData = JSON.parse(localStorage.getItem("AlertMessageList"));
      }

      this.modalRef = this.modalService.open(NotificationPopupComponent,{ size: 'lg', backdrop: 'static' });

      this.modalRef.componentInstance.modalAlertData = this.modalAlertData;

    }

  }

  OpenSetupWizardPopup() {
    this.modalRef = this.modalService.open(PartographSetupComponent, { size: 'lg', backdrop: 'static' });
  }
  changePassword() {
    this.modalRef = this.modalService.open(ChangePasswordComponent, { size: 'md', backdrop: 'static' });
  }


}
