import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from '@app/core/services/contract.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '@app/core';
import { Contract, ContractObjectViewModel, ContractViewModel } from '@app/core/models/contract.model';
import { ToastrService } from 'ngx-toastr';
import { ContractLineItemsComponent } from '../edit-contract/contract-line-items/contract-line-items.component';


@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {
  contractform: FormGroup;
  ContractNumber: any;
  lineItems = true;
  error: string;
  characteristicsPanel = false;
  ContractApprove: boolean = false;
  ContractApproveStatus: boolean = true;
  ContractApproveDate: any;
  documentsPanel = false;
  isDisabledContent: boolean = true;
  IsActiveCSL: boolean = true;
  IsActiveBusinessPartner: boolean = true;
  ContractName: string;
  LoadingComment: string;
  TransportationComment: string;
  OrderComment: string;
  isLoading: boolean;
  isLoadingNext: boolean;
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  validate: boolean = true;
  object: Contract = new Contract();
  sendobject: ContractObjectViewModel = new ContractObjectViewModel();
  disable: string;
  //@Output('savedData') savedData = new EventEmitter<any>();
  savedData: any;
  @ViewChild(ContractLineItemsComponent) lineItemsComp: ContractLineItemsComponent;
  ContractViewModel: ContractViewModel = new ContractViewModel();
  constructor(private toastrService: ToastrService, private formBuilder: FormBuilder, private router: Router, private contractSerive: ContractService, private authService: AuthService) {
   
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
    this.ContractApproveDate = "";
  }
  itemContractType = [];
  itemCustomerShipLocation = [];
  itemBusinessPartner = [];
  //itemListA = [];
  //itemListB = [];

  settingsA = {};
  settingsB = {};
  settingsC = {};


  selectedContractType = [];
  selectedCustomerShipLocation = [];
  selectedBusinessPartner = [];

  count = 3;

  btnEdit = function () {
    this.router.navigateByUrl('/data-management/contract/edit-contract');
  };

  findContact = function () {
    this.router.navigateByUrl('/data-management/contract/contract-list')
  };

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingNext = false;
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.contractSerive.LocationID = 0;
    this.getContractType();
    this.getCustomerShipLocation();
    this.getBusinessPartner();
    // for searchable dropdown   
    // searchable dropdown end
  }//init() end
  onAddItemA(data: string) {
    this.count++;
    //this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedContractType.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
   // this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedCustomerShipLocation.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
   // console.log(item);
    //console.log(this.selectedItemsA);
    //console.log(this.selectedItemsB);
    this.setDropDown();
  }
  OnItemDeSelect(item: any) {
    //console.log(item);
    //console.log(this.selectedItemsA);
    //console.log(this.selectedItemsB);
    this.setDropDown();
  }
  onSelectAll(items: any) {
    //console.log(items);
    this.setDropDown();
  }
  onDeSelectAll(items: any) {
    //console.log(items);
    this.setDropDown();
  }
  onItemSelectCustomerShip(item: any) {
    if (this.selectedCustomerShipLocation.length >= 1) {
      this.ContractName = this.selectedCustomerShipLocation.map(({ itemName }) => itemName)[0];
      var locationId = Number(this.selectedCustomerShipLocation.map(({ id }) => id));
      this.selectedBusinessPartner.length = 0;
      this.settingsC = { disabled: true };
      this.settingsB = { disabled: false };
      this.SetComments(locationId);
    }
  }

  onItemSelectBusinessPartner(item: any) {
    if (this.selectedBusinessPartner.length >= 1) {
      this.ContractName = this.selectedBusinessPartner.map(({ itemName }) => itemName)[0];
      var locationId = Number(this.selectedBusinessPartner.map(({ id }) => id));
      this.selectedCustomerShipLocation.length = 0;
      this.SetComments(locationId);
      this.settingsC = { disabled: false };
      this.settingsB = { disabled: true };
    }
  }

  setDropDown() {
    var contracttype = Number(this.selectedContractType.map(({ id }) => id));
    this.contractSerive.ContractTypeId = contracttype;
    if (contracttype == 1 || contracttype == 2 || contracttype == 3) {
      this.settingsC = { disabled: true };
      this.settingsB = { disabled: false };
      this.selectedBusinessPartner.length = 0;
    }
    else if (contracttype == 4 || contracttype == 5) {
      this.settingsC = { disabled: false };
      this.settingsB = { disabled: true };
      this.selectedCustomerShipLocation.length = 0;
    }
    else {
      this.settingsC = { disabled: false };
      this.settingsB = { disabled: false };
      this.selectedCustomerShipLocation.length = 0;
      this.selectedBusinessPartner.length = 0;
      this.ContractName = "";
    }   

  }
  onContractApproveChanged(value: boolean) {
    this.ContractApprove = value;
  }
  get formData() {
    return this.contractform.controls;
  }

  SetComments(id: number) {
    this.contractSerive.getCommentsLocation(id)
      .subscribe(result => {
        if (result.message == "Success") {
          this.TransportationComment = result.data.transportationComment;
          this.LoadingComment = result.data.loadingComment;
          this.OrderComment = result.data.orderComment;
        }
      });
    this.contractSerive.LocationID = id;
    this.lineItemsComp.getContractList();
  }

  getContractType() {
    this.contractSerive.getContractTypeList(this.object)
      .subscribe(result => {
        this.itemContractType = result;
        this.settingsA = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1
        };
      });
  }

  getCustomerShipLocation() {
    this.object.LocationTypeId = 1004;
    this.contractSerive.getCustomerShipLocation(this.object)
      .subscribe(result => {
        this.itemCustomerShipLocation = result;
        this.settingsB = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1
        };
      });
  }
  getBusinessPartner() {
    this.object.LocationTypeId = 1005;
    this.contractSerive.getCustomerShipLocation(this.object)
      .subscribe(result => {
        this.itemBusinessPartner = result;
        this.settingsC = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1
        };
      });
  }

  Save() {
    if (this.selectedContractType.length == 0) {
      this.toastrService.warning("Please fill all mandatory fields to save.");
      return false;
    }
    else if (this.formData.EffectiveStart.value == null || this.formData.EffectiveStart.value == "") {
      this.toastrService.warning("Please fill all mandatory fields to save.");
      return false;
    }
    else if (this.formData.EffectiveEnd.value == null || this.formData.EffectiveEnd.value == "") {
      this.toastrService.warning("Please fill all mandatory fields to save.");
      return false;
    }
    else if (this.ContractName == null || this.ContractName == "") {
      this.toastrService.warning("Please fill all mandatory fields to save.");
      return false;
    }
    this.isLoading = true;
    this.ContractSave();
  }

  ContractNext() {
    if (this.selectedContractType.length == 0) {
      this.toastrService.warning("Please fill all mandatory fields to save.");
      return false;
    }
    else if (this.formData.EffectiveStart.value == null || this.formData.EffectiveStart.value == "") {
      this.toastrService.warning("Please fill all mandatory fields to save.");
      return false;
    }
    else if (this.formData.EffectiveEnd.value == null || this.formData.EffectiveEnd.value == "") {
      this.toastrService.warning("Please fill all mandatory fields to save.");
      return false;
    }
    else if (this.ContractName == null || this.ContractName == "") {
      this.toastrService.warning("Please fill all mandatory fields to save.");
      return false;
    }
    this.isLoadingNext = true;
    this.ContractSave();
  }

  ContractSave() {
    //debugger;
  
    var contracttype = Number(this.selectedContractType.map(({ id }) => id));
    this.sendobject.ContractTypeId = contracttype;
    this.sendobject.TermStartDate = this.formData.EffectiveStart.value;
    this.sendobject.TermEndDate = this.formData.EffectiveEnd.value;
    this.sendobject.ContractEndAlertDays = Number(this.formData.EndAlertDays.value);
    this.sendobject.TransportationComment = this.formData.TransportationComment.value;
    this.sendobject.LoadingComment = this.formData.LoadingComment.value;
    this.sendobject.ContractNumber = this.formData.ContractName.value;
    this.sendobject.Code = this.formData.ContractName.value;
    this.sendobject.Description = this.formData.ContractName.value;
    if (contracttype == 1 || contracttype == 2 || contracttype == 3) {
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
    this.contractSerive.saveContract(this.sendobject)
      .subscribe(res => {
       // debugger;
        if (res.message == "Success") {
          this.toastrService.success("Contract Saved");
          this.savedData = res.data;
          this.contractSerive.savedData = res.data;
          this.isLoading = false;
          this.validate = true;
          this.settingsA = { disabled: true };
          this.settingsB = { disabled: true };
          this.settingsC = { disabled: true };
          this.ContractApproveStatus = false;
          this.isDisabledContent = false;
         // this.contractform.invalid = true;
          //this.contractform.reset();
         // this.ClearForm();         
        }
        else {
          this.toastrService.error("Invalid data");
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
  SendAproval() {
    if (this.ContractApprove != true) {
      this.toastrService.warning("Please check for Approve");
      return;
    }
    else {
      this.ContractApprove = true;
      this.ContractViewModel.ContractTypeId = Number(this.selectedContractType.map(({ id }) => id));
      this.ContractViewModel.ID = this.savedData.id;
      this.contractSerive.setContractApprove(this.ContractViewModel)
        .subscribe(result => {
          this.ContractApproveStatus = true;
          this.ContractApproveDate = new Date(new Date().toISOString());
          this.toastrService.success("Contract is Approved");
          return;
        }
        );

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
