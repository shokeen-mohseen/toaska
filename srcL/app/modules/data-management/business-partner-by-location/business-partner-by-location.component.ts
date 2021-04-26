import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { BusinesspartnerListComponent } from '../business-partner-detail/businesspartner-list/businesspartner-list.component';
import { CarrierpartnerlistComponent } from '../business-partner-detail/carrierpartnerlist/carrierpartnerlist.component';

@Component({
  selector: 'app-business-partner-by-location',
  templateUrl: './business-partner-by-location.component.html',
  styleUrls: ['./business-partner-by-location.component.css']
})
export class BusinessPartnerByLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(BusinesspartnerListComponent) businessPartnerList: BusinesspartnerListComponent;
  @ViewChild(CarrierpartnerlistComponent) carrierPartnerList: CarrierpartnerlistComponent;
  actionGroupConfig;
  BusinessPartnerList: string = "BPExport";
  tabBusinessPartnerList: boolean = true;
  tabAddBusinessPartner: boolean = false;
  tabEditBusinessPartner: boolean = false;
  tabCarrier: boolean = true;
  IsModulePermission: boolean = false;
  tabBusinessPartnerListData: boolean = true;
  tabAddBusinessPartnerData: boolean = false;
  tabEditBusinessPartnerData: boolean = false;
  tabCarrierData: boolean = false; 
  tabCarrierDataA: boolean = false; 
  tabCarrierA: boolean = false;
  modalRef: NgbModalRef;
  IsTosca: boolean;
  isCarrierTab: boolean = false;
  isCarrierActivefromEdit: boolean = false;
  isBPActivefromEdit: boolean = false;

  bpByLocationSelected: BPByLocation[] = [];
  bpsByLocationInEdit: BPByLocation[] = [];

  bpByCarrierSelected: BPByCarrier[] = [];
  bpsByCarrierInEdit: BPByCarrier[] = [];

  selectedBpInEdit: any;

  constructor(private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private businessPartnerService: BusinessPartnerService,
    public modalService: NgbModal,
    private changeDetector: ChangeDetectorRef) { }

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
      this.BusinessPartnerList = 'CarrierExport';
      if (!this.businessPartnerService.businessPartnerHasReadOnlyAccess)
      this.btnBar.enableAction('add');
      this.isCarrierTab = true;
      this.tabCarrierData = true;
      this.tabBusinessPartnerListData = false;
      this.tabEditBusinessPartnerData = false;
    }
    else if ($event.tab.textLabel === 'Location') {
      this.BusinessPartnerList = 'BPExport';
      this.tabBusinessPartnerListData = true;
      this.tabCarrierData = false;
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
    this.btnBar.disableAction('delete');
    this.btnBar.showAction('edittype');
    this.btnBar.hideTab('key_View');
    this.changeDetector.detectChanges();
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

    }
    else if (type === "active")
    {
      if (this.getRowsSelected() == null || this.getRowsSelected().length < 1) {
        this.toastrService.warning("Please select atleast one record.");
        return;
      }
      else {
        var Ids = '';
        
        if (this.tabBusinessPartnerListData || this.isBPActivefromEdit) {
          this.bpByLocationSelected.forEach(item => {
            Ids += `${item.businessPartnerId},`;
          });
          this.businessPartnerService.activeInactiveBP(Ids, true).subscribe(x => {
            this.toastrService.success('Activation successfull');
            this.businessPartnerList.getBusinessPartnerByLocation();
          });
          if (this.isBPActivefromEdit) {
            this.btnBar.disableAction('active');
            this.btnBar.enableAction('inactive');
          }
        }
        else if (this.tabCarrierData || this.isCarrierActivefromEdit) {
          this.bpByCarrierSelected.forEach(item => {
            Ids += `${item.businessPartnerId},`;
          });
          this.businessPartnerService.activeInactiveCarrier(Ids, true).subscribe(x => {
            this.toastrService.success('Activation successfull');
            this.carrierPartnerList.getBusinessPartnerByCarrier();
          });
          if (this.isCarrierActivefromEdit) {
            this.btnBar.disableAction('active');
            this.btnBar.enableAction('inactive');
          }
        }
      }
    }
    else if (type === "inactive") {
      if (this.getRowsSelected() == null || this.getRowsSelected().length < 1) {
        this.toastrService.warning("Please select atleast one record.");
        return;
      }
      else {
        var Ids = '';
        
        
        if (this.tabBusinessPartnerListData || this.isBPActivefromEdit) {
          if (this.isBPActivefromEdit) {
            Ids += `${this.selectedBpInEdit.businessPartnerId}`;
          } else {
            this.bpByLocationSelected.forEach(item => {
              Ids += `${item.businessPartnerId},`;
            });
          }
          
          this.businessPartnerService.activeInactiveBP(Ids, false).subscribe(x => {
            this.toastrService.success('Inactivation successfull');
            this.businessPartnerList.getBusinessPartnerByLocation();
          });
          if (this.isBPActivefromEdit) {            
              this.btnBar.disableAction('inactive');
              this.btnBar.enableAction('active');            
          }
        }
        else if (this.tabCarrierData || this.isCarrierActivefromEdit) {
          if (this.isCarrierActivefromEdit) {
            Ids += `${this.selectedBpInEdit.businessPartnerId}`;
          } else {
            this.bpByCarrierSelected.forEach(item => {
              Ids += `${item.businessPartnerId},`;
            });
          }
          this.businessPartnerService.activeInactiveCarrier(Ids, false).subscribe(x => {
            this.toastrService.success('Inactivation successfull');
            this.carrierPartnerList.getBusinessPartnerByCarrier();
          });
          if (this.isCarrierActivefromEdit) {
            this.btnBar.disableAction('inactive');
            this.btnBar.enableAction('active');
          }
        }


      }
    }
    else if (type === "edit") {
      if (this.getRowsSelected() == null || this.getRowsSelected().length < 1) {
        this.toastrService.warning("Please select a Business Partnerto edit.");
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
        this.isBPActivefromEdit = true;
        this.isCarrierActivefromEdit = false;
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
        this.isBPActivefromEdit = false;
        this.isCarrierActivefromEdit = true;
      }
     
    }
    else if (type === "edittype") {

      this.modalRef = this.modalService.open(EditBusinesspartnerTypeComponent, { size: 'lg', backdrop: 'static' });

    }
  }

  setActiveInactiveButtonForBusinessPartner() {
    if (this.IsModulePermission) {
    if (this.bpByLocationSelected && this.bpByLocationSelected.length > 0) {
      this.btnBar.enableAction('active');
      this.btnBar.enableAction('inactive');
      if (this.tabEditBusinessPartnerData) {
        if (this.selectedBpInEdit) {
          if (this.selectedBpInEdit.isActive) {
            this.btnBar.disableAction('active');
          } else {
            this.btnBar.disableAction('inactive');
          }
        }
      } else {
        this.bpByLocationSelected.forEach(x => {
          // do not let user activate a customer by location if its alreay active or its organisation is inActive
          if (x.isActive) {
            this.btnBar.disableAction('active');
          }
          if (!x.isActive) {
            this.btnBar.disableAction('inactive');
          }
        });
      }
    } else {
      this.btnBar.disableAction('active');
      this.btnBar.disableAction('inactive');
    }
    }

  }
  setActiveInactiveButtonCarrier() {
    if (this.IsModulePermission) {
      if (this.bpByCarrierSelected && this.bpByCarrierSelected.length > 0) {
        this.btnBar.enableAction('active');
        this.btnBar.enableAction('inactive');
        if (this.tabEditBusinessPartnerData) {
          if (this.selectedBpInEdit) {
            if (this.selectedBpInEdit.isActive) {
              this.btnBar.disableAction('active');
            } else {
              this.btnBar.disableAction('inactive');
            }
          }
        } else {
          this.bpByCarrierSelected.forEach(x => {
            // do not let user activate a customer by location if its alreay active or its organisation is inActive
            if (x.isActive) {
              this.btnBar.disableAction('active');
            }
            if (!x.isActive) {
              this.btnBar.disableAction('inactive');
            }
          });
        }
        
       
      } else {
        this.btnBar.disableAction('active');
        this.btnBar.disableAction('inactive');
      }

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
    this.bpByCarrierSelected = [];
    this.setActiveInactiveButtonForBusinessPartner();
  }

  setBpByLocationInEdit(BpByLocationInEdit: any) {
    this.bpsByLocationInEdit = BpByLocationInEdit;
  }
  setSelectedBpInEdit(selectedBpInEdit: any) {
    this.selectedBpInEdit = selectedBpInEdit;
    this.bpByCarrierSelected.length > 0 ? this.setActiveInactiveButtonCarrier() : this.setActiveInactiveButtonForBusinessPartner();
  }

  selectedBpByCarrier(bpByCarrierSelected: any) {
    this.bpByCarrierSelected = bpByCarrierSelected;
    this.bpByLocationSelected = [];
    this.setActiveInactiveButtonCarrier();
  }

  setBpByCarrierInEdit(bpByCarrierInEdit: any) {
    this.bpsByCarrierInEdit = bpByCarrierInEdit;
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
    this.selectedBpInEdit = null;
    this.changeDetector.detectChanges();
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authenticationService.currentUserValue.UserId;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all
          if (data != null || data != undefined) {
            if (!data || (data[0] && data[0].PermissionType == "Read and Modify")) {
              this.IsModulePermission = true;
              this.btnBar.enableAction('edit');
              this.btnBar.enableAction('active');
              this.btnBar.enableAction('inactive');
              this.btnBar.enableAction('edittype');
              if (this.isCarrierTab)
                this.btnBar.enableAction('add');
            }
            else {
              this.IsModulePermission = false;;
              this.btnBar.disableAction('active');
              this.btnBar.disableAction('inactive');
              this.btnBar.disableAction('add');
              this.btnBar.disableAction('edittype');
              //this.btnBar.disableAction('delete');
              this.businessPartnerService.businessPartnerHasReadOnlyAccess = true;
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
