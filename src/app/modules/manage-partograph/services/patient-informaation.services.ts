import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerChartCommonComment, ServerChartValues } from '../modals/input-chart';
import { map, tap  } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment as env } from '@env/environment';
import { PartographPatientSetup, criticalPatientInfo, HistoryOfPresentIllness, HospitalSetup, HospitalSetup2 } from '../modals/patient-information';
import { LocationUnit } from '../../../core/models/location-unit';
import { PatientPartographDetail, PatientSerach, PatientPartographBase, PatientStatus, PatientValue, patientlist, patientlist2 } from '../../../core/models/partograph-registration';
import { PhysicianPatient } from '../../../core/models/patient-phsician';
import { ResourceRole } from '../../../core/models/resource-roles';
import { Resource } from '../../../core/models/resource ';
import { PatientInfo } from '../../../core/models/PatientInfo';


const BASE_URL = env.coreBaseApiUrl;
const Master_URL = env.masterServerUrl;
//const Temp_URL = 'http://localhost:9001/api';
//const Common_URL = env.commonServerUrl;
//const CoreSecurity_URL = env.CoreSecurityApi;
@Injectable({
  providedIn: 'root'
})
export class PatientInformationService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  patientselected: patientlist[] = [];
  constructor(private http: HttpClient) {
  }

  patientpresentillness: HistoryOfPresentIllness[] = [];


  // Get Hospital Location
  GetHospitalLocation(locationData: PartographPatientSetup) {
    
    return this.http.post<any>(BASE_URL + '/Location/GetLocation', locationData)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  // Get Physician
  GetPhysician(physicianPatient: PhysicianPatient) {

    return this.http.post<any>(BASE_URL + '/PatientResourceList/GetAllPhysiciansByPatientId', physicianPatient)
      .pipe(map(physicianList => {
        return physicianList;
      }));
  }


  // Get ResouceTypeList
  GetResouceTypeList(roles: ResourceRole) {

    return this.http.post<any>(BASE_URL + '/ResourceRoles/GetResourceRole', roles)
      .pipe(map(result => {
        return result;
      }));
  }

  // Get ResouceList
  GetResourceList(resource: Resource) {

    return this.http.post<any>(BASE_URL + '/ResourceRoles/GetResourceNameOnResourceRole', resource)
      .pipe(map(physicianList => {
        return physicianList;
      }));
  }

  // Save API 
  SaveReourceMapping(resource: Resource) {

    return this.http.post<any>(BASE_URL + '/PatientResourceList', resource)
      .pipe(map(result => {
        return result;
      }));
  }

  deletePhysicianListListByIds(resource: Resource) {

   return this.http.post<any>(BASE_URL + '/PatientResourceList/Delete', resource)
  .pipe(map(result => {
    return result;
  }));
    //// console.log(environment.commonServerUrl.trim() + routesConstrant.contact.trim() + '/id/' + `${id}/${deletedBy}/${actionType}`)

    //return this.http.get<any>(BASE_URL + '/PatientResourceList' + '/DeleteById/' + `${id}/${deletedBy}`)
    //  .pipe(map(LocationList => {
    //    return LocationList;
    //  }));
  }

  // Save API 
  CheckPhysicianMappedWithPatient(resource: Resource) {

    return this.http.post<any>(BASE_URL + '/PatientResourceList/CheckPhysicianMappedWithPatient', resource)
      .pipe(map(result => {
        return result;
      }));
  }

  public opt() {

    return 0;
  }

  Upate_PatientInformationPart1(locationData: PartographPatientSetup) {

    return this.http.post<any>(BASE_URL + '/Patient/PatientUpdate', locationData)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  GetContactAddrssPhysicianInfo(info: PatientInfo) {

    return this.http.post<any>(BASE_URL + '/Patient/PatientContactAddressPhysicianList', info)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  

  SavePartogrph_PatientInformationPart1(locationData: PartographPatientSetup) {

    return this.http.post<any>(BASE_URL + '/Patient', locationData)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  SavePartograph(locationData: PatientPartographDetail) {

    return this.http.post<any>(BASE_URL + '/Partograph', locationData)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  SavePartogrph_Registration(locationData: PatientPartographDetail) {

    return this.http.post<any>(BASE_URL + '/Partograph', locationData)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  GetHospitalUnitNo(locationData: LocationUnit) {

    return this.http.post<any>(Master_URL + '/LocationUnit/GetLocationUnitNo', locationData)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  GetHospitalUnitHead(locationData: LocationUnit) {

    return this.http.post<any>(Master_URL + '/LocationUnit/GetLocationUnitHead', locationData)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  GetLiteracy(locationData: LocationUnit) {

    return this.http.post<any>(Master_URL + '/Literacy/List', locationData)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  // Ist Step patient
  GetPatientData(baseObje: PartographPatientSetup) {
    return this.http.post<any>(BASE_URL + '/Patient/List', baseObje)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  // IInd Step patient
  GetPatientRegistration(baseObje: PatientPartographDetail) {
    return this.http.post<any>(BASE_URL + '/Partograph/List', baseObje)
      .pipe(map(result => {
        return result;
      }));
  }


  // GetPatientList
  GetPatientList(baseObje: PatientPartographDetail) {
    return this.http.post<any>(BASE_URL + '/Patient/List', baseObje)
      .pipe(map(result => {
        return result;
      }));
  }

  GetHospitalList(hospitalSetup: HospitalSetup) {
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${BASE_URL}/Location/GetAllHospital`, hospitalSetup, httpOptions)
      .pipe(map(charge => {
        return charge;
      }));
  }

  GetHospitalList2(hospitalSetup: HospitalSetup2) {
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${BASE_URL}/Location/GetAllHospital`, hospitalSetup, httpOptions)
      .pipe(map(charge => {
        return charge;
      }));
  }

  getpatientlistAll(patientModel: patientlist) {
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${BASE_URL}/Patient/GetPatientList`, patientModel, httpOptions)
      .pipe(map(charge => {
        return charge;
      }));
  }
  getpatientlistAll2(patientModel2: patientlist2) {
    var httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<any>(`${BASE_URL}/Patient/GetPatientList`, patientModel2, httpOptions)
      .pipe(map(charge => {
        return charge;
      }));
  }

  getpatientsetuplist(any) {
    this.patientselected = any;

  }

  activateanddeactivateHospitalsetupList(test: string): Observable<HospitalSetup[]> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(BASE_URL + '/Location/ActiveAll', test, this.httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  activateanddeactivatepatientsetuppatientlist(test: string): Observable<patientlist[]> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(BASE_URL + '/Patient/ActiveAll', test, this.httpOptions)
      .pipe(map(freight => {
        return freight;
      }));
  }
  deletepatientsetuppatientlist(test: string): Observable<patientlist[]> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(BASE_URL + '/Patient/DeleteAll', test, this.httpOptions)
      .pipe(map(freight => {
        return freight;
      }));
  }



  //getpatientlistAll(baseObje: patientlist) {
  //  return this.http.get<any>(BASE_URL + '/Patient/GetPatientList', baseObje)
  //    .pipe(map(result => {
  //      return result;
  //    }));
  //}




  // GetPatientList
  UpdatePatientStatus(patientStatus: PatientStatus) {
    return this.http.post<any>(BASE_URL + '/Patient/UpdatePatientStatus', patientStatus)
      .pipe(map(result => {
        return result;
      }));
  }


  
  SearchPatientInformation(serachobj: PatientSerach) {

    return this.http.post<any>(BASE_URL + '/Patient/SerachPatient', serachobj)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  GetAddedpatientList(serachobj: PatientSerach) {

    return this.http.post<any>(BASE_URL + '/Patient/GetAddedPatientList', serachobj)
      .pipe(map(LocationList => {
        return LocationList;
      }));
  }

  //Getpatientbyidcriticalpatientinformation
  GetPatientInfoByID(ids: number): Observable<criticalPatientInfo[]> {
    //
    //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<criticalPatientInfo[]>(`${BASE_URL +'/Patient/GetPatientInfoByID?Patientid='}${ids}`,this.httpOptions)
      .pipe(map(patient => {        
        return patient;
        
      }));
  }


  getpatientpresentillness(any) {
    this.patientpresentillness = any;
  }



  // Get Patient Covid Status 
  GetPatientCovidStatusList() {
    return this.http.get<any>(BASE_URL + '/PatientHistoryofPresentIllness/GetCovidStatus')
      .pipe(map(result => {
        return result;
      }));
  }


  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
