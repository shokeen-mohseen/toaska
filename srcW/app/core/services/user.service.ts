import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { environment } from '@env/environment';
import { User, PreferenceTypeService } from '..';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';

const routes = {
    users: '/users'
};

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService{

  constructor(private jsonApiService: JsonApiService, private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.serverUrl}/users`);
  }

  SaveAlertTemplates(formData: FormData) {
    const options = {
      headers: new HttpHeaders().set('enctype', 'multipart/form-data')
    };

    var url = `${environment.commonServerUrl}/CommonShareAlert/SaveAlertTemplate`;

    return this.http.post<any>(url, formData, options);
  }

  SaveAlertTemplate(files: File[], emailto: string, emailcc: string,description:string) {
    //const headers = new HttpHeaders();
    //headers.append('Content-Type', 'multipart/form-data');

    const options = {
      headers: new HttpHeaders().set('enctype', 'multipart/form-data')
    };

    var url = `${'http://localhost:9004/api/CommonShareAlert/SaveAlertTemplate'}/${emailto}/${emailcc}/${description}`;
   // const form = new FormData();
    const formData: FormData = new FormData();
    for (let file of files) {
      //form.append("files", file);
      formData.append('file', file, file.name);
    }

    return this.http.post<any>(url, formData, options    
    );
    //return this.http.post<any>(url, form, { headers });
    }

    getUserbyRole(rolename: string) {
      return this.http.get<any>(`${this.SERVER_SERVICE_URL}/userrolelist/role?role=` + rolename)
        .pipe(map(response => {
          return response;
        }));
    }
}
