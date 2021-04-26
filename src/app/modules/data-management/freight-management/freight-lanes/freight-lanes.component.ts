import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { AddEditFreightlanesComponent } from './add-edit-freightlanes/add-edit-freightlanes.component';
import { ImportComponent } from './import/import.component';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { FreightLane } from '../../../../core/models/FreightLane.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core';
import { FreightLaneService } from '@app/core/services/freightlane.service';
import { FreightLanesListComponent } from './freight-lanes-list/freight-lanes-list.component';
import { ViewImportStatusComponent } from './view-import-status/view-import-status.component';
@Component({
  selector: 'app-freight-lanes',
  templateUrl: './freight-lanes.component.html',
  styleUrls: ['./freight-lanes.component.css']
})
export class FreightLanesComponent implements OnInit, AfterViewInit {
  @ViewChild(FreightLanesListComponent, { static: false }) freightLanesListComponent: FreightLanesListComponent;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  FreightLanesList: string = "FreightLaneExport";
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  FreightLaneSelected: FreightLane[];
  btn: any
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;


  tabChange($event) {
    if ($event.index === 0) { this.tab1Data = true; }
    else if ($event.index === 1) { this.tab2Data = true; }
    else if ($event.index === 2) { this.tab3Data = true; }
  }
  ngAfterViewInit(): void {
    {
      /*this.btnBar.showAction('filter')*/
      this.btnBar.hideTab('key_Action')
      this.btnBar.hideAction('import')
      this.btnBar.enableAction('graph')
      this.btnBar.showAction('importTransplaceTemplate')
      this.btnBar.hideAction('exportTransplaceTemplate')
    }
  }
  actionHandler(type) {
    if (type === "add") {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;
    }
    else if (type === "edit") {
      if (this.FreightLaneSelected == null || this.FreightLaneSelected.length < 1) {
        this.toastrService.warning("Please select record to edit");
        return;
      }
      else {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;
      }
    }
    else if (type === "view") {
      this.modalRef = this.modalService.open(ViewImportStatusComponent, { size: 'xl', backdrop: 'static' });
    }

    else if (type === "importTransplaceTemplate") {

      this.modalRef = this.modalService.open(ImportComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then(res => { }, () => {
        this.freightLanesListComponent.getFreightLaneList();
      })

    }
    else if (type === "exportTransplaceTemplate") {

      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'assets/images/TransplaceTemplateForFreightLane_download.xlsx');
      link.setAttribute('download', `TransplaceTemplateForFreightLane_download.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    }

    else if (type === "delete") {
      if (!!this.FreightLaneSelected && this.FreightLaneSelected.length > 0) {
        this.btn = 'btn3'
        this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.freightLanesListComponent.deleteFreightLaneList(this.FreightLaneSelected);
          this.FreightLaneSelected = null;
        }, (reason) => {

        });
      }
      else {
        this.toastrService.warning('Please select at least one record');
        return;
      }
    }
  }

  closeTab() {
    this.FreightLaneSelected = null;
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
  }
  modalRef: NgbModalRef;
  IsTosca: boolean;
  constructor(private toastrService: ToastrService, private router: Router, public modalService: NgbModal, private auth: AuthService, private freightLaneService: FreightLaneService) { }
  Permission: boolean = false;
  ngOnInit(): void {
    this.buttonPermission();
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }
  FreightLaneToSelect() {
    return this.FreightLaneSelected;
  }
  FreightLaneToEdit() {
    return this.FreightLaneSelected;
  }

  SelectedFreightLane(FreightLane: any) {
    
    this.FreightLaneSelected = FreightLane;
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
          if (data[0].PermissionType == "Read and Modify") {
            this.btnBar.enableAction('add');
            // this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
            this.freightLaneService.Permission = true;
          }
          else {
            this.btnBar.disableAction('add');
            //this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
            this.freightLaneService.Permission = false;
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }
}
