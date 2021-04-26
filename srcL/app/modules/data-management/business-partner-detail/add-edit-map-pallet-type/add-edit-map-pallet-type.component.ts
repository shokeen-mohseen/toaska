import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { AuthService } from '../../../../core';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { ShippingLocationDefaultPackagingMaterialViewModel, LocationConstant } from '../../../../core/models/Location';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-map-pallet-type',
  templateUrl: './add-edit-map-pallet-type.component.html',
  styleUrls: ['./add-edit-map-pallet-type.component.css']
})
export class AddEditMapPalletTypeComponent implements OnInit {

  public exampleData: any;
  modalRef: NgbModalRef;
  clientId: number;
  defaultPalletId: number;
  PalletData: any;
  orderID: number;
  sectionID: number;
  isValidated: number = 0;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() pageActionType: string;
  @Input() InputlocationId;
  error: string;
  defaultMaterialViewModel: ShippingLocationDefaultPackagingMaterialViewModel = new ShippingLocationDefaultPackagingMaterialViewModel();


  constructor(private router: Router, public activeModal: NgbActiveModal,
    private customerbylocationService: CustomerByLocationService,
    private toastrService: ToastrService,
    private authenticationService: AuthService
  ) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.orderID = GlobalConstants.OrderIDPreferredMaterial;
    this.sectionID = GlobalConstants.SectionIDDefaultPallet;}

  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};

  count = 3;

  ngOnInit(): void {
    this.BindDefaultPalletList();
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
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

  onPalletSelect(item: any) {
    this.defaultMaterialViewModel.materialId = item.id;
    this.defaultPalletId = item.id;
    this.validation();
  }
  isDefaultpallet: number;
  validation(type: string = ''): boolean {

    let isValidated: boolean = true;
    if (!!!this.defaultPalletId) {
      this.isDefaultpallet = 1;
      isValidated = false;
    } else {
      this.isDefaultpallet = 0;
    }
    


    if (this.isDefaultpallet === 0) {


      this.isValidated = 1;

    }
    return isValidated;

  }

  OnItemDeSelect(item: any) {
    this.isValidated = 0;
    this.defaultPalletId = null;
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  BindDefaultPalletList() {


    this.customerbylocationService.GetPalletList(this.orderID, this.sectionID, this.clientId)
      .subscribe(
        result => {
          this.setPalletDropDown(result.data);
        }
      );
  }
  addDefaultPallet() {
    this.defaultMaterialViewModel.clientId = this.clientId;
    this.defaultMaterialViewModel.locationId = this.InputlocationId;
    this.defaultMaterialViewModel.updateDateTimeBrowser = new Date(new Date().toString());
    this.defaultMaterialViewModel.createDateTimeBrowser = new Date(new Date().toString());
    this.defaultMaterialViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    this.defaultMaterialViewModel.pageAction = this.pageActionType;

    this.customerbylocationService.AddDefaultPallet(this.defaultMaterialViewModel)
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

  setPalletDropDown(data: any) {
    this.PalletData = [];
    if (!!data)
      this.PalletData = data.map(item => {
        return {
          itemName: item.name,
          id: item.id
        };
      });
    this.PalletData.sort((x, y) => x.itemName.localeCompare(y.itemName));
  }

}
