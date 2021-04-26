export class PaymentsCredentials {
  Id: number;
  UserId: number;
  CreditCardNo: string;
  Cvvno: string;
  CardHolderName: string;
  ExpiryMonth: number;
  ExpiryYear: number;
  CardType: string;
  IsAutoPayment: boolean;
  CardMaskedNumber: string;
  ClientId: number;
  SourceSystemId: number;
  UpdatedBy: string;
  UpdateDateTimeServer: Date;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  PageNo: number;
  PageSize: number;
  IsDeleted: boolean;
}
