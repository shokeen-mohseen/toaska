import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { regularOrderModel, PeriodicElement, CommonOrderModel } from '../../core/models/regularOrder.model';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { CommonListViewModel } from '../models/shipmentworkbench.model';
import { UserAlertHistory } from '../models/UserAlertHistory.model';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
@Injectable({
  providedIn: 'root'
})
export class UserAlertHistoryService extends BaseService {

  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  public userAccess: Observable<any>;
  public userAccessSubject: BehaviorSubject<any>;

  public LocationsData: any = [];
  public OrderType: string;

  constructor(private jsonApiService: JsonApiService, private http: HttpClient, private authservices: AuthService, preferenceService: PreferenceTypeService) {
    super(preferenceService);
    this.userAccessSubject = new BehaviorSubject<Array<PeriodicElement>>([]);
    this.userAccess = this.userAccessSubject.asObservable();

  }


  getUserAlertHistoryList() {
    return this.http.get<any>(`${environment.coreBaseApiUrl}/UserAlertHistory/list`)
      .pipe(map(response => {
        return response;
      }));
  }
  getUserAlertList(paginationModel: UserAlertHistory) {

    return this.http.post<any>(`${environment.coreBaseApiUrl}/UserAlert/getAll`, paginationModel, this.httpOptions)
      .pipe(map(response => {
        return response;
      }));
  }
  deleteAllUserAlertHistory(ids: string) {

    const body = { IDs: ids }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<UserAlertHistory>(`${environment.coreBaseApiUrl}/UserAlertHistory/deleteall`, body, this.httpOptions);
  }
  getAlertFilterData(paginationModel: UserAlertHistory) {

    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/UserAlertHistory/GetSearchResult`, paginationModel, httpOptions)
      .pipe(map(response => {

        return response;
      }));
  }
  getAllUserAlertHistoryList(paginationModel: UserAlertHistory) {

    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${environment.coreBaseApiUrl}/UserAlertHistory/GetAllUserAlertHistory`, paginationModel, httpOptions)
      .pipe(map(response => {

        return response;
      }));
  }


}
