import { PaginationModel } from "./Pagination.Model";

export class OrderDetailsCM extends PaginationModel {
  Id: number;
  IsMass: number;
  OrganizationID: any;
  orderDate: string;
  orderId: number;
  orderStatusID: number;
  orderNumber: string;
  shipToAddress: string;
  deliveryDate: string;
  orderStatus: string;
  availableCreditLimit: string;
  orderAmount: string;
  remainingcredit: string;
  overrideCreditLimit: number;
  CreditAlertComment: string;
  isOverridden: boolean;
  overrideCreditHold: boolean;
  SalesOrderHeaderId: number;
  constructor() {
    super();
  }
}

export class InvoiceDetailsCM extends PaginationModel {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  billOfLading: string;
  orderNo: string;
  poNo: string;
  aging: string;
  invoiceAmount: number;
  openAmount: number;
  currentAmount: number;
  pastDueAmount: number;
  OrganizationID: number;
  SystemTypeCode: string;

  constructor() {
    super();
  }
}

export class CreditSummaryCM extends PaginationModel {
  id: number;
 // IsSelected: boolean;
 // organizationID: number;
  billingEntity: string;
  creditLimitfromMAS: number;
  availableCreditFromMAS: number;
  valueOfUnshippedPlannedOrdersInLamps: number;
  remainingCredit: number;
  constructor() {
    super();
  }
}

