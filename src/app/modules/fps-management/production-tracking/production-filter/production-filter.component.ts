import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditComponent } from './add-edit/add-edit.component';
import { PrintLevelComponent } from './print-level/print-level.component';

export interface PeriodicElement {
  Datetime: string;
  Location: string;
  Equipment: string;
  MaterialCode: number;
  MaterialDescription: string;
  Batch: string;
  Lot: string;
  Team: string;
  Shift: string;
  QuantityProduced: string;
  QualityStatus: string;
  UpdatedBy: string;
  select: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Datetime: '5/20/2020 12:30 AM',
    Location: 'location',
    Equipment: 'equipment',
    MaterialCode: 111,
    MaterialDescription: 'NA',
    Batch: 'batch 101',
    Lot: 'NA',
    Team: 'NA',
    Shift: 'NA',
    QuantityProduced: 'NA',
    QualityStatus: 'NA',
    UpdatedBy: 'NA',
    select: ''
  },
  {
    Datetime: '5/20/2020 12:30 AM',
    Location: 'location',
    Equipment: 'equipment',
    MaterialCode: 111,
    MaterialDescription: 'NA',
    Batch: 'batch 101',
    Lot: 'NA',
    Team: 'NA',
    Shift: 'NA',
    QuantityProduced: 'NA',
    QualityStatus: 'NA',
    UpdatedBy: 'NA',
    select: ''
  }, 
];

@Component({
  selector: 'app-production-filter',
  templateUrl: './production-filter.component.html',
  styleUrls: ['./production-filter.component.css']
})
export class ProductionFilterComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date("12/11/2017 1:00 AM");
  modalRef: NgbModalRef;

  constructor(public modalService: NgbModal) { }
/*  openProduction() {
    this.modalRef = this.modalService.open(AddEditComponent, { size: 'xl', backdrop: 'static' });
  }*/
  openPrintLevel() {
    this.modalRef = this.modalService.open(PrintLevelComponent, { size: 'lg', backdrop: 'static' });
  }

  itemListA = [];
  itemListB = [];
  settingsA = {};
  settingsB = {};
  selectedItemsA = [];
  selectedItemsB = [];
  count = 3;
  selectRow: any;
  select: any;

  ngOnInit(): void {
    this.selectRow = 'selectRow'; 
    this.select = 'select'; 
    // for searchable dropdown
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
      badgeShowLimit: 3
    };
    this.settingsB = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 3
    };
    // searchable dropdown end
  }//init() end
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
  onItemSelect(item: any) {}
  OnItemDeSelect(item: any) {}
  onSelectAll(items: any) {}
  onDeSelectAll(items: any) {}



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

  displayedColumns = ['selectRow', 'Datetime', 'Location', 'Equipment',
    'MaterialCode', 'MaterialDescription', 'Batch', 'Lot', 'Team', 'Shift',
    'QuantityProduced', 'QualityStatus', 'UpdatedBy', 'select'];

  displayedColumnsReplace = ['selectRow', 'key_Datetime', 'key_Location', 'key_Equipment',
    'key_Matcode', 'key_MaterialDesc', 'key_batchNo', 'key_lotNo', 'key_Team', 'key_Shift',
    'key_QuantityProduced', 'key_QualityStatus', 'key_Lastupdated'];
 
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
