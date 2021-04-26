export class IPayment {
  Currency: string;
  Amount: number;
  OrderID: string;
  ReceiptNo: string;
  PaymentID: string;
  SubscriptionID: number;
  MerchantID: string;
  IsDeleted: boolean;
  SourceSystemID?: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  ClientID: number;
  Signature: string;
}
