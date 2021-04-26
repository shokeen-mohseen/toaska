import { Component, ViewChild, OnInit, Input } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { AuthService } from '@app/core/services';
import { ContractService } from '@app/core/services/contract.service';
import { DatePipe } from '@angular/common';
import { ContractCommonDataService } from '../../../../../../../core/services/contract-common-data.service';
import { ContractLineItemDetails } from '../../../../../../../core/models/contract.model';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css'],
  providers: [DatePipe]
})
export class ViewItemComponent implements OnInit {


  ELEMENT_DATA: ContractLineItemDetails[] = [];
  displayedColumns = ['material', 'charge', 'commodity', 'rateType', 'rate', 'uom', 'quantity_per_UOM', 'sales_Tax_Price',
    'methodType', 'showOnBOL', 'autoAdded', 'addPallet', 'priceIncreaseMethod', 'effectiveStartStr', 'effectiveEndStr'];

  displayedColumnsReplace = ['key_Material', 'key_Charge', 'key_Commodity',
    'key_RateType', 'key_Rate', 'key_UOM', 'key_Quantityuom', 'key_SalesTax',
    'key_Pricetype', 'key_ShowOnBOL', 'key_AutoAdded', 'key_Addpalet', 'key_Priceinc', 'key_EffectiveStart', 'key_EffectiveEnd'];

  dataSource = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA);
  selection = new SelectionModel<ContractLineItemDetails>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  async ngAfterViewInit() {
    //if (this.contractService.ID != null) {
    //  await this.FillData();
    //}
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

  selectRow: any;
  ShowOnBOL: any;
  AutoAdded: any;
  AddPallet: any;

  constructor(private authService: AuthService, private contractService: ContractService, private datepipe: DatePipe, private contractcommondata: ContractCommonDataService) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.ShowOnBOL = 'ShowOnBOL';
    this.AutoAdded = 'AutoAdded';
    this.AddPallet = 'AddPallet';
  }


  async FillData() {
    this.ELEMENT_DATA = [];
    if (this.contractcommondata.FinalContractData != undefined && this.contractcommondata.FinalContractData.lineItems != undefined && this.contractcommondata.FinalContractData.lineItems.length > 0) {
      this.ELEMENT_DATA = this.contractcommondata.FinalContractData.lineItems;
    }
    this.dataSource = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA);
    //this.dataSource.data = this.ELEMENT_DATA;
    this.dataSource._updateChangeSubscription();
  }

  clearContractLineItemViewGrid() {
    this.ELEMENT_DATA = [];
    if (this.contractcommondata.FinalContractData != undefined && this.contractcommondata.FinalContractData.lineItems != undefined && this.contractcommondata.FinalContractData.lineItems.length > 0) {

      this.contractcommondata.FinalContractData.lineItems.slice(0, this.contractcommondata.FinalContractData.lineItems.length);
    }
    
    this.dataSource = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA);
    
    this.dataSource._updateChangeSubscription();
  }

}
