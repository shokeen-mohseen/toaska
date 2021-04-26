import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

export interface Element {
  highlighted?: boolean;
}
@Component({
  selector: 'app-planned-order-report',
  templateUrl: './planned-order-report.component.html',
  styleUrls: ['./planned-order-report.component.css']
})
export class PlannedOrderReportComponent implements OnInit, AfterViewInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;
  filter: boolean = false;
  panelOpenState: boolean = false;
  displayedColumns = ['orderType', 'Location', 'orderNo', 'orderDate', 'ship',
    'reqDeliveryDate', 'mustArriveDate', 'modal', 'orderQuantity',
    'ptsq', 'shippedquality', 'po', 'enteredBy', 'status', 'carrier', 'bl'];
  
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

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
  isLinear = false;
  IsTosca: boolean;

  constructor() { }

  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();

    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: false,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //disabled: true
    };
  }

  ngAfterViewInit() {
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.showAction('filter');
    this.btnBar.hideAction('export');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

  actionHandler(type) {}

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

  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }
  showFilter() {
    this.panelOpenState = !this.panelOpenState
  }
}
export interface PeriodicElement {
  orderType: string;
  Location: string;
  orderNo: string;
  orderDate: string;
  ship: string;
  reqDeliveryDate: string;
  mustArriveDate: string;
  modal: string;
  orderQuantity: string;
  ptsq: string;
  shippedquality: string;
  po: string;
  enteredBy: string;
  status: string;
  carrier: string;
  bl: string;
  
}
const ELEMENT_DATA: PeriodicElement[] = [
  { orderType: 'Customer', Location: 'Tosca Garland [Tosca Ltd For Operating Location]', orderNo: '527748.0', orderDate: '09/12/2020', ship: '10/12/2020', reqDeliveryDate: '09/12/2020', mustArriveDate: '10/12/2020', modal: 'TL-6428P-FIN', orderQuantity: '6,600', ptsq: '6,600', shippedquality: '', po: 'test', enteredBy: 'adectec', status: 'Assigned To Shipment', carrier: 'Transplace', bl: '33456.0' },
  { orderType: 'Customer', Location: 'Tosca Garland [Tosca Ltd For Operating Location]', orderNo: '527748.0', orderDate: '09/12/2020', ship: '10/12/2020', reqDeliveryDate: '09/12/2020', mustArriveDate: '10/12/2020', modal: 'TL-6428P-FIN', orderQuantity: '6,600', ptsq: '6,600', shippedquality: '', po: 'test', enteredBy: 'adectec', status: 'Assigned To Shipment', carrier: 'Transplace', bl: '33456.0' },
  { orderType: 'Customer', Location: 'Tosca Garland [Tosca Ltd For Operating Location]', orderNo: '527748.0', orderDate: '09/12/2020', ship: '10/12/2020', reqDeliveryDate: '09/12/2020', mustArriveDate: '10/12/2020', modal: 'TL-6428P-FIN', orderQuantity: '6,600', ptsq: '6,600', shippedquality: '', po: 'test', enteredBy: 'adectec', status: 'Assigned To Shipment', carrier: 'Transplace', bl: '33456.0' },
  { orderType: 'Customer', Location: 'Tosca Garland [Tosca Ltd For Operating Location]', orderNo: '527748.0', orderDate: '09/12/2020', ship: '10/12/2020', reqDeliveryDate: '09/12/2020', mustArriveDate: '10/12/2020', modal: 'TL-6428P-FIN', orderQuantity: '6,600', ptsq: '6,600', shippedquality: '', po: 'test', enteredBy: 'adectec', status: 'Assigned To Shipment', carrier: 'Transplace', bl: '33456.0' },
  { orderType: 'Customer', Location: 'Tosca Garland [Tosca Ltd For Operating Location]', orderNo: '527748.0', orderDate: '09/12/2020', ship: '10/12/2020', reqDeliveryDate: '09/12/2020', mustArriveDate: '10/12/2020', modal: 'TL-6428P-FIN', orderQuantity: '6,600', ptsq: '6,600', shippedquality: '', po: 'test', enteredBy: 'adectec', status: 'Assigned To Shipment', carrier: 'Transplace', bl: '33456.0' },
  { orderType: 'Customer', Location: 'Tosca Garland [Tosca Ltd For Operating Location]', orderNo: '527748.0', orderDate: '09/12/2020', ship: '10/12/2020', reqDeliveryDate: '09/12/2020', mustArriveDate: '10/12/2020', modal: 'TL-6428P-FIN', orderQuantity: '6,600', ptsq: '6,600', shippedquality: '', po: 'test', enteredBy: 'adectec', status: 'Assigned To Shipment', carrier: 'Transplace', bl: '33456.0' },
  { orderType: 'Customer', Location: 'Tosca Garland [Tosca Ltd For Operating Location]', orderNo: '527748.0', orderDate: '09/12/2020', ship: '10/12/2020', reqDeliveryDate: '09/12/2020', mustArriveDate: '10/12/2020', modal: 'TL-6428P-FIN', orderQuantity: '6,600', ptsq: '6,600', shippedquality: '', po: 'test', enteredBy: 'adectec', status: 'Assigned To Shipment', carrier: 'Transplace', bl: '33456.0' },
  { orderType: 'Customer', Location: 'Tosca Garland [Tosca Ltd For Operating Location]', orderNo: '527748.0', orderDate: '09/12/2020', ship: '10/12/2020', reqDeliveryDate: '09/12/2020', mustArriveDate: '10/12/2020', modal: 'TL-6428P-FIN', orderQuantity: '6,600', ptsq: '6,600', shippedquality: '', po: 'test', enteredBy: 'adectec', status: 'Assigned To Shipment', carrier: 'Transplace', bl: '33456.0' },
 ];

