//TFSID 16635 add validation on chart
//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16635
//Logic Description: Fetal Heart Popup

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '@app/core';
import { ChartValidationService } from '@app/modules/manage-partograph/services/chart-validation-rules.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ValidationRuleParameter } from '@app/modules/manage-partograph/modals/validation-rules.model';
import { ValidationService } from '@app/shared/services';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { ServerChartValues } from '@app/modules/manage-partograph/modals/input-chart';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css']
})

export class ModalContentComponent implements OnInit {
  @Input() public modalData; validationModel: ValidationRuleParameter;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  minLengthValue: number = 80; maxLengthValue: number = 200;
  UserHeartRateForm: FormGroup;
  userName: string; baseGraphViewModel: BaseChartViewModel;
  clientPath: string;
  clientValidation: string;
  objValiation: any = []; currentUser: User;
  post: any; HeartRateList: any = []; newHearRate: any = [];
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
   
    this.validationModel.StagesId = this.modalData.stageId;
    this.validationModel.ChartName = GlobalConstants.FETAL_HEART_RATE;
    this.validationModel.ClientId = this.currentUser.ClientId;

    //this.post = this.HeartRateList;
    //if (this.HeartRateList != undefined) {
    //  for (var i = 0; i < this.HeartRateList.length; i++) {
    //    //console.log(this.HeartRateList[i].comment)
    //    if (this.HeartRateList[i].comment != '') {

    //      this.newHearRate.push(this.HeartRateList[i]);
    //    }
    //  }
    //}
   
    //this.postCreated.emit(this.newHearRate);
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
    this.baseGraphViewModel.mode = GlobalConstants.FETAL_HEART_RATE;

    this.chartservice.GetChartHistory(this.baseGraphViewModel).subscribe(data => {
      if (data.data != false) {
        this.newHearRate = data.data;
        console.log("sas " + data.data)
        this.newHearRate = this.newHearRate.filter(u => u.description !== '');
        this.postCreated.emit(this.newHearRate);
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

   // TFSID 16755 RIZWAN KHAN 13 july 2020 Get client specific validation service from JSON temp file.
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
           
            this.UserHeartRateForm.controls["yAxisPosition"].setValidators([Validators.required, Validators.min(this.minLengthValue), Validators.max(this.maxLengthValue), ValidationService.Numeric]);


          }
        }
      }
      else {
        this.UserHeartRateForm.controls["yAxisPosition"].setValidators([Validators.required, Validators.min(this.minLengthValue), Validators.max(this.maxLengthValue), ValidationService.Numeric]);
      }
    });

        //this.UserHeartRateForm.controls["yAxisPosition"].
        //  setValidators([Validators.min(

        //    this.objValiation.FetalHeartChart.yAxisPosition.minValue != undefined ?
        //    this.objValiation.FetalHeartChart.yAxisPosition.minValue : 80),
        //    Validators.max(this.objValiation.FetalHeartChart.yAxisPosition.maxValue
        //      != undefined ? this.objValiation.FetalHeartChart.yAxisPosition.maxValue : 80),
        //    ValidationService.Numeric]);
        //this.UserHeartRateForm.controls["remarks"].setValidators([Validators.maxLength(this.objValiation.FetalHeartChart.remarks.maxLength != undefined ? this.objValiation.FetalHeartChart.remarks.maxLength : 255)]);
      }

    //this.jsonService.GetProjectConfigurationList(this.clientPath, this.clientValidation).subscribe(data => {
    //  this.objValiation = data
     
    //  if (this.objValiation != undefined) {
    //    this.UserHeartRateForm.controls["yAxisPosition"].setValidators([Validators.min(this.objValiation.FetalHeartChart.yAxisPosition.minValue != undefined ? this.objValiation.FetalHeartChart.yAxisPosition.minValue : 80), Validators.max(this.objValiation.FetalHeartChart.yAxisPosition.maxValue != undefined ? this.objValiation.FetalHeartChart.yAxisPosition.maxValue : 80),  ValidationService.Numeric]);
    //    this.UserHeartRateForm.controls["remarks"].setValidators([Validators.maxLength(this.objValiation.FetalHeartChart.remarks.maxLength != undefined ? this.objValiation.FetalHeartChart.remarks.maxLength : 255)]);
    //  }
    //});
    
  //}
  passBack() {
    if (this.UserHeartRateForm.dirty && this.UserHeartRateForm.valid) {
      this.passEntry.emit(this.UserHeartRateForm.value);
     this.activeModal.close(this.UserHeartRateForm.value);

    }

  }

  //TFSID 16635 add validation on chart
  //Developer Name: Rizwan Khan
  //Date: June 6, 2020
  //TFS ID: 16635
  //Logic Description: Add validation on form by using the form Builder class reactivemodule

  get f() {
    
    return this.UserHeartRateForm.controls;
  }

  // remove extra code which are not working now after redesign on html side

  private buildForm(): void {
    
    this.UserHeartRateForm = this.formBuilder.group(
      {
        yAxisPosition: ['', [Validators.required, ValidationService.Numeric]],
        remarks: [this.modalData.remarks]
      }
    );
  }
 
  
  //TFS ID: 16635
}


