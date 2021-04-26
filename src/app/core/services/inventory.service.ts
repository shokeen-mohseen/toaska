import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { PreferenceTypeService, UsersContactViewModel } from '..';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { InventoryModel, CommonModel, CommentModel } from '../models/inventory.model';


const BASE_URL = environment.coreBaseApiUrl;
const MASTER_URL = environment.masterServerUrl;

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(private http: HttpClient, private authservices: AuthService,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  GetAllCurrentMaterialOnhand(paginationModel: InventoryModel) {
    return this.http.post<any>(BASE_URL + '/CurrentMaterialOnhand/GetAllCurrentMaterialOnhand', paginationModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  totalCount(modal: InventoryModel) {
    return this.http.post<any>(BASE_URL + '/CurrentMaterialOnhand/TotalRecordsCount', modal, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetSumQuantity(modal: InventoryModel) {
    return this.http.post<any>(BASE_URL + '/CurrentMaterialOnhand/TotalSumQuantity', modal, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetLocationFunction(modal: CommonModel) {
    return this.http.post<any>(MASTER_URL + '/LocationFunction/List', modal, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetLocationbyLocationFunction(modal: CommonModel) {
    return this.http.post<any>(BASE_URL + '/Location/GetLocationByLocationfunction', modal, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getMaterialList(modal: CommonModel) {
    return this.http.post<any>(BASE_URL + '/Material/ListMaterialCommodity', modal, this.httpOptions)
      .pipe(map(material => {
        return material
      }));
  }

  getUOMList(modal: CommonModel) {    
    return this.http.post<any>(MASTER_URL + '/Uom/List', modal, this.httpOptions)
      .pipe(map(uomlist => {
        return uomlist
      }));
  }

  saveCurrentMaterialOnhand(modal: InventoryModel) {
    return this.http.post<any>(BASE_URL + '/CurrentMaterialOnhand/SaveCurrentMaterialOnhand', modal, this.httpOptions)
      .pipe(map(inventory => {
        return inventory;
      }));
  }

  saveComment(modal: CommentModel) {
    return this.http.post<any>(BASE_URL + '/CurrentMaterialOnhand/UpdateComment', modal, this.httpOptions)
      .pipe(map(comment => {
        return comment;
      }));
  }

  updateInventory(modal: InventoryModel) {
    return this.http.post<any>(BASE_URL + '/CurrentMaterialOnhand/UpdateCurrentMaterialOnhand', modal, this.httpOptions)
      .pipe(map(inventory => {
        return inventory;
      }));
  }

  removeInventory(idslist: string) {
    var data = {
      IDs: idslist
    };
    return this.http.post<any>(BASE_URL + '/CurrentMaterialOnhand/DeleteAll', data, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
