import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuelPriceService } from '../../../../../core/services/fuel-price.service';
import { AuthService } from '../../../../../core';
import { FuelPriceViewModel } from '../../../../../core/models/fuel';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-add-fuel',
  templateUrl: './add-fuel.component.html',
  styleUrls: ['./add-fuel.component.css']
})
export class AddFuelComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
    private fuelPriceService: FuelPriceService
  ) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
  }
  fuelPriceViewModel: FuelPriceViewModel = new FuelPriceViewModel();
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() isEdit: boolean = false;
  @Input() selectedId: string;
  itemListA = [];
  itemListB = [];
  itemListC = [];
  clientId: number;
  selectedItemsA = [];
  settingsLocation = {};
  error: string;
  selectedItemsB = [];
  selectedItemsC = [];
  settingsFuelPriceType = {};
  settingsUOM = {};

  count = 3;
  locationData: any;
  fuelPriceTypeData: any;
  UOMData: any;

  ngOnInit(): void {
    this.BindLocationDDl();
    this.BindFuelPriceTypeDDl();
    this.BindUOMDDL();
    this.getdecimalValue();

    this.settingsLocation = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

    this.settingsFuelPriceType = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };
    this.settingsUOM = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };


    if (this.selectedId && this.isEdit) {
      //if (this.pageActionType == LocationConstant.ContactActionType) {
      this.fuelPriceViewModel.selectedIds = String(this.selectedId)
      this.fuelPriceService.getFuelPriceById(this.fuelPriceViewModel).pipe().subscribe(x => {
          if (x.data) {
            //this.contactTypeId = x.data.contactTypeId;
            //this.userContactId = x.data.userContactId;
            console.log(x.data);
            this.setFuelPriceControl(x.data[0]);

          }
        });
      
    }
  }

  setFuelPriceControl(viewModel: FuelPriceViewModel) {

    this.fuelPriceViewModel.clientId = this.clientId;
    this.fuelPriceViewModel.countryId = viewModel.countryId;
    this.fuelPriceViewModel.rate = viewModel.rate;
    this.fuelPriceViewModel.uomid = viewModel.uomid;
    this.fuelPriceViewModel.fuelPriceDateTime = viewModel.fuelPriceDateTime;
    this.fuelPriceViewModel.fuelPriceTypeId = viewModel.fuelPriceTypeId;
    this.fuelPriceViewModel.id = viewModel.id;
    //selectedItemsA
    let locationDDL = [];
    locationDDL.push({
      id: viewModel.countryId,
      itemName: "USA"
    });
    let uomDdl = []
    uomDdl.push({
      id: viewModel.uomid,
      itemName: viewModel.uom
    });
    let priceTypeDDL = []
    priceTypeDDL.push({
      id: viewModel.fuelPriceTypeId,
      itemName: viewModel.priceType
    });
    this.selectedItemsA = this.locationData.filter(x => x.id == viewModel.countryId);
    this.selectedItemsB = this.UOMData.filter(x => x.id == viewModel.uomid);
    this.selectedItemsC = this.fuelPriceTypeData.filter(x => x.id == viewModel.fuelPriceTypeId);


   
    this.validation();
    
  }
  //onAddItemA(data: string) {
  //  this.count++;
  //  this.itemListA.push({ "id": this.count, "itemName": data });
  //  this.selectedItemsA.push({ "id": this.count, "itemName": data });
  //}
  //onAddItemC(data: string) {
  //  this.count++;
  //  this.itemListC.push({ "id": this.count, "itemName": data });
  //  this.selectedItemsC.push({ "id": this.count, "itemName": data });
  //}

  //onAddItemB(data: string) {
  //  this.count++;
  //  this.itemListB.push({ "id": this.count, "itemName": data });
  //  this.selectedItemsB.push({ "id": this.count, "itemName": data });
  //}
  onLocationSelect(item: any) {
    this.fuelPriceViewModel.countryId = item.id;
    this.validation();
  }
  onfuelPriceTypeSelect(item: any) {
    this.fuelPriceViewModel.fuelPriceTypeId = item.id;
    this.validation();
  }
  onUOMSelect(item: any) {
    this.fuelPriceViewModel.uomid = item.id;
    this.validation();
  }
  OnLocationDeSelect(item: any) {
    this.fuelPriceViewModel.countryId = null;
    this.validation();
  }
  OnfuelPriceTypeDeSelect(item: any) {
    this.fuelPriceViewModel.fuelPriceTypeId = null;
    this.validation();
  }
  OnUOMDeSelect(item: any) {
    this.fuelPriceViewModel.uomid = null;
    this.validation();
  }
  onDateChange(item: any) {
    this.fuelPriceViewModel.fuelPriceDateTime = item.value;
    this.validation();
  }
  

  BindLocationDDl() {

    this.fuelPriceService.getCountryList(this.clientId)
      .subscribe(
        result => {
          
          this.setLocationDropDown(result.Data);
        }
      );
  }
  setLocationDropDown(data: any) {

    this.locationData = [];
    if (!!data)
      this.locationData = data.map(item => {
        return {
          //itemName: item.name + ' - ' + item.description,
          itemName: item.CountryCode,
          id: item.Id
        };
      });
  }


  BindUOMDDL() {
    this.fuelPriceService.getFuelUOMList(this.clientId)
      .subscribe(
        result => {
          this.setUOMDropDown(result.data);
        }
      );
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

  BindFuelPriceTypeDDl() {
    this.fuelPriceService.getFuelPriceTypeList(this.clientId)
      .subscribe(
        result => {

          this.setFuelPriceTypeDropDown(result.data);
        }
      );
  }

  setFuelPriceTypeDropDown(data: any) {    
    this.fuelPriceTypeData = [];
    if (!!data)
      this.fuelPriceTypeData = data.map(item => {
        return {
   
          itemName: item.code,
          id: item.id
        };
      });
  }
  isAlreadyExist: boolean = false;
  async saveFuelPrice() {
   
    this.fuelPriceViewModel.clientId = this.clientId;
    this.fuelPriceViewModel.rate = Number(this.fuelPriceViewModel.rate);
    this.fuelPriceViewModel.updateDateTimeBrowser = new Date(new Date().toString());
    this.fuelPriceViewModel.createDateTimeBrowser = new Date(new Date().toString());
    this.fuelPriceViewModel.createdBy = this.authenticationService.currentUserValue.LoginId;
    if (this.selectedId && this.isEdit) {
      this.fuelPriceService.updateFuelPrice(this.fuelPriceViewModel)
        .subscribe(
          result => {
            this.activeModal.close();
            this.passEntry.emit(1);
          },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          },
          () => {
            // No errors, route to new page here
            this.toastrService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
            this.isValidated = 0;
          }
        );
      
    }
    else {
      await this.checkDuplicate(this.fuelPriceViewModel)
      if (!this.isAlreadyExist) {
        this.fuelPriceService.saveFuelPrice(this.fuelPriceViewModel)
          .subscribe(
            result => {

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
      else {
        this.toastrService.warning("Data already Exist");

      }
     
    }
    
    
  }
  decimalValue: number;
  getdecimalValue() {
    this.fuelPriceService.getPrefrenceValueByCode(GlobalConstants.decimalCode)
      .subscribe(
        result => {
          this.decimalValue = result.data.preferenceValue;
          //alert(this.decimalValue);
        }
      );
  }
  async checkDuplicate(model:any) {
    await this.fuelPriceService.checkDuplicateValue(model)
      .toPromise().then(
        result => {
          if (result.data.length > 0) {
            this.isAlreadyExist = true;
          }

        },
        error => {
          this.error = error;
          this.toastrService.error(this.error);
        }
      );
  }

  validatePrice(quantity) {
    let isQuntityValid = false;
    if (!!quantity) {
      const re = new RegExp('^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,' + this.decimalValue + '})?\\s*$');
      isQuntityValid = !(re.test(quantity));
    }
    return isQuntityValid;
  }

  validateDate(testdate) {
    var date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return date_regex.test(testdate);
  }
  isCountryId: number;
  isFuelPriceTypeId: number;
  isFuelPriceDate: number;
  isFuelRate: number;
  isUomId: number;
  isValidated: number = 0;
  isValidInput: number;
  isValidDate: number;
  validation(type: string = ''): boolean {
    
    let isValidated: boolean = true;
    if (!!!this.fuelPriceViewModel.countryId) {
      this.isCountryId = 1;
      isValidated = false;
    } else {
      this.isCountryId = 0;
    }
    if (!!!this.fuelPriceViewModel.fuelPriceTypeId) {
      this.isFuelPriceTypeId = 1;
      isValidated = false;
    }
    else {
      this.isFuelPriceTypeId = 0;
    }

    if (!!!this.fuelPriceViewModel.fuelPriceDateTime) {
      this.isFuelPriceDate = 1;
      isValidated = false;
    }
    else {
      this.isFuelPriceDate = 0;
    }

    if (!!!this.fuelPriceViewModel.rate) {
      this.isFuelRate = 1;
      isValidated = false;
    }
    else {
      this.isFuelRate = 0;
    }
    if (!!!this.fuelPriceViewModel.uomid) {
      this.isUomId = 1;
      isValidated = false;
    }
    else {
      this.isUomId = 0;
    }

    if (this.validatePrice(this.fuelPriceViewModel.rate)) {
      this.isValidInput = 1;
      isValidated = false;
    } else {
      this.isValidInput = 0;
    }
    if (this.validateDate(this.fuelPriceViewModel.fuelPriceDateTime)) {
      this.isValidDate = 1;
      isValidated = false;
    } else {
      this.isValidDate = 0;
    }

   


    
    if (this.isCountryId === 0 && this.isFuelPriceTypeId === 0 && this.isFuelPriceDate === 0 && this.isFuelRate === 0 && this.isUomId === 0 && this.isValidInput === 0 && this.isValidDate === 0) {


      this.isValidated = 1;

    }
    else {
      this.isValidated = 0;
    }
    return isValidated;

  }
}
