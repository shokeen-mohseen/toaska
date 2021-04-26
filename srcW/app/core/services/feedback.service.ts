import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { modelCommon, Feedback } from '../models/Feedback.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const SERVER_URL = environment.serverUrl;
const COMMON_URL = environment.commonServerUrl;

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(
    private http: HttpClient) {    
  }

  GetModuleList(model: modelCommon) {
    let ClientId = model.clientId;
    return this.http.post<any>(SERVER_URL + '/ApplicationModule/List', { ClientId }, this.httpOptions)
      .pipe(map(module => {
        return module.Data.map(m => ({ id: m.Id, itemName: m.Name }));
      }));
  }

  saveFeedback(feedbackModel: Feedback) {
    return this.http.post<any>(COMMON_URL + '/Feedback/AddFeedback', feedbackModel, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getUserDetailById(id: string) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.users}/${id}`)
      .pipe(map(user => {
        return user;
      }));
  }
}
export const routesConstrant = {
  users: '/usersaccess/id'
}
