import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map  } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { Geoloction,AddressLocation } from '../models/geolocation';
import { UsersContactViewModel } from '../models';


const BASE_URL = env.commonServerUrl;
@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
 
  constructor(private http: HttpClient) {
  }


  // Get Geolocation Location
  GetGeolocation(geolocation: Geoloction) {
    
    return this.http.post<any>(BASE_URL + '/Geolocation/List', geolocation)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }


  // Get Geolocation Location
  GetLocationID(geolocation: Geoloction) {

    return this.http.post<any>(BASE_URL + '/Geolocation/GetGeolocationId', geolocation)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }


  // Add Patient Adress
  AddPatientAddress(addressLocation: AddressLocation) {

    return this.http.post<any>(BASE_URL + '/ContactAddress', addressLocation)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  // Get Contact Adrress [Patient , user, customer etc.]
  GetAddressInformation(addressLocation: AddressLocation) {

    return this.http.post<any>(BASE_URL + '/ContactAddress/List', addressLocation)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  UpdateAddressInformation(addressLocation: AddressLocation) {

    return this.http.put<any>(BASE_URL + '/ContactAddress/Update', addressLocation);
  }
  // Get Contact Adrress [Patient , user, customer etc.]
  GetContactInformation(addressLocation: UsersContactViewModel) {

    return this.http.post<any>(BASE_URL + '/Contact/List', addressLocation)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  
  
}
