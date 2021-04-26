import { Component, ViewChild, OnInit ,Output,Input, EventEmitter} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { FuelChargeIndex } from '../../../../core/models/FuelChargeIndex.model';
import { FuelPriceService } from '../../../../core/services/fuel-price.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService, PreferenceTypeService } from '../../../../core';
import { ManageFuelChargeStateService } from '../fuelcharge-state.service';

@Component({
  selector: 'app-fuel-list',
  templateUrl: './fuel-list.component.html',
  styleUrls: ['./fuel-list.component.css']
})
export class FuelListComponent implements OnInit {
  displayedColumns = ['selectRow', 'fuelPriceType', 'fromFuelPrice', 'toFuelPrice', 'fuelPriceUom', 'chargeRateUom', 'chargeRatePerMile'/*, 'effectiveStartDate', 'effectiveEndDate'*/];
  displayedColumnsReplace = ['selectRow', 'key_FuelPriceType', 'key_FromFuelPrice', 'key_ToFuelPrice', 'key_FuelPriceUOM', 'key_ChargeRateUOM', 'key_PerMileCharge'/*, 'key_EffectiveStart', 'key_EffectiveEnd'*/];
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
  constructor(private fuelPriceService: FuelPriceService, private toastrService: ToastrService,
    private authenticationService: AuthService, private manageFuelState: ManageFuelChargeStateService,
    public ptService: PreferenceTypeService,) { }


  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.length = this.paginationModel.pageSize;
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



  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getFuelSurchargeIndexList();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getFuelSurchargeIndexList();
    }
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

    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.selectRow = 'selectRow';
    this.Active = 'Active';
    this.dataSource = new MatTableDataSource<FuelChargeIndex>();
    this.ItemList = new Array<any>();
    await this.getPageSize();
    this.getFuelSurchargeIndexList();
    this.fuelPriceService.getAdditionalFuelCharge('Customerfuelchargeadditionalpermilecharge').subscribe(result => {
      this.fuelChargeAdditional = parseFloat(result.data.preferenceValue).toFixed(2);
    });
    this.fuelPriceService.getAdditionalFuelCharge('Carrierfuelsurchargeadditionalpermilecharge').subscribe(result => {
      this.carrierFuelSurCharge = parseFloat(result.data.preferenceValue).toFixed(2);
    });
    
  }
  async getPageSize() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.fuelPriceService.getAllFuelSurchargeIndexList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;

      });

    this.paginationModel.pageSize = await this.fuelPriceService.getDefaultPageSize();
  }

  
  getFuelSurchargeIndexList() {

    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.fuelPriceService.getAllFuelSurchargeIndexList(this.paginationModel)
      .subscribe(result => {

        
        result.data = result.data.map(row => {
          return { ...row, effectiveStartDate: new Date(row.effectiveStartDate), effectiveEndDate: new Date(row.effectiveEndDate) }
        });
        this.dataSource.data = result.data;
        let seletionsState = this.manageFuelState.seletedFuelCharges;
        if (seletionsState && seletionsState.length) {
          const seletedFuelChargesId = seletionsState.map(fuel => fuel.id);
          this.selection.select(...this.dataSource.data.filter(fuel => seletedFuelChargesId.includes(fuel.id)));
        }
        
        this.setRowSelection();
      }
      );

  }

  getTotalRecords() {
    this.fuelPriceService.getTotalCount(this.paginationModel)
      .subscribe(result => {
        this.paginationModel.itemsLength = Number(result.data);
        this.getDefaultPageSize();
      });
  }

  getDefaultPageSize() {
    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.paginationModel.pageSize = Number(result.data.preferenceValue);
        this.getFuelSurchargeIndexList();
      });
  }

  

  onPaginationEvent(event) {
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getFuelSurchargeIndexList();
    this.paginationModel.pageSize = event.pageSize;
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

  rowSelectionChange(row): void {
    this.selection.toggle(row);
    this.selectedFuelCharges.emit(this.selection.selected);
  }


  deleteFuelSurchargeList(ItemList: FuelChargeIndex[]) {

    
    if (this.selection.selected.length < 0) {
      this.toastrService.warning('Please select at least one record.');
    }
    else {
      const ids = ItemList.map(i => i.id).join(',');
      this.fuelPriceService.deleteAllFuelSurchargeIndex(ids).subscribe(x => {
        console.log("delete", x);

        const newList = this.dataSource.data.filter(item => !ItemList.includes(item as any))
        this.fuelPriceService.getAllFuelSurchargeIndexList(this.paginationModel)
          .subscribe(result => {
            this.dataSource.data = result.data;
            this.toastrService.success('Record(s) Deleted Successfully.');
            this.getFuelSurchargeIndexList();
            this.getTotalRecords();
          }
          );

      });
    }
  }
}
