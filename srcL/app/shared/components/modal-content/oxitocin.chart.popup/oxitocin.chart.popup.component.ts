import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationRuleParameter } from '@app/modules/manage-partograph/modals/validation-rules.model';
import { ChartValidationService } from '@app/modules/manage-partograph/services/chart-validation-rules.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ValidationService } from '@app/shared/services';
import { ChartInputService } from '../../../../modules/manage-partograph/services/chart.server.input.services';
import { BaseChartViewModel } from '../../../../core/models/basegraph.model';
import { ServerChartValues } from '../../../../modules/manage-partograph/modals/input-chart';
//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020

@Component({
  selector: 'app-oxitocinchartpopup',
  templateUrl: './oxitocin.chart.popup.component.html',
  styleUrls: ['./oxitocin.chart.popup.component.css']
})
export class OxitocinChartPopupComponent implements OnInit {
  userName: string; validationModel: ValidationRuleParameter;
  @Input() public modalData; currentUser: User;
  minLengthValue: number = 1; maxLengthValue: number = 10;
  clientPath: string;
  clientValidation: string;
  baseGraphViewModel: BaseChartViewModel;
  UserEntryAreaForm: FormGroup; objValiation: any = [];
  @Output() passEntryOxytocin: EventEmitter<any> = new EventEmitter();
  @Output() passEntryDrops: EventEmitter<any> = new EventEmitter();
  post: any; oxcitList: any = []; dropList: any = []; newOutputPost: any = [];
  @Output() postCreated = new EventEmitter<any>();
  constructor(private chartservice: ChartInputService, private chartValidationService: ChartValidationService
    , private authenticationService: AuthService,
    private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {
    // Get user from session
    this.currentUser = this.authenticationService.currentUserValue;
    this.userName = this.currentUser.username;
    // this.HeartRateList = JSON.parse(localStorage.getItem('HeartRateData'));
    this.clientPath = this.currentUser.path;
    this.clientValidation = this.currentUser.validation;
    this.maxLengthValue = 200;
    this.validationModel = new ValidationRuleParameter();
    this.baseGraphViewModel = new BaseChartViewModel();



  }

  ngOnInit(): void {
    // set user name in input textbox
    //this.modalData.inputBy = this.userName;

    this.validationModel.StagesId = this.modalData.stageId;
   
    if (this.modalData.chartkeyName === 'partographChart.Key_OxytocinChart') {
      this.validationModel.ChartName = GlobalConstants.OXYTOCIN;
    }
    else {
      this.validationModel.ChartName = GlobalConstants.DROPS;
    }
   
    this.validationModel.ClientId = this.currentUser.ClientId;
   
    this.buildForm();
    this.GetValidationList();
    this.GetRecentCommentsHistory();
  }

  GetRecentCommentsHistory() {


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
    if (this.modalData.chartkeyName === 'partographChart.Key_OxytocinChart') {
      this.baseGraphViewModel.mode = GlobalConstants.OXYTOCIN;
    }
    else {
      this.baseGraphViewModel.mode = GlobalConstants.DROPS;
    }

    this.chartservice.GetChartHistory(this.baseGraphViewModel).subscribe(data => {
      if (data.data != false) {
        this.newOutputPost = data.data;
        console.log("sas " + data.data)
        this.newOutputPost = this.newOutputPost.filter(u => u.description !== '');
        this.postCreated.emit(this.newOutputPost);
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

  public GetValidationList() {

    this.chartValidationService.GetVlidationListClientWise(this.validationModel).subscribe(data => {
      this.objValiation = data.data

      if (this.objValiation != undefined || this.objValiation != null) {

        if (this.objValiation.length > 0) {

          for (let i = 0; i < this.objValiation.length; i++) {

            if (this.objValiation[i].modifiedMinValue != -1) {
              this.minLengthValue = this.objValiation[i].modifiedMinValue;
            }
            else if (this.objValiation[i].defaultMinValue != -1) {
              this.minLengthValue = this.objValiation[i].defaultMinValue;
            }

            if (this.objValiation[i].defaultMaxValue != -1) {
              this.maxLengthValue = this.objValiation[i].defaultMaxValue;
            }
            else if (this.objValiation[i].modifiedMaxValue != -1) {
              this.maxLengthValue = this.objValiation[i].modifiedMaxValue;
            }

            this.UserEntryAreaForm.controls["value"].setValidators([Validators.required, Validators.min(this.minLengthValue), Validators.max(this.maxLengthValue), ValidationService.Numeric]);
          }
        }
      }
      else {
        this.UserEntryAreaForm.controls["value"].setValidators([Validators.required, Validators.min(this.minLengthValue), Validators.max(this.maxLengthValue), ValidationService.Numeric]);
      }
    });
  }
  passBack() {

    if (this.UserEntryAreaForm.dirty && this.UserEntryAreaForm.valid) {
      if (this.modalData.chartkeyName === 'partographChart.Key_OxytocinChart') {
        this.passEntryOxytocin.emit(this.UserEntryAreaForm.value);
      }
      else {
        this.passEntryDrops.emit(this.UserEntryAreaForm.value);
      }
      this.activeModal.close(this.UserEntryAreaForm.value);
    }
       
  }

  // TFSID 16636 Rizwan Khan applied valiation 

  get f() {

    return this.UserEntryAreaForm.controls;
  }
  private buildForm(): void {

    this.UserEntryAreaForm = this.formBuilder.group(
      {
        currentTime: [{ value: this.modalData.currentTime, disabled: true }, Validators.required],
        value: ['', [Validators.required, ValidationService.Numeric]],
        inputBy: [{ value: this.userName, disabled: true }],
        remarks: [this.modalData.remarks, Validators.maxLength(255)]
      }
    );
  }


}
