import { EntityclientPropertyControlValueViewModel } from "./Entity";


export class LocationContactViewModel {
  userContactId: number;
  isSelected: boolean;
  locationId: number;
  ContactActionType: string;
  referenceNo: string;
  contactTypeId: number;
  contactType: string;
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
  createDateTimeBrowser: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  updatedBy: string;
  constructor() {
    this.locationId = 0;
    this.referenceNo = '';
    this.contactTypeId = 0;
    this.contactType = '';
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
    this.workPhoneCountryCode = '+91';
    this.mobilePhoneCountryCode = '+91';
    this.mobilePhone = '';
    this.mobilePhoneSalt = '';
    this.email = '';
    this.emailSalt = '';
    this.primaryEmail = '';
  }

}
export class LocationAddressViewModel {
  referenceNo: string;
  addressTypeId: number;
  code: string;
  name: string;
  locationId: number;
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
  updatedBy: string;
  constructor() {
    this.referenceNo = '';
    this.addressTypeId = 0;
    this.code = 'AddressCode';
    this.name = '';
    this.locationId = 0;
    this.geoLocationId = 0;
    this.streetName1 = '';
    this.streetName2 = '';
    this.streetName3 = '';

  }
}

export class CommonCallListViewModel {
  ContactById?: number;
  //LocationId?: number;  
  ClientID: number;
  PageNo: number;
  PageSize: number;
  Action: string;
  ContactActionType: string;
  
  //PatientID?: number;
  
  constructor() {
    this.PageNo = 1;
    this.PageSize = 100;
    this.ContactActionType = LocationConstant.ContactActionType;
  }
}

export class MaterialCallListViewModel {
  LocationId?: number;
  ClientID: number;
  ContactActionType: string;
  Code: string;
  PageNo: number;
  PageSize: number;
  Action: string;  
  MaterialIds: string;
  Ids: string;
  PageAction: string;
  DeletedBy: string;
  PatientID?: number;

  constructor() {
    this.PageNo = 1;
    this.PageSize = 100;
    this.ContactActionType = LocationConstant.ContactActionType;
  }
}

export const LocationConstant = {
  Active: 'Active',
  Locked: 'Locked',
  Declined: 'Declined',
  ContactActionType: 'Location',
  PageAction:'Location',
  LocationId: 1502,
  LocationFunction: "CustomerLocation",
  PreferredEquipmentCode: "PreferedEquipmentType",
  MilesOverride: "MilesOverrideForCustomerFuelCharge",
  ScreenAction:"Customer"
}

export class LocationListViewModel {
  userLocationListId: number;
  userId: number;
  locationId: number;
  locationTypeId: number;
  locationFunctionId: number;
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
  PageActionType: string;
  LocationName: string;
  LocationTypeName: string;
  userLogin: string;
  planinglocationIds: string;
  planinglocationCount: number;
  constructor() {
    this.pageNo = 1;
    this.pageSize = 100;
    this.isPLocationSelected = false;
  }
}

export class LocationAddressCallListViewModel {
  AddressbyId: number;
 // LocationId?: number;
  ClientID: number;
  PageNo: number;
  PageSize: number;
  Action: string;
  AddressActionType: string;
  updatedBy: string;
//  PatientID?: number;
  constructor() {
  //  this.LocationId = LocationConstant.LocationId;
    this.PageNo = 1;
    this.PageSize = 100;
    this.AddressActionType = LocationConstant.ContactActionType;
  }
}

export class ToFromLocationViewModel {
  shipFromLocationId: number;
  fromCountry: string;
  fromState: string;
  fromCityCode: string;
  shipToLocationId: number;
  toCountry: string;
  toState: string;
  toCityCode: string;
}

export class ShippingLocationDefaultPackagingMaterialViewModel {

  id: number;
  locationId: number;
  materialId: number;
  materialName: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  pageAction: string;
  pageNo: number;
  pageSize: number;
  constructor() {
    this.pageNo = 0;
    this.pageSize = 10;
  }

}

export class LocationPreferredMaterialViewModel {
  id: number;
  locationId: number;
  materialId: number;
  materialName: string;
  quantity: number;
  uomId: number;
  uomName: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  pageAction: string;
  pageNo: number;
  pageSize: number;
  constructor() {
    this.pageNo = 0;
    this.pageSize = 10;    
  }
}

export class CustomerPropertyDetails { 

  id: number;
  locationId: number;
  entityPropertyId: number;
  entityPropertyCode: string;
  propertyValue: string;
  propertyValueName: string;
  propertiesUom: string;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  pageAction: string;
  pageNo: number;
  pageSize: number;
  constructor() {
    this.pageNo = 1;
    this.pageSize = 100;
    this.sourceSystemId = 1;
  }
}


export class LocationAverageShipFromMileMappingViewModel {
  id: number;
  shipToLocationId: number;
  shipFromLocationId: number;
  shipFromLocationName: string;
  locationFunctionName: string;
  locationFunctionId: number;
  selectedIds: string;
  miles: number;
  modifiedMiles: number;
  isDeleted: boolean;
  clientId: number;
  sourceSystemId: number;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  pageAction: string;
  pageNo: number;
  pageSize: number;
  constructor() {
    this.pageNo = 1;
    this.sourceSystemId = 1;
    this.pageSize = 10;
  }
}

export class GetDistanceViewModel {

}


export class LocationForecastMaterialModel {
  isSelected: boolean;
  id: number;
  locationId: number;
  materialId: number;
  materialCode: string;
  materialName: string;
  updateDateTimeBrowser: Date;
  updatedBy: string;
}

export class LocationDeleteModel {
  ids: number[];
  deletedBy: string;
}


export class LocationPropertyDeleteModel extends LocationDeleteModel{
  locationId: number;
  locationTypeCode: string;
}


export class DefaultLocationCharacteristicsModel {
  id: number;
  description: string;
  isDeleted: boolean;
  entityPropertyID: number;
  entityClientPropertyId: number;
  entityPropertyCode: string;
  entityCode: string;
  webControlCode: string;
  requiredUom: boolean;
  entityclientPropertyControlValueViewModel: EntityclientPropertyControlValueViewModel[] = [];
  valueSelected: any;
  uomSeleceted = [];
  uomSelected = [];
  isEditable: boolean;
}


export class LocationExistingCharacteristicsModel {
  isSelected: boolean;
  locationId: number;
  id: number;
  entityPropertyID: number;
  displayName: string;
  propertiesUom: string;
  propertyValue: string;
  isDeleted = false;
  clientId: number;
  updatedBy: string;
  createdBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  isEditable: boolean;
  constructor() {
  }

}
