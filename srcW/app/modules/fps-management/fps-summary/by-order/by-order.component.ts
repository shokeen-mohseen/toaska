import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
export interface PeriodicElement {
  dueDate: string;
  materialCode: string;
  materialDesc: string;
  orderQty: number;
  backOrder: string;
  onHand: string;
  assignedQty: number;
  scheduled: string;
  productionDemand: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {    
    dueDate: '5/20/2020',
    materialCode: 'mat101',
    materialDesc: 'material',
    orderQty: 111,
    backOrder: 'NA',
    onHand: 'NA',
    assignedQty: 12,
    scheduled: '8/25/2020',
    productionDemand: 'NA'
  },
  {
    dueDate: '5/20/2020',
    materialCode: 'mat101',
    materialDesc: 'material',
    orderQty: 111,
    backOrder: 'NA',
    onHand: 'NA',
    assignedQty: 12,
    scheduled: '8/25/2020',
    productionDemand: 'NA'
  },
  {
    dueDate: '5/20/2020',
    materialCode: 'mat101',
    materialDesc: 'material',
    orderQty: 111,
    backOrder: 'NA',
    onHand: 'NA',
    assignedQty: 12,
    scheduled: '8/25/2020',
    productionDemand: 'NA'
  },
  {
    dueDate: '5/20/2020',
    materialCode: 'mat101',
    materialDesc: 'material',
    orderQty: 111,
    backOrder: 'NA',
    onHand: 'NA',
    assignedQty: 12,
    scheduled: '8/25/2020',
    productionDemand: 'NA'
  },

];
@Component({
  selector: 'app-by-order',
  templateUrl: './by-order.component.html',
  styleUrls: ['./by-order.component.css']
})
export class ByOrderComponent implements OnInit {

  selectRow: any;

  ngOnInit(): void { this.selectRow = 'selectRow'; }

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

  //material table code

  displayedColumns = ['selectRow', 'dueDate', 'materialCode', 'materialDesc', 'orderQty', 'backOrder', 'onHand', 'assignedQty', 'scheduled', 'productionDemand'];
  displayedColumnsReplace = ['selectRow', 'key_DueDate', 'key_Matcode', 'key_MaterialDesc', 'key_OrderQty', 'key_backOrder', 'key_onHand', 'key_Assigned', 'key_scheduled', 'key_productionDemand'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}
