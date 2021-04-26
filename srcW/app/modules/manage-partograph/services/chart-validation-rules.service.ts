import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerChartValues } from '../modals/input-chart';
import { map  } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { ValidationRuleParameter } from '../modals/validation-rules.model';




const BASE_URL_MASTER = env.masterServerUrl;
@Injectable({
  providedIn: 'root'
})
export class ChartValidationService {

  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
 // private baseUrl = 'http://localhost:9001/api'
  constructor(private http: HttpClient) {
  }
    
  // Get Validation list API
  GetVlidationListClientWise(sendObj:ValidationRuleParameter) {
    return this.http.post<any>(BASE_URL_MASTER + '/ChartValidationRule/MeasurementParameterList', sendObj, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }


  // END


  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
