import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.css']
})
export class ChargeListComponent implements OnInit {

  displayedColumns = ['selectRow', 'Buspartner', 'Customer', 'Locfro', 'Tolocation', 'Material', 'Shipment', 'Invoiceamount', 'Claimamount', 'Claimqunatity', 'FReamount', 'Aproved', 'Invnumber', 'Satatusdate', 'Status', 'Aprovedcomnt'];
  displayedColumnsReplace = ['selectRow', 'key_Buspart', 'key_Cusloc', 'key_Fromloc', 'key_Tolocation', 'key_Meterail', 'key_Shipqunt', 'key_Invamount', 'key_Claimquant', 'key_Claimamount', 'key_Recamount', 'key_Approvedmount', 'key_Invnumber', 'key_StatusDate', 'key_Statusgrd','key_ApproverComment'];

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
  Buspartner: string;
  Customer: string;
  Locfro: string;
  Tolocation: string;
  Material: string;
  Shipment: string;
  Invoiceamount: string;
  Claimamount: string;
  Claimqunatity: string;
  FReamount: string;
  Aproved: string;
  Invnumber: string;
  Satatusdate: string;
  Status: string;
  Aprovedcomnt: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
];
