import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  EquipmentCode: string;
  Material: string;
  Amount: string;
  StartDatetime: string;
  EndDatetime: string;
  Status: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    EquipmentCode: '111',
    Material: 'material',
    Amount: '100',
    StartDatetime: '22/2/2020',
    EndDatetime: '23/2/2020',
    Status: 'NA',
  },
  {
    EquipmentCode: '1012',
    Material: 'material',
    Amount: '200',
    StartDatetime: '22/2/2020',
    EndDatetime: '23/2/2020',
    Status: 'NA',
  },
  {
    EquipmentCode: '1012',
    Material: 'material',
    Amount: '200',
    StartDatetime: '22/2/2020',
    EndDatetime: '23/2/2020',
    Status: 'NA',
  },
  {
    EquipmentCode: '1012',
    Material: 'material',
    Amount: '200',
    StartDatetime: '22/2/2020',
    EndDatetime: '23/2/2020',
    Status: 'NA',
  },
];

@Component({
  selector: 'app-workbench-initial',
  templateUrl: './workbench-initial.component.html',
  styleUrls: ['./workbench-initial.component.css']
})
export class WorkbenchInitialComponent implements OnInit {


  //public dateFormat: String = "MM-dd-yyyy";
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date();

 
  itemListB = [];
  settingsB = {};
  selectedItemsB = [];
  count = 3;
  selectRow: any;

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    // for searchable dropdown


    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

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

  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) { }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }



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
  displayedColumns = ['selectRow', 'EquipmentCode', 'Material', 'Amount',
    'StartDatetime', 'EndDatetime', 'Status'];

  displayedColumnsReplace = ['selectRow', 'key_EquipmentCode', 'key_Material', 'key_Amount',
    'key_Matcode', 'key_MaterialDesc', 'key_batchNo', 'key_lotNo', 'key_Team', 'key_Shift',
    'key_StartDatetime', 'key_EndDatetime', 'key_Status'];

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
