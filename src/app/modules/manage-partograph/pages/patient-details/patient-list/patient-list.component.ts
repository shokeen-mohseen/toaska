import { Component, ViewChild, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { PatientInformationService } from '../../../services/patient-informaation.services';
import { PatientValue, patientlist, patientlist2 } from '../../../../../core/models/partograph-registration';
import { PaginationModel } from '../../../../../core/models/Pagination.Model';
import { Item } from 'angular2-multiselect-dropdown';
import { Id } from '../../../../system-settings/freight-mode/map-equipment-type/map-equipment-type.component';
import { Subject } from 'rxjs';
import { ButtonStateService } from '../../../services/button-state.service';
import { TopBtnGroupComponent } from '../../../../../shared/components/top-btn-group/top-btn-group.component';


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, AfterViewInit {

  
  obj: PatientValue[] = [];
  patientviewmodel: PatientValue[] = [];
  partlist: any;
  patientModel = new patientlist();
  patientModel2 = new patientlist2();
  patientdetails: PatientValue[] = [];
  dataSource: MatTableDataSource<patientlist>;
  datamodel: patientlist[]=[];
  datamodel2: patientlist[] = [];
  List: patientlist[] = [];
  ItemList: patientlist[];
  test: string;
  isAllSelected: boolean = false;
  @Output() checkBoxClick: EventEmitter<any> = new EventEmitter<any>();
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
  displayedColumns = ['selectRow', 'patientName', 'registrationNo', 'physicianName', 'hospitalName',
    'admissionDate', 'patientConditionName', 'patientStatusName', 'active'];
  displayedColumnsReplace = ['selectRow', 'key_PatientName', 'key_Register', 'key_Primaryphysician',
    'key_Hospital', 'key_Addressdate', 'key_Condition', 'key_Status','key_Active',];
  selection = new SelectionModel<patientlist>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue = "";

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getdata();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getdata();
    }

  }

  getClass(row: any): string {

    let rowcss = "";

    if (row.isSelected) {
      rowcss = "activeRow";
    }
    else {
      rowcss = "";
    }


    if (row.active == "Inactive" ) {
      rowcss = rowcss + " " + "snactive"
    }

    return rowcss;

  }


  isLinear = false;
  onSelectionChange(row: patientlist, event: Event, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    
  }
  selectRow: any;
  admissionDate: any;
  modalRef: NgbModalRef;
  checkButtonState: Subject<any> = new Subject();
  changingPatientValue: Subject<any> = new Subject();
  constructor(private buttonStateService: ButtonStateService, public modalService: NgbModal,
    private patientInformationService: PatientInformationService,) { }


  ngOnInit(): void {
   
    this.selectRow = 'selectRow';
    this.admissionDate = 'admissionDate';
    this.ItemList = new Array<any>();
    this.getPageSize();

    this.getdata();
    
    this.dataSource = new MatTableDataSource<patientlist>();

  }
  ngAfterViewInit() {
    
    this.paginator.length = this.patientModel.pageSize;
    this.dataSource.sort = this.sort;
    

  }

  

  onPaginationEvent(event) {
    this.filterValue = "";
    this.patientModel.pageNo = event.pageIndex + 1;
    this.patientModel.pageSize = event.pageSize;
    this.getdata();
  }

  
  private Data(): patientlist2 {
    this.patientModel2.id = 0;
    this.patientModel2.PatientName = "";
    this.patientModel2.RegistrationNo = "";
    this.patientModel2.PhysicianName = "";
    this.patientModel2.HospitalName = "";
    this.patientModel2.AdmissionDate = new Date(new Date().toISOString());
    this.patientModel2.PatientConditionID = 0;
    this.patientModel2.PatientConditionName = "";
    this.patientModel2.PatientStatusID = 0;
    this.patientModel2.PatientStatusName = "";
    this.patientModel2.Active = "";
    return this.patientModel2;
  }

 getPageSize(){
       
   this.selection.clear();
   this.patientModel2 = this.Data();
    //this.datamodel2.push(Object.assign({}, this.patientModel2));
    console.log("patientmodel2", this.patientModel2);
    this.patientInformationService.getpatientlistAll2(this.patientModel2).subscribe(
      result => {
         this.List = result.data;
        
        this.patientModel.itemsLength = this.List.length;
        //this.dataSource.data = result.data;
        
      });
  }
  customSort(event) {
    this.patientModel.sortColumn = event.active;
    this.patientModel.sortOrder = event.direction.toLocaleUpperCase();
    this.getdata();
  }

  getdata() {

    this.patientModel.filterOn = this.filterValue;
    this.selection.clear();
    this.datamodel.push(Object.assign({}, this.patientModel));
    this.isAllSelected = false;
    this.patientInformationService.getpatientlistAll(this.patientModel).subscribe(
      result => {

        //let data: any = [];
        //data = result.data;
        //data.isSelected = false;
        this.dataSource.data = result.data;
        //console.log("reverse",this.dataSource.data.reverse());
        //console.log("patient model", result);
        //console.log("datasource",this.dataSource.data.length)
      });
  }


  selectAll(check: any) {
    
    this.isAllSelected = check.checked;
    this.dataSource.data.forEach(row => {
      // console.log(this.isPhysicianAllSelected)
      row.isSelected = this.isAllSelected;
     // console.log(row)
    });

   // console.log(this.dataSource.data)
    this.setSelectedRows();
  }


  setSelectedRows() {
    let iDs = "";

    this.dataSource.data.filter(row => {
      if (row.isSelected == true) {
        iDs += `${row.id},`;
       
        //this.idsPhysicianDeteted += `${x.id},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);

      this.changingPatientValue.next(iDs);
      localStorage.setItem("AddedPatientList", iDs);
      this.patientInformationService.getpatientsetuplist(iDs);
    }
    else {
      this.changingPatientValue.next(null);
      localStorage.removeItem("AddedPatientList");
      this.patientInformationService.getpatientsetuplist(null);
    }
  }

  selectedCheckbox(e: any, selectedData) {

    this.dataSource.data.forEach(row => {
      if (row.id == selectedData.id)
        row.isSelected = !selectedData.isSelected;
    });

    this.isAllSelected = (this.dataSource.data.length === (this.dataSource.data.filter(x => x.isSelected == true).length));

    //this.setPhysicianCheckBoxData();


    var list: String[] = [];
    
    if (e.checked == true) {
      this.ItemList.push(selectedData);

    } else {

      this.ItemList = this.ItemList.filter(m => m != selectedData);

    }
    
    this.patientInformationService.patientselected = [];
   
    for (let i = 0; i < this.ItemList.length; i++) {

      list.push(this.ItemList[i].id.toString());

    }

    //this.topButtonBarService.getAction().subscribe(action => {

    var temp = list.join(",");
    this.changingPatientValue.next(temp);
    localStorage.setItem("AddedPatientList", temp);
    this.checkButtonState.next(temp)
    this.patientInformationService.getpatientsetuplist(temp);
    
  }

}


export interface PeriodicElement {
  selectRow: string;
  Name: string;
  Registration: string;
  Primaryphy: string;
  Department: string;
  Admissiondate: string;
  Condition: string;
  Status: string;
  Active: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  //{ selectRow: '', Name: 'John', Registration: 'AP2512541', Primaryphy: 'Dr. jain', Department: 'OPD', Admissiondate: '8/21/2020 6:00:24 IST', Condition: 'Normal', Status: 'Registered', Active: 'Active' },
  //{ selectRow: '', Name: 'John', Registration: 'AP2512541', Primaryphy: 'Dr. jain', Department: 'OPD', Admissiondate: '8/21/2020 6:00:24 IST', Condition: 'Medium', Status: 'Admitted', Active: 'Active' },
  //{ selectRow: '', Name: 'John', Registration: 'AP2512541', Primaryphy: 'Dr. jain', Department: 'OPD', Admissiondate: '8/21/2020 6:00:24 IST', Condition: 'Critical', Status: 'In Process', Active: 'Active' },
  //{ selectRow: '', Name: 'John', Registration: 'AP2512541', Primaryphy: 'Dr. jain', Department: 'OPD', Admissiondate: '8/21/2020 6:00:24 IST', Condition: 'Normal', Status: 'Discharged', Active: 'Active' },

 
];
