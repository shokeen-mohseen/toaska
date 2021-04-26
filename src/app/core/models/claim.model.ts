import { PaginationModel } from "./Pagination.Model";

export class Claim extends PaginationModel {
  ClientId: number;
  UpdatedBy?: string;
  constructor() {
    super();
  }
  
}

export class ClaimFilterData {
  constructor() {

    this.ID = 0;
    this.ClaimID = 0;
    this.DChargeID = 0;
    this.DStausID = 0;
  }
  selectRow: string;
  Buspartner: string;
  Customer: string;
  Locfro: string;
  Tolocation: string;
  Material: string;
  Shipment: string;
  Invoiceamount: string;
  Claimamount: string;
  Claimqunatity: string;
  FReamount: string;
  Aproved: string;
  Invnumber: string;
  Satatusdate: string;
  Status: string;
  Aprovedcomnt: string;
  ID: number;
  ClaimID: number;
  DStausID: number;
  DChargeID: number;
  MaterialID: number;
  IsDeleted: number;
}

export class ClaimModel {
  constructor() {

    this.ClaimStatusID = 0;
    this.ClaimForID = 0;
   // this.ShipmentID = 0;
    //this.OrderID = 0;
    this.ClaimID = 0;
    this.ClientID = 0;
    //this.FromshipdatecalendarDate = null;
    //this.ToshipdatecalendarDate = null;
    this.ClaimComments = "";
    this.LocationId = null;
    this.EntityId=null;
    this.EntityKeyId = null;
    this.InvoiceVersion = "";
    this.Title = "";
  }
  DateOfClaim: Date;
  ClaimStatusID: number;
  ClaimForID: number;
  //ShipmentID: number;
 // OrderID: number;
  ClaimID: number;
  ClientID: number;
  FromshipdatecalendarDate: string;
  ToshipdatecalendarDate: string;
  //Invoicenumber: string;
  //ClaimId: number;
  Title: string;
  ClaimNumber: string;
  InvoiceNumber: string;
  InvoiceVersion: string;
  DateSubmitted: string;//date
  EntityId: number;
  EntityKeyId: number;
  LocationId: number;
 // ClaimStatusId: number;
  //ClaimForId: number;
  StatusChangedDateTime: string;//date
  StatusChangedBy: string;
  SubmittedBy: string;
  ApprovedBy: string;
  ClaimComments: string;
  SetupComplete: boolean;
  SetupCompleteDateTime: string;//date
  IsDeleted: boolean;
  ClientId: number;
  SourceSystemId: number;
  UpdatedBy: string;
  UpdateDateTimeServer: string;//DateTime
  UpdateDateTimeBrowser: string;//DateTime
  CreatedBy: string;
  CreateDateTimeBrowser: string;//DateTime
  CreateDateTimeServer: string;//DateTime
  Claimamount: string;
  Approvedamount: string;
  IsSetupAndNotify: boolean = false;
  IsApproved: boolean = false;
  ClaimStatus: string;
  UpdateDate: string;
  CreateDate: string;
  CreateDateTimeBrowserStr: string;
  UpdateDateTimeBrowserStr: string;

}

export class AddClaimModel {
  constructor() {

    this.ID = 0;
    this.ClientID = 0;
    this.ClaimID = 0;
    this.BusinessLocationID = 0;
    this.CustomerLocationID = 0;
    this.FromLocationID = 0;
    this.ToLocationID = 0;
    this.MaterialID = 0;
    this.ChargeID = 0;
    this.ShippedQuantity = null;
    this.InvoicedAmount = null;
    this.ClaimedQuantity = null;
    this.ClaimAmount = null;
    this.RecommendedAmount = null;
    this.ApprovedAmount = null;
    this.InvoiceNumber = null;
    this.StatusID = 0;
    this.ApproverComment = null
    this.CreatedBy = null;
  }
  ID: number;
  ClaimID: number;
  ClientID: number;
  BusinessLocationID: number;
  CustomerLocationID: number;
  FromLocationID: number;
  ToLocationID: number;
  MaterialID: number;
  ChargeID: number;
  ShippedQuantity: number;
  InvoicedAmount: number;
  ClaimedQuantity: number;
  ClaimAmount: number;
  RecommendedAmount: number;
  ApprovedAmount: number; 
  InvoiceNumber: string;
  StatusID: number;
  ApproverComment: string;
  CreatedBy: string;


}

