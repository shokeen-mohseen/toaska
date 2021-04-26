import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';

@Component({
  selector: 'app-organization-type-group',
  templateUrl: './organization-type-group.component.html',
  styleUrls: ['./organization-type-group.component.css']
})
export class OrganizationTypeGroupComponent implements OnInit {
  displayedColumns = ['selectRow', 'Sequence', 'Organizationlbl', 'Updatedatetime', 'lastupdate'];
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

  btn: any;
  issue: any;
  profile: any;
  IsTosca: boolean;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  constructor() { }

  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
  }

}
export interface PeriodicElement {
  selectRow: string;
  Sequence: string;
  Organizationlbl: string;
  Updatedatetime: string; 
  lastupdate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Sequence: '1', Organizationlbl: 'Client', Updatedatetime: '01/23/2017 06:00 PM',  lastupdate: 'lampsdemo' },
  { selectRow: '', Sequence: '1', Organizationlbl: 'Client', Updatedatetime: '01/23/2017 06:00 PM',  lastupdate: 'lampsdemo' },
  { selectRow: '', Sequence: '1', Organizationlbl: 'Client', Updatedatetime: '01/23/2017 06:00 PM',  lastupdate: 'lampsdemo' },
  { selectRow: '', Sequence: '1', Organizationlbl: 'Client', Updatedatetime: '01/23/2017 06:00 PM',  lastupdate: 'lampsdemo' },
  { selectRow: '', Sequence: '1', Organizationlbl: 'Client', Updatedatetime: '01/23/2017 06:00 PM',  lastupdate: 'lampsdemo' },
  { selectRow: '', Sequence: '1', Organizationlbl: 'Client', Updatedatetime: '01/23/2017 06:00 PM',  lastupdate: 'lampsdemo' },
  { selectRow: '', Sequence: '1', Organizationlbl: 'Client', Updatedatetime: '01/23/2017 06:00 PM',  lastupdate: 'lampsdemo' },
 

];
