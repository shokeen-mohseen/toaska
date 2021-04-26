import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService, Project } from '@app/core';
import { User, AuthService } from '@app/core';
import { Role } from '@app/core/models/role';
/*import { Observable } from 'rxjs';
import { MyModalComponent } from '../modals/my-modal.component';*/
/*import * as d3 from 'd3';*/
import { ChangePasswordComponent } from '@app/modules/auth/pages/change-password/change-password.component';

import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { DataService } from '@app/shared/services/data.service';

@Component({
    selector: 'app-tosca',
    templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  modalRef: NgbModalRef;
  currentUser: User;
  isUserLogin: boolean = false;
  dateObj = new Date();
  loginId: string; 

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  IsTosca: boolean;

  constructor(
        private modalService: NgbModal,  private projectService: ProjectService,
        private dataService:DataService,
    private authService: AuthService) {

    this.loginId = this.authService.currentUserValue.LoginId;

    this.currentUser = this.authService.currentUserValue;
     if (this.currentUser) {
        this.isUserLogin = true;
      }     
    

    }
  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  ngOnInit(): void {
    //console.log(this.currentUser);
    console.log(this.authService.currentUserValue);
      var ispasswordtemp = this.authService.currentUserValue.IsTempPassword;
      if (ispasswordtemp) {
        this.changePassword();
    }

    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();

  }

  ngAfterViewInit() {
    this.btnBar.hideTab('key_Home');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_Data');
    this.btnBar.hideTab('key_View');
    this.dataService.updateIsShownBackbtn(false);
  }
  
  ngOnDestroy() {
    console.log("ngOnDestroy");
    this.dataService.updateIsShownBackbtn(true);
    
  }

  changePassword() {
    this.modalRef = this.modalService.open(ChangePasswordComponent, { size: 'md', backdrop: 'static' });
  }

  actionHandler(type) { }
}
