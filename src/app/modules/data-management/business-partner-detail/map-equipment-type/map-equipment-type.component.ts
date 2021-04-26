import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddEditEquipmentTypeComponent } from '../add-edit-equipment-type/add-edit-equipment-type.component';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { MaterialCallListViewModel, LocationConstant, CustomerPropertyDetails } from '../../../../core/models/Location';
import { AuthService } from '../../../../core';
import { ButtonActionType } from '../../../../core/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { projectkey } from '../../../../../environments/projectkey';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { OperatingLocationService } from '../../operating-location-detail/services/operating-location.service';
@Component({
  selector: 'app-map-equipment-type',
  templateUrl: './map-equipment-type.component.html',
  styleUrls: ['./map-equipment-type.component.css']
})
export class MapEquipmentTypeComponent implements OnInit {
  modalRef: NgbModalRef; interfaceRights: boolean;
  constructor(private router: Router,
    private customerbylocationService: CustomerByLocationService,
    private operattingLocationService: OperatingLocationService,
    public businessPartnerService: BusinessPartnerService,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
    public modalService: NgbModal) {
   
  }
  isEditRights: boolean;
  clientId: number;
  preferredEquipmentList: any;
  isDisabled: number = 1;
  itemListB = [];
  equipmentTypeList: any;
  Inactive: boolean;
  selectedItemsB = [];
  settingsB = {};
  commonCallListViewModel: MaterialCallListViewModel = new MaterialCallListViewModel();
  preferredEquipmentViewModel: CustomerPropertyDetails = new CustomerPropertyDetails();
  @Output() listEquipmentLength: EventEmitter<any> = new EventEmitter<any>();
  @Input() InputlocationId;
  @Input() ScreenAction;
  count = 3;

  ngOnInit(): void {
    //this.BindEquipmentTypeDDl();
    
    
    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

   

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      lazyLoading: true
    };
    this.Inactive = this.customerbylocationService.Permission == false ? true : false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.InputlocationId && changes.InputlocationId.previousValue) {      
      this.ModulePermission();
      this.clientId = this.authenticationService.currentUserValue.ClientId;
      this.commonCallListViewModel.ClientID = this.clientId;
      this.commonCallListViewModel.LocationId = this.InputlocationId;
      this.commonCallListViewModel.PageAction = LocationConstant.PageAction;
      this.preferredEquipmentViewModel.clientId = this.clientId;
      this.preferredEquipmentViewModel.locationId = this.InputlocationId;
      this.preferredEquipmentViewModel.pageAction = LocationConstant.PageAction;
      this.ModulePermission();
      this.BindEquipmentTypeDDl();
      this.BindPreferredEquipmentList();
    }
  }

  async ngAfterViewInit() {    
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.commonCallListViewModel.ClientID = this.clientId;
    this.commonCallListViewModel.LocationId = this.InputlocationId;
    this.commonCallListViewModel.PageAction = LocationConstant.PageAction;
    this.preferredEquipmentViewModel.clientId = this.clientId;
    this.preferredEquipmentViewModel.locationId = this.InputlocationId;
    this.preferredEquipmentViewModel.pageAction = LocationConstant.PageAction;
    this.ModulePermission();
    await this.BindEquipmentTypeDDl();
    this.BindPreferredEquipmentList();

    if (this.ScreenAction == "BP") {
      
      this.Inactive = !this.businessPartnerService.businessPartnerHasReadOnlyAccess == false ? true : false;
    }
    else if (this.ScreenAction == 'OP')
    {
      this.Inactive = this.operattingLocationService.Permission == false ? true : false;
    }
    else {
      this.Inactive = this.customerbylocationService.Permission == false ? true : false;
    }
  }
  onAddItemA(data: string) {
    this.count++;
   
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    
    console.log(this.selectedItemsB);
  }
  OnItemDeSelect(item: any) {
    console.log(item);    
    console.log(this.selectedItemsB);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  openeditEquipment(action) {
   
    if (action === ButtonActionType.AddDefaultEquipment) {
      this.modalRef = this.modalService.open(AddEditEquipmentTypeComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.InputlocationId = this.InputlocationId;
      this.modalRef.componentInstance.pageActionType = LocationConstant.PageAction;
      this.modalRef.componentInstance.isEditRights = this.isEditRights;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.BindPreferredEquipmentList();
      });
    }
    else if (action === ButtonActionType.DeleteDefaultEquipment) {
      if (!!!this.preferredEquipmentIds) {
        this.toastrService.warning('Please select at least one record');
        return;
      }

      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        this.commonCallListViewModel.DeletedBy = this.authenticationService.currentUserValue.LoginId;
        this.commonCallListViewModel.Ids = this.preferredEquipmentIds;
        this.customerbylocationService.deleteDefaultEquipmentListByIds(this.commonCallListViewModel).subscribe(x => {
          if (x.message == "Success" || x.Message == "Success") {
            this.BindPreferredEquipmentList();
            this.toastrService.success("An error occurred during this operation. Please contact Tech Support..");
          }
          else {
            this.toastrService.warning("An error occurred during this operation. Please contact Tech Support.");
          }
        }, error => {
            this.toastrService.error("Equipment type deleted successfully.");
        });
      }, (reason) => {
      });   

      //if (confirm("Are you sure you want to delete the selected records??")) {
      //  this.commonCallListViewModel.DeletedBy = this.authenticationService.currentUserValue.LoginId;
      //  this.commonCallListViewModel.Ids = this.preferredEquipmentIds;
      //  this.customerbylocationService.deleteDefaultEquipmentListByIds(this.commonCallListViewModel).subscribe(x => {
      //    this.BindPreferredEquipmentList();
      //    this.toastrService.success('Equipment type deleted successfully');
      //    //this.buttonEnableDisable = true;
      //  });

        //this.customerbylocationService.deleteUserContactListByIds(this.idsContactDeleted, this.authenticationService.currentUserValue.LoginId).subscribe(x => {
        //  this.getLocationContact();
        //  this.toastrService.success('User Contact deleted successfully');
        //});
      //}
    }
  }


  BindPreferredEquipmentList() {
    
    this.preferredEquipmentViewModel.entityPropertyCode = LocationConstant.PreferredEquipmentCode;
    this.customerbylocationService.GetPreferredEquipmentList(this.preferredEquipmentViewModel)
      .subscribe(
        result => {
          this.preferredEquipmentList = result.data
          if (this.preferredEquipmentList.length > 0) {
            this.isDisabled = 0;
          }
          else {
            this.isDisabled = 1;
          }
          this.preferredEquipmentList.forEach(x => x.propertyValueName = this.extractName(x.propertyValue));  
          this.listEquipmentLength.emit(this.preferredEquipmentList.length);
        }
      );
  }

  extractName(type: number = 0): string {
    var nameWithDescription;
    var abc = this.equipmentTypeList.filter(item => item.id == Number(type));
    if (abc.length > 0) {
      nameWithDescription = abc[0].code + ' - ' + abc[0].description;
      return nameWithDescription;
    }
    else {
      return "";
    }
  }

  async BindEquipmentTypeDDl() {

    await this.customerbylocationService.getEquipmentType(this.commonCallListViewModel)
      .toPromise().then(
        result => {
          this.equipmentTypeList = result.data;
          //this.preferredMaterialList = result.data
          //this.listMaterialLength.emit(this.preferredMaterialList.length);
          //this.setEquipmentDropDown(result.data);
        }
      );




  }
  isEquipmentSelected: boolean;
  preferredEquipmentIds: string;
  selectMaterialCheckbox(value: any) {
    this.preferredEquipmentList.forEach(row => {
      if (row.id == value.id)
        row.isSelected = !value.isSelected;
    });

    this.isEquipmentSelected = (this.preferredEquipmentList.length === (this.preferredEquipmentList.filter(x => x.isSelected == true).length));

    this.setEquipmentCheckBoxData();
  }

  idsEquipmentDeleted: string = '';

  interface: boolean = false;
  setEquipmentCheckBoxData() {
    this.interface = false;
    let iDs: string = '';
    this.preferredEquipmentIds = '';
    this.idsEquipmentDeleted = '';
    this.preferredEquipmentList.filter(x => {
      if (x.isSelected == true) {
        console.log(x);
        iDs += `${x.id},`;
        this.idsEquipmentDeleted += `${x.id},`;
        if (x.updatedBy != null) {
          if (x.updatedBy == "Interface" || x.updatedBy == "Interface") {
            this.interface = true;
          }
        }
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsEquipmentDeleted = this.idsEquipmentDeleted.substring(0, this.idsEquipmentDeleted.length - 1);
      this.preferredEquipmentIds = iDs;
    }

    if (this.isEditRights) {
      if (this.interface) {
        this.isEditRights = false;
      }
      else {
        this.isEditRights = true;
      }
    }
    else {
      if (this.interface) {
        this.isEditRights = false;
      }
      else {
        if (this.isEditRights) {
          this.isEditRights = true;
        }
        else {
          this.isEditRights = false;
        }
      }
    }
  }

  selectEquipmentAll(check: any) {
    this.isEquipmentSelected = check.checked;
    this.preferredEquipmentList.forEach(row => {
      row.isAddressSelected = this.isEquipmentSelected;
    });
    this.setEquipmentCheckBoxData();
  }
  //setEquipmentDropDown(data: any) {
  //  this.equipmentTypeData = [];
  //  if (!!data)
  //    this.equipmentTypeData = data.map(item => {
  //      return {
  //        itemName: item.name,
  //        id: item.id
  //      };
  //    });
  //}

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

 

