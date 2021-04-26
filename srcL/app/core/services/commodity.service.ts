import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
//import { environment as env } from '@env/environment';
import { environment as env } from '../../../environments/environment';
import { CommodityCallListViewModel, PeriodicElement, CommodityTypeListViewModel, CommodityType, SegmentType, Commodity, CommodityEitModel, CommodityTypeViewModel, CommodityTypeEitModel, CommodityNewModel } from '../models/commodity.model';
import { PreferenceTypeService } from './preferencetype.service';
import { BaseService } from './base.service';
//import { FreightMode, CommonCallListViewModel } from '../modals/freightmode';
//import { SendObject } from '../../plan/pages/models/send-object';


const BASE_URL = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})

export class CommodityService extends BaseService{  
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };  
  public commodityvewlist: CommodityEitModel[] = [];
  public commodityvewlist1: CommodityNewModel[] = [];
  constructor(private http: HttpClient, preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }
  
  //getdata() {
  //  return this.commodityvewlist1;
  //}
  getCommodityList(Modal: CommodityNewModel) {
     
    return this.http.post<any>(BASE_URL + '/Commodity/getallcom', Modal, this.httpOptions)
      .pipe(        
        //tap(response => console.log(response)),
        map(commodity => {
          //this.commodityvewlist1 = commodity.data;
          return commodity
        }
      ));
  }

  getCommodityListnumber() {
    return this.http.get<any>(BASE_URL + '/Commodity/list', this.httpOptions)
      .pipe(map(charge => {
        return charge;
      }));
  }
 
  getAllCommodityType(typeModal: CommodityType) {
     
    return this.http.post<any>(BASE_URL + '/CommodityType/getallcommodityType', typeModal, this.httpOptions)
      .pipe(
        //tap(comtype => console.log(comtype)),
        map(comtype => { return comtype; }
      ));
  }


  getAllSegmentType(typeModal: SegmentType) {
     
    return this.http.post<any>(BASE_URL + '/Commodity/GetAllSegment', typeModal, this.httpOptions)
      .pipe(
        //tap(segtype => console.log(segtype)),
        map(segtype => { return segtype; }
        ));
  }

  addCommodity(Modal: CommodityNewModel) {
     
    return this.http.post<any>(BASE_URL + '/Commodity', Modal, this.httpOptions)
      .pipe(map(commodity => {
        return commodity;
      }));
  }

  editSaveCommodity(Modal: CommodityNewModel) {
     
    return this.http.post<any>(BASE_URL + '/Commodity/Update', Modal, this.httpOptions)
      .pipe(map(commodity => {
        return commodity;
      }));
  }

  RemoveCommodity(idslist: string) {

    var data = {
      IDs: idslist
    };

    return this.http.post<any>(BASE_URL + '/Commodity/DeleteAll', data, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  addCommodityType(commoditytypeModal: CommodityTypeViewModel) {
     
    return this.http.post<any>(BASE_URL + '/CommodityType', commoditytypeModal, this.httpOptions)
      .pipe(map(commoditytype => {
        return commoditytype;
      }));
  }

  CommodityTypeExist(commoditytypeModal: CommodityTypeViewModel) {
     
    return this.http.post<any>(BASE_URL + '/CommodityType/CheckCommodityType', commoditytypeModal, this.httpOptions)
      .pipe(map(commoditytype => {
        return commoditytype;
      }));
  }
  //updateAllCommodityType(commoditytypeModal: CommodityTypeEitModel[]) {    
  //  return this.http.post<CommodityTypeEitModel[]>(BASE_URL + '/CommodityType/UpdateAll', commoditytypeModal, this.httpOptions)
  //    .pipe(map(commodityEdittype => {
  //      return commodityEdittype;
  //    }));
  //}

  updateCommodityType(commoditytypeModal: CommodityTypeEitModel) {
    return this.http.post<any>(BASE_URL + '/CommodityType/Update', commoditytypeModal, this.httpOptions)
      .pipe(map(commodityEdittype => {
        return commodityEdittype;
      }));
  }

  RemoveCommodityType(idslist: string) {
     
    var data = {
      IDs: idslist
    };
    return this.http.post<any>(BASE_URL + '/CommodityType/DeleteAll', data, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  IscommodityExist(Modal: CommodityNewModel) {
     
    return this.http.post<any>(BASE_URL + '/Commodity/CheckCommodity', Modal, this.httpOptions)
      .pipe(map(comexist => {
         
       return comexist;
      }));
  }
}
