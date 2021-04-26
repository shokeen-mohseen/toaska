import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map  } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { OrganizationHierarchy } from '../models/organization-hierarchy.model';


const BASE_URL = env.masterServerUrl;
const BASE_URL1 = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})
export class OrganizationHierarchyService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
 
  constructor(private http: HttpClient) {
  }


  // Get Geolocation Location
  GetOrganizationLevel(organizationHierarchy: OrganizationHierarchy) {
    
    return this.http.post<any>(BASE_URL + '/OrganizationLevel/GetOrganizationLevel', organizationHierarchy)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  GetOrganization(organizationHierarchy: OrganizationHierarchy) {

    return this.http.post<any>(BASE_URL + '/Organization/GetOrganization', organizationHierarchy)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  //Get Group Data


  GetGroupLevelList(organizationHierarchy: OrganizationHierarchy) {

    return this.http.post<any>(BASE_URL1 + '/OperatingLocation/GetOrganizationHierarchyGroup', organizationHierarchy)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  GetEnterPriseLevelList(organizationHierarchy: OrganizationHierarchy) {

    return this.http.post<any>(BASE_URL1 + '/OperatingLocation/GetOrganizationHierarchyEnterprises', organizationHierarchy)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }
  
}
