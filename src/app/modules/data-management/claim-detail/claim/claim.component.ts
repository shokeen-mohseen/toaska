import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { AuthService } from '../../../../core';
import { ClaimService } from '../../../../core/services/claim.service';
import { ToastrService } from 'ngx-toastr';
//import { ClaimListComponent } from '@app/modules/data-management/claim-detail/claim-list/claim-list.component';
import { ClaimListComponent } from '../claim-list/claim-list.component';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(ClaimListComponent) claimComponent: ClaimListComponent;
  actionGroupConfig;
  ClaimList: string = "ClaimExport";

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      //this.tab2Data = true;
      if (this.claimService.ClaimforEdit.length > 0) {
        this.tab2Data = true;
      }
      else {
        this.toastrService.warning('Please select at least one record.');
        this.tab3Data = false;
        this.tab3 = false;
        return;
        //this.tab3Data = false;
      }
    }
    else if ($event.index === 2) {

      this.tab3Data = true;

    }
  }
  ngAfterViewInit() {

    this.btnBar.hideTab('key_Action')
    this.btnBar.hideTab('key_View')
  }
  actionHandler(type) {
    if (type === "add") {
      if (this.claimService.ClaimforEdit.length > 0) {
        this.claimService.ClaimforEdit = [];

      }
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;

    } else if (type === "edit") {
      if (this.claimComponent.SelectedClaimCount > this.claimComponent.MaxEditedRecordsCountPreferences) {
        this.toastrService.info("You cannot edit more then XXX records at a time." + this.claimComponent.MaxEditedRecordsCountPreferences);
        return;
      }

      if (this.claimService.ClaimforEdit.length > 0) {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;
      }
      else {
        this.toastrService.warning('Please select at least one Claim.');
        //this.tab3Data = false;
        //this.tab3 = false;
        return;
        //this.tab3Data = false;
      }
    }
    else if (type === "delete") {
      if (this.claimService.ClaimforEdit.length == 0) {
        this.toastrService.warning('Please select at least one Claim.');
        return;
      }
      this.claimComponent.DeleteClaims();
    }
  }

  closeTab() {

    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;

  }
  modalRef: NgbModalRef;
  IsTosca: boolean;
  constructor(private router: Router, public modalService: NgbModal, private auth: AuthService
    , private toastrService: ToastrService, private claimService: ClaimService//, private claimListComponent: ClaimListComponent
  ) { }

  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
    this.buttonPermission();
  }

  buttonPermission() {

    var ModuleNavigation = this.router.url;
    var ClientId = this.auth.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.auth.currentUserValue.UserId;
    this.auth.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          if (data != null || data != undefined) {
            if (data[0].PermissionType == "Read and Modify") {
              this.btnBar.enableAction('add');
              this.btnBar.enableAction('edit');
              this.btnBar.enableAction('delete');
            }
            else {
              this.btnBar.disableAction('add');
              this.btnBar.disableAction('edit');
              this.btnBar.disableAction('delete');
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }
}
