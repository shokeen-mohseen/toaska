import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { PreferenceTypeService } from './preferencetype.service';


@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public BASE_SERVICE_URL = env.coreBaseApiUrl;
  public SERVER_SERVICE_URL = env.serverUrl;
  public COMMON_SERVICE_URL = env.commonServerUrl;
  public MASTER_SERVICE_URL = env.masterServerUrl;

  private preferenceService: PreferenceTypeService


  constructor(preferenceService: PreferenceTypeService) {
    this.preferenceService = preferenceService;
  }



  async getDefaultPageSize() { 
    if (this.preferenceService.pageSize.value < 1) {      
      return await this.preferenceService.getPreferenceTypeByCode('PageSize').toPromise()
        .then(result => {         
          if (result != null && result.data != null)
          {
            this.preferenceService.pageSize.next(parseInt(result.data.preferenceValue));
            return parseInt(result.data.preferenceValue);
          } else {
            // Defaulting it to 10 just in case if the api call fails and we have no response.
            return 10;
          }
        });
    }
    return this.preferenceService.pageSize.value;
  }


  async getMaxEditedRecordsCount() {
    if (this.preferenceService.editRecordCount.value < 1) {      
      return await this.preferenceService.getPreferenceTypeByCode('MaxNumberOfRecordsToBeEditedAtATime').toPromise()
        .then(result => {
          if (result != null && result.data != null) {
            this.preferenceService.editRecordCount.next(parseInt(result.data.preferenceValue));
            return parseInt(result.data.preferenceValue);
          } else {
            // Defaulting it to 20 just in case if the api call fails and we have no response.
            return 20;
          }
        });
    }
    return this.preferenceService.editRecordCount.value;
  }

  async defaultDecimalPlacesForMoney() { 
    if (this.preferenceService.DefaultDecimalPlacesForMoney.value < 1) {      
      return await this.preferenceService.getPreferenceTypeByCode('DefaultNoOfDecimalPlacesForMoney').toPromise()
        .then(result => {
          if (result != null && result.data != null) {
            this.preferenceService.DefaultDecimalPlacesForMoney.next(parseInt(result.data.preferenceValue));
            return parseInt(result.data.preferenceValue);
          } else {
            // Defaulting it to 4 just in case if the api call fails and we have no response.
            return 4;
          }
        });
    }
    return this.preferenceService.DefaultDecimalPlacesForMoney.value; 
  }

  async maxValueForNoOfUnitsOnAPallet() {
    if (this.preferenceService.MaxValForNoOfUnitsOnAPallet.value < 1) {
      return await this.preferenceService.getPreferenceTypeByCode('MaximumValueForNoOfUnitsOnAPallet').toPromise()
        .then(result => {
          if (result != null && result.data != null) {
            this.preferenceService.MaxValForNoOfUnitsOnAPallet.next(parseInt(result.data.preferenceValue));
            return parseInt(result.data.preferenceValue);
          } else {
            // Defaulting it to 999 just in case if the api call fails and we have no response.
            return 999;
          }
        });
    }
    return this.preferenceService.MaxValForNoOfUnitsOnAPallet.value;
  }

  async maxLengthOfMaterialDescription() {
    if (this.preferenceService.MaxLengthOfMaterialDesc.value < 1) {
      return await this.preferenceService.getPreferenceTypeByCode('MaxLengthOfMaterialDescription').toPromise()
        .then(result => {
          if (result != null && result.data != null) {
            this.preferenceService.MaxLengthOfMaterialDesc.next(parseInt(result.data.preferenceValue));
            return parseInt(result.data.preferenceValue);
          } else {
            // Defaulting it to 30 just in case if the api call fails and we have no response.
            return 30;
          }
        });
    }
    return this.preferenceService.MaxLengthOfMaterialDesc.value;
  }

  async maxValForNoOfUnitsInAnEquipment() {
    if (this.preferenceService.MaxValForNoOfUnitsInAnEquipment.value < 1) {
      return await this.preferenceService.getPreferenceTypeByCode('MaximumValueForNoOfUnitsInAnEquipment').toPromise()
        .then(result => {
          if (result != null && result.data != null) {
            this.preferenceService.MaxValForNoOfUnitsInAnEquipment.next(parseInt(result.data.preferenceValue));
            return parseInt(result.data.preferenceValue);
          } else {
            // Defaulting it to 99999 just in case if the api call fails and we have no response.
            return 99999;
          }
        });
    }
    return this.preferenceService.MaxValForNoOfUnitsInAnEquipment.value;
  }

  async maxValForNoOfPalletsInAnEquipment() {
    if (this.preferenceService.MaxValForNoOfPalletsInAnEquipment.value < 1) {
      return await this.preferenceService.getPreferenceTypeByCode('MaximumValueForNoOfPalletsInAnEquipment').toPromise()
        .then(result => {
          if (result != null && result.data != null) {
            this.preferenceService.MaxValForNoOfPalletsInAnEquipment.next(parseInt(result.data.preferenceValue));
            return parseInt(result.data.preferenceValue);
          } else {
            // Defaulting it to 999 just in case if the api call fails and we have no response.
            return 999;
          }
        });
    }
    return this.preferenceService.MaxValForNoOfPalletsInAnEquipment.value;
  }

  async getThesHoldDaysCreditCalculationDays() {
    if (this.preferenceService.ThresHoldPeriodDaysForCredit.value < 1) {
      return await this.preferenceService.getPreferenceTypeByCode('NotPlanOrderPriorNumberOfDays').toPromise()
        .then(result => {
          if (result != null && result.data != null) {
            this.preferenceService.ThresHoldPeriodDaysForCredit.next(parseInt(result.data.preferenceValue));
            return parseInt(result.data.preferenceValue);
          } else {
            // Defaulting it to 999 just in case if the api call fails and we have no response.
            return 1;
          }
        });
    }
    return this.preferenceService.ThresHoldPeriodDaysForCredit.value;
  }
}
