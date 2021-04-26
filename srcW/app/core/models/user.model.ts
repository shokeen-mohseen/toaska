/*
      Developer Name: Vinay Kumar
      File Modify By: Vinay Kumar
      Date: Aug 29, 2020
      TFS ID: 17214
      Logic Description: Token variable is coming in API "AuthToken" and add class .UsersViewModel
      Start Code
      Line number 20, 30
      */

import { Role } from "./role";

export class User {
  id?: number;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  AuthToken?: string;
  clientId?: string;
  clientName?: string;
  path?: string;
  validation?: string;
  alert?: string;
  ClientId?: number;
  Organizetion?: number;
  LoginId?: string;
  UserId?: number;
  IsTempPassword?: boolean;
  SourceSystemID?: number;
}

export class UsersViewModelId {
  id: number;
  usersViewModel: UsersViewModel;
  constructor() {
    this.usersViewModel = new UsersViewModel();
  }
}

export class UsersViewModel {
  userId: number;
  loginId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  prefix: string;
  suffix: string;
  orgnizationId: number;
  clientId: number;
  indexId: number;
  createDateTimeBrowser: string | Date;
  updateDateTimeBrowser: string | Date;
  createdBy: string;
  updatedBy: string;
  updatebyTimeBrowser: string;
  userCount: number;
  sourceSystemID: number;
  constructor() {
    this.loginId = '';
    this.firstName = '';
    this.lastName = '';
    this.middleName = '';
    this.prefix = 'Mr.';
    this.suffix = '';
    //this.orgnizationId = 2;
    this.userId = 0;
    this.indexId = 0;
    this.userCount = 0;
    this.sourceSystemID = 0;
  }

  /*TFS ID: 17214
   End Code*/

}

/*TFS ID: 17214
 start Code*/
export class UsersContactViewModel {
  ContactById: number;
  userContactId: number;
  isSelected: boolean;
  userId: number;
  ContactActionType: string;
  referenceNo: string;
  contactTypeId: number;
  code: string;
  firstName: string;
  middleName: string;
  lastName: string;
  prefix: string;
  suffix: string;
  nickName: string;
  description: string;
  workPhone: string;
  workPhoneSalt: string;
  workPhoneCountryCode: string;
  mobilePhoneCountryCode: string;
  mobilePhone: string;
  mobilePhoneSalt: string;
  email: string;
  emailSalt: string;
  primaryEmail: string;
  clientId: number;
  ClientID: number;
  PatientId: number;
  LocationId: number;
  createDateTimeBrowser: Date;
  updateDateTimeBrowser: Date;
  updateDateTimeServer: Date;
  createDateTimeServer: Date;
  createdBy: string;
  updatedBy: string;
  emailNotificationAllow: boolean;
  workPhoneNotificationAllow: boolean;
  mobilePhoneNotificationAllow: boolean
  constructor() {
    this.workPhoneNotificationAllow = false;
    this.emailNotificationAllow = false;
    this.mobilePhoneNotificationAllow = false;
    this.userId = 0;
    this.referenceNo = '';
    this.contactTypeId = 0;
    this.code = 'UserCode';
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.prefix = 'Mr.';
    this.suffix = '';
    this.nickName = '';
    this.description = '';
    this.workPhone = '';
    this.workPhoneSalt = '';
    this.workPhoneCountryCode = '+01';
    this.mobilePhoneCountryCode = '+01';
    this.mobilePhone = '';
    this.mobilePhoneSalt = '';
    this.email = '';
    this.emailSalt = '';
    this.primaryEmail = '';
    this.LocationId = 0;
  }

}
export class UsersAddressViewModel {
  referenceNo: string;
  addressTypeId: number;
  code: string;
  name: string;
  userId: number;
  geoLocationId: number;
  streetName1: string;
  streetName2: string;
  streetName3: string;
  clientId: number;
  userAddressId: number;
  isAddressSelected: boolean;
  ContactActionType: string;
  addressTypeName: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityCode: string;
  cityName: string;
  zipCode: string;

  constructor() {
    this.referenceNo = '';
    this.addressTypeId = 0;
    this.code = 'AddressCode';
    this.name = '';
    this.userId = 0;
    this.geoLocationId = 0;
    this.streetName1 = '';
    this.streetName2 = '';
    this.streetName3 = '';

  }
}


export class CommonCallListViewModel {
  ContactById?: number;
  UserId?: number;
  ClientID: number;
  PageNo: number;
  PageSize: number;
  Action: string;
  PatientID?: number;
  ContactActionType: string;
  constructor() {
    this.PageNo = 1;
    this.PageSize = 100;
    this.ContactActionType = UserConstant.ContactActionType1;
  }
}



export class PeriodicElement {
  Id: number;
  LoginId: string;
  UserName: string;
  CodeMobilePhone: string;
  OrganizationName: string;
  RoleName: string;
  LocationName: string;
  Status: string;
  IsSeleted: boolean = false;
  UserCount: number = 0;
  constructor() {
    this.IsSeleted = false;
    this.UserCount = 0;
  }
}

export class CommonStatusListViewModel {

  ClientID: number;
  Ids: string;
  Action: string;
  UpdateBy: string;
  UpdateDateTimeBrowser: Date;
}

export class UserResponse {
  StatusCode: number
  RecordCount: number
  Message: string
  Data: any
}

export const UserConstant = {
  Active: 'Active',
  NewUser: 'New User',
  Locked: 'Locked',
  Declined: 'Declined',
  ContactActionType: 'User',
  ContactActionType1: 'Patient'
}

export class UserRolesListViewModel {
  userRolesListId: number;
  userId: number;
  roleId: number;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  pageNo: number;
  pageSize: number;
  isSelected: boolean;
  roleName: string;
  userLogin: string;
  constructor() {
    this.pageNo = 1;
    this.pageSize = 10;
    this.isSelected = false;
  }
}

export class UserLocationListViewModel {
  userLocationListId: number;
  userId: number;
  locationId: number;
  locationTypeId: number;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  pageNo: number;
  pageSize: number;
  isPLocationSelected: boolean;
  LocationName: string;
  LocationTypeName: string;
  userLogin: string;
  planinglocationIds: string;
  planinglocationCount: number;
  constructor() {
    this.pageNo = 0;
    this.pageSize = 10;
    this.isPLocationSelected = false;
  }
}

export class RolesViewModel {
  Id: number;
  Name: string;
  IsDeleted: boolean;
  SourceSystemID?: number;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  ClientID: number;
  UserId: number;
  PageNo: number;
  PageSize: number;
  constructor() {
    this.PageNo = 1;
    this.PageSize = 10;
  }
}

export class CommonPaginatorListViewModel {

  ClientID: number;
  PageNo: number;
  PageSize: number;
  Action: string;
  ContactActionType: string;
  Filter: string;
  SortOrder: string;

  constructor() {
    this.PageNo = 0;
    this.PageSize = 10;
    this.ContactActionType = UserConstant.ContactActionType;
  }
}

export class AddressCallListViewModel {
  AddressbyId: number;
  //UserId?: number;
  //ClientID: number;
  PageNo: number;
  PageSize: number;
  Action: string;
  AddressActionType: string;
  //PatientID?: number;
  constructor() {
    this.PageNo = 1;
    this.PageSize = 100;
    this.AddressActionType = UserConstant.ContactActionType;
  }
}
