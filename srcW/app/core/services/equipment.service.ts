import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { PreferenceTypeService } from '.';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { PreferenceTypeService, UsersContactViewModel } from '..';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { EquipmentViewModel, EquipmentTypeAEModel, EquipmentTypeSaveModel, EquipmentTypeFreightModeMapModel, CopyEquipmentPropertyModel, MaterialPropertyDetailByEquipmentModel } from '../models/Equipment';
import { FreightMode } from '../../modules/system-settings/modals/freightmode';
import { MaterialPropertyDetailModel, EquipmentTypeMaterialPropertyDetailModel } from '../models/material.model';


const BASE_URL = environment.coreBaseApiUrl;
const MASTER_URL = environment.masterServerUrl;

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends BaseService{
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  permission: boolean = false;
  constructor(private http: HttpClient, private authservices: AuthService,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getEquipmentList(paginationModel: EquipmentViewModel) {
    
    return this.http.post<any>(`${environment.masterServerUrl}/EquipmentType/GetAllRecords`,
      paginationModel)
      .pipe(map(result => {
        return result;
      }));
  }

  getFrieghtModeList() {
    var RequestObject = {
      pageSize: 100,
      pageNo: 1

    };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FreightMode/List`,
      RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  getAll(freightModal: FreightMode) {    
    return this.http.post<any>(`${environment.coreBaseApiUrl}/FreightMode/GetAllRecords`, freightModal)
      .pipe(        
        map(response => { return response }
        ));
  }

  deleteEquipmentById(viewModel: EquipmentViewModel) {
    var RequestObject = {
      iDs: viewModel.selectedIds
    };
    return this.http.post<any>(`${environment.masterServerUrl}/EquipmentType/DeleteAll`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteEquipmentType(id: string, deletedBy: string) {
    return this.http.get<any>(`${environment.masterServerUrl}/EquipmentType/DeleteEquipmentType/${id}/${deletedBy}`)
      .pipe(map(user => {
        return user;
      }));
  }

  saveEquipmentType(modal: EquipmentViewModel[]) {    
    return this.http.post<any>(MASTER_URL + '/EquipmentType/SaveAll', modal, this.httpOptions)
      .pipe(map(saveresponse => {
        return saveresponse;
      }));
  }

  totalCount(modal: EquipmentViewModel) {    
    return this.http.post<any>(MASTER_URL + '/EquipmentType/TotalRecordsCount', modal, this.httpOptions)
      .pipe(map(saveresponse => {
        return saveresponse;
      }));
  }  

  getFreightsByEquipmentTypeID(modal: EquipmentTypeFreightModeMapModel) {    
    return this.http.post<any>(MASTER_URL + '/EquipmentType/GetFreightsByEquipmentTypeID', modal, this.httpOptions)
      .pipe(map(saveresponse => {
        return saveresponse;
      }));
  }

  updateEquipmentType(modal: EquipmentViewModel) {
    
    return this.http.post<any>(MASTER_URL + '/EquipmentType/Update', modal, this.httpOptions)
      .pipe(map(saveresponse => {
        return saveresponse;
      }));
  }

  totalMatCharCount(modal: EquipmentTypeMaterialPropertyDetailModel) {
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/GetCountMaterialsByEquipmentTypeCode', modal, this.httpOptions)
      .pipe(map(saveresponse => {
        return saveresponse;
      }));
  }

  getMaterialsPropertyByEquipmentCode(modal: EquipmentTypeMaterialPropertyDetailModel) {
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/GetMaterialPropertyByEquipmentTypeCode', modal, this.httpOptions)
      .pipe(
        map(materialpropertydetail => {
          return materialpropertydetail
        }
        ));
  }

  removeEquipmentTypeMaterialPropertyDetail(idslist: string) {
    var data = {
      IDs: idslist
    };
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/DeleteAll', data, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEquipmentPropertyFromOtherEquipment(copymodal: CopyEquipmentPropertyModel) {
    
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/CopyEquipmentPropDetailFromSelectedEquipment', copymodal, this.httpOptions)
      .pipe(
        map(propertycopy => {
          return propertycopy
        }
        ));
  }

  getMaterialPropertyDetailByEquipmentForPopUP(modal: MaterialPropertyDetailByEquipmentModel) {
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/GetMaterialPropertyByEquipmentForPopUp', modal, this.httpOptions)
      .pipe(
        map(equipmentTypematerialpropertyPopUP => {
          return equipmentTypematerialpropertyPopUP
        }
        ));
  }

  getTotalCountMatProDetailByEquipment(modal: MaterialPropertyDetailByEquipmentModel) {
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/GetTotalCountMaterialPropertyByEquipmentForPopUp', modal, this.httpOptions)
      .pipe(
        map(equipmentCount => {
          return equipmentCount
        }));
  }

  isEquipmentTypeExist(Modal: EquipmentViewModel) {
    return this.http.post<any>(MASTER_URL + '/EquipmentType/isEquipmentypeExist', Modal, this.httpOptions)
      .pipe(map(Equipexist => {
        return Equipexist;
      }));
  }
}
