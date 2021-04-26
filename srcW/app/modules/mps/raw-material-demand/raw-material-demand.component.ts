import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { projectkey } from 'environments/projectkey';
import { ResizeEvent } from 'angular-resizable-element';
import { MatTabGroup } from '@angular/material/tabs';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrderQtyDetailsComponent } from '../mps-summary-workbench/order-qty-details/order-qty-details.component';

export interface PeriodicElement {
  RawMaterialCode: string;
  RawMaterialDescription: string;
  FinishedMaterialCode: string;
  FinishedMaterialDescription: string;
  ProductionSchduledDate: string;
  FinishedMaterialQty: string;
  ExpectedOnhand: string;
  neededRawMaterialQty: string;
  CreatePO: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { RawMaterialCode: '3432432-KJ', RawMaterialDescription: '', FinishedMaterialCode: '', FinishedMaterialDescription: '', ProductionSchduledDate: '', FinishedMaterialQty: '', ExpectedOnhand: '', neededRawMaterialQty: '', CreatePO: '' },
  { RawMaterialCode: '3432432-KJ', RawMaterialDescription: '', FinishedMaterialCode: '', FinishedMaterialDescription: '', ProductionSchduledDate: '', FinishedMaterialQty: '', ExpectedOnhand: '', neededRawMaterialQty: '', CreatePO: '' },
  { RawMaterialCode: '3432432-KJ', RawMaterialDescription: '', FinishedMaterialCode: '', FinishedMaterialDescription: '', ProductionSchduledDate: '', FinishedMaterialQty: '', ExpectedOnhand: '', neededRawMaterialQty: '', CreatePO: '' },
  { RawMaterialCode: '3432432-KJ', RawMaterialDescription: '', FinishedMaterialCode: '', FinishedMaterialDescription: '', ProductionSchduledDate: '', FinishedMaterialQty: '', ExpectedOnhand: '', neededRawMaterialQty: '', CreatePO: '' },
  { RawMaterialCode: '3432432-KJ', RawMaterialDescription: '', FinishedMaterialCode: '', FinishedMaterialDescription: '', ProductionSchduledDate: '', FinishedMaterialQty: '', ExpectedOnhand: '', neededRawMaterialQty: '', CreatePO: '' },
  { RawMaterialCode: '3432432-KJ', RawMaterialDescription: '', FinishedMaterialCode: '', FinishedMaterialDescription: '', ProductionSchduledDate: '', FinishedMaterialQty: '', ExpectedOnhand: '', neededRawMaterialQty: '', CreatePO: '' },
  { RawMaterialCode: '3432432-KJ', RawMaterialDescription: '', FinishedMaterialCode: '', FinishedMaterialDescription: '', ProductionSchduledDate: '', FinishedMaterialQty: '', ExpectedOnhand: '', neededRawMaterialQty: '', CreatePO: '' },
  { RawMaterialCode: '3432432-KJ', RawMaterialDescription: '', FinishedMaterialCode: '', FinishedMaterialDescription: '', ProductionSchduledDate: '', FinishedMaterialQty: '', ExpectedOnhand: '', neededRawMaterialQty: '', CreatePO: '' },
];

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-raw-material-demand',
  templateUrl: './raw-material-demand.component.html',
  styleUrls: ['./raw-material-demand.component.css']
})
export class RawMaterialDemandComponent implements OnInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  filter: boolean = false;
  IsTosca: boolean;
  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;
  modalRef: NgbModalRef;

  public dateFormat1: String = "MM-dd-yyyy HH:mm a";

  FinishedMaterialQty: any;
  neededRawMaterialQty: any;
  CreatePO: any;
  
  displayedColumns = ['RawMaterialCode', 'RawMaterialDescription', 'FinishedMaterialCode', 'FinishedMaterialDescription', 'ProductionSchduledDate', 'FinishedMaterialQty', 'ExpectedOnhand', 'neededRawMaterialQty', 'CreatePO'];
  displayedColumnsReplace = ['key_RawMaterialCode', 'key_RawMaterialDescription', 'key_FinishedMaterialCode', 'key_FinishedMaterialDescription', 'key_ProductionSchduledDate', 'key_FinishedMaterialQuantity', 'key_ExpectedOnhand', 'key_neededRawMaterialQty', 'key_CreatePO'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
    this.FinishedMaterialQty = 'FinishedMaterialQty';
    this.neededRawMaterialQty = 'neededRawMaterialQty';
    this.CreatePO = 'CreatePO';
    

    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: false,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };
    this.actionGroupConfig = getGlobalRibbonActions();

    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
  }
  openFinishedMaterialQty(x) {
    this.modalRef = this.modalService.open(OrderQtyDetailsComponent, { size: 'xl', backdrop: 'static' });
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  ngAfterViewInit(): void {
    this.btnBar.hideTab('key_View');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('add');
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

  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

}

