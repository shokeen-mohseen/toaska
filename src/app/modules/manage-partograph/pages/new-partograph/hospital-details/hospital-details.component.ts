import { Component, OnInit, EventEmitter, Output, ViewChild, forwardRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { AddContactComponent } from '../../../../../shared/components/modal-content/add-contact/add-contact.component';
import { Options } from 'select2';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { FormGroup, FormBuilder, Validators, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../../core';
import { ValidationService } from '../../../../../shared/services';
import { PatientInformationService } from '../../../services/patient-informaation.services';
import { LocationUnit } from '../../../../../core/models/location-unit';
import { ServerChartValues } from '../../../modals/input-chart';
import { PatientRegistration, PatientPartographDetail } from '../../../../../core/models/partograph-registration';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import moment from 'moment';
import { formatDate } from '@angular/common';
//import { DynamicWebcontrolParameterComponent } from '../../../../../shared/components/dynamic-webcontrol-parameter/dynamic-webcontrol-parameter.component';

@Component({

  selector: 'app-hospital-details',
  templateUrl: './hospital-details.component.html',
  styleUrls: ['./hospital-details.component.css'],
  //providers: [
  //  {
  //    provide: NG_VALUE_ACCESSOR,
  //    useExisting: forwardRef(() => HospitalDetailsComponent),
  //    multi: true
  //  }                                                                                                                                                                                                                     
  //]
})
export class HospitalDetailsComponent implements OnInit {
  //@ViewChild(DynamicWebcontrolParameterComponent) dynamicWebComponent: DynamicWebcontrolParameterComponent;

  PatientRegistration: PatientRegistration;
  patientReg: PatientPartographDetail;
  locationUnit: LocationUnit; currentUser: User;
  unitHeadList: any[]; hospitalUnitNoList: any[]; literacyList: any[];
  reasonforRefferalList: any[];
  public regForm: FormGroup;
  bookingList: any[]; sociaEconomicList: any[];
  referredList: any[];
  stageCode: string;
  modalRef: NgbModalRef;
  public options: Options;
  public exampleData: any;
  public exampleData2: any;
  referred: boolean = false;

  @Output() eventsend = new EventEmitter<any>();
  @Output() EventFrom = new EventEmitter<any>();

  constructor(private patientInformationService: PatientInformationService,
    private authenticationService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public modalService: NgbModal) {

    this.currentUser = authenticationService.currentUserValue;
    this.bookingList = [];
    this.sociaEconomicList = [];
    this.referredList = [];

    this.locationUnit = new LocationUnit();
    this.locationUnit.ClientID = this.currentUser.ClientId;
    this.locationUnit.LocationID = ServerChartValues.GetLocationId();
    this.patientReg = new PatientPartographDetail();
    this.PatientRegistration = new PatientRegistration();
    this.PatientRegistration.ClientId = this.currentUser.ClientId;
    this.PatientRegistration.CreatedBy = this.currentUser.LoginId;
    this.PatientRegistration.CreateDateTimeBrowser = new Date();
    this.PatientRegistration.PatientID = ServerChartValues.GetPatientId();



    this.patientReg.ClientId = this.currentUser.ClientId;
    this.patientReg.CreatedBy = this.currentUser.LoginId;
    this.patientReg.CreateDateTimeBrowser = new Date();
    this.patientReg.IsActive = true;
    this.patientReg.PatientID = ServerChartValues.GetPatientId();
    this.patientReg.Code = "001";
    this.patientReg.PartographComments = null;
    this.patientReg.Patient = null;
    this.patientReg.PartographMedia = null;
    this.hospitalUnitNoList = [];

  }

  ngOnInit(): void {


    this.stageCode = GlobalConstants.PATIENT_REGISTRATION_STAGE1;
    this.BindBookingData();
    this.BindSocioEconomicData();
    this.BindReferencData();
    this.LoadHospitalUnitNo();
    this.LoadLiteracy();
    this.LoadReassonForRefferalList();
    //this.buildForm();
    //multi select data
    this.exampleData = [
      {
        id: 'multiple1',
        text: ''
      },
      {
        id: 'multiple2',
        text: '1'
      },
      {
        id: 'multiple3',
        text: '2'
      }
    ];
    this.exampleData2 = [
      {
        id: 'multiple1',
        text: ''
      },
      {
        id: 'multiple2',
        text: '10th pass'
      },
      {
        id: 'multiple3',
        text: '12th pass'
      },
      {
        id: 'multiple4',
        text: 'Gradution'
      },
      {
        id: 'multiple5',
        text: 'Post Gradution'
      }
    ];
    //multi select options
    this.options = {
      tags: true,
    };

    //this.hospitalUnitNoList.push({

    //    id: 'multiple1',
    //    text: ''

    //})

    //this.unitHeadList.push({

    //  id: 'multiple1',
    //  text: ''

    //})

    this.buildForm();

    this.GetPatientRegistrationInformation();

    this.regForm.valueChanges.subscribe(x => {
      //console.log(this.p1form.invalid)
      if (this.regForm.invalid) {
        // this.patientsetup.IsEnable = true;
        this.eventsend.emit(this.regForm);
        return;
      }
      this.eventsend.emit(this.regForm);
      this.EventFrom.emit("PatientInformationSave-3");
    })

    if (this.regForm.invalid) {
      this.eventsend.emit(this.regForm);
      return;
    }
  }
  //ngAfterViewInit() {
  //  this.regForm.addControl('childForm', this.dynamicWebComponent.formgroup);
  //  this.dynamicWebComponent.formgroup.setParent(this.regForm);
  //}

  CalulateAge(event: any) {

    if (event.target.value != "") {
      this.regForm.get("Age").setValue(moment().diff(event.target.value, 'years'));
    }
    else {
      this.regForm.get("Age").setValue('0');
    }
  }
  private GetPatientRegistrationInformation() {
    this.patientInformationService.GetPatientRegistration(this.patientReg).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          if (result.data.length > 0) {
            let res: any[] = result.data;

            if (res != null) {
              if (res[0].patientRegistration != null) {
                let regData: any = res[0].patientRegistration;
                //console.log(formatDate(regData.dateTimeOfAdmission, 'yyyy-MM-dd h:mm a', 'en'))
               // let date = formatDate(regData.dateTimeOfAdmission, 'yyyy-MM-dd h:mm a', 'en').replace(',', '');
                const formattedDate = formatDate(regData.dateTimeOfAdmission, 'yyyy-MM-ddThh:mm', 'en');
                //console.log(formattedDate)
                this.regForm.get("DateAdmission").setValue(formattedDate);

                this.regForm.get("DOB").setValue(formatDate(regData.dob, 'yyyy-MM-dd', 'en'));
                this.regForm.get("Age").setValue(regData.age);
                this.regForm.get("VisitNo").setValue(regData.visitNo);
                this.regForm.get('Unitno').setValue(Number(regData.unitNo));
                //this.regForm.get("Unitno").setValue(regData.unitNo);
                if (regData.unitNo != "") {
                  this.changeUnitNo1(regData.unitNo)
                  this.regForm.get("Unithead").setValue(regData.unitHead);
                }
                else {
                  this.regForm.get("Unitno").setValue("");
                }
                //this.regForm.get("Unithead").setValue(regData.unitHead);
                this.regForm.get("BookedRegisteredEmergency").setValue(regData.booked_RegStered_Emergency);
                this.regForm.get("MrdNo").setValue(regData.mrD_IndoorNo);
                this.regForm.get("CRNo").setValue(regData.cR_OutdoorNo);
                this.regForm.get("WifeLiteracy").setValue(regData.literacyID_Wife);
                this.regForm.get("HusbandLiteracy").setValue(regData.literacyID_Husband);

                this.regForm.get("SocioEconomic").setValue(regData.socio_economicStatus == null ? "" : regData.socio_economicStatus);
                this.regForm.get("SelfRefVisit").setValue(regData.dateTimeOfAdmission);
                this.regForm.get("DateReferral").setValue(regData.dateTimeForReferral);
                this.regForm.get("ReasonReferral").setValue(regData.reasonForReferral);

              }
            }

            //for (let i = 0; i < res.length; i++) {
            //  console.log(res[i].unitName)
            //  this.hospitalUnitNoList.push({
            //    id: res[i].id,
            //    text: res[i].unitName
            //  })
            //}
            //this.hospitalUnitNoList = res;

          }
        }
      },
      error => {

      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        // this.toastrService.success('User is saved successfully');
      }
    );
  }

  private LoadHospitalUnitNo() {
    this.locationUnit.ID = 0;
    // this.hospitalUnitNoList = [];
    this.patientInformationService.GetHospitalUnitNo(this.locationUnit).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          if (result.data.length > 0) {
            let res: any[] = result.data;
            //console.log(res)
            for (let i = 0; i < res.length; i++) {
              // console.log(res[i].unitName)
              this.hospitalUnitNoList.push({
                id: res[i].id,
                text: res[i].unitName
              })
            }
            //this.hospitalUnitNoList = res;

          }
        }
      },
      error => {

      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        // this.toastrService.success('User is saved successfully');
      }
    );

  }

  changeUnitNo(event: any) {
    this.unitHeadList = [];
    if (event.target.value !== "") {
      if (event.target.value > 0) {
        this.regForm.get('Unitno').setValue(Number(event.target.value));
        this.locationUnit.ID = Number(event.target.value);
        this.patientInformationService.GetHospitalUnitHead(this.locationUnit).subscribe(
          result => {
            // Handle result
            if (result.data != undefined) {
              if (result.data.length > 0) {
                let res: any[] = result.data;
                //let res = result.data
                //this.unitHeadList = res;
                for (let i = 0; i < res.length; i++) {
                  this.unitHeadList.push({
                    id: res[i].ID,
                    text: res[i].HeadName
                  })
                }
              }
            }
          },
          error => {

          },
          () => {
            // 'onCompleted' callback.
            // No errors, route to new page here
            // this.toastrService.success('User is saved successfully');
          }
        );
      }
    }

  }


  changeUnitNo1(id) {
    this.unitHeadList = [];
    if (id !== "") {
      if (id > 0) {
        //this.regForm.get('Unitno').setValue(Number(id));
        this.locationUnit.ID = Number(id);
        this.patientInformationService.GetHospitalUnitHead(this.locationUnit).subscribe(
          result => {
            // Handle result
            if (result.data != undefined) {
              if (result.data.length > 0) {
                let res: any[] = result.data;
                //let res = result.data
                //this.unitHeadList = res;
                for (let i = 0; i < res.length; i++) {
                  this.unitHeadList.push({
                    id: res[i].ID,
                    text: res[i].HeadName
                  })
                }
              }
            }
          },
          error => {

          },
          () => {
            // 'onCompleted' callback.
            // No errors, route to new page here
            // this.toastrService.success('User is saved successfully');
          }
        );
      }
    }

  }

  chnageUnitHead(event: any) {

    this.regForm.get('Unithead').setValue(Number(event.target.value));
  }

  changeWifeLiteracy(event: any) {

    this.regForm.get('WifeLiteracy').setValue(Number(event.target.value));
  }

  changeHusbandLiteracy(event: any) {

    this.regForm.get('HusbandLiteracy').setValue(Number(event.target.value));
  }
  private LoadLiteracy() {
    this.locationUnit.ID = 0;
    this.patientInformationService.GetLiteracy(this.locationUnit).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          if (result.data.length > 0) {
            let res = result.data
            this.literacyList = res;

          }
        }
      },
      error => {

      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        // this.toastrService.success('User is saved successfully');
      }
    );
  }

  private LoadReassonForRefferalList() {

  }
  get f() {

    return this.regForm.controls;
  }


  private BindBookingData() {

    this.bookingList.push({

      Value: "Booked",
      Name: "Booked"
    });

    this.bookingList.push({

      Value: "Registered",
      Name: "Registered"
    });

    this.bookingList.push({

      Value: "Emergencys",
      Name: "Emergencys"
    });

  }

  private BindSocioEconomicData() {

    this.sociaEconomicList.push({

      Value: "Upper",
      Name: "Upper"
    });

    this.sociaEconomicList.push({

      Value: "UpperMiddle",
      Name: "UpperMiddle"
    });

    this.sociaEconomicList.push({

      Value: "LowerMiddle",
      Name: "LowerMiddle"
    });


    this.sociaEconomicList.push({

      Value: "UpperLower",
      Name: "UpperLower"
    });

    this.sociaEconomicList.push({

      Value: "Lower",
      Name: "Lower"
    });

  }

  private BindReferencData() {
    this.referredList.push({

      Value: 0,
      Name: "Self Visit",
      i: "1"
    })

    this.referredList.push({

      Value: 1,
      Name: "Referred",
      i: "2"
    })

  }

  // remove extra code which are not working now after redesign on html side

  private buildForm(): void {

    this.regForm = this.formBuilder.group(
      {
        DOB: [null, [Validators.required, ValidationService.DOBAgeValidator]],
        Age: [null, [Validators.required, Validators.maxLength(5), ValidationService.Numeric, ValidationService.AgeValidator]],
        DateAdmission: ['', [Validators.required, Validators.maxLength(50), ValidationService.DateBeforeToday]],
        VisitNo: [null, [ValidationService.AlphanumericWithHypenUnderscore, Validators.maxLength(25)]],
        Unitno: new FormControl(null),
        Unithead: new FormControl(null),
        BookedRegisteredEmergency: [null],
        MrdNo: [null, [ValidationService.AlphanumericWithHypenUnderscore, Validators.maxLength(25)]],
        CRNo: [null, [ValidationService.AlphanumericWithHypenUnderscore, Validators.maxLength(25)]],
        WifeLiteracy: new FormControl(null, [Validators.required]),
        HusbandLiteracy: new FormControl(null, [Validators.required]),
        SocioEconomic: new FormControl(null),
        SelfRefVisit: new FormControl(null),
        DateReferral: [null],
        ReasonReferral: [null, [Validators.maxLength(250)]],
        dynamicWebControl: new FormControl(null, [Validators.required])
      }
    );



  }

  SaveRegistration() {
    //console.log(this.regForm)
    if (this.regForm.invalid) {

      return;
    }

    this.patientReg.Name = "0001";
    // alert(this.regForm.value.Age)
    this.PatientRegistration.UpdateDateTimeBrowser = new Date();
    this.PatientRegistration.UpdatedBy = this.currentUser.LoginId;
    // this.PatientRegistration.ClientId = this.currentUser.ClientId;
    this.PatientRegistration.ClientId = this.currentUser.ClientId;
    this.PatientRegistration.Age = this.regForm.value.Age;
    this.PatientRegistration.Booked_RegStered_Emergency = this.regForm.value.BookedRegisteredEmergency;
    this.PatientRegistration.ClientId = this.currentUser.ClientId;
    this.PatientRegistration.CreateDateTimeBrowser = new Date();
    this.PatientRegistration.CreatedBy = this.currentUser.LoginId;
    this.PatientRegistration.CR_OutdoorNo = (this.regForm.value.CRNo).toString();
    this.PatientRegistration.DateTimeForReferral = this.regForm.value.DateReferral;
    this.PatientRegistration.DateTimeOfAdmission = this.regForm.value.DateAdmission;
    this.PatientRegistration.DOB = this.regForm.value.DOB;
    this.PatientRegistration.LiteracyID_Husband = this.regForm.value.HusbandLiteracy;
    this.PatientRegistration.LiteracyID_Wife = this.regForm.value.WifeLiteracy;
    this.PatientRegistration.MRD_IndoorNo = this.regForm.value.MrdNo.toString();
    this.PatientRegistration.ReasonForReferral = this.regForm.value.ReasonReferral;
    this.PatientRegistration.Sex = "F";
    this.PatientRegistration.VisitNo = this.regForm.value.VisitNo;
    this.PatientRegistration.ReferenceNo = "0001";
    this.PatientRegistration.UnitNo = this.regForm.value.Unitno.toString();
    this.PatientRegistration.UnitHead = this.regForm.value.Unithead.toString();
    this.PatientRegistration.ReferredFromResourceContactID = null;
    if (this.regForm.value.SelfRefVisit == "0") {
      this.PatientRegistration.SelfVisit = Boolean(1);
    }
    else {
      this.PatientRegistration.SelfVisit = Boolean(0);
    }
    //this.PatientRegistration.SelfVisit = Boolean(this.regForm.value.SelfRefVisit);
    this.patientReg.PatientRegistration = this.PatientRegistration;

    this.patientInformationService.SavePartogrph_Registration(this.patientReg).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          if (result.data.length > 0) {
            let res = result.data;

            if (res != null) {
              this.regForm.reset();
              this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
            }
            else {
              this.toastr.success(GlobalConstants.FAILED_MESSAGE);
            }



          }
        }
      },
      error => {
        this.toastr.success(GlobalConstants.FAILED_MESSAGE);
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        // this.toastrService.success('User is saved successfully');
      }
    );

    //console.log(this.patientReg)

  }

  ifreferred(num) {
    if (num == 1) {
      //this.regForm.get('SelfRefVisit').setValue(false);
      this.referred = false;
    }
    else if (num == 2) {
      //this.regForm.get('SelfRefVisit').setValue(true);
      this.referred = true;
    }
  }
  openContact() {
    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

}




