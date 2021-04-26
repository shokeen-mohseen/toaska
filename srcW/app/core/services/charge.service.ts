import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Charge, ChargeMapComputationMethodMapping } from '../models/charge.model';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';

@Injectable({
  providedIn: 'root'
})

export class ChargeService extends BaseService {

  chargeScreenReadOnlyPermission: boolean = false;
  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getChargeTypeList() {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/chargetype/list`)
      .pipe(map(chargeTypeList => {
        return chargeTypeList;
      }));
  }

  getChargeCategoryList() {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/chargecategory/list`)
      .pipe(map(chargecategoryList => {
        return chargecategoryList;
      }));
  }

  getChargeComputationMethodList() {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/chargecomputationmethod/list`)
      .pipe(map(chargeComputationMethodList => {
        return chargeComputationMethodList;
      }));
  }

  getChargeComputationMappingByChargeId(chargeId) {
    return this.http
      .post<any>(`${this.BASE_SERVICE_URL}/ChargeComputationMethodMapping/GetComputationMappingByChargeId?chargeId=${chargeId}`
      , chargeId)
      .pipe(map(chargeComputationMethodList => {
        return chargeComputationMethodList;
      }));
  }

  getChargeList() {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/charge/list`)
      .pipe(map(charge => {
        return charge;
      }));
  }

  getChargeDetailList(paginationModel: Charge) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/charge/GetChargeDetails`,
      paginationModel)
      .pipe(map(charge => {
        return charge;
      }));
  }

  updateCharge(chargeViewModels: Charge[]) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/charge/update`, chargeViewModels)
      .pipe(map(response => {
        return response;
      }));
  }

  getChargeComputationMethodMappingList(paginationModel: ChargeMapComputationMethodMapping) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/chargecomputationmethodmapping/Getall`, paginationModel)
      .pipe(map(charge => {
        return charge;
      }));
  }

  updateChargeComputationMapping(selectedChargeMapComputationMethodMapping: ChargeMapComputationMethodMapping) {
    return this.http.post<any>(`${this.BASE_SERVICE_URL}/chargecomputationmethodmapping`,
      selectedChargeMapComputationMethodMapping)
      .pipe(map(charge => {
        return charge;
      }));
  }
}
