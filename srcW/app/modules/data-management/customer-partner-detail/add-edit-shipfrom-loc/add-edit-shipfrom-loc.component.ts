import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { MaterialCallListViewModel, LocationConstant, LocationListViewModel, ToFromLocationViewModel, LocationAverageShipFromMileMappingViewModel } from '../../../../core/models/Location';
import { AuthService } from '../../../../core';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-edit-shipfrom-loc',
  templateUrl: './add-edit-shipfrom-loc.component.html',
  styleUrls: ['./add-edit-shipfrom-loc.component.css']
})
export class AddEditShipfromLocComponent implements OnInit {
  commonCallListViewModel: MaterialCallListViewModel = new MaterialCallListViewModel();
  tofromLocationViewModel: ToFromLocationViewModel = new ToFromLocationViewModel();
  shipFromMileMappingViewModel: LocationAverageShipFromMileMappingViewModel = new LocationAverageShipFromMileMappingViewModel();
  locationViewModal: LocationListViewModel = new LocationListViewModel();
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() InputlocationId: number;
  constructor(private customerbylocationService: CustomerByLocationService,
    private authenticationService: AuthService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal
  ) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    
  }

  itemListA = [];
  clientId: number;
  locationId: number;
  selectedItemsA = [];
  selectedItemsB = [];
  settingsA = {};
  locationFunctionData: any;
  locationData: any;
  toFromLocationData: any;
  fromlocationId: number;
  locationFunctionId: number;
  isValidated: number = 0;
  nameLocation;
  nameLocationFunction;
  count = 3;
  @Input() milesLocationSelectedIds: string;
  @Input() isEdit: boolean = false;

  ngOnInit(): void {
   
    this.itemListA = [
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
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };



  
  }
  ngAfterViewInit(): void {
    this.commonCallListViewModel.ClientID = this.clientId;
    this.locationId = this.InputlocationId;
    this.commonCallListViewModel.LocationId = this.InputlocationId;
    this.commonCallListViewModel.PageAction = LocationConstant.PageAction;
    this.commonCallListViewModel.Code = GlobalConstants.OrganizationTypeCode;
    this.BindLocationFunctionDDl();
    this.BindShipFromLocationList();
    if (this.milesLocationSelectedIds && this.isEdit) {
      
        //this.commonCallListViewModel.PageAction = this.pageActionType;
      this.shipFromMileMappingViewModel.clientId = this.clientId;
      this.shipFromMileMappingViewModel.selectedIds = this.milesLocationSelectedIds;
      this.customerbylocationService.getShipFromLocationListbyId(Number(this.milesLocationSelectedIds)).pipe().subscribe(x => {
          if (x.data) {
            //this.contactTypeId = x.data.contactTypeId;
            //this.userContactId = x.data.userContactId;
            console.log(x.data);
            this.setMilesControl(x.data[0]);

          }
        });
      }
    }
  setMilesControl(viewModel: LocationAverageShipFromMileMappingViewModel) {
    
    this.shipFromMileMappingViewModel.clientId = this.clientId;

    this.locationFunctionId = viewModel.locationFunctionId;
    this.BindLocationDDl(this.locationFunctionId);
    this.shipFromMileMappingViewModel.modifiedMiles = viewModel.modifiedMiles

    //this.locationDDL = [];
    
    //  this.locationData = data.map(item => {
    //    return {
    //      //itemName: item.name + ' - ' + item.description,
    //      itemName: item.name,
    //      id: item.id
    //    };
    //  });

    //selectedItemsA
    let locationDDL = [];
    locationDDL.push({
      id: viewModel.shipFromLocationId,
      itemName: viewModel.shipFromLocationName
    });
    let locationFunctionDdl = []
    locationFunctionDdl.push({
      id: viewModel.locationFunctionId,
      itemName: viewModel.locationFunctionName
    });
    this.selectedItemsA = locationFunctionDdl;
    this.selectedItemsB = locationDDL;
    this.fromlocationId = viewModel.shipFromLocationId;
    this.validation();
    //if (!this.isSearch)
    //  this.Addressform.controls["AddressTypeData"].setValue(addressTypeItem);
    //this.Addressform.controls["CountryData"].setValue(country);
    //this.Addressform.controls["StateData"].setValue(stateCode);
    //this.Addressform.controls["CityData"].setValue(cityCode);
  }

  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
   
  }
  
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
   
  }
  OnItemDeSelectFunction(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    this.selectedItemsB = [];
    this.locationData = [];
   
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    this.selectedItemsB = null;

  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  BindLocationFunctionDDl() {

    this.customerbylocationService.getLocationFunctionList(this.commonCallListViewModel)
      .subscribe(
        result => {
          //this.preferredMaterialList = result.data
          //this.listMaterialLength.emit(this.preferredMaterialList.length);
          this.setLocationFunctionDropDown(result.Data);
        }
      );
  }
  onLocationFunctionSelect(item: any) {
    this.locationFunctionId = item.id;
    this.BindLocationDDl(item.id);

    this.validation();
  }

  async GetDistance() {
    
    await this.GetToFromLocation(this.fromlocationId);
    this.tofromLocationViewModel.fromCityCode = this.toFromLocationData[0].cityName;
    this.tofromLocationViewModel.fromState = this.toFromLocationData[0].stateName;
    this.tofromLocationViewModel.fromCountry = this.toFromLocationData[0].countryName;
    await this.GetToFromLocation(this.locationId);
    this.tofromLocationViewModel.toCityCode = this.toFromLocationData[0].cityName;
    this.tofromLocationViewModel.toState = this.toFromLocationData[0].stateName;
    this.tofromLocationViewModel.toCountry = this.toFromLocationData[0].countryName;
    this.customerbylocationService.getDistance(this.tofromLocationViewModel)
      .subscribe(
        result => {
          //this.preferredMaterialList = result.data
          //this.listMaterialLength.emit(this.preferredMaterialList.length);
          this.shipFromMileMappingViewModel.modifiedMiles = result.data[0].distance;
          //alert(result.data[0].distance);
          this.validation();



        }
      );
  }
  validateNumber(value) {
    let isInputValid = false;
    if (!!value) {
      const re = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
      isInputValid = !(re.test(value));
    }
    return isInputValid;
  }
  onLocationSelect(item: any) {
    this.fromlocationId = item.id;
    this.validation();
    //this.tofromLocationViewModel.toCountry = this.toFromLocationData[0].
  }


  //async getDefaultPageSize() {
  //  if (this.preferenceService.pageSize.value < 1) {
  //    console.log("retrieve default page size");
  //    return await this.preferenceService.getPreferenceTypeByCode('PageSize').toPromise()
  //      .then(result => {
  //        if (result != null && result.data != null) {
  //          this.preferenceService.pageSize.next(parseInt(result.data.preferenceValue));
  //          return parseInt(result.data.preferenceValue);
  //        } else {
  //          // Defaulting it to 10 just in case if the api call fails and we have no response.
  //          return 10;
  //        }
  //      });
  //  }
  //  return this.preferenceService.pageSize.value;
  //}


  async GetToFromLocation(id: any) {
    this.commonCallListViewModel.LocationId = id;
    this.toFromLocationData = [];
    await this.customerbylocationService.getToFromLocation(this.commonCallListViewModel)
      .toPromise().then(

        result => {
          //this.preferredMaterialList = result.data
          //this.listMaterialLength.emit(this.preferredMaterialList.length);
          if (result != null && result.data != null) {
            this.toFromLocationData = [];
            this.toFromLocationData = result.data;
          }
          
        }
      );
  }

  BindLocationDDl(id: any) {
    this.locationViewModal.clientId = this.clientId;
    this.locationViewModal.locationFunctionId = id;
    this.locationViewModal.PageActionType = LocationConstant.PageAction;

    this.customerbylocationService.getLocationList(this.locationViewModal)
      .subscribe(
        result => {
          //this.preferredMaterialList = result.data
          //this.listMaterialLength.emit(this.preferredMaterialList.length);
          if (!(!!this.milesLocationSelectedIds && this.isEdit)) {
            this.shipfromLocationList.filter(item => {
              let index = result.data.findIndex(x => x.id == item.shipFromLocationId)
              if (index > -1) {
                result.data.splice(index, 1);
              }
            });
          }

          this.setLocationDropDown(result.data);




        }
      );
  }

  setLocationDropDown(data: any) {
   
    this.locationData = [];
    if (!!data)
      this.locationData = data.map(item => {
        return {
          //itemName: item.name + ' - ' + item.description,
          itemName: item.name,
          id: item.id
        };
      });
  }

  setLocationFunctionDropDown(data: any) {
    
    this.locationFunctionData = [];
    if (!!data)
      this.locationFunctionData = data.map(item => {
        return {
          //itemName: item.name + ' - ' + item.description,
          itemName: item.Name,
          id: item.ID
        };
      });
  }
  isLocationFunctionId: number;
  isFromLocationId: number;
  isMiles: number;
  isValidInput: number;
  validation(type: string = ''): boolean {

    let isValidated: boolean = true;
    if (!!!this.locationFunctionId) {
      this.isLocationFunctionId = 1;
      isValidated = false;
    } else {
      this.isLocationFunctionId = 0;
    }

    if (!!!this.fromlocationId) {
      this.isFromLocationId = 1;
      isValidated = false;
    } else {
      this.isFromLocationId = 0;
    }

    if (!!!this.shipFromMileMappingViewModel.modifiedMiles) {
      this.isMiles = 1;
      isValidated = false;
    } else {
      this.isMiles = 0;
    }

    if (this.validateNumber(this.shipFromMileMappingViewModel.modifiedMiles)) {
      this.isValidInput = 1;
      isValidated = false;
    } else {
      this.isValidInput = 0;
    }

    if (this.isLocationFunctionId === 0 && this.isMiles === 0 && this.isFromLocationId === 0 && this.isValidInput === 0) {


      this.isValidated = 1;

    }
    else {
      this.isValidated = 0;
    }
    return isValidated;

  }


  SaveMilesData() {
    this.shipFromMileMappingViewModel.shipToLocationId = this.locationId;
    this.shipFromMileMappingViewModel.shipFromLocationId = this.fromlocationId;
    this.shipFromMileMappingViewModel.clientId = this.clientId;
    this.shipFromMileMappingViewModel.modifiedMiles = Number(this.shipFromMileMappingViewModel.modifiedMiles); 
    this.shipFromMileMappingViewModel.createDateTimeBrowser = new Date(new Date().toISOString());
    this.shipFromMileMappingViewModel.updateDateTimeBrowser = new Date(new Date().toISOString());
    this.shipFromMileMappingViewModel.createdBy = this.authenticationService.currentUserValue.LoginId;
    
    if (!!this.milesLocationSelectedIds && this.isEdit) {
      this.shipFromMileMappingViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
      this.shipFromMileMappingViewModel.id = Number(this.milesLocationSelectedIds);

      this.customerbylocationService.updateMilesdata(this.shipFromMileMappingViewModel)
        .subscribe(
          result => {
            //this.preferredMaterialList = result.data
            //this.listMaterialLength.emit(this.preferredMaterialList.length);
            if (result.data != null) {

              this.passEntry.emit(1);
              this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
              //this.addEntry.emit(data.data);
              //this.addressIds = '';
              //this.searchId = '';
              //this.isSearch = false;
              //this.getAddressType();
              this.activeModal.close();
            }

            this.setLocationDropDown(result.data);
          }
        );
    }
    else {
      this.customerbylocationService.addMilesdata(this.shipFromMileMappingViewModel)
        .subscribe(
          result => {
            //this.preferredMaterialList = result.data
            //this.listMaterialLength.emit(this.preferredMaterialList.length);
            if (result.data != null) {

              this.passEntry.emit(1);
              this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
              //this.addEntry.emit(data.data);
              //this.addressIds = '';
              //this.searchId = '';
              //this.isSearch = false;
              //this.getAddressType();
              this.activeModal.close();
            }

            this.setLocationDropDown(result.data);
          }
        );
    }
    
  }

  shipfromLocationList: any;

  BindShipFromLocationList() {
    this.shipFromMileMappingViewModel.shipToLocationId = this.InputlocationId;
    this.customerbylocationService.getShipFromLocationList(this.shipFromMileMappingViewModel)
      .subscribe(
        result => {
          this.shipfromLocationList = result.data




          //this.listPalletLength.emit(this.defaultPalletList.length);

          //shipFromLocationName
          //locationFunctionName
        }
      );
  }
}
