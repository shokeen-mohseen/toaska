import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddEditchargeComponent } from '../add-editcharge/add-editcharge.component';
import { ChargeListComponent } from '../charge-list/charge-list.component';
import { ClaimService } from '../../../../core/services/claim.service';
import { Claim, AddClaimModel } from '@app/core/models/claim.model';
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
declare var $: any;



@Component({
  selector: 'app-charge-detail',
  templateUrl: './charge-detail.component.html',
  styleUrls: ['./charge-detail.component.css']
})
export class ChargeDetailComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(private router: Router, public modalService: NgbModal, private claimservice: ClaimService, private auth: AuthService, private toastrService: ToastrService) { }
  ClaimObject: Claim = new Claim();
  @ViewChild(ChargeListComponent) private chargeListComponent: ChargeListComponent;
  //@ViewChild(AddEditchargeComponent) private AddEditchargeComponent: AddEditchargeComponent;
  @Output() ClaimID: EventEmitter<any> = new EventEmitter();
  ISActive: boolean = true;
  SaveClaimDetails: any = {};
  IsUpdate: boolean = false;
  AddNext: boolean = true;
  AddClaimModel: AddClaimModel = new AddClaimModel();

  settingsA = {};
  settingsB = {};
  ControlPermissions = [];
  hasClaimSaveUpdate: boolean = false;
  count = 3;
  ClaimStatusList = [];
  ClaimStatusSelected = [];
  ChargetList: any = [];
  ChargeSelectedList = [];
  IsInvoiced: boolean = true;
  IsShipped: boolean = true;
  IsSave: boolean;


  ngOnInit(): void {
    this.IsSave = true;
    this.ClaimObject.ClientId = this.auth.currentUserValue.ClientId;
    this.ClaimObject.UpdatedBy = this.auth.currentUserValue.LoginId;

    this.getPageControlsPermissions();
    

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: false,

    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1,
      disabled: false,

    };

    

    this.AddClaimModel.ClientID = this.auth.currentUserValue.ClientId;
    this.AddClaimModel.CreatedBy = this.auth.currentUserValue.LoginId;

    //this.GetClaimStatus();

  }
  openaddCharge() {
    this.AddClaimModel.ChargeID = 0;
    this.AddClaimModel.ClaimID = 0;
    this.ChargeSelectedList = [];
    this.GetClaimStatus();
    this.GetData();
    this.AddClaimModel.BusinessLocationID = 0;
    this.AddClaimModel.CustomerLocationID = 0;
    this.AddClaimModel.FromLocationID = 0;
    this.AddClaimModel.ToLocationID = 0;
    this.AddClaimModel.MaterialID = 0;   
    this.AddClaimModel.ShippedQuantity = null;
    this.AddClaimModel.InvoicedAmount = null;
    this.AddClaimModel.ClaimedQuantity = null;
    this.AddClaimModel.ClaimAmount = null;
    this.AddClaimModel.RecommendedAmount = null;
    this.AddClaimModel.ApprovedAmount = null;
    this.AddClaimModel.InvoiceNumber = null;    
    this.AddClaimModel.ApproverComment = null
    this.AddClaimModel.CreatedBy = null;

    $("#EditChargeDetail").modal('show');
  }

  GetChargelist() {
    this.chargeListComponent.FillData();
  }
  ClaimDatas(data: any) {
    
    var outP = data;
    if (data != undefined && data != null) {
      if (Number(data.ClaimID) > 0) {
        
        //this.ISActive = false;
        this.claimservice.ClaimData = outP;
        this.Set();
        this.GetData();
      }
      else {
        this.ISActive = true;
      }

    }
    
   
  }

  Edit() {
    this.chargeListComponent.IsEdit = true;
    this.chargeListComponent.GetCharge(Number(this.claimservice.ClaimData.ClientID), this.claimservice.ClaimData.ClaimForID);
  }

  Save() {
    if (this.IsUpdate) {
      this.UpdateClaimDetail();
    }
    else {
      this.SaveClaimDetail();
    }
  }

  SaveClaimDetail() {
    var ClaimsDetail: any = [];
    
    var ff = this.chargeListComponent.ClaimsDetails;
    if (this.chargeListComponent.ClaimsDetails != undefined && this.chargeListComponent.ClaimsDetails.length > 0) {
      this.chargeListComponent.ClaimsDetails.forEach(data => {
        let Claim: any = {};
        Claim.ID = Number(0);
        Claim.ClaimID = data.ClaimID == null ? 0 : Number(this.claimservice.ClaimData.ClaimID);
        Claim.ChargeID = data.DChargeID == null ? 0 : Number(data.DChargeID);
        Claim.InvoicedQuantity = data.Shipment == "" ? 0 : Number(data.Shipment);
        Claim.InvoicedAmount = data.Invoiceamount == "" ? 0 : Number(data.Invoiceamount);
        Claim.ApprovedAmount = data.Aproved == "" ? 0 : Number(data.Aproved);
        Claim.ClaimAmount = data.Claimamount == "" ? 0 : Number(data.Claimamount);
        Claim.ClaimedQuantity = data.Claimqunatity == "" ? 0 : Number(data.Claimqunatity);
        Claim.RecommendedAmount = data.FReamount == "" ? 0 : Number(data.FReamount);
        Claim.InvoiceNumber = data.Invnumber == "" ? '' : data.Invnumber;
        Claim.Comments = data.Aprovedcomnt == "" ? '' : data.Aprovedcomnt;
        Claim.ClaimStatusID = data.DStausID == null ? 0 : Number(data.DStausID);
        Claim.CreatedBy = this.ClaimObject.UpdatedBy;
        Claim.ClientID = Number(this.ClaimObject.ClientId);
        Claim.MaterialID = data.MaterialID == "" || data.MaterialID == null ? 0 : Number(data.MaterialID);
        Claim.IsDeleted = data.IsDeleted == "" || data.IsDeleted == null ? 0 : Number(data.IsDeleted);
        
        ClaimsDetail.push(Claim);

        this.SaveClaimDetails.ClaimID = Number(this.claimservice.ClaimData.ClaimID);
        this.SaveClaimDetails.claimDetailModelUP = ClaimsDetail;
      })
      this.SaveMultiClaimData(this.SaveClaimDetails);
    }

    

    
  }


  SaveMultiClaimData(multiClaimModel: any) {

    this.claimservice.SaveMultiData(multiClaimModel)
      .subscribe(res => {

        var tt = res.data;
        if (res.data.length > 0) {
          this.IsUpdate = true;
          this.ClaimID.emit(this.claimservice.ClaimData.ClaimID);
          this.toastrService.success(res.data[0].message);
        }
        else {
          this.IsUpdate = false;
        }
      });
  }

  UpdateClaimDetail() {
    var ClaimsDetail: any = [];
    
    var ff = this.chargeListComponent.ClaimsDetails;
    if (this.chargeListComponent.ClaimsDetails.length == 0) {
      this.toastrService.warning('Please select at least one record.');
      return;
    }
    if (this.chargeListComponent.ClaimsDetails != undefined && this.chargeListComponent.ClaimsDetails.length > 0) {
      this.chargeListComponent.ClaimsDetails.forEach(data => {
        let Claim: any = {};
        Claim.ID = Number(data.ID);
        Claim.ClaimID = data.ClaimID == null ? 0 : Number(this.claimservice.ClaimData.ClaimID);
        Claim.ChargeID = data.DChargeID == null ? 0 : Number(data.DChargeID);
        Claim.InvoicedQuantity = data.Shipment == "" ? 0 : Number(data.Shipment);
        Claim.InvoicedAmount = data.Invoiceamount == "" ? 0 : Number(data.Invoiceamount);
        Claim.ApprovedAmount = data.Aproved == "" ? 0 : Number(data.Aproved);
        Claim.ClaimAmount = data.Claimamount == "" ? 0 : Number(data.Claimamount);
        Claim.ClaimedQuantity = data.Claimqunatity == "" ? 0 : Number(data.Claimqunatity);
        Claim.RecommendedAmount = data.FReamount == "" ? 0 : Number(data.FReamount);
        Claim.InvoiceNumber = data.Invnumber == "" ? '' : data.Invnumber;
        Claim.Comments = data.Aprovedcomnt == "" ? '' : data.Aprovedcomnt;
        Claim.ClaimStatusID = data.DStausID == null ? 0 : Number(data.DStausID);
        Claim.CreatedBy = this.ClaimObject.UpdatedBy;
        Claim.ClientID = Number(this.ClaimObject.ClientId);
        Claim.MaterialID= data.MaterialID == "" || data.MaterialID == null ? 0 : Number(data.MaterialID);
        Claim.IsDeleted = data.IsDeleted == "" || data.IsDeleted == null ? 0 : Number(data.IsDeleted);
        ClaimsDetail.push(Claim);

        this.SaveClaimDetails.ClaimID = Number(this.claimservice.ClaimData.ClaimID);
        this.SaveClaimDetails.claimDetailModelUP = ClaimsDetail;
      })
      this.SaveMultiClaimData(this.SaveClaimDetails);
    }

    

   
  }

  Delete() {

    this.DeleteClaimDetail();
  }

  DeleteClaimDetail() {
    var ClaimsDetail: any = [];
    
    var ff = this.chargeListComponent.ClaimsDetails;
    if (this.chargeListComponent.ClaimsDetails != undefined && this.chargeListComponent.ClaimsDetails.length > 0) {
      this.chargeListComponent.ClaimsDetails.forEach(data => {
        let Claim: any = {};
        Claim.ID = Number(data.ID);
        Claim.ClaimID = data.ClaimID == null ? 0 : Number(this.claimservice.ClaimData.ClaimID);
        Claim.ChargeID = data.DChargeID == null ? 0 : Number(data.DChargeID);
        Claim.InvoicedQuantity = data.Shipment == "" ? 0 : Number(data.Shipment);
        Claim.InvoicedAmount = data.Invoiceamount == "" ? 0 : Number(data.Invoiceamount);
        Claim.ApprovedAmount = data.Aproved == "" ? 0 : Number(data.Aproved);
        Claim.ClaimAmount = data.Claimamount == "" ? 0 : Number(data.Claimamount);
        Claim.ClaimedQuantity = data.Claimqunatity == "" ? 0 : Number(data.Claimqunatity);
        Claim.RecommendedAmount = data.FReamount == "" ? 0 : Number(data.FReamount);
        Claim.InvoiceNumber = data.Invnumber == "" ? '' : data.Invnumber;
        Claim.Comments = data.Aprovedcomnt == "" ? '' : data.Aprovedcomnt;
        Claim.ClaimStatusID = data.DStausID == null ? 0 : Number(data.DStausID);
        Claim.CreatedBy = this.ClaimObject.UpdatedBy;
        Claim.ClientID = Number(this.ClaimObject.ClientId);
        Claim.MaterialID = data.MaterialID == "" || data.MaterialID == null ? 0 : Number(data.MaterialID);
        Claim.IsDeleted = data.IsDeleted == "" || data.IsDeleted == null ? 0 : Number(data.IsDeleted);
        ClaimsDetail.push(Claim);

        this.SaveClaimDetails.ClaimID = Number(this.claimservice.ClaimData.ClaimID);
        this.SaveClaimDetails.claimDetailModelUP = ClaimsDetail;
      })

    }

    var tt = ClaimsDetail;
    var len: any = [];
    len = ClaimsDetail.filter(x => x.IsDeleted == 1);
    if (Number(len.length > 0)) {
      this.DeleteMultiClaimData(this.SaveClaimDetails);
    }
    else {
      this.toastrService.warning('Please select at least one record.');
    }

    //this.DeleteMultiClaimData(this.SaveClaimDetails);
  }

  DeleteMultiClaimData(multiClaimModel: any) {

    this.claimservice.DeleteMultiData(multiClaimModel)
      .subscribe(res => {

        var tt = res.data;
        if (res.data.length > 0) {
          this.IsUpdate = true;
          this.ClaimID.emit(this.claimservice.ClaimData.ClaimID);
          this.toastrService.success(res.data[0].message);
        }
        else {
          this.IsUpdate = false;
        }
      });
  }

  

  Set() {    
    //if ((this.claimservice.ClaimData.ClaimStatus) == 'Completed in MAS') {
    //  this.ISActive = true;
    //}
    //else {
    //  this.ISActive = false;
    //}
    this.ISActive = false;
    this.IsUpdate = true;
    this.getPageControlsPermissions();
  }

  FinalSaveClaimDetail() {
   
    var ClaimsDetail: any = [];

    var ff = this.chargeListComponent.ClaimsDetails;
    if (this.chargeListComponent.ClaimsDetails != undefined && this.chargeListComponent.ClaimsDetails.length > 0) {
      this.chargeListComponent.ClaimsDetails.forEach(data => {
        let Claim: any = {};
        Claim.ID = Number(0);
        Claim.ClaimID = data.ClaimID == null ? 0 : Number(this.claimservice.ClaimData.ClaimID);
        Claim.ChargeID = data.DChargeID == null ? 0 : Number(data.DChargeID);
        Claim.InvoicedQuantity = data.Shipment == "" ? 0 : Number(data.Shipment);
        Claim.InvoicedAmount = data.Invoiceamount == "" ? 0 : Number(data.Invoiceamount);
        Claim.ApprovedAmount = data.Aproved == "" ? 0 : Number(data.Aproved);
        Claim.ClaimAmount = data.Claimamount == "" ? 0 : Number(data.Claimamount);
        Claim.ClaimedQuantity = data.Claimqunatity == "" ? 0 : Number(data.Claimqunatity);
        Claim.RecommendedAmount = data.FReamount == "" ? 0 : Number(data.FReamount);
        Claim.InvoiceNumber = data.Invnumber == "" ? '' : data.Invnumber;
        Claim.Comments = data.Aprovedcomnt == "" ? '' : data.Aprovedcomnt;
        Claim.ClaimStatusID = data.DStausID == null ? 0 : Number(data.DStausID);
        Claim.CreatedBy = this.ClaimObject.UpdatedBy;
        Claim.ClientID = Number(this.ClaimObject.ClientId);
        Claim.MaterialID = data.MaterialID == "" || data.MaterialID == null ? 0 : Number(data.MaterialID);
        Claim.IsDeleted = data.IsDeleted == "" || data.IsDeleted == null ? 0 : Number(data.IsDeleted);

        ClaimsDetail.push(Claim);

        this.SaveClaimDetails.ClaimID = Number(this.claimservice.ClaimData.ClaimID);
        this.SaveClaimDetails.claimDetailModelUP = ClaimsDetail;
      })
      
        this.FinalSaveMultiClaimData(this.SaveClaimDetails);
      
      
    }     
  }


  FinalSaveMultiClaimData(multiClaimModel: any) {

    this.claimservice.SaveMultiData(multiClaimModel)
      .subscribe(res => {
        var tt = res.data;
        if (res.data.length > 0) {
          this.IsUpdate = true;
          if (res.data[0].message == 'Success') {
            this.IsSave = false;
          }
          if (this.AddNext) {
            this.ClaimID.emit(this.claimservice.ClaimData.ClaimID);
          }
          else {
            this.ISActive = true;
          }
          //this.toastrService.success(res.data[0].message);
        }
        else {
          this.IsUpdate = false;
        }
      });
  }
  

  GetClaimStatus() {
    this.claimservice.GetClaimStatus(this.ClaimObject)
      .subscribe(res => {
        ;
        var Data = res;

        if (Data.length > 0) {
          this.ClaimStatusList = [];
          for (var i = 0; i < Data.length; i++) {
            if (Data[i].itemName == "Open" || Data[i].itemName == "Denied" || Data[i].itemName == "Approved") {
              this.ClaimStatusList.push({ "id": Data[i].id, "itemName": Data[i].itemName });
            }
          }
        }
        var nn = this.ClaimStatusList;
        this.ClaimStatusSelected = [];
        let ClaimStatus = res.find(d => d.Code == "Open");
        this.ClaimStatusSelected.push({ "id": ClaimStatus.id, "itemName": ClaimStatus.itemName });
        this.AddClaimModel.StatusID = Number(ClaimStatus.id);
      });
  }

  GetCharge(ClientID: number, Category: number) {

    this.claimservice.GetCharge(ClientID, Category)
      .subscribe(res => {
        this.ChargetList = [];
        //res.forEach((value, index) => {
        //  this.ChargetList.push({ "id": value.id, "itemName": value.name });
        //});

        this.ChargetList = res.data;
        //let ClaimStatus = res.find(d => d.Code == "Open");
        // this.ClaimStatusSelected.push({ "id": ClaimStatus.id, "itemName": ClaimStatus.itemName });
      });
  }

  ChargeOnItemSelect(item: any) {
    ;
    if (!!item.id) {
      this.AddClaimModel.ChargeID = Number(item.id);
    }
  }

  ChargeOnDeSelectAll(item: any) {
    this.AddClaimModel.ChargeID = Number(0);
  }

  StatusOnItemSelect(item: any) {
    
    if (!!item.id) {
      this.AddClaimModel.StatusID = Number(item.id);
    }
  }

  StatusOnDeSelectAll(item: any) {
    this.AddClaimModel.StatusID = Number(0);
  }
  SaveClaimDetailsData() {
    var tt = this.AddClaimModel
      
    var RequestedObject = {
      ID: Number(this.AddClaimModel.ID),
      ClaimID: Number(this.AddClaimModel.ClaimID),
      ClientID: Number(this.AddClaimModel.ClientID),
      ChargeID: Number(this.AddClaimModel.ChargeID),
      InvoicedAmount: this.AddClaimModel.InvoicedAmount == null ? 0 : Number(this.AddClaimModel.InvoicedAmount),
      ClaimedQuantity: this.AddClaimModel.ClaimedQuantity == null ? 0 : Number(this.AddClaimModel.ClaimedQuantity),
      ClaimAmount: this.AddClaimModel.ClaimAmount == null ? 0 : Number(this.AddClaimModel.ClaimAmount),
      RecommendedAmount: this.AddClaimModel.RecommendedAmount == null ? 0 : Number(this.AddClaimModel.RecommendedAmount),
      ApprovedAmount: this.AddClaimModel.ApprovedAmount == null ? 0 : Number(this.AddClaimModel.ApprovedAmount),
      InvoiceNumber: this.AddClaimModel.InvoiceNumber == null ? '' : this.AddClaimModel.InvoiceNumber,
      StatusID: Number(this.AddClaimModel.StatusID),
      ApproverComment: this.AddClaimModel.ApproverComment == null ? '' : this.AddClaimModel.ApproverComment,
      CreatedBy: this.ClaimObject.UpdatedBy
    }

    if (RequestedObject.ChargeID < 1 || RequestedObject.StatusID < 1) {
      this.toastrService.warning('Please select mandatory fields.');
      return;
    }

    this.SaveClaimSD(RequestedObject);

  }
  numberOnly(event): boolean {
    //const charcode = (event.which) ? event.which : event.keycode;
    //if (charcode > 31 && (charcode == 46 )) {
    //  return false;
    //}
    return true;
  }

  SaveClaimSD(RequestedObject: any) {

    this.claimservice.Save(RequestedObject)
      .subscribe(res => {

        var tt = res.data;
        if (res.data.length > 0) {
          this.toastrService.success(res.data[0].message);
          this.ClaimID.emit(this.claimservice.ClaimData.ClaimID);
          if (res.data[0].status != '0') {
            $("#EditChargeDetail").modal('hide');
          }
         
        }

      });
  }

  GetData() {

    if (this.claimservice.ClaimData != undefined && this.claimservice.ClaimData != null) {
      this.GetCharge(Number(this.claimservice.ClaimData.ClientID), this.claimservice.ClaimData.ClaimForID);
      this.AddClaimModel.ClaimID = this.claimservice.ClaimData.ClaimID;
    }

  }

  validation(event: any) {
    let number = event.target.value.trim();
    if (!!number) {
      const re = /^[A-Za-z0-9-,. ]*$/;
      if (!(re.test(String(number).toLowerCase()))
        && !!number && number) {
        return false
      }
    }
   
  }
  QuantityValidation(event): boolean {
    const charcode = (event.which) ? event.which : event.keycode;
    if (charcode > 31 && (charcode == 46)) {
      return false;
    }
    return true;
  }

  getPageControlsPermissions() {

    var ModuleRoleCode = "CLA";
    var ClientId = this.auth.currentUserValue.ClientId;
    var LoginId = this.auth.currentUserValue.LoginId;
    this.claimservice.getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.ControlPermissions = res.Data;

                   

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

}
