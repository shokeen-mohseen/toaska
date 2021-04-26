import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Contract, ContractViewModel, ContractObjectViewModel, ContractFuelPrice } from '@app/core/models/contract.model';
import { ContractService } from '@app/core/services/contract.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services';
import { DatePipe } from '@angular/common';
import { ContractLineItemsComponent } from './contract-line-items/contract-line-items.component';
import { ContractDefiningCharacteristicsComponent } from './contract-defining-characteristics/contract-defining-characteristics.component';
import { ContractCommonDataService } from '../../../../../core/services/contract-common-data.service';



@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.css'],
  providers: [DatePipe]
})
export class EditContractComponent implements OnInit {
  contractEditform: FormGroup;
  lineItems = true;
  public ContractID: number;
  ContractNumber: string;
  characteristicsPanel = false;
  documentsPanel = false;
  Inactive: boolean = false;
  InactiveNext: boolean = true;
  object: Contract = new Contract();
  sendobject: ContractObjectViewModel = new ContractObjectViewModel();
  ContractViewModel: ContractViewModel = new ContractViewModel();
  FuelPriceViewModel: ContractFuelPrice[];
  IsActiveBusinessPartner: boolean = true;
  ContractName: string;
  LoadingComment: string;
  EffectiveStart: Date;
  EffectiveEnd: Date;
  TransportationComment: string;
  OrderComment: string;
  isLoading: boolean;
  contractStatus: string;
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  itemContractType = [];
  itemCustomerShipLocation = [];
  itemBusinessPartner = [];
  ContractApprove: boolean = false;
  ContractApproveStatus: boolean = false;
  ContractApproveFlag: boolean = false;
  ContractSendForApproval: boolean = false;
  ContractApproveDate: any;
  updateDateTimeServer: Date;
  ApprovedBy: String = "";
  updateBy: string;
  ParentId: number;
  settingsA = {};
  settingsB = {};
  settingsC = {};
  savedData: any;
  selectedContractType = [];
  selectedCustomerShipLocation = [];
  selectedBusinessPartner = [];

  @Input() EditList: ContractViewModel[];
  @ViewChild(ContractLineItemsComponent) cntrlLineItem: ContractLineItemsComponent;
  @ViewChild(ContractDefiningCharacteristicsComponent) CntrtDefine: ContractDefiningCharacteristicsComponent;

  constructor(private toastrService: ToastrService, private formBuilder: FormBuilder, private router: Router,
    private contractService: ContractService, private authService: AuthService, private datepipe: DatePipe,private contractCommon:ContractCommonDataService) {
    this.contractEditform = this.formBuilder.group({
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
  }


  selectedItemsA = [];
  count = 3;

  btnEdit = function () {
    this.router.navigateByUrl('/data-management/contract/edit-contract');
  };

  findContact = function () {
    this.router.navigateByUrl('/data-management/contract/contract-list')
  };

  async ngAfterViewInit() {
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.ContractViewModel = this.EditList[0];
    this.contractService.ID = this.ContractViewModel.ID;
    this.ContractID = this.ContractViewModel.ID;
    this.contractService.ContractTypeId = this.ContractViewModel.ContractTypeId;
    this.getContractType(this.ContractViewModel.ContractTypeId);
    if (this.EditList.length > 1) { this.InactiveNext = false; }
    await this.getModulePermission();
    await this.setModulesToEdit();
    await this.getContract();    
    await this.cntrlLineItem.getContractList();    
    
   
    if (this.ContractViewModel.LocationSetupComplete == false || this.ContractViewModel.LocationStatus == false) {      
      this.toastrService.warning("Warning: This contract is read-only as the Customer Ship to Location or Business Partner is inactive or setup is not done for it.");     
      return false;
    }    
  }

  ngOnInit(): void {
      
      
  }//init() end
  onAddItemA(data: string) {
    this.count++;
    // this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) { }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }

  async selected(selectedEdit: ContractViewModel) {
    this.ContractViewModel = Object.assign({}, selectedEdit);
    this.contractService.ID = this.ContractViewModel.ID;
    this.ContractID = this.ContractViewModel.ID;
    let index = this.EditList.findIndex(x => x.ID === this.ContractViewModel.ID);
    if (index == (this.EditList.length - 1)) { this.InactiveNext = true; }
    else { this.InactiveNext = false; }
    this.contractService.ContractTypeId = this.ContractViewModel.ContractTypeId;
    this.getContractType(this.ContractViewModel.ContractTypeId);
    await this.getContract();
    this.cntrlLineItem.getContractList();
    this.cntrlLineItem.setChildComponent();
    //this.CntrtDefine.fillData();
    if (this.ContractViewModel.LocationSetupComplete == false || this.ContractViewModel.LocationStatus == false) {
      this.toastrService.warning("Warning: This contract is read-only as the Customer Ship to Location or Business Partner is inactive or setup is not done for it.");
      return false;
    }
  }

  Remove(selectedToRemove: ContractViewModel) {
    this.EditList.splice(this.EditList.findIndex(item => item.ID === selectedToRemove.ID), 1)
    // this.selectedCharges.emit(this.EditList);
  }

  async setModulesToEdit() {
    var defaultCount = await this.contractService.getMaxEditedRecordsCount();
    this.EditList = this.EditList.slice(0, defaultCount);
  }

  async getContract() {
    this.ContractViewModel.ClientID = this.authService.currentUserValue.ClientId;
    this.contractStatus = this.ContractViewModel.Status;
    this.contractCommon.InitialContract = null;
    this.contractCommon.FinalContractData = null;

    this.contractService.getContractById(this.ContractViewModel)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.savedData = res.data;
          this.contractService.savedData = JSON.parse(JSON.stringify(res.data));
          this.contractCommon.InitialContract = JSON.parse(JSON.stringify(res.data));
          this.contractCommon.FinalContractData = JSON.parse(JSON.stringify(res.data));


          var data = res.data;
          var contractTypeIds = Number(data.contractTypeId);
          this.ContractName = data.code; //+ "-" + this.selectedContractType.map(({ itemName }) => itemName)[0];
          this.ContractNumber = data.contractNumber;
          this.contractService.LocationID = data.locationId;
          this.contractService.ContractTypeId = contractTypeIds;
          // this.getContractType(contractTypeIds);
          var locationId = Number(data.locationId);
          if (contractTypeIds == 3 || contractTypeIds == 4 || contractTypeIds == 5) {
            this.getCustomerShipLocation(locationId);
            this.getFuelCharge(locationId);
            this.settingsB = { disabled: false };
            this.settingsC = { disabled: true };
          }
          else {
            this.getBusinessPartner(locationId);
            this.settingsB = { disabled: true };
            this.settingsC = { disabled: false };
          }
          this.ParentId = data.parentId == null ? 0 : data.parentId;
          this.LoadingComment = data.loadingComment;
          this.OrderComment = data.orderComment;
          this.TransportationComment = data.transportationComment;
          //this.formData.EffectiveStart.setValue(data.termStartDate);
          // this.formData.EffectiveEnd.setValue(data.termEndDate);
          this.EffectiveStart = new Date(data.termStartDate);
          this.EffectiveEnd = new Date(data.termEndDate);

          this.contractCommon.ContractStartDate = this.EffectiveStart;
          this.contractCommon.ContractEndDate = this.EffectiveEnd;

          this.formData.EndAlertDays.setValue(data.contractEndAlertDays);
          this.ContractApprove = data.setupComplete;
          this.ContractApproveFlag = data.setupComplete;
          this.ContractApproveDate = data.setupCompleteDateTime;
          this.updateDateTimeServer = data.updateDateTimeServer;
          this.updateBy = (data.updatedBy == null || data.updatedBy == "") ? data.createdBy : data.updatedBy;
          if (!this.ContractSendForApproval) {
            this.ContractApproveStatus = true;
          }
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

          await this.CntrtDefine.fillData();
          await this.cntrlLineItem.setChildComponent();
        }
      });

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
    return this.contractEditform.controls;
  }
  onItemSelectCustomerShip(item: any) {
  }

  onItemSelectBusinessPartner(item: any) {
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  getFuelCharge(locationId: number) {
    this.contractService.getFuelPrice(locationId)
      .subscribe(res => {
        if (res.message == "Success") {
          this.FuelPriceViewModel = res.data;
        }
      });

  }
  getContractType(id: number) {

    this.contractService.getContractTypeId(id)
      .subscribe(result => {
        let contractType = [];
        this.selectedContractType = [];
        contractType.push({ "id": result.data.id, "itemName": result.data.name });
        this.itemContractType = contractType;
        //this.itemContractType.push({ "id": result.data.id, "itemName": result.data.name });
        this.selectedContractType.push({ "id": result.data.id, "itemName": result.data.name });
        this.settingsA = {
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

      });
  }

  getCustomerShipLocation(id: number) {
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
   
  SaveOld() {
    if (this.formData.EffectiveEnd.value < this.formData.EffectiveStart.value) {
      this.toastrService.warning("The effective end date should be greater than equal to effective start date.");
      return false;
    }
    var contracttype = Number(this.selectedContractType.map(({ id }) => id));
    this.sendobject.ContractTypeId = contracttype;
    this.sendobject.TermStartDate = this.EffectiveStart;
    this.sendobject.TermEndDate = this.EffectiveEnd;
    this.sendobject.ContractEndAlertDays = Number(this.formData.EndAlertDays.value);
    this.sendobject.TransportationComment = this.formData.TransportationComment.value;
    this.sendobject.LoadingComment = this.formData.LoadingComment.value;
    this.sendobject.ContractNumber = this.ContractNumber;
    this.sendobject.Code = this.formData.ContractName.value;
    this.sendobject.SetupComplete = this.ContractApprove;
    if (this.ContractApprove) {
      this.sendobject.SetupCompleteDateTime = new Date(new Date().toISOString());
    }
    if (this.ContractApproveFlag) {
      this.sendobject.ContractVersion = Number(this.ContractViewModel.Version) + 1;
      this.sendobject.SetupComplete = false;
      this.sendobject.SetupCompleteDateTime = null;
      // this.sendobject.Id = this.ContractViewModel.ID;
    }
    else {
      this.sendobject.ContractVersion = Number(this.ContractViewModel.Version);
      this.sendobject.Id = this.ContractViewModel.ID;
    }

    this.sendobject.ParentId = this.ParentId == 0 ? this.ContractViewModel.ID : this.ParentId;
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
    this.sendobject.UpdatedBy = this.authService.currentUserValue.LoginId;
    this.updateDateTimeServer = new Date(new Date().toISOString());
    this.sendobject.CreatedBy = this.authService.currentUserValue.LoginId;
    this.sendobject.CreateDateTimeBrowser = new Date(new Date().toISOString());
    if (this.ContractApproveFlag) {
      this.contractService.saveContract(this.sendobject)
        .subscribe(async res => {
          if (res.message == "Success") {
            this.toastrService.success("Contract saved successfully");
            this.savedData = res.data;
            this.ContractViewModel.Version = String(Number(this.ContractViewModel.Version) + 1);
            this.ContractViewModel.ID = this.savedData.id;
            this.contractService.savedData = res.data;
            this.contractService.ID = this.savedData.id;

            this.ContractApprove = false;
            this.ContractApproveStatus = false;
            this.ContractApproveDate = "";
            this.ApprovedBy = "";
            this.ContractApproveFlag = false;
            await this.getContract();
            this.cntrlLineItem.getContractList();
            this.cntrlLineItem.setChildComponent();
            this.CntrtDefine.fillData();
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
    else {
      this.contractService.UpdateContract(this.sendobject)
        .subscribe(res => {
          if (res.message == "Success") {
            this.toastrService.success("Contract saved successfully");
            this.savedData = res.data;
            if (this.savedData.setupComplete) {
              this.ContractApproveStatus = true;
              this.ContractApproveFlag = true;
              this.ContractApprove = true;
            }
            this.ContractViewModel.Version = res.data.contractVersion
            
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
  }

  Save() {
    
    if (this.formData.EffectiveEnd.value < this.formData.EffectiveStart.value) {
      this.toastrService.warning("The effective end date should be greater than equal to effective start date.");
      return false;
    }
    this.contractCommon.InitialContract.UpdateDateTimeBrowser = new Date();
    this.contractCommon.InitialContract.CreateDateTimeBrowser = new Date();
    this.contractCommon.FinalContractData.UpdateDateTimeBrowser = new Date();
    this.contractCommon.FinalContractData.CreateDateTimeBrowser = new Date();
    this.contractCommon.FinalContractData.SetupComplete = this.ContractApprove;

     if (this.ContractApprove) {
        this.contractCommon.FinalContractData.SetupCompleteDateTime = new Date(new Date().toISOString());
    }

    this.contractCommon.FinalContractData.TermStartDate = this.EffectiveStart;
    this.contractCommon.FinalContractData.TermEndDate = this.EffectiveEnd;
    this.contractCommon.FinalContractData.TermStartDateStr = this.contractCommon.convertDatetoStringDate(this.EffectiveStart);
    this.contractCommon.FinalContractData.TermEndDateStr = this.contractCommon.convertDatetoStringDate(this.EffectiveEnd);

    this.contractCommon.FinalContractData.ClientId = this.authService.currentUserValue.ClientId;
    this.contractCommon.FinalContractData.UpdatedBy = this.authService.currentUserValue.LoginId;   
    this.contractCommon.FinalContractData.CreatedBy = this.authService.currentUserValue.LoginId;

  
    this.contractCommon.InitialContract.TermStartDateStr = this.contractCommon.convertDatetoStringDate(this.contractCommon.InitialContract.TermStartDate);
    this.contractCommon.InitialContract.TermEndDateStr = this.contractCommon.convertDatetoStringDate(this.contractCommon.InitialContract.TermEndDate);



    this.contractService.SaveAndUpdateContractDetails({ InitialContract: this.contractCommon.InitialContract, UpdatedContract : this.contractCommon.FinalContractData }).subscribe(result => {

      this.isLoading = false;  
      if (result.message == "Success") {
        if (result.data.status != "Error") {
          if (result.data.status == "Insert") {
            this.toastrService.success("Contract new version created successfully.");
            if (this.contractCommon.FinalContractData.id != undefined && this.contractCommon.FinalContractData.id > 0 && this.EditList != undefined && this.EditList.length > 0) {
              var currentIndex = this.EditList.findIndex(x => Number(x.ID) == Number(this.contractCommon.FinalContractData.id));

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
            this.EditList.push(newItems);
            this.selected(newItems);
              
          }
          else if (result.data.status == "Update") {
            this.toastrService.success("Contract updated successfully");
            var items = this.EditList.find(x => x.ID == this.contractCommon.FinalContractData.id);
            this.selected(items);
          }
        }
        else {
          this.toastrService.error("Contract could not be saved. Please check the data being entered or contact Tech Support");
         
        }

      }

    });

    

  }

 async getModulePermission() {
    var ModuleRoleCode = "CNTR.SETC";
    var ClientId = this.authService.currentUserValue.ClientId;
    var UserId = this.authService.currentUserValue.UserId;
    this.contractService.getModulePermission(ModuleRoleCode, ClientId, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          if (res.Data[0].PermissionType == "Read and Modify") {
            this.ContractSendForApproval = true;
          }
          else {
            this.ContractSendForApproval = false;
          }
        }
        else {
          this.ContractApproveStatus = true;
          this.ContractSendForApproval = false;
        }
      });
  }
  next() {
    let index = this.EditList.findIndex(x => x.ID === this.ContractViewModel.ID);
    let objectcontract = new ContractViewModel();
    objectcontract = this.EditList[index + 1];
    this.selected(objectcontract);
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
  getBusinessPartner(id: number) {
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

}
