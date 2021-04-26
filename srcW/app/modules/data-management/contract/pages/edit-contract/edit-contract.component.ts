import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Contract, ContractViewModel, ContractObjectViewModel, ContractFuelPrice } from '@app/core/models/contract.model';
import { ContractService } from '@app/core/services/contract.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.css'],
  providers: [DatePipe]
})
export class EditContractComponent implements OnInit {
  contractEditform: FormGroup;
  lineItems = true;
  characteristicsPanel = false;
  documentsPanel = false;
  object: Contract = new Contract();
  sendobject: ContractObjectViewModel = new ContractObjectViewModel();
  ContractViewModel: ContractViewModel = new ContractViewModel();
  FuelPriceViewModel: ContractFuelPrice[];
  IsActiveCSL: boolean = true;
  IsActiveBusinessPartner: boolean = true;
  ContractName: string;
  LoadingComment: string;
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
  ContractSendForApproval: boolean = false;
  ContractApproveDate: any;
  updateDateTimeServer: Date;
  ApprovedBy: String = "";
  updateBy: string;  
  settingsA = {};
  settingsB = {};
  settingsC = {};
  savedData: any;
  selectedContractType = [];
  selectedCustomerShipLocation = [];
  selectedBusinessPartner = [];
  
  @Input() EditList: ContractViewModel[];

  constructor(private toastrService: ToastrService, private formBuilder: FormBuilder, private router: Router, private contractSerive: ContractService, private authService: AuthService, private datepipe: DatePipe) {
      this.contractEditform = this.formBuilder.group({
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

  ngOnInit(): void {
    
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.ContractViewModel = this.EditList[0];   
    this.getContract();    
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
  }//init() end
  onAddItemA(data: string) {
    this.count++;
   // this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {}
  OnItemDeSelect(item: any) {}
  onSelectAll(items: any) {}
  onDeSelectAll(items: any) { }

  selected(selectedEdit: ContractViewModel) {
    this.ContractViewModel = Object.assign({}, selectedEdit);
  }

  Remove(selectedToRemove: ContractViewModel) {
    this.EditList.splice(this.EditList.findIndex(item => item.ID === selectedToRemove.ID), 1)
   // this.selectedCharges.emit(this.EditList);
  }

  getContract() {
    this.ContractViewModel.ClientID = this.authService.currentUserValue.ClientId;
    this.contractStatus = this.ContractViewModel.Status;
    this.contractSerive.getContractById(this.ContractViewModel)
      .subscribe(res => {
        if (res.message == "Success") {
          this.savedData = res.data;
          this.contractSerive.savedData = res.data;
          var data = res.data;
          this.ContractName = data.contractNumber;
          var contractTypeIds = Number(data.contractTypeId);
          this.contractSerive.ContractTypeId = contractTypeIds;
          this.getContractType(contractTypeIds);
          var locationId = Number(data.locationId);         
          if (contractTypeIds == 1 || contractTypeIds == 2 || contractTypeIds == 3) {
            this.getCustomerShipLocation(locationId);
            this.getFuelCharge(locationId);
          }
          else {
            this.getBusinessPartner(locationId);            
          }
          this.LoadingComment = data.loadingComment;
          this.OrderComment = data.orderComment;
          this.TransportationComment = data.transportationComment;
          this.formData.EffectiveStart.setValue(data.termStartDate);
          this.formData.EffectiveEnd.setValue(data.termEndDate);
          this.formData.EndAlertDays.setValue(data.contractEndAlertDays);
          this.ContractApprove = data.setupComplete;          
          this.ContractApproveStatus = data.setupComplete;
          this.ContractApproveDate = data.setupCompleteDateTime;
          this.updateDateTimeServer = data.updateDateTimeServer;
          this.updateBy = (data.updatedBy == null || data.updatedBy == "") ? data.createdBy : data[0].updatedBy;
          this.getModulePermission();
        }
      });

  }
  onContractApproveChanged(value: boolean) {
    this.ContractApprove = value;
    if (value) {
      var date = new Date().toISOString();
      this.ApprovedBy = "By : " + this.authService.currentUserValue.LoginId;
      this.ContractApproveDate = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm a');
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
    this.contractSerive.getFuelPrice(locationId)
      .subscribe(res => {
        if (res.message == "Success") {
          this.FuelPriceViewModel = res.data;
        }
      });

  }
  getContractType(id: number) { 
    this.contractSerive.getContractTypeId(id)
      .subscribe(result => {
        this.itemContractType.push({ "id": result.data.id, "itemName": result.data.name });
        this.settingsA = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: true

        };
        this.selectedContractType.push({ "id": result.data.id, "itemName": result.data.name });
       
      });
  }

  getCustomerShipLocation(id: number) { 
    this.contractSerive.getCommentsLocation(id)
      .subscribe(result => {
        this.itemCustomerShipLocation.push({ "id": result.data.id, "itemName": result.data.id + ' - ' + result.data.name });
        this.settingsB = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: true
        };        
        this.selectedCustomerShipLocation.push({ "id": result.data.id, "itemName": result.data.id + ' - ' + result.data.name }); 
        
      });
  }

  Save() {
    var contracttype = Number(this.selectedContractType.map(({ id }) => id));
    this.sendobject.ContractTypeId = contracttype;
    this.sendobject.TermStartDate = this.formData.EffectiveStart.value;
    this.sendobject.TermEndDate = this.formData.EffectiveEnd.value;
    this.sendobject.ContractEndAlertDays = Number(this.formData.EndAlertDays.value);
    this.sendobject.TransportationComment = this.formData.TransportationComment.value;
    this.sendobject.LoadingComment = this.formData.LoadingComment.value;
    this.sendobject.ContractNumber = this.formData.ContractName.value;
    this.sendobject.Code = this.formData.ContractName.value;
    if (this.ContractApproveStatus) {
      this.sendobject.ContractVersion = Number(this.ContractViewModel.Version) + 1;
      this.sendobject.Id = this.ContractViewModel.ID;
    }
    else {
      this.sendobject.ContractVersion = Number(this.ContractViewModel.Version);
    }
    this.sendobject.SetupComplete = this.ContractApprove;
    if (this.ContractApprove) {
      this.sendobject.SetupCompleteDateTime = new Date(new Date().toISOString());
    }
    this.sendobject.ParentId = this.ContractViewModel.ID;
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
    this.sendobject.UpdatedBy = this.authService.currentUserValue.LoginId;
    this.updateDateTimeServer = new Date(new Date().toISOString());
    this.sendobject.CreatedBy = this.authService.currentUserValue.LoginId;
    this.sendobject.CreateDateTimeBrowser = new Date(new Date().toISOString());
    if (this.ContractApproveStatus) {
      this.contractSerive.saveContract(this.sendobject)
        .subscribe(res => {
          if (res.message == "Success") {
            this.toastrService.success("Contract Saved");
            //this.savedData = res.data;
            this.ContractViewModel.Version = String(Number(this.ContractViewModel.Version) + 1);

          }
          else {
            this.toastrService.error("Invalid data");
            this.isLoading = false;

          }
        },

          error => {
            this.isLoading = false;
          }
        );
    }
    else {
    this.contractSerive.UpdateContract(this.sendobject)
      .subscribe(res => {
        if (res.message == "Success") {
          this.toastrService.success("Contract Saved");
          //this.savedData = res.data;
          this.ContractViewModel.Version = String(Number(this.ContractViewModel.Version) + 1);
         
        }
        else {
          this.toastrService.error("Invalid data");
          this.isLoading = false;
         
        }
      },

        error => {
          this.isLoading = false;
        }
      );
    }
  }

  getModulePermission() {    
    var ModuleRoleCode = "CNTR.SETC";
    var ClientId = this.authService.currentUserValue.ClientId;
    this.contractSerive.getModulePermission(ModuleRoleCode, ClientId,this.authService.currentUserValue.UserId)
      .subscribe(res => {
        
        if (res.Message == "Success") {         
          if (res.Data[0].PermissionType == "Read and Modify") {
            this.ContractApproveStatus = false;
            this.ContractSendForApproval = true;
          }
          else {
            this.ContractApproveStatus = true;
            this.ContractSendForApproval = false;
          }
        }
        else {
          this.ContractApproveStatus = true;
          this.ContractSendForApproval = false;
        }
      });
  }
  SendAproval() {
    if (this.ContractApprove != true) {
     // this.toastrService.warning("Please check for Approve");
      return;
    }
    else {
     // this.toastrService.warning("Please check for Approve");
      return;
    }
    //else {
    //  this.ContractApprove = true;
    //  this.contractSerive.setContractApprove(this.ContractViewModel)
    //    .subscribe(result => {
    //      this.ContractApproveStatus = true;
    //      this.ContractApproveDate = new Date(new Date().toISOString());
    //      this.toastrService.success("Contract is Approved");
    //      return;
    //    }
    //    );

   // }
   

  }
  getBusinessPartner(id: number) {   
    this.contractSerive.getCommentsLocation(id)
      .subscribe(result => {
        this.itemBusinessPartner.push({ "id": result.data.id, "itemName": result.data.id + ' - ' + result.data.name });
        this.selectedBusinessPartner.push({ "id": result.data.id, "itemName": result.data.id + ' - ' + result.data.name });
        this.settingsC = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: true
        };        
        this.itemBusinessPartner = result.data.map(r => ({ id: r.id, itemName: r.id + ' - ' + r.name }));
       
      });
  }

}
