import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { MaterialService } from '../../../../core/services/material.service';
import { MaterialCommodityMap } from '../../../../core/models/material.model';
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css']
})
export class MaterialListComponent implements OnInit, AfterViewInit, OnChanges {
  paginationModel = new MaterialCommodityMap();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output('selectedMaterials') selectedMaterials = new EventEmitter<MaterialCommodityMap[]>();
  @Input('materialsToSelect') materialsToSelect: MaterialCommodityMap[];
  @ViewChild(MatSort) sort: MatSort;
  modalRef: NgbModalRef;
  displayedColumns = ['selectRow', 'code', 'name', 'defaultCommodity', 'status', 'isReserveStr', 'updatedBy'];
  displayedColumnsReplace = ['selectRow', 'key_MaterialCode', "key_Materialname", 'key_Defaultcommodity', 'key_Status', 'key_IsReserve', 'key_Lastupdated'];
  displayColumnsNew = ['selectRow',
    'code',
    'name',
    'defaultCommodity',
    'status',
    'isReserveStr',
    'updatedBy'];
  dataSource;
  selection = new SelectionModel<MaterialCommodityMap>(true, []);
  filterValue: string = "";

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;
    await this.getPageSize();
    this.getMaterialCommodityList();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace      
      this.getMaterialCommodityList();
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
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; this.selectedMaterials.emit(this.selection.selected); });
  }
  isLinear = false;
  selectRow: any;

  /** On row selection send that row to parent component  */
  onSelectionChange(row: MaterialCommodityMap, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    this.selectedMaterials.emit(this.selection.selected);
  }

  constructor(private materialService: MaterialService,
    public modalService: NgbModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService) { }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.dataSource = new MatTableDataSource<MaterialCommodityMap>();
    await this.getPageSize();
    this.getMaterialCommodityList();
  }

  ngOnChanges(changes: any) {
    this.setRowSelection();
  }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;    
  }
 /* onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }*/

  async getPageSize() {
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;    
    await this.materialService.getMaterialCommodityMapList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.materialService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    this.paginator.pageIndex = 0;
    //this.paginationModel.sortColumn = 'UpdateDateTimeServer';
    //this.paginationModel.sortOrder = 'Desc';
  }

  onPaginationEvent(event) {
    //this.filterValue = "";
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;    
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }    
    this.getMaterialCommodityList();
    this.paginationModel.pageSize = event.pageSize;
  }

  getMaterialCommodityList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.materialService.getMaterialCommodityMapList(this.paginationModel)
      .subscribe(result => {
        this.dataSource.data = result.data;
        this.setRowSelection();
      });
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getMaterialCommodityList();
    }
  }

  setRowSelection() {
    if (this.materialsToSelect != null && this.materialsToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.materialsToSelect.findIndex(item => item.id === row.id) >= 0) {
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

  RemoveSelectedMaterial() {
    var selectedIDs = '';
    if (this.selection.selected.length == 0) {
      this.toastrService.warning("Please select at least one record");
      return false;
    }
    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.id.toString() + ',';
    });
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.materialService.removeMaterialCommodity(selectedIDs).subscribe(result => {
        if (result.message == "Success" || result.Message == "Success") {
          this.getMaterialCommodityList();
          this.toastrService.success("The records are deleted successfully.");
        }
        else {
          this.toastrService.warning("An error occurred during this operation. Please contact Tech Support.");
        }
      }, error => {
          this.toastrService.error("Records saved successfully.");
      });
    }, (reason) => {
    });
  }
}


