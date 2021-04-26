/*
      Developer Name: Rizwan Khan
      Date: Sep 04, 2020
      TFS ID: 17
      Logic Description: This is used as base class in partograph model
   */
export class GlobalConstants {
  public static FETAL_HEART_RATE: string = "FHR";
  public static BLOOD_PRESSURE: string = "BP";
  public static PULSE: string = "PL";
  public static CONTRACTION_PER_10MINS: string = "CN";
  public static TEMPERATURE: string = "TEMP";
  public static OXYTOCIN: string = "OXY";
  public static DROPS: string = "DROPS";
  public static CERVIX: string = "CERVIX";
  public static DESCENT_OF_HEAD: string = "DESCENT";
  public static VOlUME: string = "VL";
  public static PROTEIN: string = "PT";
  public static ACETON: string = "ACT";
  public static CAPUT: string = "CAPUT";
  public static AMNIOTIC: string = "AMF";
  public static MOULDING: string = "MD";

  // Partograph Monitoring Stage Wise Code for Dynamic Measurement

  public static PARTOGRAPH_MONITORING_STAGE3 = "PMS-3";
  public static PARTOGRAPH_MONITORING_STAGE4 = "PMS-4";

  // Registration Page Code for Dynamic parameter
  public static PATIENT_REGISTRATION_STAGE1 = "PREG-1";

  // PrepartumCare Page Code for Dynamic parameter
  public static PATIENT_PrepartumCare_STAGE1 = "PREC-1";
  public static PATIENT_PrepartumCare_STAGE2 = "PREC-2";
  public static PATIENT_PrepartumCare_STAGE3 = "PREC-3";
  public static PATIENT_PrepartumCare_STAGE4 = "PREC-4";
  public static PATIENT_PrepartumCare_STAGE5 = "PREC-5";

  // PostpartumCare Page Code for Dynamic parameter
  public static PATIENT_PostpartumCare_STAGE1 = "POSTC-1";
  public static PATIENT_PostpartumCare_STAGE2 = "POSTC-2";
  public static PATIENT_PostpartumCare_STAGE3 = "POSTC-3";
  public static PATIENT_PostpartumCare_STAGE4 = "POSTC-4";
  public static PATIENT_PostpartumCare_STAGE5 = "POSTC-5";

  //END

  // 
 // public static PARTOGRAPH_MONITORING_STAGE41 = "PMS-4";

  //public static FAHRENHEIT_FORMULA = 


  // Added By Kapil
  public static Success: string = "Success";
  public static CustomerReturn: string = "CustomerReturn";
  public static ChargeOrder: string = "ChargeOrder";

  public static PriceMethodCateoryCode: string = "PricingMethod";

  public static SUCCESS_MESSAGE = "Record saved successfully";
  public static SUCCESS_UPDATE_MESSAGE = "Record updated successfully";
  public static FAILED_MESSAGE = "The records could not be deleted. Please contact Tech Support";
  public static Not_found_MESSAGE = "No record found.";
 
  public static MaxLength_MESSAGE = "max length 500 characters only!";

  public static BLOODPRESSURE_COMPARE_MESSAGE = "Diastolic Pressure(mmHg) can never be higher than Systolic Pressure(mmHg).";

  public static OPERATING_LOCATION_CODE = "OP";

  public static SourceSystemId = 1;

  public static DEFAULT_GEOLOCATION_MODE: string = "COUNTRY";
  public static STATE_GEOLOCATION_MODE: string = "STATE";
  public static CITY_GEOLOCATION_MODE: string = "CITY";
  public static ZIP_GEOLOCATION_MODE: string = "ZIP";
  public static EXISTING_ADDRESS_MODE: string = "EXISTINGADDRESS";

  
  //Add selected code by default
  public static EA: string = "EA";
  public static PLT: string = "PLT";
  public static Customer: string = "Customer";
  public static CPUOrder: string = "CPUOrder";

  public static OpenOrderNeedsToBeCompleted: string = "OpenOrderNeedsToBeCompleted";
  public static SendforShipping: string = "SendforShipping";
  public static StockTransfer: string = "StockTransfer";
  public static Collections: string = "Collections";


  public static Primary_Contact_Information: string = "PC01";
  public static Emergency_Contact_Information: string = "EC01";
  public static Primary_Physician_Information: string = "PPC01";
  public static Secondary_Physician_Information: string = "SPI01";
  public static Referral_Information: string = "RF01";

  // Address Type 
  public static HOME_ADDRESS_TYPE_CODE: string = "HOMEADDRESS";
  public static WORK_ADDRESS_TYPE_CODE: string = "WORKADDRESS";
  public static MAILING_ADDRESS_TYPE_CODE: string = "MAILINGADDRESS";
    
  // Address Type 
  public static PRIMARY_ADDRESS_TYPE_CODE: string = "PrimaryAdd";
  public static EMERGENCY_ADDRESS_TYPE_CODE: string = "EmergencyAdd";

  public static PerEA: string = "PerEA";
  public static PerPallet: string = "PerPallet";
  public static PerBag: string = "PerBag";
  public static PerEAPerMonth: string = "PerEAPerMonth";
  public static PerEAPerWeek: string = "PerEAPerWeek";
  public static PercentageAmount: string = "%Amount";
  public static DOE: string = "DOE";
  public static UnusedPerPallet: string = "UnusedPerPallet";
  public static PerShipment: string = "PerShipment";
  public static ChargeAmount: string = "ChargeAmount";
  public static PerUnit: string = "PerUnit";
  public static PerUnitXPerEA: string = "PerUnitXPerEA";



 
  public static NonBillable: string = "NonBillable";
  public static Billable: string = "Billable";
  public static DefaultMaterialChargeCode: string = "Reusable Plastic Container";
  public static NotRemoved: string = "Selected item can't not be deleted.";
  public static ValidationError: string = "Please provide the valid data.";

  public static PelletCode: string = "PLT";
  public static BagCode: string = "BAG";

  public static PalletChargeDefault: string = "Pallet";
  public static BagChargeDefault: string = "Bag";

  public static MaterialItem: string = "Material";
  public static PackageItem: string = "Package";

  //order success
  public static OrderSuccess: string = "Order saved successfully";

  public static AdjustmentChargesUpdate: string = "Adjustment chagres updated successfully.";
  //Preferred Material
  public static materialId: string = "materialId";
  public static quantity: string = "quantity";
  public static uomId: string = "uomId";


  // Contactfield  
  public static contactTypeId: string = "contactTypeId";
  public static firstName: string = "firstName";
  public static lastName: string = "lastName";
  public static email: string = "email";
  public static workPhone: string = "workPhone";
  public static mobilePhone: string = "mobilePhone";
  public static PleaseselectAddressType: string = "Please select Address Type";

  public static OrderUnsuccess: string = "The order has not been saved";
  public static AlreadyaddedMaterial: string = "The charge for material has already been added to the order. Please edit the value to reflect updated value";
  public static AlreadyaddedCharge: string = "The selected charge is already added to the order. Please edit the charge value";
  public static Alreadyadded: string = "Duplicate data can not be inserted";
  public static delete_message: string = "The record is deleted successfully";

  public static OrganizationTypeId: number = 1;

  public static OrganizationTypeCode: string = "OP";

  public static PageActionTypeUser: string = "User";
  public static PageActionTypeCustomer: string = "Location";
  public static OrganizationTypeIdCust: number = 6;

  public static OrganizationTypeCodeCust: string = "Customer";

  public static OrderIDPreferredMaterial: number = 0;
  public static SectionIDPreferredMaterial: number = 0;

  public static OrderTypeIDForCustomer: number = 1;
  public static SectionIDDefaultPallet: number = 1;
  public static DecimalPrferenceForMoney: string = "DefaultNoOfDecimalPlacesForMoney";

  public static OperatingLocation_Active = 'Operating location activated successfully';
  public static OperatingLocation_InActive = 'Operating location de-activated successfully';
  public static OperatingLocation_SelectActive = 'please select operating location to active.';
  public static OperatingLocation_SelectInActive = 'please select operating location to Inactive.';
  public static decimalCode = 'DefaultNoOfDecimalPlacesForMoney';

  public static Characteristics_delete_Record_message = 'The records are deleted successfully';
  public static Contact_delete_Record_message = 'Contact deleted successfully.';
  public static Address_delete_Record = 'Address deleted successfully.';

  public static select_checkbox_messageon_grid = 'Please select at least one record';


  public static error_message = 'An error occurred during this operation. Please contact Tech Support';

  public static Authentication_message = 'Not authorised user.';
  //public static error_message = 'An error occurred during this operation. Please contact Tech Support';
  
}

