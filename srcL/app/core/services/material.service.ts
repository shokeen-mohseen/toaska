import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { MaterialCommodityMap, MaterialGroupModel, MaterialGroupDetailModel, MaterialHierarchyModel, MaterialHierarchyDetailModel, MaterialPropertyModel, MaterialPropertyDetailModel, UOMModel, SaveUpdateModel, CopyMaterialPropertyModel, EquipmentTypeMaterialPropertyDetailModel, MapForecastCustomerLocationModel, CustomerLocationDDModel, SaveUpdateEquipmentMaterialModel, CopyEquipmentMaterialPropertyModel, MapForecastCustomerLocationEditModel, commonModel } from '../models/material.model';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';



const BASE_URL = env.coreBaseApiUrl;
const MASTER_URL = env.masterServerUrl;
const COMMON_URL = env.commonServerUrl;

@Injectable({
  providedIn: 'root'
})

export class MaterialService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  public pageSize: BehaviorSubject<any>;
  public pageSizeObj: Observable<any>;
  permission: boolean = false;
  constructor(private http: HttpClient, preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  

  getMaterialCommodityMapList(modal: MaterialCommodityMap) {
    return this.http.post<any>(BASE_URL + '/Material/ListMaterialCommodity', modal, this.httpOptions)
      .pipe(
        map(material => {
          return material
        }
        ));
  }
  getTotalCount() {
    return this.http.get<any>(BASE_URL + '/Material/TotalCount', this.httpOptions)
      .pipe(map(count => {
        return count;
      }));
  }

  generateExcelReport(modal: any) {
    return this.http.post<any>(COMMON_URL + '/ExportReport/GenerateExcelReport', modal, this.httpOptions)
  }

  downloadExcelReport(Path: any) {
    var reqBody = { Path };
    return this.http.post<any>(COMMON_URL + '/ExportReport/GetExportReport', reqBody, { ...this.httpOptions, responseType: 'blob' as 'json' });
  }

  deleteExportList(id: number, clientid: number, targetFilename: string) {
    var reqBody = {
      ID: id,
      ClientID: clientid,
      TargetFileName: targetFilename
    };
    return this.http.post<any>(COMMON_URL + '/ExportReport/DeleteFile', reqBody, this.httpOptions)
  }

  getMaterialHierarchy(idslist: any) {
    var data = {
      IDs: idslist
    };
    return this.http.post<any>(BASE_URL + '/Material/GetHierarchyByMaterialID', data, this.httpOptions)
  }

  generateAllReportList(modal: any) {
    return this.http.post<any>(COMMON_URL + '/ExportReport/GetAllReportList', modal, this.httpOptions)
  }

  getMaterialGroupData(modal: MaterialGroupModel) {
    return this.http.post<any>(BASE_URL + '/MaterialGroup/GetAll', modal, this.httpOptions)
      .pipe(
        map(materialgroup => {
          return materialgroup
        }
        ));
  }

  getMaterialGroupDetailData(modal: MaterialGroupDetailModel) {
    return this.http.post<any>(BASE_URL + '/MaterialGroupDetail/GetMaterialGroupDetailById', modal, this.httpOptions)
      .pipe(
        map(materialgroupdetail => {
          return materialgroupdetail
        }
        ));
  }

  totalMGDCount(modal: MaterialGroupDetailModel) {
    return this.http.post<any>(BASE_URL + '/MaterialGroupDetail/CountTotalMGD', modal, this.httpOptions)
      .pipe(map(count => {
        return count;
      }));
  }

  getMaterialHierarchyData(modal: MaterialHierarchyModel) {
    return this.http.post<any>(BASE_URL + '/MaterialHierarchy/GetAll', modal, this.httpOptions)
      .pipe(
        map(materialhierarchy => {
          return materialhierarchy
        }
        ));
  }

  totalMHCount(modal: MaterialHierarchyModel) {
    return this.http.post<any>(BASE_URL + '/MaterialHierarchy/TotalMHRecordCount', modal, this.httpOptions)
      .pipe(map(count => {
        return count;
      }));
  }

  getMaterialHierarchyDetailData(modal: MaterialHierarchyDetailModel) {
    return this.http.post<any>(BASE_URL + '/MaterialHierarchyDetail/GetAll', modal, this.httpOptions)
      .pipe(
        map(materialhierarchy => {
          return materialhierarchy
        }
        ));
  }

  totalMHDCount(modal: MaterialHierarchyDetailModel) {
    return this.http.post<any>(BASE_URL + '/MaterialHierarchyDetail/GetMHDCount', modal, this.httpOptions)
      .pipe(map(count => {
        return count;
      }));
  }

  getMaterialPropertyData(modal: MaterialPropertyModel) {
    return this.http.post<any>(BASE_URL + '/MaterialProperty/GetAll', modal, this.httpOptions)
      .pipe(
        map(materialproperty => {
          return materialproperty
        }
        ));
  }

  getMaterialPropertyDetailByCode(modal: MaterialPropertyDetailModel) {
    return this.http.post<any>(BASE_URL + '/MaterialPropertyDetail/GetMaterialPropertyDetailByCode', modal, this.httpOptions)
      .pipe(
        map(materialpropertydetail => {
          return materialpropertydetail
        }
        ));
  }

  getUOMList(modal: number) {
    
    var data = {
      ClientID: modal
    };
    return this.http.post<any>(MASTER_URL + '/Uom/List', data, this.httpOptions)
      .pipe(
        map(uomlist => {
          return uomlist
        }
        ));
  }

  saveUpdateMaterialPropertyDetail(modal: SaveUpdateModel[]) {
    return this.http.post<SaveUpdateModel[]>(BASE_URL + '/MaterialPropertyDetail/SaveAll', modal, this.httpOptions)
      .pipe(map(saveresponse => {
        return saveresponse;
      }));
  }

  getMaterialPropertyDetailFromOtherMaterial(copymodal: CopyMaterialPropertyModel) {
    return this.http.post<any>(BASE_URL + '/MaterialPropertyDetail/GetMaterialPropertyDetailFromSelectedMaterial', copymodal, this.httpOptions)
      .pipe(
        map(materialpropertycopy => {
          return materialpropertycopy
        }
        ));
  }

  getEquipmentMaterialPropertyDetailFromOtherMaterial(copymodal: CopyEquipmentMaterialPropertyModel) {
    
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/CopyEquipmentMatPropDetailFromSelectedMaterial', copymodal, this.httpOptions)
      .pipe(
        map(propertycopy => {
          return propertycopy
        }));
  }

  totalEquipCharCount(modal: EquipmentTypeMaterialPropertyDetailModel) {
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/GetCountEquipmentsByMaterialCode', modal, this.httpOptions)
      .pipe(map(response => {
        return response;
      }));
  }

  getEquipmentTypeMaterialPropertyDetailByCode(modal: EquipmentTypeMaterialPropertyDetailModel) {
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/GetEquipmentTypeMaterialPropertyDetailByCode', modal, this.httpOptions)
      .pipe(
        map(equipmentTypematerialpropertydetail => {
          return equipmentTypematerialpropertydetail
        }));
  }

  getAllEquipmentType() {
    return this.http.post<any>(MASTER_URL + '/EquipmentType/List', this.httpOptions)
      .pipe(
        map(response => { return response }
        ));
  }

  getEquipmentList(model: commonModel) {
    return this.http.post<any>(MASTER_URL + '/EquipmentType/GetAllRecords', model, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetMapForecastCustomerLocation(modal: MapForecastCustomerLocationModel) {
    return this.http.post<any>(BASE_URL + '/CustomerPropertyDetail/GetMapForecastCustomerLocation', modal, this.httpOptions)
      .pipe(
        map(forecastCustomerLocation => {
          return forecastCustomerLocation
        }
        ));
  }

  totalCount(modal: MapForecastCustomerLocationModel) {
    return this.http.post<any>(BASE_URL + '/CustomerPropertyDetail/GetCountMapForecastCustomerLocation', modal, this.httpOptions)
      .pipe(map(response => {
        return response;
      }));
  }

  GetCustomerLocationDDList(modal: CustomerLocationDDModel) {
    return this.http.post<any>(BASE_URL + '/CustomerPropertyDetail/GetCustomerLocationDropDownList', modal, this.httpOptions)
      .pipe(
        map(customerLocationDDList => {
          return customerLocationDDList
        }
        ));
  }

  isMaterialExist(Modal: MaterialCommodityMap) {
    return this.http.post<any>(BASE_URL + '/Material/isMaterialExist', Modal, this.httpOptions)
      .pipe(map(matexist => {
        return matexist;
      }));
  }

  getEquipmentTypeMaterialPropertyDetailForPopUP(modal: EquipmentTypeMaterialPropertyDetailModel) {
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/GetEquipmentTypeMaterialPropertyForPopUp', modal, this.httpOptions)
      .pipe(
        map(equipmentTypematerialpropertyPopUP => {
          return equipmentTypematerialpropertyPopUP
        }
        ));
  }

  getTotalCountEquipTyMatPropDetailForPopUP(modal: EquipmentTypeMaterialPropertyDetailModel) {
    return this.http.post<any>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/GetTotalCountEquipmentTypeMaterialPropertyForPopUp', modal, this.httpOptions)
      .pipe(
        map(matCount => {
          return matCount
        }));
  }

  saveUpdateEquipmentMaterialProperty(modal: SaveUpdateEquipmentMaterialModel[]) {
    return this.http.post<SaveUpdateEquipmentMaterialModel[]>(BASE_URL + '/EquipmentTypeMaterialPropertyDetail/SaveAll', modal, this.httpOptions)
      .pipe(map(saveresponse => {
        return saveresponse;
      }));
  }

  editSaveMaterialCommodity(Modal: MaterialCommodityMap[]) {
    return this.http.post<any>(BASE_URL + '/Material/UpdateMaterialCommodity', Modal, this.httpOptions)
      .pipe(map(materialCommodity => {
        return materialCommodity;
      }));
  }

  removeMaterialCommodity(idslist: string) {
    var data = {
      IDs: idslist
    };
    return this.http.post<any>(BASE_URL + '/Material/DeleteAll', data, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  removeMaterialPropertyDetail(idslist: string) {
    var data = {
      IDs: idslist
    };
    return this.http.post<any>(BASE_URL + '/MaterialPropertyDetail/DeleteAll', data, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
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

  removeLocationToMaterial(modal: MapForecastCustomerLocationModel[]) {
    //var data = {
    //  IDs: idslist
    //};
    return this.http.post<any>(BASE_URL + '/LocationForecastMaterial/DeleteAll', modal, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  saveMapForecastCustomerLocation(modal: MapForecastCustomerLocationEditModel[]) {
    return this.http.post<any>(BASE_URL + '/LocationForecastMaterial/SaveAll', modal, this.httpOptions)
      .pipe(map(saveresponse => {
        return saveresponse;
      }));
  }

  getPrefrenceValueByCode(code: string) {
    var RequestObject = {
      Code: code
    };
    return this.http.post<any>(MASTER_URL + '/PreferenceType/GetPreferenceTypeByCode', RequestObject, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getMaterialPropertControlVal() {
    var RequestObject = {};
    return this.http.post<any>(BASE_URL + '/MaterialProperty/GetMaterialPropertyControlValue', RequestObject, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


}
