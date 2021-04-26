import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerChartCommonComment, ServerChartValues } from '../modals/input-chart';
import { map, tap  } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, Subject } from 'rxjs';
import { environment as env } from '@env/environment';
import { BaseChartViewModel } from '@app/core/models/basegraph.model';

const BASE_URL = env.coreBaseApiUrl;
@Injectable({
  providedIn: 'root'
})
export class ChartInputService {
  private httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
 // private baseUrl = 'http://localhost:9001/'

  private currentCahrtEntryType: string;
  private chartEntry$: Subject<string> = new Subject();

  get newChartEntry$(): Observable<string> {
    return this.chartEntry$.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  // TFSID 17135, Rizwan Khan , 18 Aug 2020, Implement  for Chart Plotting and repoting

  // Save Pulse Data on Server
  PulseChartServer(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'Pulse');
  }

   // Save BP Data on Server
  SaveBloodPressure(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'BP');
  }

  // Save Fetal Heart Rate
  SaveFetalHeartRate(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'FetalHeartRate');
  }

  // Save Fetal Heart Rate Comment
  SaveGraphCommonComment(inputChartServer: ServerChartCommonComment) {
    return this.saveChartValue(inputChartServer as any, 'GraphCommonComment');
  }


  // Save Cervix
  SaveCervix(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'Cervix');
  }

  // Save Descent
  SaveDescentofHead(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'DecentofHead');
  }

  // Save Descent
  SaveCaput(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'Caput');
  }

  // Save AmnioticFluid
  SaveAmnioticFluid(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'AmnioticFluid');
  }

  // Save Moulding
  SaveMoulding(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'Moulding');
  }


  // Save OxytocinUL
  SaveOxytocinUL(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'OxytocinUL');
  }

  // Save DropPerMin
  SaveDropsMin(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'DropsMin');
  }

  // Save  Contractions
  SaveContractions(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'ContractionsPer10Min');
  }


  // Save Fetal Heart Rate
  SaveTemperature(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'Temperature');
  }


  // Save Protein
  SaveProtein(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'Protein');
  }


  // Save Aceton
  SaveAceton(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'Aceton');
  }

  // Save Aceton
  SaveVolume(inputChartServer: ServerChartValues) {
    return this.saveChartValue(inputChartServer, 'Volume');
  }

  // comon save for all charts
  saveChartValue(value: ServerChartValues, type: string) {
    if (type !== 'GraphCommonComment') {
      this.currentCahrtEntryType = type;
    }
    return this.http.post<any>(BASE_URL + '/' + type, value)
      .pipe(
        tap(chartvalues => {
          if (type === 'GraphCommonComment') {
            this.chartEntry$.next(this.currentCahrtEntryType);
          }
        })
      );
  }

  // Start Get  Data from Server

  GetTemperatureData(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL +'/Temperature/List', {
      "PageNo": 1,
      "PageSize": 100
    }, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  //Get FetalHeart
  GetFetalHeartRateAnalytics(baseGraphViewModel: BaseChartViewModel) {

    return this.http.post<any>(BASE_URL + '/FetalHeartRate/List', baseGraphViewModel , this.httpOptions)
      .pipe(map(chartvalues => {
        console.log(chartvalues)
        return chartvalues;
      }));

  }
  // Get AmnioticFluid
  GetAmnioticFluidAnalytics(baseview: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/AmnioticFluid/List',  baseview, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Moulding
  GetMouldingAnalytics(baseview: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/Moulding/List', baseview, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Cervix
  GetCervixAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/Cervix/List', baseView , this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }


  // Get DecentofHead
  GetDecentofHeadAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/DecentofHead/List', baseView , this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }
  //TFSID 17135, Rizwan Khan, 22 Aug 2020, Implement ContractIon
  // Get Contraction
  GetContractionAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/ContractionsPer10Min/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  //TFSID 17135, Rizwan Khan, 22 Aug 2020, Implement ContractIon
  // Get Contraction
  GetCaputAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/Caput/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Oxitocin
  GetOxytocinULAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/OxytocinUL/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Drops
  GetDropsAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/DropsMin/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Blood Pressure
  GetBPAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/BP/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Pulse Data from Server
  GetPulseData(baseView: BaseChartViewModel) {

    return this.http.post<any>(BASE_URL + '/Pulse/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));
    //return this.http.post<any>(`${this.baseUrl}/BP/List`);
  }

  // Get Protein
  GetProteinAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/Protein/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Aceton
  GetAcetonAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/Aceton/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Temperature
  GetTemperatureAnalytics(baseModal: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/Temperature/List', baseModal, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }

  // Get Aceton Pressure
  GetVolumeAnalytics(baseView: BaseChartViewModel) {
    return this.http.post<any>(BASE_URL + '/Volume/List', baseView, this.httpOptions)
      .pipe(map(chartvalues => {
        return chartvalues;
      }));

  }



  // chart History API

  GetChartHistory(baseGraphViewModel: BaseChartViewModel) {

    return this.http.post<any>(BASE_URL + '/PartographHistory/List', baseGraphViewModel, this.httpOptions)
      .pipe(map(chartvalues => {
        console.log(chartvalues)
        return chartvalues;
      }));

  }


  // END


  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
