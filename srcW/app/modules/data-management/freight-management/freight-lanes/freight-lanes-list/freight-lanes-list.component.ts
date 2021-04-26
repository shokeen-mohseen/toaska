import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-freight-lanes-list',
  templateUrl: './freight-lanes-list.component.html',
  styleUrls: ['./freight-lanes-list.component.css']
})
export class FreightLanesListComponent implements OnInit {

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

  displayedColumns = ['selectRow', 'Fromcountry', 'Fromstate', 'Fromcity', 'Fromzip', 'Tocountry', 'Tostate', 'Tocity', 'Tozip',  'FreightMode', 'BusinessPartner', 'CarrierSCAC', 'Rateper', 'DistanceMiles', 'Traveltime', 'Equipmenttype'];
  displayedColumnsReplace = ['selectRow', 'key_Fromcountry', 'key_Fromstate', 'key_Fromcity', 'key_Fromzip', 'key_Tocountry', 'key_Tostate', 'key_Tocity', 'key_Tozip', 'key_FreightMode', 'key_BusinessPartner', 'key_CarrierSCAC', 'key_Rateper', 'key_DistanceMiles', 'key_Traveltime','key_Equipmenttype'];
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

  constructor() { } 
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';  

  } 

}
export interface PeriodicElement {
  selectRow: string;
  Fromcountry: string;
  Fromstate: string;
  Fromcity: string;
  Fromzip: string;
  Tocountry: string;
  Tostate: string;
  Tocity: string;
  Tozip: string;
  FreightMode: string;
  BusinessPartner: string;
  CarrierSCAC: string;
  Rateper: string;
  DistanceMiles: string;
  Traveltime: string;
  Equipmenttype: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

  { selectRow: '', Fromcountry: '', Fromstate: '', Fromcity: '', Fromzip: '', Tocountry: '', Tostate: '', Tocity: '',  Tozip:'', FreightMode: '', BusinessPartner: '', CarrierSCAC: '', Rateper: '', DistanceMiles: '', Traveltime: '', Equipmenttype: '' },
 
];
