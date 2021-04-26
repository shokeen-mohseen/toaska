import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Options } from 'select2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { AuthService } from '../../../../core';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { LocationPreferredMaterialViewModel, LocationConstant, CommonCallListViewModel, MaterialCallListViewModel } from '../../../../core/models/Location';
import { ToastrService } from 'ngx-toastr';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-add-edit-map-preferred-materials',
  templateUrl: './add-edit-map-preferred-materials.component.html',
  styleUrls: ['./add-edit-map-preferred-materials.component.css']
})
export class AddEditMapPreferredMaterialsComponent implements OnInit {



  public options: Options;
  public exampleData: any;
  MaterialData: any;
  UOMData: any;
  abc: [];
  SelectUOM: number;
  modalRef: NgbModalRef;
  @Input() isEdit: boolean = false;
  clientId: number;
  orderID: number;
  orderTypeID: number;
  sectionID: number;
  materialList;
  uomList;
  error: string;
  isValidated: number = 0;
  materialId: number;
  @Input() materialIds: string;
  @Input() InputlocationId: number;
  @Input() PreferredMaterialList: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() pageActionType: string;
  @Input() ScreenAction: string;  
  isMaterialDisabled: boolean = false;
  isUOMDisabled: boolean = false;
  commonCallListViewModel: MaterialCallListViewModel = new MaterialCallListViewModel();
  uomId: number;
  preferredMaterialViewModel: LocationPreferredMaterialViewModel = new LocationPreferredMaterialViewModel();




  constructor(private router: Router, public activeModal: NgbActiveModal,
    private customerbylocationService: CustomerByLocationService,
    private toastrService: ToastrService,
    private authenticationService: AuthService
  ) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.orderID = GlobalConstants.OrderIDPreferredMaterial;
    this.sectionID = GlobalConstants.SectionIDPreferredMaterial;    
  }

  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {
    
  };

  selectedItemsB = [];
  settingsB = {};

  count = 3;

  ngOnInit(): void {
    
    if (this.isEdit) {
      this.isMaterialDisabled = true;
      //this.isUOMDisabled = true;
    }
    
    
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
      disabled: this.isMaterialDisabled,
      //labelKey: "name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName']
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      disabled: this.isUOMDisabled,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName']
    };

  }

  ngAfterViewInit(): void {
   
    if (this.ScreenAction == LocationConstant.ScreenAction) {
      this.orderTypeID = GlobalConstants.OrderTypeIDForCustomer
    }
    else {
      this.orderTypeID = null;
    }
    this.BindMaterialList();
    this.BindUOMList();
    if (this.materialIds) {
      if (this.pageActionType == LocationConstant.ContactActionType) {
        this.commonCallListViewModel.PageAction = this.pageActionType;
        this.commonCallListViewModel.ClientID = this.clientId;
        this.commonCallListViewModel.MaterialIds = this.materialIds;
        this.customerbylocationService.editMaterialDetailbyId(this.commonCallListViewModel).pipe().subscribe(x => {
          if (x.data) {
            //this.contactTypeId = x.data.contactTypeId;
            //this.userContactId = x.data.userContactId;
            console.log(x.data);
            this.setMaterialControl(x.data[0]);

          }
        });
      }
    }
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

  onMaterialSelect(item: any) {
    this.preferredMaterialViewModel.materialId = item.id;
    this.materialId = item.id;
    this.validation();
    
  }
  //onUOMSelect(item) {
  //  alert(item);
  //  this.preferredMaterialViewModel.uomId = item;
  //  this.uomId = item
  //  this.validation();
  //}
  //OnItemDeSelectUOM(item: any) {
  //  this.uomId = null;
  //  this.validation();
  //}
  OnItemDeSelectMaterial(item: any) {
    this.materialId = null;
    this.validation();
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  setMaterialControl(viewModel: LocationPreferredMaterialViewModel) {
    
    this.preferredMaterialViewModel.clientId = this.clientId;
    this.preferredMaterialViewModel.materialId = viewModel.materialId;
    this.preferredMaterialViewModel.quantity = viewModel.quantity;
    this.preferredMaterialViewModel.uomId = viewModel.uomId;
    this.preferredMaterialViewModel.id = viewModel.id;
    //selectedItemsA
    let materialDDL = [];
    materialDDL.push({
      id: viewModel.materialId,
      itemName: viewModel.materialName
    });
    let uomDdl = []
    uomDdl.push({
      id: viewModel.uomId,
      itemName: viewModel.uomName
    });
    this.selectedItemsA = materialDDL;
    this.selectedItemsB = uomDdl;
    this.uomId = viewModel.uomId;
    this.materialId = viewModel.materialId;
    this.validation();
    //if (!this.isSearch)
    //  this.Addressform.controls["AddressTypeData"].setValue(addressTypeItem);
    //this.Addressform.controls["CountryData"].setValue(country);
    //this.Addressform.controls["StateData"].setValue(stateCode);
    //this.Addressform.controls["CityData"].setValue(cityCode);
  }
  addPreferredMaterial() {
    
    this.preferredMaterialViewModel.clientId = this.clientId;
    this.preferredMaterialViewModel.locationId = this.InputlocationId;
    this.preferredMaterialViewModel.quantity = Number(this.preferredMaterialViewModel.quantity);
    //this.preferredMaterialViewModel.materialId = 0;
    //this.preferredMaterialViewModel.quantity = 1;
    //this.preferredMaterialViewModel.uomId = 2;
    this.preferredMaterialViewModel.updateDateTimeBrowser = new Date(new Date().toString());
    this.preferredMaterialViewModel.createDateTimeBrowser = new Date(new Date().toString());
    this.preferredMaterialViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    this.preferredMaterialViewModel.pageAction = this.pageActionType;
    //this.customerbylocationService.AddEditPreferredMaterial
    if (!!this.materialIds && this.isEdit) {
      if (this.pageActionType == LocationConstant.ContactActionType) {
        this.customerbylocationService.updatePreferredMaterial(this.preferredMaterialViewModel)
          .subscribe(
            data => {

              if (data.data != null) {
                //this.Addressform.reset();
                this.passEntry.emit(1);
                this.toastrService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
                this.materialIds = '';
                this.activeModal.close();
                //this.editEntry.emit(data.data);
              }
            }

          )
      }
    }
    else {
      this.customerbylocationService.AddEditPreferredMaterial(this.preferredMaterialViewModel)
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
  }

  BindMaterialList() {    
    this.customerbylocationService.GetMaterialList(this.orderID, this.sectionID, this.clientId, this.orderTypeID)
      .subscribe(
        result => {
          if (!!result.data) {
            if (!(!!this.materialIds && this.isEdit)) {
              if (this.PreferredMaterialList != null) {
                this.PreferredMaterialList.filter(item => {
                  let index = result.data.findIndex(x => x.id == item.materialId)
                  if (index > -1) {
                    result.data.splice(index, 1);
                  }
                });
              }
              
            }
          }          
          this.setMaterialDropDown(result.data);
        }
      );
  }

  BindUOMList() {    
    this.customerbylocationService.GetUOMData()
      .subscribe(
        result => {
          this.UOMData = result.data;
          this.SelectUOM = this.UOMData.find(f => f.code == GlobalConstants.EA)?.id;
          //alert(this.SelectUOM);
          this.preferredMaterialViewModel.uomId = this.SelectUOM;
          //this.uomId = result.data.id
          //result.data.splice(1, 2);
          //result.data.splice(2, 1);
          //this.setUOMDropDown(result.data);          
        }
      );
  }

  setMaterialDropDown(data: any) {
    this.MaterialData = [];
    if (!!data)
      this.MaterialData = data.map(item => {
        return {          
          itemName: item.name,
          id: item.id
        };
      });
    this.MaterialData.sort((x, y) => x.itemName.localeCompare(y.itemName));
  }
  setUOMDropDown(data: any) {
    this.UOMData = [];
    if (!!data)
      this.UOMData = data.map(item => {
        return {
          itemName: item.name,
          id: item.id
        };
      });
  }

  validateQuantity(quantity) {    
    let isQuntityValid = false;
    if (!!quantity) {
      const re = /^[1-9][0-9]*$/;
      isQuntityValid = !(re.test(quantity));
    }
    return isQuntityValid;
  }
  //pattern = ""
  isMaterialId: number;
  isQuantity: number;
  isValidInput: number;
  //isUOMId: number;

    validation(type: string = ''): boolean {
    
      let isValidated: boolean = true;
      if (!!!this.materialId) {
        this.isMaterialId = 1;
          isValidated = false;
        } else {
        this.isMaterialId = 0;
      }
      if (!!!this.preferredMaterialViewModel.quantity) {
        this.isQuantity = 1;
          isValidated = false;
      }
      else {
        this.isQuantity = 0;
      }

      if (this.validateQuantity(this.preferredMaterialViewModel.quantity)) {
        this.isValidInput = 1;
        isValidated = false;
      } else {
        this.isValidInput = 0;
      }


      //if (!!!this.preferredMaterialViewModel.quantity) {
      //  alert("invalid Input");
      //  this.isQuantity = 1;
      //  this.isValidInput = 1;
      //  isValidated = false;
      //}



      //if (!!!this.uomId) {
      //  this.isUOMId = 1;
      //    isValidated = false;
      //} else {
      //  this.isUOMId = 0;
      //}
      if (this.isMaterialId === 0 && this.isQuantity === 0 &&  this.isValidInput === 0) {


        this.isValidated = 1;

      }
      else {
        this.isValidated = 0;
      }
        return isValidated;
   
    }
  //submitValidation() {
  //  if (this.contactActionType == ContactTypeActions.Location) {
  //    this.isValidated = (!!this.contactTypeId && !!this.usersContactViewModel.firstName && !!this.usersContactViewModel.lastName
  //      && !!this.usersContactViewModel.email && !this.validateEmail(this.usersContactViewModel.email) && this.isExistUserContact === 0
  //      //&& !!this.usersContactViewModel.workPhone  && !!this.usersContactViewModel.mobilePhone
  //    ) ? 1 : 0;
  //  }
  //  else {
  //    this.isValidated = (!!this.contactTypeId && !!this.usersContactViewModel.firstName && !!this.usersContactViewModel.lastName
  //      && !!this.usersContactViewModel.email && !this.validateEmail(this.usersContactViewModel.email) && this.isExistUserContact === 0
  //      //&& !!this.usersContactViewModel.workPhone  && !!this.usersContactViewModel.mobilePhone
  //    ) ? 1 : 0;
  //  }


  //}
}
