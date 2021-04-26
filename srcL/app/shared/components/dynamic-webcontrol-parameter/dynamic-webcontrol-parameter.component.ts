import { Component, OnInit, ElementRef, Input, EventEmitter, Output, ViewChild, forwardRef } from '@angular/core';
import { AddComplicationsComponent } from '@app/shared/components/modal-content/add-complications/add-complications.component';
import { User, AuthService } from '@app/core';
import moment from 'moment';
import 'moment-timezone';
import { DynamicWebcontrolParameterService } from '@app/modules/manage-partograph/services/dynamic-webcontrol-parameter.service';
import { DynamicWebControl, ISaveDynamicParameter } from '@app/modules/manage-partograph/modals/dynamic-webcontrol-parameter.model';
import { ServerChartValues } from '@app/modules/manage-partograph/modals/input-chart';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { DataService, ValidationService } from '@app/shared/services';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormGroup, FormBuilder, Validators, FormArray, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';

interface IComplication {
  stageCode: string;
  webControlType: string;
  code: string; controlName: string;
  headName: string;
  webControlTypeID: number;
  parameterValue: string;
  parameterValueComment: string;
  createdBy: string;
  createDateTimeServer: Date;
  uom: string;
  dynamicMeasurementParameterID: number;
  regexExp: string;
  regexMessage: string;
  webcontorlTypePossibleValues: IPossibleValues[];
}

interface IPossibleValues {
  id: number;
  webControlTypeID: number;
  controlLevelValue: string;
  isDefault: boolean;

}

@Component({
  selector: 'app-dynamic-webcontrol-parameter',
  templateUrl: './dynamic-webcontrol-parameter.component.html',
  styleUrls: ['./dynamic-webcontrol-parameter.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicWebcontrolParameterComponent),
      multi: true
      
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DynamicWebcontrolParameterComponent),
      multi: true
    }
  ]
})
export class DynamicWebcontrolParameterComponent implements OnInit, ControlValueAccessor, Validator  {

  regForm: FormGroup;

  //@ViewChild('petsForm') ngForm: NgForm;
  @Output() EventFrom = new EventEmitter<any>();
  @Input() stageModule: string;
   currentUser: User; UserName: string;
  modalRef: NgbModalRef;
  ApiComplist: any = [];
  dynamicWebControlObj: DynamicWebControl;
  possibleList: IPossibleValues[];
  timeZone = moment.tz.guess();
  timeZoneOffset = (new Date()).getTimezoneOffset();
  regexExpression: string; regexMessage: string;
  @Output() eventsend = new EventEmitter<any>();
  public AddFormDynamicParameter: {
    AddDynamicParam: ISaveDynamicParameter[];

  };
  dynamicParameterFormArray: FormArray;
  public form: {
    Complications: IComplication[];

  };
  constructor(private formBuilder: FormBuilder,private toastr: ToastrService, private authenticationService: AuthService,
    private webcontrolService: DynamicWebcontrolParameterService,
    public modalService: NgbModal,
    private data: DataService,
    public myelement: ElementRef) {
   
    this.currentUser = this.authenticationService.currentUserValue;
    this.UserName = this.currentUser.username;
   
    
  }

  ngOnInit() {
    
    this.dynamicWebControlObj = new DynamicWebControl();
    this.dynamicWebControlObj.PatientId = ServerChartValues.GetPatientId();
    this.dynamicWebControlObj.PartographId = ServerChartValues.GetPartpgraphId();
    this.dynamicWebControlObj.StageCode = this.stageModule;
    this.dynamicWebControlObj.Mode = "F";
    this.dynamicWebControlObj.ClientId = this.currentUser.ClientId;
    this.dynamicWebControlObj.WebControlTypeID = 0;

    

    this.regForm = this.formBuilder.group({
      dynamicParameterFormArray: this.formBuilder.array([])
      //dynamicParameterFormArray: new FormArray([])
    });
    this.LoadObservationParams(this.dynamicWebControlObj);
    // this.ComplicationJsonList = [];
    this.form = {
      Complications: [],

    };

    this.AddFormDynamicParameter = {
      AddDynamicParam: [],

    };
    ;
    //this.regForm.valueChanges.subscribe(x => {
    //  //console.log(this.regForm)
    //  //if (this.regForm1.invalid) {
    //  //  // this.patientsetup.IsEnable = true;
    //  //  this.eventsend.emit(this.regForm1);
    //  //  return;
    //  //}
    //});


    //  this.eventsend.emit(this.ngForm);
    //  this.EventFrom.emit("PatientInformationSave-3")
    //  //this.p1form.reset();

    //})

    //if (this.ngForm.invalid) {
    //  this.eventsend.emit(this.ngForm);
    //  return;
    //}
  }

  ngAfterOnInit() {
    this.dynamicParameterFormArray = this.regForm.get('dynamicParameterFormArray') as FormArray;
  }

  public onTouched: () => void = () => { };

  writeValue(val: any): void {
    val && this.regForm.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: any): void {
    console.log("on change");
    this.regForm.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.regForm.disable() : this.regForm.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    console.log("Basic Info validation", c);
    return this.regForm.valid ? null : { invalidForm: { valid: false, message: "basicInfoForm fields are invalid" } };
  }

  get f() { return this.regForm.controls; }
  get t() { return this.f.dynamicParameterFormArray as FormArray; }
  //get dynamicParameterFormArray(): FormArray {
  //  return this.formgroup.get("dynamicParameterFormArray") as FormArray;
   
  //}

  //private buildForm(): void {

  //  this.formgroup = this.formBuilder.group(
  //    {
  //      DOB: [null, Validators.required],
  //      Age: [null, [Validators.required, Validators.maxLength(5), ValidationService.Numeric]],
  //      DateAdmission: ['', [Validators.required, Validators.maxLength(50)]],
  //      VisitNo: [null, [Validators.maxLength(50), ValidationService.Numeric]],
  //      Unitno: new FormControl(null),
  //      Unithead: new FormControl(null),
  //      BookedRegisteredEmergency: ["Booked"],
  //      MrdNo: [null],
  //      CRNo: [null],
  //      WifeLiteracy: new FormControl(null),
  //      HusbandLiteracy: new FormControl(null),
  //      SocioEconomic: new FormControl(null),
  //      SelfRefVisit: new FormControl(null),
  //      DateReferral: [null],
  //      ReasonReferral: [null],
  //    }
  //  );



  //}

  AddDynmaicArray(obsData: any, regexPattern): FormGroup {
   // regexPattern ='/^[A-Za-z]+$/';
    //console.log(regexPattern)
    return this.formBuilder.group({
      stageCode: [obsData.stageCode],
      webControlType: [obsData.webControlType],
      code: [obsData.code],
      controlName: [obsData.controlName],
      headName: [obsData.headName],
      webControlTypeID: [obsData.webControlTypeID],
      parameterValue: [obsData.parameterValue, [Validators.required, Validators.pattern(regexPattern)]],
      parameterValueComment: [obsData.parameterValueComment, [Validators.maxLength(250)]],
      createdBy: [obsData.createdBy],
      createDateTimeServer: [obsData.createDateTimeServer],
      uom: [obsData.parameterValue],
      dynamicMeasurementParameterID: [obsData.dynamicMeasurementParameterID],
      webcontorlTypePossibleValues: [this.possibleList],
      regexExp: [this.regexExpression],
      regexMessage: [this.regexMessage],
    })
  }


  BindDynamicControls(obsData) {
    for (let i = 0; i < obsData.length; i++) {
      this.possibleList = [];
      let PossibleValues: any[] = obsData[i].webcontorlTypePossibleValues;
      let regexExp = obsData[i].validations.result;
      //console.log(regexExp)
      if (regexExp != null) {

        if (regexExp.validationRegex != null) {

          this.regexExpression = regexExp.validationRegex;

          this.regexMessage = regexExp.validationErrorMessage;

        }


      }
      else {
        this.regexExpression = "";
        this.regexMessage = "";

      }

      //console.log(this.regexExpression)
      for (let j = 0; j < PossibleValues.length; j++) {

        this.possibleList.push({
          id: PossibleValues[j].id,
          webControlTypeID: PossibleValues[j].webControlTypeID,
          controlLevelValue: PossibleValues[j].controlLevelValue,
          isDefault: PossibleValues[j].isDefault,
        })
      }

      if (obsData[i].webControlType == 'rdb') {
        if (obsData[i].parameterValue == '')
          obsData[i].parameterValue = 'No'
      }
      //else if (obsData[i].webControlType == 'ddl') {
      //  obsData[i].parameterValue = 'No'
      //}
      this.dynamicParameterFormArray = this.regForm.get('dynamicParameterFormArray') as FormArray;
      this.dynamicParameterFormArray.push(this.AddDynmaicArray(obsData[i], obsData[i].webControlType == "txt" ? this.regexExpression : null));
      //this.dynamicParameterFormArray.push(this.AddDynmaicArray(obsData[i]));
      ;
      //this.dynamicParameterFormArray.push(
      //  this.formBuilder.group({
      //    stageCode: [obsData[i].stageCode, Validators.required],
      //    webControlType: [obsData[i].webControlType, Validators.required],
      //    code: [obsData[i].code, Validators.required],
      //    controlName: [obsData[i].controlName, Validators.required],
      //    headName: [obsData[i].headName, Validators.required],
      //    webControlTypeID: [obsData[i].webControlTypeID, Validators.required],
      //    parameterValue: [obsData[i].parameterValue, Validators.required],
      //    parameterValueComment: [obsData[i].parameterValueComment, Validators.required],
      //    createdBy: [obsData[i].createdBy],
      //    uom: [obsData[i].parameterValue],
      //    dynamicMeasurementParameterID: [obsData[i].dynamicMeasurementParameterID, Validators.required],
      //    webcontorlTypePossibleValues: [this.possibleList],
      //    regexExp: [this.regexExpression],
      //    regexMessage: [this.regexMessage],

      //  })
      //)
      //this.t.push(
      //  this.formBuilder.group({
      //    stageCode: [obsData[i].stageCode, Validators.required],
      //    webControlType: [obsData[i].webControlType, Validators.required],
      //    code: [obsData[i].code, Validators.required],
      //    controlName: [obsData[i].controlName, Validators.required],
      //    headName: [obsData[i].headName, Validators.required],
      //    webControlTypeID: [obsData[i].webControlTypeID, Validators.required],
      //    parameterValue: [obsData[i].parameterValue, Validators.required],
      //    parameterValueComment: [obsData[i].parameterValueComment, Validators.required],
      //    createdBy: [obsData[i].createdBy],
      //    uom: [obsData[i].parameterValue],
      //    dynamicMeasurementParameterID: [obsData[i].dynamicMeasurementParameterID, Validators.required],
      //    webcontorlTypePossibleValues: [this.possibleList],
      //    regexExp: [this.regexExpression],
      //    regexMessage: [this.regexMessage],
        

      //  })
      //);


      //this.form.Complications.push({
      //  stageCode: obsData[i].stageCode,
      //  webControlType: obsData[i].webControlType,
      //  code: obsData[i].code,
      //  controlName: obsData[i].controlName,
      //  headName: obsData[i].headName,
      //  webControlTypeID: obsData[i].webControlTypeID,
      //  parameterValue: obsData[i].parameterValue,
      //  parameterValueComment: obsData[i].parameterValueComment,
      //  createdBy: obsData[i].createdBy,
      //  createDateTimeServer: obsData[i].createDateTimeServer,
      //  uom: obsData[i].uom,
      //  dynamicMeasurementParameterID: obsData[i].dynamicMeasurementParameterID,
      //  webcontorlTypePossibleValues: this.possibleList,
      //  regexExp: this.regexExpression,
      //  regexMessage: this.regexMessage

      //});


    }

   // console.log(this.regForm1)
  }

  LoadObservationParams(baseView) {
    this.webcontrolService.GetDynamicWebcontrolParameter(baseView).subscribe(data => {

      if (data.data != null) {
        let obsData: any[] = data.data;
        //console.log(obsData)
        this.BindDynamicControls(obsData);
        // console.log(this.form.Complications)
      }
      else {
        //this.tempList = [];
      }

    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        //this.tempList = [];
      }

    );
  }

  SaveDynamicParam(baseView) {

    this.webcontrolService.AddDynamicMeasurementParameter(baseView).subscribe(data => {
      if (data.data != null) {
        let obsData: any[] = data.data;

        this.BindDynamicControls(obsData);
        // console.log(this.form.Complications)
      }
      else {
        //this.tempList = [];
      }

    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        //this.tempList = [];
      }

    );
  }
  AddMoreComplication() {

    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
    }).catch((result) => {
    });

    this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

      this.dynamicWebControlObj.PatientId = ServerChartValues.GetPatientId();
      this.dynamicWebControlObj.PartographId = ServerChartValues.GetPartpgraphId();
      this.dynamicWebControlObj.StageCode = this.stageModule;
      this.dynamicWebControlObj.Name = receivedEntry.HeadValue;
      this.dynamicWebControlObj.WebControlTypeID = Number(receivedEntry.SelectType);
      this.dynamicWebControlObj.ClientId = this.currentUser.ClientId;
      this.dynamicWebControlObj.UpdateDateTimeBrowser = new Date();
      this.dynamicWebControlObj.CreatedBy = this.currentUser.LoginId;
      this.dynamicWebControlObj.SourceSystemID = 1;
      this.dynamicWebControlObj.UOM = "";
      this.SaveDynamicParam(this.dynamicWebControlObj);

    });


  }

  public SaveObservation() {
    this.AddFormDynamicParameter = {
      AddDynamicParam: [],

    };

    //console.log(this.form.Complications);

    for (let i = 0; i < this.form.Complications.length; i++) {
      this.AddFormDynamicParameter.AddDynamicParam.push({
        DynamicMeasurementParameterID: this.form.Complications[i].dynamicMeasurementParameterID,
        ClientID: this.currentUser.ClientId,
        createdBy: this.currentUser.LoginId,
        CreateDateTimeBrowser: new Date(),
        ParameterValue: this.form.Complications[i].parameterValue,
        ParameterValueComment: this.form.Complications[i].parameterValueComment,
        PartographID: ServerChartValues.GetPartpgraphId(),
        PatientID: ServerChartValues.GetPatientId(),
        SourceSystemID: 1,
        StageCode: this.form.Complications[i].stageCode,
      });



    }


    this.webcontrolService.AddDynamicMeasurementParametersValues(this.AddFormDynamicParameter.AddDynamicParam).subscribe(data => {
      if (data.data != null) {
        let obsData: any[] = data.data;

        if (obsData != null) {
          this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);
          
        }
        else {
          this.toastr.success(GlobalConstants.FAILED_MESSAGE);
        }
        
      }
      else {
        //this.tempList = [];
      }

    },
      error => {
        this.toastr.success(GlobalConstants.FAILED_MESSAGE);
        // .... HANDLE ERROR HERE 
        console.log(error);
        //this.tempList = [];
      }

    );

    //console.log(this.AddFormDynamicParameter.AddDynamicParam)
  }

  onChangeItem(event, com) {
    const value = event.target.value;
    com.parameterValue = value;
    
  }

  onMaxlength(Complication, maxLength): boolean {


    
    let IsValid: boolean = true;
    if (Complication.get("parameterValueComment").value.length >= maxLength) {

      this.toastr.warning(GlobalConstants.MaxLength_MESSAGE)
      
    }

    return IsValid;

  }

  textBoxEvent(event, com) {
    const value = event.target.value;
    com.parameterValue = value;

    if (com.regexExp != null) {
      let regexp = new RegExp(com.regexExp);

      let serchfind = regexp.test(value);

      if (!serchfind) {
        com.parameterValue = "";
        this.toastr.warning(com.regexMessage);
      }
    }
    
    //console.log(this.form.Complications)
  }

}
