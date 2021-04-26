// TFSID 16474 Latent Phase: Contraction Chart: Merge chart in Lamps 3.0
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '@app/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ChartInputService } from '../../../../modules/manage-partograph/services/chart.server.input.services';
import { ChartValidationService } from '../../../../modules/manage-partograph/services/chart-validation-rules.service';
import { ValidationRuleParameter } from '../../../../modules/manage-partograph/modals/validation-rules.model';
import { BaseChartViewModel } from '../../../../core/models/basegraph.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { ServerChartValues } from '../../../../modules/manage-partograph/modals/input-chart';

//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020
@Component({
  selector: 'app-contractionModalPopUp',
  templateUrl: './contraction.chart.popup.component.html',
  styleUrls: ['./contraction.chart.popup.component.css']
})
export class ContractionModalPopUpComponent implements OnInit {
  @Input() public modalData; UserForm: FormGroup; validationModel: ValidationRuleParameter;
  userName: string;
  currentUser: User;
  clientPath: string;
  baseGraphViewModel: BaseChartViewModel;
  clientValidation: string;
  minLengthValue: number = 80; maxLengthValue: number = 200;
  post: any; contractionList: any = []; newOutputPost: any = [];
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
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
    this.validationModel.ChartName = GlobalConstants.CONTRACTION_PER_10MINS;
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
    this.baseGraphViewModel.mode = GlobalConstants.CONTRACTION_PER_10MINS;

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

  get f() {
    return this.UserForm.controls;
  }

  // Remove Extra code not uses 
  private buildForm(): void {

    this.UserForm = this.formBuilder.group(
      {
        selectFrequency: ['', [Validators.required]],
        selectYValue: ['', [Validators.required]],
        remarks: [this.modalData.remarks]
      }
    );
  }

  passBack() {
    this.passEntry.emit({ ...this.modalData, ...this.UserForm.value });
    this.activeModal.close(this.modalData);
  }

  FrequencyFilter(fid) {
    this.modalData.fId = fid;

  }

  ChooseFrequencyValue(fv) {
    this.modalData.ftListId = fv;

  }

}
