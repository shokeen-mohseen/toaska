import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  Datetime: string;
  Location: string;
  Equipment: string;
  MaterialCode: number;
  MaterialDescription: string;
  Batch: string;
  Lot: string;
  Team: string;
  Shift: string;
  QuantityProduced: string;
  QualityStatus: string;
  UpdatedBy: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Datetime: '',
    Location: '',
    Equipment: '',
    MaterialCode: 0,
    MaterialDescription: '',
    Batch: '',
    Lot: '',
    Team: '',
    Shift: '',
    QuantityProduced: '',
    QualityStatus: '',
    UpdatedBy: '',
  },
  {
    Datetime: '',
    Location: '',
    Equipment: '',
    MaterialCode: 0,
    MaterialDescription: '',
    Batch: '',
    Lot: '',
    Team: '',
    Shift: '',
    QuantityProduced: '',
    QualityStatus: '',
    UpdatedBy: '',
  },
];

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  selectRow: any;
  Datetime: any;
  Location: any;
  Equipment: any;
  MaterialCode: any;
  MaterialDescription: any;
  Batch: any;
  Lot: any;
  Team: any;
  Shift: any;
  QuantityProduced: any;
  QualityStatus: any;
  UpdatedBy: any;

  public dateFormat1: String = "MM-dd-yyyy HH:mm a";

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow'; 
    this.Datetime = 'Datetime'; 
    this.Location = 'Location'; 
    this.Equipment = 'Equipment'; 
    this.MaterialCode = 'MaterialCode'; 
    this.MaterialDescription = 'MaterialDescription'; 
    this.Batch = 'Batch'; 
    this.Lot = 'Lot'; 
    this.Team = 'Team'; 
    this.Shift = 'Shift'; 
    this.QuantityProduced = 'QuantityProduced'; 
    this.QualityStatus = 'QualityStatus'; 
    this.UpdatedBy = 'UpdatedBy'; 
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

  //material table code

  displayedColumns = ['selectRow', 'Datetime', 'Location', 'Equipment',
    'MaterialCode', 'MaterialDescription', 'Batch', 'Lot', 'Team', 'Shift',
    'QuantityProduced', 'QualityStatus', 'UpdatedBy'];

  displayedColumnsReplace = ['selectRow', 'key_Datetime', 'key_Location', 'key_Equipment',
    'key_Matcode', 'key_MaterialDesc', 'key_batchNo', 'key_lotNo', 'key_Team', 'key_Shift',
    'key_QuantityProduced', 'key_QualityStatus', 'key_Lastupdated'];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


}
