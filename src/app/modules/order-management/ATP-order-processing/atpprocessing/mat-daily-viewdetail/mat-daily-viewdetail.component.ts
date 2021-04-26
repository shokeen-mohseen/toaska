import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AtpOrderDetailPopupComponent } from './atp-order-detail-popup/atp-order-detail-popup.component';
@Component({
  selector: 'app-mat-daily-viewdetail',
  templateUrl: './mat-daily-viewdetail.component.html',
  styleUrls: ['./mat-daily-viewdetail.component.css']
})
export class MatDailyViewdetailComponent implements OnInit {
  displayedColumns = ['selectRow', 'date', 'Secwnce', 'Activitytype', 'Orderno', 'Reservation', 'Unusedfor', 'Unusedreservation', 'Reservationavl', 'Inventory', 'Activityquntity', 'Assignqunt', 'Ending','Status'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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
  
  modalRef: NgbModalRef;
  constructor(private router: Router, public modalService: NgbModal, public activeModal: NgbActiveModal) { }
  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};

  count = 3;

  ngOnInit(): void {
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      disabled: "true",
    };

    this.settingsB = {
      singleSelection: false,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  openOrderDetail() {
    this.modalRef = this.modalService.open(AtpOrderDetailPopupComponent, { size: 'lg', backdrop: 'static' });
  }
}
export interface PeriodicElement {
  selectRow: string;
  date: string;
  Secwnce: string;
  Activitytype: string;
  Orderno: string;
  Reservation: string;
  Unusedfor: string;
  Unusedreservation: string;
  Reservationavl: string;
  Inventory: string;
  Activityquntity: string;
  Assignqunt: string;
  Ending: string;
  Status: string;
}
const ELEMENT_DATA: PeriodicElement[] = [

  { selectRow: '', date: '11/02/20', Secwnce: '', Activitytype: 'Cust order', Orderno: '', Reservation: '0', Unusedfor: '0', Unusedreservation: '0', Reservationavl: '-5,318', Inventory: '-5,318', Activityquntity: '60', Assignqunt: '60', Ending: '-4,178',Status:''},
];
