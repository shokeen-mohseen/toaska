import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddContactComponent } from 'app/shared/components/modal-content/add-contact/add-contact.component';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService, User, UsersViewModel } from '../../../../../core';
import { ContactTypeActions } from '../../../../../core/constants/constants';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { PatientSerach } from '../../../../../core/models/partograph-registration';
import { PhysicianPatient } from '../../../../../core/models/patient-phsician';
import { PatientInfo } from '../../../../../core/models/PatientInfo';
import { Resource } from '../../../../../core/models/resource ';
import { PrefixSuffixService } from '../../../../../core/services/prefix-suffix.service';
import { PhysicianAddComponent } from '../../../../../shared/components/physician-add/physician-add.component';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { PartographSessionManagement, ServerChartValues } from '../../../modals/input-chart';
import { PartographPatientSetup } from '../../../modals/patient-information';
import { PatientInformationService } from '../../../services/patient-informaation.services';
import { formatDate } from '@angular/common';
import { ContactAdressPhysicainInfoService } from '../../../../../core/services/contact-address-physician-info.service';
import { ContactAddressPhysicianInfo } from '../../../../../core/models/contact-address-physician-info.model';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
 
})
export class AddPatientComponent implements OnInit{

  contactaddressObject: ContactAddressPhysicianInfo;
  isAdded: boolean = false; isSetupchanges: boolean = false;
  isEnableforPartograph: boolean = false;
  AddressInfo: string; ContactInfo: string; PhysicianInfo: string;

  lastUpdateTimeZone: string;

  ActiveInactiveStatus: string = "Active"; partographNo: string = 'N/A';
  IsPartographCreated: boolean = false;
  partographAdmissionDate: string;
  resource: Resource; isSubmitted: boolean = false;
  isEditEnable: boolean = true;
  patientInfo: PatientInfo;
  @Input() patientIds: string;

  DisplayCurrentTime : string;
  ItemList: any[];
  createdby: string;
  timeZone: any;
  isEnableforupdate: boolean = false;
  changingValue: Subject<any> = new Subject();
  @Output() commonId = new EventEmitter<any>();

  isSteupCompleted: boolean = false;

  isLastUpdateBy: boolean = false;
  LastUpdateBy: string; LastUpdateDate: string;
  //  Physian info
  physicianPatient: PhysicianPatient;
  physicianIds: string; idsPhysicianDeteted: string;
  buttonPhysicianEnableDisable: boolean = true;
  physicianList: any[]; isPhysicianAllSelected: boolean = false;
  @Input() ContactListLength: number; listcontatLen: number; default: string = "Unknown";
  _partographSession: PartographSessionManagement; listaddresstLen: number;
  id: number; AddedPatientList = []; PatientId: number;
  loginId: string; objList: PatientSerach
  usersViewModel: UsersViewModel = new UsersViewModel();
  next: number = 0; userId: number;
  localTimeStr: string;
  updateBy: string;
  dataSource: any = [];
  pointerevents: string = 'none';
  modalRef: NgbModalRef; currentUser: User; locationId: number; CovidStatusId: number;
  patientsetup: PartographPatientSetup;
  itemListLocation = [];
  selectedItems4 = [];
  selectedItems = []; Idselete: string;
  itemList = []; itemPrefixList = []; itemSuffixList = [];
  p2form: FormGroup;
  pageActionTypePatient: string; IsEdit: boolean = false;
  itemhospitalLocationList = []; itemhospitalLocationSelectedList = []; itemhospitalLocationSelectedCodeList = []; 
  itemCovidStatusList = [];
  constructor(private contactAdressPhysicainInfoService: ContactAdressPhysicainInfoService, private router: Router, private prefixSuffixService: PrefixSuffixService,
    private toastr: ToastrService, public modalService: NgbModal,
    private formBuilder: FormBuilder, private authenticationService: AuthService,
    private patientsetupService: PatientInformationService) {


    this.contactaddressObject = new ContactAddressPhysicianInfo();

    this.patientInfo = new PatientInfo();
    this.partographNo = 'N/A';
    this.ActiveInactiveStatus = "Active";
    this.currentUser = this.authenticationService.currentUserValue;
    this.patientsetup = new PartographPatientSetup();

    this.resource = new Resource();
    this.patientsetup.ClientId = this.currentUser.ClientId;
     this.patientsetup.LocationTypeCode = GlobalConstants.OPERATING_LOCATION_CODE;
    this.patientsetup.SourceSystemId = GlobalConstants.SourceSystemId;

    this.AddedPatientList = [];
    this.objList = new PatientSerach;
    this.pageActionTypePatient = ContactTypeActions.Patient;
    this._partographSession = new PartographSessionManagement();
    this.listcontatLen = 0;
    this.listaddresstLen = 0;
    this.physicianList = [];

    this.physicianPatient = new PhysicianPatient();
    this.isEnableforupdate = false;
    
  }


  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settings = {};

  selectedItemsB = [];
  settingsB = {};
  settingsC = {};
  count = 3;

  ngOnInit(): void {

    
    this.ItemList = [];
    if (localStorage.getItem("AddedPatientList")) {
      this.objList.SearchKey = localStorage.getItem("AddedPatientList");
      this.IsEdit = true;
      this.isAdded = false;
      this.PatientId =Number(this.objList.SearchKey.split(',')[0]);
      // this.LoadAddedPatientList(this.objList);
      //this.pointerevents = '';
    }
    else {
      this.pointerevents = 'none';
      this.IsEdit = false;
      this.isAdded = true;
    }

    this.LoadPrefixList();
    this.LoadSuffixList();

    localStorage.removeItem("PartographPatient");
   
    this.dataSource = [];
    this.LoadLocation(this.patientsetup);
    this.LoadPatientCovidStatusList();
    
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.settings = {
      singleSelection: true,
      text: "Select",
      enableFilterSelectAll:false,
      //disabled: true,
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

    this.settingsC = {
      singleSelection: true,
      text: "Select",
      disabled: true,
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

    this.settingsB = {
      singleSelection: true,
      enableFilterSelectAll: false,
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

    this.buildForm();

    this.p2form.valueChanges.subscribe(val => {
      console.log("asas" + JSON.stringify(val))
    });

    //this.getPhysicianList();
    this.createdby = "";//this.currentUser.LoginId;
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
  ngOnChanges() {
    console.log("changes done")
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
              this.toastr.success(GlobalConstants.delete_message);
              this.getPhysicianList();
              this.GetPatientPhysicianInfo();
            }
            else {
              if (!!rowList) {
                this.toastr.success(GlobalConstants.FAILED_MESSAGE);
              }
            }
          });

      }

    }
  }

  addPhy() {
    this.modalRef = this.modalService.open(PhysicianAddComponent, { size: 'lg', backdrop: 'static' });

    this.modalRef.componentInstance.locationId = this.locationId;
    this.modalRef.componentInstance.patientId = this.PatientId;
    //this.modalRef.componentInstance.IdentityIds = this.PatientId;
    this.modalRef.result.then((result) => {
      //console.log(result);
    }).catch((result) => {
      console.log(result);
    });

    this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      console.log(receivedEntry)
      this.getPhysicianList();
      this.GetPatientPhysicianInfo();
    });

    
  }
  
  LoadPrefixList() {
    this.prefixSuffixService.PrefixList().subscribe(data => {

      if (data.data != null || data.data != undefined) {

        let datalist: any[] = data.data;

        for (let i = 0; i < datalist.length; i++) {

          this.itemPrefixList.push({

            id: datalist[i].prefix,
            name: datalist[i].prefix           
          })
        }

        // this.p2form.get('LocationData').setValue(datalist);

        //this.itemListLocation = datalist;
      }

    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);

      }

    );
  }

  LoadSuffixList() {
    this.prefixSuffixService.SuffixList().subscribe(data => {

      if (data.data != null || data.data != undefined) {

        let datalist: any[] = data.data;

        for (let i = 0; i < datalist.length; i++) {

          this.itemSuffixList.push({

            id: datalist[i].suffix,
            name: datalist[i].suffix
          })
        }

        // this.p2form.get('LocationData').setValue(datalist);

        //this.itemListLocation = datalist;
      }

    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);

      }

    );
  }

  LoadAddedPatientList(obj: PatientSerach,checkins) {

    this.dataSource = [];

    this.patientsetupService.GetAddedpatientList(obj).subscribe(data => {

      if (data.data != null || data.data != undefined) {

        let row: any[] = data.data;

        for (let i = 0; i < row.length; i++) {

          this.dataSource.push({
            RegistrationNo: row[i].RegistrationNo,
            LocationId: row[i].LocationID,
            CovidDiagnosisDate: row[i].CovidDiagnosisDate,
            FirstName: row[i].FirstName,
            LastName: row[i].LastName,
            MiddleName: row[i].MiddleName,
            Prefix: row[i].Prefix,
            Suffix: row[i].Suffix,
            id: row[i].ID,
            UpdatedBy: row[i].UpdatedBy,
            loginId: row[i].UpdatedBy,
            patientCovidStatusID: row[i].PatientCovidStatusID,
            createdDateTime: row[i].CreateDateTimeBrowser,
            IsActive: row[i].IsActive,
            PartographId: row[i].PartographId,
            PartographNo: row[i].ReferenceNo,
            AdmissionDate: row[i].AdmissionDate,
            SetupCompleted: row[i].SetupCompleted,
            SetupCompletedBy: row[i].SetupCompletedBy,
            SetupCompletedDate: row[i].SetupCompletedDateTime,
            UpdateDateTimeBrowser: row[i].UpdateDateTimeBrowser,
          })
        }

        if (this.dataSource.length > 0) {
          

          if (checkins != 1) {
            this.next = this.dataSource.length - 1;
            this.id = this.dataSource[this.next].id;
            this.loginId = this.dataSource[this.next].loginId;
            this.next = 0;
          }
          else {
            this.next = this.dataSource.length - 1;
            this.id = this.dataSource[this.next].id;
            this.loginId = this.dataSource[this.next].loginId;
           
          }

         
          this.id = this.dataSource[this.next].id;

          this.selectedPatient(this.next,1);
        }
        else {
          this.selectedPatient(0,1);
        }

      }
      else {
        this.selectedPatient(0,1);
      }


    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);

      }

    );
  }

  GetCountCotact(event): number {
    this.GetPateintContactInfo();
    this.listcontatLen = event;
    //console.log(event)
    return this.listcontatLen 

    
  }

  GetCountAddress(event): number {
    this.GetPatientAddressInfo();
    this.listaddresstLen = event;
    //console.log(event)
    return this.listaddresstLen 
  }

  GetCountPhysian(): number {
    return 0;
  }


  LoadPatientCovidStatusList() {
    this.patientsetupService.GetPatientCovidStatusList().subscribe(data => {

      if (data.data != null || data.data != undefined) {

        let datalist: any[] = data.data;

        for (let i = 0; i < datalist.length; i++) {

          this.itemCovidStatusList.push({

            id: datalist[i].id,
            itemName: datalist[i].name,
            itemCode: datalist[i].code
          })
        }

        this.setCoviddefaultvalues();

      }

    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);

      }

    );
  }

  LoadLocation(objserve) {
    this.patientsetupService.GetHospitalLocation(objserve).subscribe(data => {

      if (data.data != null || data.data != undefined) {

        let datalist: any[] = data.data;

        for (let i = 0; i < datalist.length; i++) {

          this.itemhospitalLocationList.push({

            id: datalist[i].id,
            itemName: datalist[i].name

          })
        }

        // this.p2form.get('LocationData').setValue(datalist);

        this.itemListLocation = datalist;
        if (this.IsEdit) {
          this.onEditClickLoadData();
          //this.getPhysicianList();
          this.IsEdit = false;
          this.isSubmitted = true;
        }

      }

    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);

      }

    );
  }


  onEditClickLoadData() {
    if (localStorage.getItem("AddedPatientList")) {
      this.objList.SearchKey = localStorage.getItem("AddedPatientList");
      this.LoadAddedPatientList(this.objList,0);
      this.pointerevents = '';
    }
    else {
      this.pointerevents = 'none';
    }
  }

  onAddItem(data: string) {
     this.p2form.get('LocationData').setValue({ "id": this.count, "itemName": data });
    
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }

  onItemSelect1(item: any) {
    this.isSubmitted = false;
    this.isEnableforupdate = true;
    this.p2form.get('CovidDiagnosisDate').setValue(null);
    this.CovidStatusId = item.id; 
    if (item.itemCode == "Positive") {
      this.p2form.controls['CovidDiagnosisDate'].enable()
      this.p2form.controls['CovidDiagnosisDate'].setValidators([ValidationService.DateBeforeToday]);
     
    }
    else {
      this.p2form.controls['CovidDiagnosisDate'].disable();
      this.p2form.controls['CovidDiagnosisDate'].clearValidators();
     
    }
    //console.log(item)
  }
  onItemSelect(item: any) {
    console.log(item.id);
    this.isSubmitted = false;
    this.isEditEnable = true;
    this.locationId = item.id;
    this.itemhospitalLocationSelectedCodeList = [];
    this.selectedItems4 = [];
    let data: any[] = this.itemListLocation.filter(u => u.id == item.id);

    this.itemhospitalLocationSelectedCodeList.push({ "id": item.id, "itemName": data[0].code });
    //this.selectedItems4.push({ "id": item.id, "itemName": data[0].code });

    this.p2form.get('LocationSelectedCode').setValue([{ "id": item.id, "itemName": data[0].code }]);

    //console.log(this.itemhospitalLocationSelectedCodeList);
  }
  OnItemDeSelect(item: any) {
    this.isUpdateChange();
    this.p2form.get('LocationData').setValue(null);
    //console.log(this.selectedItems);
  }

  OnItemDeSelect1(item: any) {
    this.p2form.get("CovidDiagnosisDate").setValue(null);
    let dataCovidStatus: any[] = this.itemCovidStatusList.filter(u => u.itemName == "Unknown");
    this.p2form.get("CovidData").setValue([{ "id": dataCovidStatus[0].id, "itemName": dataCovidStatus[0].itemName }]);
    this.CovidStatusId = dataCovidStatus[0].id;  
    this.p2form.controls['CovidDiagnosisDate'].disable();
    this.p2form.controls['CovidDiagnosisDate'].clearValidators();
    this.isUpdateChange();
      
  }

  onSelectAll(items: any) {
    //console.log(items);
  }
  onDeSelectAll(items: any) {
    this.p2form.get('LocationData').setValue(null);
    this.p2form.get('LocationSelectedCode').setValue(null);
    this.itemhospitalLocationSelectedCodeList = [];
    this.selectedItems4 = [];
  }

  onDeSelectAll1(items: any) {
    this.p2form.get("CovidDiagnosisDate").setValue(null);
    let dataCovidStatus: any[] = this.itemCovidStatusList.filter(u => u.itemName == "Unknown");
    this.p2form.get("CovidData").setValue([{ "id": dataCovidStatus[0].id, "itemName": dataCovidStatus[0].itemName }]);
    this.CovidStatusId = dataCovidStatus[0].id;
    this.isUpdateChange();
    this.p2form.controls['CovidDiagnosisDate'].disable();
    this.p2form.controls['CovidDiagnosisDate'].clearValidators();
  }

  removePatient(index: number) {

    this.dataSource.splice(index, 1);

    this.AddressInfo = "";
    this.ContactInfo = "";
    this.PhysicianInfo = "";
    //console.log(this.dataSource.length)

    let ids = "";

    for (let i = 0; i < this.dataSource.length; i++) {
      ids = ids + "," + this.dataSource[i].id;
    }

    if (ids.length > 0) {
      ids = ids.substring(1, ids.length);
      //console.log(patientIds)
      localStorage.setItem("AddedPatientList", ids);
    }
    else {
      this.dataSource = [];
      localStorage.removeItem("AddedPatientList");
      localStorage.removeItem("PatientId");
      localStorage.removeItem("PartographPatient");
      location.reload();
      this.router.navigate(['manage-partograph/patientsetup']);
      //this.router.navigate(['manage-partograph/patientsetup']);
      return;
    }

    if (localStorage.getItem("AddedPatientList")) {
      this.objList.SearchKey = localStorage.getItem("AddedPatientList");
      this.LoadAddedPatientList(this.objList,1);
    }
    else {
     
      localStorage.removeItem("PatientId");
      localStorage.removeItem("PartographPatient");
      localStorage.removeItem("AddedPatientList");
      this.router.navigate(['manage-partograph/patientsetup']);
      this.objList.SearchKey = "";
      this.p2form.reset();
      this.defalutsetformvalues();
      let sendnotification = { "id": 0, "actionType": this.pageActionTypePatient }
      //this.changingValue.next(sendnotification);
      
    }
    
    


  }

  selectedPatient(index: number, mode) {
    
    this.next = index;
    if (mode == 0) {
      this.isSubmitted = true;
    }
    if (!this.isAdded && mode == 0) {
      if (this.next + 1 == this.dataSource.length) {
        this.isEditEnable = true;
      }
      else {
        this.isEditEnable = false;
      }
    }
    else {
      this.isEditEnable = false;
    }

    if (!this.isAdded && mode == 1) {
      if (this.next + 1 == this.dataSource.length) {
        this.isEditEnable = true;
      }
    }

    this.isEnableforupdate = false;
    this.setPatientDetails(this.next);

    
    
  }

  setPatientDetails(index: number) {
    const nextResult = this.dataSource[this.next];
    this.id = nextResult.id;
    this.locationId = nextResult.LocationId;
    this.PatientId = this.id;
    this._partographSession.PatientId = this.id;
    this._partographSession.LocationId = nextResult.LocationId;
    this._partographSession.PartographId = nextResult.PartographId ;
    localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));
    let sendnotification = { "id": this.PatientId, "actionType": this.pageActionTypePatient }
    //this.changingValue.next(sendnotification);

    this.setPatientDetail(nextResult);
    this.getPhysicianList();

   // localStorage.setItem("PatientId", this.id.toString());
  }

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  selectNext(el) {
    this.SavePatientInformationNext();
    el.selectedIndex += 1;
  }
  selectPrev(el) {
    el.selectedIndex -= 1;
  }

  //addAddress() {
  //  this.modalRef = this.modalService.open(AddEditAddressComponent, { size: 'lg', backdrop: 'static' });
  //}

  openContact() {
    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
    //alert("111")
  }
  get f() {

    return this.p2form.controls;
  }

  CheckSetupIsCompleted(event: any) {
    console.log(this.p2form.get("SetupCompleted").value)
    if (this.p2form.invalid) {
      this.toastr.warning("Mandatory fields not filled");

    }
    else {
      if (event.target.checked) {
        this.isSubmitted = false;
        this.isSteupCompleted = false;
        this.DisplayCurrentTime = moment(new Date()).format('MMMM DD, YYYY hh:mm A').toString();
         this.timeZone = moment.tz.guess();
        var timeZoneOffset = new Date(new Date()).getTimezoneOffset();
        this.timeZone = moment.tz.zone(this.timeZone).abbr(timeZoneOffset);
        //this.crete
      }
      else {

        if (this.isSetupchanges) {
          this.isSteupCompleted = false;
          this.isSubmitted = false;
        } else {
          this.isSteupCompleted = false;
          this.isSubmitted = true;
        }

        
      }
      
    }
  }


  private buildForm(): void {

    // validation applied on name 

    this.p2form = this.formBuilder.group(
      {
        RegistrationNo: [null, [Validators.required, Validators.maxLength(25), ValidationService.AlphanumericWithHypenUnderscore]],
        Prefix: ['Mr.', Validators.required],
        FirstName: [null, [Validators.required, ValidationService.AlphabetsOnly, Validators.maxLength(50)]],
        MiddleName: ['', [Validators.maxLength(50), ValidationService.AlphabetsOnly]],
        LastName: [null, [Validators.required, ValidationService.AlphabetsOnly, Validators.maxLength(50)]],
        Suffix: ['None', [Validators.required]],
        LocationData: [null, [Validators.required]], // add validators here
        LocationSelectedCode: [null, [Validators.required]], // add validators here
        CovidData: [null],
        CovidDiagnosisDate: [{ value: null, disabled: true }, [ValidationService.DateBeforeToday]],
        SetupCompleted: [{ value: false, disabled: true }]
      }
    );
        
  }
   
  SavePatientInformation() {
   
    if (this.p2form.invalid) {

      return;
    }
    let patientId = 0;
    if (ServerChartValues.GetPatientId()) {
      patientId = ServerChartValues.GetPatientId();
      this.pointerevents = '';
    }
    else {
      this.pointerevents = 'none';
    }
    let now = moment();
    this.patientsetup.id = Number(patientId); //this.id;
    this.patientsetup.RegistrationNo = this.p2form.get("RegistrationNo").value; 
    this.patientsetup.AdmittedBy = this.currentUser.LoginId;
    this.patientsetup.UpdateDateTimeBrowser = now.format();
    this.patientsetup.UpdatedBy = this.currentUser.LoginId;
    this.patientsetup.CreatedBy = this.currentUser.LoginId;
    this.patientsetup.CreateDateTimeBrowser = now.format();
    this.patientsetup.Code = this.currentUser.ClientId.toString() + this.p2form.get("FirstName").value;
    this.patientsetup.ReferenceNo = this.currentUser.ClientId.toString() + this.p2form.get("FirstName").value;
    this.patientsetup.FirstName = this.p2form.get("FirstName").value;
    this.patientsetup.MiddleName = this.p2form.get("MiddleName").value;
    this.patientsetup.LastName = this.p2form.get("LastName").value;
    this.patientsetup.Prefix = this.p2form.get("Prefix").value;
    this.patientsetup.Suffix = this.p2form.get("Suffix").value;
    this.patientsetup.LocationId = this.locationId;
    this.patientsetup.PatientCovidStatusID = this.CovidStatusId;
    this.patientsetup.CovidDiagnosisDate = this.p2form.get("CovidDiagnosisDate").value;
    this.patientsetup.SetupCompleted = this.p2form.get("SetupCompleted").value;;
    this.patientsetup.SetupCompletedBy = "";
    this.patientsetup.SetupCompletedDateTime = now.format();
    if (this.p2form.get("SetupCompleted").value) {
      this.patientsetup.SetupCompletedBy = this.currentUser.LoginId;
    }
    //if (patientId != undefined) {
      if (Number(patientId) > 0) {
        this.patientsetupService.Upate_PatientInformationPart1(this.patientsetup).subscribe(x => {
         
          if (x.data != null || x.data != undefined) {

            this.isEnableforupdate = true;
            //if (data.data.length > 0) {
            this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
            //this.p2form.reset();
            // }
          }
          else {
            this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
            return;
          }

          let row = x.data;
          this.isEnableforupdate = true;
          this._partographSession.PatientId = row.id;
          this._partographSession.LocationId = row.locationId;
          this._partographSession.PartographId = null;
          localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));
          this.PatientId = row.id;
          //localStorage.setItem("PatientId", row.id);
          this.pointerevents = '';
          for (var i = 0; i < this.dataSource.length; i++) {

            if (this.dataSource[i]['id'] == row.id) {
              this.dataSource[i]['RegistrationNo'] = row.registrationNo;
              this.dataSource[i]['LocationId'] = row.locationId;
              this.dataSource[i]['CovidDiagnosisDate'] = row.covidDiagnosisDate;
              this.dataSource[i]['FirstName'] = row.firstName;
              this.dataSource[i]['LastName'] = row.lastName;
              this.dataSource[i]['MiddleName'] = row.middleName;
              this.dataSource[i]['Prefix'] = row.prefix;
              this.dataSource[i]['Suffix'] = row.suffix;
              this.dataSource[i]['UpdatedBy'] = row.updatedBy;
              this.dataSource[i]['loginId'] = row.updatedBy;
              this.dataSource[i]['patientCovidStatusID'] = row.patientCovidStatusID;
              this.dataSource[i]['createDateTimeBrowser'] = row.createDateTimeBrowser;
            }

          }
          
          this.patientsetup.ClientId = this.authenticationService.currentUserValue.ClientId;
          //this.next = this.dataSource.length - 1;
          this.id = this.dataSource[this.next].id;
          this.loginId = this.dataSource[this.next].loginId;
          this.objList.SearchKey = localStorage.getItem("AddedPatientList");
          this.LoadAddedPatientList(this.objList, 0);
          this.isSubmitted = true;
          if (this.IsEdit) {
            this.isEditEnable = true;
          } else {
            this.isEditEnable = false;
          }
          window.scroll(0, 0);
        });
     // }
    }
      else {
        
      this.patientsetupService.SavePartogrph_PatientInformationPart1(this.patientsetup).subscribe(x => {
        // this.useraccessServiceSubcriber = this.useraccessService.addAllUser(userList).subscribe(x => {

        if (x.data != null || x.data != undefined) {
          window.scroll(0, 0);
          this.isSubmitted = true;
          this.isEnableforupdate = true;
          //if (data.data.length > 0) {
          this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
          this.setCoviddefaultvalues();
          //this.p2form.reset();
          // }
        }
        else {
          this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
          return;
        }

        let row = x.data;
        //localStorage.setItem("PatientId", row.id);
        this.PatientId = row.id;
        this._partographSession.PatientId = row.id;
        this._partographSession.LocationId = row.locationId;
        this._partographSession.PartographId = null;
        localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));
        //localStorage.setItem("PatientId", row.id);
        this.pointerevents = '';
        this.dataSource.push({
          RegistrationNo: row.registrationNo,
          LocationId: row.locationId,
          CovidDiagnosisDate: row.covidDiagnosisDate,
          FirstName: row.firstName,
          LastName: row.lastName,
          MiddleName: row.middleName,
          Prefix: row.prefix,
          Suffix: row.suffix,
          id: row.id,
          UpdatedBy: row.updatedBy,
          loginId: row.updatedBy,
          patientCovidStatusID: row.patientCovidStatusID
        })
        this.patientsetup.ClientId = this.authenticationService.currentUserValue.ClientId;
        this.next = this.dataSource.length - 1;
        this.id = this.dataSource[this.next].id;
        this.loginId = this.dataSource[this.next].loginId;
        

        let patientIds = "";
        for (let i = 0; i < this.dataSource.length; i++) {

          patientIds = patientIds + "," + this.dataSource[i]['id'];

        }
        if (patientIds.length > 0) {
          patientIds = patientIds.substring(1, patientIds.length);
          //console.log(patientIds)
          localStorage.setItem("AddedPatientList", patientIds);
          this.objList.SearchKey = localStorage.getItem("AddedPatientList");
          this.LoadAddedPatientList(this.objList,1);
        }

       

      });
    }

  }


  isUpdateChange() {
    this.isEnableforupdate = false;
    this.isSubmitted = false;
    if (this.p2form.invalid) {

      this.p2form.get("SetupCompleted").setValue(false);
      this.isSteupCompleted = false;
      this.DisplayCurrentTime = "";
      this.timeZone = "";
      this.p2form.controls['SetupCompleted'].disable();
      this.ActiveInactiveStatus = 'Active';
      this.partographNo = 'N/A';
      this.partographAdmissionDate = 'N/A';
      this.IsPartographCreated = false;
      return;
    }

  }

  // resolve issue on next and save button


  SavePatientInformationNext() {

    this.next = this.next + 1;
    
    if (this.next < this.dataSource.length) {
     
      this.id = this.dataSource[this.next].id;
      this.loginId = this.dataSource[this.next].loginId;
      this.PatientId = this.id;
      this.selectedPatient(this.next, 0);

      let sendnotification = { "id": this.id, "actionType": this.pageActionTypePatient }
      //this.changingValue.next(sendnotification);
      this.getPhysicianList();
      this.GetPatientAddressInfo();
      this.GetPateintContactInfo();
      this.GetPatientPhysicianInfo();

    } else {
      window.scroll(0, 0);
      if (this.isAdded) {
        this.next = -1;
        this.id = 0;
        this.loginId = "";
        this.PatientId = this.id;
        localStorage.removeItem("PatientId");
        localStorage.removeItem("PartographPatient");
        let sendnotification = { "id": 0, "actionType": this.pageActionTypePatient }
        //this.changingValue.next(sendnotification);
        this.p2form.reset();
        this.defalutsetformvalues();
        this.getPhysicianList();
        this.AddressInfo = "";
        this.ContactInfo = "";
        this.PhysicianInfo = "";
        this.pointerevents = 'none';
      }
      else {
        this.isEditEnable = true;
        //this.next = 0;
        //this.id = this.dataSource[this.next].id;
        //this.loginId = this.dataSource[this.next].loginId;
        //this.PatientId = this.id;
        //this.selectedPatient(this.next, 0)
        //let sendnotification = { "id": this.id, "actionType": this.pageActionTypePatient }
        //this.changingValue.next(sendnotification);
        //this.getPhysicianList();
        //this.GetPatientAddressInfo();
        //this.GetPateintContactInfo();
        //this.GetPatientPhysicianInfo();
      }
      

    }
    


    

    //if (!this.isEnableforupdate) {

    //  if (this.p2form.invalid) {

    //    return;
    //  }
    //  let patientId = 0;
    //  if (ServerChartValues.GetPatientId() != null) {
    //    patientId = ServerChartValues.GetPatientId();
    //    this.pointerevents = '';
    //  }
    //  else {
    //    this.pointerevents = 'none';
    //  }

    //  this.patientsetup.id = Number(patientId); //this.id;
    //  this.patientsetup.RegistrationNo = this.p2form.get("RegistrationNo").value;
    //  this.patientsetup.AdmittedBy = this.currentUser.LoginId;
    //  this.patientsetup.UpdateDateTimeBrowser = new Date();
    //  this.patientsetup.UpdatedBy = this.currentUser.LoginId;
    //  this.patientsetup.CreatedBy = this.currentUser.LoginId;
    //  this.patientsetup.CreateDateTimeBrowser = new Date();
    //  this.patientsetup.Code = this.currentUser.ClientId.toString() + this.p2form.get("FirstName").value;
    //  this.patientsetup.ReferenceNo = this.currentUser.ClientId.toString() + this.p2form.get("FirstName").value;
    //  this.patientsetup.FirstName = this.p2form.get("FirstName").value;
    //  this.patientsetup.MiddleName = this.p2form.get("MiddleName").value;
    //  this.patientsetup.LastName = this.p2form.get("LastName").value;
    //  this.patientsetup.Prefix = this.p2form.get("Prefix").value;
    //  this.patientsetup.Suffix = this.p2form.get("Suffix").value;
    //  this.patientsetup.LocationId = this.locationId;
    //  this.patientsetup.PatientCovidStatusID = this.CovidStatusId;
    //  this.patientsetup.CovidDiagnosisDate = this.p2form.get("CovidDiagnosisDate").value;


    //  //if (patientId != undefined) {
    //  if (Number(patientId) > 0) {
    //    this.patientsetupService.Upate_PatientInformationPart1(this.patientsetup).subscribe(x => {

    //      if (x.data != null || x.data != undefined) {
    //        localStorage.removeItem("PatientId");
    //        localStorage.removeItem("PartographPatient");
    //        localStorage.removeItem("AddedPatientList");
    //        this.isSubmitted = false;
    //        //if (data.data.length > 0) {
    //        if (this.isEnableforupdate) {
    //          this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
    //        }
    //        this.p2form.reset();
    //        this.defalutsetformvalues();
    //        //this.p2form.get("Prefix").setValue("Mr.");
    //        //this.p2form.get("Suffix").setValue("None");
    //        // }
    //      }
    //      else {
    //        this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
    //        return;
    //      }

    //      let row = x.data;
    //      this.PatientId = row.id;
    //      localStorage.setItem("PatientId", row.id);
    //      this.pointerevents = '';
    //      for (var i = 0; i < this.dataSource.length; i++) {

    //        if (this.dataSource[i]['id'] == row.id) {
    //          this.dataSource[i]['RegistrationNo'] = row.registrationNo;
    //          this.dataSource[i]['LocationId'] = row.locationId;
    //          this.dataSource[i]['CovidDiagnosisDate'] = row.covidDiagnosisDate;
    //          this.dataSource[i]['FirstName'] = row.firstName;
    //          this.dataSource[i]['LastName'] = row.lastName;
    //          this.dataSource[i]['MiddleName'] = row.middleName;
    //          this.dataSource[i]['Prefix'] = row.prefix;
    //          this.dataSource[i]['Suffix'] = row.suffix;
    //          this.dataSource[i]['UpdatedBy'] = row.updatedBy;
    //          this.dataSource[i]['loginId'] = row.updatedBy;
    //          this.dataSource[i]['patientCovidStatusID'] = row.patientCovidStatusID;

    //        }

    //      }
    //      this.AddressInfo = "";
    //      this.ContactInfo = "";
    //      this.PhysicianInfo = "";
    //      this.patientsetup.ClientId = this.authenticationService.currentUserValue.ClientId;
    //      this.next = this.dataSource.length - 1;
    //      this.id = this.dataSource[this.next].id;
    //      this.loginId = this.dataSource[this.next].loginId;
    //      this.id = 0;
    //      this.loginId = "";
    //      this.next = -1;
    //      this.pointerevents = 'none';
    //      let sendnotification = { "id": 0, "actionType": this.pageActionTypePatient }
    //      this.changingValue.next(sendnotification);
    //      this.getPhysicianList();
    //      this.GetPatientAddressInfo();
    //      this.GetPateintContactInfo();
    //      this.GetPatientPhysicianInfo();
    //    });
    //    // }
    //  }
    //  else {
    //    this.AddressInfo = "";
    //    this.ContactInfo = "";
    //    this.PhysicianInfo = "";
    //    this.patientsetupService.SavePartogrph_PatientInformationPart1(this.patientsetup).subscribe(x => {
    //      // this.useraccessServiceSubcriber = this.useraccessService.addAllUser(userList).subscribe(x => {

    //      if (x.data != null || x.data != undefined) {
    //        this.isSubmitted = false;
    //        //if (data.data.length > 0) {
    //        this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
    //        //this.p2form.reset();
    //        // }
    //      }
    //      else {
    //        this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
    //        return;
    //      }

    //      let row = x.data;
    //      //localStorage.setItem("PatientId", row.id);
    //      //localStorage.setItem("PatientId", row.id);
    //      this.pointerevents = '';
    //      this.dataSource.push({
    //        RegistrationNo: row.registrationNo,
    //        LocationId: row.locationId,
    //        CovidDiagnosisDate: row.covidDiagnosisDate,
    //        FirstName: row.firstName,
    //        LastName: row.lastName,
    //        MiddleName: row.middleName,
    //        Prefix: row.prefix,
    //        Suffix: row.suffix,
    //        id: row.id,
    //        UpdatedBy: row.updatedBy,
    //        loginId: row.updatedBy,
    //        patientCovidStatusID: row.patientCovidStatusID,
    //        IsActive:'Active'
            
    //      })
    //      this.patientsetup.ClientId = this.authenticationService.currentUserValue.ClientId;
    //      this.next = this.dataSource.length - 1;
    //      this.id = this.dataSource[this.next].id;
    //      this.loginId = this.dataSource[this.next].loginId;


    //      let patientIds = "";
    //      for (let i = 0; i < this.dataSource.length; i++) {

    //        patientIds = patientIds + "," + this.dataSource[i]['id'];

    //      }
    //      if (patientIds.length > 0) {
    //        patientIds = patientIds.substring(1, patientIds.length);
    //        //console.log(patientIds)
    //        localStorage.setItem("AddedPatientList", patientIds);
    //        this.objList.SearchKey = localStorage.getItem("AddedPatientList");
    //        this.id = 0;
    //        this.loginId = "";
    //        this.next = -1;
    //        this.pointerevents = 'none';
    //        let sendnotification = { "id": 0, "actionType": this.pageActionTypePatient }
    //        this.changingValue.next(sendnotification);
    //        this.getPhysicianList();
    //        this.GetPatientAddressInfo();
    //        this.GetPateintContactInfo();
    //        this.GetPatientPhysicianInfo();
    //        //this.LoadAddedPatientList(this.objList,1);
    //      }



    //    });
    //  }
    //}

    //else {

    //  localStorage.removeItem("PatientId");
    //  localStorage.removeItem("PartographPatient");
    //  let sendnotification = { "id": 0, "actionType": this.pageActionTypePatient }
    //  this.changingValue.next(sendnotification);
    //  this.p2form.reset();     
    //  this.defalutsetformvalues();
    //  this.getPhysicianList();
    //  this.AddressInfo = "";
    //  this.ContactInfo = "";
    //  this.PhysicianInfo = "";
    //  //return;
    //}

  }

  defalutsetformvalues() {
    this.p2form.get("SetupCompleted").setValue(false);
    this.isSteupCompleted = false;
    this.DisplayCurrentTime = "";
    this.timeZone = "";
    this.p2form.controls['SetupCompleted'].disable();
    this.ActiveInactiveStatus = 'Active';
    this.partographNo = 'N/A';
    this.partographAdmissionDate = 'N/A';
    this.IsPartographCreated = false;

    const prefix = "Mr."; const suffix = "None";
    this.p2form.get("Prefix").setValue(prefix);
    this.p2form.get("Suffix").setValue(suffix);
    this.setCoviddefaultvalues();
    //this.createdby = this.currentUser.LoginId;
  }

  // set covid default values
  setCoviddefaultvalues() {

    if (this.isSteupCompleted) {
      let m1 = moment().format('MMMM DD, YYYY hh:mm A');

      this.DisplayCurrentTime = m1.toString();
      this.timeZone = moment.tz.guess();
      var timeZoneOffset = new Date().getTimezoneOffset();
      this.timeZone = moment.tz.zone(this.timeZone).abbr(timeZoneOffset);
    }
    let dataCovidStatus: any[] = this.itemCovidStatusList.filter(u => u.itemName == "Unknown");
   // console.log(JSON.stringify(dataCovidStatus))
    //console.log(dataCovidStatus[0].id + " covidId")
    this.p2form.get("CovidData").setValue([{ "id": dataCovidStatus[0].id, "itemName": dataCovidStatus[0].itemName }]);
    this.CovidStatusId = dataCovidStatus[0].id;
  }

  PartographOpen() {

    this.router.navigate(['manage-partograph/new-partograph/registration']);
  }

  setPatientDetail(data: any) {

    this.GetPatientAddressInfo();
    this.GetPateintContactInfo();
    this.GetPatientPhysicianInfo();

    if (data.patientCovidStatusID == null) {
      data.patientCovidStatusID = 101;
    } 
    this.pointerevents = '';
    if (data.IsActive) {
      this.ActiveInactiveStatus = "Active";
    }
    else {
      this.ActiveInactiveStatus = "Inactive";
    }

    this.IsPartographCreated = data.PartographNo == '' ? true : false;
    if (this.IsPartographCreated) {
      this.partographNo = data.PartographNo == '' ? '' : data.PartographNo;
    }
    else {
      this.partographNo = data.PartographNo == '' ? 'N/A' : data.PartographNo;
    }
    
    //this.partographAdmissionDate = data.AdmissionDate == null ? 'N/A' : data.AdmissionDate;
    this.partographAdmissionDate = moment(data.AdmissionDate == null ? 'N/A' : data.AdmissionDate).format('MMMM DD, YYYY hh:mm A').toString();
    this.p2form.get("RegistrationNo").setValue(data.RegistrationNo);
    this.p2form.get("FirstName").setValue(data.FirstName)
    this.p2form.get("LastName").setValue(data.LastName)
    this.p2form.get("MiddleName").setValue(data.MiddleName)
    this.p2form.get("Prefix").setValue(data.Prefix)
    this.p2form.get("Suffix").setValue(data.Suffix)

    this.p2form.get("CovidDiagnosisDate").setValue(data.CovidDiagnosisDate);


    if (data.UpdatedBy == "" || data.UpdatedBy == null ) {
      this.isLastUpdateBy = false;
      this.LastUpdateBy = "";
      this.LastUpdateDate = "";
      this.lastUpdateTimeZone = "";
    }
    else {
      this.isLastUpdateBy = true;
      this.LastUpdateBy = data.UpdatedBy;
      this.LastUpdateDate = moment(new Date(data.UpdateDateTimeBrowser)).format('MMMM DD, YYYY hh:mm A').toString();
      this.lastUpdateTimeZone =  moment.tz.guess();
      var timeZoneOffset = new Date(data.UpdateDateTimeBrowser).getTimezoneOffset();
      this.lastUpdateTimeZone = moment.tz.zone(this.lastUpdateTimeZone).abbr(timeZoneOffset);
      
    }

    this.createdby = data.SetupCompletedBy;

    if (data.SetupCompleted) {
      
      if (!this.IsPartographCreated) {
        
        this.p2form.controls['SetupCompleted'].disable();
      }
      else {
       
        this.p2form.controls['SetupCompleted'].enable();
      }
      this.isSetupchanges = true;
      this.isSteupCompleted = true;
      this.DisplayCurrentTime = moment(new Date(data.SetupCompletedDate)).format('MMMM DD, YYYY hh:mm A').toString();
      this.isEnableforPartograph = true;
      this.timeZone = moment.tz.guess();
      var timeZoneOffset = new Date(data.SetupCompletedDate).getTimezoneOffset();
      this.timeZone = moment.tz.zone(this.timeZone).abbr(timeZoneOffset);
    }
    else {

      this.isSetupchanges = false;

      this.createdby = "";
      this.isEnableforPartograph = false;
      this.isSteupCompleted = true;
      this.DisplayCurrentTime = "";
      this.timeZone = "";
      this.createdby = "";
      this.p2form.controls['SetupCompleted'].enable();
    }


    //if (!data.SetupCompleted && this.PatientId > 0) {
      
    //  if (data.SetupCompleted) {
    //    this.isSteupCompleted = true;
    //    this.DisplayCurrentTime = moment(data.SetupCompletedDateTime).format('MMMM DD, YYYY hh:mm A').toString();

    //    this.timeZone = moment.tz.guess();
    //    var timeZoneOffset = new Date(data.SetupCompletedDateTime).getTimezoneOffset();
    //    this.timeZone = moment.tz.zone(this.timeZone).abbr(timeZoneOffset);
    //  }
    //  else {
    //    this.isSteupCompleted = true;
    //    this.DisplayCurrentTime = "";
    //    this.timeZone = "";
    //  }
      
    //}
    //else {
    //  this.p2form.controls['SetupCompleted'].disable();
    //  this.isSteupCompleted = false;
    //  this.DisplayCurrentTime = "";
    //  this.timeZone = "";
    //}
    this.p2form.get("SetupCompleted").setValue(data.SetupCompleted)
    
    //this.createdby = data.loginId;
    

    let dataCovidStatus:any[] = this.itemCovidStatusList.filter(u => u.id == data.patientCovidStatusID);
    this.CovidStatusId = data.patientCovidStatusID;
    this.p2form.get("CovidData").setValue([{ "id": data.patientCovidStatusID, "itemName": dataCovidStatus[0].itemName }]);

    if (dataCovidStatus[0].itemCode == "Positive" || dataCovidStatus[0].itemCode == "positive") {
      console.log("Covid date" + data.CovidDiagnosisDate);
      const formattedDate = formatDate(new Date(data.CovidDiagnosisDate), 'yyyy-MM-dd', 'en');
      this.p2form.get("CovidDiagnosisDate").setValue(formattedDate);
      this.p2form.get("CovidDiagnosisDate").enable();
    }
    else {
      this.p2form.get("CovidDiagnosisDate").setValue(null);
      this.p2form.get("CovidDiagnosisDate").disable();
    }

    let data1: any[] = this.itemListLocation.filter(u => u.id == data.LocationId);
    
   // this.itemhospitalLocationList.push({ "id": data.LocationId, "itemName": data1[0].name });
    this.itemhospitalLocationSelectedCodeList.push({ "id": data.LocationId, "itemName": data1[0].code });
    //this.selectedItems4.push({ "id": item.id, "itemName": data[0].code });
    this.p2form.get('LocationData').setValue([{ "id": data.LocationId, "itemName": data1[0].name }]);
    this.p2form.get('LocationSelectedCode').setValue([{ "id": data.LocationId, "itemName": data1[0].code }]);
   
    
  }


  GetPatientAddressInfo() {
    //this.ContactInfo = "";
    this.AddressInfo = "";
    this.contactaddressObject.Id = this.PatientId;
    this.contactaddressObject.Mode = "Address";
    this.contactaddressObject.DataMode = "Patient";
    this.contactAdressPhysicainInfoService.GetcontactaddressphysicainInfo(this.contactaddressObject).subscribe(x => {
         
      if (x.data != null || x.data != undefined) {
        let rowData = x.data;
        if (rowData.length > 0) {
          this.AddressInfo = rowData[0].Name + "\n" + rowData[0].CityName + "\n" +
            rowData[0].StateName + "\n" + rowData[0].CountryName + "\n" + rowData[0].ZipCode

        }
      }
    });

  }

  GetPateintContactInfo() {
    this.ContactInfo = "";
    this.contactaddressObject.Id = this.PatientId;
    this.contactaddressObject.Mode = "Contact";
    this.contactaddressObject.DataMode = "Patient";
    //this.patientInfo.PatientId = this.PatientId;
    //this.patientInfo.SearchMode = "Contact";
    this.contactAdressPhysicainInfoService.GetcontactaddressphysicainInfo(this.contactaddressObject).subscribe(x => {

      if (x.data != null || x.data != undefined) {
        let rowData = x.data;
        if (rowData.length > 0) {

            this.ContactInfo = rowData[0].Prefix + " " + rowData[0].FirstName + " " + rowData[0].MiddleName +
              rowData[0].LastName + "\n" + rowData[0].Email +
              "\n" +
              rowData[0].WorkPhoneCountryCode
              +
              "\n" +
              rowData[0].MobilePhoneCountryCode
           
          //  + ", WorkPhone- (" + rowData[0].WorkPhoneCountryCode + ")" + rowData[0].WorkPhone
          //+ ", MobilePhone- (" + rowData[0].MobilePhoneCountryCode + ")" + rowData[0].MobilePhone
          }
                   
        
      }
    });
  }

  GetPatientPhysicianInfo() {
    this.PhysicianInfo = "";
    
    this.contactaddressObject.Id = this.PatientId;
    this.contactaddressObject.Mode = "Physician";
    this.contactaddressObject.DataMode = "Physician";
    this.contactAdressPhysicainInfoService.GetcontactaddressphysicainInfo(this.contactaddressObject).subscribe(x => {

      if (x.data != null || x.data != undefined) {
        let rowData = x.data;
        if (rowData.length > 0) {
          this.PhysicianInfo = rowData[0].Prefix + " " + rowData[0].FirstName + " " + rowData[0].MiddleName +
            rowData[0].LastName;
        }

      }
    });
  }

}

