import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { AddCapabilitiesComponent } from '../add-capabilities/add-capabilities.component';

@Component({
  selector: 'app-capabilities-list',
  templateUrl: './capabilities-list.component.html',
  styleUrls: ['./capabilities-list.component.css']
})
export class CapabilitiesListComponent implements OnInit {

  modalRef: NgbModalRef;

  displayedColumns = ['selectRow', 'Location', 'Resourcetype', 'Resourcecode', 'Resourcecap','Defaultcap','Modifydate'];
  displayedColumnsReplace = ['selectRow', 'key_Location', 'key_Resoiurcetype', 'key_Resourcecode', 'key_Resourcecap', 'key_Defaultcap','key_Modifydate'];
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

  btnEdit = function () { this.router.navigateByUrl(''); };
  constructor(private router: Router, public modalService: NgbModal) { }


  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }
  openecapabilitiesAdd() {
    this.modalRef = this.modalService.open(AddCapabilitiesComponent, { size: 'lg', backdrop: 'static' });
  }
}
export interface PeriodicElement {
  selectRow: string;
  Location: string;
  Resourcetype: string;
  Resourcecode: string;
  Resourcecap: string;
  Defaultcap: string;
  Modifydate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Location: '', Resourcetype: '', Resourcecode: '', Resourcecap: '', Defaultcap: '', Modifydate:'' },
  
];
