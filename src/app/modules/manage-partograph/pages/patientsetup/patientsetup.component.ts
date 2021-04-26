import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';
import { getPatientSetup } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core';
import { PatientInformationService } from '../../services/patient-informaation.services';
import { patientlist, PatientValue, patientlist2 } from '../../../../core/models/partograph-registration';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ButtonStateService } from '../../services/button-state.service';
import { MatTableDataSource } from '@angular/material/table';
import { ResizeEvent } from 'angular-resizable-element';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommodityService } from '../../../../core/services/commodity.service';



@Component({
  selector: 'app-patientsetup',
  templateUrl: './patientsetup.component.html',
  styleUrls: ['./patientsetup.component.css']
})
export class PatientsetupComponent implements OnInit, AfterViewInit {

  // Patient List grid Uses
  obj: PatientValue[] = []; DefaultCount: number = 0;
  patientviewmodel: PatientValue[] = [];
  partlist: any;
  patientModel = new patientlist();
  patientModel2 = new patientlist2();
  patientdetails: PatientValue[] = [];
  dataSource: MatTableDataSource<patientlist>;
  datamodel: patientlist[] = [];
  datamodel2: patientlist[] = [];
  List: patientlist[] = [];
  ItemList: patientlist[];
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
    'key_Hospital', 'key_Addressdate', 'key_Condition', 'key_Status', 'key_Active',];
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

  selectRow: any;
  admissionDate: any;
  checkButtonState: Subject<any> = new Subject();
  
  selectedIds: any;
  selectedlist: patientlist[];
  test: string;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  modalRef: NgbModalRef;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  @Input() SetPatientIds: Subject<any>;

  @Input() changingPatientValue: Subject<any>;

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
      localStorage.removeItem("AddedPatientList");

      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;

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
    localStorage.removeItem("PatientId");
    localStorage.removeItem("AddedPatientList");
    this.getdataOnLoad();
  }

  constructor(private router: Router, private commodityService: CommodityService, private auth: AuthService,
    private  patientinformationservice: PatientInformationService, private toastr: ToastrService) { }

  ngAfterViewInit(): void {
    this.buttonPermission();
    if (this.IsTosca) {

      this.btnBar.hideAction('language')
      this.btnBar.hideAction('notification')
      this.btnBar.hideAction('setupWizard')
    }

    this.paginator.length = this.patientModel.pageSize;
    //this.dataSource.sort = this.sort;
    // API integration done 20 records
    this.EnableDisableButton(true);
    ////this.btnBar.disableAction('add');
    //this.btnBar.disableAction('edit');
    //this.btnBar.disableAction('delete');
    //this.btnBar.disableAction('active');
    //this.btnBar.disableAction('inactive');
  }


  IsTosca: boolean;
  ngOnInit(): void {

    this.selectRow = 'selectRow';
    this.admissionDate = 'admissionDate';
    this.ItemList = new Array<any>();
    this.getPageSize();
    this.getdataOnLoad();
    //this.getdata();

    this.dataSource = new MatTableDataSource<patientlist>();
    
    localStorage.removeItem("PatientId");
    localStorage.removeItem("AddedPatientList");
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getPatientSetup();
    this.selectedlist = new Array<any>();

  }
  activatepatient() {
    if (this.patientinformationservice.patientselected.length - 1 < 0) {
      this.toastr.warning('please select Patient to active');
    } else {

      console.log("selected list from service", this.patientinformationservice.patientselected);
      console.log('final value ', "{IDS:" + this.patientinformationservice.patientselected + "}");
      this.test = ('{"IDs": "' + this.patientinformationservice.patientselected + '", "isActive":true }');
      console.log('test ', this.test);

      this.patientinformationservice.activateanddeactivatepatientsetuppatientlist(this.test).subscribe(x => {
        console.log("activate", x);
        
        this.toastr.success('Patient activated successfully');
        location.reload();
        this.patientinformationservice.patientselected = [];
      });
    }
  }
  deactivatepatient() {
    if (this.patientinformationservice.patientselected.length - 1 < 0) {
      this.toastr.warning('please select Patient to inactive');
    } else {
      console.log("selected list from service", this.patientinformationservice.patientselected);
      console.log('final value ', "{IDS:" + this.patientinformationservice.patientselected + "}");
      this.test = ('{"IDs": "' + this.patientinformationservice.patientselected + '", "isActive":false }');
      console.log('test ', this.test);

      this.patientinformationservice.activateanddeactivatepatientsetuppatientlist(this.test).subscribe(x => {
        console.log("inactivate", x);
        this.toastr.success('Patient inactivate ');
        location.reload();
        this.patientinformationservice.patientselected = [];

      });
    }
    

  }
  deletepatient() {
    if (this.patientinformationservice.patientselected.length - 1 < 0) {
      this.toastr.warning('please select Patient to delete');
    } else {
      console.log("selected list from service", this.patientinformationservice.patientselected);
      console.log('final value ', "{IDS:" + this.patientinformationservice.patientselected + "}");
      this.test = ('{"IDs": "' + this.patientinformationservice.patientselected + '" }');
      console.log('test ', this.test);

      this.patientinformationservice.deletepatientsetuppatientlist(this.test).subscribe(x => {
        console.log("delete", x);
        this.toastr.success('Delete Patient successfully');
        location.reload();
        this.patientinformationservice.patientselected = [];

      });
    }
   

  }

  actionHandlerPatient(event) {
    console.log(event.target)
    
    if (event == "checked") {
      console.log("11")
    }

    if (event == "checked") {
      console.log("11")
    }
    //console.log(event.target.value)
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.auth.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    this.auth.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          
          if (data != null) {
            if (data != undefined) {
              if (data.length > 0) {

                if (data[0].PermissionType == "Read and Modify") {
                  this.btnBar.enableAction('add');
                  this.btnBar.enableAction('edit');
                  this.btnBar.enableAction('delete');
                  //this.btnBar.enableAction('active');
                  //this.btnBar.enableAction('inactive');
                }
                else {
                  this.btnBar.disableAction('add');
                  this.btnBar.disableAction('edit');
                  this.btnBar.disableAction('delete');
                  this.btnBar.disableAction('active');
                  this.btnBar.disableAction('inactive');

                }

              }
              else {
                
                //this.btnBar.disableAction('add');
                //this.btnBar.disableAction('edit');
                //this.btnBar.disableAction('delete');
                //this.btnBar.disableAction('active');
                //this.btnBar.disableAction('inactive');
              }
            }
            else {
              console.log("aawqwq")
              //this.btnBar.disableAction('add');
              //this.btnBar.disableAction('edit');
              //this.btnBar.disableAction('delete');
              //this.btnBar.disableAction('active');
              //this.btnBar.disableAction('inactive');
            }
          }
          else {

            
            //this.btnBar.disableAction('add');
            //this.btnBar.disableAction('edit');
            //this.btnBar.disableAction('delete');
            //this.btnBar.disableAction('active');
            //this.btnBar.disableAction('inactive');
          }
        }
      });

  }

  selectCheckBox(e: any) {

    //console.log(e)
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

  // Patient List Grid

  customSort(event) {
    this.patientModel.sortColumn = event.active;
    this.patientModel.sortOrder = event.direction.toLocaleUpperCase();
    this.getdata();
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


  getdataOnLoad() {
    this.patientModel.filterOn = this.filterValue;
    this.selection.clear();
    this.datamodel.push(Object.assign({}, this.patientModel));
    this.isAllSelected = false;
    this.patientModel.sortOrder = "desc";
    this.patientinformationservice.getpatientlistAll(this.patientModel).subscribe(
      result => {
        this.dataSource.data = result.data;
      });
  }

  getdata() {

    this.patientModel.filterOn = this.filterValue;
    this.selection.clear();
    this.datamodel.push(Object.assign({}, this.patientModel));
    this.isAllSelected = false;
     this.patientinformationservice.getpatientlistAll(this.patientModel).subscribe(
      result => {
        this.dataSource.data = result.data;
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
      this.EnableDisableButton(false);

      //this.changingPatientValue.next(iDs);
      localStorage.setItem("AddedPatientList", iDs);
      this.patientinformationservice.getpatientsetuplist(iDs);
    }
    else {
      this.EnableDisableButton(true);
      //this.changingPatientValue.next(null);
      localStorage.removeItem("AddedPatientList");
      this.patientinformationservice.getpatientsetuplist(null);
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

    //var list: String[] = [];

    //if (e.checked == true) {
    //  this.ItemList.push(selectedData);

    //}
    //if (e == 'row') {
    //  this.ItemList.push(selectedData);
     
    //}
    //else {

    //  this.ItemList = this.ItemList.filter(m => m != selectedData);

    //}

    //this.patientinformationservice.patientselected = [];

    //for (let i = 0; i < this.ItemList.length; i++) {

    //  list.push(this.ItemList[i].id.toString());

    //}

    ////this.topButtonBarService.getAction().subscribe(action => {

    //var temp = list.join(",");
    ////this.changingPatientValue.next(temp);
    //localStorage.setItem("AddedPatientList", temp);
    ////this.checkButtonState.next(temp)
    //if (list.length > 0) {
    //  this.EnableDisableButton(false);
    //}
    //else {
    //  this.EnableDisableButton(true);
    //}
    //this.patientinformationservice.getpatientsetuplist(temp);

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

  getPageSize() {

    this.selection.clear();
    this.patientModel2 = this.Data();
    this.patientinformationservice.getpatientlistAll2(this.patientModel2).subscribe(
      result => {
        this.List = result.data;

        this.patientModel.itemsLength = this.List.length;
        //this.dataSource.data = result.data;

      });
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
