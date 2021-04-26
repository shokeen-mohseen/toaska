import { Component, ViewChild, OnInit, Input } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { AuthService } from '@app/core/services';
import { ContractService } from '@app/core/services/contract.service';


@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {

  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns = ['selectRow','Material', 'Charge', 'Commodity', 'RateType', 'Rate', 'UOM', 'Quantity_per_UOM', 'Sales_Tax_Price', 
'MethodType', 'ShowOnBOL', 'AutoAdded', 'AddPallet', 'PriceIncreaseMethod', 'EffectiveStart', 'EffectiveEnd'];

  displayedColumnsReplace = ['selectRow', 'key_Material', 'key_Charge', 'key_Commodity',
    'key_RateType', 'key_Rate', 'key_UOM', 'key_Quantityuom', 'key_SalesTax',
    'key_Pricetype', 'key_ShowOnBOL', 'key_AutoAdded', 'key_Addpalet', 'key_Priceinc', 'key_EffectiveStart', 'key_EffectiveEnd'];

  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() savedData2: any;
  //@Input() addRef: AddItemComponent; 

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
  selectRow: any;
  ShowOnBOL: any;
  AutoAdded: any;
  AddPallet: any;

  constructor(private authService: AuthService, private contractService: ContractService) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.ShowOnBOL = 'ShowOnBOL';
    this.AutoAdded = 'AutoAdded';
    this.AddPallet = 'AddPallet';
    setTimeout(() => {
      if (this.savedData2 != null) {
        this.FillData();
      }
    }, 5000);
  }

  FillData() {
    this.savedData2 = this.contractService.savedData;
    var ClientId = this.authService.currentUserValue.ClientId;
    var ContractTypeId = Number(this.savedData2.contractTypeId);
    var ParentId = Number(this.savedData2.id);
    this.contractService.getContractDetails(ClientId, ContractTypeId, ParentId)
      .subscribe(res => {
        if (res.message == "Success") {
          res.data.forEach((value, index) => {
            this.ELEMENT_DATA.push({
              Id: value.id, Material: value.material,
              Charge: value.charge,
              Rate: value.rate,
              RateType: value.rateType,
              UOM: value.uom,
              Quantity_per_UOM: value.quantity_per_UOM,
              Commodity: value.commodity,
              Sales_Tax_Price: value.sales_Tax_Price,
              PriceIncreaseMethod: value.priceIncreaseMethod,
              ShowOnBOL: value.showOnBOL == 1 ? 'Yes' : 'No',
              AutoAdded: value.isRequired == 1 ? 'Yes' : 'No',
              AddPallet: value.addPallet == 1 ? 'Yes' : 'No',
              MethodType: value.methodType,
              EffectiveStart: value.effectiveStart,
              EffectiveEnd: value.effectiveEnd
            })
          })

          this.dataSource = new MatTableDataSource<PeriodicElement>();
          this.dataSource.data = this.ELEMENT_DATA;
          
        }
      });
  }

}


export interface PeriodicElement {
  Id: number;
  Material: string;
  Charge: string;
  Commodity: string;
  RateType: string;
  Rate: string;
  UOM: string;
  Quantity_per_UOM: string;
  Sales_Tax_Price: string;  
  MethodType: string;
  ShowOnBOL: string;
  AutoAdded: string;
  AddPallet: string;
  PriceIncreaseMethod: string;
  EffectiveStart: string;
  EffectiveEnd: string;
}

//const ELEMENT_DATA: PeriodicElement[] = [];
  //{ Material: 'Material', Charge: 'Bagging Charge', Commodity: 'Commodity', RateType: 'Per Pallet', Rate: '3000', UOM: 'US Dollar Currency', Quantity_per_UOM: '1', Sales_Tax_Price: 'Non-Taxable', MethodType: 'Billable', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: 'TOSCA Based', EffectiveStart: '	01/15/2019', EffectiveEnd:'11/15/2019' },
  //{ Material: 'Material', Charge: 'Bagging Charge', Commodity: '', RateType: 'Per Pallet', Rate: '3000', UOM: 'US Dollar Currency', Quantity_per_UOM: '1', Sales_Tax_Price: 'Non-Taxable', MethodType: 'Billable', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: 'TOSCA Based', EffectiveStart: '	01/15/2019', EffectiveEnd: '12/15/2019' },
  //{ Material: '', Charge: 'Bagging Charge', Commodity: '', RateType: 'Per Pallet', Rate: '3000', UOM: 'US Dollar Currency', Quantity_per_UOM: '1', Sales_Tax_Price: 'Non-Taxable', MethodType: 'Billable', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: 'TOSCA Based', EffectiveStart: '	01/15/2019', EffectiveEnd: '13/15/2019' },
  //{ Material: '', Charge: 'Bagging Charge', Commodity: '', RateType: 'Per Pallet', Rate: '3000', UOM: 'US Dollar Currency', Quantity_per_UOM: '1', Sales_Tax_Price: 'Non-Taxable', MethodType: 'Billable', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: 'TOSCA Based', EffectiveStart: '	01/15/2019', EffectiveEnd: '14/15/2019' },

  //{ Material: '', Charge: 'Bagging Charge', Commodity: '', RateType: 'Per Pallet', Rate: '3000', UOM: 'US Dollar Currency', Quantity_per_UOM: '1', Sales_Tax_Price: 'Non-Taxable', MethodType: 'Billable', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: 'TOSCA Based', EffectiveStart: '	01/15/2019', EffectiveEnd: '02/15/2019' },

  //{ Material: '', Charge: 'Bagging Charge', Commodity: '', RateType: 'Per Pallet', Rate: '3000', UOM: 'US Dollar Currency', Quantity_per_UOM: '1', Sales_Tax_Price: 'Non-Taxable', MethodType: 'Billable', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: 'TOSCA Based', EffectiveStart: '	01/15/2019', EffectiveEnd: '05/15/2019' },

  //];
