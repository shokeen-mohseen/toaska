import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { IssuePopup, Module, SubModule } from '../../core/models/IssuePopup.model';
import { AuthService } from '../../core';
import { environment as env } from '@env/environment';
import { BaseService } from '../../core/services/base.service';
import { PreferenceTypeService } from '../../core/services/preferencetype.service';
const COMMON_URL = env.commonServerUrl;
@Injectable({
  providedIn: 'root'
})
export class IssuePopupService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor( private http: HttpClient, private authenticationService: AuthService, preferenceService: PreferenceTypeService) {
    super(preferenceService);
   

  }


  
  getAllModule(ptModal: Module) {
    ptModal.clientId = this.authenticationService.currentUserValue.ClientId;
    
    return this.http.post<any>(COMMON_URL + '/CommonIssue/GetAllModule', ptModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  getAllSubModule(ptcModal: SubModule) {
   
    ptcModal.clientId = this.authenticationService.currentUserValue.ClientId;
    return this.http.post<any>(COMMON_URL + '/CommonIssue/GetAllSubModule', ptcModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }
  getIssuePopupData(ptModal: IssuePopup) {
   
    ptModal.clientId = this.authenticationService.currentUserValue.ClientId;
    return this.http.post<any>(COMMON_URL + '/CommonIssue/getAll', ptModal, this.httpOptions)
      .pipe(
        map(result => { return result; }
        ));
  }

  getIssuePopupList() {
    return this.http.get<any>(COMMON_URL + '/CommonIssue/list')
      .pipe(
        map(result => { return result; }
        ));
  }
  deleteAllIssuePopup(ids: string) {

    const body = { IDs: ids }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<IssuePopup>(COMMON_URL + '/CommonIssue/DeleteAll', body, this.httpOptions);
  }
 
}
