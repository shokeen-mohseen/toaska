import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { HospitalSetup, HospitalSetup2 } from '../../../modals/patient-information';
import { Router } from '@angular/router';
import { PatientInformationService } from '../../../services/patient-informaation.services';
import { CommodityService } from '../../../../../core/services/commodity.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core';
import { HospitalNotificationService } from '../../../../../shared/services/hospital-sendnotification.service';
@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.css']
})

export class HospitalListComponent implements OnInit {

  DefaultCount: number;
  List: HospitalSetup[] = [];
  hospitalModel2 = new HospitalSetup2();
  ItemList: HospitalSetup[];
  isAllSelected: boolean = false;
  datamodel: HospitalSetup[] = [];
  hospitalSetup= new HospitalSetup();
  
  filterValue = "";
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
  displayedColumns = ['selectRow', 'organisationName', 'name', 'Covidready', 'cityName', 'stateName', 'countryName', 'isActive'];
  displayedColumnsReplace = ['selectRow', 'key_Insname', 'key_Hospitalname', 'key_Covidready', 'key_City', 'key_State', 'key_Country','key_Active'];

  dataSource: MatTableDataSource<HospitalSetup>;
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
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

  
  isLinear = false;

  modalRef: NgbModalRef;
  constructor(private router: Router, private commodityService: CommodityService, private auth: AuthService,
    private patientinformationservice: PatientInformationService, private toastr: ToastrService,public modalService: NgbModal) { }
  selectRow: any;

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource<HospitalSetup>();

    this.selectRow = 'selectRow';
    this.ItemList = new Array<any>();
    this.getPageSize();
    this.getdataOnLoad();
  }

  ngAfterViewInit(): void {
    this.paginator.length = this.hospitalSetup.pageSize;
  }

  getdata() {

    this.hospitalSetup.filterOn = this.filterValue;
    this.selection.clear();
    this.datamodel.push(Object.assign({}, this.hospitalSetup));
    this.isAllSelected = false;
    this.patientinformationservice.GetHospitalList(this.hospitalSetup).subscribe(
      result => {
        this.dataSource.data = result.data;
      });
  }

  getdataOnLoad() {
    this.hospitalSetup.filterOn = this.filterValue;
    this.selection.clear();
    this.datamodel.push(Object.assign({}, this.hospitalSetup));
    this.isAllSelected = false;
    this.hospitalSetup.sortOrder = "desc";
    this.hospitalSetup.clientId = this.auth.currentUserValue.ClientId;
    this.patientinformationservice.GetHospitalList(this.hospitalSetup).subscribe(
      result => {
        
        this.dataSource.data = result.data;
        console.log(this.dataSource.data)
      });
  }
  // Get Page Size 
  getPageSize() {

    this.selection.clear();
    this.hospitalModel2 = this.Data();
    this.patientinformationservice.GetHospitalList2(this.hospitalModel2).subscribe(
      result => {
        this.List = result.data;
       
        this.hospitalSetup.itemsLength = this.List.length;
        console.log(this.hospitalSetup.itemsLength)
        //this.dataSource.data = result.data;

      });
  }

  private Data(): HospitalSetup2  {
    this.hospitalModel2.clientId = this.auth.currentUserValue.ClientId;
    this.hospitalModel2.id = 0;
    this.hospitalModel2.name = "";
    this.hospitalModel2.description = "";
    this.hospitalModel2.cityCode = "";
    this.hospitalModel2.stateName = "";
    this.hospitalModel2.stateName = "";
    this.hospitalModel2.cityName = "";
    this.hospitalModel2.organisationName = "";
    this.hospitalModel2.organizationId = 0;
    this.hospitalModel2.isPrimary = false;
    this.hospitalModel2.isActive = false;
    return this.hospitalModel2;
  }

  getClass(row: any): string {

    let rowcss = "";

    if (row.isSelected) {
      rowcss = "activeRow";
    }
    else {
      rowcss = "";
    }


    if (row.active == "Inactive") {
      rowcss = rowcss + " " + "snactive"
    }

    return rowcss;

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
  async setSelectedRows() {

  

    let iDs = ""; let items: any = [];

    this.dataSource.data.filter(row => {
      if (row.isSelected == true) {
        items.push(row)
        //iDs += `${row.id},`;

        //this.idsPhysicianDeteted += `${x.id},`;
      }
    });

    if (items.length > 0) {

      this.DefaultCount = await this.commodityService.getMaxEditedRecordsCount();
      items = items.slice(0, this.DefaultCount);

      items.filter(row => {

        iDs += `${row.id},`;

      })

      if (iDs.length > 0) {
        iDs = iDs.substring(0, iDs.length - 1);
      }

     
      //this.EnableDisableButton(false);

      //this.changingPatientValue.next(iDs);
      //localStorage.setItem("AddedPatientList", iDs);
      this.patientinformationservice.getpatientsetuplist(iDs);
    }
    else {
      //this.EnableDisableButton(true);
      //this.changingPatientValue.next(null);
      localStorage.removeItem("AddedPatientList");
     
    }
  }
  selectedCheckbox(e: any, selectedData) {
    this.dataSource.data.forEach(row => {
      if (row.id == selectedData.id)
        row.isSelected = !selectedData.isSelected;
    });

    this.isAllSelected = (this.dataSource.data.length === (this.dataSource.data.filter(x => x.isSelected == true).length));

    //this.setPhysicianCheckBoxData();
    this.setSelectedRows();
      
  }

  // serve side pagination
  onPaginationEvent(event) {
    this.filterValue = "";
    this.hospitalSetup.pageNo = event.pageIndex + 1;
    this.hospitalSetup.pageSize = event.pageSize;
    this.getdata();
  }

// custome sorting 
  customSort(event) {
    this.hospitalSetup.sortColumn = event.active;
    this.hospitalSetup.sortOrder = event.direction.toLocaleUpperCase();
    this.getdata();
  }
}
export interface PeriodicElement {
  selectRow: string;
  Institutename: string;
  Hospitalname: string;
  Covidready: string;
  City: string;
  State: string;
  Country: string;
  Active: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Institutename: 'Inst. Of Better Health, Dept of O&G', Hospitalname: 'Apollo', Covidready: 'Yes', City: 'Ghaziabad', State: 'Uttar Pradesh', Country: 'India', Active: 'Active' },
  { selectRow: '', Institutename: 'Inst. Of Better Health, Dept of O&G', Hospitalname: 'Apollo', Covidready: 'No', City: 'Ghaziabad', State: 'Uttar Pradesh', Country: 'India', Active: 'Active' },
  { selectRow: '', Institutename: 'Inst. Of Better Health, Dept of O&G', Hospitalname: 'Apollo', Covidready: 'Yes', City: 'Ghaziabad', State: 'Uttar Pradesh', Country: 'India', Active: 'Active' },
  { selectRow: '', Institutename: 'Inst. Of Better Health, Dept of O&G', Hospitalname: 'Apollo', Covidready: 'No', City: 'Ghaziabad', State: 'Uttar Pradesh', Country: 'India', Active: 'Active' },
  { selectRow: '', Institutename: 'Inst. Of Better Health, Dept of O&G', Hospitalname: 'Apollo', Covidready: 'Yes', City: 'Ghaziabad', State: 'Uttar Pradesh', Country: 'India', Active: 'Active' },
  { selectRow: '', Institutename: 'Inst. Of Better Health, Dept of O&G', Hospitalname: 'Apollo', Covidready: 'No', City: 'Ghaziabad', State: 'Uttar Pradesh', Country: 'India', Active: 'Active' },
 
];
