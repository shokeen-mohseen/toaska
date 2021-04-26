import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project.model';
import { ApiService } from './api.service';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

const routes = {
    projects: '/projects',
    project: (id: number) =>  `/projects/${id}`
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    constructor(
      private jsonApiService: JsonApiService,
      private apiService: ApiService, private http: HttpClient) {}

    getAll(): Observable<Project[]> {
        return this.apiService.get(routes.projects);
    }

    getSingle(id: number): Observable<Project> {
        return this.apiService.get(routes.project(id));
    }

  getpartograph() {

    return this.http.get<any>(`${environment.serverUrl}/findpartograph`)
      .pipe(map(user => {
        return user;
      }));
  }

}
