import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

import { AddComplicationsComponent } from '../../../../../../shared/components/modal-content/add-complications/add-complications.component';

export interface PeriodicElement {
  SrNo: string;
  ncap: string;
  DateTime: string;
  DateTime1: string;
  DateTime2: string;
  Action: string;
  Add_New: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { SrNo: '1', ncap: 'Feeding/Oral Care/Back Care', DateTime: '', DateTime1: '', DateTime2: '',  Action: '', Add_New: '' },
  { SrNo: '2', ncap: 'Suction/Tracheostomy care', DateTime: '', DateTime1: '', DateTime2: '',  Action: '', Add_New: '' },
  { SrNo: '3', ncap: 'Enema', DateTime: '', DateTime1: '', DateTime2: '',  Action: '', Add_New: '' },
  { SrNo: '4', ncap: 'Bladder Wash', DateTime: '', DateTime1: '', DateTime2: '',  Action: '', Add_New: '' },
  { SrNo: '5', ncap: 'Dressing Minor/Major', DateTime: '', DateTime1: '', DateTime2: '',  Action: '', Add_New: '' },
  { SrNo: '6', ncap: 'Slab/Cast Application', DateTime: '', DateTime1: '', DateTime2: '',  Action: '', Add_New: '' },
  { SrNo: '7', ncap: 'Abdominal Girth', DateTime: '', DateTime1: '', DateTime2: '',  Action: '', Add_New: '' },
  { SrNo: '8', ncap: 'Other Procedure(Specify)', DateTime: '', DateTime1: '', DateTime2: '',  Action: '', Add_New: '' },
  
];

@Component({
  selector: 'app-nursing-care-activity',
  templateUrl: './nursing-care-activity.component.html',
  styleUrls: ['./nursing-care-activity.component.css']
})
export class NursingCareActivityComponent implements OnInit {

  modalRef: NgbModalRef;
  Action: any;
  Add_New: any;

  displayedColumns = ['SrNo', 'ncap', 'DateTime', 'DateTime1', 'DateTime2', 'Action', 'Add_New'];
  displayedColumnsReplace = ['Key_SrNo', 'key_ncap', 'key_DateTime', 'key_DateTime', 'key_DateTime', 'key_Action', 'key_addnew'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

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

  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
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


  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

}
