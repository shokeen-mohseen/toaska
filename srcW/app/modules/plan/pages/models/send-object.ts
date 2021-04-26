export class Sunbscription {
  UserId: number;
  ClientId: number;
  PackageId: number;
  PromotionId: number;
  SubscriptionStatus: boolean;
  DeviceId: number;
  StartDate: Date;
  EndDate: Date
  ActivationCode: string;
  IsActive: boolean
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  IsAutoRenew: number;

}

export class SendObject extends Sunbscription {
  PageNo: number;
  PageSize: number;
  ClientId: number;
  Id?: number;
}


