import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OthersCommonComponent } from '../../../../../shared/components/modal-content/others-common/others-common.component';
import { AddContactComponent } from '../../../../../shared/components/modal-content/add-contact/add-contact.component';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { ContactAddressComponent } from '../../../../../shared/components/modal-content/contact-address/contact-address.component';
import { PartographPatientSetup } from '../../../modals/patient-information';
import { AuthService, User } from '../../../../../core';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { PatientInformationService } from '../../../services/patient-informaation.services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ButtonPreviousNextStatus } from '../../../../../shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';
import { PartographSessionManagement, ServerChartValues } from '../../../modals/input-chart';
import moment from 'moment';
import { ValidationService } from '../../../../../shared/services';
declare var $: any;
@Component({
  selector: 'app-patient-information',
  templateUrl: './patient-information.component.html',
  styleUrls: ['./patient-information.component.css']
})
export class PatientInformationComponent implements OnInit {
  IsEnableTab$: any; patientId: number; locationid: number; itemOld: any[];
  public btnStatus: ButtonPreviousNextStatus;
  subscription: Subscription 
  modalRef: NgbModalRef; currentUser: User; locationId: number;
  public p1form: FormGroup; itemPatientName: any[]; itemPatientReg: any[];
  //EventFrom: string;
  patientsetup: PartographPatientSetup;
  itemListLocation = [];
  itemhospitalLocationList = []; itemhospitalLocationSelectedList = []; itemhospitalLocationSelectedCodeList = []; 
  itemList = []; itemPrefixList = []; itemSuffixList = [];
  itemList2 = [];
  itemList3 = [];
  itemList4 = [];
  selectedItems = [];
  selectedItems2 = [];
  selectedItems3 = [];
  selectedItems4 = [];
  settings = {};
  count = 6; @Input() FormStatus1: string;
  @Output() eventsend = new EventEmitter<any>();
  @Output() EventFrom = new EventEmitter<any>();
  _partographSession: PartographSessionManagement;
  constructor(private data: DataService, private toastr: ToastrService, private formBuilder: FormBuilder,
    public modalService: NgbModal, private authenticationService: AuthService, private patientsetupService: PatientInformationService) {
    this.selectedItems = [];
    this._partographSession = new PartographSessionManagement();
    this.btnStatus = new ButtonPreviousNextStatus(); 
    this.currentUser = this.authenticationService.currentUserValue;
    this.patientsetup = new PartographPatientSetup();

    this.patientsetup.ClientId = this.currentUser.ClientId;
    this.patientsetup.LocationTypeCode = GlobalConstants.OPERATING_LOCATION_CODE;
    this.patientsetup.SourceSystemId = GlobalConstants.SourceSystemId;
    this.data.sendEnableDisable_WhenPatientIdnotfound();
  }

  ngOnInit(): void {
    this.itemOld = [];
    if (ServerChartValues.GetLocationId()) {
      this.locationid = ServerChartValues.GetLocationId();
    }
    else {
      this.locationid = 0;
    }
    
    this.data.sendMessage1(ServerChartValues.MatTabButtonEnable());

    this.IsEnableTab$ = this.data.getMessage();

    
    let m1 = moment().format("YYYYMMDDHHmmss");
    //console.log("REG" + "-" + m1.toString() )

    this.settings = {
      singleSelection: true,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //disabled: true
    };
  
    this.buildForm();
   
    this.LoadLocation(this.patientsetup);
    this.LoadPatient();
    this.itemPrefixList = [
      { "id": "Mr.", "name": "Mr." },
      { "id": "Ms.", "name": "Ms." },
      { "id": "Mrs.", "name": "Mrs." }

    ];


    this.itemSuffixList = [
      { "id": "Jr.", "name": "Jr." },
      { "id": "Sr.", "name": "Sr." },
      { "id": "III", "name": "III" }

    ];

    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];
    this.itemList2 = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.itemList3 = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.itemList4 = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.p1form.valueChanges.subscribe(x => {
      //console.log(this.p1form.invalid)
      if (this.p1form.invalid) {
       // this.patientsetup.IsEnable = true;
        this.eventsend.emit(this.p1form);
        return;
      }

      
      this.eventsend.emit(this.p1form);
      this.EventFrom.emit("PatientInformationSave-1")
      //this.p1form.reset();

    })

    if (this.p1form.invalid) {
      this.eventsend.emit(this.p1form);
      return;
    }

    

  }

  LoadPatient() {

    if (!ServerChartValues.MatTabButtonEnable()) {
        this.patientId = ServerChartValues.GetPatientId() != null ? ServerChartValues.GetPatientId() : 0;
    }

   // this.selectedItems.push({ "id": this.count, "itemName": "11" });
    this.selectedItems2 = [];
    this.selectedItems = [];
    this.itemPatientName = [];
    this.itemPatientReg = [];
    this.patientsetupService.GetPatientData(this.patientsetup)
      .subscribe(result => {

        if (result.data != null) {
          if (result.data != undefined) {
            let datalist: any[] = result.data;
           // this.itemPatientName = result.data;

            for (let i = 0; i < datalist.length; i++) {
              let name: any = datalist[i].firstName + " " + datalist[i].middleName + " " + datalist[i].lastName;
              let partographId = 0;
              if (datalist[i].partograph != undefined) {
                if (datalist[i].partograph.length > 0) {
                  partographId = datalist[i].partograph[0].id;
                }
              }

              if (partographId == undefined || partographId == null) {
                partographId = 0;
              }
              

              // CHECKIN DONE
              if (datalist[i].setupCompleted != null) {
                if (datalist[i].setupCompleted) {

                  if ((partographId == 0 || this.patientId == datalist[i].id) && datalist[i].setupCompleted == true) {

                    this.itemPatientName.push({

                      id: datalist[i].id,
                      itemName: name,
                      firstName: datalist[i].firstName,
                      middleName: datalist[i].middleName,
                      lastName: datalist[i].lastName,
                      itemCode: datalist[i].code,
                      prefix: datalist[i].prefix,
                      suffix: datalist[i].suffix,
                      locationId: datalist[i].locationId,
                      registrationNo: datalist[i].registrationNo,
                      partographId: partographId,
                    })


                    this.itemPatientReg.push({

                      id: datalist[i].id,
                      itemName: datalist[i].registrationNo,
                      firstName: datalist[i].firstName,
                      middleName: datalist[i].middleName,
                      lastName: datalist[i].lastName,
                      itemCode: datalist[i].code,
                      prefix: datalist[i].prefix,
                      suffix: datalist[i].suffix,
                      locationId: datalist[i].locationId,
                      registrationNo: datalist[i].registrationNo,
                      partographId: partographId,
                    })
                  }
                }
              }
            }
            debugger;
           // alert(this.patientId)
            if (!ServerChartValues.MatTabButtonEnable()) {
              this.itemOld = [];
              this.patientId = ServerChartValues.GetPatientId() != null ? ServerChartValues.GetPatientId(): 0 ;
             // alert(this.patientId)
              if (this.patientId > 0) {
                this.itemOld = this.itemPatientReg.filter(u => u.id == this.patientId);
               // console.log(this.itemOld)
                this.LoadFormData(this.itemOld[0]);
              }

            }


          }
        }

        

      },
        error => {
          // .... HANDLE ERROR HERE 
          console.log(error);

        }

      );
  }

  onAddItem(data: string) {
    //this.count++;
    //this.itemList.push({ "id": this.count, "itemName": data });
    //this.itemList2.push({ "id": this.count, "itemName": data });
    //this.itemList3.push({ "id": this.count, "itemName": data });
    //this.itemList4.push({ "id": this.count, "itemName": data });
    //this.selectedItems.push({ "id": this.count, "itemName": data });
    //this.selectedItems2.push({ "id": this.count, "itemName": data });
    this.p1form.get('LocationData').setValue({ "id": this.count, "itemName": data });
    //this.p1form.get('LocationData').setValue({ "id": this.count, "itemName": data });
    //this.itemhospitalLocationSelectedList.push({ "id": this.count, "itemName": data });
    //this.selectedItems4.push({ "id": this.count, "itemName": data });
  }

  onSearchPatientByName(item: any) {
    console.log(item);
    this.LoadFormData(item)
  }

  onSearchPatientByReg(item: any) {
    console.log(item);
    this.LoadFormData(item)
  }

  onItemSelect(item: any) {
    //console.log(item.id);
    this.locationId = item.id;
    this.itemhospitalLocationSelectedCodeList = [];
    this.selectedItems4 = [];
    let data: any[] = this.itemListLocation.filter(u => u.id == item.id);
   
    this.itemhospitalLocationSelectedCodeList.push({ "id": item.id, "itemName": data[0].code });
    //this.selectedItems4.push({ "id": item.id, "itemName": data[0].code });
    
    this.p1form.get('LocationSelectedCode').setValue([{ "id": item.id, "itemName": data[0].code }]);
    this.p1form.get('LocationId').setValue(item.id)
    
    //console.log(this.itemhospitalLocationSelectedCodeList );
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    this.p1form.get('LocationData').setValue(null);
    //console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);

    this.p1form.get('LocationData').setValue(null);
    this.itemhospitalLocationSelectedCodeList = [];
    this.selectedItems4 = [];
  }

  openContact() {
    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
  }

  openAddress() {
    this.modalRef = this.modalService.open(OthersCommonComponent, { size: 'lg', backdrop: 'static' });
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

  //popup for contact and address updation
  OpenAddressContact() {
    this.modalRef = this.modalService.open(ContactAddressComponent, { size: 'lg', backdrop: 'static' });
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

      //  console.log(datalist)
        // this.p1form.get('LocationData').setValue(datalist);
        debugger;
        if (this.locationid > 0) {
          let array: any[] = this.itemhospitalLocationList.filter(u => u.id == this.locationid)
        this.p1form.get('LocationData').setValue(array);
        this.p1form.get('LocationSelectedCode').setValue(array);
          this.p1form.get('LocationId').setValue(this.locationid);
          //this.onItemSelect(this.itemOld[0]);
      }

        this.itemListLocation = datalist;
      }
           
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        
      }

    );
  }

  get f() {

    return this.p1form.controls;
  }


  LoadFormData(item: any) {
    debugger;
    this.p1form.get("Prefix").setValue(item.prefix);
    this.p1form.get("FirstName").setValue(item.firstName);
    this.p1form.get("MiddleName").setValue(item.middleName);
    this.p1form.get("LastName").setValue(item.lastName);
    this.p1form.get("Suffix").setValue(item.suffix);
    this.p1form.get("RegistrationNo").setValue(item.registrationNo);
    this.p1form.get("id").setValue(item.id);
    this.p1form.get("PartographId").setValue(item.partographId)    //this.p1form.get("LocationId").setValue(item.locationId);
    this.locationid = item.locationId;
    if (item.id > 0) {
      //this.data.Notify(0);
      this.data.sendMessage1(false);
      this._partographSession.PatientId = item.id;
      this._partographSession.LocationId = item.locationId;
      this._partographSession.PartographId = item.partographId;
      localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));
    }
    else {
      localStorage.removeItem("PartographPatient");
      this.data.sendMessage1(true);
    }
  }

  // remove extra code which are not working now after redesign on html side

  private buildForm(): void {

    this.p1form = this.formBuilder.group(
      {
        id:[0],
        Prefix: ['Mr.', Validators.required],
        FirstName: [null, [Validators.required, ValidationService.AlphabetsOnly, Validators.maxLength(50),]],
        MiddleName: ['', [Validators.maxLength(50), ValidationService.AlphabetsOnly]],
        LastName: [null, [Validators.required, Validators.maxLength(50), ValidationService.AlphabetsOnly]],
        Suffix: ['Jr.', [Validators.required]],
        LocationData: new FormControl(null, [Validators.required]), // add validators here
        LocationSelectedCode: new FormControl(null, [Validators.required]), // add validators here,
        RegistrationNo: [null, [Validators.required, Validators.maxLength(25), ValidationService.AlphanumericWithHypenUnderscore]],
        LocationId: [0, Validators.required],
        PartographId: [0, Validators.required],
        //ModeEnd: ['PatientInformationSave-1']
      }
    );
  }


  

  //SavePatientInformation() {
  //  if (this.p1form.invalid) {
  //    //this.btnStatus.isValidateSaveButton = this.p1form.invalid;
  //    //this.data.buttonStatus(this.btnStatus);
  //    return;
  //  }
  //  this.btnStatus.isValidateSaveButton = this.p1form.invalid;
  //  this.data.buttonStatus(this.btnStatus);
  //  this.patientsetup.AdmittedBy = this.currentUser.LoginId;
  //  this.patientsetup.UpdateDateTimeBrowser = new Date();
  //  this.patientsetup.UpdatedBy = this.currentUser.LoginId;
  //  this.patientsetup.CreatedBy = this.currentUser.LoginId;
  //  this.patientsetup.CreateDateTimeBrowser = new Date();
  //  this.patientsetup.Code = this.currentUser.ClientId.toString() + this.p1form.get("FirstName").value;
  //  this.patientsetup.ReferenceNo = this.currentUser.ClientId.toString()+ this.p1form.get("FirstName").value;
  //  this.patientsetup.FirstName = this.p1form.get("FirstName").value;
  //  this.patientsetup.MiddleName = this.p1form.get("MiddleName").value;
  //  this.patientsetup.LastName = this.p1form.get("LastName").value;
  //  this.patientsetup.Prefix = this.p1form.get("Prefix").value;
  //  this.patientsetup.Suffix = this.p1form.get("Suffix").value;
  //  this.patientsetup.LocationId = this.locationId;
  //  this.patientsetup.RegistrationNo = this.p1form.get("RegistrationNo").value;
  //  this.patientsetupService.SavePartogrph_PatientInformationPart1(this.patientsetup)
  //    .subscribe(data => {
  //      console.log(data)
  //      if (data.data != null || data.data != undefined) {

  //        if (data.data.length > 0) {
  //          this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
  //        }
  //      }
  //      else {
  //        this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
  //      }

  //    },
  //      error => {
  //        // .... HANDLE ERROR HERE 
  //        console.log(error);

  //      }

  //    );

  //}
}
