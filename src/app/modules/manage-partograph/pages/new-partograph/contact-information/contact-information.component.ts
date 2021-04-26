import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OthersCommonComponent } from '../../../../../shared/components/modal-content/others-common/others-common.component';
import { AddContactComponent } from '../../../../../shared/components/modal-content/add-contact/add-contact.component';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { ContactAddressComponent } from '../../../../../shared/components/modal-content/contact-address/contact-address.component';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { GeolocationService } from '../../../../../core/services/geolocation.services';
import { AddressLocation, ActionType } from '../../../../../core/models/geolocation';
import { User, AuthService, UsersAddressViewModel, UsersContactViewModel } from '../../../../../core';
import { ServerChartValues, PartographSessionManagement } from '../../../modals/input-chart';
import { ToastrService } from 'ngx-toastr';
import { global } from '@angular/compiler/src/util';
import { PhysicianAddComponent } from '../../../../../shared/components/physician-add/physician-add.component';
import { PhysicianPatient } from '../../../../../core/models/patient-phsician';
import { ContactTypeActions } from '../../../../../core/constants/constants';
import { PatientInformationService } from '../../../services/patient-informaation.services';
import { Resource } from '../../../../../core/models/resource ';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.css']
})
export class ContactInformationComponent implements OnInit {
  //changingValue: Subject<any> = new Subject();

  physicianIds: string; idsPhysicianDeteted: string;
  buttonPhysicianEnableDisable: boolean = true;
  @Input() ContactListLength: number; listcontatLen: number;
  _partographSession: PartographSessionManagement;
  physicianList: any[]; isPhysicianAllSelected: boolean = false;
  physicianPatient: PhysicianPatient;
  listaddresstLen: number;
  pageActionTypePatient: string;
  PatientId: number;
  contactAddress: AddressLocation;
  Usercontact: UsersContactViewModel;
  modalRef: NgbModalRef;
  currentUser: User;

  Patient_Contact1 = [];  Patient_Contact3 = [];
  Patient_Contact2 = [];  Patient_Contact4 = [];

  Patient_ContactAddress1 = [];
  Patient_ContactAddress2 = [];
  pointerevents: string = 'none';
  contactData = [];
  addressData = [];
  resource: Resource; @Output() commonId = new EventEmitter<any>();
  constructor(private patientsetupService: PatientInformationService,private authenticationService: AuthService,
                private geolocationService: GeolocationService,
                public modalService: NgbModal,
    private toastrService: ToastrService
  ) {

    this.currentUser = authenticationService.currentUserValue;

    this.contactAddress = new AddressLocation();
    this.Usercontact = new UsersContactViewModel();

    this.Usercontact.ClientID = this.currentUser.ClientId;
    this.Usercontact.ContactActionType = ActionType.pActionType;
    this.Usercontact.PatientId = ServerChartValues.GetPatientId();

    this.contactAddress.ClientID = this.currentUser.ClientId;
    this.contactAddress.AddressActionType = ActionType.pActionType;
    this.contactAddress.PatientID = ServerChartValues.GetPatientId();

    this.PatientId = ServerChartValues.GetPatientId();

    this.pageActionTypePatient = ContactTypeActions.Patient;
    this._partographSession = new PartographSessionManagement();
    this.listcontatLen = 0;
    this.listaddresstLen = 0;
    this.physicianList = [];

    this.physicianPatient = new PhysicianPatient();

    this.getPhysicianList();
  }

  ngOnInit(): void {
    this.pointerevents = '';
    //this.GetContactInformation();
    //this.GetAddressInformation();
    //let sendnotification = { "id": this.PatientId, "actionType": this.pageActionTypePatient }
    //this.changingValue.next(sendnotification);
  }

  addPhy() {
    this.modalRef = this.modalService.open(PhysicianAddComponent, { size: 'lg', backdrop: 'static' });

    this.modalRef.componentInstance.locationId = ServerChartValues.GetLocationId();
    this.modalRef.componentInstance.patientId = this.contactAddress.PatientID;
    //this.modalRef.componentInstance.IdentityIds = this.PatientId;
    this.modalRef.result.then((result) => {
      //console.log(result);
    }).catch((result) => {
      console.log(result);
    });

    this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
     
      this.getPhysicianList();
      //this.GetPatientPhysicianInfo();
    });


  }

  getPhysicianList() {

    this.physicianPatient.PatientId = this.PatientId;
    this.physicianPatient.ClientId = this.authenticationService.currentUserValue.ClientId;
    this.patientsetupService.GetPhysician(this.physicianPatient)
      .pipe()
      .subscribe(result => {
        this.physicianList = [];
        this.isPhysicianAllSelected = false;
        const rowList = result.data;
        if (!!rowList) {

          rowList.filter(item => {
            let physicianPatientExist = new PhysicianPatient();
            physicianPatientExist = item;
            physicianPatientExist.isPhysicianSelected = false;
            this.physicianList.push(physicianPatientExist);
            console.log(this.physicianList)
          });
        }

      });
  }


  GetCountCotact(event): number {
     this.listcontatLen = event;
    //console.log(event)
    return this.listcontatLen
  }

  GetCountAddress(event): number {
     this.listaddresstLen = event;
     return this.listaddresstLen
  }

  GetCountPhysian(): number {
    return 0;
  }

  selectPhysicianAll(check: any) {
    //console.log(check.target.checked)
    this.isPhysicianAllSelected = check.target.checked;
    this.physicianList.forEach(row => {
      // console.log(this.isPhysicianAllSelected)
      row.isPhysicianSelected = this.isPhysicianAllSelected;
      //console.log(row)
    });
    this.setPhysicianCheckBoxData();
  }

  selectPhysicianCheckbox(e: any, value: any) {
    this.idsPhysicianDeteted = "";
    this.buttonPhysicianEnableDisable = true;

    this.physicianList.forEach(row => {
      if (row.id == value.id)
        row.isPhysicianSelected = !value.isPhysicianSelected;
    });

    this.isPhysicianAllSelected = (this.physicianList.length === (this.physicianList.filter(x => x.isPhysicianSelected == true).length));

    this.setPhysicianCheckBoxData();

    //var list: String[] = [];
    //if (e.checked == true) {
    //  this.ItemList.push(value);

    //} else {

    //  this.ItemList = this.ItemList.filter(m => m != value);

    //}

    //for (let i = 0; i < this.ItemList.length; i++) {

    //  list.push(this.ItemList[i].id.toString());

    //}


    //var temp = list.join(",");
    //this.idsPhysicianDeteted = temp;
    //console.log(temp)

  }

  setPhysicianCheckBoxData() {

    let iDs: string = '';
    this.physicianIds = '';
    this.idsPhysicianDeteted = '';
    this.physicianList.filter(x => {
      console.log(x.isPhysicianSelected)
      if (x.isPhysicianSelected == true) {
        iDs += `${x.id},`;
        this.idsPhysicianDeteted += `${x.id},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsPhysicianDeteted = this.idsPhysicianDeteted.substring(0, this.idsPhysicianDeteted.length - 1);
      this.buttonPhysicianEnableDisable = false;
      this.physicianIds = iDs;
    }
    else {
      this.buttonPhysicianEnableDisable = true;
    }

    //console.log(this.physicianIds)
    //console.log(this.idsPhysicianDeteted)
  }

  GetAddressInformation() {

    this.geolocationService.GetAddressInformation(this.contactAddress).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          if (result.data.length > 0) {
            this.addressData = result.data;
            this.BindAddress();
          }
        }
      },
      error => {

        this.toastrService.error(GlobalConstants.Not_found_MESSAGE);
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
       // this.toastrService.success('User is saved successfully');
      }
    );
  }

  GetContactInformation() {

    this.geolocationService.GetContactInformation(this.Usercontact).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          if (result.data.length > 0) {
            this.contactData = result.data
            this.BindContact();
          }
        }
      },
      error => {

        this.toastrService.error(GlobalConstants.Not_found_MESSAGE);
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        // this.toastrService.success('User is saved successfully');
      }
    );
  }

  DeletePhysician() {

    this.resource.UpdatedBy = this.currentUser.LoginId
    this.resource.ids = this.idsPhysicianDeteted;
    if (this.idsPhysicianDeteted.length > 0) {

      if (confirm("Are you sure want to delete")) {
        this.patientsetupService.deletePhysicianListListByIds(this.resource)
          .pipe()
          .subscribe(result => {
            const rowList = result.data;
            if (!!rowList) {
              this.toastrService.success(GlobalConstants.delete_message);
              this.getPhysicianList();
              //this.GetPatientPhysicianInfo();
            }
            else {
              if (!!rowList) {
                this.toastrService.success(GlobalConstants.FAILED_MESSAGE);
              }
            }
          });

      }

    }
  }


  BindContact() {
    const data = this.contactData;
    let Name: any;
    this.Patient_Contact2 = [];
    this.Patient_Contact1 = [];
    this.Patient_Contact4 = [];
    this.Patient_Contact3 = [];
   
    let ContactypeObj :any = [];
    for (let i = 0; i < data.length; i++) {

      
     
      if (data[i].contactType != undefined) {
        if (data[i].contactType != null) {

          ContactypeObj = data[i].contactType;
        
          if (ContactypeObj.code == GlobalConstants.Primary_Contact_Information) {

            if (data[i].middleName == "") {
              Name = data[i].prefix + " " + data[i].firstName + " " + data[i].lastName;
            }
            else {
              Name = data[i].prefix + " " + data[i].firstName + " " + data[i].middleName + " " + data[i].lastName;
            }

            this.Patient_Contact1.push({
              FullName: Name,
              MobileNo: data[i].mobilePhone,
              EmailId: data[i].email
            })


          }
          else if (ContactypeObj.code == GlobalConstants.Emergency_Contact_Information) {

            if (data[i].middleName == "") {
              Name = data[i].prefix + " " + data[i].firstName + " " + data[i].lastName;
            }
            else {
              Name = data[i].prefix + " " + data[i].firstName + " " + data[i].middleName + " " + data[i].lastName;
            }

            this.Patient_Contact2.push({
              FullName: Name,
              MobileNo: data[i].mobilePhone,
              EmailId: data[i].email
            })
          }
          else if (ContactypeObj.code == GlobalConstants.Primary_Physician_Information) {

            if (data[i].middleName == "") {
              Name = data[i].prefix + " " + data[i].firstName + " " + data[i].lastName;
            }
            else {
              Name = data[i].prefix + " " + data[i].firstName + " " + data[i].middleName + " " + data[i].lastName;
            }

            this.Patient_Contact3.push({
              FullName: Name,
              MobileNo: data[i].mobilePhone,
              EmailId: data[i].email
            })
          }

          else if (ContactypeObj.code == GlobalConstants.Secondary_Physician_Information) {

            if (data[i].middleName == "") {
              Name = data[i].prefix + " " + data[i].firstName + " " + data[i].lastName;
            }
            else {
              Name = data[i].prefix + " " + data[i].firstName + " " + data[i].middleName + " " + data[i].lastName;
            }

            this.Patient_Contact4.push({
              FullName: Name,
              MobileNo: data[i].mobilePhone,
              EmailId: data[i].email
            })
          }

        }
      }
    }

  }

  BindAddress() {
    const data = this.addressData;
    let Street: any;
    this.Patient_ContactAddress1 = [];
    this.Patient_ContactAddress2 = [];
    let geoObj : any;
    let gelocationObject: any = [];
    let AddressTypeObject: any = []; 
    for (let i = 0; i < data.length; i++) {

      if (data[i].addressType != undefined) {
        if (data[i].addressType != null) {
          AddressTypeObject = data[i].addressType;
          if (AddressTypeObject.code == (GlobalConstants.HOME_ADDRESS_TYPE_CODE || GlobalConstants.PRIMARY_ADDRESS_TYPE_CODE)) {
            Street = data[i].streetName1 + " " + data[i].streetName2 + " " + data[i].streetName2;
            // alert(data[i].geoLocation)
            if (data[i].geoLocation != undefined) {
              if (data[i].geoLocation != null) {
                //if (data[i].geoLocation.length > 0) {
                // alert(data[i].geoLocation.cityName)
                gelocationObject = data[i].geoLocation;
                geoObj = gelocationObject.cityName + ", " + gelocationObject.stateName
                  + ", " + gelocationObject.countryName + ", " + gelocationObject.zipCode;



                //
              }
            }

            this.Patient_ContactAddress1.push({
              Street: Street,
              GeoLocation: geoObj,

            })


          }
          else if (AddressTypeObject.code == (GlobalConstants.EMERGENCY_ADDRESS_TYPE_CODE || GlobalConstants.MAILING_ADDRESS_TYPE_CODE)) {

            //if (data[i].code == GlobalConstants.Primary_Contact_Information) {
              Street = data[i].streetName1 + " " + data[i].streetName2 + " " + data[i].streetName2;

              if (data[i].geoLocation != undefined) {
                if (data[i].geoLocation != null) {
                  // if (data[i].geoLocation.length > 0) {
                  gelocationObject = data[i].geoLocation;
                  geoObj = gelocationObject.cityName + ", " + gelocationObject.stateName
                    + ", " + gelocationObject.countryName + ", " + gelocationObject.zipCode;



                  //}
                }
              }

              this.Patient_ContactAddress2.push({
                Street: Street,
                GeoLocation: geoObj,

              })


            }
          }
        }
      //}


      
    }

  }

  openContact(mode: string) {
    
    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
    if (mode == "3") {
      this.modalRef.componentInstance.modalData = GlobalConstants.Primary_Physician_Information;
    }
    else {
      this.modalRef.componentInstance.modalData = GlobalConstants.Secondary_Physician_Information;
    }

    this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

      this.GetContactInformation();
      this.GetAddressInformation();

    });
  }

  openAddress() {
    
    this.modalRef = this.modalService.open(OthersCommonComponent, { size: 'lg', backdrop: 'static' });
  }
  openContactonly() {

    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

  //popup for contact and address updation
  OpenAddressContact(mode: string) {

    this.modalRef = this.modalService.open(ContactAddressComponent, { size: 'lg', backdrop: 'static' });
    const component = this.modalRef.componentInstance as ContactAddressComponent;

    if (mode === '1') {
      component.contactTypeCode = GlobalConstants.Primary_Contact_Information;
      component.contactData = this.contactData.find(data => data.code === GlobalConstants.Primary_Contact_Information);
      component.addressData = this.addressData.find(data => data.code === GlobalConstants.Primary_Contact_Information);
    }
    else if (mode === '2') {
      component.contactTypeCode = GlobalConstants.Emergency_Contact_Information;
      component.contactData = this.contactData.find(data => data.code === GlobalConstants.Emergency_Contact_Information);
      component.addressData = this.addressData.find(data => data.code === GlobalConstants.Emergency_Contact_Information);
    }
    else if (mode === '3') {
      component.contactTypeCode = GlobalConstants.Primary_Physician_Information;
      component.contactData = this.contactData.find(data => data.code === GlobalConstants.Primary_Physician_Information);
    }
    else {
      component.contactTypeCode = GlobalConstants.Secondary_Physician_Information;
      component.contactData = this.contactData.find(data => data.code === GlobalConstants.Secondary_Physician_Information);
    }

    this.modalRef.result.then((result) => {
     
    }).catch((result) => {


      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

       this.GetContactInformation();
       this.GetAddressInformation();

      });


    });

  }

}
