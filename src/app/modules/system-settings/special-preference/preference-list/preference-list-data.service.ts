import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferenceListDataService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getAllData(): Observable<any[]> {
    return this.http.get<any[]>('./assets/data-list.json');
  }
}
