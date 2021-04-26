import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from '@app/core/services/contract.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '@app/core';
import { Contract, ContractObjectViewModel, ContractViewModel, ContractFuelPrice, ContractFullDetails } from '@app/core/models/contract.model';
import { ToastrService } from 'ngx-toastr';
import { ContractLineItemsComponent } from '../edit-contract/contract-line-items/contract-line-items.component';
import { DatePipe } from '@angular/common';
import { ContractDefiningCharacteristicsComponent } from '../edit-contract/contract-defining-characteristics/contract-defining-characteristics.component';
import { ContractCommonDataService } from '../../../../../core/services/contract-common-data.service';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css'],
  providers: [DatePipe]
})
export class AddContractComponent implements OnInit {
  contractform: FormGroup;
  public ContractID: number;
  public headerText: string = 'Add New';
  //EditList: ContractViewModel[];
  ContractNumber: any;
  contractStatus: string;
  lineItems = true;
  error: string;
  ParentId: number;
  EndAlertDays: number = 60;
  ContractApproveFlag: boolean = false;
  characteristicsPanel = false;
  ApprovedBy: any;
  buttonNext: boolean = true;
  ContractApprove: boolean = false;
  ContractApproveStatus: boolean = false;
  ContractApproveDate: any;
  EffectiveStart: Date = new Date();
  EffectiveEnd: Date;
  documentsPanel = false;
  isDisabledContent: boolean = true;
  IsActiveCSL: boolean = true;
  IsActiveBusinessPartner: boolean = true;
  ContractName: string;
  LoadingComment: string;
  TransportationComment: string;
  OrderComment: string;
  ContractComment: string;
  isLoading: boolean;
  isLoadingNext: boolean;
  Inactive: boolean = false;
  updateDateTimeServer: Date;
  updateBy: string;
  ContractSendForApproval: boolean = false;
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  validate: boolean = true;
  object: Contract = new Contract();
  FuelPriceViewModel: ContractFuelPrice[];
  CurrentFuelPercent: string;
  PreviousFuelPercent: string;
  sendobject: ContractObjectViewModel = new ContractObjectViewModel();
  disable: string;
  //@Output('savedData') savedData = new EventEmitter<any>();
  savedData: any;
  //@Input()
  public EditList: ContractViewModel[]=[];
  @Output()
  EdittedContract: EventEmitter<string> = new EventEmitter<string>();
  _currentEditIndex: number = -1;
  _nextButtonText: string = "Add";
  IsSetupComplete: boolean = false;

  get CurrentEditIndex(): number {
    return this._currentEditIndex;
  }

  set CurrentEditIndex(value: number) {
    this._currentEditIndex = Number(value);
  }

  get SaveNext(): string {
    return this._nextButtonText;
  }

  set SaveNext(value: string) {
    this._nextButtonText = value;
  }

  IsReadAndWritePermissionSetupComplete: boolean = false;
  IsContractReadWrite: boolean = true;

  public setUpCheckBoxDisable() {
    if (this.IsContractReadWrite && this.IsReadAndWritePermissionSetupComplete)
      return this.ContractApproveStatus;
    else
      return true;
  }

  public SetUpButtonDisable(): boolean {
    if (this.IsContractReadWrite && this.IsReadAndWritePermissionSetupComplete && this.ContractID > 0)
      return this.ContractApproveStatus;
    else
      return true;
  }

  public IsLocationSelected(): boolean {

    if ((this.selectedCustomerShipLocation != undefined && this.selectedCustomerShipLocation.length > 0) || (this.selectedBusinessPartner != undefined && this.selectedBusinessPartner.length > 0))
      return false;
    else
      return true;
  }

  @ViewChild(ContractLineItemsComponent) lineItemsComp: ContractLineItemsComponent;
  @ViewChild(ContractDefiningCharacteristicsComponent) CntrtDefine: ContractDefiningCharacteristicsComponent;

  ContractViewModel: ContractViewModel = new ContractViewModel();
  constructor(private toastrService: ToastrService, private formBuilder: FormBuilder, private router: Router, private contractService: ContractService, private authService: AuthService, private datepipe: DatePipe, private contractCommonDataService: ContractCommonDataService) {

    this.ContractName = "";
    this.contractform = this.formBuilder.group({
      ContractType: ['', Validators.required],
      EffectiveStart: ['', Validators.required],
      EffectiveEnd: ['', Validators.required],
      EndAlertDays: [''],
      TransportationComment: [''],
      LoadingComment: [''],
      ContractName: ['', Validators.required],
      CustomerShip: [''],
      BusinessPartner: [''],
      OrderComment: [''],
      ContractComment: ['']
    });
    this.ContractApproveDate = null;
  }
  itemContractType = [];
  itemCustomerShipLocation = [];
  TempCustomerShipLocation = [];
  itemBusinessPartner = [];
  TempBusinessPartner = [];
  //itemListA = [];
  //itemListB = [];

  settingsA = {};
  settingsB = {};
  settingsC = {};


  selectedContractType = [];
  selectedCustomerShipLocation = [];
  selectedBusinessPartner = [];

  count = 3;
  date6: Date;
  btnEdit = function () {
    this.router.navigateByUrl('/data-management/contract/edit-contract');
  };

  findContact = function () {
    this.router.navigateByUrl('/data-management/contract/contract-list')
  };

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingNext = false;
    //this.EditList = new Array<any>();
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.contractService.LocationID = 0;
    this.contractService.ID = null;
    this.contractService.ContractTypeId = null;

    if (this.EffectiveStart != undefined && this.EffectiveStart != null) {
      this.contractCommonDataService.ContractStartDate = this.EffectiveStart;
    }


    this.contractCommonDataService.FinalContractData = new ContractFullDetails();
    this.contractCommonDataService.InitialContract = new ContractFullDetails();
    this.getContractType();
    this.getCustomerShipLocation();
    this.getBusinessPartner();
    this.getModulePermissionForSetup();
    this.getModulePermissionForContract();
    

  }//init() end
  ngAfterViewInit(): void {
    

    if (this.contractCommonDataService.EditContractList != undefined && this.contractCommonDataService.EditContractList.length > 0) {
      this.EditList = JSON.parse(JSON.stringify(this.contractCommonDataService.EditContractList));
      if (this.EditList != undefined && this.EditList.length > 0) {

        this.selected(this.EditList[0]);
      }
    }

    
  }

  onAddItemA(data: string) {
    this.count++;
    this.selectedContractType.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.selectedCustomerShipLocation.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    this.setDropDown();
  }
  OnItemDeSelect(item: any) {
    this.setDropDown();
  }
  onSelectAll(items: any) {
    this.setDropDown();
  }
  onDeSelectAll(items: any) {
    this.setDropDown();
  }
  onItemSelectCustomerShip(item: any) {
    if (this.selectedCustomerShipLocation.length >= 1) {
      this.ContractName = this.selectedCustomerShipLocation.map(({ itemName }) => itemName)[0] + "-" + this.selectedContractType.map(({ itemName }) => itemName)[0];
      var locationId = Number(this.selectedCustomerShipLocation.map(({ id }) => id));
      this.getFuelCharge(locationId);
      this.selectedBusinessPartner.length = 0;
      this.settingsC = { disabled: true };
      this.settingsB = { disabled: false };
      this.SetComments(locationId);
    }
  }

  onItemSelectBusinessPartner(item: any) {
    if (this.selectedBusinessPartner.length >= 1) {
      this.ContractName = this.selectedBusinessPartner.map(({ itemName }) => itemName)[0] + "-" + this.selectedContractType.map(({ itemName }) => itemName)[0];
      var locationId = Number(this.selectedBusinessPartner.map(({ id }) => id));
      this.selectedCustomerShipLocation.length = 0;
      this.SetComments(locationId);
      this.settingsC = { disabled: false };
      this.settingsB = { disabled: true };
    }
  }

  setDropDown() {
    var contracttype = Number(this.selectedContractType.map(({ id }) => id));
    this.contractService.ContractTypeId = contracttype;
    if (contracttype == 3 || contracttype == 4 || contracttype == 5) {
      this.settingsC = { disabled: true };
      this.settingsB = { disabled: false };
      this.selectedBusinessPartner.length = 0;
      this.FillLocation();
    }
    else if (contracttype == 1 || contracttype == 2) {
      this.settingsC = { disabled: false };
      this.settingsB = { disabled: true };
      this.selectedCustomerShipLocation.length = 0;
      this.FillLocation();
    }
    else {
      this.settingsC = { disabled: false };
      this.settingsB = { disabled: false };
      this.selectedCustomerShipLocation.length = 0;
      this.selectedBusinessPartner.length = 0;
      this.ContractName = "";
      this.itemBusinessPartner = this.TempBusinessPartner;
      this.itemCustomerShipLocation = this.TempCustomerShipLocation;
    }

  }
  onContractApproveChanged(value: boolean) {
    this.ContractApprove = value;
    if (value) {
      var date = new Date().toISOString();
      this.ApprovedBy = "By : " + this.authService.currentUserValue.LoginId;
      this.ContractApproveDate = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm a');
      this.ContractSendForApproval = true;
    }
    else {
      this.ApprovedBy = "";
      this.ContractApproveDate = "";
    }
  }
  get formData() {
    return this.contractform.controls;
  }

  SetComments(id: number) {
    this.contractService.getCommentsLocation(id)
      .subscribe(result => {
        if (result.message == "Success") {
          this.TransportationComment = result.data.transportationComment;
          this.LoadingComment = result.data.loadingComment;
          this.OrderComment = result.data.orderComment;
        }
      });
    this.contractService.LocationID = id;
    this.lineItemsComp.getContractList();
  }


  ContractTypeDisable(isDisable: boolean = false) {
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      searchBy: ['itemName'],
      disabled: isDisable
    };

  }

  getContractTypeId(id: number) {

    this.contractService.getContractTypeId(id)
      .subscribe(result => {
        let contractType = [];
        this.selectedContractType = [];
        contractType.push({ "id": result.data.id, "itemName": result.data.name });
        this.itemContractType = contractType;
        //this.itemContractType.push({ "id": result.data.id, "itemName": result.data.name });
        this.selectedContractType.push({ "id": result.data.id, "itemName": result.data.name });
        this.ContractTypeDisable(true);

      });
  }
  getContractType() {
    this.contractService.getContractTypeList(this.object)
      .subscribe(result => {
        this.itemContractType = result;
        this.settingsA = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          searchBy: ['itemName'],
          badgeShowLimit: 1
        };
      });
  }

  getCustomerShipLocationID(id: number) {
    this.contractService.getCommentsLocation(id)
      .subscribe(result => {
        this.itemCustomerShipLocation = [];
        this.selectedCustomerShipLocation = [];
        this.itemCustomerShipLocation.push({ "id": result.data.id, "itemName": result.data.id + ' - ' + result.data.name });
        this.settingsB = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          searchBy: ['itemName'],
          disabled: true
        };
        this.selectedCustomerShipLocation.push({ "id": result.data.id, "itemName": result.data.id + ' - ' + result.data.name });
        this.selectedBusinessPartner.length = 0;
      });
  }

  getCustomerShipLocation() {
    this.contractService.GetBillingEntity('Customer', this.authService.currentUserValue.ClientId)
      .subscribe(result => {
        this.itemCustomerShipLocation = result;
        this.TempCustomerShipLocation = result;
        this.settingsB = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          searchBy: ['itemName'],
          badgeShowLimit: 1
        };
      });
  }
  getBusinessPartnerID(id: number) {
    this.itemBusinessPartner = [];
    this.selectedBusinessPartner = [];
    this.contractService.getCommentsLocation(id)
      .subscribe(result => {
        this.itemBusinessPartner.push({ "id": result.data.id, "itemName": result.data.id + ' - ' + result.data.name });
        this.selectedBusinessPartner.push({ "id": result.data.id, "itemName": result.data.id + ' - ' + result.data.name });
        this.selectedCustomerShipLocation.length = 0;
        this.settingsC = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          searchBy: ['itemName'],
          disabled: true
        };
        this.itemBusinessPartner = result.data.map(r => ({ id: r.id, itemName: r.id + ' - ' + r.name }));

      });
  }
  getBusinessPartner() {
    this.contractService.GetBillingEntity('BP', this.authService.currentUserValue.ClientId)
      .subscribe(result => {
        this.itemBusinessPartner = result;
        this.TempBusinessPartner = result;
        this.settingsC = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          searchBy: ['itemName'],
          badgeShowLimit: 1
        };
      });
  }
  async selected(selectedEdit: ContractViewModel) {
    this.ContractViewModel = Object.assign({}, selectedEdit);
    this.contractService.ID = this.ContractViewModel.ID;
    this.ContractID = this.ContractViewModel.ID;
    this.lineItemsComp.clearAllChildGrid();
    this.CntrtDefine.clearAllCharacterstics();

    this.contractService.ContractTypeId = this.ContractViewModel.ContractTypeId;
    this.getContractTypeId(this.ContractViewModel.ContractTypeId);
    await this.getContract();
    this.isDisabledContent = false;
    //this.lineItemsComp.getContractList();
    //this.lineItemsComp.setChildComponent();
    //this.CntrtDefine.fillData();
    //Warning: This contract is read-only as the Contract is inactive.

    if (this.ContractViewModel.LocationSetupComplete == false || this.ContractViewModel.LocationStatus == false) {
      this.toastrService.warning("Warning: This contract is read-only as the Customer Ship To location or Business Partner location is inactive or setup is not done for it.");
      return false;
    }
    else if (this.ContractViewModel.Status == "Inactive") {
      this.toastrService.warning("Warning: This contract is read-only as the Contract is inactive.");
      return false;
    }

    if (this.EditList != undefined && this.EditList.length > 0) {
      this.CurrentEditIndex = this.EditList.findIndex(x => x.ID == this.ContractViewModel.ID);

      if (this.CurrentEditIndex == (this.EditList.length - 1)) {
        this.SaveNext = "Add";
      }
      else if (this.CurrentEditIndex < (this.EditList.length - 1)) {
        this.SaveNext = "Edit";
      }


    }

  }
  getFuelCharge(locationId: number) {
    this.contractService.getFuelPrice(locationId)
      .subscribe(res => {
        if (res.message == "Success") {
          this.FuelPriceViewModel = res.data;
          this.contractService.getExistingCharacteristics({
            "LocationId": locationId,
            "ClientId": this.authService.currentUserValue.ClientId
          }).subscribe((result) => {
            if (result) {
              var data = [];
               data = result.data;
              this.CurrentFuelPercent = String(data.filter(x => (x.displayName == "Customer Fuel Cost Passthrough Percent")).map(function (a) { return a["propertyValue"]; }));
              this.PreviousFuelPercent = String(data.filter(x => (x.displayName == "PrevCustomerFuelCostAllocationPercent")).map(function (a) { return a["propertyValue"]; }));
            }
          });
        }
      });
  }
  async getContract() {
    this.ContractViewModel.ClientID = this.authService.currentUserValue.ClientId;
    this.contractStatus = this.ContractViewModel.Status;
    this.contractService.getContractById(this.ContractViewModel)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.savedData = res.data;
          this.contractService.savedData = res.data;
          this.contractCommonDataService.FinalContractData = JSON.parse(JSON.stringify(res.data));
          this.contractCommonDataService.InitialContract = JSON.parse(JSON.stringify(res.data));

          var data = res.data;
          var contractTypeIds = Number(data.contractTypeId);
          this.ContractName = data.code; //+ "-" + this.selectedContractType.map(({ itemName }) => itemName)[0];
          this.contractService.LocationID = data.locationId;
          this.contractService.ContractTypeId = contractTypeIds;
          // this.getContractType(contractTypeIds);
          var locationId = Number(data.locationId);
          if (contractTypeIds == 3 || contractTypeIds == 4 || contractTypeIds == 5) {
            this.getCustomerShipLocationID(locationId);
            this.getFuelCharge(locationId);
            this.settingsB = { disabled: false };
            this.settingsC = { disabled: true };
          }
          else {
            this.getBusinessPartnerID(locationId);
            this.settingsB = { disabled: true };
            this.settingsC = { disabled: false };
          }
          this.ParentId = data.parentId == null ? 0 : data.parentId;
          this.LoadingComment = data.loadingComment;
          this.OrderComment = data.orderComment;
          this.TransportationComment = data.transportationComment;
          this.ContractComment = data.contractComment;

          //this.formData.EffectiveStart.setValue(data.termStartDate);
          // this.formData.EffectiveEnd.setValue(data.termEndDate);
          this.EffectiveStart = new Date(data.termStartDate);
          this.EffectiveEnd = new Date(data.termEndDate);

          this.contractCommonDataService.ContractStartDate = this.EffectiveStart;
          this.contractCommonDataService.ContractEndDate = this.EffectiveEnd;

          this.EndAlertDays = data.contractEndAlertDays;
          //this.formData.EndAlertDays.setValue(data.contractEndAlertDays);
          this.ContractApprove = data.setupComplete;
          this.ContractApproveFlag = data.setupComplete;
          this.ContractApproveDate = data.setupCompleteDateTime != undefined && data.setupCompleteDateTime != null ? this.contractService.getLocalDateTime(data.setupCompleteDateTime) :'';
          this.updateDateTimeServer = data.updateDateTimeServer;
          this.savedData.updateDateTimeServer = this.contractService.getLocalDateTime(this.savedData.updateDateTimeServer);
          this.savedData.createDateTimeServer = this.contractService.getLocalDateTime(this.savedData.createDateTimeServer);

          this.updateBy = (data.updatedBy == null || data.updatedBy == "") ? data.createdBy : data.updatedBy;
         // if (!this.ContractSendForApproval) {
          //  this.ContractApproveStatus = true;
          //}
          if (this.ContractApprove) {
            this.ContractApproveStatus = true;
            this.ContractSendForApproval = true;
          }
          else {
            this.ContractApproveStatus = false;
            
          }
          if (data.isActive == 0 && this.contractService.Permission == false) {
            this.Inactive = true;
          }
          else if (data.isActive == 1 && this.contractService.Permission == true) {
            this.Inactive = false;
          }
          else if (data.isActive == 0 && this.contractService.Permission == true) {
            this.Inactive = true;
          }
          else if (data.isActive == 1 && this.contractService.Permission == false) {
            this.Inactive = true;
          }
          this.lineItemsComp.resetSelectedContractValue();
          this.lineItemsComp.setChildComponent();
          this.lineItemsComp.getContractList();
          this.CntrtDefine.fillData();

          
          
          this.editorderselctionchange("Edit");
        }
      });

  }


  editorderselctionchange(mode:string) {
    this.EdittedContract.emit(mode);
  }

  Save(source: any) {
    if (this.selectedContractType.length == 0) {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    else if (this.formData.EffectiveStart.value == null || this.formData.EffectiveStart.value == "") {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    else if (this.formData.EffectiveEnd.value == null || this.formData.EffectiveEnd.value == "") {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    else if (this.formData.EffectiveEnd.value < this.formData.EffectiveStart.value) {
      this.toastrService.warning("The effective end date should be greater than equal to effective start date.");
      return false;
    }
    else if (this.ContractName == null || this.ContractName == "") {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    this.isLoading = true;
    this.ContractSave(source);
  }

  ContractNext() {
    // this.settingsA = {};
    // this.settingsB = {};
    // this.settingsC = {};
    //this.settingsA = { disabled: false };
    this.CurrentEditIndex = -1;
    this.ContractTypeDisable();
    this.settingsB = { disabled: false };
    this.settingsC = { disabled: false };

    this.getContractType();
    this.getCustomerShipLocation();
    this.getBusinessPartner();
    this.selectedContractType.length = 0;
    this.selectedCustomerShipLocation.length = 0;
    this.selectedBusinessPartner.length = 0;
    this.contractService.LocationID = 0;
    this.contractService.ID = 0;
    this.contractService.ContractTypeId = 0;
    this.savedData = null;
    this.contractService.savedData = null;

    this.ContractName = "";
    this.isDisabledContent = true;
    this.buttonNext = true;
    this.TransportationComment = "";
    this.EffectiveStart = new Date();
    this.contractCommonDataService.ContractStartDate = this.EffectiveStart;
    this.EffectiveEnd = null;
    this.LoadingComment = "";
    this.OrderComment = "";
    this.ContractComment = "";
    this.ContractApprove = false;
    this.ContractApproveDate = null;
    this.EndAlertDays = 60;
    this.ContractID = 0;
    this.ContractApproveStatus = false;
    this.Inactive = false;
    this.contractCommonDataService.FinalContractData = new ContractFullDetails();
    this.contractCommonDataService.InitialContract = new ContractFullDetails();
    this.lineItemsComp.clearAllChildGrid();
    this.CntrtDefine.clearAllCharacterstics();
    

    //this.lineItemsComp.setChildComponent();
    //this.lineItemsComp.getContractList();
    //this.CntrtDefine.fillData();

    this.lineItemsComp.resetSelectedContractValue();
    
    this.editorderselctionchange("Add New");
  }

  ContractNextold() {
    if (this.selectedContractType.length == 0) {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    else if (this.formData.EffectiveStart.value == null || this.formData.EffectiveStart.value == "") {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    else if (this.formData.EffectiveEnd.value == null || this.formData.EffectiveEnd.value == "") {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    else if (this.formData.EffectiveEnd.value < this.formData.EffectiveStart.value) {
      this.toastrService.warning("The effective end date should be greater than equal to effective start date.");
      return false;
    }
    else if (this.ContractName == null || this.ContractName == "") {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    this.isLoadingNext = true;
    this.ContractSave('savenext');
  }

  onStartDate(event) {
    this.contractCommonDataService.ContractStartDate = event.value;
  }

  onEndDate(event) {
    this.contractCommonDataService.ContractEndDate = event.value;
  }

  CheckExist() {
    var that = this;
    this.contractService.CheckContract(this.sendobject)
      .subscribe(res => {
        if (res.message == "Success") {
          if (res.data) {
            this.toastrService.warning("Data already exist.");
            this.isLoading = false;
            this.isLoadingNext = false;
            return false;
          }
          else {
            this.contractService.saveContract(this.sendobject)
              .subscribe(res => {
                // debugger;
                if (res.message == "Success") {
                  this.toastrService.success("Contract saved successfully");
                  this.savedData = res.data;
                  this.contractService.savedData = res.data;
                  this.contractService.ContractTypeId = this.savedData.contractTypeId;
                  this.contractService.ID = this.savedData.id;
                  this.isLoading = false;
                  this.validate = true;
                  this.buttonNext = false;
                  this.settingsA = { disabled: true };
                  this.settingsB = { disabled: true };
                  this.settingsC = { disabled: true };
                  this.isDisabledContent = false;
                  if (this.ContractSendForApproval == false) {
                    this.ContractApproveStatus = true;
                  }
                  this.ContractID = this.savedData.id;
                  // this.contractform.invalid = true;
                  //this.contractform.reset();
                  // this.ClearForm();
                  this.lineItemsComp.getContractList();
                  let objectinsert = new ContractViewModel;
                  objectinsert.ID = this.savedData.id;
                  objectinsert.Contract_Type = String(this.itemContractType.filter(res => (res.id == this.savedData.contractTypeId)).map(function (a) { return a["itemName"]; }));
                  objectinsert.ContractTypeId = this.savedData.contractTypeId;
                  objectinsert.ClientID = this.authService.currentUserValue.ClientId;
                  objectinsert.Contract_No = this.savedData.contractNumber;
                  objectinsert.Version = this.savedData.contractVersion;
                  objectinsert.Description = this.savedData.description;
                  objectinsert.Billing_Entity = "";
                  objectinsert.Customer_Ship_To_Location = "";
                  objectinsert.Business_Partner = "";
                  objectinsert.Customer_Code = "";
                  objectinsert.Effective_Start = this.savedData.termStartDate;
                  objectinsert.Effective_End = this.savedData.termEndDate;
                  objectinsert.EarliestPriceEnd = this.savedData.earliestPriceEndDate;
                  objectinsert.Evergreen = "";
                  objectinsert.End_Alert_Days = this.savedData.contractEndAlertDays;
                  objectinsert.Status = this.savedData.isActive == 1 ? "Yes" : "No";
                  objectinsert.ContractApproved = "No";
                  objectinsert.LocationStatus = true;
                  objectinsert.LocationSetupComplete = true;
                  objectinsert.Approved_Datetime = "";
                  objectinsert.IsSelected = true;
                  that.EditList.push(objectinsert);

                }
                else {
                  this.toastrService.error("Contract could not be saved. Please check the data being entered or contact Tech Support");
                  this.isLoading = false;
                  this.isLoadingNext = false;
                }
              },

                error => {
                  this.error = error;
                  this.isLoading = false;
                  this.isLoadingNext = false;
                }
              );
          }
        }
      });
  }


  ContractSave(source) {

    this.contractCommonDataService.FinalContractData.UpdateDateTimeBrowser = new Date();
    this.contractCommonDataService.FinalContractData.CreateDateTimeBrowser = new Date();

    this.contractCommonDataService.FinalContractData.TermStartDate = this.EffectiveStart;
    this.contractCommonDataService.FinalContractData.TermEndDate = this.EffectiveEnd;
    this.contractCommonDataService.FinalContractData.TermStartDateStr = this.contractCommonDataService.convertDatetoStringDate(this.EffectiveStart);
    this.contractCommonDataService.FinalContractData.TermEndDateStr = this.contractCommonDataService.convertDatetoStringDate(this.EffectiveEnd);

    this.contractCommonDataService.FinalContractData.ClientId = this.authService.currentUserValue.ClientId;
    this.contractCommonDataService.FinalContractData.UpdatedBy = this.authService.currentUserValue.LoginId;
    this.contractCommonDataService.FinalContractData.CreatedBy = this.authService.currentUserValue.LoginId;

    var contracttype = Number(this.selectedContractType.map(({ id }) => id));
    this.contractCommonDataService.FinalContractData.ContractTypeId = contracttype;

    if (this.selectedCustomerShipLocation != undefined && this.selectedCustomerShipLocation.length > 0) {
      this.contractCommonDataService.FinalContractData.LocationId = Number(this.selectedCustomerShipLocation.map(({ id }) => id));


    }
    else if (this.selectedBusinessPartner != undefined && this.selectedBusinessPartner.length > 0) {
      this.contractCommonDataService.FinalContractData.LocationId = Number(this.selectedBusinessPartner.map(({ id }) => id));

    }

    this.contractCommonDataService.FinalContractData.ContractEndAlertDays = Number(this.formData.EndAlertDays.value != undefined ? this.formData.EndAlertDays.value : 0);
    this.contractCommonDataService.FinalContractData.TransportationComment = this.formData.TransportationComment.value;
    this.contractCommonDataService.FinalContractData.LoadingComment = this.formData.LoadingComment.value;
    this.contractCommonDataService.FinalContractData.ContractNumber = this.formData.ContractName.value;
    this.contractCommonDataService.FinalContractData.Code = this.formData.ContractName.value;
    this.contractCommonDataService.FinalContractData.Description = this.formData.ContractName.value;

   
    

    this.contractCommonDataService.FinalContractData.OrderComment = this.formData.OrderComment.value;
    this.contractCommonDataService.FinalContractData.ContractComment = this.formData.ContractComment.value;



    this.contractCommonDataService.FinalContractData.SetupComplete = this.ContractApprove;
    this.contractCommonDataService.FinalContractData.CreateDateTimeBrowserStr = this.contractCommonDataService.convertDatetoStringDate(new Date());

    this.contractCommonDataService.FinalContractData.UpdateDateTimeBrowserStr = this.contractCommonDataService.convertDatetoStringDate(new Date());


    


    if (this.ContractApprove) {
      this.contractCommonDataService.FinalContractData.SetupCompleteDateTime = new Date(new Date().toISOString());
    }

    if (this.CurrentEditIndex == -1) {
      this.contractCommonDataService.InitialContract = new ContractFullDetails();
    }
    
    this.contractService.SaveAndUpdateContractDetails({ InitialContract: this.contractCommonDataService.InitialContract, UpdatedContract: this.contractCommonDataService.FinalContractData }).subscribe(result => {

      this.isLoading = false;
      if (result.message == "Success") {
        if (result.data.status != "Error") {

          this.lineItemsComp.openViewTable();

          if (result.data.status == "Insert") {
            this.toastrService.success("New contract created successfully.");
            if (this.contractCommonDataService.FinalContractData.id != undefined && this.contractCommonDataService.FinalContractData.id > 0 && this.EditList != undefined && this.EditList.length > 0) {
              var currentIndex = this.EditList.findIndex(x => Number(x.ID) == Number(this.contractCommonDataService.FinalContractData.id));

              if (currentIndex > -1) {
                this.EditList.splice(currentIndex, 1);
              }
            }

            var newItems: ContractViewModel = new ContractViewModel();
            newItems.ID = result.data.contractID;
            newItems.ContractTypeId = result.data.contractTypeID;
            newItems.IsSelected = true;
            newItems.Status = "Active";
            newItems.Contract_No = result.data.contractNumber
            newItems.Version = result.data.contractVersion;
            this.ApprovedBy = "";
            this.ContractApproveDate = "";

            this.isLoading = false;
            this.validate = true;
            this.buttonNext = false;

            if (this.ContractSendForApproval == false) {
              this.ContractApproveStatus = true;
            }

            this.EditList.push(newItems);

          }
          else if (result.data.status == "Update") {
            this.toastrService.success("Contract updated successfully.");


          }


          if (source == "savenext") {
            this.ContractNext();
          }
          else if (source == "saveonly") {
            var items = this.EditList.find(x => x.ID == result.data.contractID);
            this.selected(items);
          }
          else if (source == "editnext") {
            var oldItemIndex = this.EditList.findIndex(x => x.ID == result.data.contractID);
            var newEditItem = this.EditList[oldItemIndex + 1];
            this.selected(newEditItem);
          }
          else {
            this.settingsA = { disabled: true };
            this.settingsB = { disabled: true };
            this.settingsC = { disabled: true };
           // this.isDisabledContent = false;
          }

        }
        else {
          this.toastrService.error("Contract could not be saved. Please check the data being entered or contact Tech Support");

        }

      }

    });




  }


  ContractSaveOld() {
    //debugger;

    var contracttype = Number(this.selectedContractType.map(({ id }) => id));
    this.sendobject.ContractTypeId = contracttype;
    this.sendobject.TermStartDate = this.EffectiveStart;
    this.sendobject.TermEndDate = this.EffectiveEnd;
    this.sendobject.ContractEndAlertDays = Number(this.formData.EndAlertDays.value);
    this.sendobject.TransportationComment = this.formData.TransportationComment.value;
    this.sendobject.LoadingComment = this.formData.LoadingComment.value;
    this.sendobject.ContractNumber = this.formData.ContractName.value;
    this.sendobject.Code = this.formData.ContractName.value;
    this.sendobject.Description = this.formData.ContractName.value;
    if (contracttype == 3 || contracttype == 4 || contracttype == 5) {
      this.sendobject.LocationId = Number(this.selectedCustomerShipLocation.map(({ id }) => id));
    }
    else {
      this.sendobject.LocationId = Number(this.selectedBusinessPartner.map(({ id }) => id));
    }
    this.sendobject.OrderComment = this.formData.OrderComment.value;
    this.sendobject.ContractComment = this.formData.ContractComment.value;
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.sendobject.CreatedBy = this.authService.currentUserValue.LoginId;
    this.sendobject.CreateDateTimeBrowser = new Date(new Date().toISOString());
    this.sendobject.SetupComplete = false;
    if (this.savedData == null) {
      this.CheckExist();
    }
    else {
      this.Update();
    }
  }

  Update() {
    this.sendobject.Id = this.savedData.id;
    if (this.ContractApprove) {
      this.sendobject.SetupComplete = true;
      this.sendobject.SetupCompleteDateTime = new Date(new Date().toISOString());
    }

    if (this.savedData.setupComplete) {
      this.sendobject.ContractVersion = Number(this.savedData.contractVersion) + 1;
    }
    this.contractService.UpdateContract(this.sendobject)
      .subscribe(res => {
        if (res.message == "Success") {
          this.toastrService.success("Contract saved successfully.");
          this.savedData = res.data;
          this.contractService.savedData = res.data;
          this.contractService.ContractTypeId = this.savedData.contractTypeId;
          this.contractService.ID = this.savedData.id;
          this.isLoading = false;
          this.validate = true;
          // this.settingsA = { disabled: true };
          // this.settingsB = { disabled: true };
          // this.settingsC = { disabled: true };   
          //this.ContractViewModel.Version = String(Number(this.ContractViewModel.Version) + 1);

        }
        else {
          this.toastrService.error("Contract could not be saved. Please check the data being entered or contact Tech Support");
          this.isLoading = false;

        }
      },

        error => {
          this.isLoading = false;
        }
      );
  }
  getModulePermissionForSetup() {
    var ModuleRoleCode = "CNTR.SETC";
    var ClientId = this.authService.currentUserValue.ClientId;
    var UserId = this.authService.currentUserValue.UserId;
    this.contractService.getModulePermission(ModuleRoleCode, ClientId, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          if (res.Data[0].PermissionType == "Read and Modify") {
            //this.ContractSendForApproval = true;
            //this.ContractApproveStatus = false;
            this.IsReadAndWritePermissionSetupComplete = true;
          }
          else {
            //this.ContractSendForApproval = false;
            //this.ContractApproveStatus = true;
            this.IsReadAndWritePermissionSetupComplete = false;
          }
        }
        else {
          //this.ContractApproveStatus = true;
          //this.ContractSendForApproval = false;
          this.IsReadAndWritePermissionSetupComplete = false;
        }
      });
  }

  getModulePermissionForContract() {
    var ModuleRoleCode = "CNTR";
    var ClientId = this.authService.currentUserValue.ClientId;
    var UserId = this.authService.currentUserValue.UserId;
    this.contractService.getModulePermission(ModuleRoleCode, ClientId, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          if (res.Data[0].PermissionType == "Read and Modify") {
            this.IsContractReadWrite = true;
          }
          else {
            this.IsContractReadWrite = false;
          }
        }
        else {
          this.IsContractReadWrite = false;
        }
      });
  }

  SendAproval() {
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.sendobject.ContractTypeId = this.contractService.ContractTypeId;
    this.sendobject.Id = this.contractService.ID;
    this.contractService.SendApproveNotification(this.sendobject)
      .subscribe(res => {
        if (res.message == "Success") {
          this.toastrService.success("Confirmation: A request for approval is sent.");
          return;
        }
      });
  }
  FillLocation() {
    // debugger;
    this.sendobject.ClientId = this.authService.currentUserValue.ClientId;
    this.sendobject.ContractTypeId = Number(this.selectedContractType.map(({ id }) => id)[0]);
    if (this.sendobject.ContractTypeId > 0) {
      this.contractService.getLocationIds(this.sendobject)
        .subscribe(res => {
          if (res.message == "Success") {
            var result = res.data;
            if (this.sendobject.ContractTypeId == 1 || this.sendobject.ContractTypeId == 2) {
              this.itemBusinessPartner = this.itemBusinessPartner.filter(function (array_el) {
                return result.filter(function (anotherOne_el) {
                  return anotherOne_el.id == array_el.id;
                }).length == 0
              });
            }
            else {
              this.itemCustomerShipLocation = this.itemCustomerShipLocation.filter(function (array_el) {
                return result.filter(function (anotherOne_el) {
                  return anotherOne_el.id == array_el.id;
                }).length == 0
              });
            }
          }
        });
    }
    else {
      this.toastrService.clear();
      this.toastrService.error("Please select the Contract Type first.");
    }

  }
  ClearForm() {
    this.selectedContractType.length = 0;
    this.selectedCustomerShipLocation.length = 0;
    this.selectedBusinessPartner.length = 0;
    this.TransportationComment = "";
    this.LoadingComment = "";
    this.ContractName = "";
    this.OrderComment = "";
    this.settingsC = { disabled: false };
    this.settingsB = { disabled: false };
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
