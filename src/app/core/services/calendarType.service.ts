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
export class CalendarTypeService extends BaseService{

  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getAllCalenderType() {
    return this.http.get<any>(`${this.BASE_SERVICE_URL}/calendarType/getall`);
  }

 
}
