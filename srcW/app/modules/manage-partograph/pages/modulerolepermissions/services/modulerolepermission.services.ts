import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment as env } from '@env/environment';
import { FormArray } from '@angular/forms';
import { modulePermission, moduleRole, ModulePaginatorListViewModel } from '../model/send-object';
import { BaseService } from '@app/core/services/base.service';
import { PreferenceTypeService } from '@app/core';


@Injectable({
  providedIn: 'root'
})

export class ModuleRolePermissionService extends BaseService {
  public ModuleAccess: Observable<any>;
  public ModuleSubject: BehaviorSubject<any>;
  public pageSize: BehaviorSubject<any>;
  public pageSizeObj: Observable<any>;
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  GetModuleList(model: modulePermission) {
    let ClientId = model.ClientId;
    return this.http.post<any>(env.serverUrl + '/ApplicationModule/List', { ClientId}, this.httpOptions)
      .pipe(map(module => {
        return module.Data.map(m => ({ id: m.Id, itemName: m.Name }));  
      }));
  }

  GetRolesList() {
    return this.http.post<any>(env.serverUrl + '/Roles/List', {}, this.httpOptions)
      .pipe(map(role => {
        return role.Data.map(r => ({ id: r.Id, itemName: r.Name }));        
      }));
  }

  GetPermissionTypeList() {
    return this.http.post<any>(env.serverUrl + '/PermissionType/List', {}, this.httpOptions)
      .pipe(map(ptype => {
        return ptype.Data.map(p => ({ id: p.Id, text: p.Name }));
      }));
  }

  CheckExistPermission(flagViewModel: modulePermission[]): Observable<any> {
    return this.http.post<any>(env.serverUrl + '/ModuleRolePermission/CheckExist', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  InsertModuleRolePermission(flagViewModel: modulePermission[]): Observable<any> {
    return this.http.post<any>(env.serverUrl + '/ModuleRolePermission/SaveAll', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
    UpdateModuleRolePermission(flagViewModel: modulePermission[]): Observable < any > {
      return this.http.post<any>(env.serverUrl + '/ModuleRolePermission/UpdateAll', flagViewModel, this.httpOptions)
        .pipe(map(res => {
          return res;
        }));
  }

  GetModuleRolePermission(flagViewModel: modulePermission): Observable<any> {
    return this.http.post<any>(env.serverUrl + '/ModuleRolePermission/GetAllRecords', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getRolesIds(flagViewModel: modulePermission): Observable<any> {
    return this.http.post<any>(env.serverUrl + '/ModuleRolePermission/GetRolesIds', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getTotalCount(flagViewModel: modulePermission): Observable<any> {
    return this.http.post<any>(env.serverUrl + '/ModuleRolePermission/Count', flagViewModel, this.httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  RemoveModuleRolePermission(idslist: string, ClientId) {

    var data = {
      IDs: idslist,
      ClientId: ClientId
    };

    return this.http.post<any>(env.serverUrl + '/ModuleRolePermission/DeleteALl', data, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


}
