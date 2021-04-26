/*
Developer Name: Vinay Kumar
File Created By: Vinay Kumar
Date: Aug 29, 2020
TFS ID: 17214
Logic Description: added useraccess.service
Start Code
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonCallListViewModel, CommonStatusListViewModel, PeriodicElement, RolesViewModel, UserRolesListViewModel, UsersContactViewModel, UsersViewModel, AddressCallListViewModel, UserLocationListViewModel } from '..';
import { environment } from '../../../environments/environment';
import { JsonApiService } from './json-api.service';
import { AddressLocation } from '../models/geolocation';

@Injectable({
  providedIn: 'root'
})
export class UseraccessService {

  public userAccess: Observable<any>;
  public userAccessSubject: BehaviorSubject<any>;
  public pageSize: BehaviorSubject<any>;
  public pageSizeObj: Observable<any>;

  constructor(private jsonApiService: JsonApiService, private http: HttpClient
  ) {
    this.userAccessSubject = new BehaviorSubject<Array<PeriodicElement>>([]);
    this.userAccess = this.userAccessSubject.asObservable();
    this.pageSize = new BehaviorSubject<number>(0);
    this.pageSizeObj = this.pageSize.asObservable();
  }

  getAll() {
    return this.http.get<UsersViewModel[]>(`${environment.serverUrl}${routesConstrant.users}`);
  }

  addUser(userModal: UsersViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.users}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  addAllUser(userModal: UsersViewModel[]) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.usersSaveAll}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  getAllUserByLoginIds(loginIds: string) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.loginExist}/${loginIds}`)
      .pipe(map(user => {
        return user;
      }));
  }


  updateUser(userModal: UsersViewModel, id: number) {
    const model = {
      clientId: userModal.clientId,
      loginId: userModal.loginId,
      firstName: userModal.firstName,
      lastName: userModal.lastName,
      middleName: userModal.middleName,
      prefix: userModal.prefix,
      suffix: userModal.suffix,
      orgnizationId: userModal.orgnizationId,
      id: id
    }
    return this.http.put<any>(`${environment.serverUrl}${routesConstrant.users}`, model)
      .pipe(map(user => {
        return user;
      }));
  }
  addUserContact(userModal: UsersContactViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contact}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  updateUserContact(userModal: UsersContactViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contact}/update`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }
  
  getContactType(userModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.masterServerUrl}${routesConstrant.contactType}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  getUserContactCount(userModal: UsersContactViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contact}/listcount`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  getAddressType(userModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.masterServerUrl}${routesConstrant.addressType}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }
  
  getSearchContact(userModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactList}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }
  getUserContactById(Id: number) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/${Id}`)
      .pipe(map(user => {
        return user;
      }));
  }

  getPatientContactById(Id: number) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/${'GetPatientContactById'}/${Id}`)
      .pipe(map(user => {
        return user;
      }));
  }
  getUserStatusList(userModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.statuslist}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  setGridUserDetails(periodicElement: string) {
    if (periodicElement.length == 0) {
      this.userAccessSubject.next(null);
    } else {
      this.userAccessSubject.next(periodicElement);
    }
  }

  setUserStatusList(userModal: CommonStatusListViewModel) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.users}/${userModal.Ids}/${userModal.Action}`)
      .pipe(map(user => {
        return user;
      }));
  }

  getUserDetailByIdsList(ids: string) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.users}/${ids}`)
      .pipe(map(user => {
        return user;
      }));
  }

  organizationByUserIdList(id: number) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.organization}/${id}`)
      .pipe(map(user => {
        return user;
      }));
  }

  ///
  rolesList(roles: RolesViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.roleslist}`, roles)
      .pipe(map(user => {
        return user;
      }));
  }


  getUserRoleslistList(userRolesModal: UserRolesListViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.userroleslistList}`, userRolesModal)
      .pipe(map(user => {
        return user;
      }));
  }

  addUserRoleslistList(userRolesModal: UserRolesListViewModel[]) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.userroleslistsaveall}`, userRolesModal)
      .pipe(map(user => {
        return user;
      }));
  }


  updateUserRoleslistList(userRolesModal: UserRolesListViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.userroleslistupdateall}`, userRolesModal)
      .pipe(map(user => {
        return user;
      }));
  }


  getUserRoleslistListByIds(ids: string) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.userroleslist}/${ids}`)
      .pipe(map(user => {
        return user;
      }));
  }


  deleteUserRoleslistListByIds(ids: string, deletedBy: string) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.userroleslist}/ID/${ids}/${deletedBy}`)
      .pipe(map(user => {
        return user;
      }));
  }

  getUserContactList(userModal: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactGetAllList}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  editUserContactListByIds(id: string) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/getbyid/${id}`)
      .pipe(map(user => {
        return user;
      }));
  }

  

  editContactDetailActionbyId(id: string, actionType: string) {
    //let url = `${environment.commonServerUrl}​​​​​${routesConstrant.contact}​​​​​/getbyid/${id}​​​​​/${actionType}​​​​​`;
    //console.log(environment.commonServerUrl.trim() + routesConstrant.contact.trim() + '/getbyid/' + `${id}/${actionType}`)

    return this.http.get<any>(environment.commonServerUrl.trim() + routesConstrant.contact.trim() +'/getbyid/'+ `${id​​​​​}/${actionType}`)
      .pipe(map(LocationList => {
        return LocationList;
      }));

    //return this.http.get<any>(url)
    //  .pipe(map(user => {
    //    return user;
    //  }));

    //return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/getPatientbyid/${id}`)
    //  .pipe(map(user => {
    //    return user;
    //  }));
  }
    

  deleteUserContactListByIds(id: string, deletedBy: string) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contact}/id/${id}/${deletedBy}`)
      .pipe(map(user => {
        return user;
      }));
  }



  updateUserAddress(userModal: AddressLocation) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactAddress}/update`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  getUserAddressList(userModal: AddressCallListViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactAddressGetAllList}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

  editUserAddressListByIds(id: string, actionType: string) {
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contactAddress}/getbyid/${id}/${actionType}`)
      .pipe(map(user => {
        return user;
      }));
  }

  deleteUseAddressListByIds(id: string, deletedBy: string, actionType: string) {
    debugger;
    return this.http.get<any>(`${environment.commonServerUrl}${routesConstrant.contactAddress}/id/${id}/${deletedBy}/${actionType}`)
      .pipe(map(user => {
        return user;
      }));
  }

  getSearchAddressList(userModal: AddressCallListViewModel) {
    return this.http.post<any>(`${environment.commonServerUrl}${routesConstrant.contactAddresslList}`, userModal)
      .pipe(map(user => {
        return user;
      }));
  }

 


  planningLocationList(roles: RolesViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.roleslist}`, roles)
      .pipe(map(user => {
        return user;
      }));
  }

  getPlanningLocationList(userLocationListModal: UserLocationListViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.userlocationplaninglocationList}`, userLocationListModal)
      .pipe(map(user => {
        return user;
      }));
  }
 

  addUserPlanningLocationList(userLocationListModal: UserLocationListViewModel[]) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.userlocationlistsaveall}`, userLocationListModal)
      .pipe(map(user => {
        return user;
      }));
  }


  updateUserPlanningLocationList(userLocationListModal: UserLocationListViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.userlocationlistupdateall}`, userLocationListModal)
      .pipe(map(user => {
        return user;
      }));
  }

  getUserPlanningLocationListByIds(ids: string) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.userlocationlist}/${ids}`)
      .pipe(map(user => {
        return user;
      }));
  }


  deleteUserPlanningLocationListByIds(ids: string, deletedBy: string) {
    return this.http.get<any>(`${environment.serverUrl}${routesConstrant.userlocationlist}/ID/${ids}/${deletedBy}`)
      .pipe(map(user => {
        return user;
      }));
  }

  locationFunctionList(roles: CommonCallListViewModel) {
    return this.http.post<any>(`${environment.masterServerUrl}${routesConstrant.locationfunction}`, roles)
      .pipe(map(user => {
        return user;
      }));
  }

  locationList(locationTypes: UserLocationListViewModel[]) {
    return this.http.post<any>(`${environment.coreBaseApiUrl}${routesConstrant.locationList}`, locationTypes)
      .pipe(map(locations => {
        return locations;
      }));
  }

  getuserLocationList(userLocationListModal: UserLocationListViewModel) {
    return this.http.post<any>(`${environment.serverUrl}${routesConstrant.userlocationlistList}`, userLocationListModal)
      .pipe(map(user => {
        return user;
      }));
  }
  
}
/*TFS ID: 17214
 End Code*/



export const routesConstrant = {
  users: '/usersaccess',
  statuslist: '/usersaccess/statuslist',
  contact: '/Contact',
  contactType: '/ContactType/list',
  contactList: '/Contact/list',
  addressType: '/AddressType/list',
  usersSaveAll: '/usersaccess/saveupdateall',
  loginExist: '/usersaccess/loginid',
  organization: '/organization',
  roleslist: '/roles/list',
  userroleslistList: '/userrolelist/list',
  userroleslistsaveall: '/userrolelist/saveall',
  userroleslistupdateall: '/userrolelist/updateall',
  userroleslist: '/userrolelist',
  contactGetAllList: '/Contact/getAll/list',
  contactAddressGetAllList: '/ContactAddress/getAll/list',
  contactAddress: '/ContactAddress',
  contactAddresslList: '/ContactAddress/list',
  userlocationlistList: '/userlocationlist/list',
  userlocationlistsaveall: '/userlocationlist/saveall',
  userlocationlistupdateall: '/userlocationlist/updateall',
  userlocationlist: '/userlocationlist',
  locationfunction: '/LocationFunction/list',
  locationList: '/location/locationlist',
  userlocationplaninglocationList: '/userlocationlist/planinglocationlist',
}

