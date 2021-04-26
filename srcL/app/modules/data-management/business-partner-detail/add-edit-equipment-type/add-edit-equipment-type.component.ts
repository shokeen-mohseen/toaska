import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { AuthService } from '../../../../core';
import { MaterialCallListViewModel, LocationConstant, CustomerPropertyDetails } from '../../../../core/models/Location';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
@Component({
  selector: 'app-add-edit-equipment-type',
  templateUrl: './add-edit-equipment-type.component.html',
  styleUrls: ['./add-edit-equipment-type.component.css']
})
export class AddEditEquipmentTypeComponent implements OnInit {

  modalRef: NgbModalRef;


  commonCallListViewModel: MaterialCallListViewModel = new MaterialCallListViewModel();
  preferredEquipmentViewModel: CustomerPropertyDetails = new CustomerPropertyDetails();
  constructor(private router: Router, public activeModal: NgbActiveModal,
    private customerbylocationService: CustomerByLocationService,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
  ) {
    
  }
  clientId: number;
  itemListA = [];
  itemListB = [];
  equipmentTypeData: any;
  isValidated: number = 0;
  selectedItemsA = [];
  settingsA = {};
  equipmentId: number;
  @Input() equipmentIds: string;
  @Input() pageActionType: string;
  @Input() InputlocationId; @Input("isEditRights") isEditRights: number;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  error: string;
  selectedItemsB = [];
  settingsB = {};

  count = 3;
  ngAfterViewInit(): void {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.commonCallListViewModel.ClientID = this.clientId;
    this.commonCallListViewModel.LocationId = this.InputlocationId;
    this.commonCallListViewModel.PageAction = LocationConstant.PageAction;
  }
  ngOnInit(): void {
    this.BindEquipmentTypeDDl();
    

    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      searchBy: ['itemName']
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName']
    };

  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  BindEquipmentTypeDDl() {

    this.customerbylocationService.getEquipmentType(this.commonCallListViewModel)
      .subscribe(
        result => {
          //this.preferredMaterialList = result.data
          //this.listMaterialLength.emit(this.preferredMaterialList.length);
          this.setEquipmentDropDown(result.data);
        }
      );
  }

  addPreferredEquipmentType() {
    
    this.preferredEquipmentViewModel.clientId = this.clientId;
    this.preferredEquipmentViewModel.locationId = this.InputlocationId;
    this.preferredEquipmentViewModel.entityPropertyCode = LocationConstant.PreferredEquipmentCode;
    this.preferredEquipmentViewModel.propertiesUom = "";
    this.preferredEquipmentViewModel.updateDateTimeBrowser = new Date(new Date().toString());
    this.preferredEquipmentViewModel.createDateTimeBrowser = new Date(new Date().toString());
    this.preferredEquipmentViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    this.preferredEquipmentViewModel.pageAction = this.pageActionType;
    this.preferredEquipmentViewModel.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    //this.customerbylocationService.AddEditPreferredMaterial

    this.customerbylocationService.AddPreferredEquipmentType(this.preferredEquipmentViewModel)
        .subscribe(
          result => {
            //this.setMaterialDropDown(result.data);
            this.activeModal.close();
            this.passEntry.emit(1);
          },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          },
          () => {
            // No errors, route to new page here
            this.toastrService.success(GlobalConstants.SUCCESS_MESSAGE);
            this.isValidated = 0;
          }
        );
    
  }
  onEquipmentSelect(item: any) {
    
    this.preferredEquipmentViewModel.propertyValue = item.id.toString();
    this.equipmentId = item.id;
    this.validation();

  }
  isEquipmentId: number;
  validation(type: string = ''): boolean {
    let isValidated: boolean = true;
    if (this.isEditRights) {
      
      if (!!!this.equipmentId) {
        this.isEquipmentId = 1;
        isValidated = false;
      } else {
        this.isEquipmentId = 0;
      }


      if (this.isEquipmentId === 0) {


        this.isValidated = 1;

      }
      else {
        this.isValidated = 0;
      }
      return isValidated;
    }
    else {
      this.isValidated = 0;
      return isValidated
    }
  }

  setEquipmentDropDown(data: any) {
    this.equipmentTypeData = [];
    if (!!data)
      this.equipmentTypeData = data.map(item => {
        return {
          itemName: item.code + ' - ' + item.description ,
          id: item.id
        };
      });
    this.equipmentTypeData.sort((x, y) => x.itemName.localeCompare(y.itemName));
  }
}
