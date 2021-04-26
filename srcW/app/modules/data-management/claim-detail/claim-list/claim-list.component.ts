import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.css']
})
export class ClaimListComponent implements OnInit {

  displayedColumns = ['selectRow', 'Claimstatus', 'ClaimFor', 'BillingEntity', 'customerr', 'BusinessPartner', 'Invamount', 'Claimamount', 'Approvedmount', 'Invnumber', 'Claimdate', 'Approvedby'];
  displayedColumnsReplace = ['selectRow', 'key_Claimstatus', 'key_ClaimFor', 'key_BillingEntity', 'key_customerr', 'key_BusinessPartner', 'key_Invamount', 'key_Claimamount', 'key_Approvedmount', 'key_Invnumber', 'key_Claimdate','key_Approvedby',];
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
}

export interface PeriodicElement {
  selectRow: string;
  Claimstatus: string;
  ClaimFor: string;
  BillingEntity: string;
  customerr: string;
  BusinessPartner: string;
  Invamount: string;
  Claimamount: string;
  Approvedmount: string;
  Invnumber: string;
  Claimdate: string;
  Approvedby: string; 
}

const ELEMENT_DATA: PeriodicElement[] = [
 
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
  { selectRow: '', Claimstatus: 'Approved', ClaimFor: 'CU-43', BillingEntity: 'Five Crown', customerr: 'Crown Cooling', BusinessPartner: '', Invamount: '0.00', Claimamount: '0.00', Approvedmount: '0.00', Invnumber: '', Claimdate: '17-09-2020', Approvedby: 'Angee' },
];
