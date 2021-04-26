import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { getHospitalsetup } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { ResizeEvent } from 'angular-resizable-element';
import { HospitalSetup2, HospitalSetup } from '../../modals/patient-information';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { PatientInformationService } from '../../services/patient-informaation.services';
import { CommodityService } from '../../../../core/services/commodity.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { Router } from '@angular/router';
import { HospitalNotificationService } from '../../../../shared/services/hospital-sendnotification.service';
@Component({
  selector: 'app-hospitalsetup',
  templateUrl: './hospitalsetup.component.html',
  styleUrls: ['./hospitalsetup.component.css']
})
export class HospitalsetupComponent implements OnInit, AfterViewInit {
  iDs = ""; isSetupComplete: boolean = false; dataList: any;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent; actionGroupConfig;
  modalRef: NgbModalRef;  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  tab1: boolean = true; tab2: boolean = false;
  tab3: boolean = false; tab1Data: boolean = true;
  tab2Data: boolean = false; tab3Data: boolean = false;
  selection = new SelectionModel<HospitalSetup>(true, []);
  DefaultCount: number; List: HospitalSetup[] = [];
  hospitalModel2 = new HospitalSetup2();
  ItemList: HospitalSetup[];
  isAllSelected: boolean = false;
  datamodel: HospitalSetup[] = [];
  hospitalSetup = new HospitalSetup();

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
  displayedColumnsReplace = ['selectRow', 'key_Insname', 'key_Hospitalname', 'key_Covidready', 'key_City', 'key_State', 'key_Country', 'key_Active'];

  dataSource: MatTableDataSource<HospitalSetup>;
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //selection = new SelectionModel<PeriodicElement>(true, []);

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

  constructor(private hospitalSessionService: HospitalNotificationService,private router: Router, private commodityService: CommodityService, private auth: AuthService,
    private patientinformationservice: PatientInformationService, private toastr: ToastrService, public modalService: NgbModal) { }
  selectRow: any;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
      // this.tab2Data = false;
      // this.tab3Data = false;
    }
    else if ($event.index === 1) {
      // this.tab1Data = false;
      this.tab2Data = true;
      // this.tab3Data = false;
    }
    else if ($event.index === 2) {
      // this.tab1Data = false;
      // this.tab2Data = false;
      this.tab3Data = true;
    }
  }

  actionHandler(type) {
    if (type === "add") {

      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;
      this.hospitalSessionService.SetSessionIds(null);

    } else if (type === "edit") {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 1;
      this.tab3Data = true;
      this.tab2Data = false;
      this.tab1Data = false;

    }
    else if (type === "delete") {
      console.log("delete");
      this.deletepatient();
    }
    else if (type === "active") {
      console.log("Active");
      this.activatepatient();
    }
    else if (type === "inactive") {
      console.log("Inactive");
      this.deactivatepatient();
    }
  }

  closeTab() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.getdataOnLoad();
    this.iDs = "";
  }
  ngAfterViewInit(): void {
    if (this.IsTosca) {

      this.btnBar.hideAction('language')
      this.btnBar.hideAction('notification')
      this.btnBar.hideAction('setupWizard')
    }

    this.paginator.length = this.hospitalSetup.pageSize;
    this.EnableDisableButton(true);
  }
  IsTosca: boolean;
  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getHospitalsetup();

    this.dataSource = new MatTableDataSource<HospitalSetup>();

    this.selectRow = 'selectRow';
    this.ItemList = new Array<any>();
    this.getPageSize();
    this.getdataOnLoad();
    
  }

  EnableDisableButton(isEnable: boolean) {
    //this.btnBar.disableAction('add');
    if (isEnable) {
      this.btnBar.disableAction('edit');
      this.btnBar.disableAction('delete');
      this.btnBar.disableAction('active');
      this.btnBar.disableAction('inactive');
    }
    else {
      this.btnBar.enableAction('edit');
      this.btnBar.enableAction('delete');
      this.btnBar.enableAction('active');
      this.btnBar.enableAction('inactive');
    }
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

  private Data(): HospitalSetup2 {
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


    if (!row.isActive) {
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

    debugger;

   this.iDs = ""; let items: any = [];

    this.dataSource.data.filter(row => {
      if (row.isSelected == true) {
        items.push(row)
        
      }
    });

    if (items.length > 0) {

      this.DefaultCount = await this.commodityService.getMaxEditedRecordsCount();
      items = items.slice(0, this.DefaultCount);

      items.filter(row => {

        this.iDs += `${row.id},`;

      })

      if (this.iDs.length > 0) {
        this.iDs = this.iDs.substring(0, this.iDs.length - 1);
        this.hospitalSessionService.SetSessionIds(this.iDs);
      }
      else {
        this.hospitalSessionService.SetSessionIds(null);
      }

      this.EnableDisableButton(false);

      //this.changingPatientValue.next(iDs);
      //localStorage.setItem("AddedPatientList", iDs);
      //this.patientinformationservice.getpatientsetuplist(iDs);
    }
    else {
      this.EnableDisableButton(true);
      //this.changingPatientValue.next(null);
     // localStorage.removeItem("AddedPatientList");

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

  // activate record
  activatepatient() {
    if (this.iDs.length - 1 < 0) {
      this.toastr.warning('please select Hospital to active');
    } else {

      this.dataList = ('{"IDs": "' + this.iDs + '", "isActive":true }');

      this.patientinformationservice.activateanddeactivateHospitalsetupList(this.dataList).subscribe(x => {
        console.log("activate", x);

        this.toastr.success('Hospital activated successfully');
        this.getPageSize();
        this.getdataOnLoad()

      });
    }
  }
  // deactivate record
  deactivatepatient() {
    if (this.iDs.length - 1 < 0) {
      this.toastr.warning('please select Hospital to inactive');
    } else {

      this.dataList = ('{"IDs": "' + this.iDs + '", "isActive":false }');

      this.patientinformationservice.activateanddeactivateHospitalsetupList(this.dataList).subscribe(x => {
        console.log("inactivate", x);
        this.toastr.success('Hospital inactivate ');
         this.getPageSize();
         this.getdataOnLoad()


      });
    }


  }
  // delete record
  deletepatient() {
    if (this.iDs.length - 1 < 0) {
      this.toastr.warning('please select Hospital to delete');
    } else {

      this.dataList = ('{"IDs": "' + this.iDs + '" }');
      console.log('test ', this.dataList);

      this.patientinformationservice.deletepatientsetuppatientlist(this.dataList).subscribe(x => {
        console.log("delete", x);
        this.toastr.success('Delete Hospital successfully');
        this.getPageSize();
        this.getdataOnLoad()

      });
    }


  }
   
}

