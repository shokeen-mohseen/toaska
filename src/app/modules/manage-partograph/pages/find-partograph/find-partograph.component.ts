import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ProjectService, User, AuthService } from '@app/core';
import { first, concat } from 'rxjs/operators';
import { DataService } from '@app/shared/services';
import { UserActivityLog, ActionOnPage } from '@app/core/models/useractivity';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PatientPartographDetail, PatientStatus } from '../../../../core/models/partograph-registration';
import { PatientInformationService } from '../../services/patient-informaation.services';
import { PartographSessionManagement } from '../../modals/input-chart';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { MatTableExporterDirective } from 'mat-table-exporter';

@Component({
  selector: 'app-find-partograph',
  templateUrl: './find-partograph.component.html',
  styleUrls: ['./find-partograph.component.css']
})
export class FindPartographComponent implements OnInit, AfterViewInit {
  //@ViewChild('TABLE', { static: true }) table: ElementRef;
  //@ViewChild('TABLE') table: ElementRef;
    

  @ViewChild('exporter', { static: true }) exporter: ElementRef;

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  IsTosca: boolean;

  deletebuttonEnable: boolean = true; isActiveInActive: Boolean = true;
  editbuttonEnable: boolean = true;
  addbuttonEnable: boolean = false;
  patientRegistration: PatientPartographDetail;
  currentUser: User;
  selectedItemList = [];
  IsActive: boolean;
  InActive: boolean;
  displayedColumns = ['selectRow', 'partographID', 'patientName', 'registrationNumber', 'physicianName', 'status', 'dateOfAdmittance', 'dateOfDischarge'];

  patientStatus: PatientStatus;
  dataList: PeriodicElement[]

  dataSource = new MatTableDataSource<PeriodicElement>(this.dataList);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  _partographSession: PartographSessionManagement;

  listPartograph: any[];
  userActivityObj: UserActivityLog;
  constructor(private toastr: ToastrService,
               private route: Router,
               private authservice: AuthService,
               private patientInformationService: PatientInformationService,
               private apiPartograph: ProjectService, private dataService: DataService) {

    this.patientStatus = new PatientStatus();
   
    this.IsActive = true;
    this.InActive = false;
    this._partographSession = new PartographSessionManagement();
    this.selectedItemList = [];

    localStorage.removeItem("PartographPatient");

    this.patientRegistration = new PatientPartographDetail();

    this.currentUser = this.authservice.currentUserValue;

    this.patientRegistration.ClientId = this.currentUser.ClientId;

    this.patientStatus.ClientID = this.currentUser.ClientId;
    this.patientStatus.UpdatedBy = this.currentUser.LoginId;

    this.patientRegistration.PatientID = 0;
    this.patientRegistration.PageNo = 1;
    this.patientRegistration.PageSize = 1000;

  }

  ngAfterViewInit() {
    
    //this.patientRegistration.PageNo = 1;
    //this.patientRegistration.PageSize = 10;
    //this.LoadPatientRecord();   

    this.btnBar.hideTab('key_View');
    
  }

  actionHandler(type) {
    if (type === 'add') {
      this.AddNewPatient();
    }
    if (type === 'edit') {
      this.EditButton();
    }
    if (type === 'delete') {
      this.DeleteSelectedPatient();
    }
    if (type === 'refresh') {
      this.RefreshButton();
    }
    if (type === 'export') {
     //this.exporter.exportTable('xlsx', { fileName: 'patientList', sheet: 'sheet_name', Props: { Author: 'rizwankhan' } });
    }
    if (type === 'active') {
      this.ActiveButton();
    }
    if (type === 'inactive') {
      this.InActiveButton();
    }
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

  ngOnInit() {
    const userActivitylog = this.dataService.currentUserActivity;
    this.userActivityObj = new UserActivityLog();
    this.userActivityObj.moduleName = userActivitylog.moduleName;
    this.userActivityObj.componentName = this.constructor.name;
    this.userActivityObj.actiononPage = ActionOnPage.View;
   // this.dataService = null;
    this.dataService.SendActivity(this.userActivityObj);
    this.LoadPatientRecord();
    //this.apiPartograph.getpartograph()
    //  .pipe(first())
    //  .subscribe(
    //    data => {
    //      this.listPartograph = data;
    //      console.log(this.listPartograph)
    //    },
    //    error => {
    //     // this.error = error;
    //      //this.isLoading = false;
    //    });    

    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }

    this.actionGroupConfig = getGlobalRibbonActions();

  }

  exportAsExcel() {
    //TableUtil.exportTableToExcel("ExampleMaterialTable");

  }
  TransactionPatientStatus(mode: string) {

    let patientIds = "";

    this.patientStatus.UpdateDateTimeBrowser = new Date();

    this.patientStatus.Mode = mode;
    for (let i = 0; i < this.selectedItemList.length; i++) {

      patientIds = patientIds + "," + this.selectedItemList[i].PatientId
    }
    if (patientIds.length > 1) {
      this.patientStatus.PatientId = patientIds.substring(1);;

      this.patientInformationService.UpdatePatientStatus(this.patientStatus).subscribe(
        result => {
          // Handle result
          if (result.data != undefined) {

            this.LoadPatientRecord();

            this.toastr.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
            console.log(result.data)

          }
        },
        error => {
          this.toastr.success(GlobalConstants.FAILED_MESSAGE);
        },
        () => {

        }
      );
    }
    else {

      this.toastr.error("Select at least one record");
    }


  }



  DeleteSelectedPatient() {

    this.TransactionPatientStatus("DELETE");

    //var arrayIds = [];
    
    //for (let i = 0; i < this.selectedItemList.length; i++) {



    //  arrayIds.push(this.selectedItemList[i].PatientId);
    //}

    ////this.patientInformationService.Upate_PatientInformationPart1(arrayIds).subscribe(
    ////  result => {
    ////    // Handle result
    ////    if (result.data != undefined) {
    ////    }
    ////  });
  }


  EditButton():void {
    this._partographSession.PartographId = this.selectedItemList[0].PartographId;
    this._partographSession.PatientId = this.selectedItemList[0].PatientId;
    this._partographSession.LocationId = this.selectedItemList[0].LocationId;
    localStorage.setItem("PartographPatient", JSON.stringify(this._partographSession));
    this.route.navigate(['/manage-partograph/new-partograph/registration']);
    
  }

  AddNewPatient() {
    localStorage.removeItem("PartographPatient");
    this.route.navigate(['/manage-partograph/new-partograph/registration']);
  }


  ChangeElement(event, element: any) {

    localStorage.removeItem("PartographPatient");
   // console.log(element)
    if (event) {
      this.addbuttonEnable = true;
      this.selectedItemList.push({
        PartographId: element.partographId,
        PatientId: element.patientId,
        LocationId: element.locationId,
        ActiveInActiveStatus: element.isActive
      });


    }
     
    else {
      this.addbuttonEnable = false;
      var index = this.selectedItemList.map(function (d) { return d['PatientId']; }).indexOf(element.patientId)
      this.selectedItemList.splice(index, 1);

    }

     if (this.selectedItemList.length > 1) {
       this.editbuttonEnable = true;
       this.deletebuttonEnable = false;
    }
    else {
      this.editbuttonEnable = false;
    }
    if (this.selectedItemList.length > 0) {
      this.addbuttonEnable = true;
      this.deletebuttonEnable = false;
      this.isActiveInActive = false;
    }
    else {
      this.deletebuttonEnable = true;
      this.isActiveInActive = true;
      this.addbuttonEnable = false;
      this.selectedItemList = [];
      this.editbuttonEnable = true;
    }


    if (element.partographId > 0) {
      this.deletebuttonEnable = true;
    }

    let IsDelete: boolean = false;

    console.log(this.selectedItemList);
    for (let i = 0; i < this.selectedItemList.length; i++) {

      console.log(this.selectedItemList[i].PartographId);
      if (this.selectedItemList[i].PartographId > 0) {
        IsDelete = true;
      }
    }
    this.deletebuttonEnable = IsDelete;

    //console.log(IsDelete)
  }

  InActiveButton() {

    let isValidData: boolean = false;

    for (let i = 0; i < this.selectedItemList.length; i++) {

      if (this.selectedItemList[i].ActiveInActiveStatus != true) {
        isValidData = true;
      }


    }

    if (isValidData) {

      this.toastr.warning("Please unselect only active record!");
      return;
    }

    this.TransactionPatientStatus("INACTIVE"); 

  }

  RefreshButton() {
    this.LoadPatientRecord();
  }

  ActiveButton() {
    let isValidData: boolean = false;

    for (let i = 0; i < this.selectedItemList.length; i++) {

      if (this.selectedItemList[i].ActiveInActiveStatus != false) {
        isValidData = true;
      }


    }

    if (isValidData) {

      this.toastr.warning("Please unselect only inactive record!");
      return;
    }

    this.TransactionPatientStatus("ACTIVE"); 
  }

  private LoadPatientRecord() {
    
    this.selectedItemList = [];
    this.dataList = [];
     this.patientInformationService.GetPatientList(this.patientRegistration).subscribe(
      result => {
        // Handle result
        if (result.data != undefined) {
          if (result.data.length > 0) {
            let res: any[] = result.data;

            if (res != null) {
               console.log(res)

              res = res.filter(u => u.setupCompleted == true);

              for (let i = 0; i < res.length; i++) {
                let partographRefernceNo = ""; let PatientRegistrationNo = "";
                let partographId = 0;
                if (res[i].partograph != undefined) {
                  if (res[i].partograph != null) {
                    if (res[i].partograph.length > 0) {
                      let partographList: any[] = res[i].partograph;
                      //console.log(partographList[0].referenceNo)
                      if (partographList[0].referenceNo != undefined) {
                        partographRefernceNo = partographList[0].referenceNo;
                        partographId = partographList[0].id;
                      }
                    }
                  }
                  if (res[i].partograph.length > 0) {

                    if (res[i].patientRegistration != undefined) {
                      if (res[i].patientRegistration != null) {
                        if (res[i].patientRegistration.length > 0) {
                          let patientRegistrationList: any[] = res[i].patientRegistration;
                          if (patientRegistrationList[0].referenceNo != undefined) {
                            PatientRegistrationNo = patientRegistrationList[0].referenceNo;
                          }
                        }
                      }
                    }
                    let name: string = res[i].prefix;
                    name = name.concat(" " + res[i].firstName, " ", res[i].middleName, " ", res[i].lastName);

                    this.dataList.push({
                      patientName: name,
                      physicianName: res[i].admittedBy,
                      partographID: partographRefernceNo,
                      registrationNumber: PatientRegistrationNo,
                      dateOfAdmittance: res[i].admissionDate,
                      status: res[i].isActive == true ? "Active" : "Inactive",//  res[i].patientStatusId,
                      selectRow: null,
                      dateOfDischarge: null,
                      patientId: res[i].id,
                      locationId: res[i].locationId,
                      partographId: partographId,
                      isActive: res[i].isActive

                    })
                  }
                
                }
                
              }
              
              this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataList);
              console.log(this.paginator)
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

            }



          }
        }
      },
      error => {
       
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        // this.toastrService.success('User is saved successfully');
      }
    );
  }

}


export interface PeriodicElement {
  selectRow: string;
  partographID: string;
  patientName: string;
  registrationNumber: string;
  physicianName: string;
  status: string;
  dateOfAdmittance: string;
  dateOfDischarge: string;
  patientId: number;
  partographId: number;
  locationId: number;
  isActive: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna1', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
  //{ selectRow: '', partographID: 'AN1235', patientName: 'Mrs. Ilenna', registrationNumber: 'Il3554', physicianName: 'Dr. Sonelal Khurana', status: 'Normal', dateOfAdmittance: 'July 18 2020', dateOfDischarge: 'July 22 2020' },
];
