import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { ModalEquipmentTypeComponent } from '../modal-equipment-type/modal-equipment-type.component';

@Component({
  selector: 'app-equipment-class-list',
  templateUrl: './equipment-class-list.component.html',
  styleUrls: ['./equipment-class-list.component.css']
})
export class EquipmentClassListComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";
  modalRef: NgbModalRef;
  Equipmentclscode: any;
  Equipmentclsdec: any;
  Equipmenttype: any; 

  displayedColumns = ['selectRow', 'Equipmentclscode', 'Equipmentclsdec', 'Equipmenttype'];
  displayedColumnsReplace = ['selectRow', 'key_Equipmentclscode', 'key_Equipmentclsdec', 'Key_EquipmentType'];
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
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Equipmentclscode = 'Equipmentclscode';
    this.Equipmentclsdec = 'Equipmentclsdec';
    this.Equipmenttype = 'Equipmenttype';
    
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
  openequipmentType() {
    this.modalRef = this.modalService.open(ModalEquipmentTypeComponent, { size: 'lg', backdrop: 'static' });
  }
}



export interface PeriodicElement {
  selectRow: string;
  Equipmentclscode: string;
  Equipmentclsdec: string;
  Equipmenttype: string;  
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Equipmentclscode: 'Line', Equipmentclsdec: 'Line', Equipmenttype: '' },
  { selectRow: '', Equipmentclscode: 'Printer', Equipmentclsdec: 'Printer', Equipmenttype: '' },
  { selectRow: '', Equipmentclscode: 'Bagger', Equipmentclsdec: 'Bagger', Equipmenttype: '' }
];
