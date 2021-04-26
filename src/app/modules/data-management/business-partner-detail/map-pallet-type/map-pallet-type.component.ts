import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddEditMapPalletTypeComponent } from '../add-edit-map-pallet-type/add-edit-map-pallet-type.component';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { AuthService } from '../../../../core';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { LocationConstant, MaterialCallListViewModel } from '../../../../core/models/Location';
import { ButtonActionType } from '../../../../core/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { projectkey } from '../../../../../environments/projectkey';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

@Component({
  selector: 'app-map-pallet-type',
  templateUrl: './map-pallet-type.component.html',
  styleUrls: ['./map-pallet-type.component.css']
})
export class MapPalletTypeComponent implements OnInit {

  modalRef: NgbModalRef;
  defaultPalletList: any;
  isPalletSelected: boolean;
  defaultPalletIds: string;
  isDisabled: number = 1;
  clientId: number;
  isEditRights: boolean;
  Inactive: boolean = false;
  @Input() InputlocationId;
  @Input() ScreenAction;
  @Output() listPalletLength: EventEmitter<any> = new EventEmitter<any>();
  commonCallListViewModel: MaterialCallListViewModel = new MaterialCallListViewModel();
  constructor(private router: Router, public modalService: NgbModal,
    private customerbylocationService: CustomerByLocationService,
    public businessPartnerService: BusinessPartnerService,
    private toastrService: ToastrService,
    private authenticationService: AuthService
  ) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.commonCallListViewModel.ClientID = this.clientId;
    //this.commonCallListViewModel.LocationId = this.InputlocationId;
    //this.commonCallListViewModel.PageAction = LocationConstant.PageAction;
    }

  ngOnInit(): void {
    
    
  }
  ngAfterViewInit(): void {
    this.commonCallListViewModel.ClientID = this.clientId;
    this.commonCallListViewModel.LocationId = this.InputlocationId;
    this.commonCallListViewModel.PageAction = LocationConstant.PageAction;
    this.BindDefaultPalletList();
    //this.ModulePermission();
    if (this.ScreenAction != "BP") {
      this.Inactive = this.customerbylocationService.Permission == false ? true : false;
    }
    else {
      this.Inactive = !this.businessPartnerService.businessPartnerHasReadOnlyAccess == false ? true : false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.InputlocationId && changes.InputlocationId.previousValue) {
      //this.ModulePermission();
      this.clientId = this.authenticationService.currentUserValue.ClientId;
      this.commonCallListViewModel.ClientID = this.clientId;
      this.commonCallListViewModel.LocationId = this.InputlocationId;
      this.commonCallListViewModel.PageAction = LocationConstant.PageAction;
      //this.preferredEquipmentViewModel.clientId = this.clientId;
      //this.preferredEquipmentViewModel.locationId = this.InputlocationId;
      //this.preferredEquipmentViewModel.pageAction = LocationConstant.PageAction;
      //this.ModulePermission();
      //this.BindEquipmentTypeDDl();
      this.BindDefaultPalletList();
    }
  }



  openaddPallet(action) {
    if (action === ButtonActionType.AddDefaultPallet) {
      this.modalRef = this.modalService.open(AddEditMapPalletTypeComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.InputlocationId = this.InputlocationId;
      this.modalRef.componentInstance.pageActionType = LocationConstant.PageAction;
      this.modalRef.componentInstance.isEditRights = this.isEditRights;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.BindDefaultPalletList();
      });
    }
    else if (action === ButtonActionType.DeleteDefaultPallet) {
      if (!!!this.defaultPalletIds) {
        this.toastrService.warning('Please select at least one record.');
        return;
      }
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        //this.commonCallListViewModel.DeletedBy = this.authenticationService.currentUserValue.LoginId;
        this.commonCallListViewModel.MaterialIds = this.defaultPalletIds;
        this.customerbylocationService.deleteDefaultPalletListByIds(this.commonCallListViewModel).subscribe(x => {
          
          if (x.data) {
            this.toastrService.success('Records deleted successfully.');
            //this.getPageSize();
          }
          //else {
          //  this.toastrService.warning('Record does not exists');
          //}
          this.BindDefaultPalletList();
          //this.buttonEnableDisable = true;
        });

        //this.customerbylocationService.deleteUserContactListByIds(this.idsContactDeleted, this.authenticationService.currentUserValue.LoginId).subscribe(x => {
        //  this.getLocationContact();
        //  this.toastrService.success('User Contact deleted successfully');
        //});
      }, (reason) => {
      });
    }
    
  }

  BindDefaultPalletList() {
    this.defaultPalletList = [];
    this.customerbylocationService.GetDefaultPalletList(this.commonCallListViewModel)
      .subscribe(
        result => {
          if (result.data != null) {
            this.defaultPalletList = result.data;
            if (this.defaultPalletList.length > 0) {
              this.isDisabled = 0;
            }
            else {
              this.isDisabled = 1;
            }
            this.listPalletLength.emit(this.defaultPalletList.length);
          }
          else {
            this.isDisabled = 1;
            this.listPalletLength.emit(0);
          }
          
        }
      );
  }

  selectMaterialCheckbox(value: any) {
    console.log(this.defaultPalletList);
    this.defaultPalletList.forEach(row => {
      if (row.id == value.id)
        row.isSelected = !value.isSelected;
    });

    this.isPalletSelected = (this.defaultPalletList.length === (this.defaultPalletList.filter(x => x.isMaterialSelected == true).length));

    this.setMaterialCheckBoxData();
  }

  idsPalletDeleted: string = '';
  setMaterialCheckBoxData() {
    let iDs: string = '';
    this.defaultPalletIds = '';
    this.idsPalletDeleted = '';
    this.defaultPalletList.filter(x => {
      if (x.isSelected == true) {
        console.log(x);
        iDs += `${x.id},`;
        this.idsPalletDeleted += `${x.id},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsPalletDeleted = this.idsPalletDeleted.substring(0, this.idsPalletDeleted.length - 1);
      this.defaultPalletIds = iDs;
    }
  }

  selectAddressAll(check: any) {
    this.isPalletSelected = check.checked;
    this.defaultPalletList.forEach(row => {
      row.isAddressSelected = this.isPalletSelected;
    });
    this.setMaterialCheckBoxData();
  }

  ModulePermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authenticationService.currentUserValue.UserId;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
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
