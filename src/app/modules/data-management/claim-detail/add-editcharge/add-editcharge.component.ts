import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Claim } from '@app/core/models/claim.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../core';
import { ClaimService } from '../../../../core/services/claim.service';
import { ChargeDetailComponent } from '../charge-detail/charge-detail.component';
import { ClaimModel, AddClaimModel } from '../../../../core/models/claim.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddClaimComponent } from '../add-claim/add-claim.component';
import { ElementSchemaRegistry } from '@angular/compiler';
@Component({
  selector: 'app-add-editcharge',
  templateUrl: './add-editcharge.component.html',
  styleUrls: ['./add-editcharge.component.css']
})
export class AddEditchargeComponent implements OnInit {
  

  constructor(public activeModal: NgbActiveModal, public router: Router, public modalService: NgbModal, private auth: AuthService, private claimservice: ClaimService, private toastrService: ToastrService,) { }
  ClaimObject: Claim = new Claim();
  //@ViewChild(AddClaimComponent) private addClaimComponent: AddClaimComponent;
  
  AddClaimModel: AddClaimModel = new AddClaimModel();
 
  settingsA = {};
  settingsB = {};

 
  count = 3;
  ClaimStatusList = [];
  ClaimStatusSelected = [];
  ChargetList: any = [];
  ChargeSelectedList = [];
  IsInvoiced: boolean = true;
  IsShipped: boolean = true;

  ngOnInit(): void {

    this.GetData();

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

    this.ClaimObject.ClientId = this.auth.currentUserValue.ClientId;
    this.ClaimObject.UpdatedBy = this.auth.currentUserValue.LoginId;

    this.AddClaimModel.ClientID = this.auth.currentUserValue.ClientId;
    this.AddClaimModel.CreatedBy = this.auth.currentUserValue.LoginId;
  
    this.GetClaimStatus();
    
  }
 
 
  
  

  GetClaimStatus() {
    this.claimservice.GetClaimStatus(this.ClaimObject)
      .subscribe(res => {
        ;
        var Data = res;

        if (Data.length > 0) {
          for (var i = 0; i < Data.length;i++) {
            if (Data[i].itemName == "Open" || Data[i].itemName == "Denied" || Data[i].itemName == "Approved") {
              this.ClaimStatusList.push({ "id": Data[i].id, "itemName": Data[i].itemName });
            }
          }
        }
        var nn=  this.ClaimStatusList;

        let ClaimStatus = res.find(d => d.Code == "Open");
        this.ClaimStatusSelected.push({ "id": ClaimStatus.id, "itemName": ClaimStatus.itemName });
        this.AddClaimModel.StatusID = Number(ClaimStatus.id);
      });
  }

  GetCharge(ClientID: number, Category: number) {
    
    this.claimservice.GetCharge(ClientID, Category)
      .subscribe(res => {
       
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
    ;
    if (!!item.id) {
      this.AddClaimModel.StatusID = Number(item.id);
    }
  }

  StatusOnDeSelectAll(item: any) {
    this.AddClaimModel.StatusID = Number(0);
  }
  SaveClaimDetailsData() {
    var tt = this.AddClaimModel
    ;
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
      CreatedBy: this.AddClaimModel.CreatedBy
    }

    if (RequestedObject.ChargeID < 1 || RequestedObject.ChargeID < 1) {
      this.toastrService.warning('Please select mandatory fields.');
      return;
    }

    this.Save(RequestedObject);

  }
  numberOnly(event): boolean {
    //const charCode = (event.which) ? event.which : event.keyCode;
    //if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //  return false;
    //}
    return true;
  }

  Save(RequestedObject: any) {
    
    this.claimservice.Save(RequestedObject)
      .subscribe(res => {
       
        var tt = res.data;
        if (res.data.length > 0) {
          this.toastrService.success(res.data[0].message);
        //  this.addClaimComponent.GetClaimFilterData(0, this.AddClaimModel.ClientID, 0, this.AddClaimModel.ClaimID, 0);
          this.activeModal.dismiss('Cross click');
        }
       
      });
  }

  GetData() {
    
    if (this.claimservice.ClaimData != undefined && this.claimservice.ClaimData != null) {
      this.GetCharge(Number(this.claimservice.ClaimData.ClientID), this.claimservice.ClaimData.ClaimForID);
      this.AddClaimModel.ClaimID = this.claimservice.ClaimData.ClaimID;
    }
   
  }
}
