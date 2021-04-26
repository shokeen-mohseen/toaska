import { Component, ViewChild, OnInit, EventEmitter, Output, AfterViewInit ,Input} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OriginOfGoods } from '../../../../../core/models/OriginOfGoods.model';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { ResizeEvent } from 'angular-resizable-element';
import { TopButtonBarService } from '../../../../../shared/components/top-btn-group/top-btn.serrvice';
import { ToastrService } from 'ngx-toastr';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
@Component({
  selector: 'app-origin-of-goods-list',
  templateUrl: './origin-of-goods-list.component.html',
  styleUrls: ['./origin-of-goods-list.component.css']
})
export class OriginOfGoodsListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['selectRow', 'Material', 'Country', 'Manufacturer', 'MaterialPercentage', 'Comment'];
  displayedColumnsReplace = ['selectRow', 'key_Material', 'key_Country', 'key_Manufacturer',
    'key_MaterialPercentage', 'key_Comment'];
  displayColumnsNew = ['selectRow', 'material', 'country', 'manufacturer', 'materialPercentage', 'comment'];
  dataSource;
  selection = new SelectionModel<OriginOfGoods>(true, []);
  paginationModel = new OriginOfGoods();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('SelectedMaterial') SelectedMaterial = new EventEmitter<OriginOfGoods[]>();
  @Input('OriginOfGoodsToSelect') OriginOfGoodsToSelect: OriginOfGoods[];
  filterValue = "";
  ItemList: OriginOfGoods[];
  selectRow: any;

  constructor(private ptService: PreferenceTypeService, private shipmentManagementService: shipmentManagementService, private toastr: ToastrService, private topButtonBarService: TopButtonBarService) { }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.paginationModel.sortOrder = "DESC";
    this.dataSource = new MatTableDataSource<OriginOfGoods>();
    this.ItemList = new Array<any>();
    await this.getPageSize();
    this.getOriginOfGoodsList();
  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.length = this.paginationModel.pageSize;
  }

  async applyFilter(filterText: string) {    
    this.filterValue = filterText.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getOriginOfGoodsList();
  }
  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getOriginOfGoodsList();
    }

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
      this.getOriginOfGoodsList();
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


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.isSelected = true;
        this.ItemList.push(row);
        this.SelectedMaterial.emit(this.selection.selected);
      });
  }
  isLinear = false;


  onSelectionChange(row: OriginOfGoods, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    if (checked == true) {
      this.ItemList.push(row);
    }
    else {

      this.ItemList = this.ItemList.filter(m => m != row);
    }
    this.SelectedMaterial.emit(this.selection.selected); 
  }



  async getPageSize() {
    
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.shipmentManagementService.getOriginOfGoodsDetailsList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;

      });

    this.paginationModel.pageSize = await this.shipmentManagementService.getDefaultPageSize();
   
  }
  getDefaultPagesize() {
   
    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.paginationModel.pageSize = Number(result.data.preferenceValue);
        this.paginationModel.sortOrder = "DESC";
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
        this.getOriginOfGoodsList();
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
    this.getOriginOfGoodsList();
    this.paginationModel.pageSize = event.pageSize;
  }
  getOriginOfGoodsList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;

    this.shipmentManagementService.getOriginOfGoodsDetailsList(this.paginationModel)
      .subscribe(result => {
        this.dataSource.data = result.data;
        this.setRowSelection();
      });
  }

  setRowSelection() {
    if (this.OriginOfGoodsToSelect != null && this.OriginOfGoodsToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.OriginOfGoodsToSelect.findIndex(item => item.id === row.id) >= 0) {
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

  deleteOriginOfGoodsList(ItemList: OriginOfGoods[]) {

    if (!this.ItemList.length) {
      this.toastr.warning('Please select atleast one record');
    }
    else {
      const ids = this.ItemList.map(i => i.id).join(',');
      this.shipmentManagementService.deleteAllOriginOfGoods(ids).subscribe(async x => {
        //const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
        //this.shipmentManagementService.getOriginOfGoodsDetailsList(this.paginationModel)
        //  .subscribe(result => {
        //    this.dataSource.data = result.data;
        this.toastr.success('Origin of goods record deleted successfully');
        await this.getPageSize();
        this.getOriginOfGoodsList();
       
      });
    }
  }
}
