//TFSID 16565 Latent Phase: Temprature grid: Merge grid in Lamps 3.0
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User, AuthService, JsonApiService } from '@app/core';
import { ValidationService } from '@app/shared/services';
import { ChartValidationService } from '@app/modules/manage-partograph/services/chart-validation-rules.service';
import { ValidationRuleParameter } from '@app/modules/manage-partograph/modals/validation-rules.model';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { formatNumber } from '@angular/common';
import { ChartInputService } from '../../../../modules/manage-partograph/services/chart.server.input.services';
import { ServerChartValues } from '../../../../modules/manage-partograph/modals/input-chart';
import { BaseChartViewModel } from '../../../../core/models/basegraph.model';
//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020

@Component({
  selector: 'app-tempraturechartpopup',
  templateUrl: './temprature.chart.popup.component.html',
  styleUrls: ['./temprature.chart.popup.component.css']
})
export class TempratureChartPopupComponent implements OnInit {
  @Input() public modalData; validationModel: ValidationRuleParameter;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  post: any; temRateList: any = []; newtempData: any = [];
  UserTempratureForm: FormGroup;
  baseGraphViewModel: BaseChartViewModel;
  minLengthValue: number = 36; maxLengthValue: number = 41;
  @Output() postCreated = new EventEmitter<any>();
  //Celsius to Fahrenheit: (°C ×  95 ) + 32 = °F
  //Fahrenheit to Celsius: (°F − 32) ×  59 = °C


  currentUser: User; clientPath: string; clientValidation: string;
  objValiation: any = []; userName: string;
  constructor(private chartservice: ChartInputService, private chartValidationService: ChartValidationService
   , private authenticationService: AuthService,
    private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.userName = this.currentUser.username;
    this.validationModel = new ValidationRuleParameter();
    this.baseGraphViewModel = new BaseChartViewModel();

    this.minLengthValue = 36;
    this.maxLengthValue = 41;
  }

  ngOnInit(): void {

    this.validationModel.StagesId = this.modalData.stageId;
    this.validationModel.ChartName = GlobalConstants.TEMPERATURE;
    this.validationModel.ClientId = this.currentUser.ClientId;

    this.modalData.tempName = "°C";

    this.buildForm();

   // this.UserTempratureForm.controls["value"].setValidators([Validators.min(this.minLengthValue), Validators.max(this.maxLengthValue), ValidationService.Numeric]);
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
    this.baseGraphViewModel.mode = GlobalConstants.TEMPERATURE;

    this.chartservice.GetChartHistory(this.baseGraphViewModel).subscribe(data => {
      if (data.data != false) {
        this.newtempData = data.data;
        console.log("sas " + data.data)
        this.newtempData = this.newtempData.filter(u => u.description !== '');
        this.postCreated.emit(this.newtempData);
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
    if (this.UserTempratureForm.dirty && this.UserTempratureForm.valid) {
      this.passEntry.emit(this.UserTempratureForm.value);
      this.activeModal.close(this.UserTempratureForm.value);

    } 
    //console.log(this.modalData)
    //this.passEntry.emit(this.modalData);
    //this.activeModal.close(this.modalData);
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

            this.UserTempratureForm.controls["value"].setValidators([Validators.required,Validators.min(this.minLengthValue), Validators.max(this.maxLengthValue), ValidationService.Numeric]);
          }
        }
      }
      else {
        this.UserTempratureForm.controls["value"].setValidators([Validators.required, Validators.min(this.minLengthValue), Validators.max(this.maxLengthValue), ValidationService.Numeric]);
      }
    });


    //this.jsonService.GetProjectConfigurationList(this.clientPath, this.clientValidation).subscribe(data => {
    //  this.objValiation = data
    //  if (this.objValiation != undefined) {
    //    this.UserTempratureForm.controls["yAxisPosition"].setValidators([Validators.min(this.objValiation.FetalHeartChart.yAxisPosition.minValue != undefined ? this.objValiation.FetalHeartChart.yAxisPosition.minValue : 80), Validators.max(this.objValiation.FetalHeartChart.yAxisPosition.maxValue != undefined ? this.objValiation.FetalHeartChart.yAxisPosition.maxValue : 80), ValidationService.Numeric]);
    //    this.UserTempratureForm.controls["inputBy"].setValidators([Validators.maxLength(this.objValiation.FetalHeartChart.inputBy.maxLength != undefined ? this.objValiation.FetalHeartChart.inputBy.maxLength : 50), Validators.required]);
    //    this.UserTempratureForm.controls["remarks"].setValidators([Validators.maxLength(this.objValiation.FetalHeartChart.remarks.maxLength != undefined ? this.objValiation.FetalHeartChart.remarks.maxLength : 255)]);
    //  }
    //});

  }

  get f() {

    return this.UserTempratureForm.controls;
  }

  // TFSID 16645, RIZWAN KHAN, 28 July 2020,Applied reative form and make it dynamic control 

  private buildForm(): void {

    this.UserTempratureForm = this.formBuilder.group(
      {
        value: ['', [Validators.required, ValidationService.Numeric]],
        remarks: [this.modalData.remarks, [Validators.maxLength(255)]],
        TemperatureType: [this.modalData.tempName, Validators.required]
      }
    );
  }

  TempValue(event) {
    let tmpValue:any = event.target.value;

    let tempMinValue = this.minLengthValue;
    let tempMaxValue = this.maxLengthValue;
    // console.log(this.modalData.tempName);
    if (tmpValue != "") {

     if (this.modalData.tempName == "°C") {

       tempMinValue = this.minLengthValue;
       tempMaxValue = this.maxLengthValue;
       this.UserTempratureForm.controls["value"].setValidators([Validators.required, Validators.min(tempMinValue), Validators.max(tempMaxValue), ValidationService.Numeric]);
                         // (°F − 32) / 1.8 = °C
      }
     else {

       //tempMinValue = (this.minLengthValue * 1.8) + 32;

       //tempMaxValue = (this.maxLengthValue * 1.8) + 32;
       let tempMinValue1 = (((this.minLengthValue * 1.8) + 32).toFixed())//.toString();

       let tempMaxValue1 = (((this.maxLengthValue * 1.8) + 32).toFixed()) 

       this.UserTempratureForm.controls["value"].setValidators([Validators.required, Validators.min(Number(tempMinValue1)), Validators.max(Number(tempMaxValue1)), ValidationService.Numeric]);
      }

      
    }
  }

  changeTemp(tv, value) {
    
    this.modalData.tempName = tv;
    let tpValue = this.UserTempratureForm.get("value").value;
    this.UserTempratureForm.get("value").setValue('');

    let tempMinValue: number = this.minLengthValue;
    let tempMaxValue: number = this.maxLengthValue;
   
    let temperatureValue = 0;
   // console.log(this.modalData.tempName);
    if (this.modalData.tempName == "°C") {

      tempMinValue = this.minLengthValue;
      tempMaxValue = this.maxLengthValue;
      this.UserTempratureForm.markAsPristine();
      this.UserTempratureForm.markAsUntouched();
      this.UserTempratureForm.controls["value"].setValidators([Validators.required, Validators.min(tempMinValue), Validators.max(tempMaxValue), ValidationService.Numeric]);
      this.UserTempratureForm.get("value").setValue(tpValue);
      this.UserTempratureForm.get("value").markAllAsTouched();
      this.UserTempratureForm.get("value").markAsPristine();
    }
    else {

      let tempMinValue1 = (((this.minLengthValue * 1.8) + 32).toFixed())//.toString();

      let tempMaxValue1 = (((this.maxLengthValue * 1.8) + 32).toFixed()) //(this.maxLengthValue * 1.8) + 32; //(this.maxLengthValue * 1.8) + 32;
      this.UserTempratureForm.markAsPristine();
      this.UserTempratureForm.markAsUntouched();
      this.UserTempratureForm.controls["value"].setValidators([Validators.required, Validators.min(Number(tempMinValue1)), Validators.max(Number(tempMaxValue1)), ValidationService.Numeric]);
      this.UserTempratureForm.get("value").setValue(tpValue);
      this.UserTempratureForm.get("value").markAllAsTouched();
      this.UserTempratureForm.get("value").markAsPristine();
     
       
    }

    
  }
}
