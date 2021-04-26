import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JsonApiService, AuthService, User } from '@app/core';
import { ChartValidationService } from '@app/modules/manage-partograph/services/chart-validation-rules.service';
import { ValidationRuleParameter } from '@app/modules/manage-partograph/modals/validation-rules.model';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { ChartInputService } from '../../../../modules/manage-partograph/services/chart.server.input.services';
import { BaseChartViewModel } from '../../../../core/models/basegraph.model';
import { ServerChartValues } from '../../../../modules/manage-partograph/modals/input-chart';
//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020


@Component({
  selector: 'app-tempproteinvolumeacetonchartpopup',
  templateUrl: './temp.protein.volume.aceton.chart.popup.component.html',
  styleUrls: ['./temp.protein.volume.aceton.chart.popup.component.css']
})
export class TempProteinVolumeAcetonChartPopupComponent implements OnInit {
  validationModel: ValidationRuleParameter;
  @Input() public modalData; currentUser: User;
  @Output() passProteinEntry: EventEmitter<any> = new EventEmitter();
  @Output() passAcetoneEntry: EventEmitter<any> = new EventEmitter();
  @Output() passVolumeEntry: EventEmitter<any> = new EventEmitter();
  UserRoutineDataForm: FormGroup;
  clientPath: string;
  clientValidation: string;
  baseGraphViewModel: BaseChartViewModel;
  minLengthValue: number = 1; maxLengthValue: number = 10;
  post: any; routineList: any = []; newRoutineData: any = [];
  @Output() postCreated = new EventEmitter<any>();
  CurrentTime: string; userName: string;
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
    this.CurrentTime = this.modalData.DisplayTime + " " + this.modalData.timeZone;

    if (this.modalData.modalpopupKey === 'partographChart.key_ProtienChart') {
      this.validationModel.ChartName = GlobalConstants.PROTEIN;
    }
    else if (this.modalData.modalpopupKey === 'partographChart.key_AcetoneChart') {
      this.validationModel.ChartName = GlobalConstants.ACETON;
    }
    else {
      this.validationModel.ChartName = GlobalConstants.VOlUME;
    }
  
    //console.log(this.modalData.ProteinModalData.DisplayTime)
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
    
    this.baseGraphViewModel.mode = this.validationModel.ChartName;

    this.chartservice.GetChartHistory(this.baseGraphViewModel).subscribe(data => {
      if (data.data != false) {
        this.newRoutineData = data.data;
        console.log("sas " + data.data);
        this.newRoutineData = this.newRoutineData.filter(u => u.description !== '');
        this.postCreated.emit(this.newRoutineData);
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

  passBack() {
  
    //if (this.UserRoutineDataForm.dirty && this.UserRoutineDataForm.valid) {
    //  this.passEntry.emit(this.UserRoutineDataForm.value);
    //  this.activeModal.close(this.UserRoutineDataForm.value);

    //}
   
    if (this.modalData.modalpopupKey.includes("partographChart.key_ProtienChart")) {
      //this.passProteinEntry.emit(this.modalData);
      //this.activeModal.close(this.modalData);
     
      this.passProteinEntry.emit(this.UserRoutineDataForm.value);
      this.activeModal.close(this.UserRoutineDataForm.value);
    }
    else if (this.modalData.modalpopupKey.includes("partographChart.key_AcetoneChart")) {

      this.passAcetoneEntry.emit(this.UserRoutineDataForm.value);
      this.activeModal.close(this.UserRoutineDataForm.value);

     // this.passAcetoneEntry.emit(this.modalData);
      //this.activeModal.close(this.modalData);
    }
    else {
    
      this.passVolumeEntry.emit(this.UserRoutineDataForm.value);
      this.activeModal.close(this.UserRoutineDataForm.value);


     // this.passVolumeEntry.emit(this.modalData);
      //this.activeModal.close(this.modalData);
    }
  }


  get f() {

    return this.UserRoutineDataForm.controls;
  }
  private buildForm(): void {

    this.UserRoutineDataForm = this.formBuilder.group(
      {
        selectList: ['', Validators.required],
        remarks: [this.modalData.remarks]
      }
    );
  }
}
