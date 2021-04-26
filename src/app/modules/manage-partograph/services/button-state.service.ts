import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment as env } from '@env/environment';
import { MedicationChartData } from '../modals/treatment';

const BASE_URL = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})
export class ButtonStateService {
  isEditButtonState: boolean = false;
  EditButtonState: BehaviorSubject<boolean>;

  isDeleteButtonState: boolean = false;
  DeleteButtonState: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    
  }

  editButtonState(value: boolean) {
    console.log(value)
    this.EditButtonState.next(value);
  }

  deleteButtonState(value: boolean) {
    this.DeleteButtonState.next(value);
  }
}
