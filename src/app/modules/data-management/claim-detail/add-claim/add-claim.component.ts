import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Claim } from '@app/core/models/claim.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../core';
import { ClaimService } from '../../../../core/services/claim.service';
import { ChargeDetailComponent } from '../charge-detail/charge-detail.component';
import { ClaimModel } from '../../../../core/models/claim.model';
import { OrdermanagementCommonOperation } from '../../../../core/services/order-management-common-operations.service';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-claim',
  templateUrl: './add-claim.component.html',
  styleUrls: ['./add-claim.component.css']
})
export class AddClaimComponent implements OnInit {
  public dateFormat: String = "MM/dd/yyyy";

  date6: Date;
  modalRef: NgbModalRef;

  constructor(public router: Router, public modalService: NgbModal,
    private auth: AuthService, private claimservice: ClaimService,
    private orderCommonService: OrdermanagementCommonOperation,
    private toastrService: ToastrService) { }
  ClaimObject: Claim = new Claim();
  ClaimStatusList = [];
  ClaimStatusSelected = [];
  settingsClaimSatus = {};
  ClaimForList = [];
  ClaimForSelected = [];
  settingsClaimFor = {};
  CustomerBillingList = [];
  CustomerList = [];
  CustomerBillingSelected = [];
  settingsCustomer = {};
  BusinessPartnerList = [];
  BusinessList = [];
  BusinessPartnerSelected = [];
  settingsBP = {};
  SubscriptionList = [];
  ShipnoList = [];
  SelectedSubscription = [];
  OrderList = [];
  SelectedOrder = [];
  OrdershipIDList = [];
  @ViewChild(ChargeDetailComponent) private chargeDetailComponent: ChargeDetailComponent;
  selectedItemsA = [];
  settingsShipOrder = {};
  settingsOrder = {};
  ClaimdatecalendarDate: Date;
  FilterData: any = [];
  ClaimModel: ClaimModel = new ClaimModel();
  Invoicenumber: string;
  ShipmentID: number;
  OrderID: number;
  @Input() ClaimData: any;
  ControlPermissions = [];
  hasClaimApproval: boolean = false;
  hasClaimSetupAndNotify: boolean = false;
  hasClaimSaveUpdate: boolean = false;
  @Input() buttonBar: any;


  // Merge Edit code here
  ClaimforEdit: any[] = [];
  SelectedClaimId: number = 0;

  isEditListShow: boolean = false;

  IsApprovedDisabled: boolean = true;
  IsSetupNotifyDisabled: boolean = true;
  ClaimdateDisable: boolean = false;
  SelectedClaimIdTemp: number = 0;
  IsAddClaim: boolean = false;
  IsLeftList: boolean = true;
  CurrentEditListItemIndex: number = 0;
  LocalClaimID: number = 0;
  flagStatus: boolean = false;
  saveStatus: boolean = true;
  isCompleteInMas: boolean = false;

  ngOnInit(): void {
    this.buttonBar.disableAction('delete');
    this.buttonBar.disableAction('export');
    this.ClaimObject.ClientId = this.auth.currentUserValue.ClientId;
    this.ClaimModel.UpdatedBy = this.auth.currentUserValue.LoginId;
    this.ClaimdatecalendarDate = this.setDateMMddyyyy(new Date());
    this.ClaimModel.ClientID = Number(this.auth.currentUserValue.ClientId);
    this.ClaimModel.FromshipdatecalendarDate = this.orderCommonService.convertDatetoStringDate(this.ClaimdatecalendarDate);
    this.ClaimModel.ToshipdatecalendarDate = this.orderCommonService.convertDatetoStringDate(this.ClaimdatecalendarDate);

    this.settingsClaimSatus = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsClaimFor = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1
    };
    this.settngsetupdisabled();
  }
  ngAfterViewInit(): void {
    this.GetClaimStatus();
    this.GetClaimFor();
    this.CustomerBillingEntity();
    this.BusinessPartnerBillingEntity();
    this.GetShipmentDetails();
    this.GetOrderDetails();

    //Merge Edit code here
    if (this.claimservice.ClaimforEdit != undefined && this.claimservice.ClaimforEdit.length > 0) {
      
      this.ClaimforEdit = this.claimservice.ClaimforEdit;
      if (this.ClaimforEdit.length > 0) {
        this.IsLeftList = false;
        this.isEditListShow = true;
        this.SelectedClaimId = this.ClaimforEdit[0].ClaimId;
        this.SelectedClaimIdTemp = this.ClaimforEdit[0].ClaimId;
        this.ClaimModel.ClaimID = this.SelectedClaimId;
        setTimeout(() => {
          this.getClaimDataByClaimId();
        }, 1000);
        this.chargeDetailComponent.Set();


        //this.Allsettngsetupdisabled();
        this.ClaimdateDisable = true;

      }
    }
    else
      this.isEditListShow = false;

    this.getPageControlsPermissions();

  }

  onItemSelect(item: any) {
    if (!!item.id) {
      this.ClaimModel.ClaimStatusID = Number(item.id);
    }
  }
  OnItemDeSelect(item: any) {
    this.ClaimModel.ClaimStatusID = 0;
  }

  onItemSelectCustomer(item: any) {
    if (!!item.id) {
      this.ClaimModel.LocationId = Number(item.id);
    }
  }
  onItemDeSelectCustomer(item: any) {

    this.ClaimModel.LocationId = Number(0);

  }
  onItemSelectBP(item: any) {
    if (!!item.id) {
      this.ClaimModel.LocationId = Number(item.id);
    }
  }
  onItemDeSelectBP(item: any) {
    this.ClaimModel.LocationId = Number(0);
  }
  GetClaimStatus() {
    this.ClaimStatusSelected = [];
    this.claimservice.GetClaimStatus(this.ClaimObject)
      .subscribe(res => {
        this.ClaimStatusList = res;
        let ClaimStatus = res.find(d => d.Code == "New Claim");
        this.ClaimStatusSelected.push({ "id": ClaimStatus.id, "itemName": ClaimStatus.itemName });
        this.ClaimModel.ClaimStatusID = ClaimStatus.id;
      });
  }
  CustomerBillingEntity() {
    this.claimservice.GetBillingEntityForCustomer(this.auth.currentUserValue.ClientId)
      .subscribe(res => {
        this.CustomerList = res;
        this.CustomerBillingList = res.map(r => ({ id: r.id, itemName: r.name }));
      });
  }
  BusinessPartnerBillingEntity() {
    this.claimservice.GetBillingEntityForBP(this.auth.currentUserValue.ClientId)
      .subscribe(res => {
        this.BusinessList = res;
        this.BusinessPartnerList = res.map(r => ({ id: r.id, itemName: r.name }));
      });
  }

  GetShipmentDetails() {
    this.SelectedSubscription = [];
    this.SubscriptionList = [];
    this.ShipnoList = [];
    this.claimservice.GetShipmentNumberDetails(this.ClaimModel)
      .subscribe(res => {
        if (res.message == "Success") {
          var data = [];
          data = res.data;
          this.ShipnoList = res.data;;
          this.SubscriptionList = data.map(r => ({ id: r.ID, itemName: r.Name }));
        }
      });
  }
  GetOrderDetails() {
    this.SelectedOrder = [];
    this.OrdershipIDList = [];
    this.OrderList = [];
    this.claimservice.GetOrderNumberDetails(this.ClaimModel)
      .subscribe(res => {
        if (res.message == "Success") {
          var data = [];
          data = res.data;
          this.OrdershipIDList = data;
          this.OrderList = data.map(r => ({ id: r.ID, itemName: r.Name }));
        }
      });
  }

  onItemClaimForSelect(item: any) {

    if (!!item.id) {
      this.GetClaimFilterData(0, 0, 0, 0, 0);
      this.ClaimModel.ClaimForID = Number(item.id);

      if (item.Code === "Customer") {
        this.settngsetupEnableCustomer();
        this.SelectedOrder = [];
        this.SelectedSubscription = [];
        this.BusinessPartnerSelected = [];
        this.CustomerBillingSelected = [];
        document.getElementById('Customerbill').setAttribute('required', null);
        document.getElementById('Businesspart').removeAttribute('required');
        document.getElementById('Ordno').removeAttribute('required');
        document.getElementById('Shipno').removeAttribute('required');
      }
      if (item.Code === "Business Partner") {
        this.settngsetupEnableBusness();
        this.SelectedOrder = [];
        this.SelectedSubscription = [];
        this.BusinessPartnerSelected = [];
        this.CustomerBillingSelected = [];
        document.getElementById('Businesspart').setAttribute('required', null);
        document.getElementById('Customerbill').removeAttribute('required');
        document.getElementById('Ordno').removeAttribute('required');
        document.getElementById('Shipno').removeAttribute('required');
      }
      if (item.Code === "Order-AR") {
        this.settngsetupEnableOrder();
        this.SelectedOrder = [];
        this.SelectedSubscription = [];
        this.BusinessPartnerSelected = [];
        this.CustomerBillingSelected = [];
        document.getElementById('Shipno').setAttribute('required', null);
        document.getElementById('Ordno').setAttribute('required', null);
        document.getElementById('Customerbill').removeAttribute('required');
        // document.getElementById('Ordno').removeAttribute('required');
        document.getElementById('Businesspart').removeAttribute('required');
        this.GetShipmentDetails();
        this.GetOrderDetails();
      }
      if (item.Code === "Shipment-AP") {
        this.settngsetupEnableShipOrder();
        this.SelectedOrder = [];
        this.SelectedSubscription = [];
        this.BusinessPartnerSelected = [];
        this.CustomerBillingSelected = [];
        document.getElementById('Shipno').setAttribute('required', null);
        document.getElementById('Customerbill').removeAttribute('required');
        document.getElementById('Ordno').removeAttribute('required');
        document.getElementById('Businesspart').removeAttribute('required');
        this.GetShipmentDetails();
      }
    }
    else {
      this.settngsetupdisabled();
    }
    this.ClaimModel.ClaimID = 0;
    this.saveStatus = true;
  }
  OnItemClaimForDeSelect(item: any) {
    this.ClaimModel.ClaimForID = Number(0);
    this.SelectedOrder = [];
    this.SelectedSubscription = [];
    this.BusinessPartnerSelected = [];
    this.CustomerBillingSelected = [];
    this.ShipmentID = Number(0);
    this.OrderID = Number(0);
  }

  GetClaimFor() {
    this.claimservice.GetClaimFor(this.ClaimObject)
      .subscribe(res => {
        this.ClaimForList = res;
        this.ClaimForList.sort((a, b) => a.itemName.localeCompare(b.itemName));
      });
  }
  setDateMMddyyyy(date: Date) {
    return new Date(`${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`);
  }

  settngsetupdisabled() {
    this.settingsOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsShipOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsCustomer = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
    this.settingsBP = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
  }

  settngsetupEnableCustomer() {
    this.settingsOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsShipOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsCustomer = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: false
    };
    this.settingsBP = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
  }

  settngsetupEnableBusness() {
    this.settingsOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsShipOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsCustomer = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
    this.settingsBP = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: false
    };
  }

  settngsetupEnableOrder() {
    this.settingsOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: false
    };
    this.settingsShipOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: false
    };
    this.settingsCustomer = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
    this.settingsBP = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
  }

  settngsetupEnableShipOrder() {
    this.settingsOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsShipOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: false
    };
    this.settingsCustomer = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
    this.settingsBP = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
  }

  filterDate(data: any) {

    var outP = data;
    this.ClaimModel.FromshipdatecalendarDate = outP.FromshipdatecalendarDate == undefined ? '' : this.orderCommonService.convertDatetoStringDate(outP.FromshipdatecalendarDate);
    this.ClaimModel.ToshipdatecalendarDate = outP.ToshipdatecalendarDate == undefined ? '' : this.orderCommonService.convertDatetoStringDate(outP.ToshipdatecalendarDate);
    this.GetShipmentDetails();
    this.GetOrderDetails();
  }
  GetClaimFilterData(ShipmentID: number, ClientID: number, OrderID: number, ClaimID: number, ClaimFor: number) {
    this.FilterData = [];

    this.claimservice.GetClaimFilterData(Number(ShipmentID), Number(ClientID), Number(OrderID), Number(ClaimID), Number(ClaimFor))
      .subscribe(res => {

        if (res.data.length > 0) {
          this.FilterData = [];
          var vv = res.data;
          res.data.forEach((value, index) => {
            this.FilterData.push({
              selectRow: '', Buspartner: value.BusinessPartnerLocation, Customer: value.CustomerLocation,
              Locfro: value.FromLocation, Tolocation: value.ToLocation, Material: value.M_ChargeName,
              Shipment: value.QuantityFilled, Invoiceamount: value.InvoicedAmount, Claimqunatity: value.ClaimedQuantity,
              Claimamount: value.ClaimAmount, FReamount: value.RecommendedAmount, Aproved: value.ApprovedAmount,
              Invnumber: value.InvoiceNumber, Satatusdate: value.ApprovedDate, Status: value.Status,
              Aprovedcomnt: value.ApproverComment, ID: value.ID, ClaimID: value.ClaimID, DChargeID: value.DChargeID,
              DStausID: value.DStausID, MaterialID: value.MaterialID, IsDeleted: value.IsDeleted
            });
          });
          
          this.claimservice.ClaimFilterDataList = [];
          this.claimservice.ClaimFilterDataList = this.FilterData;
          //this.selectedUseratEdit.emit(this.FilterData);
          this.chargeDetailComponent.GetChargelist();
          let sumOfClaimamount = 0;
          let sumOfApprovedAmount = 0;
          vv.map(p => {
            if (p.Status == "Approved") {
              sumOfApprovedAmount += !!!p.ApprovedAmount ? 0 : Number(p.ApprovedAmount);
            }
            sumOfClaimamount += !!!p.ClaimAmount ? 0 : Number(p.ClaimAmount);
          });
          this.ClaimModel.Approvedamount = sumOfApprovedAmount.toString();
          this.ClaimModel.Claimamount = sumOfClaimamount.toString();

        }
        else {
          this.claimservice.ClaimFilterDataList = [];
          this.chargeDetailComponent.GetChargelist();

        }
      });
  }

  ShipmentOnItemSelect(item: any) {
    if (!!item.id) {
      var ShipmentIDdata = this.ShipnoList.find(f => f.ID == Number(item.id));
      this.ShipmentID = Number(item.id);
      // this.ClaimModel.ClaimID = Number(0);
      this.ClaimModel.InvoiceNumber = ShipmentIDdata.Invoicenumber;

      let Claimfor = this.ClaimForList.find(d => d.id == this.ClaimModel.ClaimForID)?.Code;
      if (Claimfor != "Shipment-AP") {
        this.GetOrderWithIdDetails(this.ShipmentID);
      }
      else {
        this.GetClaimFilterData(this.ShipmentID, this.ClaimModel.ClientID, 0, this.ClaimModel.ClaimID, this.ClaimModel.ClaimForID);
      }
    }
  }

  ShipmentOnItemDeSelect(item: any) {
    this.ShipmentID = Number(0);
    this.ClaimModel.InvoiceNumber = "";
    //this.ClaimModel.EntityKeyId = Number(0);
  }

  OrderOnItemSelect(item: any) {


    if (!!item.id) {
      var ShipmentIDdata = this.OrdershipIDList.find(f => f.ID == Number(item.id));
      this.OrderID = Number(item.id);
      // this.ClaimModel.ClaimID = Number(0);
      this.ShipmentID = ShipmentIDdata.ShipmentID;
      this.GetClaimFilterData(this.ShipmentID, this.ClaimModel.ClientID, this.OrderID, this.ClaimModel.ClaimID, this.ClaimModel.ClaimForID);

      this.GetShipmentWithIdDetails(ShipmentIDdata.ShipmentID);

    }
  }

  OrderOnItemDeSelect(item: any) {
    this.OrderID = Number(0);
    this.ClaimModel.EntityKeyId = Number(0);
  }

  GetShipmentWithIdDetails(ShipmentID: any) {
    this.SelectedSubscription = [];
    // this.OrdershipIDList = [];
    this.ShipnoList = [];
    this.SubscriptionList = [];
    // this.OrderList = [];
    this.claimservice.GetShipmentIdNumberDetails(this.ClaimModel, ShipmentID)
      .subscribe(res => {
        if (res.message == "Success") {
          var data = [];
          data = res.data;
          this.ShipnoList = data;
          this.SubscriptionList = data.map(r => ({ id: r.ID, itemName: r.Name }));
          this.SelectedSubscription.push({ "id": this.SubscriptionList[0].id, "itemName": this.SubscriptionList[0].itemName });
          this.ClaimModel.InvoiceNumber = this.SubscriptionList[0].Invoicenumber;
          this.ShipmentID = this.SubscriptionList[0].id;
        }
      });
  }

  GetOrderWithIdDetails(ShipmentID: any) {
    this.SelectedOrder = [];
    this.OrdershipIDList = [];
    //this.ShipnoList = [];
    // this.SubscriptionList = [];
    this.OrderList = [];
    this.claimservice.GetOrderIdNumberDetails(this.ClaimModel, ShipmentID)
      .subscribe(res => {
        if (res.message == "Success") {
          var data = [];
          data = res.data;
          this.OrdershipIDList = data;
          this.OrderList = data.map(r => ({ id: r.ID, itemName: r.Name }));
          this.SelectedOrder.push({ "id": this.OrderList[0].id, "itemName": this.OrderList[0].itemName });
          this.OrderID = this.OrderList[0].id;
          this.GetClaimFilterData(this.ShipmentID, this.ClaimModel.ClientID, this.OrderID, this.ClaimModel.ClaimID, this.ClaimModel.ClaimForID);
        }
      });
  }

  SaveUpdatedClaim() {
    if (this.IsLeftList) {
      this.IsLeftList = true;
      this.IsAddClaim = false;
    }
    else {
      this.IsLeftList = false;
      this.IsAddClaim = false;
    }
    this.chargeDetailComponent.AddNext = true;
    this.flagStatus = false;
    this.SaveUpdated();
    this.IsSetupNotifyDisabled = false;
  }

  claimvalidation(): boolean {
    if (!this.IsLeftList) {
      return true;
    }
    if (!!!this.ClaimdatecalendarDate) {
      this.toastrService.error("Please fill all mandatory fields.");
      return false;
    }
    if (!!!this.ClaimStatusSelected || this.ClaimStatusSelected.length == 0) {
      this.toastrService.error("Please fill all mandatory fields.");
      return false;
    }
    if (!!!this.ClaimForSelected || this.ClaimForSelected.length == 0) {
      this.toastrService.error("Please fill all mandatory fields.");
      return false;
    }
    if (this.ClaimForSelected.length > 0) {
      let Claimfor = this.ClaimForList.find(d => d.id == this.ClaimModel.ClaimForID)?.Code;
      if (Claimfor === 'Customer') {
        if (!!!this.CustomerBillingSelected || this.CustomerBillingSelected.length == 0) {
          this.toastrService.error("Please fill all mandatory fields.");
          return false;
        }
        else {
          var CustomerIDdata = this.CustomerList.find(f => f.id == Number(this.ClaimModel.LocationId));
          if (!!CustomerIDdata) {
            this.ClaimModel.EntityId = CustomerIDdata.entityId;
            this.ClaimModel.EntityKeyId = Number(this.ClaimModel.LocationId);
            return true;
          }

        }
      }
      else if (Claimfor === 'Business Partner') {

        if (!!!this.BusinessPartnerSelected || this.BusinessPartnerSelected.length == 0) {
          this.toastrService.error("Please fill all mandatory fields.");
          return false;
        } else {
          var BPdata = this.BusinessList.find(f => f.id == Number(this.ClaimModel.LocationId));
          if (!!BPdata) {
            this.ClaimModel.EntityId = BPdata.entityId;
            this.ClaimModel.EntityKeyId = Number(this.ClaimModel.LocationId);
            return true;
          }


        }
      }
      else if (Claimfor === 'Shipment-AP') {
        if (!!!this.SelectedSubscription || this.SelectedSubscription.length == 0) {
          this.toastrService.error("Please fill all mandatory fields.");
          return false;
        }
        else {
          var ShipmentIDdata = this.ShipnoList.find(f => f.ID == Number(this.ShipmentID));
          if (!!ShipmentIDdata) {
            this.ClaimModel.EntityId = ShipmentIDdata.EntityId;
            this.ClaimModel.EntityKeyId = Number(this.ShipmentID);
            return true;
          }

        }
      }
      else if (Claimfor === 'Order-AR') {
        if (!!!this.SelectedSubscription && !!!this.SelectedOrder || (this.SelectedSubscription.length == 0 || this.SelectedOrder.length == 0)) {
          this.toastrService.error("Please fill all mandatory fields.");
          return false;
        }
        else {
          var OrderShipmentIDdata = this.OrdershipIDList.find(f => f.ID == Number(this.OrderID));
          if (!!OrderShipmentIDdata) {
            this.ClaimModel.EntityId = OrderShipmentIDdata.EntityId;
            this.ClaimModel.EntityKeyId = Number(this.OrderID);
            return true;
          }


        }
      }
    }
    else {
      this.toastrService.error("Please fill all mandatory fields.");
      return false;
    }
  }

  resetAllAllField() {
    this.ClaimModel.IsSetupAndNotify = false;
    this.ClaimModel.IsApproved = false;
    this.ClaimdatecalendarDate = this.setDateMMddyyyy(new Date());
    this.ClaimForSelected = [];
    this.ClaimModel.ClaimComments = '';
    this.SelectedSubscription = [];
    this.SelectedOrder = [];
    this.CustomerBillingSelected = [];
    this.BusinessPartnerSelected = [];
    this.ClaimModel.InvoiceNumber = "";
    document.getElementById('Shipno').removeAttribute('required');
    document.getElementById('Customerbill').removeAttribute('required');
    document.getElementById('Ordno').removeAttribute('required');
    document.getElementById('Businesspart').removeAttribute('required');
    this.settngsetupdisabled();
  }

  //Merge Edit Code here

  getClaimDataByClaimId() {
    var ClientId = this.auth.currentUserValue.ClientId;
    this.ClaimForSelected = [];
    //this.ClaimStatusSelected = [];
    this.claimservice.GetClaimByClaimId(this.SelectedClaimId, ClientId)
      .subscribe(result => {
        if (result.data.length > 0) {
          var data = result.data;
          this.ClaimdatecalendarDate = data[0].DateSubmitted;
          this.ClaimStatusSelected = [];
          this.ClaimStatusSelected.push({ "id": data[0].ClaimStatusID, "itemName": data[0].ClaimStatus });
          this.ClaimForSelected = [];
          this.ClaimForSelected.push({ "id": data[0].ClaimForID, "itemName": data[0].ClaimFor });
          this.ClaimModel.ClaimComments = data[0].ClaimComments;
          this.ClaimModel.ClaimID = this.SelectedClaimId;
          this.ClaimModel.ClaimStatusID = data[0].ClaimStatusID;
          this.ClaimModel.ClaimForID = data[0].ClaimForID;
          this.ClaimModel.ClaimStatus = data[0].ClaimStatus;
          this.chargeDetailComponent.ClaimDatas(this.ClaimModel);
          this.GetClaimFilterData(0, this.ClaimModel.ClientID, 0, this.SelectedClaimId, 0);
          if (data[0].ApprovedBy != null && data[0].ApprovedBy != "" && data[0].SetupComplete == true)
            this.ClaimModel.IsApproved = true;
          else
            this.ClaimModel.IsApproved = false;

          this.ClaimModel.ApprovedBy = data[0].ApprovedBy;
          this.ClaimModel.IsSetupAndNotify = data[0].SetupComplete;
          this.ClaimModel.InvoiceNumber = data[0].InvoiceNumber;
          this.ClaimModel.SetupCompleteDateTime = this.claimservice.getLocalDateTime(data[0].SetupCompleteDateTime);
          this.ClaimModel.Claimamount = data[0].ClaimAmount == null ? '0' : data[0].ClaimAmount;
          this.ClaimModel.Approvedamount = data[0].ApprovedAmount == null ? '0' : data[0].ApprovedAmount;
          this.SetupAndApprovedDisabled(data[0].ClaimStatus, data[0].SetupComplete);
          this.ClaimModel.ClaimForID = data[0].ClaimForID;
          this.ClaimModel.LocationId = data[0].LocationId;
          this.ClaimModel.EntityId = data[0].EntityId;
          this.ClaimModel.EntityKeyId = data[0].EntityKeyId;
          this.ClaimModel.Title = data[0].Title;
          this.ClaimModel.ClaimStatus = data[0].ClaimStatus;
          this.ClaimModel.UpdatedBy = data[0].UpdatedBy == "" ? null : data[0].UpdatedBy;
          this.ClaimModel.CreatedBy = data[0].CreatedBy;
          //this.ClaimModel.UpdateDate = data[0].UpdateDateTimeServer;
          this.ClaimModel.UpdateDate = this.claimservice.getLocalDateTime(data[0].UpdateDateTimeServer);
          this.ClaimModel.CreateDate = this.claimservice.getLocalDateTime(data[0].CreateDateTimeServer);
          this.isCompleteInMas = data[0].ClaimStatus == "Completed in MAS" ? true : false;
          //Edit Validation       
          if (this.ClaimForSelected.length > 0) {
            let Claimfor = this.ClaimForList.find(d => d.id == this.ClaimModel.ClaimForID)?.Code;

            if (Claimfor === 'Customer') {
              this.BusinessPartnerSelected = [];
              this.SelectedSubscription = [];
              this.SelectedOrder = [];
              this.CustomerBillingSelected = [];
              this.CustomerBillingSelected.push({ "id": data[0].BillingEntityID, "itemName": data[0].BillingEntity });

            }
            else if (Claimfor === 'Business Partner') {
              this.CustomerBillingSelected = [];
              this.SelectedSubscription = [];
              this.SelectedOrder = [];
              this.BusinessPartnerSelected = [];
              this.BusinessPartnerSelected.push({ "id": data[0].BusinessPartnerID, "itemName": data[0].BusinessPartner });
            }
            else if (Claimfor === 'Shipment-AP') {
              this.ShipmentID = data[0].ShipmentNoID;
              this.BusinessPartnerSelected = [];
              this.CustomerBillingSelected = [];
              this.SelectedOrder = [];
              this.SelectedSubscription = [];
              this.SelectedSubscription.push({ "id": data[0].ShipmentNoID, "itemName": data[0].ShipmentNo });

            }
            else if (Claimfor === 'Order-AR') {
              this.OrderID = data[0].OrderNoID;
              this.ShipmentID = data[0].ShipmentNoID;
              this.BusinessPartnerSelected = [];
              this.CustomerBillingSelected = [];
              this.SelectedSubscription = [];
              this.SelectedOrder = [];
              this.SelectedOrder.push({ "id": data[0].OrderNoID, "itemName": data[0].OrderNo });

              this.SelectedSubscription = [];
              this.SelectedSubscription.push({ "id": data[0].ShipmentNoID, "itemName": data[0].ShipmentNo });
              this.ShipmentID = data[0].ShipmentNoID;
            }
          }
          this.Allsettngsetupdisabled();
        }
      }
      );
  }

  BindClaimDetails(claimId) {
    this.buttonBar.disableAction('delete');
    this.buttonBar.disableAction('export');

    this.SelectedClaimId = claimId;
    this.chargeDetailComponent.Set();
    this.SelectedClaimIdTemp = claimId;
    this.getClaimDataByClaimId();
    //this.Allsettngsetupdisabled();
  }

  CompleteSetupAndNotify(e) {

    if (e.target.checked) {
      this.ClaimModel.IsSetupAndNotify = true;
      var ClientId = this.auth.currentUserValue.ClientId;
      var UserId = this.auth.currentUserValue.UserId;

      var ClaimStatusId = 0;
      if (this.ClaimStatusSelected.length > 0)
        ClaimStatusId = this.ClaimStatusSelected[0].id;

      this.ClaimModel.UpdateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());

      this.claimservice.SetCompleteSetupAndNotify(ClientId, this.SelectedClaimId, this.ClaimModel.IsSetupAndNotify, ClaimStatusId, UserId, this.ClaimModel.UpdateDateTimeBrowserStr)
        .subscribe(result => {
          if (result.message == "Success") {
            this.toastrService.success('Claim is updated successfully.');
            this.getClaimDataByClaimId();
          }
        }
        );
    } else if (e.target.checked == false) {
      this.ClaimModel.IsSetupAndNotify = false;
      var ClientId = this.auth.currentUserValue.ClientId;
      var UserId = this.auth.currentUserValue.UserId;

      var ClaimStatusIdn = 0;
      if (this.ClaimStatusSelected.length > 0)
        ClaimStatusIdn = this.ClaimStatusSelected[0].id;

      this.ClaimModel.UpdateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());

      this.claimservice.SetCompleteSetupAndNotify(ClientId, this.SelectedClaimId, this.ClaimModel.IsSetupAndNotify, ClaimStatusIdn, UserId, this.ClaimModel.UpdateDateTimeBrowserStr)
        .subscribe(result => {
          if (result.message == "Success") {
            this.toastrService.success('Claim is updated successfully.');
            this.getClaimDataByClaimId();
          }
        }
        );
    }
  }

  ApprovedClaim(e) {
    if (e.target.checked) {
      this.ClaimModel.IsApproved = true;
      var ClientId = this.auth.currentUserValue.ClientId;
      var UserId = this.auth.currentUserValue.UserId;
      var ClaimStatusId = 0;
      if (this.ClaimStatusSelected.length > 0)
        ClaimStatusId = this.ClaimStatusSelected[0].id;

      this.ClaimModel.UpdateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());

      this.claimservice.SetApprovedClaim(ClientId, this.SelectedClaimId, this.ClaimModel.IsApproved, ClaimStatusId, UserId, this.ClaimModel.UpdateDateTimeBrowserStr)
        .subscribe(result => {
          if (result.message == "Success") {
            this.toastrService.success('Claim approved and notifications sent.');
            this.getClaimDataByClaimId();
          }
        });
    }
  }

  SetupAndApprovedDisabled(ClaimStatus: string, IsSetupComplete) {
    //Approved Enabled/Disabled
    if (ClaimStatus.trim().toLowerCase() == "ready for approval" && IsSetupComplete)
      this.IsApprovedDisabled = false;//Show
    else
      this.IsApprovedDisabled = true;//Hide

    //Setup Complete and Notify Enabled/Disabled
    if (ClaimStatus.trim().toLowerCase() == "approved" || ClaimStatus.trim().toLowerCase() == "completed in mas")
      this.IsSetupNotifyDisabled = true;
    else
      this.IsSetupNotifyDisabled = false;

  }

  Allsettngsetupdisabled() {
    this.settingsOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsShipOrder = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    this.settingsCustomer = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
    this.settingsBP = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      disabled: true
    };
    this.settingsClaimFor = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: true
    };
    document.getElementById('Shipno').removeAttribute('required');
    document.getElementById('Customerbill').removeAttribute('required');
    document.getElementById('Ordno').removeAttribute('required');
    document.getElementById('Businesspart').removeAttribute('required');
    this.ClaimdateDisable = true;
    if (this.ClaimModel.ClaimStatus != undefined) {
      if (this.ClaimModel.ClaimStatus.trim().toLowerCase() == 'approved') {
        this.settingsClaimSatus = {
          singleSelection: true,
          text: "Select",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          searchBy: ['itemName'],
          badgeShowLimit: 1,
          disabled: false
        };
        var statusArray = [];
        this.ClaimStatusList.forEach((value, index) => {
          if (value.itemName.trim().toLowerCase() == 'approved' || value.itemName.trim().toLowerCase() == 'completed in mas') {
            statusArray.push(value);
          }
        });
        this.ClaimStatusList = [];
        this.ClaimStatusList = statusArray.map(o => {
          return o;
        });

      }
      else {
        this.settingsClaimSatus = {
          singleSelection: true,
          text: "Select",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          searchBy: ['itemName'],
          badgeShowLimit: 1,
          disabled: true
        };
      }
    }
    else {
      this.settingsClaimSatus = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        searchBy: ['itemName'],
        badgeShowLimit: 1,
        disabled: true
      };
    }

  }

  getPageControlsPermissions() {

    var ModuleRoleCode = "CLA,CLA.APL,Claims.SetupAndNotify";
    var ClientId = this.auth.currentUserValue.ClientId;
    var LoginId = this.auth.currentUserValue.LoginId;
    this.claimservice.getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.ControlPermissions = res.Data;

          //For Approval
          var isClaimApproval = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("CLA.APL"));
          if (isClaimApproval != null && isClaimApproval != undefined) {
            if (isClaimApproval.length > 0) {
              if ((isClaimApproval[0].PermissionType.toLowerCase() == "read and modify")) {
                //Enable Approval Checkbox
                this.hasClaimApproval = false;
              } else {
                //Disable Approval Checkbox
                this.hasClaimApproval = true;
              }
            }
          }
          if (isClaimApproval.length == 0) {
            this.hasClaimApproval = true;
          }

          //For Setup complete and notify
          var isClaimSetupAndNotify = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("Claims.SetupAndNotify"));
          if (isClaimSetupAndNotify != null && isClaimSetupAndNotify != undefined) {
            if (isClaimSetupAndNotify.length > 0) {
              if ((isClaimSetupAndNotify[0].PermissionType.toLowerCase() == "read and modify")) {
                //Enable SetupAndNotify Checkbox
                this.hasClaimSetupAndNotify = false;
              } else {
                //Disable SetupAndNotify Checkbox
                this.hasClaimSetupAndNotify = true;
              }
            }
          }
          if (isClaimSetupAndNotify.length == 0) {
            this.hasClaimSetupAndNotify = true;
          }

          //For Save/Update button
          var isClaimSaveUpdate = this.ControlPermissions.filter((x) => x.ModuleRoleCode == "CLA");
          if (isClaimSaveUpdate != null && isClaimSaveUpdate != undefined) {
            if (isClaimSaveUpdate.length > 0) {
              if ((isClaimSaveUpdate[0].PermissionType.toLowerCase() == "read and modify")) {
                //Enable SetupAndNotify Checkbox
                this.hasClaimSaveUpdate = false;
              } else {
                //Disable SetupAndNotify Checkbox
                this.hasClaimSaveUpdate = true;
              }
            }
          }
          if (isClaimSaveUpdate.length == 0) {
            this.hasClaimSaveUpdate = true;
          }
        }
      });
  }

  GetClaimDetail(data: any) {

    var outP = data;
    this.GetClaimFilterData(0, this.ClaimModel.ClientID, 0, Number(outP), 0);

  }
  RemoveSalesOrder(ClaimId) {
    this.claimservice.ClaimforEdit.splice(this.claimservice.ClaimforEdit.findIndex(x => x.ClaimId === ClaimId), 1);
  }

  SaveUpdated() {   
    if (this.claimvalidation()) {
      if (!!!this.ClaimModel.InvoiceNumber) {
        this.ClaimModel.InvoiceNumber = "";
      }
      if (this.ClaimModel.ClaimID == 0) {
        this.ClaimModel.DateSubmitted = this.orderCommonService.convertDatetoStringDate(this.ClaimdatecalendarDate);
      }

      this.ClaimModel.IsDeleted = false;
      this.ClaimModel.CreatedBy = this.auth.currentUserValue.LoginId;
      this.ClaimModel.CreateDateTimeBrowser = this.orderCommonService.convertDatetoStringDate(this.setDateMMddyyyy(new Date()));
      this.ClaimModel.CreateDateTimeServer = this.orderCommonService.convertDatetoStringDate(this.setDateMMddyyyy(new Date()));
      this.ClaimModel.UpdateDateTimeServer = this.orderCommonService.convertDatetoStringDate(this.setDateMMddyyyy(new Date()));

      this.ClaimModel.CreateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());
      this.ClaimModel.UpdateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());

      this.claimservice.Saveclaim(this.ClaimModel)
        .subscribe(
          data => {
            if (data.data != null) {            
              let result = data.data[0];
              this.ClaimModel.ClaimID = Number(result.status);
              this.LocalClaimID = Number(result.status);
              if (this.LocalClaimID != 0) {
                this.toastrService.success(result.message);
                this.chargeDetailComponent.ClaimDatas(this.ClaimModel);
                if (this.IsLeftList) {
                  this.SelectedClaimId = this.LocalClaimID;
                  this.SelectedClaimIdTemp = this.LocalClaimID;
                  setTimeout(() => {
                    this.setClaimDataByClaimId(this.SelectedClaimId);
                  }, 1000);
                  this.chargeDetailComponent.FinalSaveClaimDetail();
                  if (this.saveStatus) {
                    this.saveStatus = false;
                  }

                }
                if (!this.IsAddClaim) {
                  this.Allsettngsetupdisabled();
                }

              } else {
                this.ClaimModel.ClaimID = Number(0);
                this.toastrService.warning(result.message);
                this.chargeDetailComponent.ClaimDatas(this.ClaimModel);
              }
              this.getClaimDataByClaimId();
            }
          }
        );
    } else {
      // this.toastrService.error("Please fill all mandatory fields.");
    }
  }

  AddSaveUpdated() {
    this.flagStatus = false;
    if (this.IsLeftList) {
      this.chargeDetailComponent.AddNext = false;
      this.IsAddClaim = true;
      this.IsLeftList = true;
      this.SaveUpdated();
      this.IsSetupNotifyDisabled = true;
      this.resetAllAllField();
      this.settingsClaimFor = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        searchBy: ['itemName'],
        badgeShowLimit: 1,
        disabled: false
      };
      this.ClaimdateDisable = false;
      this.GetClaimFilterData(0, this.ClaimModel.ClientID, 0, 0, 0);
      this.chargeDetailComponent.ISActive = true;
    }
    else {

      this.IsAddClaim = false;
      this.IsLeftList = false;
      this.SaveUpdated();
      this.SelectNextClaimForEdit();
      this.GetClaimFilterData(0, this.ClaimModel.ClientID, 0, this.ClaimModel.ClaimID, 0);
    }



  }

  setClaimDataByClaimId(SelectedClaimId: any) {
    var ClientId = this.auth.currentUserValue.ClientId;
    this.claimservice.GetClaimByClaimId(SelectedClaimId, ClientId)
      .subscribe(result => {
        if (result.data.length > 0) {
          var data = result.data;
          this.ClaimModel.ClaimID = this.SelectedClaimId;
          this.ClaimModel.Title = data[0].Title;
          this.ClaimModel.ClaimStatus = data[0].ClaimStatus;
          this.SelectedClaimIdTemp = this.ClaimModel.ClaimID;
          if (!this.flagStatus) {
            this.ClaimforEdit.length > 1
            let index = this.ClaimforEdit.findIndex(x => x.ClaimId == Number(this.SelectedClaimId));
            if (index < 0) {
              this.flagStatus = true;
              data.map(item => {
                return {
                  ClaimId: item.ClaimId,
                  Title: item.Title
                };
              }).forEach(x => this.ClaimforEdit.push(x));
            }
          }
        }
      }
      );
  }

  SelectNextClaimForEdit() {
    this.CurrentEditListItemIndex = this.ClaimforEdit.findIndex(x => x.ClaimId === this.SelectedClaimId);
    if (this.CurrentEditListItemIndex >= 0) {
      if (this.ClaimforEdit.length - 1 > this.CurrentEditListItemIndex) {
        this.CurrentEditListItemIndex = this.CurrentEditListItemIndex + 1;
        this.SelectedClaimId = this.ClaimforEdit[this.CurrentEditListItemIndex].ClaimId;
        this.SelectedClaimIdTemp = this.ClaimforEdit[this.CurrentEditListItemIndex].ClaimId;
        this.getClaimDataByClaimId();
      }

    }
  }
}
