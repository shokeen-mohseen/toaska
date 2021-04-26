import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '@app/core';
import { ValidationRuleParameter } from '@app/modules/manage-partograph/modals/validation-rules.model';
import { ChartValidationService } from '@app/modules/manage-partograph/services/chart-validation-rules.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '@app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { ChartInputService } from '../../../../modules/manage-partograph/services/chart.server.input.services';
import { BaseChartViewModel } from '../../../../core/models/basegraph.model';
import { ServerChartValues } from '../../../../modules/manage-partograph/modals/input-chart';
//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020

@Component({
  selector: 'app-pulsebpchartpopup',
  templateUrl: './pulsebp.chart.popup.component.html',
  styleUrls: ['./pulsebp.chart.popup.component.css']
})
export class PulsebpChartPopupComponent implements OnInit {
  userName: string; currentUser: User;
  UserPulseForm: FormGroup; UserBPForm: FormGroup;
  objValiation: any[];
  @Input() public modalData;
  post: any;
  pulseList: any = []
  bpList: any = [];
  clientPath: string;
  clientValidation: string;
  @Output() postCreated = new EventEmitter<any>();
  baseGraphViewModel: BaseChartViewModel;
  BPMinLengthValue: number = 60; BPMaxLengthValue: number = 180;
  pulseMinLengthValue: number = 60; pulseMaxLengthValue: number = 180;
  validationModel: ValidationRuleParameter;
  @Output() passBackBP: EventEmitter<any> = new EventEmitter();
  @Output() passBackPulse: EventEmitter<any> = new EventEmitter();
  constructor(private toastr: ToastrService, private chartservice: ChartInputService, private chartValidationService: ChartValidationService
    , private authenticationService: AuthService,
    private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {

    this.currentUser = this.authenticationService.currentUserValue;
    this.userName = this.currentUser.username;
    this.clientPath = this.currentUser.path;
    this.clientValidation = this.currentUser.validation;
    this.BPMinLengthValue = 60;
    this.BPMaxLengthValue = 180;
    this.validationModel = new ValidationRuleParameter();
    this.baseGraphViewModel = new BaseChartViewModel();
  }


  get f() {

    return this.UserPulseForm.controls;
  }

  get f1() {

    return this.UserBPForm.controls;
  }

  ngOnInit(): void {

    this.FormBuilderInitialization();

    this.validationModel.StagesId = this.modalData.stageId;
    this.validationModel.ChartName = GlobalConstants.BLOOD_PRESSURE;
    this.validationModel.ClientId = this.currentUser.ClientId;
    this.GetRecentCommentsHistory(GlobalConstants.BLOOD_PRESSURE);
    this.GetBPValidationList();

    this.validationModel.ChartName = GlobalConstants.PULSE;
    this.GetPulseValidationList();

    this.GetRecentCommentsHistory(GlobalConstants.PULSE);

  }

  GetRecentCommentsHistory(type: string) {


    this.baseGraphViewModel.StagesId = this.modalData.stageId;
    this.baseGraphViewModel.PatientId = ServerChartValues.GetPatientId();
    this.baseGraphViewModel.PartographId = ServerChartValues.GetPartpgraphId();
    this.baseGraphViewModel.ClientId = this.currentUser.ClientId;
    this.baseGraphViewModel.CreatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.UpdatedBy = this.currentUser.LoginId;
    this.baseGraphViewModel.SourceSystemID = 1;
    this.baseGraphViewModel.UpdateDateTimeBrowser = new Date();
    this.baseGraphViewModel.PageNo = 1;
    this.baseGraphViewModel.PageSize = 100;
    this.baseGraphViewModel.mode = type;

    this.chartservice.GetChartHistory(this.baseGraphViewModel).subscribe(data => {
      if (data.data != false) {
        console.log("sas " + data.data)
        if (type === GlobalConstants.PULSE) {
          this.pulseList = data.data.filter(u => u.description !== '');
          this.postCreated.emit(this.pulseList);
        } else {
          this.bpList = data.data.filter(u => u.description !== '');
          this.postCreated.emit(this.bpList);
        }
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

  public FormBuilderInitialization() {
    this.UserPulseForm = this.formBuilder.group(
      {
        value: ['', [Validators.required, ValidationService.Numeric]],
        remarks: [this.modalData.remarks, Validators.maxLength(255)]
      }
    );

    this.UserBPForm = this.formBuilder.group(
      {
        lowerbp: [null, [Validators.required, ValidationService.Numeric]],
        upperbp: [null, [Validators.required, ValidationService.Numeric]],
        remarks: [this.modalData.remarks, Validators.maxLength(255)]
      }
    );
  }


  public GetPulseValidationList() {

    this.chartValidationService.GetVlidationListClientWise(this.validationModel).subscribe(data => {
      this.objValiation = data.data

      if (this.objValiation != undefined || this.objValiation != null) {

        if (this.objValiation.length > 0) {

          for (let i = 0; i < this.objValiation.length; i++) {

            if (this.objValiation[i].modifiedMinValue != -1) {
              this.pulseMinLengthValue = this.objValiation[i].modifiedMinValue;
            }
            else if (this.objValiation[i].defaultMinValue != -1) {
              this.pulseMinLengthValue = this.objValiation[i].defaultMinValue;
            }

            if (this.objValiation[i].defaultMaxValue != -1) {
              this.pulseMaxLengthValue = this.objValiation[i].defaultMaxValue;
            }
            else if (this.objValiation[i].modifiedMaxValue != -1) {
              this.pulseMaxLengthValue = this.objValiation[i].modifiedMaxValue;
            }

            this.UserPulseForm.controls["value"].setValidators([Validators.required, Validators.min(this.pulseMinLengthValue), Validators.max(this.pulseMaxLengthValue), ValidationService.Numeric]);
          }
        }
      }
      else {
        this.UserPulseForm.controls["value"].setValidators([Validators.required, Validators.min(this.pulseMinLengthValue), Validators.max(this.pulseMaxLengthValue), ValidationService.Numeric]);
      }
    });
  }
  public GetBPValidationList() {

    this.chartValidationService.GetVlidationListClientWise(this.validationModel).subscribe(data => {
      this.objValiation = data.data

      if (this.objValiation != undefined || this.objValiation != null) {

        if (this.objValiation.length > 0) {

          for (let i = 0; i < this.objValiation.length; i++) {

            if (this.objValiation[i].modifiedMinValue != -1) {
              this.BPMinLengthValue = this.objValiation[i].modifiedMinValue;
            }
            else if (this.objValiation[i].defaultMinValue != -1) {
              this.BPMinLengthValue = this.objValiation[i].defaultMinValue;
            }

            if (this.objValiation[i].defaultMaxValue != -1) {
              this.BPMaxLengthValue = this.objValiation[i].defaultMaxValue;
            }
            else if (this.objValiation[i].modifiedMaxValue != -1) {
              this.BPMaxLengthValue = this.objValiation[i].modifiedMaxValue;
            }
            this.UserBPForm.controls["upperbp"].setValidators([Validators.required, Validators.min(this.BPMinLengthValue), Validators.max(this.BPMaxLengthValue), ValidationService.Numeric]);
            this.UserBPForm.controls["lowerbp"].setValidators([Validators.required, Validators.min(this.BPMinLengthValue), Validators.max(this.BPMaxLengthValue), ValidationService.Numeric]);
          }
        }
      }
      else {
        this.UserBPForm.controls["upperbp"].setValidators([Validators.required, Validators.min(this.BPMinLengthValue), Validators.max(this.BPMaxLengthValue), ValidationService.Numeric]);
        this.UserBPForm.controls["lowerbp"].setValidators([Validators.required, Validators.min(this.BPMinLengthValue), Validators.max(this.BPMaxLengthValue), ValidationService.Numeric]);
      }
    });
  }

  //passBackData(chartMode: string): void {

  //  if (chartMode === 'BP') {
  //    this.modalData.pulseData = null;
  //    this.passBackBP.emit(this.modalData.bpData);
  //  }
  //  else {
  //    this.modalData.bpData = null;
  //    this.passBackPulse.emit(this.modalData.pulseData);
  //  }
  //  this.activeModal.close(this.modalData.cervixModal);
  //}


  passBackUserPulseSave() {
    if (this.UserPulseForm.dirty && this.UserPulseForm.valid) {
      this.passBackPulse.emit(this.UserPulseForm.value);
      this.activeModal.close(this.UserPulseForm.value);
    }
  }

  passBackUserBPSave() {
    console.log(this.UserBPForm)
    if (this.UserBPForm.invalid) {
      return;
    }

    let lowerBP = this.UserBPForm.value.lowerbp;
    let upperBp = this.UserBPForm.value.upperbp;

    if (lowerBP != "" && upperBp != "") {
      if (Number(lowerBP) > Number(upperBp)) {
        this.toastr.warning(GlobalConstants.BLOODPRESSURE_COMPARE_MESSAGE);
        return;
      }
    }

    if (this.UserBPForm.dirty && this.UserBPForm.valid) {
      this.passBackBP.emit(this.UserBPForm.value);
      this.activeModal.close(this.UserBPForm.value);
    }
  }

}
