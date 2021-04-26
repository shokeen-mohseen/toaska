import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { EditBusinesspartnerTypeComponent } from '../business-partner-detail/edit-businesspartner-type/edit-businesspartner-type.component';
//import { getBusinessPartner } from '@app/shared/components/top-btn-group/page-actions-map';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { BPByLocation, BPByCarrier } from '../../../core/models/BusinessPartner.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core';
import { BusinessPartnerService } from '../../../core/services/business-partner.service';

@Component({
  selector: 'app-business-partner-by-location',
  templateUrl: './business-partner-by-location.component.html',
  styleUrls: ['./business-partner-by-location.component.css']
})
export class BusinessPartnerByLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  tabBusinessPartnerList: boolean = true;
  tabAddBusinessPartner: boolean = false;
  tabEditBusinessPartner: boolean = false;
  tabCarrier: boolean = true;
  
  tabBusinessPartnerListData: boolean = true;
  tabAddBusinessPartnerData: boolean = false;
  tabEditBusinessPartnerData: boolean = false;
  tabCarrierData: boolean = false; 
  tabCarrierDataA: boolean = false; 
  tabCarrierA: boolean = false;
  modalRef: NgbModalRef;
  IsTosca: boolean;
  isCarrierTab: boolean = false;
  hasReadOnlyAccess: boolean = false;

  bpByLocationSelected: BPByLocation[] = [];
  bpByLocationInEdit: BPByLocation[] = [];

  bpByCarrierSelected: BPByCarrier[] = [];
  bpByCarrierInEdit: BPByCarrier[] = [];

  constructor(private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private businessPartnerService: BusinessPartnerService,
    public modalService: NgbModal) { }

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

  tabChange($event: MatTabChangeEvent) {
    this.btnBar.disableAction('add');
    this.isCarrierTab = false;
    if ($event.tab.textLabel === 'Carrier') {
      if (!this.hasReadOnlyAccess)
      this.btnBar.enableAction('add');
      this.isCarrierTab = true;
      this.tabCarrierData = true;
    }
    else if ($event.tab.textLabel === 'Location') {
      this.tabBusinessPartnerListData = true;
    }
    else if ($event.tab.textLabel === 'Edit') {
      this.tabEditBusinessPartnerData = true;
    
     
    }
    else if ($event.tab.textLabel === 'Add') {
      this.tabAddBusinessPartnerData = true;
    }
    else if ($event.tab.textLabel === 'CarrierA') {
      this.btnBar.enableAction('add');
      this.isCarrierTab = true;
      this.tabCarrierDataA = true;
    }


  }

  ngAfterViewInit(): void {
    this.btnBar.disableAction('add');
    this.btnBar.showAction('edittype');
    this.btnBar.hideTab('key_View');
  }
  actionHandler(type) {
    if (type === "add" && this.isCarrierTab) {

      this.tabBusinessPartnerList = false;
      this.tabAddBusinessPartner = true;
      this.tabEditBusinessPartner = false;
      this.tabCarrier = false;
      this.tabGroup.selectedIndex = 0;
      this.tabBusinessPartnerListData = false;
      this.tabEditBusinessPartnerData = false;
      this.tabAddBusinessPartnerData = true;
      this.tabCarrierData = false;

    } else if (type === "edit") {
      if (this.getRowsSelected() == null || this.getRowsSelected().length < 1) {
        this.toastrService.warning("Please select a Business Partner to edit.");
        return;
      }
      else if (this.tabGroup.selectedIndex == 0) {
        this.tabEditBusinessPartner = true;
        this.tabEditBusinessPartnerData = true;

        this.tabCarrierDataA = false;
        this.tabCarrierA = false;

        this.tabCarrierData = false;
        this.tabCarrier = false;

        this.tabBusinessPartnerList = true;
        this.tabBusinessPartnerListData = false;
        this.tabGroup.selectedIndex = 1;
      }
      else if (this.tabGroup.selectedIndex == 1) {
        this.tabCarrierDataA = false;
        this.tabCarrierA = true;

        this.tabEditBusinessPartner = true;
        this.tabEditBusinessPartnerData = true;

        this.tabCarrierData = false;
        this.tabCarrier = false;

        this.tabBusinessPartnerList = false;
        this.tabBusinessPartnerListData = false;
        this.tabGroup.selectedIndex = 1
        this.isCarrierTab = true;
      }
     
    }
    else if (type === "edittype") {

      this.modalRef = this.modalService.open(EditBusinesspartnerTypeComponent, { size: 'lg', backdrop: 'static' });

    }
  }

  closeTab() {

    this.tabBusinessPartnerList = true;
    this.tabAddBusinessPartner = false;
    this.tabEditBusinessPartner = false;
    this.tabCarrier = true;
    this.tabGroup.selectedIndex = 0;
    this.tabBusinessPartnerListData = true;
    this.tabAddBusinessPartnerData = false;
    this.tabEditBusinessPartnerData = false;
    this.tabCarrierData = false;
    this.tabCarrierDataA = false;
    this.tabCarrierA = false;
    this.refresh();

  }

  selectedBpByLocation(bpByLocationSelected: any) {
    this.bpByLocationSelected = bpByLocationSelected;
  }

  setBpByLocationInEdit(BpByLocationInEdit: any) {
    this.bpByLocationInEdit = BpByLocationInEdit;
  }

  selectedBpByCarrier(bpByCarrierSelected: any) {
    this.bpByCarrierSelected = bpByCarrierSelected;
  }

  setBpByCarrierInEdit(bpByCarrierInEdit: any) {
    this.bpByCarrierInEdit = bpByCarrierInEdit;
  }

  setBPInEdit(bpInEdit: any) {
    this.isCarrierTab ? this.setBpByCarrierInEdit(bpInEdit) : this.setBpByLocationInEdit(bpInEdit);
  }

  getRowsSelected() {
    return this.isCarrierTab ? this.bpByCarrierSelected : this.bpByLocationSelected;
  }
  refresh() {
    this.selectedBpByLocation([]);
    this.selectedBpByCarrier([]);
    this.setBpByCarrierInEdit([]);
    this.setBpByLocationInEdit([]);
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all
          if (!data || (data[0] && data[0].PermissionType == "Read and Modify")) {
            this.btnBar.enableAction('edit');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
            this.btnBar.enableAction('edittype');
            this.btnBar.enableAction('delete');
            if (this.isCarrierTab)
            this.btnBar.enableAction('add');
          }
          else {
            this.btnBar.disableAction('edit');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
            this.btnBar.disableAction('add');
            this.btnBar.disableAction('edittype');
            this.btnBar.disableAction('delete');
            this.hasReadOnlyAccess = true;
          }
        }
      });

  }

}
