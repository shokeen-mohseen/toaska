import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { Charge } from '../../../../core/models/charge.model';
import { ChargeService } from '../../../../core/services/charge.service';


@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.css']
})
export class ChargeListComponent implements OnInit, AfterViewInit, OnChanges {
  displayedColumns = ['selectRow', 'chargeCategoryDescription', 'chargeTypeDescription', 'ChargeDescription',
   'DefaultComputationMethod', 'status', 'updatedBy', 'applyContractFor',];
  displayedColumnsReplace = ['selectRow', 'key_ChargeCategoryDescription', 'key_ctd', 'key_ChargeDescription',
    'key_DefaultRateType', 'key_Status', 'key_Lastupdated', 'key_ApplyContractFor',];
  displayColumnsNew = ['selectRow',
    'chargeCategoryDescription',
    'chargeTypeDescription',
    'description',
    'chargeComputationMethodDescription',
    'status',
    'updatedBy',
    'applyContractFor'];
  dataSource;
  selection = new SelectionModel<Charge>(true, []);
  paginationModel = new Charge();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output('selectedCharges') selectedCharges = new EventEmitter<Charge[]>();
  @Input('chargesToSelect') chargesToSelect: Charge[];
  filterValue = "";

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    await this.getPageSize();
    this.getChargeList();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getChargeList();
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
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; });

    this.selectedCharges.emit(this.selection.selected);
  }
  isLinear = false;
  selectRow: any;

  /** On row selection send that row to parent component  */
  onSelectionChange(row: Charge, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    this.selectedCharges.emit(this.selection.selected);
  }


  constructor(private ChargeService: ChargeService) {  }


  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.dataSource = new MatTableDataSource<Charge>();
    await this.getPageSize();
    this.getChargeList();
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
  ngOnChanges(changes: any) {
    this.setRowSelection();
  }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;

  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getChargeList();
    }
  }

  async getPageSize() {
    var pagination = new Charge();
    pagination.pageNo = 0;
    pagination.pageSize = 0;
    pagination.filterOn = this.filterValue;
    await this.ChargeService.getChargeDetailList(pagination).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.ChargeService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }

  onPaginationEvent(event) {
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getChargeList();
  }

  getChargeList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.ChargeService.getChargeDetailList(this.paginationModel)
      .subscribe(result => {
        this.dataSource.data = result.data;
        this.setRowSelection();
      }
      );

  }

  setRowSelection() {

    if (this.chargesToSelect != null && this.chargesToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.chargesToSelect.findIndex(item => item.id === row.id) >= 0) {
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

}
