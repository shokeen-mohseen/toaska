import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AddressActionType } from '@app/core/constants/constants';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddEditAddressComponent } from '../modal-content/add-edit-address/add-edit-address.component';
import { LocationConstant, CommonCallListViewModel, LocationAddressViewModel, LocationAddressCallListViewModel } from '../../../core/models/Location';
import { CustomerByLocationService } from '../../../core/services/customer-by-location.service';
import { ToastrService, DefaultNoAnimationsGlobalConfig } from 'ngx-toastr';
import { AuthService, UseraccessService } from '../../../core';
import { Subject } from 'rxjs';
import { ConfirmDeleteTabledataPopupComponent } from '../confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { Router } from '@angular/router';
import { projectkey } from '../../../../environments/projectkey';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';


@Component({
  selector: 'app-address-panel',
  templateUrl: './address-panel.component.html',
  styleUrls: ['./address-panel.component.css']
})
export class AddressPanelComponent implements OnInit {

  @Input("getAddresById") getAddresById: number;
  isEditRights: boolean;
  buttonEnableDisable: boolean = true; editbuttonEnableDisable: boolean = true;
  modalRef: NgbModalRef;
  //locationId: number;
  isAddressAllSelected: boolean = false;
  addressIds: string;
  contactIds: string;
  @Input() PageActionType: string;
  //@Input() commonId: number;
  //@Input("customerId") customerId: number;
  @Input() addressName: string;
  @Input() locationAddressList: LocationAddressViewModel[] = [];
  @Output() addressListCount: EventEmitter<any> = new EventEmitter<any>();

  @Input() changing: Subject<any>;

  constructor(private router: Router,public modalService: NgbModal,
    private useraccessService: UseraccessService,
    private customerbylocationService: CustomerByLocationService,
    private toastrService: ToastrService, private authenticationService: AuthService
  ) { }
  ngAfterViewInit(): void {
    this.ModulePermission();
    this.getLocationAddressList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.getAddresById && changes.getAddresById.previousValue) {
      this.ModulePermission();
      this.getLocationAddressList();

    }

    //if (changes.customerId && changes.customerId.previousValue) {
    //  this.getLocationAddressList();
    //}
  }

  ngOnInit(): void {
   
  }
  openPopup(action = '') {
    
    if (action === "addAddressButton") {
      this.modalRef = this.modalService.open(AddEditAddressComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = this.PageActionType;
      this.modalRef.componentInstance.getAddresById = this.getAddresById;
      this.modalRef.componentInstance.isEditRights = this.isEditRights;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getLocationAddressList();
        this.buttonEnableDisable = true;
      });
      //this.btn = 'btn1';
    }
    else if (action === "editAddressButton") {
      
      if (!!!this.addressIds) {
        this.toastrService.warning('Please select at least one address');
        return;
      } else if (!!this.contactIds) {
        const splitaddressIds = this.addressIds.split(',');
        if (splitaddressIds.length > 1) {
          this.toastrService.warning('Please select only one address for editing');
          return;
        }
      }
      this.modalRef = this.modalService.open(AddEditAddressComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = this.PageActionType;
      this.modalRef.componentInstance.getAddresById = this.getAddresById;
      this.modalRef.componentInstance.addressIds = this.addressIds;
      this.modalRef.componentInstance.isEdit = true;
      this.modalRef.componentInstance.isEditRights = this.isEditRights;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getLocationAddressList();
        this.buttonEnableDisable = true;
      });

      //this.btn = 'btn2'
    }
    else if (action === "deleteAddressButton") {
      if (!!!this.addressIds) {
        this.toastrService.warning('Please select at least one address');
        return;
      }


      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        this.useraccessService.deleteUseAddressListByIds(this.idsAddressDeteted, this.authenticationService.currentUserValue.LoginId, this.PageActionType).subscribe(x => {
          if (x.message == "Success" || x.Message == "Success") {
            this.getLocationAddressList();
            this.buttonEnableDisable = true;
            this.toastrService.success(GlobalConstants.Address_delete_Record);
            
          }
          else {
            this.toastrService.warning(GlobalConstants.error_message);
          }
        }, error => {
          //this.toastrService.error("Records saved successfully.");
        });
      }, (reason) => {
      });  

      
      }
      
      //this.btn = 'btn3';
    //}

  }

  getLocationAddressList() {
   
    let commonCallListViewModel = new LocationAddressCallListViewModel()
    commonCallListViewModel.AddressActionType = this.PageActionType;
    commonCallListViewModel.AddressbyId = this.getAddresById;
    this.customerbylocationService.getUserAddressList(commonCallListViewModel)
      .pipe()
      .subscribe(result => {
        this.locationAddressList = [];
        this.isAddressAllSelected = false;
        const rowList = result.data;
        if (!!rowList) {
          this.addressName = rowList[0].name + " " + rowList[0].countryCode + " " + rowList[0].countryName + " "
            + rowList[0].stateCode + " " + rowList[0].stateName + " " + rowList[0].cityCode + " " + rowList[0].cityName + " " + rowList[0].zipCode;

          rowList.filter(item => {
            let locationAddressExist = new LocationAddressViewModel();
            locationAddressExist = item;
            locationAddressExist.isAddressSelected = false;
            locationAddressExist.userAddressId = item.id;
            this.locationAddressList.push(locationAddressExist);
          });
        }
        this.addressListCount.emit(this.locationAddressList.length);
      });
  }

  interface: boolean= false;

  selectAddressAll(check: any) {
    this.interface = false;
    this.isAddressAllSelected = check.target.checked;
    this.locationAddressList.forEach(row => {
      row.isAddressSelected = this.isAddressAllSelected;
      
    });
    this.setUserAddressCheckBoxData();
  }

  

  selectAddressCheckbox(value: any) {
   // debugger;
    this.buttonEnableDisable = true;
    this.locationAddressList.forEach(row => {
      if (row.userAddressId == value.userAddressId) {
        row.isAddressSelected = !value.isAddressSelected;
        
      }
    });

    this.isAddressAllSelected = (this.locationAddressList.length === (this.locationAddressList.filter(x => x.isAddressSelected == true).length));

    this.setUserAddressCheckBoxData();
  }

  idsAddressDeteted: string = '';
  setUserAddressCheckBoxData() {
    this.interface = false;
    let i = 0;
    let iDs: string = '';
    this.addressIds = '';
    this.idsAddressDeteted = '';
    this.locationAddressList.filter(x => {
      if (x.isAddressSelected == true) {
        i++;
        iDs += `${x.userAddressId},`;
        this.idsAddressDeteted += `${x.userAddressId},`;

        if (x.updatedBy == "Interface" || x.updatedBy == "interface") {
           this.interface = true;
        }
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsAddressDeteted = this.idsAddressDeteted.substring(0, this.idsAddressDeteted.length - 1);
      this.buttonEnableDisable = false;
      this.editbuttonEnableDisable = false;
      this.addressIds = iDs;
      if (i > 1) {
        this.editbuttonEnableDisable = true;
      }

      if (!this.isEditRights) {
        this.buttonEnableDisable = true;
        // this.toastrService.success(GlobalConstants.Authentication_message);
      }
    }
    else {
      this.buttonEnableDisable = true;
      this.editbuttonEnableDisable = true;
    }

    if (this.interface) {
      this.buttonEnableDisable = true;
    }
  }

  ModulePermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;

    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;

          if (data != null) {
            if (data != undefined) {
              if (data.length > 0) {

                if (data[0].PermissionType == "Read and Modify") {
                  this.isEditRights = true;
                }
                else {
                  this.isEditRights = false;

                }

              }
              else {
                this.isEditRights = false;
              }
            }
            else {
              this.isEditRights = false;

            }
          }
          else {
            this.isEditRights = false;

          }
        }
      });

  }
}
