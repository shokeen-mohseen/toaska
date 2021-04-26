import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { PreferenceTypeService, UsersContactViewModel, UserRolesListViewModel, UseraccessService } from '..';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ShowNotes, CommonModel } from '../models/show-notes.model';
import { projectkey } from '../../../environments/projectkey';
import { Router } from '@angular/router';

const BASE_URL = environment.coreBaseApiUrl;
const MASTER_URL = environment.masterServerUrl;
const COMMON_URL = environment.commonServerUrl;
const SERVER_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class ShowNotesService extends BaseService{
  pageid: number = 0;
  deleteAllbtn: boolean = false;
  
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(private router: Router,
    private http: HttpClient,
    private authservices: AuthService,
    preferenceService: PreferenceTypeService,
    private useraccessService: UseraccessService,) {
    super(preferenceService);
  }

  deleteComment(notesModel: ShowNotes) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/deleteNotes', notesModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetAllDisplayNotes(notesModel: ShowNotes) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/DisplayNotes', notesModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  saveNotes(notesModel: ShowNotes) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/AddComment', notesModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  updateNotes(notesModel: ShowNotes) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/Update', notesModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  removeComment(notesModel: ShowNotes) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/Delete', notesModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  removeAllComment(notesModel: ShowNotes) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/DeleteAll', notesModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  countUrgent(model: CommonModel) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/Count', model, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  countNormal(model: CommonModel) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/NormalCount', model, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  updateReadStatus(notesModel: ShowNotes) {
    return this.http.post<any>(COMMON_URL + '/CommonShowNote/Read', notesModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  async getPageID() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authservices.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authservices.currentUserValue.UserId;
    await this.authservices.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .toPromise().then(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          if (data != null || data != undefined) {
            res.Data.forEach(element => {
              this.pageid = element.ApplicationModuleId;
            });
          }
        }
      });
  }

  async checkUserRole() {
    this.deleteAllbtn = false;
    let model = new UserRolesListViewModel();
    model.clientId = this.authservices.currentUserValue.ClientId;
    model.userId = this.authservices.currentUserValue.UserId;
    await this.useraccessService.getUserRoleslistList(model).toPromise().then(y => {
      const rowList = y.Data;
      if (!!rowList) {
        rowList.filter(item => {
          if (item.RoleName == "Administrator") {
            this.deleteAllbtn = true;
          }
        });
      }
    });
  }  
}

