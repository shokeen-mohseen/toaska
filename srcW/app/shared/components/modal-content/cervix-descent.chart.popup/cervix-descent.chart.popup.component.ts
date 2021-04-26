import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '@app/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ValidationRuleParameter } from '@app/modules/manage-partograph/modals/validation-rules.model';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ChartValidationService } from '@app/modules/manage-partograph/services/chart-validation-rules.service';
import { ValidationService } from '@app/shared/services';
import { ChartInputService } from '../../../../modules/manage-partograph/services/chart.server.input.services';
import { BaseChartViewModel } from '../../../../core/models/basegraph.model';
import { ServerChartValues } from '../../../../modules/manage-partograph/modals/input-chart';

//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020
@Component({
  selector: 'app-cervix-descent.chart.popup',
  templateUrl: './cervix-descent.chart.popup.component.html',
  styleUrls: ['./cervix-descent.chart.popup.component.css']
})
export class CervixDescentModalPopUpComponent implements OnInit {
  userName: string; IsDisplay: boolean = true; IsDisplayAll: boolean = true; IsDisplayU: boolean = true;
  clientPath: string;
  clientValidation: string;
  minLengthValue: number = 80; maxLengthValue: number = 200;
  baseGraphViewModel: BaseChartViewModel;
  @Input() public modalData; validationModel: ValidationRuleParameter; objValiation: any[];
  minLengthCervixValue: number; maxLengthCervixValue: number;
  minLengthDescentValue: number; maxLengthDescentValue: number;
  post: any;
  cervixList: any = []
  decentList: any = [];
  UserCervixForm: FormGroup; UserDescentForm: FormGroup; currentUser: User;
  @Output() passBackCervix: EventEmitter<any> = new EventEmitter();
  @Output() passBackDescent: EventEmitter<any> = new EventEmitter();
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

  // TFSID 16637 Rizwan Khan, 28 July 2020 , make it reactive and applied


  ngOnInit(): void {
    this.buildForm();

    this.validationModel.StagesId = this.modalData.stageId;
    this.validationModel.ClientId = this.currentUser.ClientId;
    if (this.modalData.stageId == 1 || this.modalData.stageId == 2) {
      this.validationModel.ChartName = GlobalConstants.CERVIX;
      this.GetCervixValidationList();
      this.GetRecentCommentsHistory(GlobalConstants.CERVIX);
    }

    this.validationModel.ChartName = GlobalConstants.DESCENT_OF_HEAD;
    this.GetDescentValidationList();

    this.GetRecentCommentsHistory(GlobalConstants.DESCENT_OF_HEAD);

  }

  get f() {

    return this.UserCervixForm.controls;
  }

  get f1() {

    return this.UserDescentForm.controls;
  }


  public GetCervixValidationList() {

    this.chartValidationService.GetVlidationListClientWise(this.validationModel).subscribe(data => {
      this.objValiation = data.data

      if (this.objValiation != undefined || this.objValiation != null) {

        if (this.objValiation.length > 0) {

          for (let i = 0; i < this.objValiation.length; i++) {

            if (this.objValiation[i].modifiedMinValue != -1) {
              this.minLengthCervixValue = this.objValiation[i].modifiedMinValue;
            }
            else if (this.objValiation[i].defaultMinValue != -1) {
              this.minLengthCervixValue = this.objValiation[i].defaultMinValue;
            }

            if (this.objValiation[i].defaultMaxValue != -1) {
              this.maxLengthCervixValue = this.objValiation[i].defaultMaxValue;
            }
            else if (this.objValiation[i].modifiedMaxValue != -1) {
              this.maxLengthCervixValue = this.objValiation[i].modifiedMaxValue;
            }

            this.UserCervixForm.controls["yAxisPosition"].setValidators([Validators.required, Validators.min(this.minLengthCervixValue), Validators.max(this.maxLengthCervixValue), ValidationService.Numeric]);
          }
        }
      }
      else {
        this.UserCervixForm.controls["yAxisPosition"].setValidators([Validators.required, Validators.min(this.minLengthCervixValue), Validators.max(this.maxLengthCervixValue), ValidationService.Numeric]);
      }
    });
  }
  public GetDescentValidationList() {

    this.chartValidationService.GetVlidationListClientWise(this.validationModel).subscribe(data => {
      this.objValiation = data.data

      if (this.objValiation != undefined || this.objValiation != null) {

        if (this.objValiation.length > 0) {

          for (let i = 0; i < this.objValiation.length; i++) {

            if (this.objValiation[i].modifiedMinValue != -1) {
              this.minLengthDescentValue = this.objValiation[i].modifiedMinValue;
            }
            else if (this.objValiation[i].defaultMinValue != -1) {
              this.minLengthDescentValue = this.objValiation[i].defaultMinValue;
            }

            if (this.objValiation[i].defaultMaxValue != -1) {
              this.maxLengthDescentValue = this.objValiation[i].defaultMaxValue;
            }
            else if (this.objValiation[i].modifiedMaxValue != -1) {
              this.maxLengthDescentValue = this.objValiation[i].modifiedMaxValue;
            }

            this.UserDescentForm.controls["yAxisPosition1"].setValidators([Validators.required, Validators.min(this.minLengthDescentValue), Validators.max(this.maxLengthDescentValue), ValidationService.Numeric]);
          }
        }
      }
      else {
        this.UserDescentForm.controls["yAxisPosition1"].setValidators([Validators.required, Validators.min(this.minLengthDescentValue), Validators.max(this.maxLengthDescentValue), ValidationService.Numeric]);
      }
    });
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
        if (type === GlobalConstants.CERVIX) {
          this.cervixList = data.data.filter(u => u.description !== '');
        this.postCreated.emit(this.cervixList);
        } else {
          this.decentList = data.data.filter(u => u.description !== '');
          this.postCreated.emit(this.decentList);
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
  private buildForm(): void {

    //this.UserCervixForm = new FormGroup({
    //  yAxisPosition: new FormControl('', [Validators.required]),
    //  remarks: new FormControl(this.modalData.remarks, [Validators.required])
    //});

    //this.UserDescentForm = new FormGroup({
    //  yAxisPosition1: new FormControl('', [Validators.required]),
    //  remarks: new FormControl(this.modalData.remarks, [Validators.required])
    //});

    this.UserCervixForm = this.formBuilder.group(
      {
        yAxisPosition: ['', [Validators.required, ValidationService.Numeric]],
        remarks: [this.modalData.remarks]
      }
    );

    this.UserDescentForm = this.formBuilder.group(
      {
        yAxisPosition1: ['', [Validators.required, ValidationService.Numeric]],
        remarks: [this.modalData.remarks]
      }
    );
    
    if (this.modalData.descentModal.inputBy == "N") {
      this.IsDisplay = true;
      this.IsDisplayAll = false;
      this.IsDisplayU = false;
      
    }
    else {
      this.IsDisplay = false;
      this.IsDisplayAll = true;
      this.IsDisplayU = true;
    }
    
  }

  

  // TFSID 16638, RIZWAN KHAN, 28 July 2020, making form as reative base 

  passBackCervixSave() {
    if (this.UserCervixForm.dirty && this.UserCervixForm.valid) {
      this.passBackCervix.emit(this.UserCervixForm.value);
      this.activeModal.close(this.UserCervixForm.value);
    }
  }

  passBackDescentSave() {
    if (this.UserDescentForm.dirty && this.UserDescentForm.valid) {
      this.passBackDescent.emit(this.UserDescentForm.value);
      this.activeModal.close(this.UserDescentForm.value);
    }
  }

}
