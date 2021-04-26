import { Component, OnInit } from '@angular/core';
import { ChartInputService } from '@app/modules/manage-partograph/services/chart.server.input.services';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';
import { ServerChartValues } from '@app/modules/manage-partograph/modals/input-chart';
import { AuthService, User } from '@app/core';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';

@Component({
  selector: 'app-chart-history-active-phase',
  templateUrl: './chart-history-active-phase.component.html',
  styleUrls: ['./chart-history-active-phase.component.css']
})
export class ChartHistoryActivePhaseComponent implements OnInit {
  tempList: any = []; baseGraphViewModel: BaseChartViewModel;
  currentUser: User;
  chartMode: string;
  chartModeMap = {
    'FH': 'FetalHeartRate',
    'AM': 'AmnioticFluid',
    'MD': 'Moulding',
    'CR': 'Cervix',
    'DS': 'DecentofHead',
    'OX': 'OxytocinUL',
    'DM': 'DropsMin',
    'PT': 'Protein',
    'VL': 'Volume',
    'AC': 'Aceton',
    'TP': 'Temperature',
    'PL': 'Pulse',
    'BP': 'BP',
    'CN': 'ContractionsPer10Min'
  };
  constructor(private authenticationService: AuthService, private chartservice: ChartInputService, ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.baseGraphViewModel = new BaseChartViewModel();
    this.baseGraphViewModel.StagesId = 2;
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
    this.LoadChartHistory(this.baseGraphViewModel);
  }

  ngOnInit(): void {
    this.tempList = [];

    this.chartservice.newChartEntry$.subscribe(chartType => {
      if (chartType === this.chartModeMap[this.chartMode]) {
        this.OnChartHistoryData(this.chartMode);
      }
    });
  }


  OnChartHistoryData(chartMode: string) {
    this.chartMode = chartMode;
    this.tempList = [];
    switch (chartMode) {
      case 'FH': { // This is Fetal Heart Rate Get API 1
        this.baseGraphViewModel.mode = GlobalConstants.FETAL_HEART_RATE;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'AM': { // This is Amniotic Get API   2
        this.baseGraphViewModel.mode = GlobalConstants.AMNIOTIC;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'MD': {  // This is Moulding Get API 3
        this.baseGraphViewModel.mode = GlobalConstants.MOULDING;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'CR': {  // This is cervix Get API 4
        this.baseGraphViewModel.mode = GlobalConstants.CERVIX;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'DS': {  // This is DescentofHead Get API 5
        this.baseGraphViewModel.mode = GlobalConstants.DESCENT_OF_HEAD;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'OX': {  // This is DescentofHead Get API 6
        this.baseGraphViewModel.mode = GlobalConstants.OXYTOCIN;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'DM': {  // This is DropPerMin Get API 7
        this.baseGraphViewModel.mode = GlobalConstants.DROPS;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'PT': {  // This is Protien Get API 8
        this.baseGraphViewModel.mode = GlobalConstants.PROTEIN;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'VL': {  // This is Volume Get API 9
        this.baseGraphViewModel.mode = GlobalConstants.VOlUME;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'AC': {  // This is Aceton Get API 10
        this.baseGraphViewModel.mode = GlobalConstants.ACETON;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'TP': {  // This is Temperature Get API 11
        this.baseGraphViewModel.mode = GlobalConstants.TEMPERATURE;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }
      case 'PL': {  // This is Pulse Get API 12
        this.baseGraphViewModel.mode = GlobalConstants.PULSE;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }

      case 'BP': { // This is Blood Pressure Get API 13
        this.baseGraphViewModel.mode = GlobalConstants.BLOOD_PRESSURE;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }

      case 'CN': { // This is Blood Pressure Get API 13
        this.baseGraphViewModel.mode = GlobalConstants.CONTRACTION_PER_10MINS;
        this.LoadChartHistory(this.baseGraphViewModel);
        break;
      }

      default: {
        //statements; 
        break;
      }

    }


  }
  // TFSID 17135, Rizwan Khan, 22 Aug 2020, Implement ContractIon API



  // HistoryAPI
  LoadChartHistory(baseView) {
    this.chartservice.GetChartHistory(baseView).subscribe(data => {
      if (data.data != false) {
        this.tempList = data.data;
        this.tempList.reverse();
        console.log(this.tempList)
      }
      else {
        this.tempList = [];
      }

    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        this.tempList = [];
      }

    );
  }

  // Fetal Heart API


}

