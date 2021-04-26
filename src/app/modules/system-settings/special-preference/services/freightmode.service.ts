import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { environment as env } from '@env/environment';


import { FreightMode, mapequipmenttypefreightmode ,equipmenttype } from '../../modals/freightmode';
import { PreferenceTypeService } from '@app/core';





const BASE_URL = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})

export class FreightModeService {
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
  constructor(private http: HttpClient, private preferenceService: PreferenceTypeService) {
    this.freightSubject = new BehaviorSubject<Array<FreightMode>>([]);
    this.freight = this.freightSubject.asObservable();
    this.pageSize = new BehaviorSubject<number>(0);
    this.pageSizeObj = this.pageSize.asObservable();
  }


  getAll(freightModal: FreightMode): Observable<FreightMode[]> {
    return this.http.post<FreightMode[]>(BASE_URL + '/FreightMode/GetAllRecords', freightModal, this.httpOptions)
      .pipe(
        tap(response => console.log(response)),
        map(response => { return response }
        ));
  }




  addAllFreight(freightModal: FreightMode[]) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FreightMode>(BASE_URL + '/FreightMode/SaveAll', freightModal, this.httpOptions);
  }

  deleteAllFreight(ids: string) {
    const body = {IDs: ids}
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FreightMode>(BASE_URL + '/FreightMode/DeleteAll', body, this.httpOptions);
  }

  getTotalCount(freightModal: FreightMode): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<FreightMode>(BASE_URL + '/FreightMode/Count', freightModal, this.httpOptions);
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

  async getMaxEditedRecordsCount() {
    if (this.preferenceService.editRecordCount.value < 1) {
      console.log("retrieve default editRecords size");
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
    return this.http.post<mapequipmenttypefreightmode>(BASE_URL + '/FreightModeEquipTypeMap/SaveAll', freightequipModal, this.httpOptions);
    //.pipe(map(freight => {
    //  return freight;
    //}));
  }

  deleteAllFreightequipmenttype(test: string): Observable<mapequipmenttypefreightmode[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(BASE_URL + '/FreightModeEquipTypeMap/DeleteAll',test, this.httpOptions)
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






