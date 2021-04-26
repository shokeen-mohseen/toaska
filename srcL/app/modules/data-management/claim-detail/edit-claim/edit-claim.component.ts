import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { ClaimService } from '../../../../core/services/claim.service';
import { AuthService } from '../../../../core';
import { OrdermanagementCommonOperation } from '../../../../core/services/order-management-common-operations.service';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.css']
})
export class EditClaimComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  date6: Date;
  modalRef: NgbModalRef;
  constructor(public router: Router, public modalService: NgbModal, private claimService: ClaimService, private authservices: AuthService, private orderCommonService: OrdermanagementCommonOperation,) { }

  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};
  count = 3;

  ClaimforEdit: any[] = [];
  SelectedClaimId: number = 0;
  IsSetupAndNotify: boolean = false;
  IsApproved: boolean = false;
  ClaimStatusId: number = 0;

  ngOnInit(): void {

    if (this.claimService.ClaimforEdit != undefined) {
      this.ClaimforEdit = this.claimService.ClaimforEdit;
      if (this.ClaimforEdit.length > 0) {
        this.SelectedClaimId = this.ClaimforEdit[0].ClaimId;
        this.getClaimDataByClaimId();
      }

      //if (this.SalesOrderforEdit != undefined && this.SalesOrderforEdit.length > 0) {
      //  this.orderManagement.Id = Number(this.SalesOrderforEdit[0].OrderId);
      //  this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
      //}
      //else {
      //  this.buttonBar.disableAction('approveAndMas');
      //  this.buttonBar.disableAction('resendToMas');
      //  this.buttonBar.disableAction('calculate');
      //}
    }


    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      disabled: "false",
      searchBy: ['itemName'],

      addNewItemOnFilter: true
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName'],

      addNewItemOnFilter: false
    };

  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  getClaimDataByClaimId() {
    var ClientId = this.authservices.currentUserValue.ClientId;

    this.claimService.GetClaimByClaimId(this.SelectedClaimId, ClientId)
      .subscribe(result => {
        var data = result.data;
        //this.dataSource.data = [];
        //this.paginationModel.itemsLength = result.recordCount;

        //this.ELEMENT_DATA = [];
        //result.data.forEach((value, index) => {
        //  this.ELEMENT_DATA.push({
        //    ClaimId: value.claimId,
        //    ClaimStatus: value.claimStatus,
        //    ClaimFor: value.claimFor,
        //    BillingEntity: value.billingEntity,
        //    Customer: value.customer,
        //    BusinessPartner: value.businessPartner,
        //    InvoicedAmount: value.invoicedAmount,
        //    ClaimAmount: value.claimAmount,
        //    ApprovedAmount: value.approvedAmount,
        //    InvoiceNumber: value.invoiceNumber,
        //    Claimdate: value.createDateTimeServer != null ? this.setDateMMddyyyy(value.createDateTimeServer) : null,
        //    ApprovedBy: value.approvedBy
        //  })
        //})
        //this.dataSource.data = this.ELEMENT_DATA;
        //this.ClaimDetailsList = this.ELEMENT_DATA;
      }
      );
  }

  BindClaimDetails(claimId) {
    this.SelectedClaimId = claimId;
    this.getClaimDataByClaimId();
  }

  CompleteSetupAndNotify(e) {
    if (e.target.checked) {
      this.IsSetupAndNotify = true;
      var ClientId = this.authservices.currentUserValue.ClientId;
      var UserId = this.authservices.currentUserValue.UserId;

      var UpdateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());

      this.claimService.SetCompleteSetupAndNotify(ClientId, this.SelectedClaimId, this.IsSetupAndNotify, this.ClaimStatusId, UserId, UpdateDateTimeBrowserStr)
        .subscribe(result => {
          var data = result.data;
        }
        );
    } else if (e.target.checked == false) {
      this.IsSetupAndNotify = false;
      var ClientId = this.authservices.currentUserValue.ClientId;
      var UserId = this.authservices.currentUserValue.UserId;

      var UpdateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());

      this.claimService.SetCompleteSetupAndNotify(ClientId, this.SelectedClaimId, this.IsSetupAndNotify, this.ClaimStatusId, UserId, UpdateDateTimeBrowserStr)
        .subscribe(result => {
          var data = result.data;
        }
        );
    }
  }

  ApprovedClaim(e) {
    if (e.target.checked) {
      this.IsApproved = true;
      var ClientId = this.authservices.currentUserValue.ClientId;
      var UserId = this.authservices.currentUserValue.UserId;

      var UpdateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());

      this.claimService.SetApprovedClaim(ClientId, this.SelectedClaimId, this.IsApproved, this.ClaimStatusId, UserId, UpdateDateTimeBrowserStr)
        .subscribe(result => {
          var data = result.data;
        }
        );
    }
  }

}
