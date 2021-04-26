import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { environment as env } from '@env/environment';
import { FreightMode, mapequipmenttypefreightmode ,equipmenttype } from '../modals/freightmode';
import { SendObject } from '../../plan/pages/models/send-object';
import { regularOrderModel } from '../../../core/models/regularOrder.model';
import { PreferenceTypeService } from '../../../core';
import { BaseService } from '../../../core/services/base.service';



const BASE_URL = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})

export class FreightModeService extends BaseService {
  //url = 'http://localhost:9001/api';
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  public freight: Observable<any>;
  public freightSubject: BehaviorSubject<any>;
  public pageSize: BehaviorSubject<any>;
  public pageSizeObj: Observable<any>;
  public entrylist: FreightMode[] = [];
  public selectionlist: mapequipmenttypefreightmode[] = [];
  public datasourceformattable$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public freightmodeequiplist: mapequipmenttypefreightmode[] = [];
  public equiplistdetail: equipmenttype[] = [];

  

  //public emitsource = new Subject<void>();
  //public emitedsource$ = this.emitsource.asObservable();
  //@Output() checkBoxClick = new EventEmitter<void>();
  constructor(private http: HttpClient, preferenceService: PreferenceTypeService) {
    super(preferenceService);
    this.freightSubject = new BehaviorSubject<Array<FreightMode>>([]);
    this.freight = this.freightSubject.asObservable();
    this.pageSize = new BehaviorSubject<number>(0);
    this.pageSizeObj = this.pageSize.asObservable();
  }
  permission: boolean = false;

  getAll(freightModal: FreightMode): Observable<FreightMode[]> {
    return this.http.post<FreightMode[]>(BASE_URL + '/FreightMode/GetAllRecords', freightModal, this.httpOptions)
      .pipe(
        tap(response => console.log(response)),
        map(response => { return response }
        ));
  }

  getMapEquipmentTypeByFreightMode(modal: any) {
    return this.http.post<any>(BASE_URL + '/FreightModeEquipTypeMap/GetFreightModeEquipmentMapingList', modal, this.httpOptions)
  }


  addAllFreight(freightModal: FreightMode[]) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(BASE_URL + '/FreightMode/SaveAll', freightModal, this.httpOptions);
  }

  deleteAllFreight(ids: string, deletedBy: string) {
    const body = { IDs: ids, DeletedBy: deletedBy}    
    return this.http.post<any>(BASE_URL + '/FreightMode/DeleteAll', body, this.httpOptions);
  }

  getTotalCount(freightModal: FreightMode): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FreightMode>(BASE_URL + '/FreightMode/Count', freightModal, this.httpOptions);
  }

  getTotalCountMappedEquipment(clientid: number, id: number) {
    const body = { ClientId: clientid, FreightModeID: id }
    return this.http.post<any>(BASE_URL + '/FreightModeEquipTypeMap/GetCountFreightModeEquipmentMap', body, this.httpOptions);
  }

  getfmByIdsList(ids: number): Observable<FreightMode[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get<FreightMode[]>(BASE_URL + '/FreightMode/${ids}' + name, this.httpOptions)
      .pipe(map(freight => {
        return freight;
      }));
  }
  updateAllFreight(freightModal: FreightMode[]) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FreightMode[]>(BASE_URL + '/FreightMode/UpdateAll', freightModal, this.httpOptions)
      .pipe(map(freight => {
        return freight;
      }));
  }

  //async getMaxEditedRecordsCount() {
  //  if (this.preferenceService.editRecordCount.value < 1) {
      
  //    return await this.preferenceService.getPreferenceTypeByCode('MaxNumberOfRecordsToBeEditedAtATime').toPromise()
  //      .then(result => {
  //        if (result != null && result.data != null) {
  //          this.preferenceService.editRecordCount.next(parseInt(result.data.preferenceValue));
  //          return parseInt(result.data.preferenceValue);
  //        } else {
  //          // Defaulting it to 20 just in case if the api call fails and we have no response.
  //          return 20;
  //        }
  //      });
  //  }
  //  return this.preferenceService.editRecordCount.value;
  //}


  getAllequip(): Observable<FreightMode[]> {
    return this.http.post<FreightMode[]>(`${env.masterServerUrl}/EquipmentType/List`, this.httpOptions)
      .pipe(
        tap(response => console.log(response)),
        map(response => { return response }
        ));
  }

  getfreight(any) {
    this.entrylist.push(any);
  }

  getfrieghtequipmentmaplist(any) {
    this.selectionlist.push(any);

  }
  getequiplist(any) {
    this.equiplistdetail.push(any);
  }

  setDatasourceFromEditmap(any) {
    this.datasourceformattable$.next(any);
  }

  get datasourceformattable(): Observable<any[]> {
    return this.datasourceformattable$.asObservable();
  }


  addAllFreightequipmenttype(freightequipModal: mapequipmenttypefreightmode[]) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(BASE_URL + '/FreightModeEquipTypeMap/SaveAll', freightequipModal, this.httpOptions);
    //.pipe(map(freight => {
    //  return freight;
    //}));
  }

  deleteAllFreightequipmenttype(test: string): Observable<mapequipmenttypefreightmode[]> {
    const body = { IDs: test }   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(BASE_URL + '/FreightModeEquipTypeMap/DeleteAll', body, this.httpOptions)
    .pipe(map(freight => {
      return freight;
    }));
  }




  getequipfreightIdsbyList(ids: number): Observable<FreightMode[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FreightMode[]>(BASE_URL + '/FreightModeEquipTypeMap/GetFreightModeEquipMapList?FreightModeID='+ids, this.httpOptions)
      .pipe(map(freight => {
        return freight;
      }));
  }
}






