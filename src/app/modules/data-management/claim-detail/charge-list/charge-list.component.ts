import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { ClaimService } from '../../../../core/services/claim.service';
import { ClaimFilterData, Claim } from '../../../../core/models/claim.model';
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
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
  ID: number;
  ClaimID: number;
  DStausID: number;
  DChargeID: number;
}
//const ELEMENT_DATA: PeriodicElement[] = [

//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '0', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '185.00', FReamount: '185.00', Aproved: '185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '', ID: 0, ClaimID:0, DStausID: 8, DChargeID: 1 },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '0', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '185.00', FReamount: '185.00', Aproved: '185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '', ID: 0, ClaimID:0, DStausID: 8, DChargeID: 1},
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '0', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '185.00', FReamount: '185.00', Aproved: '185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '', ID: 0, ClaimID: 0, DStausID: 8, DChargeID: 1 },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '0', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '185.00', FReamount: '185.00', Aproved: '185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '', ID: 0, ClaimID: 0, DStausID: 8, DChargeID: 1 },
// ];

@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.css']
})
export class ChargeListComponent implements OnInit {

  displayedColumns = ['selectRow', 'Buspartner', 'Customer', 'Locfro', 'Tolocation', 'Material', 'Shipment', 'Invoiceamount', 'Claimamount', 'Claimqunatity', 'FReamount', 'Aproved', 'Invnumber', 'Satatusdate', 'Status', 'Aprovedcomnt'];
  displayedColumnsReplace = ['selectRow', 'key_Buspart', 'key_Cusloc', 'key_Fromloc', 'key_Tolocation', 'key_Meterail', 'key_Shipqunt', 'key_Invamount', 'key_Claimquant', 'key_Claimamount', 'key_Recamount', 'key_Approvedmount', 'key_Invnumber', 'key_StatusDate', 'key_Statusgrd','key_ApproverComment'];
  //dataSource = new MatTableDataSource<ClaimFilterData>();
  //selection = new SelectionModel<ClaimFilterData>(true, []);
  
 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ClaimObject: Claim = new Claim();
  // @Input() ClaimFilterDataList: ClaimFilterData[] = [];
  IsEdit: boolean = false;
  ClaimStatusList = [];
  ChargetList: any = [];
  ClaimsDetails: any;
  IsInvoiced: boolean = true;
  IsShipped: boolean = true;

  dataSource = new MatTableDataSource<ClaimFilterData>();
  //dataSource = new MatTableDataSource<ClaimFilterData>(this.ClaimsDetails);
  selection = new SelectionModel<ClaimFilterData>(true, []);



  //dataSource = new MatTableDataSource<ClaimFilterData>();
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.FillData();
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
  constructor(private claimservice: ClaimService, private auth: AuthService, private toastrService: ToastrService) { }
  selectRow: any;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ClaimFilterData>();
    this.ClaimObject.ClientId = this.auth.currentUserValue.ClientId;
    this.ClaimObject.UpdatedBy = this.auth.currentUserValue.LoginId;
    //this.FillData();
    this.GetClaimStatus();

    this.selectRow = 'selectRow';
  }
/*  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }*/

  FillData() {
    this.IsEdit = false;
    this.ClaimsDetails = [];
    this.dataSource = new MatTableDataSource<ClaimFilterData>();

    this.ClaimsDetails = this.claimservice.ClaimFilterDataList;
    this.dataSource = new MatTableDataSource<ClaimFilterData>(this.ClaimsDetails);
    
    
  }

  GetCharge(ClientID: number, Category: number) {
    if (this.dataSource.data.length == 0) {
      this.toastrService.warning('Please select at least one record.');
      return;
    }
    this.claimservice.GetCharge(ClientID, Category)
      .subscribe(res => {

        //res.forEach((value, index) => {
        //  this.ChargetList.push({ "id": value.id, "itemName": value.name });
        //});
        this.ChargetList = res.data;
        //let ClaimStatus = res.find(d => d.Code == "Open");
        // this.ClaimStatusSelected.push({ "id": ClaimStatus.id, "itemName": ClaimStatus.itemName });
      });
  }

  GetClaimStatus() {
    this.claimservice.GetClaimStatus(this.ClaimObject)
      .subscribe(res => {
        
        var Data = res;

        if (Data.length > 0) {
          for (var i = 0; i < Data.length; i++) {
            if (Data[i].itemName == "Denied" || Data[i].itemName == "Open" || Data[i].itemName == "Approved") {
              this.ClaimStatusList.push({ "id": Data[i].id, "itemName": Data[i].itemName });
            }
          }
        }
       

        
      });
  }

  onSelectionChange(event: Event, checked: boolean) {
    
    for (var j = 0; j < this.ClaimsDetails.length; j++) {
      if (Number(this.ClaimsDetails[j].ID) == Number(event)) {
        if (checked) {
          this.ClaimsDetails[j].IsDeleted = Number(1);
        }
        else {
          this.ClaimsDetails[j].IsDeleted = Number(0);
        }
      }
    }
  }

  onSelectAll(checked: boolean) {
    ;
    if (checked) {
      for (var j = 0; j < this.ClaimsDetails.length; j++) {

        this.ClaimsDetails[j].IsDeleted = Number(1);
      }
    }
    else {
      for (var j = 0; j < this.ClaimsDetails.length; j++) {

        this.ClaimsDetails[j].IsDeleted = Number(0);
      }
        
      }
  }
  
  numberOnly(event): boolean {
    //const charCode = (event.which) ? event.which : event.keyCode;
    //if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //  return false;
    //}
    return true;
  }
  QuantityValidation(event): boolean {
    const charcode = (event.which) ? event.which : event.keycode;
    if (charcode > 31 && (charcode == 46)) {
      return false;
    }
    return true;
  }
}


//const ELEMENT_DATA: PeriodicElement[] = [
  
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//  { selectRow: '', Buspartner: '', Customer: 'Wilkinson', Locfro: '', Tolocation: '', Material: 'Pallet charge', Shipment: '', Invoiceamount: '0.00', Claimqunatity: '00', Claimamount: '-185.00', FReamount: '-185.00', Aproved: '-185.00', Invnumber: '', Satatusdate: '17-09-2020', Status: 'Approved', Aprovedcomnt: '' },
//];

