import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '@app/core/services/alert.service';
//import { PatientInformationService } from '../../../modules/manage-partograph/services/patient-informaation.services';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { PartographPatientSetup } from '../../../modules/manage-partograph/modals/patient-information';
import { User, AuthService } from '../../../core';
import { ServerChartValues, PartographSessionManagement } from '../../../modules/manage-partograph/modals/input-chart';
import { PatientPartographDetail, PatientRegistration } from '../../../core/models/partograph-registration';
//import moment from 'moment';

//import { DynamicWebcontrolParameterComponent } from '../dynamic-webcontrol-parameter/dynamic-webcontrol-parameter.component';
//import { PatientPartograph } from '../../../core/services/patient-partograph.service-';
import { DynamicWebcontrolParameterService } from '../../../modules/manage-partograph/services/dynamic-webcontrol-parameter.service';
import { ISaveDynamicParameter } from '../../../modules/manage-partograph/modals/dynamic-webcontrol-parameter.model';
import { PatientInformationService } from '../../../modules/manage-partograph/services/patient-informaation.services';
import moment from 'moment';

@Component({
  //providers: [PatientPartograph],
  selector: 'app-next-previous-button',
  templateUrl: './next-previous-button.component.html',
  styleUrls: ['./next-previous-button.component.css'],
  
})

export class NextPreviousButtonComponent implements OnInit {
  @Input() EventFrom; name: string; partographId: number;
  @Input() formData: any; IsEnableTab$: any; 
  buttonState: ButtonPreviousNextStatus;
  subscription: Subscription;
  patientsetup: PartographPatientSetup;
  patientReg: PatientPartographDetail;
  PatientRegistration: PatientRegistration;
  @Output() eventSendBack = new EventEmitter<any>();
  currentUser: User; _partographSession: PartographSessionManagement;
  IsSave: boolean;
  public AddFormDynamicParameter: {
    AddDynamicParam: ISaveDynamicParameter[];

  };

  constructor(private patientsetupService: PatientInformationService,
    private webcontrolService: DynamicWebcontrolParameterService,
    //private patientPartograph: PatientPartograph,
    //private dynamicwebControl: DynamicWebcontrolParameterComponent,
    private authenticationService: AuthService,
    //private patientsetupService: PatientInformationService,
    private toastr: ToastrService, private data: DataService) {
    this._partographSession = new PartographSessionManagement();
    this.currentUser = this.authenticationService.currentUserValue;
    this.patientsetup = new PartographPatientSetup();

   this.patientsetup.ClientId = this.currentUser.ClientId;
    this.patientsetup.LocationTypeCode = GlobalConstants.OPERATING_LOCATION_CODE;
    this.patientsetup.SourceSystemId = GlobalConstants.SourceSystemId;

    this.patientReg = new PatientPartographDetail();

    this.patientReg.ClientId = this.currentUser.ClientId;
    this.patientReg.CreatedBy = this.currentUser.LoginId;
    this.patientReg.CreateDateTimeBrowser = new Date();
    this.patientReg.IsActive = true;
    this.patientReg.PatientID = ServerChartValues.GetPatientId();
    this.patientReg.Code = "001";
    this.patientReg.PartographComments = null;
    this.patientReg.Patient = null;
    this.patientReg.PartographMedia = null;

    this.PatientRegistration = new PatientRegistration();
    

    this.IsEnableTab$ = this.data.getMessage();
  }

  ngOnInit(): void {
    console.log(this.formData)
    //this.isSaveButtonEnable = true;
    
    // substribe button service for hide and show next and previous button
    this.subscription = this.data.currentStatusSource.subscribe(buttonState =>
      this.buttonState = buttonState

      
    );
    // unsubscribe here
   // console.log(this.buttonState.isValidateSaveButton+"ssdsd")
    this.subscription.unsubscribe();
    //this.isValidate$ = this.data.getMessage();

   // if (this.formData) {
    //  if (!this.formData.IsEnable) {
    //    this.isValidate = false;
    //  }
    //  else {
    //    this.isValidate = true;
    //  }
    //}
    //else {
    //  this.isValidate = true;
    //}

  }


  
  Save() {
   
    console.log(this.formData)
    console.log(this.EventFrom)
    if (this.formData != undefined) {
      let mode = this.EventFrom;
      ////let mode = this.formData.get("ModeEnd").value
      console.log(mode);
      // Save Patient First Stage

      if (mode == "PatientInformationSave-1") {

        //if (this.SavePatientInformation1(this.formData)) {
        this.SavePatientInformation1(this.formData)
        //  this.formData.reset();
        //  this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
        //}
        //  else {
        //    this.toastr.success(GlobalConstants.FAILED_MESSAGE);
          
        //}
        
        
      }
      // Save Patient IIIrd Stage
      else if (mode == "PatientInformationSave-3") {
        this.SavePatientInformation3(this.formData);
        //if (this.SavePatientInformation3(this.formData)) {

        //  this.formData.reset();
        //  this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
        //}
        //else {
        //  this.toastr.success(GlobalConstants.FAILED_MESSAGE);

        //}
      }
    }

    if (this.EventFrom == "ThirdStage") {
      console.log(this.formData.Complications)
      localStorage.setItem("ThirdStageComplication", JSON.stringify(this.formData.Complications));
      this.toastr.success("Data saved successfully!");
    }



    if (this.EventFrom == "ThirdStage") {
      console.log(this.formData.Complications)
      localStorage.setItem("ThirdStageComplication", JSON.stringify(this.formData.Complications));
      this.toastr.success("Data saved successfully!");
    }

    else if (this.EventFrom == "FourthStage") {
      //console.log(this.formData.Complications)
      localStorage.setItem("FourthStageComplication", JSON.stringify(this.formData.Complications));
      this.toastr.success("Data saved successfully!");
    }
  }



  public SavePatientInformation1(formData) {

    this.IsSave = false;
    //let IsSave: boolean = false;
    if (this.formData.invalid) {

      return;
    }
    let now = moment();
    this.partographId = formData.get("PartographId").value;
    this.patientsetup.id = formData.get("id").value;
    this.patientsetup.AdmittedBy = this.currentUser.LoginId;
    this.patientsetup.UpdateDateTimeBrowser = now.format();
    this.patientsetup.UpdatedBy = this.currentUser.LoginId;
    this.patientsetup.CreatedBy = this.currentUser.LoginId;
    this.patientsetup.CreateDateTimeBrowser = now.format();
    this.name = formData.get("FirstName").value + " " + formData.get("MiddleName").value + " " + formData.get("LastName").value;
    this.patientsetup.Code = this.currentUser.ClientId.toString() + formData.get("FirstName").value;
    this.patientsetup.ReferenceNo = this.currentUser.ClientId.toString() + formData.get("FirstName").value;
    this.patientsetup.FirstName = formData.get("FirstName").value;
    this.patientsetup.MiddleName = formData.get("MiddleName").value;
    this.patientsetup.LastName = formData.get("LastName").value;
    this.patientsetup.Prefix = formData.get("Prefix").value;
    this.patientsetup.Suffix = formData.get("Suffix").value;
    this.patientsetup.LocationId = formData.get("LocationId").value;
    this.patientsetup.RegistrationNo = formData.get("RegistrationNo").value;
    //patientsetup.IsEnable = false;

    if (formData.get("id").value == "0") {

      this.patientsetupService.SavePartogrph_PatientInformationPart1(this.patientsetup)
        .subscribe(data => {

          if (data.data != null || data.data != undefined) {

            //eventSendBack.emit("Success");
            //formData.reset();

            let m1 = moment().format("YYYYMMDDHHmmss");

            this.patientReg.ReferenceNo = "REG" + "-" + m1.toString() + data.data.id.toString();
            this.patientReg.Code = "REG" + "-" + m1.toString() + data.data.id.toString();
            this.patientReg.PatientID = data.data.id;
            this.patientReg.Name = name;
            this.patientReg.PatientRegistration = null;

            // this.SavePartograph(this.patientReg);
            this._partographSession.PatientId = data.data.id
            this._partographSession.LocationId = data.data.locationId
            localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));
            this.patientReg.IsActive = true;
            this.SavePartograph(this.patientReg);

            //this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
            //if (data.data.length > 0) {


            //}
          }
          else {
            this.IsSave = false;
            //eventSendBack.emit("Error");
            //this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
          }

        },
          error => {
            this.IsSave = false;
            //eventSendBack.emit("Error");
            // .... HANDLE ERROR HERE 
            console.log(error);

          }

        );
    }
    else {
      this.patientsetupService.Upate_PatientInformationPart1(this.patientsetup)
        .subscribe(data => {

          if (data.data != null || data.data != undefined) {
            //eventSendBack.emit("Success");
            //formData.reset();
            let m1 = moment().format("YYYYMMDDHHmmss");
            this.patientReg.ReferenceNo = "REG" + "-" + m1.toString() + data.data.id.toString();
            this.patientReg.Code = "REG" + "-" + m1.toString() + data.data.id.toString();
            this.patientReg.PatientID = data.data.id;
            this.patientReg.Name = name;
            this.patientReg.PatientRegistration = null;
            this.patientReg.Id = this.partographId


            this._partographSession.PatientId = data.data.id
            this._partographSession.LocationId = data.data.locationId
            localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));

            this.data.sendMessage1(ServerChartValues.MatTabButtonEnable());
            this.SavePartograph(this.patientReg);

            // this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
            //if (data.data.length > 0) {


            //}
          }
          else {
            this.IsSave = false;
            //eventSendBack.emit("Error");
            //this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
          }

        },
          error => {
            this.IsSave = false;
            //eventSendBack.emit("Error");
            // .... HANDLE ERROR HERE 
            console.log(error);

          }

        );

    }
    //return IsSave;
  }
  SavePartograph(partographData) {
    // console.log(formData)
    
    //let IsSave: boolean = false;

    //console.log(partographData)
    this.patientsetupService.SavePartograph(partographData).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          //if (result.data.length > 0) {
          let res = result.data;

          if (res != null) {

            let obj: PartographSessionManagement = (JSON.parse(localStorage.getItem('PartographPatient')));

            this._partographSession.PartographId = res.id;
            this._partographSession.PatientId = res.patientID;
            this._partographSession.LocationId = obj.LocationId;
            localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));
            this.data.sendMessage1(ServerChartValues.MatTabButtonEnable());
            this.IsSave = true;
           
            this.formData.reset();
            this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
          }
          else {
            this.IsSave = false;
            this.toastr.success(GlobalConstants.FAILED_MESSAGE);
          }



          //}
        }
      },
      error => {
        this.IsSave = false;
        //this.toastr.success(GlobalConstants.FAILED_MESSAGE);
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        // toastrService.success('User is saved successfully');
      }
    );

    //alert(this.IsSave)
    //console.log(patientReg)
    //return IsSave;
  }


  public SavePatientInformation3(formData): boolean {
     console.log(formData.value.DateAdmission)
    if (formData.invalid) {

      return;
    }
    //this.dynamicwebControl.SaveObservation();
    this.PatientRegistration.ClientId = this.currentUser.ClientId;
    this.PatientRegistration.CreatedBy = this.currentUser.LoginId;
    this.PatientRegistration.CreateDateTimeBrowser = new Date();
    this.PatientRegistration.PatientID = ServerChartValues.GetPatientId();

    this.patientReg.PatientID = ServerChartValues.GetPatientId();
    this.PatientRegistration.UpdateDateTimeBrowser = new Date();
    this.PatientRegistration.UpdatedBy = this.currentUser.LoginId;
    // this.PatientRegistration.ClientId = this.currentUser.ClientId;
    this.PatientRegistration.ClientId = this.currentUser.ClientId;
    this.PatientRegistration.Age = formData.value.Age;
    this.PatientRegistration.Booked_RegStered_Emergency = formData.value.BookedRegisteredEmergency;
    this.PatientRegistration.ClientId = this.currentUser.ClientId;
    this.PatientRegistration.CreateDateTimeBrowser = new Date();
    this.PatientRegistration.CreatedBy = this.currentUser.LoginId;
    this.PatientRegistration.CR_OutdoorNo = (formData.value.CRNo) == null ? "":(formData.value.CRNo).toString();
    this.PatientRegistration.DateTimeForReferral = formData.value.DateReferral == null ? new Date() : formData.value.DateReferral;
    this.PatientRegistration.DateTimeOfAdmission = formData.value.DateAdmission;
    this.PatientRegistration.DOB = formData.value.DOB;
    this.PatientRegistration.LiteracyID_Husband = formData.value.HusbandLiteracy == "" ? null : (formData.value.HusbandLiteracy == null ? null: formData.value.HusbandLiteracy);
    this.PatientRegistration.LiteracyID_Wife = formData.value.WifeLiteracy == "" ? null : formData.value.WifeLiteracy;
    this.PatientRegistration.MRD_IndoorNo = formData.value.MrdNo == null ? "" : (formData.value.MrdNo == undefined ? "": formData.value.MrdNo.toString());
    this.PatientRegistration.ReasonForReferral = formData.value.ReasonReferral;
    this.PatientRegistration.Sex = "F";
    this.PatientRegistration.VisitNo = formData.value.VisitNo == null ? null : (formData.value.VisitNo == undefined ? "" : formData.value.VisitNo); //formData.value.VisitNo;
    this.PatientRegistration.ReferenceNo = "0001";
    this.PatientRegistration.UnitNo = formData.value.Unitno == null ? "" : (formData.value.Unitno == undefined ? "": formData.value.Unitno.toString());
    this.PatientRegistration.UnitHead = formData.value.Unithead == null ? "" : (formData.value.Unithead == undefined ? "" : formData.value.Unithead.toString()); //formData.value.Unithead.toString();
    this.PatientRegistration.ReferredFromResourceContactID = null;
    this.PatientRegistration.Socio_economicStatus = formData.value.SocioEconomic == null ? null : (formData.value.SocioEconomic == undefined ? null : formData.value.SocioEconomic);
    if (formData.value.SelfRefVisit == "0") {
      this.PatientRegistration.SelfVisit = Boolean(1);
    }
    else {
      this.PatientRegistration.SelfVisit = Boolean(0);
    }
    //this.PatientRegistration.SelfVisit = Boolean(this.formData.value.SelfRefVisit);
    this.patientReg.PatientRegistration = this.PatientRegistration;

    this.patientsetupService.SavePartogrph_Registration(this.patientReg).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          // if (result.data.length > 0) {
          let res = result.data;

          if (res != null) {

            this.SaveObservation(formData)

           // return false;
            //this.formData.reset();
            //this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
          }
          //else {
          //  return false;
          //  // this.toastr.success(GlobalConstants.FAILED_MESSAGE);
          //}



        }
        //}
      },
      error => {
        return false;
        //this.toastr.success(GlobalConstants.FAILED_MESSAGE);
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        // this.toastrService.success('User is saved successfully');
      }
    );
    return false;
    //console.log(this.patientReg)

  }

  //Dynamic parameter values save
  public SaveObservation(formData) {
    this.AddFormDynamicParameter = {
      AddDynamicParam: [],

    };
    //console.log(formData.value.dynamicWebControl.dynamicParameterFormArray)
    this.AddFormDynamicParameter.AddDynamicParam = [];
    for (let i = 0; i < formData.value.dynamicWebControl.dynamicParameterFormArray.length; i++) {



      this.AddFormDynamicParameter.AddDynamicParam.push({
        DynamicMeasurementParameterID: formData.value.dynamicWebControl.dynamicParameterFormArray[i].dynamicMeasurementParameterID,
        ClientID: this.currentUser.ClientId,
        createdBy: this.currentUser.LoginId,
        CreateDateTimeBrowser: new Date(),
        ParameterValue: formData.value.dynamicWebControl.dynamicParameterFormArray[i].parameterValue,
        ParameterValueComment: formData.value.dynamicWebControl.dynamicParameterFormArray[i].parameterValueComment,
        PartographID: ServerChartValues.GetPartpgraphId(),
        PatientID: ServerChartValues.GetPatientId(),
        SourceSystemID: 1,
        StageCode: formData.value.dynamicWebControl.dynamicParameterFormArray[i].stageCode,
      });



    }


    this.webcontrolService.AddDynamicMeasurementParametersValues(this.AddFormDynamicParameter.AddDynamicParam).subscribe(data => {
      if (data.data != null) {
        let obsData: any[] = data.data;
        //console.log(obsData)
        if (obsData != null) {
         // return true;
          this.formData.reset();
           this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);

        }
        else {
          //return false;
          this.toastr.success(GlobalConstants.FAILED_MESSAGE);
        }

      }
      else {
        //this.tempList = [];
      }

    },
      error => {
        //return false;
        this.toastr.success(GlobalConstants.FAILED_MESSAGE);
        // .... HANDLE ERROR HERE 
        console.log(error);
        //this.tempList = [];
      }

    );
    //return false;
    //console.log(this.AddFormDynamicParameter.AddDynamicParam)
  }

  //SavePatientInformation1() {
  //  console.log(this.formData)
  //  this.partographId = this.formData.get("PartographId").value;
  //  this.patientsetup.id = this.formData.get("id").value;
  //  this.patientsetup.AdmittedBy = this.currentUser.LoginId;
  //  this.patientsetup.UpdateDateTimeBrowser = new Date();
  //  this.patientsetup.UpdatedBy = this.currentUser.LoginId;
  //  this.patientsetup.CreatedBy = this.currentUser.LoginId;
  //  this.patientsetup.CreateDateTimeBrowser = new Date();
  //  this.name = this.formData.get("FirstName").value + " " + this.formData.get("MiddleName").value + " " + this.formData.get("LastName").value;
  //  this.patientsetup.Code = this.currentUser.ClientId.toString() + this.formData.get("FirstName").value;
  //  this.patientsetup.ReferenceNo = this.currentUser.ClientId.toString() + this.formData.get("FirstName").value;
  //  this.patientsetup.FirstName = this.formData.get("FirstName").value;
  //  this.patientsetup.MiddleName = this.formData.get("MiddleName").value;
  //  this.patientsetup.LastName = this.formData.get("LastName").value;
  //  this.patientsetup.Prefix = this.formData.get("Prefix").value;
  //  this.patientsetup.Suffix = this.formData.get("Suffix").value;
  //  this.patientsetup.LocationId = this.formData.get("LocationId").value;
  //  this.patientsetup.RegistrationNo = this.formData.get("RegistrationNo").value;
  //  //this.patientsetup.IsEnable = false;

  //  if (this.formData.get("id").value == "0") {

  //    this.patientsetupService.SavePartogrph_PatientInformationPart1(this.patientsetup)
  //      .subscribe(data => {

  //        if (data.data != null || data.data != undefined) {
          
  //          this.eventSendBack.emit("Success");
  //          this.formData.reset();
           
  //          let m1 = moment().format("YYYYMMDDHHmmss");
           
  //          this.patientReg.ReferenceNo = "REG" + "-" + m1.toString() + data.data.id.toString();
  //          this.patientReg.Code = "REG" + "-" + m1.toString() + data.data.id.toString();
  //          this.patientReg.PatientID = data.data.id;
  //          this.patientReg.Name = this.name;
  //          this.patientReg.PatientRegistration = null;
           
  //          this.SavePartograph(this.patientReg);
  //          this._partographSession.PatientId = data.data.id
  //          this._partographSession.LocationId = data.data.locationId
  //          localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));

  //          this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
  //          //if (data.data.length > 0) {


  //          //}
  //        }
  //        else {
  //          this.eventSendBack.emit("Error");
  //          this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
  //        }

  //      },
  //        error => {
  //          this.eventSendBack.emit("Error");
  //          // .... HANDLE ERROR HERE 
  //          console.log(error);

  //        }

  //      );
  //  }
  //  else {
  //    this.patientsetupService.Upate_PatientInformationPart1(this.patientsetup)
  //      .subscribe(data => {

  //        if (data.data != null || data.data != undefined) {
  //          this.eventSendBack.emit("Success");
  //          this.formData.reset();
  //          let m1 = moment().format("YYYYMMDDHHmmss");
  //          this.patientReg.ReferenceNo = "REG" + "-" + m1.toString() + data.data.id.toString();
  //          this.patientReg.Code = "REG" + "-" + m1.toString() + data.data.id.toString();
  //          this.patientReg.PatientID = data.data.id;
  //          this.patientReg.Name = this.name;
  //          this.patientReg.PatientRegistration = null;
  //          this.patientReg.Id = this.partographId
  //          this.SavePartograph(this.patientReg);
  //          this._partographSession.PatientId = data.data.id
  //          this._partographSession.LocationId = data.data.locationId
  //          localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));

  //          this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
  //          //if (data.data.length > 0) {


  //          //}
  //        }
  //        else {
  //          this.eventSendBack.emit("Error");
  //          this.toastr.warning(GlobalConstants.FAILED_MESSAGE);
  //        }

  //      },
  //        error => {
  //          this.eventSendBack.emit("Error");
  //          // .... HANDLE ERROR HERE 
  //          console.log(error);

  //        }

  //      );

  //  }
  //}
  //SavePartograph(partographData) {
  //  // console.log(this.formData)

   

  //  //console.log(partographData)
  //  this.patientsetupService.SavePartograph(partographData).subscribe(
  //    result => {
  //      // Handle result
  //      if (result.data != undefined) {
  //        //if (result.data.length > 0) {
  //          let res = result.data;
           
  //          if (res != null) {

  //            let obj: PartographSessionManagement = (JSON.parse(localStorage.getItem('PartographPatient')));
             
  //            this._partographSession.PartographId = res.id;
  //            this._partographSession.PatientId = res.patientID;
  //            this._partographSession.LocationId = obj.LocationId;
  //            localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));

  //            //this.formData.reset();
  //            this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
  //          }
  //          else {
  //            this.toastr.success(GlobalConstants.FAILED_MESSAGE);
  //          }



  //        //}
  //      }
  //    },
  //    error => {
  //      this.toastr.success(GlobalConstants.FAILED_MESSAGE);
  //    },
  //    () => {
  //      // 'onCompleted' callback.
  //      // No errors, route to new page here
  //      // this.toastrService.success('User is saved successfully');
  //    }
  //  );

  //  //console.log(this.patientReg)

  //}

  //SavePatientInformation3() {
  // // console.log(this.formData)
  //  if (this.formData.invalid) {

  //    return;
  //  }
  //  //this.dynamicwebControl.SaveObservation();
  //  this.patientReg.PatientID = ServerChartValues.GetPatientId();
  //  this.PatientRegistration.UpdateDateTimeBrowser = new Date();
  //  this.PatientRegistration.UpdatedBy = this.currentUser.LoginId;
  //  // this.PatientRegistration.ClientId = this.currentUser.ClientId;
  //  this.PatientRegistration.ClientId = this.currentUser.ClientId;
  //  this.PatientRegistration.Age = this.formData.value.Age;
  //  this.PatientRegistration.Booked_RegStered_Emergency = this.formData.value.BookedRegisteredEmergency;
  //  this.PatientRegistration.ClientId = this.currentUser.ClientId;
  //  this.PatientRegistration.CreateDateTimeBrowser = new Date();
  //  this.PatientRegistration.CreatedBy = this.currentUser.LoginId;
  //  this.PatientRegistration.CR_OutdoorNo = (this.formData.value.CRNo).toString();
  //  this.PatientRegistration.DateTimeForReferral = this.formData.value.DateReferral;
  //  this.PatientRegistration.DateTimeOfAdmission = this.formData.value.DateAdmission;
  //  this.PatientRegistration.DOB = this.formData.value.DOB;
  //  this.PatientRegistration.LiteracyID_Husband = this.formData.value.HusbandLiteracy;
  //  this.PatientRegistration.LiteracyID_Wife = this.formData.value.WifeLiteracy;
  //  this.PatientRegistration.MRD_IndoorNo = this.formData.value.MrdNo.toString();
  //  this.PatientRegistration.ReasonForReferral = this.formData.value.ReasonReferral;
  //  this.PatientRegistration.Sex = "F";
  //  this.PatientRegistration.VisitNo = this.formData.value.VisitNo;
  //  this.PatientRegistration.ReferenceNo = "0001";
  //  this.PatientRegistration.UnitNo = this.formData.value.Unitno.toString();
  //  this.PatientRegistration.UnitHead = this.formData.value.Unithead.toString();
  //  this.PatientRegistration.ReferredFromResourceContactID = null;
  //  if (this.formData.value.SelfRefVisit == "0") {
  //    this.PatientRegistration.SelfVisit = Boolean(1);
  //  }
  //  else {
  //    this.PatientRegistration.SelfVisit = Boolean(0);
  //  }
  //  //this.PatientRegistration.SelfVisit = Boolean(this.formData.value.SelfRefVisit);
  //  this.patientReg.PatientRegistration = this.PatientRegistration;

  //  this.patientsetupService.SavePartogrph_Registration(this.patientReg).subscribe(
  //    result => {
  //      // Handle result
  //      if (result.data != undefined) {
  //       // if (result.data.length > 0) {
  //          let res = result.data;

  //          if (res != null) {
  //            this.formData.reset();
  //            this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
  //          }
  //          else {
  //            this.toastr.success(GlobalConstants.FAILED_MESSAGE);
  //          }



  //        }
  //      //}
  //    },
  //    error => {
  //      this.toastr.success(GlobalConstants.FAILED_MESSAGE);
  //    },
  //    () => {
  //      // 'onCompleted' callback.
  //      // No errors, route to new page here
  //      // this.toastrService.success('User is saved successfully');
  //    }
  //  );

  //  //console.log(this.patientReg)

  //}
}

