/*
Developer Name: Vinay Kumar
File Modify By: Vinay Kumar
Date: Sep 01, 2020
TFS ID: 17214
Logic Description: add user Contact through common api
Start Code
*/
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { UsersAddressViewModel, UseraccessService, CommonCallListViewModel, AuthService, User, AddressCallListViewModel, UserConstant } from '@app/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeolocationService } from '../../../core/services/geolocation.services';
import { Geoloction, AddressLocation } from '../../../core/models/geolocation';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ServerChartValues } from '../../../modules/manage-partograph/modals/input-chart';
import { ContactTypeActions, AddressActionType } from '../../../core/constants/constants';
import { LocationAddressViewModel, LocationAddressCallListViewModel, LocationConstant } from '../../../core/models/Location';
import { CustomerByLocationService } from '../../../core/services/customer-by-location.service';
declare var $: any;
@Component({
  selector: 'app-addressfields',
  templateUrl: './addressfields.component.html',
  styleUrls: ['./addressfields.component.css']
})
export class AddressfieldsComponent implements OnInit, OnDestroy, AfterViewInit {
  isInterface: boolean;
  @Input("isEditRights") isEditRights: boolean;
  @Input("getAddresById") getAddresById: number;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() public contactTypeCode;
  @Input() public addressData;
  returnUrl: string; geoloctionmodel: Geoloction; countryList: any = [];
  duplicateList: any = [];
  error: string; stateList: any = []; cityList: any = []; zipList: any = [];
  isLoading: boolean; settings = {};
  Addressform: FormGroup;
  userAddressServiceSubcriber: Subscription;
  modalRef: NgbModalRef;
  userAddressViewModel: UsersAddressViewModel = new UsersAddressViewModel();
  locationAddressViewModel: LocationAddressViewModel = new LocationAddressViewModel();
  commonCallListViewModel: CommonCallListViewModel = new CommonCallListViewModel();
  addressTypelist = []; addressModel: AddressLocation;
  addressCallListViewModel: AddressCallListViewModel = new AddressCallListViewModel();
  locationAddressCallListViewModel: LocationAddressCallListViewModel = new LocationAddressCallListViewModel();
  
  clientId: number;
  searchAddresslist = [];
  progressBarService: any;
  userAddressId: number;
  addressTypeId: string;
  selectedStateItems: [];
  selectedCountryItems: [];
  selectedCityItems: []; selectedZipItems: []; zipCode: string; stateCode: string; countryCode: string; cityCode: string;
  @Input() contactActionType: string;
  //@Input() locationId: number;
  @Input() addressIds: string;
  //@Input() userId: number;
  @Input() isEdit: boolean = false;
  @Output() addEntry: EventEmitter<any> = new EventEmitter<any>();
  @Output() editEntry: EventEmitter<any> = new EventEmitter<any>();
  userAddressList: UsersAddressViewModel[] = [];
  locationAddressList: LocationAddressViewModel[] = [];
  addressTypeDataMap = {
    'PC01': 'PrimaryAdd',
    'EC01': 'EmergencyAdd',
  }
  isSearch: boolean = false;
  constructor(private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public geolocation: GeolocationService, public modalService: NgbModal,
    private useraccessService: UseraccessService,
    private customerbylocationService: CustomerByLocationService,
    private toastrService: ToastrService,
    private authenticationService: AuthService) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.userAddressViewModel.clientId = this.clientId;
    this.commonCallListViewModel.ClientID = this.clientId;

    this.geoloctionmodel = new Geoloction();

    this.addressModel = new AddressLocation();
    this.addressModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.addressModel.AddressActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
    //this.addressModel.AddressActionType = "Patient";
    this.geoloctionmodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
  }

  ngAfterViewInit(): void {
    this.isSearch = false;
    this.getAddressType();
    this.getSearchAddress();
   
  }

  ngOnDestroy(): void {
    if (!!this.userAddressServiceSubcriber)
      this.userAddressServiceSubcriber.unsubscribe();
  }

  ngOnInit(): void {
    this.isInterface = false;
    this.buildForm();
    // condition for ActionType
    if (this.addressData) {
      this.Addressform.patchValue(this.addressData);
    }

    this.settings = {
      singleSelection: true,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      //addNewItemOnFilter: true,
      searchBy: ['itemName'],
      //disabled: true
    };


    this.getAddressType();
    this.GetGeolocation(this.geoloctionmodel);
    //$('.select2').select2();


  }


 
  SaveAddressData() {

    if (!this.isEditRights) {

      return;
    }

    //if (this.contactActionType = AddressActionType.Location) {
    //  this.isEdit = true;
    //}
    if (this.Addressform.invalid) {

      return;
    }

    let userform: any;
    let city: any; let state: any; let country: any;
    let zip: any;
    userform = this.Addressform.value;

    city = userform.CityData;
    state = userform.StateData;
    country = userform.CountryData;
    zip = userform.ZipData;
    userform.streetName2 = userform.streetName2 == null ? '' : userform.streetName2;
    userform.streetName3 = userform.streetName3 == null ? '' : userform.streetName3;
    this.addressModel.Name = userform.streetName1 + " " + userform.streetName2 + " " + userform.streetName3;
    //this.addressModel.PatientID = ServerChartValues.GetPatientId();
    this.addressModel.AddressbyId = this.getAddresById;
    //if (this.addressModel.AddressActionType === ContactTypeActions.Patient) {
    //  this.addressModel.PatientID = ServerChartValues.GetPatientId();
    //}
    //else if (this.contactActionType === ContactTypeActions.Location) {
    //  this.addressModel.LocationId = this.locationId;
    //}
    this.addressModel.SourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;
    this.addressModel.AddressTypeId = userform.AddressTypeData[0].id;
    this.addressModel.CityCode = city[0].id;
    this.addressModel.CountryCode = country[0].id;
    this.addressModel.StateCode = state[0].id;
    this.addressModel.CityName = city[0].itemName;
    this.addressModel.CountryName = country[0].itemName;
    this.addressModel.StateName = state[0].itemName;

    if (zip != null) {
      this.addressModel.ZipCode = zip[0].id;
    }
    
    //  this.addressModel.StateName = zip[0].itemName;


    this.addressModel.Code = this.contactTypeCode == undefined ? "LBP" : this.contactTypeCode;
    

    this.addressModel.StreetName1 = userform.streetName1;
    this.addressModel.StreetName2 = userform.streetName2;
    this.addressModel.StreetName3 = userform.streetName3;
    // condition for ActionType
    let saveService;
    //if (this.addressModel.AddressActionType === AddressActionType.Patient) {
    //  this.addressModel.CreatedBy = this.authenticationService.currentUserValue.LoginId;
    //  this.addressModel.CreateDateTimeBrowser =new Date(new Date().toISOString());
    //  this.addressModel.UpdateDateTimeBrowser =new Date(new Date().toISOString());
    //  this.addressModel.ClientID = this.authenticationService.currentUserValue.ClientId;

    //  if (this.addressData) {
    //    this.addressModel.id = this.addressData.id;
    //    saveService = this.geolocation.UpdateAddressInformation(this.addressModel);
    //  } else {
    //    this.geolocation.AddPatientAddress(this.addressModel).subscribe(data => {
    //      // this.countryList = data.data;	
    //      if (data.data != null) {
    //        this.Addressform.reset();
    //        this.passEntry.emit(1);
    //        this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
    //        this.addEntry.emit(data.data);
    //        this.addressIds = '';
    //        this.searchId = '';
    //        this.isSearch = false;
    //        this.getAddressType();
    //      }
    //    });
    //    //saveService = this.geolocation.AddPatientAddress(this.addressModel)
    //  }
    //}
    //else {
      //  this.addressModel.CountryCode = userform.
    this.addressModel.AddressActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
    this.addressModel.AddressbyId = this.getAddresById;

      if (!!this.addressIds && this.isEdit) {
        this.addressModel.UpdatedBy = this.authenticationService.currentUserValue.LoginId;
        this.addressModel.UpdateDateTimeBrowser = new Date(new Date().toISOString());
        this.addressModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.addressModel.SourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;
        this.addressModel.ContactAddressId = Number(this.addressIds);
        if (this.contactActionType === AddressActionType.User) {
          this.useraccessService.updateUserAddress(this.addressModel).subscribe(data => {
            // this.countryList = data.data;

            if (data.data != null) {
              this.Addressform.reset();
              this.passEntry.emit(1);
              this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
              this.editEntry.emit(data.data);
            }
          });

        }
        else if (this.contactActionType === AddressActionType.Organization) {
          this.useraccessService.updateUserAddress(this.addressModel).subscribe(data => {
            // this.countryList = data.data;

            if (data.data != null) {
              this.Addressform.reset();
              this.passEntry.emit(1);
              this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
              this.editEntry.emit(data.data);
            }
          });

        }
        else if (this.contactActionType === AddressActionType.Carrier) {
          this.useraccessService.updateUserAddress(this.addressModel).subscribe(data => {
            // this.countryList = data.data;

            if (data.data != null) {
              this.Addressform.reset();
              this.passEntry.emit(1);
              this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
              this.editEntry.emit(data.data);
            }
          });

        }
        else if (this.contactActionType === AddressActionType.Location) {
          this.customerbylocationService.updateLocationAddress(this.addressModel).subscribe(data => {
            // this.countryList = data.data;

            if (data.data != null) {
              this.Addressform.reset();
              this.passEntry.emit(1);
              this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
              this.editEntry.emit(data.data);
            }
          });
        }
        else if (this.contactActionType === AddressActionType.Patient) {
          saveService.subscribe(data => {
            // this.countryList = data.data;

            if (data.data != null) {
              this.Addressform.reset();
              this.passEntry.emit(1);
              this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
              this.editEntry.emit(data.data);
            }
          });
        }
      } else {
        this.addressModel.CreatedBy = this.authenticationService.currentUserValue.LoginId;
        this.addressModel.CreateDateTimeBrowser = new Date(new Date().toISOString());
        this.addressModel.UpdateDateTimeBrowser = new Date(new Date().toISOString());
        this.addressModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.addressModel.SourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;
        this.geolocation.AddPatientAddress(this.addressModel).subscribe(data => {
          // this.countryList = data.data;	
          if (data.data != null) {
            this.Addressform.reset();
            this.passEntry.emit(1);
            this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
            this.addEntry.emit(data.data);
            this.addressIds = '';
            this.searchId = '';
            this.isSearch = false;
            this.getAddressType();
            this.activeModal.close();
          }
        });
      }
      // console.log(this.addressModel);

    //}
  }
  private buildForm(): void {

    this.Addressform = this.formBuilder.group(
      {
        ExistingAddressData: new FormControl(null),
        AddressTypeData: new FormControl(null, [Validators.required]),

        streetName1: ['', [Validators.required, Validators.maxLength(250)]],
        streetName2: [null, [Validators.maxLength(250)]],
        streetName3: ['', Validators.maxLength(250)],

        CountryData: new FormControl(null, [Validators.required]),
        StateData: new FormControl(null, [Validators.required]),
        CityData: new FormControl(null, [Validators.required]),
        ZipData: new FormControl(null, [Validators.required]),
        interface: new FormControl(1, [Validators.required]),
        isEditRights: new FormControl(1, [Validators.required]),
        //GeolocationId: [null, Validators.required], 
      }
    );

    if (this.isEditRights) {
      this.Addressform.controls["isEditRights"].setValue(1);
    }
    else {
      this.Addressform.controls["isEditRights"].setValue(null);
    }
    //this.onEditbutton();

  }

  onEditbutton() {
    this.useraccessService.editUserAddressListByIds(this.addressIds, this.contactActionType).pipe().subscribe(x => {
      if (x.data) {
        this.addressTypeId = x.data.addressTypeId;
        this.userAddressId = x.data.id;

        this.setUserContactModel(x.data);

      }
    });
  }

  setUserContactModel(data: any) {
    this.Addressform.controls["streetName1"].setValue(data.streetName1);
    this.Addressform.controls["streetName2"].setValue(data.streetName2);
    this.Addressform.controls["streetName3"].setValue(data.streetName3);

    if (this.addressTypelist.length) {
      //this.addressTypelist.find(item => item.id === data.addressTypeID)
      this.Addressform.controls["AddressTypeData"].setValue(this.addressTypelist.find(item => item.id === data.addressTypeID));

      //const addressTypeItem = this.addressTypelist.find(item => this.addressTypeDataMap[this.contactTypeCode] === item.code);
      //this.Addressform.get('AddressTypeData').setValue(addressTypeItem.id);

      // this.userData.listB  = [this.addressTypelist.find(item => item.id === data.addressTypeID)];
    }

  }

  get f() {

    return this.Addressform.controls;
  }

  GetGeolocation(modelgeolocation) {
    
    this.geolocation.GetGeolocation(modelgeolocation).subscribe(data => {
      // this.countryList = data.data;

      if (data.data != null) {

        this.BindGelocation(modelgeolocation, data.data);


      }
    });
  }

  GetGeolocationIdByCode(modelgeolocation) {

    this.geolocation.GetLocationID(modelgeolocation).subscribe(data => {
      let dataList: any = data.data
      // console.log(data)
      if (dataList != null) {
        // this.formAppendData.patchValue({ "PromotionId": this.sPromotionId });
        //this.Addressform.get('GeolocationId').setValue(dataList.id);
        //console.log(this.Addressform)
      }
    });
  }

  BindGelocation(mdgeolocation: Geoloction, data: any[]) {

    if (mdgeolocation.mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.countryList = [];


      this.duplicateList = [];
      for (let i = 0; i < data.length; i++) {

        this.duplicateList.push({

          id: data[i].code,
          itemName: data[i].name

        })
      }
      this.countryList = this.duplicateList.filter((n, i) => this.duplicateList.indexOf(n) === i);
      // condition for ActionType
      if (this.addressData) {
        const countryItem = this.countryList.find(item => this.addressData.geoLocation.countryCode === item.id);
        this.Addressform.get('CountryData').setValue([countryItem]);

        this.GeolocationChange(countryItem, 'STATE');
      }
    }
    else if (mdgeolocation.mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.stateList = [];
      for (let i = 0; i < data.length; i++) {

        this.stateList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
      }
      // condition for ActionType
      if (this.addressData) {
        const stateItem = this.stateList.find(item => this.addressData.geoLocation.stateCode === item.id);
        this.Addressform.get('StateData').setValue([stateItem]);

        this.GeolocationChange(stateItem, 'CITY');
      }
    }

    else if (mdgeolocation.mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.cityList = [];
      for (let i = 0; i < data.length; i++) {

        this.cityList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
      }
      // condition for ActionType
      if (this.addressData) {
        const cityItem = this.cityList.find(item => this.addressData.geoLocation.cityCode === item.id);
        this.Addressform.get('CityData').setValue([cityItem]);
        this.GeolocationChange(cityItem, 'ZIP');
      }

    }
    else if (mdgeolocation.mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipList = [];
      for (let i = 0; i < data.length; i++) {

        this.zipList.push({
          id: data[i].code,
          itemName: data[i].name,


        })
      }
      // condition for ActionType
      if (this.addressData) {
        const zipItem = this.zipList.find(item => this.addressData.geoLocation.zipCode === item.id);
        this.Addressform.get('ZipData').setValue([zipItem]);
        //this.GeolocationChange(zipItem, 'ZIP');
      }
    }

  }

  countryCodeforcity: string;
  GeolocationChange(data, mode) {
    let countryname = data.itemName;
    this.geoloctionmodel.name = countryname;
    this.geoloctionmodel.code = data.id;
    this.geoloctionmodel.mode = mode;

    if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.geoloctionmodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
      this.countryCode = data.id;
      this.geoloctionmodel.code = this.countryCode;
      
      this.Addressform.get('ZipData').patchValue(null);
      this.Addressform.get('StateData').setValue(null);
      this.Addressform.get('CityData').setValue(null);
      //this.addressModel.CountryCode = data.code;
      //this.addressModel.CountryName = data.countryname;
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.Addressform.get('ZipData').patchValue(null);
      this.Addressform.get('CityData').setValue(null);
      this.Addressform.get('StateData').setValue(null);
      this.geoloctionmodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
      this.stateCode = data.id;
      this.countryCodeforcity = data.id;
      this.geoloctionmodel.code = this.stateCode;
    }

    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.geoloctionmodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
      this.cityCode = data.id;
      this.geoloctionmodel.code = this.cityCode;
      
      this.geoloctionmodel.countryCode = this.countryCodeforcity;
      this.Addressform.get('ZipData').patchValue(null);
      this.Addressform.get('CityData').setValue(null);
      //this.addressModel.CityCode = data.code;
      //this.addressModel.CityName = data.countryname;
      //this.GetGeolocationIdByCode(this.geoloctionmodel);
    }
    else if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipCode = data.id;
      this.geoloctionmodel.code = this.zipCode;
      this.geoloctionmodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;
      //this.addressModel.ZipCode = data.code;
      //this.GetGeolocationIdByCode(this.geoloctionmodel);
      
    }

    this.GetGeolocation(this.geoloctionmodel);
  }


  SetGeolocationData(records: any) {
    this.geoloctionmodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
    this.geoloctionmodel.code = records.countryCode;
    this.geolocation.GetGeolocation(this.geoloctionmodel).subscribe(data => {
      // this.countryList = data.data;

      if (data.data != null) {
        this.BindGelocation(this.geoloctionmodel, data.data);

        this.geoloctionmodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
        this.geoloctionmodel.code = records.stateCode;

        this.geolocation.GetGeolocation(this.geoloctionmodel).subscribe(data => {

          if (data.data != null) {

            this.BindGelocation(this.geoloctionmodel, data.data);

            this.geoloctionmodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;
            this.geoloctionmodel.code = records.cityCode;
            this.geolocation.GetGeolocation(this.geoloctionmodel).subscribe(data => {

              if (data.data != null) {

                this.BindGelocation(this.geoloctionmodel, data.data);


              }
            });


          }
        });


      }
    });
  }

  onAddItem(data: string, mode) {
    if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipList.push({       
        id: data,
        itemName: data
      });
    }
    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.cityList.push({
        id: data,
        itemName: data
      });
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.stateList.push({
        id: data,
        itemName: data
      });
    }
    else if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.countryList.push({

        id: data,
        itemName: data

      });
    }

    
  }

  OnItemDeSelect(item: any, mode) {
    if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.Addressform.get('ZipData').patchValue(null);
    }
    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.Addressform.get('CityData').setValue(null);
      this.Addressform.get('ZipData').patchValue(null);
      this.zipList = [];
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.Addressform.get('StateData').setValue(null);
      this.Addressform.get('CityData').setValue(null);
      this.Addressform.get('ZipData').patchValue(null);
      this.cityList = [];
      this.zipList = [];
    }
    else if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.Addressform.get('CountryData').setValue(null);
      this.Addressform.get('StateData').setValue(null);
      this.Addressform.get('CityData').setValue(null);
      this.Addressform.get('ZipData').patchValue(null);

      this.stateList = [];
      this.cityList = [];
      this.zipList = [];
    }
    else if (mode == GlobalConstants.EXISTING_ADDRESS_MODE) {
      this.Addressform.get('CountryData').setValue(null);
      this.Addressform.get('StateData').setValue(null);
      this.Addressform.get('CityData').setValue(null);
      this.Addressform.get('ExistingAddressData').setValue(null);
      this.Addressform.get('ZipData').patchValue(null);
      this.Addressform.get('streetName1').patchValue(null);
      this.Addressform.get('streetName2').patchValue(null);
      this.Addressform.get('streetName3').patchValue(null);

      //this.countryList = [];
      this.stateList = [];
      this.cityList = [];
      this.zipList = [];
    }

  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  onDeSelectAll(items: any) {
    //console.log(items);

    if (items == GlobalConstants.EXISTING_ADDRESS_MODE) {
      this.Addressform.get('CountryData').setValue(null);
      this.Addressform.get('StateData').setValue(null);
      this.Addressform.get('CityData').setValue(null);
      this.Addressform.get('ExistingAddressData').setValue(null);
      this.Addressform.get('ZipData').patchValue(null);
      this.Addressform.get('streetName1').patchValue(null);
      this.Addressform.get('streetName2').patchValue(null);
      this.Addressform.get('streetName3').patchValue(null);

      //this.countryList = [];
      this.stateList = [];
      this.cityList = [];
      this.zipList = [];
    }

    //this.p1form.get('LocationData').setValue(null);
    //this.itemhospitalLocationSelectedCodeList = [];
    //this.selectedItems4 = [];
  }



  addUserAddress() {
    if (!this.validation()) {
      return;
    }
    this.userAddressViewModel.addressTypeId = parseInt(this.addressTypeId);
    //this.userAddressServiceSubcriber = this.useraccessService.addUserContact(this.userAddressViewModel).subscribe();
    this.toastrService.success('User is saved successfully');
    this.userAddressViewModel = new UsersAddressViewModel();
    this.addressTypeId = '';
    this.userAddressId = 0;
  }

  validation(): boolean {
    if (!!!this.userAddressId) {
      this.toastrService.error(GlobalConstants.PleaseselectAddressType);
      return false;
    }
    return true;
  }
  searchId: string;
  getAddressType() {

    if (this.contactActionType == ContactTypeActions.Location) {
      this.addressModel.AddressActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
      this.customerbylocationService.getAddressType(this.commonCallListViewModel)
        .pipe()
          .subscribe(result => {             
          if (result != null && this.contactActionType == ContactTypeActions.Location) {
            this.getUserAddressList(result.data);
          }
          else if (result != null) {
            // Handle result
            this.setAddressTypeDropDown(result.data);
            if (this.addressData) {
              const addressTypeItem = this.addressTypelist.find(item => this.addressTypeDataMap[this.contactTypeCode] === item.code);
              this.Addressform.get('AddressTypeData').setValue(addressTypeItem.id);
            }
          }

        });
    }
    else if (this.contactActionType == ContactTypeActions.User) {
      this.addressModel.AddressActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
      this.useraccessService.getAddressType(this.commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          if (result != null && this.contactActionType == UserConstant.ContactActionType) {
            this.getUserAddressList(result.data);
          }
          else if (result != null) {
            // Handle result
            this.setAddressTypeDropDown(result.data);
            if (this.addressData) {
              const addressTypeItem = this.addressTypelist.find(item => this.addressTypeDataMap[this.contactTypeCode] === item.code);
              this.Addressform.get('AddressTypeData').setValue(addressTypeItem.id);
            }
          }

        });
    }
    else if (this.contactActionType == ContactTypeActions.Patient) {
      this.addressModel.AddressActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
      this.useraccessService.getAddressType(this.commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          if (result != null && this.contactActionType == UserConstant.ContactActionType1) {
            this.getUserAddressList(result.data);
          }
          else if (result != null) {
            // Handle result
            this.setAddressTypeDropDown(result.data);
            if (this.addressData) {
              const addressTypeItem = this.addressTypelist.find(item => this.addressTypeDataMap[this.contactTypeCode] === item.code);
              this.Addressform.get('AddressTypeData').setValue(addressTypeItem.id);
            }
          }

        });
    }
    else if (this.contactActionType == ContactTypeActions.Organization) {
      this.addressModel.AddressActionType = this.contactActionType;
      this.useraccessService.getAddressType(this.commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          if (result != null && this.contactActionType == ContactTypeActions.Organization) {
            this.getUserAddressList(result.data);
          }
          else if (result != null) {
            // Handle result
            this.setAddressTypeDropDown(result.data);
            if (this.addressData) {
              const addressTypeItem = this.addressTypelist.find(item => this.addressTypeDataMap[this.contactTypeCode] === item.code);
              this.Addressform.get('AddressTypeData').setValue(addressTypeItem.id);
            }
          }
        });
        
    }
    else if (this.contactActionType == ContactTypeActions.Carrier) {
          this.addressModel.AddressActionType = ContactTypeActions.Carrier;
          this.customerbylocationService.getAddressType(this.commonCallListViewModel)
            .pipe()
            .subscribe(result => {
              if (result != null) {
                this.getUserAddressList(result.data);
              } else if (result != null) {
                // Handle result
                this.setAddressTypeDropDown(result.data);
                if (this.addressData) {
                  const addressTypeItem = this.addressTypelist.find(item => this.addressTypeDataMap[this.contactTypeCode] === item.code);
                  this.Addressform.get('AddressTypeData').setValue(addressTypeItem.id);
                }
              }

            });
        }
      
  }


  setAddressTypeDropDown(data: any) {
    this.addressTypelist = [];
    if (!!data)
      data.map(item => {
        return {
          itemName: item.name,
          id: item.id,
          code: item.code
        };
      }).forEach(item => this.addressTypelist.push(item));

    this.addressTypelist.sort((x, y) => x.itemName.localeCompare(y.itemName));
  }

  setSearchContactDropDown(data: any) {
    this.searchAddresslist = [];
    data.map(item => {
      return {
        itemName: item.name,
        id: item.id
      };
    }).forEach(item => this.searchAddresslist.push(item));
    this.searchAddresslist.sort((x, y) => x.itemName.localeCompare(y.itemName));
  }
  // Condition for ActionType
  onSearchContactSelected(item: any) {
    
    if (this.contactActionType == ContactTypeActions.User) {

      this.userAddressViewModel = new UsersAddressViewModel();
    }
    else if (this.contactActionType == ContactTypeActions.Location) {
      this.locationAddressViewModel = new LocationAddressViewModel();
    }
    if (!!item.id) {
      this.searchId = item.id.toString();
      this.isSearch = true;
      this.getAddressType();
      //this.useraccessService.getUserContactById(id)
      //  .pipe()
      //  .subscribe(result => {
      //    if (result != null) {
      //      // Handle result
      //      this.addressTypeId = result.data.contactTypeId;
      //      this.getUserAddressList(result.data);
      //    }
      //  });
    }
  }


  getSearchAddress() {
    this.locationAddressCallListViewModel.AddressActionType = this.contactActionType;
    this.locationAddressCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.locationAddressCallListViewModel.AddressbyId = this.getAddresById;
    this.customerbylocationService.getSearchAddressList(this.locationAddressCallListViewModel)
      .pipe()
      .subscribe(result => {
        if (result != null) {
          // Handle result
          this.setSearchContactDropDown(result.data.sort());
        }
      });


    //if (this.contactActionType == ContactTypeActions.Location) {
      
    //}
    //else if (this.contactActionType == ContactTypeActions.User){
    //  this.addressCallListViewModel.AddressActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
    //  this.addressCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
      
    //  this.useraccessService.getSearchAddressList(this.addressCallListViewModel)
    //    .pipe()
    //    .subscribe(result => {
    //      if (result != null) {
    //        // Handle result
    //        this.setSearchContactDropDown(result.data);
    //      }
    //    });
    //}


    //else if (this.contactActionType == ContactTypeActions.Patient) {
    //  this.addressCallListViewModel.AddressActionType = !!!this.contactActionType ? 'Patient' : this.contactActionType;
    //  this.addressCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;

    //  this.useraccessService.getSearchAddressList(this.addressCallListViewModel)
    //    .pipe()
    //    .subscribe(result => {
    //      if (result != null) {
    //        // Handle result
    //        this.setSearchContactDropDown(result.data);
    //      }
    //    });
    //}
    
  }


  getUserAddressList(data) {
    if (this.contactActionType == ContactTypeActions.Location) {
      let commonCallListViewModel = new LocationAddressCallListViewModel()
      commonCallListViewModel.AddressActionType = LocationConstant.ContactActionType;
      commonCallListViewModel.AddressbyId = this.getAddresById;
      this.customerbylocationService.getUserAddressList(commonCallListViewModel)
        .pipe()
        .subscribe(result => {
         
          
          this.locationAddressList = [];
          let addressid: number = 0;
          let userAddressId: number = 0;
          if (!!this.addressIds) {
            userAddressId = Number(this.addressIds);
          }
          let userAddress: any;
          const rowList = result.data;
          if (result.data) {
            userAddress = rowList.find(x => x.id == userAddressId);
          }
          
          
          if (!!userAddress) {
            addressid = Number(userAddress.addressTypeID);
          }
          let rowData = data;
          if (!!rowList) {
            rowList.filter(item => {
              if (!!rowData) {
                let index = rowData.findIndex(x => x.id === item.addressTypeID);
                if (addressid != item.addressTypeID && this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                } else if (!this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                }
              }
              let locationAddressExist = new LocationAddressViewModel();
              locationAddressExist = item;
              locationAddressExist.isAddressSelected = false;
              this.locationAddressList.push(locationAddressExist);
            });
          }
          rowData = rowData.filter((value, index, array) =>
            !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);
          this.setAddressTypeDropDown(rowData);
          if (!!this.addressIds || !!this.searchId) {
            let id: string = this.addressIds;
            if (!!this.searchId) {
              id = this.searchId;
            }
            this.useraccessService.editUserAddressListByIds(id, this.contactActionType).pipe().subscribe(x => {
              if (!!x.data) {
                let records = x.data;
                if (records.updatedBy === "Interface" && this.isEdit) {
                  this.Addressform.controls["interface"].setValue(null);
                  
                }

                this.SetGeolocationData(records);
                
               // this.GetGeolocation(this.geoloctionmodel);
                
               // this.GetGeolocation(this.geoloctionmodel);
                
                //this.GetGeolocation(this.geoloctionmodel);
                
                this.Addressform.controls["streetName1"].setValue(records.streetName1);
                this.Addressform.controls["streetName2"].setValue(records.streetName2);
                this.Addressform.controls["streetName3"].setValue(records.streetName3);
                let addressTypeItem = [];
                addressTypeItem.push({
                  id: records.addressTypeID,
                  itemName: records.addressTypeName
                });
                let country = [];
                country.push({
                  id: records.countryCode,
                  itemName: records.countryName
                });
                let stateCode = [];
                stateCode.push({
                  id: records.stateCode,
                  itemName: records.stateName
                });
                let cityCode = [];
                cityCode.push({
                  id: records.cityCode,
                  itemName: records.cityName
                });
                let zipCode = [];
                zipCode.push({
                  id: records.zipCode,
                  itemName: records.zipCode
                });

                if (!this.isSearch)
                  this.Addressform.controls["AddressTypeData"].setValue(addressTypeItem);
                this.Addressform.controls["CountryData"].setValue(country);
                this.Addressform.controls["StateData"].setValue(stateCode);
                this.Addressform.controls["CityData"].setValue(cityCode);
                this.Addressform.controls["ZipData"].setValue(zipCode);
              }
            });
          }
        });
    }
    else if (this.contactActionType == ContactTypeActions.User) {
      let commonCallListViewModel = new AddressCallListViewModel()
      commonCallListViewModel.AddressActionType = UserConstant.ContactActionType;
      commonCallListViewModel.AddressbyId = this.getAddresById;
      this.useraccessService.getUserAddressList(commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          this.userAddressList = [];
          let addressid: number = 0;
          let userAddressId: number = 0;
          if (!!this.addressIds) {
            userAddressId = Number(this.addressIds);
          }
            const rowList = result.data;
            if (rowList) { 
          let userAddress = rowList.find(x => x.id == userAddressId);
          if (!!userAddress) {
            addressid = Number(userAddress.addressTypeID);
                }
            }
          let rowData = data;
          if (!!rowList) {
            rowList.filter(item => {
              if (!!rowData) {
                let index = rowData.findIndex(x => x.id === item.addressTypeID);
                if (addressid != item.addressTypeID && this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                } else if (!this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                }
              }
              let userAddressExist = new UsersAddressViewModel();
              userAddressExist = item;
              userAddressExist.isAddressSelected = false;
              this.userAddressList.push(userAddressExist);
            });
          }
          rowData = rowData.filter((value, index, array) =>
            !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);
          this.setAddressTypeDropDown(rowData);
          if (!!this.addressIds || !!this.searchId) {
            let id: string = this.addressIds;
            if (!!this.searchId) {
              id = this.searchId;
            }
            this.useraccessService.editUserAddressListByIds(id, this.contactActionType).pipe().subscribe(x => {
              if (!!x.data) {
                let records = x.data;
                
                //this.geoloctionmodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.countryCode;
                //this.GetGeolocation(this.geoloctionmodel);
                //this.geoloctionmodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.stateCode;
                //this.GetGeolocation(this.geoloctionmodel);
                //this.geoloctionmodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.cityCode;
                if (records.updatedBy === "Interface" && this.isEdit) {
                  this.Addressform.controls["interface"].setValue(null);

                }
                this.SetGeolocationData(records);
                //this.GetGeolocation(this.geoloctionmodel);
                //if (!this.isSearch)
                  
                this.Addressform.controls["streetName1"].setValue(records.streetName1);
                this.Addressform.controls["streetName2"].setValue(records.streetName2);
                this.Addressform.controls["streetName3"].setValue(records.streetName3);
                let addressTypeItem = [];
                addressTypeItem.push({
                  id: records.addressTypeID,
                  itemName: records.addressTypeName
                });
                let country = [];
                country.push({
                  id: records.countryCode,
                  itemName: records.countryName
                });
                let stateCode = [];
                stateCode.push({
                  id: records.stateCode,
                  itemName: records.stateName
                });
                let cityCode = [];
                cityCode.push({
                  id: records.cityCode,
                  itemName: records.cityName
                });
                let zipCode = [];
                zipCode.push({
                  id: records.zipCode,
                  itemName: records.zipCode
                });
                if (!this.isSearch)
                  this.Addressform.controls["AddressTypeData"].setValue(addressTypeItem);
                this.Addressform.controls["CountryData"].setValue(country);
                this.Addressform.controls["StateData"].setValue(stateCode);
                this.Addressform.controls["CityData"].setValue(cityCode);
                this.Addressform.controls["ZipData"].setValue(zipCode);
              }
            });
          }
        });
    }

    //else if (this.contactActionType == ContactTypeActions.Patient) {
    //  let commonCallListViewModel = new AddressCallListViewModel()
    //  commonCallListViewModel.AddressActionType = UserConstant.ContactActionType1;
    //  commonCallListViewModel.UserId = this.userId;
    //  this.useraccessService.getUserAddressList(commonCallListViewModel)
    //    .pipe()
    //    .subscribe(result => {
    //      this.userAddressList = [];
    //      let addressid: number = 0;
    //      let userAddressId: number = 0;
    //      if (!!this.addressIds) {
    //        userAddressId = Number(this.addressIds);
    //      }
    //      const rowList = result.data;
    //      let userAddress = rowList.find(x => x.id == userAddressId);
    //      if (!!userAddress) {
    //        addressid = Number(userAddress.addressTypeID);
    //      }
    //      let rowData = data;
    //      if (!!rowList) {
    //        rowList.filter(item => {
    //          if (!!rowData) {
    //            let index = rowData.findIndex(x => x.id === item.addressTypeID);
    //            if (addressid != item.addressTypeID && this.isEdit) {
    //              if (index > -1) {
    //                rowData.splice(index, 1);
    //              }
    //            } else if (!this.isEdit) {
    //              if (index > -1) {
    //                rowData.splice(index, 1);
    //              }
    //            }
    //          }
    //          let userAddressExist = new UsersAddressViewModel();
    //          userAddressExist = item;
    //          userAddressExist.isAddressSelected = false;
    //          this.userAddressList.push(userAddressExist);
    //        });
    //      }
    //      rowData = rowData.filter((value, index, array) =>
    //        !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);
    //      this.setAddressTypeDropDown(rowData);
    //      if (!!this.addressIds || !!this.searchId) {
    //        let id: string = this.addressIds;
    //        if (!!this.searchId) {
    //          id = this.searchId;
    //        }
    //        this.useraccessService.editUserAddressListByIds(id, this.contactActionType).pipe().subscribe(x => {
    //          if (!!x.data) {
    //            let records = x.data;
    //            this.geoloctionmodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
    //            this.geoloctionmodel.code = records.countryCode;
    //            this.GetGeolocation(this.geoloctionmodel);
    //            this.geoloctionmodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
    //            this.geoloctionmodel.code = records.stateCode;
    //            this.GetGeolocation(this.geoloctionmodel);
    //            this.geoloctionmodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;
    //            this.geoloctionmodel.code = records.cityCode;
    //            this.GetGeolocation(this.geoloctionmodel);
    //            if (!this.isSearch)
    //              this.Addressform.controls["AddressTypeData"].setValue(records.addressTypeID);
    //            this.Addressform.controls["streetName1"].setValue(records.streetName1);
    //            this.Addressform.controls["streetName2"].setValue(records.streetName2);
    //            this.Addressform.controls["streetName3"].setValue(records.streetName3);
    //            let country = [];
    //            country.push({
    //              id: records.countryCode,
    //              itemName: records.countryName
    //            });
    //            let stateCode = [];
    //            stateCode.push({
    //              id: records.stateCode,
    //              itemName: records.stateName
    //            });
    //            let cityCode = [];
    //            cityCode.push({
    //              id: records.cityCode,
    //              itemName: records.cityName
    //            });
    //            let zipCode = [];
    //            zipCode.push({
    //              id: records.zipCode,
    //              itemName: records.zipCode
    //            });

    //            this.Addressform.controls["CountryData"].setValue(country);
    //            this.Addressform.controls["StateData"].setValue(stateCode);
    //            this.Addressform.controls["CityData"].setValue(cityCode);
    //            this.Addressform.controls["ZipData"].setValue(zipCode);
    //          }
    //        });
    //      }
    //    });
    //}

    if (this.contactActionType == ContactTypeActions.Patient) {
      let commonCallListViewModel = new AddressCallListViewModel()
      commonCallListViewModel.AddressActionType = UserConstant.ContactActionType1;
      commonCallListViewModel.AddressbyId = this.getAddresById;
      this.useraccessService.getUserAddressList(commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          this.locationAddressList = [];
          let addressid: number = 0;
          let userAddressId: number = 0;
          if (!!this.addressIds) {
            userAddressId = Number(this.addressIds);
          }
          const rowList = result.data;
          if (!!rowList) {
            let userAddress = rowList.find(x => x.id == userAddressId);
            if (!!userAddress) {
              addressid = Number(userAddress.addressTypeID);
            }
          }
          let rowData = data;
          if (!!rowList) {
            rowList.filter(item => {
              if (!!rowData) {
                let index = rowData.findIndex(x => x.id === item.addressTypeID);
                if (addressid != item.addressTypeID && this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                } else if (!this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                }
              }
              let locationAddressExist = new LocationAddressViewModel();
              locationAddressExist = item;
              locationAddressExist.isAddressSelected = false;
              this.locationAddressList.push(locationAddressExist);
            });
          }

          rowData = rowData.filter((value, index, array) =>
            !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);
          this.setAddressTypeDropDown(rowData);
          if (!!this.addressIds || !!this.searchId) {
            let id: string = this.addressIds;
            if (!!this.searchId) {
              id = this.searchId;
            }
            this.useraccessService.editUserAddressListByIds(id, this.contactActionType).pipe().subscribe(x => {
              if (!!x.data) {
                let records = x.data;
                this.SetGeolocationData(records);
                //this.geoloctionmodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.countryCode;
                //this.GetGeolocation(this.geoloctionmodel);
                //this.geoloctionmodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.stateCode;
                //this.GetGeolocation(this.geoloctionmodel);
                //this.geoloctionmodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.cityCode;
                //this.GetGeolocation(this.geoloctionmodel);
                if (records.updatedBy === "Interface" && this.isEdit) {
                  this.Addressform.controls["interface"].setValue(null);

                }
                this.Addressform.controls["streetName1"].setValue(records.streetName1);
                this.Addressform.controls["streetName2"].setValue(records.streetName2);
                this.Addressform.controls["streetName3"].setValue(records.streetName3);
                let addressTypeItem = [];
                addressTypeItem.push({
                  id: records.addressTypeID,
                  itemName: records.addressTypeName
                });
                let country = [];
                country.push({
                  id: records.countryCode,
                  itemName: records.countryName
                });
                let stateCode = [];
                stateCode.push({
                  id: records.stateCode,
                  itemName: records.stateName
                });
                let cityCode = [];
                cityCode.push({
                  id: records.cityCode,
                  itemName: records.cityName
                });
                let zipCode = [];
                zipCode.push({
                  id: records.zipCode,
                  itemName: records.zipCode
                });
                if (!this.isSearch)
                  this.Addressform.controls["AddressTypeData"].setValue(addressTypeItem);
                this.Addressform.controls["CountryData"].setValue(country);
                this.Addressform.controls["StateData"].setValue(stateCode);
                this.Addressform.controls["CityData"].setValue(cityCode);
                this.Addressform.controls["ZipData"].setValue(zipCode);
              }
            });
          }
        });
    }

    if (this.contactActionType == ContactTypeActions.Carrier) {
      let commonCallListViewModel = new LocationAddressCallListViewModel()
      commonCallListViewModel.AddressActionType = ContactTypeActions.Carrier;
      commonCallListViewModel.AddressbyId = this.getAddresById;
      this.customerbylocationService.getUserAddressList(commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          this.locationAddressList = [];
          let addressid: number = 0;
          let userAddressId: number = 0;
          if (!!this.addressIds) {
            userAddressId = Number(this.addressIds);
          }
          let userAddress: any;
          const rowList = result.data;
          if (result.data) {
            userAddress = rowList.find(x => x.id == userAddressId);
          }


          if (!!userAddress) {
            addressid = Number(userAddress.addressTypeID);
          }
          let rowData = data;
          if (!!rowList) {
            rowList.filter(item => {
              if (!!rowData) {
                let index = rowData.findIndex(x => x.id === item.addressTypeID);
                if (addressid != item.addressTypeID && this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                } else if (!this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                }
              }
              let locationAddressExist = new LocationAddressViewModel();
              locationAddressExist = item;
              locationAddressExist.isAddressSelected = false;
              this.locationAddressList.push(locationAddressExist);
            });
          }
          rowData = rowData.filter((value, index, array) =>
            !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);
          this.setAddressTypeDropDown(rowData);
          if (!!this.addressIds || !!this.searchId) {
            let id: string = this.addressIds;
            if (!!this.searchId) {
              id = this.searchId;
            }
            this.useraccessService.editUserAddressListByIds(id, this.contactActionType).pipe().subscribe(x => {
              if (!!x.data) {
                let records = x.data;
                this.SetGeolocationData(records);
                //this.geoloctionmodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.countryCode;
                //this.GetGeolocation(this.geoloctionmodel);
                //this.geoloctionmodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.stateCode;
                //this.GetGeolocation(this.geoloctionmodel);
                //this.geoloctionmodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.cityCode;
                //this.GetGeolocation(this.geoloctionmodel);
                if (records.updatedBy === "Interface" && this.isEdit) {
                  this.Addressform.controls["interface"].setValue(null);

                }
                this.Addressform.controls["streetName1"].setValue(records.streetName1);
                this.Addressform.controls["streetName2"].setValue(records.streetName2);
                this.Addressform.controls["streetName3"].setValue(records.streetName3);
                let addressTypeItem = [];
                addressTypeItem.push({
                  id: records.addressTypeID,
                  itemName: records.addressTypeName
                });
                let country = [];
                country.push({
                  id: records.countryCode,
                  itemName: records.countryName
                });
                let stateCode = [];
                stateCode.push({
                  id: records.stateCode,
                  itemName: records.stateName
                });
                let cityCode = [];
                cityCode.push({
                  id: records.cityCode,
                  itemName: records.cityName
                });
                let zipCode = [];
                zipCode.push({
                  id: records.zipCode,
                  itemName: records.zipCode
                });
                if (!this.isSearch)
                  this.Addressform.controls["AddressTypeData"].setValue(addressTypeItem);
                this.Addressform.controls["CountryData"].setValue(country);
                this.Addressform.controls["StateData"].setValue(stateCode);
                this.Addressform.controls["CityData"].setValue(cityCode);
                this.Addressform.controls["ZipData"].setValue(zipCode);
              }
            });
          }
        });
    }
    
    if (this.contactActionType == ContactTypeActions.Organization) {
      let commonCallListViewModel = new AddressCallListViewModel()
      commonCallListViewModel.AddressActionType = this.contactActionType;
      commonCallListViewModel.AddressbyId = this.getAddresById;
      this.useraccessService.getUserAddressList(commonCallListViewModel)
        .pipe()
        .subscribe(result => {
          this.locationAddressList = [];
          let addressid: number = 0;
          let userAddressId: number = 0;
          if (!!this.addressIds) {
            userAddressId = Number(this.addressIds);
          }
          const rowList = result.data;
          if (!!rowList) {
            let userAddress = rowList.find(x => x.id == userAddressId);
            if (!!userAddress) {
              addressid = Number(userAddress.addressTypeID);
            }
          }
          let rowData = data;
          if (!!rowList) {
            rowList.filter(item => {
              if (!!rowData) {
                let index = rowData.findIndex(x => x.id === item.addressTypeID);
                if (addressid != item.addressTypeID && this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                } else if (!this.isEdit) {
                  if (index > -1) {
                    rowData.splice(index, 1);
                  }
                }
              }
              let locationAddressExist = new LocationAddressViewModel();
              locationAddressExist = item;
              locationAddressExist.isAddressSelected = false;
              this.locationAddressList.push(locationAddressExist);
            });
          }

          rowData = rowData.filter((value, index, array) =>
            !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);
          this.setAddressTypeDropDown(rowData);
          if (!!this.addressIds || !!this.searchId) {
            let id: string = this.addressIds;
            if (!!this.searchId) {
              id = this.searchId;
            }
            this.useraccessService.editUserAddressListByIds(id, this.contactActionType).pipe().subscribe(x => {
              if (!!x.data) {
                let records = x.data;
                this.SetGeolocationData(records);
                //this.geoloctionmodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.countryCode;
                //this.GetGeolocation(this.geoloctionmodel);
                //this.geoloctionmodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.stateCode;
                //this.GetGeolocation(this.geoloctionmodel);
                //this.geoloctionmodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;
                //this.geoloctionmodel.code = records.cityCode;
                //this.GetGeolocation(this.geoloctionmodel);

                this.Addressform.controls["streetName1"].setValue(records.streetName1);
                this.Addressform.controls["streetName2"].setValue(records.streetName2);
                this.Addressform.controls["streetName3"].setValue(records.streetName3);
                let addressTypeItem = [];
                addressTypeItem.push({
                  id: records.addressTypeID,
                  itemName: records.addressTypeName
                });
                let country = [];
                country.push({
                  id: records.countryCode,
                  itemName: records.countryName
                });
                let stateCode = [];
                stateCode.push({
                  id: records.stateCode,
                  itemName: records.stateName
                });
                let cityCode = [];
                cityCode.push({
                  id: records.cityCode,
                  itemName: records.cityName
                });
                let zipCode = [];
                zipCode.push({
                  id: records.zipCode,
                  itemName: records.zipCode
                });
                if (!this.isSearch)
                  this.Addressform.controls["AddressTypeData"].setValue(addressTypeItem);
                this.Addressform.controls["CountryData"].setValue(country);
                this.Addressform.controls["StateData"].setValue(stateCode);
                this.Addressform.controls["CityData"].setValue(cityCode);
                this.Addressform.controls["ZipData"].setValue(zipCode);
              }
            });
          }
        });
    }
  }

}
