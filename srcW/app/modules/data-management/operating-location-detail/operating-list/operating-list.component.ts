import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-operating-list',
  templateUrl: './operating-list.component.html',
  styleUrls: ['./operating-list.component.css']
})
export class OperatingListComponent implements OnInit {
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

  displayedColumns = ['selectRow', 'Function', 'Group', 'Billing', 'Locdec', 'Citystate', 'Masinventory', 'Active', 'Setupdone', 'Setupdate', 'Lastupdate'];
  displayedColumnsReplace = ['selectRow', 'key_Function', 'key_Group', 'key_BillingEntity', 'key_LocationDescription', 'key_Citystate', 'key_MASInventoryWarehouse',  'key_Active', 'key_SetupDone', 'key_Setupdate', 'key_Lastupdated'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  isLinear = false;

  modalRef: NgbModalRef;
  selectRow: any;
  Active: any;
  Setupdone: any;
  constructor(public modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Active = 'Active';
    this.Setupdone = 'Setupdone';
  }
 
}
export interface PeriodicElement {
  selectRow: string;
  Function: string;
  Group: string;
  Billing: string;
  Locdec: string;
  Citystate: string;
  Masinventory: string;
  Active: string;
  Setupdone: string;
  Setupdate: string;
  Lastupdate: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Function: 'Other', Group: 'Tosca ltd.', Billing: 'Tosca ltd.', Locdec: 'Tosca ltd. atlanta', Citystate: 'Green Bay', Masinventory: 'N/A', Active: '', Setupdone: '', Setupdate: '31/08/2020 07:00 AM', Lastupdate: 'Interface' },
  { selectRow: '', Function: 'Other', Group: 'Tosca ltd.', Billing: 'Tosca ltd.', Locdec: 'Tosca ltd. atlanta', Citystate: 'Green Bay', Masinventory: 'N/A', Active: '', Setupdone: '', Setupdate: '31/08/2020 07:00 AM', Lastupdate: 'Interface' },
  { selectRow: '', Function: 'Other', Group: 'Tosca ltd.', Billing: 'Tosca ltd.', Locdec: 'Tosca ltd. atlanta', Citystate: 'Green Bay', Masinventory: 'N/A', Active: '', Setupdone: '', Setupdate: '31/08/2020 07:00 AM', Lastupdate: 'Interface' },
  { selectRow: '', Function: 'Other', Group: 'Tosca ltd.', Billing: 'Tosca ltd.', Locdec: 'Tosca ltd. atlanta', Citystate: 'Green Bay', Masinventory: 'N/A', Active: '', Setupdone: '', Setupdate: '31/08/2020 07:00 AM', Lastupdate: 'Interface' },
  { selectRow: '', Function: 'Other', Group: 'Tosca ltd.', Billing: 'Tosca ltd.', Locdec: 'Tosca ltd. atlanta', Citystate: 'Green Bay', Masinventory: 'N/A', Active: '', Setupdone: '', Setupdate: '31/08/2020 07:00 AM', Lastupdate: 'Interface' },
  { selectRow: '', Function: 'Other', Group: 'Tosca ltd.', Billing: 'Tosca ltd.', Locdec: 'Tosca ltd. atlanta', Citystate: 'Green Bay', Masinventory: 'N/A', Active: '', Setupdone: '', Setupdate: '31/08/2020 07:00 AM', Lastupdate: 'Interface' },

];
