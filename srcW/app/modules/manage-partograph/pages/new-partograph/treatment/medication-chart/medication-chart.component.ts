import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddComplicationsComponent } from '../../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { TreatmentService } from '../../../../services/treatment.service';
import { User, AuthService } from '../../../../../../core';
import { MedicationChartData } from '../../../../modals/treatment';
import { ServerChartValues } from '../../../../modals/input-chart';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  SrNo: string;
  ndmi: string;
  Dose: string;
  Route: string;
  DateTime: string;
  DateTime1: string;
  DateTime2: string;
  Action: string;
  Add_New: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { SrNo: '1', ndmi: 'Demo', Dose: 'Demo', Route: '', DateTime: 'Demo', DateTime1: 'Demo', DateTime2: 'Demo', Action: '', Add_New: '' },
  { SrNo: '1', ndmi: 'Demo', Dose: 'Demo', Route: '', DateTime: 'Demo', DateTime1: 'Demo', DateTime2: 'Demo', Action: '', Add_New: '' },
  { SrNo: '1', ndmi: 'Demo', Dose: 'Demo', Route: '', DateTime: 'Demo', DateTime1: 'Demo', DateTime2: 'Demo', Action: '', Add_New: '' }
];


@Component({
  selector: 'app-medication-chart',
  templateUrl: './medication-chart.component.html',
  styleUrls: ['./medication-chart.component.css']
})
export class MedicationChartComponent implements OnInit {
  tempList: PeriodicElement[] = [];
  modalRef: NgbModalRef;
  Action: any;
  Add_New: any;
  displayedColumns = ['id', 'nameOfDrugMedicineInjection', 'dose', 'route', 'dateTime1', 'dateTime2', 'Action', 'Add_New'];
  displayedColumnsReplace = ['Key_SrNo', 'key_ndmi', 'key_Dose', 'key_Route', 'key_DateTime', 'key_DateTime', 'key_Action', 'key_addnew'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  currentUser: User;
  medicationDate: MedicationChartData;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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


  constructor(public modalService: NgbModal, private treatmentService: TreatmentService, private authenticationService: AuthService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.medicationDate = { ClientId: this.currentUser.ClientId } as MedicationChartData;
    this.medicationDate.PartographId = ServerChartValues.GetPartpgraphId();
    this.LoadMedicationChartData(this.medicationDate);
  }

  ngOnInit(): void {
    this.tempList = [];
    this.Action = 'Action';
    this.Add_New = 'Add_New';
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

  LoadMedicationChartData(baseView) {
    this.treatmentService.GetMedicationChartData(baseView).subscribe(data => {
      if (data.data != false) {
        this.tempList = data.data;
        this.tempList.reverse();
        this.dataSource.data = this.tempList;
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

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

}
