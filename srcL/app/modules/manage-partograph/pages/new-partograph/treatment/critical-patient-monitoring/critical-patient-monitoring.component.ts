import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PatientInformationService } from '../../../../services/patient-informaation.services';
import { PartographPatientSetup, criticalPatientInfo } from '../../../../modals/patient-information';
import { AddComplicationsComponent } from '../../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { GlobalConstants } from '../../../../../../core/models/GlobalConstants ';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  Date: string;
  Time: string;
  Temp: string;
  pr: string;
  bp: string;
  rr: string;
  spo2: string;
  AbdominalGirth: string;
  PerAbdominalExam: string;
  LocalExamination: string;
  UrinaryOutput: string;
  Drain: string;
  KneeReflex: string;
  RyleTube: string;
  Remark: string;
  Action: string;
  Add_New: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Date: '', Time: '', Temp: '', pr: '', bp: '', rr: '', spo2: '', AbdominalGirth: '', PerAbdominalExam: '', LocalExamination: '', UrinaryOutput: '', Drain: '', KneeReflex: '', RyleTube: '', Remark: '', Action: '', Add_New: ''}
];

@Component({
  selector: 'app-critical-patient-monitoring',
  templateUrl: './critical-patient-monitoring.component.html',
  styleUrls: ['./critical-patient-monitoring.component.css']
})
export class CriticalPatientMonitoringComponent implements OnInit {

  criticalPatientInfoServiceSubcriber: Subscription;
  criticalPatientInfoViewModel: criticalPatientInfo = new criticalPatientInfo();
  criticalpatientinfoform: FormBuilder;
  patientdetails: criticalPatientInfo[] = [];
  patientModelObject: criticalPatientInfo[] = [];
  patientdata: criticalPatientInfo[] = [];
  public admissionDate: Date;

  pipe = new DatePipe('en-US');
  now = Date.now();
  Date: any;
  Time: any;
  Temp: any;
  pr: any;
  bp: any;
  rr: any;
  spo2: any;
  AbdominalGirth: any;
  PerAbdominalExam: any;
  LocalExamination: any;
  UrinaryOutput: any;
  Drain: any;
  KneeReflex: any;
  RyleTube: any;
  Remark: any;
  Action: any;
  Add_New: any;

  modalRef: NgbModalRef;
  displayedColumns = ['Date', 'Time', 'Temp', 'pr', 'bp', 'rr', 'spo2', 'AbdominalGirth', 'PerAbdominalExam', 'LocalExamination', 'UrinaryOutput', 'Drain', 'KneeReflex', 'RyleTube', 'Remark', 'Action', 'Add_New'];
  displayedColumnsReplace = ['key_Date', 'key_Time', 'Key_Temp', 'key_pr', 'key_bp', 'Key_rr', 'key_SPO2', 'key_AbdominalGirth', 'key_PerAbdominalExam', 'key_LocalExamination', 'key_UrinaryOutput', 'key_Drain', 'key_KneeReflex', 'key_RyleTube', 'key_Remark', 'key_Action', 'key_addnew'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  stageCode: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    meeting: any;
    mySimpleFormat: Date;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  constructor(public modalService: NgbModal, public criticalPatientInfoService: PatientInformationService) { }

  ngOnInit(): void {
    this.Date = 'Date';
    this.Time = 'Time';
    this.Temp = 'Temp';
    this.pr = 'pr';
    this.bp = 'bp';
    this.rr = 'rr';
    this.spo2 = 'spo2';
    this.AbdominalGirth = 'AbdominalGirth';
    this.PerAbdominalExam = 'PerAbdominalExam';
    this.LocalExamination = 'LocalExamination';
    this.UrinaryOutput = 'UrinaryOutput';
    this.Drain = 'Drain';
    this.KneeReflex = "KneeReflex";
    this.RyleTube = 'RyleTube';
    this.Remark = 'Remark';
    this.Action = 'Action';
    this.Add_New = 'Add_New';
    this.stageCode = GlobalConstants.PATIENT_PrepartumCare_STAGE5;
    console.log('this screen is working fine');
    this.getUserByIds(1105);

      //  this.patientdata = [
      //{
      //  "patientId": 1105,
      //  "patientName": "Mr. Rajesh Kumar Misra Jr.",
      //  "crNo": 2,
      //  "mrdNo": 1,
      //  "unitNo": 1345,
      //  "admissionDate": new Date(2020,9,13,0,0)

      //}];

 



    //this.criticalPatientInfoViewModel.patientId = this.patientModelObject[0].patientId;
    //this.criticalPatientInfoViewModel.patientName = this.patientdata[0].patientName;
    //this.criticalPatientInfoViewModel.crNo = this.patientdata[0].crNo;
    //this.criticalPatientInfoViewModel.mrdNo = this.patientdata[0].mrdNo;    
    //this.criticalPatientInfoViewModel.unitNo = this.patientdata[0].unitNo;
    //this.meeting = moment(this.patientdata[0].admissionDate).format('yyyy-MM-DDThh:mm');
  
    

    
    
    //let today = new Date(this.patientdata[0].admissionDate);
    //this.meeting = today.toISOString().split('T')[0];
    ////this.meeting = today.toISOString()
    //this.meeting = new Date();
    //this.patientdata[0].admissionDate = this.meeting;

    //this.criticalPatientInfoViewModel.admissionDate = this.meeting;
   // this.meeting = this.criticalPatientInfoViewModel.admissionDate;

    //let today = new Date();
    //this.meeting.start = today.toISOString().split('T')[0]

    //  < input
    //type = "date"
    //class="form-control"
    //value = "{{meeting.start}}"
    //[(ngModel)] = "meeting.start" />

    
    //console.log("patientid", this.patientModelObject[0].patientId);
    console.log("name", this.patientModelObject[0].patientName);
    console.log("crmno", this.patientModelObject[0].crNo);
    console.log("mrdno", this.patientModelObject[0].mrdNo);
    console.log("admissionDate", this.patientModelObject[0].admissionDate);
    //console.log("meeting", this.meeting);
    console.log("unitNo", this.patientModelObject[0].unitNo);

  }
  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }
  addRow() {
    ELEMENT_DATA.push({ Date: '', Time: '', Temp: '', pr: '', bp: '', rr: '', spo2: '', AbdominalGirth: '', PerAbdominalExam: '', LocalExamination: '', UrinaryOutput: '', Drain: '', KneeReflex: '', RyleTube: '', Remark: '', Action: '', Add_New: '' })
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }


  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

  getUserByIds(ids: number) {
    //debugger
    this.criticalPatientInfoService.GetPatientInfoByID(ids).subscribe((result: any) => {

      console.log("result", result);
      this.patientdetails = result.data;
      this.patientdetails.forEach(result => {
        //debugger
        const patientdata = {
          patientId:result.patientId,
          patientName: result.patientName,
          crNo: result.crNo,
          mrdNo: result.mrdNo,
          unitNo: result.unitNo,
          admissionDate: result.admissionDate

          

        };
        this.criticalPatientInfoViewModel.patientId = result.patientId;
        this.criticalPatientInfoViewModel.patientName = result.patientName;
        this.criticalPatientInfoViewModel.crNo = result.crNo;
        this.criticalPatientInfoViewModel.mrdNo = result.mrdNo;
        this.meeting = result.admissionDate ;
        this.criticalPatientInfoViewModel.unitNo = result.unitNo;
        
        
        //const mySimpleFormat = this.pipe.transform(result.admissionDate, 'MM/dd/yyyy');
        //const myShortFormat = this.pipe.transform(result.admissionDate, 'short');
        //console.log("name", mySimpleFormat);
        //console.log("name", myShortFormat);
        //this.meeting = this.mySimpleFormat;



        //console.log("patientid", result.patientId);
        //console.log("patientName", result.patientName);
        //console.log("crno", result.crNo);
        //console.log("mrdno", result.mrdNo);
        //console.log("unitno", result.unitNo);
        //console.log("admissiondate", result.admissionDate);


        //this.patientModelObject.push(patientdata);
        //console.log('patientdata', patientdata);
        //console.log('patientModelObject', this.patientModelObject);


        //result = this.criticalPatientInfoViewModel;
        //console.log("criticalPatientInfoViewModel", this.criticalPatientInfoViewModel);
      });
    })
   }

}
