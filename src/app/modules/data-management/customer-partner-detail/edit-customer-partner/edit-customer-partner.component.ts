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
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import moment from 'moment';
import { TopBtnGroupComponent } from '../../../../shared/components/top-btn-group/top-btn-group.component';


@Component({
  selector: 'app-edit-customer-partner',
  templateUrl: './edit-customer-partner.component.html',
  styleUrls: ['./edit-customer-partner.component.css']
})
export class EditCustomerPartnerComponent implements OnInit {

  @Input("selectedCustomers") selectedCustomers: CustomerByLocation[] = [];
  @Output("customersInEdit") customersInEdit = new EventEmitter<CustomerByLocation[]>();
  @Output() isEditPage: EventEmitter<any> = new EventEmitter<any>();
  @Output() EditPageSelectedId: EventEmitter<any> = new EventEmitter<any>();
  @Output() isSelectedActive: EventEmitter<any> = new EventEmitter<any>();
  selectedCustomerToEdit: CustomerByLocation;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  setupDone = false;
  setupDoneChangeFlag: boolean = false;
  setupDoneDateTime;
  setupDoneBy = "";
  setupDoneDateTimetoDisplay;
  pageActionType: string;
  screenAction: string;
  Inactive: boolean = false;
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

    this.BindShipFromLocationList();
    this.getSalesBroker();
    this.getSalesManager();
    this.getCommodity();

    this.settingsSalesManager = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: 'username',
      searchBy: ['name']
      
    };

    this.settingsSalesBroker = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: 'name',
      searchBy: ['name']
    };

    this.settingsCommodity = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: 'name',
      noDataLabel: "No Data Available",
      searchBy: ['name']
    };
    this.settingsD = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['name']
    };

  }
  


  ngAfterViewInit() {

    this.BindOverrideMiles();
    
    this.BindCustomerContract();
    this.isSelectedActive.emit(this.selectedCustomerToEdit.isActive);
  }

  InputLocationId: number;
  async setCustomersToEdit() {
    this.selectedCustomerToEdit = this.selectedCustomers[0];
    this.InputLocationId = this.selectedCustomerToEdit.customerId;
    var defaultCount = await this.customerbylocationService.getMaxEditedRecordsCount();
    this.selectedCustomers = this.selectedCustomers.slice(0, defaultCount);
    this.customersInEdit.emit(this.selectedCustomers);
    this.Inactive = this.customerbylocationService.Permission == false ? true : false;
  }


  getSalesBroker() {
    var paginationModel = new CustomerByLocation();
    this.customerbylocationService.getSalesBroker(paginationModel)
      .subscribe(
        result => {
          if (result.data) { 
            this.salesBrokerList = result.data;
            this.salesBrokerList.sort((x, y) => x.name.localeCompare(y.name));
            this.mapDataToEditScreen();
          }
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
            this.salesManagerList.sort((x, y) => x.username.localeCompare(y.username));
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
          if (result.data) {
            this.commodityList = result.data;
            this.commodityList.sort((x, y) => x.name.localeCompare(y.name));
            this.mapDataToEditScreen();
          }
        }
      );
  }
  paginationModel = new CustomerByLocation();
  customerLocationList: CustomerByLocation[] = [];
  async getCustomerByLocationList() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.paginationModel.clientID = this.clientId;
    //this.selection.clear();
    //this.paginationModel.filterOn = this.filterValue;
    await this.customerbylocationService.getCustomerByLocation(this.paginationModel).toPromise().
      then(result => {
        if (result.data) {
          this.customerLocationList = result.data;
        } else {
          this.customerLocationList = [];
        }
      
      //this.setRowSelection();
    });
  }
  lastUpdate: string;
  updatedBy: string;
  async mapDataToEditScreen() {
    await this.getCustomerByLocationList();
    var selectedEntry = new CustomerByLocation();
    selectedEntry = this.customerLocationList.filter(x => x.id == this.selectedCustomerToEdit.id)[0];
    this.selectedCustomerToEdit.loadingComment = selectedEntry.loadingComment;
    this.selectedCustomerToEdit.transportationComment = selectedEntry.transportationComment;
    this.selectedCustomerToEdit.salesManagerId = selectedEntry.salesManagerId;
    this.selectedCustomerToEdit.salesBrokerId = selectedEntry.salesBrokerId;
    this.selectedCustomerToEdit.defaultCommodityID = selectedEntry.defaultCommodityID;
    if (this.selectedCustomerToEdit) {
      if (this.salesBrokerList.length > 0 && this.selectedCustomerToEdit.salesBrokerId > 0) {
        let matchedBroker = this.salesBrokerList.find(x => x.id == this.selectedCustomerToEdit.salesBrokerId);
        if (matchedBroker) {
          this.selectedSalesBroker[0] = matchedBroker;
        }
      }
       
      if (this.salesManagerList.length > 0 && this.selectedCustomerToEdit.salesManagerId > 0) {
        let matchedManager = this.salesManagerList.find(x => x.id == this.selectedCustomerToEdit.salesManagerId);
        if (matchedManager) {
          this.selectedSalesManager[0] = matchedManager;
        }
      }
        
      if (this.commodityList.length > 0 && this.selectedCustomerToEdit.defaultCommodityID > 0) {
        let matchedComodity = this.commodityList.find(x => x.id == this.selectedCustomerToEdit.defaultCommodityID);
        if (matchedComodity) {
          this.selectedCommodity[0] = matchedComodity;
        }
      }
       


      let m1 = moment(selectedEntry.updateDateTimeBrowser).format('MMMM DD, YYYY hh:mm A');
      let timeZone = moment.tz.guess();
      var timeZoneOffset = new Date(selectedEntry.updateDateTimeBrowser).getTimezoneOffset();
      timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);

      this.lastUpdate = m1 + " " + timeZone;
      this.updatedBy = selectedEntry.updatedBy;

      this.setupDone = selectedEntry.setupDone;

      if (this.setupDone) {
        let m2 = moment(selectedEntry.setupDoneDateTime).format('MMMM DD, YYYY hh:mm A');
        let timeZone1 = moment.tz.guess();
        var timeZoneOffset1 = new Date(selectedEntry.setupDoneDateTime).getTimezoneOffset();
        timeZone1 = moment.tz.zone(timeZone1).abbr(timeZoneOffset1);
        this.setupDoneDateTimetoDisplay = m2 + " " + timeZone1;
        this.setupDoneBy = selectedEntry.setupDoneBy;
      }
      

      //this.lastUpdate = m1 + " " + timeZone;

      
      
      //this.setupDoneDateTime = selectedEntry.setupDoneDateTime;
      
       this.isEditPage.emit(1);
    }
  }

  getUpdatedCustomer() {
    var customerEditModel = new CustomerByLocationEditModel()
    customerEditModel.customerId = this.selectedCustomerToEdit.customerId;
    customerEditModel.defaultCommodityID = this.selectedCommodity[0]?.id;
    customerEditModel.salesBrokerId = this.selectedSalesBroker[0]?.id;
    customerEditModel.salesManagerId = this.selectedSalesManager[0]?.id;
    if (this.selectedCustomerToEdit.loadingComment != null) {
      customerEditModel.loadingComment = this.selectedCustomerToEdit.loadingComment.trim();
    }
    if (this.selectedCustomerToEdit.transportationComment != null) {
      customerEditModel.transportationComment = this.selectedCustomerToEdit.transportationComment.trim();
    }

    customerEditModel.updateDateTimeBrowserSave = this.convertDatetoStringDate(new Date());
    customerEditModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    customerEditModel.setupDone = this.setupDone;
    
    if (this.setupDoneChangeFlag) {
      customerEditModel.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
      customerEditModel.setupDoneDateTimeSave = this.convertDatetoStringDate(new Date());
    }
    else {
      customerEditModel.setupDoneBy = this.selectedCustomerToEdit.setupDoneBy;
      customerEditModel.setupDoneDateTimeSave = this.convertDatetoStringDate(new Date(this.selectedCustomerToEdit.setupDoneDateTime));
    }

    if (!this.selectedCustomerToEdit.setupDone && this.setupDone) {
      this.selectedCustomerToEdit.setupDoneDateTime = new Date();
      this.setupDoneDateTime = new Date();
      customerEditModel.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
      customerEditModel.setupDoneDateTimeSave = this.convertDatetoStringDate(new Date());
      this.selectedCustomerToEdit.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
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
    this.toastrService.info("Records updated successfully.")
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
      this.toastrService.warning("Please fill all mandatory fields to save the record.");
      return false;
    }
    await this.customerbylocationService.saveCustomerByLocation(saveObj).toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data) {
          this.toastrService.success("The record is saved successfully.");
          this.mapDataToEditScreen();
        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support.");
        }
      })
      .catch(() => this.toastrService.error("The record could not be saved. Please contact Tech Support"));
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
  isValidNumber: number = 0;
  validateNumber(value) {
    let isInputValid = false;
    if (value == "")
    {
      this.isValidNumber = 1;

    }
    else
    {
      const re = /^\s*(?=.*[1-9])\d*(?:\.\d{1,8})?\s*$/;
      isInputValid = !(re.test(value));
    }
    if (isInputValid) {
      this.isValidNumber = 0;
    }
    else {
      this.isValidNumber = 1;
    }
    return isInputValid;
  }
  isAddEditAverageMile = false;
  openShipLoc(action) {
    if (action === ButtonActionType.AddLocationMiles) {
      this.modalRef = this.modalService.open(AddEditShipfromLocComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.InputlocationId = this.InputLocationId;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.isAddEditAverageMile = true;
        this.BindShipFromLocationList();
      });
    }
    else if (action === ButtonActionType.EditLocationMiles) {
      if (!!!this.milesLocationSelectedIds) {
        this.toastrService.warning('Please select at least one record.');
        return;
      } else if (!!this.milesLocationSelectedIds) {
        const splitContactIds = this.milesLocationSelectedIds.split(',');
        if (splitContactIds.length > 1) {
          this.toastrService.warning('Please select only one record for editing.');
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
        this.isAddEditAverageMile = true;
        this.BindShipFromLocationList();
      });

    }
    else if (action === ButtonActionType.deleteLocationMiles) {
      if (!!!this.milesLocationSelectedIds) {
        this.toastrService.warning('Please select at least one record');
        return;
      }
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        this.shipFromMileMappingViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.shipFromMileMappingViewModel.selectedIds = this.milesLocationSelectedIds;
        this.customerbylocationService.deleteMilesListByIds(this.shipFromMileMappingViewModel).subscribe(x => {
          this.isAddEditAverageMile = true;
          this.BindShipFromLocationList();
          this.toastrService.success('Ship From Location deleted successfully');
          this.isMilesLocationSelected = false;
        });
      }, (reason) => {
      });
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
          //this.BindOverrideMiles();
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
    this.propertyDetailsViewModel.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    
    this.propertyDetailsViewModel.pageAction = this.pageActionType;

    await this.customerbylocationService.AddPreferredEquipmentType(this.propertyDetailsViewModel)
      .toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data) {
          if (!this.isAddEditAverageMile) {
            this.toastrService.success(GlobalConstants.SUCCESS_MESSAGE);
           
          }
          
        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support");
        }
      })
      .catch(() => this.toastrService.error("The record could not be saved. Please contact Tech Support"));
    this.isAddEditAverageMile = false;
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
          
          this.CalculateAverageMile();
          //if (result.data.length > 0 && result.data[0].propertyValue != "") {
            this.propertyDetailsViewModel.propertyValue = String(Number(result.data[0].propertyValue).toFixed(2));
          //}
          //else {
          //  this.propertyDetailsViewModel.propertyValue = String(this.finalAverageMile.toFixed(2));
          //}
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




  async CalculateAverageMile() {
    let averageMile: number = 0
    if (this.shipfromLocationList.length > 0) {
      this.shipfromLocationList.map(x => {
        averageMile = averageMile + Number(x.modifiedMiles);
      });
      averageMile = averageMile / Number(this.shipfromLocationList.length);
    }

    this.finalAverageMile = Number(averageMile.toFixed(2));

    if (this.isAddEditAverageMile) {      
      this.propertyDetailsViewModel.propertyValue = this.finalAverageMile.toString();
      await this.SaveOverrideMiles();
      this.BindOverrideMiles();
    }
    

  }

  isMilesLocationSelected: boolean;
  isMilesAllLocationSelected: boolean = false;
  milesLocationSelectedIds: string;
  selectMilesCheckbox(value: any) {

    this.shipfromLocationList.forEach(row => {
      if (row.id == value.id)
        row.isSelected = !value.isSelected;
    });

    this.isMilesLocationSelected = this.shipfromLocationList.some(x => x.isSelected);

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
    this.EditPageSelectedId.emit(customerToEdit.customerId);
    this.isSelectedActive.emit(customerToEdit.isActive);
    this.BindCustomerContract();
    this.BindShipFromLocationList();
    //if (customerToEdit.isActive) {
    //  this.btnBar.disableAction('active');
    //  this.btnBar.enableAction('inactive');
    //}
    //else {
    //  this.btnBar.disableAction('inactive');
    //  this.btnBar.enableAction('active');
    //}
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

  setupChange(value: any) {
    if (value.currentTarget.checked) {
      this.setupDoneDateTime = new Date();

      let m2 = moment(this.setupDoneDateTime).format('MMMM DD, YYYY hh:mm A');
      let timeZone1 = moment.tz.guess();
      var timeZoneOffset1 = new Date(this.setupDoneDateTime).getTimezoneOffset();
      timeZone1 = moment.tz.zone(timeZone1).abbr(timeZoneOffset1);

      //this.lastUpdate = m1 + " " + timeZone;

      this.setupDone = value.currentTarget.checked;
      this.setupDoneDateTimetoDisplay = m2 + " " + timeZone1;
      this.setupDoneChangeFlag = true;
      this.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
    }
  }

  convertDatetoStringDate(selectedDate: Date) {

    var date = selectedDate.getDate();
    var month = selectedDate.getMonth() + 1;
    var year = selectedDate.getFullYear();

    var hours = selectedDate.getHours();
    var minuts = selectedDate.getMinutes();
    var seconds = selectedDate.getSeconds();

    return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();



  }
}

