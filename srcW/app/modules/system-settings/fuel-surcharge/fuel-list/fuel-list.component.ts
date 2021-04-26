import { Component, ViewChild, OnInit ,Output,Input, EventEmitter} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { FuelChargeIndex } from '../../../../core/models/FuelChargeIndex.model';
import { FuelPriceService } from '../../../../core/services/fuel-price.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fuel-list',
  templateUrl: './fuel-list.component.html',
  styleUrls: ['./fuel-list.component.css']
})
export class FuelListComponent implements OnInit {
  displayedColumns = ['selectRow', 'fuelPriceType', 'fromFuelPrice', 'toFuelPrice', 'fuelPriceUom', 'chargeRateUom', 'chargeRatePerMile', 'effectiveStartDate', 'effectiveEndDate'];
  displayedColumnsReplace = ['selectRow', 'key_FuelPriceType', 'key_FromFuelPrice', 'key_ToFuelPrice', 'key_FuelPriceUOM', 'key_ChargeRateUOM', 'key_PerMileCharge', 'key_EffectiveStart', 'key_EffectiveEnd'];
  dataSource;
  selection = new SelectionModel<FuelChargeIndex>(true, []);
  paginationModel = new FuelChargeIndex();
  ItemList: FuelChargeIndex[];
  filterValue = "";
  fuelChargeAdditional;
  carrierFuelSurCharge;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('selectedFuelCharges') selectedFuelCharges = new EventEmitter();
  @Input('fuelChargeToSelect') fuelChargeToSelect: FuelChargeIndex[];
  constructor(private fuelPriceService: FuelPriceService, private toastrService: ToastrService) { }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.length = this.paginationModel.pageSize;
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
    if (this.isAllSelected()) {
      this.selection.clear()
    } else {
      this.selection.select(...this.dataSource.data);
      // this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this.selectedFuelCharges.emit(this.selection.selected);
  }
  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getFuelSurchargeIndexList();
  }
  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getFuelSurchargeIndexList();
    }
  }
  selectRow: any;
  Active: any;
  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.Active = 'Active';
    await this.getPageSize();
    this.getFuelSurchargeIndexList();
    this.fuelPriceService.getAdditionalFuelCharge('Customerfuelchargeadditionalpermilecharge').subscribe(result => {
      this.fuelChargeAdditional = result.data.preferenceValue;
    });
    this.fuelPriceService.getAdditionalFuelCharge('Carrierfuelsurchargeadditionalpermilecharge').subscribe(result => {
      this.carrierFuelSurCharge = result.data.preferenceValue;
    });
    this.dataSource = new MatTableDataSource<FuelChargeIndex>();
    this.ItemList = new Array<any>();
  }


  rowSelectionChange(row): void {
    this.selection.toggle(row);
    this.selectedFuelCharges.emit(this.selection.selected);
  }
  getFuelSurchargeIndexList() {

    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.fuelPriceService.getAllFuelSurchargeIndexList(this.paginationModel)
      .subscribe(result => {
        this.dataSource.data = result.data;
        this.setRowSelection();
      }
      );

  }

  
  setRowSelection() {
    if (this.fuelChargeToSelect && this.fuelChargeToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.fuelChargeToSelect.findIndex(item => item.id === row.id) >= 0) {
          this.selection.select(row);
          row.isSelected = true;
        }
        else {
          this.selection.deselect(row);
          row.isSelected = false;
        }
      });
    }
  }
  async getPageSize() {
    this.fuelPriceService.getFuelSurchargeIndexList()
      .subscribe(result => {
        this.paginationModel.itemsLength = result.recordCount;
      }
      );
    // default page size
    this.paginationModel.pageSize = await this.fuelPriceService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }
  onSelectionChange(row: FuelChargeIndex, checked: boolean) {

    row.isSelected = checked;
    this.selection.toggle(row);

    if (checked == true) {
      this.ItemList.push(row);
      console.log('checked', row)
    }
    else {
      console.log('unchecked', row)
      this.ItemList = this.ItemList.filter(m => m != row);
    }
    this.selectedFuelCharges.emit(this.selection.selected);
  }

  deleteFuelSurchargeList(ItemList: FuelChargeIndex[]) {

    
    if (this.selection.selected.length < 0) {
      this.toastrService.warning('Please select atleast one record');
    }
    else {
      const ids = ItemList.map(i => i.id).join(',');
      this.fuelPriceService.deleteAllFuelSurchargeIndex(ids).subscribe(x => {
        console.log("delete", x);

        const newList = this.dataSource.data.filter(item => !ItemList.includes(item as any))
        this.fuelPriceService.getAllFuelSurchargeIndexList(this.paginationModel)
          .subscribe(result => {
            this.dataSource.data = result.data;
            this.toastrService.success('Record(s) Deleted Successfully');
            this.getFuelSurchargeIndexList();
          }
          );

      });
    }
  }
}
