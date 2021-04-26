import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DynamicWebControl, ISaveDynamicParameter } from '../modals/dynamic-webcontrol-parameter.model';
import { map  } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { ValidationRuleParameter } from '../modals/validation-rules.model';




const BASE_URL_MASTER = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})
export class DynamicWebcontrolParameterService {

  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(private http: HttpClient) {
  }
    
  // Get GetDynamicWebcontrolParameter list API
  GetDynamicWebcontrolParameter(sendObj: DynamicWebControl) {
    return this.http.post<any>(BASE_URL_MASTER + '/WebControlMeasurement/GetDynamicWebcontrolParametersList', sendObj, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }


  // Get GetDynamicWebcontrolType list API
  GetDynamicWebcontrolType(sendObj: DynamicWebControl) {
    return this.http.post<any>(BASE_URL_MASTER + '/WebControlMeasurement/GetWebControlType', sendObj, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }


  // ADD DYNAMIC MEASUREMENT PARAMETER 
  AddDynamicMeasurementParameter(sendObj: DynamicWebControl) {
    return this.http.post<any>(BASE_URL_MASTER + '/WebControlMeasurement/AddDynamicParameter', sendObj, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // ADD DYNAMIC MEASUREMENT PARAMETER 
  AddDynamicMeasurementParametersValues(sendObj: ISaveDynamicParameter[]) {
    return this.http.post<any>(BASE_URL_MASTER + '/WebControlMeasurement/AddDynamicParameterValues', sendObj, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }


  // END


  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
