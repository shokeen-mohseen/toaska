import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { MedicationChartData } from '../modals/treatment';

const BASE_URL = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(private http: HttpClient) {
  }

  // Get Hospital Location
  GetMedicationChartData(medicationChartData: MedicationChartData) {

    return this.http.post<any>(BASE_URL + '/MedicationChartGrid/List', medicationChartData)
      .pipe(map(ChartList => {
        return ChartList;
      }));
  }

  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
