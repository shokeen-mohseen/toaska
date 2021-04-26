import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment as env } from '@env/environment';
import { Organization } from '../models/organization';
import { PreferenceTypeService } from './preferencetype.service';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


const BASE_URL = env.masterServerUrl;
@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends BaseService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(private http: HttpClient, private authenticationService: AuthService, preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  permission: boolean = false;

  // Get Organization List
  getOrganizationList(organization: Organization) {

    return this.http.post<any>(BASE_URL + '/Organization/GetAllRecords', organization)
      .pipe(map(OrganizationList => {
        return OrganizationList;
      }));
  }


  // Get Organization Characteristics List
  getCharacteristicsList(organizationId: number) {
    const reqBody = {
      OrganizationId: organizationId
    }
    return this.http.post<any>(env.coreBaseApiUrl + '/OrganizationPropertyDetail/GetAllRecords', reqBody)
      .pipe(map(CharacteristicsList => {
        return CharacteristicsList;
      }));
  }

  // Delete Organization Characteristics List
  deleteCharacteristics(deleteReqBody) {
    return this.http.post<any>(env.coreBaseApiUrl + '/OrganizationPropertyDetail/DeleteByID', deleteReqBody)
  }

  // Change Inactive Organization Status Organization List

  changesInactiveOrganizationStatus(ids: string) {
    const body = {
      OrganizationIDs: ids,
      isActive: false
    }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Organization>(env.masterServerUrl + '/Organization/ActiveAll', body, this.httpOptions);
  }

  // Change Active Organization Status Organization List

  changesActiveOrganizationStatus(ids: string) {
    const body = {
      OrganizationIDs: ids,
      isActive: true
    }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Organization>(env.masterServerUrl + '/Organization/ActiveAll', body, this.httpOptions);
  }

  getTotalCount(clientId: number) {
    const reqBody = {
      ClientID: clientId
    }
    return this.http.post<any>(env.masterServerUrl + '/Organization/Count', reqBody);
  }



  // Get Organization Characteristics Description List
  getCharacteristicsListDescription(OrganizationID: number) {
    const reqBody = {
      ClientId: this.authenticationService.currentUserValue.ClientId,
      OrganizationID: OrganizationID
    }
    return this.http.post<any>(env.coreBaseApiUrl + '/OrganizationPropertyDetail/GetOrganizationCharacteristics', reqBody)
      .pipe(map(CharacteristicsListDescription => {
        return CharacteristicsListDescription;
      }));
  }

  saveCharacteristics(saveReqBody) {
    return this.http.post<any>(env.coreBaseApiUrl + '/OrganizationPropertyDetail/SaveAll', saveReqBody)
  }
}
