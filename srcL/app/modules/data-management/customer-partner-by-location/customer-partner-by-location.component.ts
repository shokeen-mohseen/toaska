import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';

import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { CustomerByLocationService } from '../../../core/services/customer-by-location.service';
import { AuthService } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { CustomerByLocationStatusModel, CustomerByLocation } from '../../../core/models/CustomerByLocation.model';
import { LocationDeleteModel } from '../../../core/models/Location';
import { CustomerListComponent } from '../customer-partner-detail/customer-list/customer-list.component';
import { ConfirmDeleteTabledataPopupComponent } from '../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
@Component({
  selector: 'app-customer-partner-by-location',
  templateUrl: './customer-partner-by-location.component.html',
  styleUrls: ['./customer-partner-by-location.component.css']
})
export class CustomerPartnerByLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  CustomerPartnerList: string = "CustomerLocationExport";
  tabCustomerView: boolean = true;
  tabAddCustomer: boolean = false;
  tabEditCustomer: boolean = false;
  tabCustomerViewData: boolean = true;
  tabAddCustomerData: boolean = false;
  tabEditCustomerData: boolean = false;
  IsModulePermission: boolean = false;
  IsEditPage: boolean = false;
  EditSelectedId: Number = 0;
  customersSelected: CustomerByLocation[] = [];
  customersInEdit: CustomerByLocation[] = [];
  @ViewChild(CustomerListComponent, { static: false }) customerListComponent: CustomerListComponent;
  tabChange($event) {
    if ($event.index === 0) {
      this.tabCustomerViewData = true;
    }
    else if ($event.index === 1) {
      this.tabAddCustomerData = true;
    }
    else if ($event.index === 2) {
      this.tabEditCustomerData = true;
    }
  }
  ngAfterViewInit(): void {

    if (this.IsTosca) {
      this.btnBar.disableAction('add');
      this.btnBar.disableAction('delete');
      this.btnBar.hideTab('key_View');
      this.refresh();
    }

  }
  actionHandler(type) {
    if (type === "add") {
      this.tabCustomerView = false;
      this.tabAddCustomer = true;
      this.tabEditCustomer = false;
      this.tabGroup.selectedIndex = 0;
      this.tabCustomerViewData = false;
      this.tabEditCustomerData = false;
      this.tabAddCustomerData = true;

    } else if (type === "edit") {
      if (this.customersSelected == null || this.customersSelected.length < 1) {
        this.toastrService.warning("Please select a customer to edit.");
        return;
      } else {
        this.tabCustomerView = true;
        this.tabAddCustomer = false;
        this.tabEditCustomer = true;
        this.tabGroup.selectedIndex = 1;
        this.tabEditCustomerData = true;
        this.tabAddCustomerData = false;
        this.tabCustomerViewData = false;
      }

    } else if (type === "active") {
      this.setAllSelectedChargesStatus(true);
    } else if (type === "inactive") {
      this.setAllSelectedChargesStatus(false);
    } else if (type === "delete") {
      // this.deleteCustomerByLocation();
    }
  }

  closeTab() {

    this.tabCustomerView = true;
    this.tabAddCustomer = false;
    this.tabEditCustomer = false;
    this.tabCustomerViewData = true;
    this.tabAddCustomerData = false;
    this.tabEditCustomerData = false;
    this.refresh();

  }
  modalRef: NgbModalRef;
  IsTosca: boolean;
  constructor(private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private customerByLocationService: CustomerByLocationService,
    public modalService: NgbModal) { }

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

  setIsPageEdit(value: any) {
    if (value == 1) {
      this.IsEditPage = true;
    }
    else if (value == 2) {
      this.IsEditPage = false;
    }
  }
  selectedCustomer(customersSelected: any) {
    this.customersSelected = customersSelected;
    this.setActiveInactiveButton();
  }

  setCustomersInEdit(customersInEdit: any) {
    this.customersInEdit = customersInEdit;
  }
  setEditSelectedId(value: any) {
    this.EditSelectedId = Number(value);
  }

  activeInactiveButton(value: any) {
    if (value) {
      this.btnBar.disableAction('active');
      this.btnBar.enableAction('inactive');
    }
    else {
      this.btnBar.disableAction('inactive');
      this.btnBar.enableAction('active');
    }
  }


  setActiveInactiveButton() {

    if (this.IsModulePermission) {
      if (this.customersSelected && this.customersSelected.length > 0) {
        this.btnBar.enableAction('active');
        this.btnBar.enableAction('inactive');
        this.customersSelected.forEach(x => {
          // do not let user activate a customer by location if its alreay active or its organisation is inActive
          if (x.isActive || !x.organizationIsActive) {
            this.btnBar.disableAction('active');
          }
          if (!x.isActive) {
            this.btnBar.disableAction('inactive');
          }
        });
      } else {
        this.btnBar.disableAction('active');
        this.btnBar.disableAction('inactive');
      }
    }

  }

  setAllSelectedChargesStatus(isActive: boolean) {    
    if (this.customersSelected != null && this.customersSelected.length > 0) {
      var locationToBeUpdated = [];
      if (this.IsEditPage && (this.EditSelectedId == 0)) {
        locationToBeUpdated.push({
          id: this.customersSelected[0].customerId,
          isActive: isActive,
          updateDateTimeBrowser: new Date(),
          updatedBy: this.authenticationService.currentUserValue.LoginId
        });
        this.customersSelected[0].isActive = isActive;
        this.customersSelected[0].updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.customersSelected[0].updateDateTimeBrowser = new Date();
      }
      else if (this.IsEditPage && (this.EditSelectedId != 0)) {
        this.customersSelected.forEach(x => {
          if (x.customerId == this.EditSelectedId) {
            locationToBeUpdated.push({
              id: x.customerId,
              isActive: isActive,
              updateDateTimeBrowser: new Date(),
              updatedBy: this.authenticationService.currentUserValue.LoginId
            });
            x.isActive = isActive;
            x.updatedBy = this.authenticationService.currentUserValue.LoginId;
            x.updateDateTimeBrowser = new Date();
          }
          
        });
      }
      else if (!this.IsEditPage) {
        this.customersSelected.forEach(x => {
          locationToBeUpdated.push({
            id: x.customerId,
            isActive: isActive,
            updateDateTimeBrowser: new Date(),
            updatedBy: this.authenticationService.currentUserValue.LoginId
          });
          x.isActive = isActive;
          x.updatedBy = this.authenticationService.currentUserValue.LoginId;
          x.updateDateTimeBrowser = new Date();
        });
      }
      
      this.customerByLocationService.setCustomerByLocationStatus(locationToBeUpdated).subscribe(result => {
        if (result.statusCode == 200 && result.data) {
          this.toastrService.success((isActive ? 'Location activated' : 'Location de-activated') + " successfully");
          if (isActive && this.tabEditCustomer) {
            this.btnBar.disableAction('active');
            this.btnBar.enableAction('inactive');
          }
          else if (this.tabEditCustomer && !isActive) {
            this.btnBar.enableAction('active');
            this.btnBar.disableAction('inactive');
          }
        } else {
          this.toastrService.error((isActive ? 'Activation' : 'Inactivation') + " failed. Please contact Tech Support");
        }
      }
      );
    } else {
      this.toastrService.warning("Please select customer for " + (isActive ? 'activation' : 'inactivation'));
    }

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
            if (!data || data[0].PermissionType == "Read and Modify") {
              this.btnBar.enableAction('edit');
              this.btnBar.enableAction('active');
              this.btnBar.enableAction('inactive');
              this.IsModulePermission = true;
              this.customerByLocationService.Permission = true;
            }
            else {
              //this.btnBar.disableAction('edit');
              this.btnBar.disableAction('active');
              this.btnBar.disableAction('inactive');
              this.IsModulePermission = false;
              this.customerByLocationService.Permission = false;
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
  deleteCustomerByLocation() {
    if (this.customersSelected != null && this.customersSelected.length > 0) {
      var idstoDelete = new LocationDeleteModel();
      idstoDelete.ids = this.customersSelected.map(x => x.customerId);
      idstoDelete.deletedBy = this.authenticationService.currentUserValue.LoginId;
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        this.customerByLocationService.deleteCustomerByLocation(idstoDelete).subscribe(result => {
          if (result.statusCode == 200 && result.data) {
            this.toastrService.success("The record was deleted successfully");
            this.refresh();
            this.customerListComponent.getCustomerByLocationList();
          } else {
            this.toastrService.error("The records could not be deleted. Please contact Tech Support");
          }
        });
      }

      );
    } else {
      this.toastrService.warning("Please select customer for deletion");
    }
  }
  refresh() {
    this.selectedCustomer([]);
    this.setCustomersInEdit([]);
  }
}
