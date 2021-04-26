import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { AddCommentComponent } from 'app/modules/inventory/pages/current-on-hand-inventory/add-comment/add-comment.component';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core';
import { InventoryModel, TotalSumQuantityModel } from '../../../../../core/models/inventory.model';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';


@Component({
  selector: 'app-current-inventory-list',
  templateUrl: './current-inventory-list.component.html',
  styleUrls: ['./current-inventory-list.component.css']
})
export class CurrentInventoryListComponent implements OnInit {

  displayedColumns = ['selectRow', 'locationType', 'location', 'materialCode', 'materialName', 'quantity', 'uom', 'updateDateTimeServer', 'comment'];
  displayedColumnsReplace = ['selectRow', 'key_LocationType', 'key_Location', 'key_MaterialCode', 'key_Materialname', 'key_Quantity', 'key_UOM', 'key_LastRefreshDate', 'key_Comment'];

  dataSource;
  selection = new SelectionModel<InventoryModel>(true, []);
  paginationModel = new InventoryModel();
  quantitySumModel = new TotalSumQuantityModel();
  filterValue = "";
  @Output('selectedInventory') selectedInventory = new EventEmitter<InventoryModel[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  /** On row selection send that row to parent component  */
  onSelectionChange(row: InventoryModel, checked: boolean) {
    row.IsSeleted = checked;
    this.selection.toggle(row);
    this.selectedInventory.emit(this.selection.selected);
  }

 async applyFilter(filterText: string) {
    this.filterValue = filterText.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getInventoryList();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getInventoryList();
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
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; this.selectedInventory.emit(this.selection.selected); });
  }

  modalRef: NgbModalRef;
  selectRow: any;
  comment: any;

  constructor(private inventoryService: InventoryService,
    public modalService: NgbModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService) { }

  openPopup(action, item) {
    if (action === "addComment") {
      this.modalRef = this.modalService.open(AddCommentComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.data = item;
      this.modalRef.result.then((result) => {
        this.getInventoryList();
        this.getTotalSumQuantity();
      }), (reason) => {
      };
    }
  }

  async ngOnInit() {    
    this.selectRow = 'selectRow';
    this.comment = 'comment';
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.dataSource = new MatTableDataSource<InventoryModel>();
    await this.getPageSizeOnLoad();
    this.getTotalSumQuantity();
    this.getInventoryList();
    
  }

  async getPageSize() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.inventoryService.GetAllCurrentMaterialOnhand(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.inventoryService.getDefaultPageSize();
    //this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
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

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getInventoryList();
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
    this.getInventoryList();
    this.paginationModel.pageSize = event.pageSize;
  }

  async getPageSizeOnLoad() {
    this.inventoryService.totalCount(this.paginationModel)
      .subscribe(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.inventoryService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }

  getInventoryList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.inventoryService.GetAllCurrentMaterialOnhand(this.paginationModel)
      .subscribe(result => {
        this.dataSource.data = result.data;
      });
  }

  getTotalSumQuantity() {
    this.inventoryService.GetSumQuantity(this.paginationModel)
      .subscribe(result => {
        this.quantitySumModel.total = Number(result.data);
      });
  }

  RemoveSelectedInventory() {
    var selectedIDs = '';
    if (this.selection.selected.length == 0) {
      this.toastrService.info("Please select at least one record.");
      return false;
    }
    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.id.toString() + ',';
    });
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.inventoryService.removeInventory(selectedIDs).subscribe(result => {
        if (result.message == "Success" || result.Message == "Success") {
          this.getTotalSumQuantity();
          this.getInventoryList();
          this.toastrService.success("The records are deleted successfully.");
        }
        else {
          this.toastrService.warning("An error occurred during this operation. Please contact Tech Support.");
        }
      });
    });
  }
}
