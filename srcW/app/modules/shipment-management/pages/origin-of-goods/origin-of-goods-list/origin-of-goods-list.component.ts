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
 // OriginOfGoodsToSelect: OriginOfGoods[];

  constructor(private shipmentManagementService: shipmentManagementService, private toastr: ToastrService, private topButtonBarService: TopButtonBarService) { }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    await this.getPageSize();
    this.getOriginOfGoodsList();
    this.dataSource = new MatTableDataSource<OriginOfGoods>();
    this.ItemList = new Array<any>();

    //this.topButtonBarService.getAction().subscribe(action => {
    //  debugger;
    //  switch (action) {
    //    case 'delete':
    //      this.deleteOriginOfGoodsList();
    //      break;

    //  }
    //});

  }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.length = this.paginationModel.pageSize;
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  //applyFilter(filterValue: string) {
  //  filterValue = filterValue.trim(); // Remove whitespace
  //  //filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //  this.dataSource.filter = filterValue;
  //  this.getOriginOfGoodsList();
  //}
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
    debugger;
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
    debugger;
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
  //onSelectionChange(row: OriginOfGoods, checked: boolean) {
  //  row.isSelected = checked;
  //  this.selection.toggle(row);
  //  this.SelectedMaterial.emit(this.selection.selected); 
  //}

  onSelectionChange(row: OriginOfGoods, checked: boolean) {
    debugger;
    
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
    this.SelectedMaterial.emit(this.selection.selected); 
  }



  async getPageSize() {
    this.shipmentManagementService.getOriginOfGoodsList()
      .subscribe(result => {
        debugger;
        this.paginationModel.itemsLength = result.recordCount;
      }
    );
    // default page size
    this.paginationModel.pageSize = await this.shipmentManagementService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }
  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getOriginOfGoodsList();
  }
  getOriginOfGoodsList() {
    debugger;
   
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.shipmentManagementService.getOriginOfGoodsDetailsList(this.paginationModel)
      .subscribe(result => {
        debugger;
        this.dataSource.data = result.data;
        this.setRowSelection();
      }
      );

  }

  setRowSelection() {
    debugger;
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

    debugger;
    if (!this.ItemList.length) {
      this.toastr.warning('Please select atleast one record');
    }
    else {
      const ids = this.ItemList.map(i => i.id).join(',');
      this.shipmentManagementService.deleteAllOriginOfGoods(ids).subscribe(x => {
        console.log("delete", x);

        const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
        this.shipmentManagementService.getOriginOfGoodsDetailsList(this.paginationModel)
          .subscribe(result => {
            debugger;
            this.dataSource.data = result.data;
            this.toastr.success('Origin Of Goods Record Deleted Successfully');
            this.getOriginOfGoodsList();
          }
          );
       
      });
    }
  }
}
