import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { LocationConstant, MaterialCallListViewModel, LocationListViewModel, LocationAverageShipFromMileMappingViewModel, CustomerPropertyDetails } from '../../../../core/models/Location';
import { AddEditShipfromLocComponent } from '../add-edit-shipfrom-loc/add-edit-shipfrom-loc.component';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { AuthService, UsersViewModel, User } from '../../../../core';
import { ButtonActionType } from '../../../../core/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { CustomerByLocation, CustomerByLocationEditModel } from '../../../../core/models/CustomerByLocation.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { CommodityService } from '../../../../core/services/commodity.service';
import { CommodityNewModel, CommodityType } from '../../../../core/models/commodity.model';

 
@Component({
  selector: 'app-edit-customer-partner',
  templateUrl: './edit-customer-partner.component.html',
  styleUrls: ['./edit-customer-partner.component.css']
})
export class EditCustomerPartnerComponent implements OnInit {

  @Input("selectedCustomers") selectedCustomers: CustomerByLocation[] = [];
  @Output("customersInEdit") customersInEdit = new EventEmitter<CustomerByLocation[]>();
  selectedCustomerToEdit: CustomerByLocation;
  setupDone = false;
  setupDoneDateTime;
  pageActionType: string;
  screenAction: string;
  modalRef: NgbModalRef;
  commonCallListViewModel: MaterialCallListViewModel = new MaterialCallListViewModel();
  shipFromMileMappingViewModel: LocationAverageShipFromMileMappingViewModel = new LocationAverageShipFromMileMappingViewModel();
  locationViewModal: LocationListViewModel = new LocationListViewModel();

  clientId: number = 0;
  averageMile: number = 0;
  contactCount: number = 0;
  finalAverageMile: number = 0;
  preferredMaterialListCount: number = 0;
  defaultPalletCount: number = 0;
  preferredEquipmentListCount: number = 0;
  countOfForecastMaterial: number = 0;
  statOfCharacteristics: string = "0/0";
  addressCount: number = 0;
  salesManagerList = [];
  selectedSalesManager = [];
  salesBrokerList = [];
  selectedSalesBroker = [];
  commodityList = [];
  selectedCommodity = [];
  settingsSalesManager = {};
  settingsSalesBroker = {};
  settingsCommodity = {};

  itemListC = [];
  itemListD = [];


  selectedItemsD = [];
  settingsD = {};


  userData = {
    listA: '',
    listB: ''
  };

  onSubmit(validForm, userData) {
  }
  selectRow: any;

  constructor(public router: Router, public modalService: NgbModal,
    private customerbylocationService: CustomerByLocationService,
    private commodityService: CommodityService,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
  ) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.pageActionType = LocationConstant.ContactActionType;
    this.screenAction = LocationConstant.ScreenAction;
  }

  async ngOnInit() {

    await this.setCustomersToEdit();
    this.selectRow = 'selectRow';


    this.getSalesBroker();
    this.getSalesManager();
    this.getCommodity();

    this.settingsSalesManager = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: 'username'
    };

    this.settingsSalesBroker = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: 'name'
    };

    this.settingsCommodity = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: 'name',
      noDataLabel: "No Data Available"
    };
    this.settingsD = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

  }

  ngAfterViewInit() {

    this.BindOverrideMiles();
    this.BindShipFromLocationList();
    this.BindCustomerContract();
  }
  InputLocationId: number;
  async setCustomersToEdit() {
    this.selectedCustomerToEdit = this.selectedCustomers[0];
    this.InputLocationId = this.selectedCustomerToEdit.customerId;
    var defaultCount = await this.customerbylocationService.getMaxEditedRecordsCount();
    this.selectedCustomers = this.selectedCustomers.slice(0, defaultCount);
    this.customersInEdit.emit(this.selectedCustomers);
  }


  getSalesBroker() {
    var paginationModel = new CustomerByLocation();
    this.customerbylocationService.getSalesBroker(paginationModel)
      .subscribe(
        result => {
          this.salesBrokerList = result.data;
          this.mapDataToEditScreen();
        }
      );
  }


  getSalesManager() {
    this.customerbylocationService.getUserbyRole('salesManager')
      .subscribe(
        result => {
          this.salesManagerList = [];
          if (result.Data) {
            result.Data.forEach(item => this.salesManagerList.push({ id: item.Id, username: item.FirstName + " " + item.LastName }));
            this.mapDataToEditScreen();
          }

        }
      );
  }

  getCommodity() {
    var commodityNewModel = { clientID: this.clientId } as CommodityNewModel;
    this.commodityService.getCommodityList(commodityNewModel)
      .subscribe(
        result => {
          this.commodityList = result.data;
          this.mapDataToEditScreen();
        }
      );
  }


  mapDataToEditScreen() {
    if (this.selectedCustomerToEdit) {
      if (this.salesBrokerList.length > 0 && this.selectedCustomerToEdit.salesBrokerId > 0)
        this.selectedSalesBroker[0] = this.salesBrokerList.find(x => x.id == this.selectedCustomerToEdit.salesBrokerId);
      if (this.salesManagerList.length > 0 && this.selectedCustomerToEdit.salesManagerId > 0)
        this.selectedSalesManager[0] = this.salesManagerList.find(x => x.id == this.selectedCustomerToEdit.salesManagerId);
      if (this.commodityList.length > 0 && this.selectedCustomerToEdit.defaultCommodityID > 0)
        this.selectedCommodity[0] = this.commodityList.find(x => x.id == this.selectedCustomerToEdit.defaultCommodityID);

      this.setupDone = this.selectedCustomerToEdit.setupDone;
      this.setupDoneDateTime = this.selectedCustomerToEdit.setupDoneDateTime;
    }
  }

  getUpdatedCustomer() {
    var customerEditModel = new CustomerByLocationEditModel()
    customerEditModel.customerId = this.selectedCustomerToEdit.customerId;
    customerEditModel.defaultCommodityID = this.selectedCommodity[0]?.id;
    customerEditModel.salesBrokerId = this.selectedSalesBroker[0]?.id;
    customerEditModel.salesManagerId = this.selectedSalesManager[0]?.id;
    customerEditModel.loadingComment = this.selectedCustomerToEdit.loadingComment.trim();
    customerEditModel.transportationComment = this.selectedCustomerToEdit.transportationComment.trim();
    customerEditModel.updateDateTimeBrowser = new Date();
    customerEditModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    customerEditModel.setupDone = this.setupDone;

    if (!this.selectedCustomerToEdit.setupDone && this.setupDone) {
      this.selectedCustomerToEdit.setupDoneDateTime = new Date();
      this.setupDoneDateTime = new Date();
    }

    if (this.selectedCustomerToEdit.setupDone && !this.setupDone) {
      this.selectedCustomerToEdit.setupDoneDateTime = null;
      this.setupDoneDateTime = null;
    }
    customerEditModel.setupDoneDateTime = this.setupDoneDateTime;
    if (this.isFormValid(customerEditModel)) {
      return customerEditModel;
    } else {
      return null;
    }

  }

  isFormValid(customerEditModel: CustomerByLocationEditModel) {
    if (customerEditModel.salesManagerId
      && customerEditModel.defaultCommodityID) {
      return true;
    }
    return false;
  }

  async saveAndNextCustomerByLocation() {
    this.toastrService.info("Selecting next Charge to edit after saving changes, if any.")
    if (await this.saveCustomerByLocation()) {
      this.selectNext();
    }
  }

  selectNext() {
    let nextIndex = this.selectedCustomers.map(function (x) { return x.id; }).indexOf(this.selectedCustomerToEdit.id);
    if (nextIndex == this.selectedCustomers.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedCustomer(this.selectedCustomers[nextIndex]);
  }

  async saveCustomerByLocation() {
    var saveObj = this.getUpdatedCustomer();
    if (saveObj == null) {
      this.toastrService.error("Please fill all mandatory fields to save.");
      return false;
    }
    await this.customerbylocationService.saveCustomerByLocation(saveObj).toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data) {
          this.toastrService.success("Saved successful.");
        } else {
          this.toastrService.error("Saving failed. Please try again later.");
        }
      })
      .catch(() => this.toastrService.error("Saving failed. Please try again later."));
    return true;
  }
  clearEditScreen() {
    this.selectedSalesBroker = [];
    this.selectedSalesManager = [];
    this.selectedCommodity = [];
  }

  onSalesManagerSelect(salesmanager: any) {
    this.selectedSalesManager[0] = salesmanager;
  }

  onSalesBrokerSelect(salesBroker: any) {
    this.selectedSalesBroker[0] = salesBroker;
  }

  onCommoditySelect(commodity: any) {
    this.selectedCommodity[0] = commodity;
  }

  setCountOfForecastMaterial(count: number) {
    this.countOfForecastMaterial = count;
  }
  isValidInput: number;
  isMiles: number;
  isValidated: number = 0;
  validation(type: string = ''): boolean {
    let isValidated: boolean = true;

    if (!!!this.propertyDetailsViewModel.propertyValue) {
      this.isMiles = 1;
      isValidated = false;
    } else {
      this.isMiles = 0;
    }

    if (this.validateNumber(this.propertyDetailsViewModel.propertyValue)) {
      this.isValidInput = 1;
      isValidated = false;
    } else {
      this.isValidInput = 0;
    }

    if (this.isMiles === 0 && this.isValidInput === 0) {


      this.isValidated = 1;

    }
    else {
      this.isValidated = 0;
    }
    return isValidated;
  }
  decimalPlaces: number = 2;
  validateNumber(value) {
    let isInputValid = false;
    if (!!value) {
      const re = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
      isInputValid = !(re.test(value));
    }
    return isInputValid;
  }
  openShipLoc(action) {
    if (action === ButtonActionType.AddLocationMiles) {
      this.modalRef = this.modalService.open(AddEditShipfromLocComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.InputlocationId = this.InputLocationId;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.BindShipFromLocationList();
      });
    }
    else if (action === ButtonActionType.EditLocationMiles) {
      if (!!!this.milesLocationSelectedIds) {
        this.toastrService.warning('Please Select At least One Record');
        return;
      } else if (!!this.milesLocationSelectedIds) {
        const splitContactIds = this.milesLocationSelectedIds.split(',');
        if (splitContactIds.length > 1) {
          this.toastrService.warning('Please Select only one Record for edit');
          return;
        }
      }

      this.modalRef = this.modalService.open(AddEditShipfromLocComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.InputlocationId = this.InputLocationId;
      this.modalRef.componentInstance.pageActionType = LocationConstant.PageAction;
      this.modalRef.componentInstance.locationId = this.selectedCustomerToEdit.customerId;
      this.modalRef.componentInstance.milesLocationSelectedIds = this.milesLocationSelectedIds;
      this.modalRef.componentInstance.isEdit = true;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.BindShipFromLocationList();
      });

    }
    else if (action === ButtonActionType.deleteLocationMiles) {
      if (!!!this.milesLocationSelectedIds) {
        this.toastrService.warning('Please Select At least One Record');
        return;
      }
      if (confirm("Are you sure to delete?")) {
        this.shipFromMileMappingViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.shipFromMileMappingViewModel.selectedIds = this.milesLocationSelectedIds;
        this.customerbylocationService.deleteMilesListByIds(this.shipFromMileMappingViewModel).subscribe(x => {
          this.BindShipFromLocationList();
          this.toastrService.success('Ship from location deleted successfully');
        });
      }
    }
  }
  getContactCount(value: any) {
    this.contactCount = value;
  }
  getPreferredMaterialCount(value: any) {
    this.preferredMaterialListCount = value;
  }
  getDefaultPalletCount(value: any) {
    this.defaultPalletCount = value;
  }

  getpreferredEquipmentCount(value: any) {
    this.preferredEquipmentListCount = value;
  }
  getAddressCount(value: any) {
    this.addressCount = value;
  }
  shipfromLocationList: any = [];
  customerContractList: any = [];

  BindShipFromLocationList() {
    this.shipFromMileMappingViewModel.shipToLocationId = this.selectedCustomerToEdit.customerId;
    this.customerbylocationService.getShipFromLocationList(this.shipFromMileMappingViewModel)
      .subscribe(
        result => {
          this.shipfromLocationList = result.data
          this.CalculateAverageMile();
          //this.listPalletLength.emit(this.defaultPalletList.length);

          //shipFromLocationName
          //locationFunctionName
        }
      );
  }
  propertyDetailsViewModel: CustomerPropertyDetails = new CustomerPropertyDetails();
  error: string;
  async SaveOverrideMiles() {
    this.propertyDetailsViewModel.clientId = this.clientId;
    this.propertyDetailsViewModel.locationId = this.selectedCustomerToEdit.customerId;
    this.propertyDetailsViewModel.entityPropertyCode = LocationConstant.MilesOverride;
    this.propertyDetailsViewModel.propertiesUom = "";
    this.propertyDetailsViewModel.updateDateTimeBrowser = new Date(new Date().toString());
    this.propertyDetailsViewModel.createDateTimeBrowser = new Date(new Date().toString());
    this.propertyDetailsViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    this.propertyDetailsViewModel.pageAction = this.pageActionType;

    await this.customerbylocationService.AddPreferredEquipmentType(this.propertyDetailsViewModel)
      .toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data) {
          this.toastrService.success(GlobalConstants.SUCCESS_MESSAGE);
        } else {
          this.toastrService.error("Saving failed. Please try again later.");
        }
      })
      .catch(() => this.toastrService.error("Saving failed. Please try again later."));
    return true;
    //.toPromise()
    //.then(
    //  result => {
    //    //this.setMaterialDropDown(result.data);
    //    //this.activeModal.close();
    //    //this.passEntry.emit(1);
    //  },
    //  error => {
    //    this.error = error;
    //    this.toastrService.error(this.error);
    //  },
    //  () => {
    //    // No errors, route to new page here
    //    this.toastrService.success(GlobalConstants.SUCCESS_MESSAGE);
    //    //this.isValidated = 0;
    //  }
    //);

  }

  BindOverrideMiles() {

    this.propertyDetailsViewModel.entityPropertyCode = LocationConstant.MilesOverride;
    this.propertyDetailsViewModel.locationId = this.selectedCustomerToEdit.customerId;
    this.customerbylocationService.GetPreferredEquipmentList(this.propertyDetailsViewModel)
      .subscribe(
        result => {
          //alert(result.data[0].propertyValue);
          this.CalculateAverageMile();
          if (result.data != null && result.data[0].propertyValue != '') {
            this.propertyDetailsViewModel.propertyValue = result.data[0].propertyValue;
          }
          else {
            this.propertyDetailsViewModel.propertyValue = String(this.finalAverageMile);
          }
        }
      );
  }

  BindCustomerContract() {
    //this.propertyDetailsViewModel.locationId = this.selectedCustomerToEdit.customerId;
    this.customerbylocationService.GetContractList(this.screenAction, this.selectedCustomerToEdit.customerId)
      .subscribe(
        result => {

          this.customerContractList = result.data

          //alert(result.data[0].propertyValue);
          //this.CalculateAverageMile();
          //if (result.data != null && result.data[0].propertyValue != '') {
          //  this.propertyDetailsViewModel.propertyValue = result.data[0].propertyValue;
          //}
          //else {
          //  this.propertyDetailsViewModel.propertyValue = String(this.finalAverageMile);
          //}
        }
      );
  }

  async updateMilesOverride(miles: string) {
    this.propertyDetailsViewModel.propertyValue = miles;
    await this.SaveOverrideMiles();
    this.BindOverrideMiles();
  }




  CalculateAverageMile() {
    let averageMile: number = 0
    if (this.shipfromLocationList.length > 0) {
      this.shipfromLocationList.map(x => {
        averageMile = averageMile + Number(x.modifiedMiles);
      });
      averageMile = averageMile / Number(this.shipfromLocationList.length);
    }

    this.finalAverageMile = Number(averageMile.toFixed(2));
  }
  isMilesLocationSelected: boolean;
  isMilesAllLocationSelected: boolean = false;
  milesLocationSelectedIds: string;
  selectMilesCheckbox(value: any) {

    this.shipfromLocationList.forEach(row => {
      if (row.id == value.id)
        row.isSelected = !value.isSelected;
    });

    this.isMilesLocationSelected = (this.shipfromLocationList.length === (this.shipfromLocationList.filter(x => x.isMilesSelected == true).length));

    this.setMilesCheckBoxData();
  }

  removeCustomerFromEditList(customerToRemove: CustomerByLocation) {
    this.selectedCustomers.splice(this.selectedCustomers.findIndex(item => item.id === customerToRemove.id), 1);
    this.customersInEdit.emit(this.selectedCustomers);
  }

  selectedCustomer(customerToEdit: CustomerByLocation) {
    this.selectedCustomerToEdit = customerToEdit;
    this.clearEditScreen();
    this.mapDataToEditScreen();
  }

  idsMilesLocationDeleted: string = '';
  setMilesCheckBoxData() {
    let iDs: string = '';
    this.milesLocationSelectedIds = '';
    this.idsMilesLocationDeleted = '';
    this.shipfromLocationList.filter(x => {
      if (x.isSelected == true) {
        console.log(x);
        iDs += `${x.id},`;
        this.idsMilesLocationDeleted += `${x.id},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsMilesLocationDeleted = this.idsMilesLocationDeleted.substring(0, this.idsMilesLocationDeleted.length - 1);
      this.milesLocationSelectedIds = iDs;
    }
  }

  selectMilesAll(check: any) {
    this.isMilesAllLocationSelected = check.checked;
    this.shipfromLocationList.forEach(row => {
      row.isSelected = this.isMilesAllLocationSelected;
    });
    this.setMilesCheckBoxData();
  }

  setStatOfCharacteristics(stat: string) {
    this.statOfCharacteristics = stat;
  }
}

