import { Component, ViewChild, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ResizeEvent } from 'angular-resizable-element';
import { EquipmentViewModel } from '../../../../core/models/Equipment';
import { EquipmentService } from '../../../../core/services/equipment.service';
import { AuthService, PreferenceTypeService } from '../../../../core';
import { Router } from '@angular/router';
import { projectkey } from '../../../../../environments/projectkey';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css']
})
export class EquipmentListComponent implements OnInit, AfterViewInit, OnChanges {
  selectRow: any;
  displayedColumns = ['selectRow', 'code', 'tmsCode', 'name', 'maxPalletQty', 'leastFillPalletQty'];
  displayedColumnsReplace = ['selectRow', 'key_Equipmenttypecode', 'key_TMSCode', 'key_Equipmentname', 'key_MaxPalletQty', 'key_LeastFillPalletQty'];
  dataSource;
  selection = new SelectionModel<EquipmentViewModel>(true, []);
  selectedEquipment: EquipmentViewModel[] = [];
  paginationModel = new EquipmentViewModel();
  filterValue: string = "";
  actionGroupConfig;
  @Input('equipmentsInEdit') equipmentsInEdit: EquipmentViewModel[];
  @Output('selectedEquipmentTypes') selectedEquipmentTypes = new EventEmitter<EquipmentViewModel[]>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;
    await this.getPageSize();
    this.getEquipmentList();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getEquipmentList();
    }
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
    this.getEquipmentList();
    this.paginationModel.pageSize = event.pageSize;
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getEquipmentList();
    }

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

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; });
    this.selectedEquipmentTypes.emit(this.selection.selected);
    this.selectedEquipment = this.selection.selected;
    this.setSelectionIds();
  }

  constructor(private router: Router,
    private ptService: PreferenceTypeService,
    public equipmentService: EquipmentService,
    private authenticationService: AuthService
  ) { }


  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.dataSource = new MatTableDataSource<EquipmentViewModel>();
    this.paginationModel.clientId = this.authenticationService.currentUserValue.ClientId;
    await this.getPageSize();

    this.getEquipmentList();
  }

  ngOnChanges(changes: any) {
    this.setRowSelection();
  }

  getEquipmentList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.equipmentService.getEquipmentList(this.paginationModel).subscribe(result => {
      this.dataSource.data = result.data;      
      this.setRowSelection();
    });
  }

  setRowSelection() {
    if (this.equipmentsInEdit != null && this.equipmentsInEdit.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.equipmentsInEdit.findIndex(item => item.id === row.id) >= 0) {
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
    this.paginationModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0; 
    await this.equipmentService.getEquipmentList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.equipmentService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    this.paginator.pageIndex = 0;
    this.paginationModel.sortColumn = 'UpdateDateTimeServer';
    this.paginationModel.sortOrder = 'Desc';    
  }

  onSelectionChange(row: EquipmentViewModel, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    this.selectedEquipment = this.selection.selected;
    this.setSelectionIds();
    this.selectedEquipmentTypes.emit(this.selection.selected);
  }
  iDs: string = '';
  @Output() selectedIds: EventEmitter<string> = new EventEmitter();
  setSelectionIds() {
    this.iDs = '';
    this.selectedEquipment.forEach(item => {
      this.iDs += `${item.id},`;
    });
    this.selectedIds.emit(this.iDs);
  }

}
