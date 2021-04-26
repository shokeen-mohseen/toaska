/*
Developer Name: Vinay Kumar
File Modify By: Vinay Kumar
Date: Sep 01, 2020
TFS ID: 17214
Logic Description: add user Contact through common api 
Start Code
*/
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { UsersContactViewModel, UseraccessService, CommonCallListViewModel, AuthService } from '@app/core';
import { CustomerByLocationService } from '../../../core/services/customer-by-location.service';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SERVER_TOKEN } from '@angular/flex-layout';
import { ServerChartValues } from '../../../modules/manage-partograph/modals/input-chart';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { NUMBER_TYPE } from '@angular/compiler/src/output/output_ast';
import { LocationContactViewModel } from '../../../core/models/Location';
import { ContactTypeActions } from '../../../core/constants/constants';

@Component({
  selector: 'app-contactfields',
  templateUrl: './contactfields.component.html',
  styleUrls: ['./contactfields.component.css']
})
export class ContactfieldsComponent implements OnInit, OnDestroy, AfterViewInit {

  isInterface: number;
  itemListA = [];
  itemListB = [];
  Inactive: boolean = false;
  selectedItemsA = [];
  settingsA = {};

  //selectedItemsB = [];
  settingsB = {};
  countB = 3;

  count = 3;

  userData = {
    listB: []
  };

  onSubmit(validForm, userData) {
  }

  @Input() public modalData1;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Output() addEntry: EventEmitter<any> = new EventEmitter<any>();
  @Output() editEntry: EventEmitter<any> = new EventEmitter<any>();
  @Input() contactIds: string;
  returnUrl: string;
  error: string;
  isLoading = true;
  userContactServiceSubcriber: Subscription;
  customerByLocationServiceSubscriber: Subscription;
  modalRef: NgbModalRef;
  usersContactViewModel: UsersContactViewModel = new UsersContactViewModel();
  locationContactViewModel: LocationContactViewModel = new LocationContactViewModel();
  commonCallListViewModel: CommonCallListViewModel = new CommonCallListViewModel();
  @Input() contactActionType: string;
  contactTypelist = [];
  clientId: number;
  searchContactlist = [];
  searchContact;
  contactTypeMap = {};
  progressBarService: any;
  userContactId: number;
  contactTypeId: string;
  @Input() userId: number;
  @Input() locationId: number;
  @Input() patientId: number;
  @Input("getContactById") getContactById: number;
  @Input("isEditRights") isEditRights: boolean;

  constructor(public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private useraccessService: UseraccessService,
    private customerbylocationService: CustomerByLocationService,
    private toastrService: ToastrService,
    private authenticationService: AuthService) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.usersContactViewModel.clientId = this.clientId;
    this.commonCallListViewModel.ClientID = this.clientId;

  }

  changeNotification(mode, event) {
    if (mode == "Email") {
      if (this.usersContactViewModel.email == "" || this.usersContactViewModel.email == null) {
        if (event) {
          this.usersContactViewModel.emailNotificationAllow = false;
          this.toastrService.warning("Enter emailid for notification");
          this.isValidated = 0;
        }
        else {
          this.usersContactViewModel.emailNotificationAllow = false;
          this.isValidated = 1;
        }
        
      }
      else {
        this.usersContactViewModel.emailNotificationAllow = event.target.checked;
        this.isValidated = 1;
      }
      
    }
    else if (mode == "workPhone") {
      if (this.usersContactViewModel.workPhone == "" || this.usersContactViewModel.workPhone == null) {
        if (event) {
          this.usersContactViewModel.workPhoneNotificationAllow = false;
          this.toastrService.warning("Enter work phone no. for notification");
          this.isValidated = 0;
        }
        else {
          this.usersContactViewModel.workPhoneNotificationAllow = false;
          //this.toastrService.warning("Enter work phone no. for notification");
          this.isValidated = 1;
        }
       
      }
      else {
        this.isValidated = 1;
        this.usersContactViewModel.workPhoneNotificationAllow = event.target.checked;
      }
    }
    else if (mode == "mobilePhone") {
      if (this.usersContactViewModel.mobilePhone == "" || this.usersContactViewModel.mobilePhone == null) {

        if (event) {
          this.usersContactViewModel.mobilePhoneNotificationAllow = false;
          this.toastrService.warning("Enter mobile phone no. for notification");
          this.isValidated = 0;
        }
        else {
          this.usersContactViewModel.mobilePhoneNotificationAllow = false;
          //this.toastrService.warning("Enter mobile phone no. for notification");
          this.isValidated = 1;
        }

      }
      else {
        this.isValidated = 1;
        this.usersContactViewModel.mobilePhoneNotificationAllow = event.target.checked;
      }
    }
  }

  ngAfterViewInit(): void {
   
    if (this.contactIds) {
      if (this.contactActionType == ContactTypeActions.Location) {
        this.useraccessService.editContactDetailActionbyId(this.contactIds, this.contactActionType).pipe().subscribe(x => {
          if (x.data) {
            this.contactTypeId = x.data.contactTypeId;
            this.userContactId = x.data.userContactId;

            this.setUserContactModel(x.data);

          }
        });
      }
      else {
        console.log(this.contactIds)
        console.log(this.contactActionType)
        this.useraccessService.editContactDetailActionbyId(this.contactIds, this.contactActionType).pipe().subscribe(x => {
          if (x.data) {
            this.contactTypeId = x.data.contactTypeId;
            this.userContactId = x.data.userContactId;

            this.setUserContactModel(x.data);

          }
        });
        //if (this.contactActionType == ContactTypeActions.Patient) {
        //  this.useraccessService.editContactDetailActionbyId(this.contactIds, this.contactActionType).pipe().subscribe(x => {
        //    if (x.data) {
        //      this.contactTypeId = x.data.contactTypeId;
        //      this.userContactId = x.data.userContactId;

        //      this.setUserContactModel(x.data);

        //    }
        //  });
        //}
        //else {

        //  this.useraccessService.editContactDetailActionbyId(this.contactIds, this.contactActionType).pipe().subscribe(x => {
        //    if (x.data) {
        //      this.contactTypeId = x.data.contactTypeId;
        //      this.userContactId = x.data.userContactId;

        //      this.setUserContactModel(x.data);

        //    }
        //  });
        }
      }
    //}
  }

  ngOnInit(): void {

    this.isInterface = 1;
    this.getContactType();
    this.getSearchContact();

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      enableFilterSelectAll: false,
      enableSearchFilter: true,
      // disabled: "false",
      addNewItemOnFilter: true,
      searchBy: ['itemName']
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      enableFilterSelectAll: false,
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName']
    };
  }

  ngOnDestroy(): void {
    if (!!this.userContactServiceSubcriber)
      this.userContactServiceSubcriber.unsubscribe();
  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }

  onAddItem(data: string) {
    this.countB++;
    this.itemListB.push({ "id": this.countB, "itemName": data });
    //this.selectedItemsA.push({ "id": this if (this.contactTypelist.length) {countA, "itemName": data });
  }

  onItemSelect(item: any) {
    this.contactTypeId = item.id;
    /*console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.userData);*/
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.userData);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  addUserContact() {
    if (!this.validation()) {
      return;
    }

    
    this.usersContactViewModel.code = this.modalData1 == undefined ? "LBP" : this.modalData1;
    this.usersContactViewModel.ContactActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
    this.usersContactViewModel.ContactById = this.getContactById;

    if (this.usersContactViewModel.ContactActionType === ContactTypeActions.Patient) {
      //this.usersContactViewModel.PatientId = ServerChartValues.GetPatientId();
      this.usersContactViewModel.workPhoneCountryCode = this.usersContactViewModel.workPhoneCountryCode.toString();
      this.usersContactViewModel.mobilePhoneCountryCode = this.usersContactViewModel.mobilePhoneCountryCode.toString();
    }
    //else if (this.contactActionType === ContactTypeActions.Location) {
    //  this.usersContactViewModel.LocationId = this.locationId;
      
    //}
    if (this.usersContactViewModel.firstName != null) {
      this.usersContactViewModel.firstName = this.usersContactViewModel.firstName.trim();
    }
    if (this.usersContactViewModel.middleName != null) {
      this.usersContactViewModel.middleName = this.usersContactViewModel.middleName.trim();
    }
    if (this.usersContactViewModel.lastName != null) {
      this.usersContactViewModel.lastName = this.usersContactViewModel.lastName.trim();
    }
    this.usersContactViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    //this.usersContactViewModel.workPhone = this.usersContactViewModel.workPhone.toString() ?? "";
    //this.usersContactViewModel.mobilePhone = this.usersContactViewModel.mobilePhone.toString() ?? "";
    if (this.usersContactViewModel.workPhone != null) {
      this.usersContactViewModel.workPhone = this.usersContactViewModel.workPhone.toString();
    }
    else {
      this.usersContactViewModel.workPhone = "";
    }
    if (this.usersContactViewModel.mobilePhone != null) {
      this.usersContactViewModel.mobilePhone = this.usersContactViewModel.mobilePhone.toString();
    }
    else {
      this.usersContactViewModel.mobilePhone = "";
    }
    this.usersContactViewModel.prefix = this.usersContactViewModel.prefix;
    this.usersContactViewModel.suffix = this.usersContactViewModel.suffix;

    this.usersContactViewModel.workPhoneCountryCode = this.usersContactViewModel.workPhoneCountryCode.toString();
    this.usersContactViewModel.mobilePhoneCountryCode = this.usersContactViewModel.mobilePhoneCountryCode.toString();
    this.usersContactViewModel.contactTypeId = parseInt(this.contactTypeId);

    this.usersContactViewModel.createdBy = this.authenticationService.currentUserValue.LoginId;
    this.usersContactViewModel.updateDateTimeBrowser = new Date(new Date().toISOString());
    this.usersContactViewModel.createDateTimeBrowser = new Date(new Date().toISOString());
    
    //this.usersContactViewModel.updateDateTimeServer = new Date(new Date().toISOString());
    //this.usersContactViewModel.createDateTimeServer = new Date(new Date().toISOString());
    //debugger;
    if (this.userId == null) {

      this.usersContactViewModel.userId = this.getContactById;
    }
    else {
      this.usersContactViewModel.userId = this.userId;
    }
    
    if (this.contactIds) {
      this.usersContactViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
      this.usersContactViewModel.userContactId = Number(this.contactIds);
      this.userContactServiceSubcriber = this.useraccessService.updateUserContact(this.usersContactViewModel).subscribe(
        result => {
          // Handle result
          this.getSearchContact();
        },
        error => {
          this.error = error;
          this.toastrService.error(this.error);
        },
        () => {
          // No errors, route to new page here
          this.toastrService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
          this.addEntry.emit(null);
          this.isValidated = 0;
        }
      );

    } else {
      this.userContactServiceSubcriber = this.useraccessService.addUserContact(this.usersContactViewModel).subscribe(
        result => {
          // Handle result
          this.getSearchContact();
          this.addEntry.emit(result);
          //this.activeModal.close();
        },
        error => {
          this.error = error;
          this.toastrService.error(this.error);
        },
        () => {
          // No errors, route to new page here
          this.toastrService.success(GlobalConstants.SUCCESS_MESSAGE);
          this.activeModal.close();
          this.isValidated = 0;
        }
      );
    }
    // this.toastrService.success('User is saved successfully');
    this.usersContactViewModel = new UsersContactViewModel();
    this.contactTypeId = '';
    this.userContactId = 0;
    this.isSearch = false;
  }

  isContactTypeId: number = 0;
  isFirstName: number = 0; isFirstNameAlphabets: number = 0;
  isLastName: number = 0; isLastNameAlphabets: number = 0;
  isEmail: number = 0; isMiddleNameAlphabets : number=0
  isValidEmail: number = 0;
  isExistUserContact: number = 0;
  isWorkPhone: number = 0; isWorkminPhone: number = 0;
  isMobilePhone: number = 0; isMobileMinPhone: number = 0;

  keyphone(e: any) {
    
    if (e.keyCode == 45 || e.keyCode == 43) {

      return false;
    }

    return true;
  }

  validateEmail(email) {
    let isEmail = false;
    if (!!email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isEmail = !(re.test(String(email).toLowerCase()));
    }
    return isEmail;
  }
  isValidated: number = 0;
  validation(type: string = ''): boolean {
    //if (this.isInterface) {
      if (this.isEditRights) {
        if (1==1 || this.contactActionType == ContactTypeActions.Location || this.contactActionType == ContactTypeActions.Patient) {
          let isValidated: boolean = true;
          if (!!!this.contactTypeId && (type === '' || type === GlobalConstants.contactTypeId)) {
            this.isContactTypeId = 1;
            isValidated = false;
          } else {
            this.isContactTypeId = 0;
          }
          if (!!!this.usersContactViewModel.firstName && (type === '' || type === GlobalConstants.firstName)) {
            this.isFirstName = 1;
            isValidated = false;
          } else {
            this.isFirstName = 0;
          }

          if (this.usersContactViewModel.firstName != "" && (type === '' || type === GlobalConstants.firstName)) {

            let val = this.usersContactViewModel.firstName;

            if (!val.toString().match(/^[a-zA-Z/\-\ ]*$/)) {

              this.isFirstNameAlphabets = 1;

              isValidated = false;
            }
            else {

              this.isFirstNameAlphabets = 0;
            }


          }


          if (!!!this.usersContactViewModel.lastName && (type === '' || type === GlobalConstants.lastName)) {
            this.isLastName = 1;
            isValidated = false;
          } else {
            this.isLastName = 0;
          }


          if (this.usersContactViewModel.middleName != "" && (type === '' || type === 'middleName')) {

            let val = this.usersContactViewModel.middleName;

            if (!val.toString().match(/^[a-zA-Z/\-\ ]*$/)) {

              this.isMiddleNameAlphabets = 1;

              isValidated = false;
            }
            else {

              this.isMiddleNameAlphabets = 0;
            }
          }


          if (this.usersContactViewModel.lastName != "" && (type === '' || type === GlobalConstants.lastName)) {

            let val = this.usersContactViewModel.lastName;

            if (!val.toString().match(/^[a-zA-Z/\-\ ]*$/)) {

              this.isLastNameAlphabets = 1;

              isValidated = false;
            }
            else {

              this.isLastNameAlphabets = 0;
            }


          }

          if (this.usersContactViewModel.workPhone != null && this.usersContactViewModel.workPhone != "" && (type === '' || type === GlobalConstants.workPhone)) {
            let val = this.usersContactViewModel.workPhone.toString();
            if (val.length > 10) {
              this.isWorkPhone = 1;
              this.isWorkminPhone = 0;
              isValidated = false;
            }

            else if (val.length < 10) {
              this.isWorkminPhone = 1;
              this.isWorkPhone = 0;
              isValidated = false;
            }

            else {
              this.isWorkPhone = 0;
              this.isWorkminPhone = 0;
              isValidated = true;
            }

          }
          else if (this.usersContactViewModel.workPhone == null) {
            this.isWorkminPhone = 0;
          }
          if (this.usersContactViewModel.mobilePhone != null && this.usersContactViewModel.mobilePhone != "" && (type === '' || type === GlobalConstants.mobilePhone)) {
            let val = this.usersContactViewModel.mobilePhone.toString();
            if (val.length > 10) {
              this.isMobileMinPhone = 0;
              this.isMobilePhone = 1;
              isValidated = false;
            }
            else if (val.length < 10) {
              this.isMobileMinPhone = 1;
              this.isMobilePhone = 0;
              isValidated = false;
            }
            else {
              this.isMobilePhone = 0;
              this.isMobileMinPhone = 0;
              isValidated = true;
            }

          }
          else if (this.usersContactViewModel.mobilePhone == null) {
            this.isMobileMinPhone = 0;
          }

          if (!!!this.usersContactViewModel.email && (type === '' || type === GlobalConstants.email)) {
            this.isEmail = 1;
            isValidated = false;
          } else {
            this.isEmail = 0;
          }
          if (this.validateEmail(this.usersContactViewModel.email) && (type == GlobalConstants.email || type == '')) {
            this.isValidEmail = 1;
            isValidated = false;
          } else {
            this.isValidEmail = 0;
          }

          if (this.isContactTypeId === 0 && this.isFirstName === 0 && this.isLastName === 0 && this.isEmail === 0 && this.isValidEmail === 0) {
            this.usersContactViewModel.contactTypeId = Number(this.contactTypeId);
            this.usersContactViewModel.ContactById = this.getContactById;
            //this.usersContactViewModel.LocationId = this.locationId;
            //if (this.contactActionType == "Patient") {
            //  this.usersContactViewModel.PatientId = this.patientId;
            //}
            this.usersContactViewModel.ContactActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
            this.usersContactViewModel.userContactId = (!!this.contactIds && !this.isSearch)
              || (!!this.contactIds && !!this.userContactId && this.userContactId == Number(this.contactIds)) ? Number(this.contactIds) : 0;
            if (!!this.usersContactViewModel.contactTypeId) {

              this.customerByLocationServiceSubscriber = this.customerbylocationService.getUserContactCount(this.usersContactViewModel)
                .pipe()
                .subscribe(result => {
                  if (result != null) {
                    var results = result.data;
                    this.isExistUserContact = 0;
                    if (Number(results) > 0) {
                      this.isExistUserContact = 1;
                      isValidated = false;
                    }
                    this.submitValidation();
                  }
                });
            }
          }
          //if (!!!this.usersContactViewModel.workPhone && (type === '' || type === GlobalConstants.workPhone)) {
          //  this.isWorkPhone = 1;
          //  isValidated = false;
          //} else {
          //  this.isWorkPhone = 0;
          //}

          //if (!!!this.usersContactViewModel.mobilePhone && (type === '' || type === GlobalConstants.mobilePhone)) {
          //  this.isMobilePhone = 1;
          //  isValidated = false;
          //} else {
          //  this.isMobilePhone = 0;
          //}

          if (this.isExistUserContact == 1) {
            isValidated = false;
          }
          this.submitValidation();
          return isValidated;
        }
        else {
          let isValidated: boolean = true;
          if (!!!this.contactTypeId && (type === '' || type === GlobalConstants.contactTypeId)) {
            this.isContactTypeId = 1;
            isValidated = false;
          } else {
            this.isContactTypeId = 0;
          }
          if (!!!this.usersContactViewModel.firstName && (type === '' || type === GlobalConstants.firstName)) {
            this.isFirstName = 1;
            isValidated = false;
          } else {
            this.isFirstName = 0;
          }

          if (!!!this.usersContactViewModel.lastName && (type === '' || type === GlobalConstants.lastName)) {
            this.isLastName = 1;
            isValidated = false;
          } else {
            this.isLastName = 0;
          }
          if (!!!this.usersContactViewModel.email && (type === '' || type === GlobalConstants.email)) {
            this.isEmail = 1;
            isValidated = false;
          } else {
            this.isEmail = 0;
          }
          if (this.validateEmail(this.usersContactViewModel.email) && (type == GlobalConstants.email || type == '')) {
            this.isValidEmail = 1;
            isValidated = false;
          } else {
            this.isValidEmail = 0;
          }

          if (this.isContactTypeId === 0 && this.isFirstName === 0 && this.isLastName === 0 && this.isEmail === 0 && this.isValidEmail === 0) {
            this.usersContactViewModel.contactTypeId = Number(this.contactTypeId);
            this.usersContactViewModel.userId = this.userId;
            this.usersContactViewModel.ContactById = this.getContactById;
            this.usersContactViewModel.ContactActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
            this.usersContactViewModel.userContactId = (!!this.contactIds && !this.isSearch)
              || (!!this.contactIds && !!this.userContactId && this.userContactId == Number(this.contactIds)) ? Number(this.contactIds) : 0;
            if (!!this.usersContactViewModel.contactTypeId) {

              this.userContactServiceSubcriber = this.useraccessService.getUserContactCount(this.usersContactViewModel)
                .pipe()
                .subscribe(result => {
                  if (result != null) {
                    var results = result.data;
                    this.isExistUserContact = 0;
                    if (Number(results) > 0) {
                      this.isExistUserContact = 1;
                      isValidated = false;
                    }
                    this.submitValidation();
                  }
                });
            }
          }
          //if (!!!this.usersContactViewModel.workPhone && (type === '' || type === GlobalConstants.workPhone)) {
          //  this.isWorkPhone = 1;
          //  isValidated = false;
          //} else {
          //  this.isWorkPhone = 0;
          //}

          //if (!!!this.usersContactViewModel.mobilePhone && (type === '' || type === GlobalConstants.mobilePhone)) {
          //  this.isMobilePhone = 1;
          //  isValidated = false;
          //} else {
          //  this.isMobilePhone = 0;
          //}

          if (this.isExistUserContact == 1) {
            isValidated = false;
          }
          this.submitValidation();
          return isValidated;
        }
      }
    //}

  }

  submitValidation() {
    if (this.contactActionType == ContactTypeActions.Location) {
      this.isValidated = (!!this.contactTypeId && !!this.usersContactViewModel.firstName && !!this.usersContactViewModel.lastName
        && !!this.usersContactViewModel.email && !this.validateEmail(this.usersContactViewModel.email) && this.isExistUserContact === 0
        //&& !!this.usersContactViewModel.workPhone  && !!this.usersContactViewModel.mobilePhone
      ) ? 1 : 0;
    }
    else {
      this.isValidated = (!!this.contactTypeId && !!this.usersContactViewModel.firstName && !!this.usersContactViewModel.lastName
        && !!this.usersContactViewModel.email && !this.validateEmail(this.usersContactViewModel.email) && this.isExistUserContact === 0
        //&& !!this.usersContactViewModel.workPhone  && !!this.usersContactViewModel.mobilePhone
      ) ? 1 : 0;
    }


  }

  getContactType() {
    this.commonCallListViewModel.ContactActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
    this.userContactServiceSubcriber = this.useraccessService.getContactType(this.commonCallListViewModel)
      .subscribe(result => {
        if (result) {
          // Handle result
          this.setContactTypeDropDown(result.data);
          if (this.usersContactViewModel.contactTypeId) {
            this.userData.listB = [this.contactTypelist.find(item => item.id === this.usersContactViewModel.contactTypeId)];
          }
        }
      },
        error => {
          this.error = error;
          this.toastrService.error(this.error);
        }
      );
  }

  setContactTypeDropDown(data: any) {
    this.contactTypelist = [];
    if (!!data)
      this.contactTypelist = data.map(item => {
        this.contactTypeMap[item.id] = item.name;
        return {
          itemName: item.name,
          id: item.id
        };
      });
    this.contactTypelist.sort((x, y) => x.itemName.localeCompare(y.itemName));
  }

  setSearchContactDropDown(data: any) {
    this.searchContactlist = data.map(item => {
      return {
        itemName: this.contactTypeMap[item.contactTypeId] + ' - ' + item.firstName + '  ' + item.lastName + ' - ' + item.email,
        id: item.id,
        firstName: item.firstName,
      };
    });

    this.searchContactlist.sort((x, y) => x.itemName.localeCompare(y.itemName));

  }

  isSearch: boolean = false;
  onSearchContactSelected() {
    this.isSearch = true;
    if (this.contactActionType == ContactTypeActions.Location) {
      this.locationContactViewModel = new LocationContactViewModel();
      this.customerbylocationService.getLocationContactById(this.searchContact[0].id)
        .subscribe(result => {
          if (result) {
            // Handle result
            this.contactTypeId = result.data.contactTypeId;
            this.setUserContactModel(result.data);
            this.validation();
          }
        },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          }
        );
    }
    else if (this.contactActionType == ContactTypeActions.Carrier) {
      this.locationContactViewModel = new LocationContactViewModel();
      this.customerbylocationService.getCarrierContactById(this.searchContact[0].id)
        .subscribe(result => {
          if (result) {
            // Handle result
            this.contactTypeId = result.data.contactTypeId;
            this.setUserContactModel(result.data);
            this.validation();
          }
        },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          }
        );
    }
    else if (this.contactActionType == ContactTypeActions.User) {
      this.usersContactViewModel = new UsersContactViewModel();
      this.useraccessService.getUserContactById(this.searchContact[0].id)
        .subscribe(result => {
          if (result) {
            // Handle result
            this.contactTypeId = result.data.contactTypeId;
            this.setUserContactModel(result.data);
            this.validation();
          }
        },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          }
        );
    }
    else if (this.contactActionType == ContactTypeActions.Patient) {
      this.usersContactViewModel = new UsersContactViewModel();
      this.useraccessService.getPatientContactById(this.searchContact[0].id)
        .subscribe(result => {
          if (result) {
            // Handle result
            this.contactTypeId = result.data.contactTypeId;
            this.setUserContactModel(result.data);
            this.validation();
          }
        },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          }
        );
    }
    else if (this.contactActionType == ContactTypeActions.Organization) {
      this.usersContactViewModel = new UsersContactViewModel();
      this.customerbylocationService.getOrganizationContactById(this.searchContact[0].id)
        .subscribe(result => {
          if (result) {
            // Handle result
            this.contactTypeId = result.data.contactTypeId;
            this.setUserContactModel(result.data);
            this.validation();
          }
        },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          }
        );
    }

  }

  setUserContactModel(usersContactViewModel: UsersContactViewModel) {
    this.usersContactViewModel = new UsersContactViewModel();
    this.usersContactViewModel.clientId = usersContactViewModel.clientId;
    this.usersContactViewModel.code = usersContactViewModel.code;
    this.usersContactViewModel.contactTypeId = usersContactViewModel.contactTypeId;
    this.usersContactViewModel.description = usersContactViewModel.description;
    this.usersContactViewModel.email = usersContactViewModel.email;
    this.usersContactViewModel.emailSalt = usersContactViewModel.emailSalt;
    this.usersContactViewModel.firstName = usersContactViewModel.firstName;
    this.usersContactViewModel.lastName = usersContactViewModel.lastName;
    this.usersContactViewModel.middleName = usersContactViewModel.middleName;
    this.usersContactViewModel.mobilePhone = usersContactViewModel.mobilePhone;
    
    this.usersContactViewModel.mobilePhoneSalt = usersContactViewModel.mobilePhoneSalt;
    this.usersContactViewModel.nickName = usersContactViewModel.nickName;
    this.usersContactViewModel.prefix = usersContactViewModel.prefix;
    this.usersContactViewModel.primaryEmail = usersContactViewModel.primaryEmail;
    this.usersContactViewModel.referenceNo = usersContactViewModel.referenceNo;
    this.usersContactViewModel.suffix = usersContactViewModel.suffix;
    this.usersContactViewModel.userId = usersContactViewModel.userId;
    
    if (this.contactActionType == ContactTypeActions.Location) {
      this.usersContactViewModel.LocationId = usersContactViewModel.LocationId;

    }
    this.usersContactViewModel.workPhone = usersContactViewModel.workPhone;
    if (this.usersContactViewModel.ContactActionType === ContactTypeActions.Patient) {
      this.usersContactViewModel.workPhoneCountryCode = usersContactViewModel.workPhoneCountryCode;
      this.usersContactViewModel.mobilePhoneCountryCode = usersContactViewModel.workPhoneCountryCode;
    }
    else {
      this.usersContactViewModel.workPhoneCountryCode = usersContactViewModel.workPhoneCountryCode;
      this.usersContactViewModel.mobilePhoneCountryCode = usersContactViewModel.mobilePhoneCountryCode;
    }
    
    if (this.contactActionType == ContactTypeActions.Patient) {
      this.usersContactViewModel.workPhoneCountryCode = usersContactViewModel.workPhoneCountryCode;
      this.usersContactViewModel.mobilePhoneCountryCode = usersContactViewModel.workPhoneCountryCode;
    }
    else {
      this.usersContactViewModel.workPhoneCountryCode = usersContactViewModel.workPhoneCountryCode;
      this.usersContactViewModel.mobilePhoneCountryCode = usersContactViewModel.mobilePhoneCountryCode;
    }
    
    this.usersContactViewModel.workPhoneSalt = usersContactViewModel.workPhoneSalt;
    this.usersContactViewModel.emailNotificationAllow = usersContactViewModel.emailNotificationAllow;
    this.usersContactViewModel.workPhoneNotificationAllow = usersContactViewModel.workPhoneNotificationAllow;
    this.usersContactViewModel.mobilePhoneNotificationAllow = usersContactViewModel.mobilePhoneNotificationAllow;
    this.usersContactViewModel.updatedBy = usersContactViewModel.updatedBy;

    this.validation();

    if (usersContactViewModel.updatedBy === "Interface") {
      this.isInterface = 0;
    }
    else {
      this.isInterface = 1;
    }

    if (this.contactTypelist.length) {
      this.userData.listB = [this.contactTypelist.find(item => item.id === this.usersContactViewModel.contactTypeId)];
    }

    if (this.searchContactlist.length) {
      this.searchContact = [this.searchContactlist.find(item => item.firstName === this.usersContactViewModel.firstName)];
    }
    this.Inactive = this.customerbylocationService.Permission == false ? true : false;
  }

  getSearchContact() {
    this.commonCallListViewModel.ContactActionType = this.contactActionType;
    if (this.contactActionType == ContactTypeActions.Location) {
      this.customerbylocationService.getSearchContact(this.commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          this.isLoading = false;
          if (result != null) {
            // Handle result
            this.setSearchContactDropDown(result.data);
            if (this.usersContactViewModel.firstName) {
              const selectedItem = this.searchContactlist.find(item => item.firstName === this.usersContactViewModel.firstName);
              if (selectedItem) {
                this.searchContact = [selectedItem];
              }
            }
          }
        },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          },
          () => {
          }
        );
    }
    else {

      if (this.contactActionType == "Patient") {

        if (ServerChartValues.GetPatientId()) {

          //this.commonCallListViewModel.PatientID = ServerChartValues.GetPatientId();
        }
      }

      this.useraccessService.getSearchContact(this.commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          if (result != null) {
            // Handle result
            this.setSearchContactDropDown(result.data);
            if (this.usersContactViewModel.firstName) {
              this.searchContact = [this.searchContactlist.find(item => item.itemName === this.usersContactViewModel.firstName)];
            }
          }
        },
          error => {
            this.error = error;
            this.toastrService.error(this.error);
          },
          () => {
          }
        );
    }
  }


  editUserContact() {
    if (this.contactActionType == ContactTypeActions.Location) {
      this.customerbylocationService.editLocationContactListByIds(this.contactIds).subscribe(x => {
        this.editEntry.emit();
      });
    }
    else {
      this.useraccessService.editUserContactListByIds(this.contactIds).subscribe(x => {
        this.editEntry.emit();
      });
    }

  }

  editLocationContact() {
    this.customerbylocationService.editLocationContactListByIds(this.contactIds).subscribe(x => {
      this.editEntry.emit();
    });
  }

}
