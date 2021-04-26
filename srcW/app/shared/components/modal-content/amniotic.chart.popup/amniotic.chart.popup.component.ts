// TFSID 16003 Latent Phase: Amniotic Fluid Chart: Merge chart in Lamps 3.0
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartInputService } from '../../../../modules/manage-partograph/services/chart.server.input.services';
import { ChartValidationService } from '../../../../modules/manage-partograph/services/chart-validation-rules.service';
import { ValidationRuleParameter } from '../../../../modules/manage-partograph/modals/validation-rules.model';
import { BaseChartViewModel } from '../../../../core/models/basegraph.model';
import { ServerChartValues } from '../../../../modules/manage-partograph/modals/input-chart';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020
@Component({
  selector: 'app-amnioticchartpopup',
  templateUrl: './amniotic.chart.popup.component.html',
  styleUrls: ['./amniotic.chart.popup.component.css']
})
export class AmnioticChartPopupComponent implements OnInit {
  
  @Input() public modalData; validationModel: ValidationRuleParameter;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
 
  UserAmnioticMouldingForm: FormGroup;
  userName: string; baseGraphViewModel: BaseChartViewModel;
  clientPath: string;
  clientValidation: string;
  objValiation: any = []; currentUser: User;
  minLengthValue: number = 80; maxLengthValue: number = 200;
  post: any; amnioticList: any = []; mouldingList: any = []; newOutputPost: any = [];
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
    this.validationModel.ChartName = GlobalConstants.AMNIOTIC;
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
    this.baseGraphViewModel.mode = GlobalConstants.AMNIOTIC;

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
    return this.UserAmnioticMouldingForm.controls;
  }

  // Remove Extra code not uses 
  private buildForm(): void {

    this.UserAmnioticMouldingForm = this.formBuilder.group(
      {
        selectValue: ['', Validators.required],
        remarks: [this.modalData.remarks]
      }
    );
  }

  // TFSID 16636 Rizwan Khan, 16 July 2020 , plotting on chart is done

  passBack() {
 
    if (this.UserAmnioticMouldingForm.dirty && this.UserAmnioticMouldingForm.valid) {
      this.passEntry.emit(this.UserAmnioticMouldingForm.value);
      this.activeModal.close(this.UserAmnioticMouldingForm.value);
    }
      
  }

  AmnioticFilter(amId) {
    this.modalData.amId = amId;
  }

}
