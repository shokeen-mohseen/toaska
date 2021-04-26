import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatDailyViewdetailComponent } from '../mat-daily-viewdetail/mat-daily-viewdetail.component';
@Component({
  selector: 'app-atp-tbl-list',
  templateUrl: './atp-tbl-list.component.html',
  styleUrls: ['./atp-tbl-list.component.css']
})
export class AtpTblListComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  modalRef: NgbModalRef;
  constructor(private router: Router, public modalService: NgbModal) { }

  itemListA = [];


  selectedItemsA = [];
  settingsA = {};



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



    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };



  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);

  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);

  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  
  displayedColumns = ['selectRow', 'Matdailyview', 'Materialcode', 'Materialdec', 'Availblequnt', 'Orderqunty','Assignquntity','Filldate','Scheduleshipdate','Status'];
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

  openMatView() {
    this.modalRef = this.modalService.open(MatDailyViewdetailComponent, { size: 'xl', backdrop: 'static' });
  }

}
export interface PeriodicElement {
  selectRow: string;
  Matdailyview: string;
  Materialcode: string;
  Materialdec: string;
  Availblequnt: string;
  Orderqunty: string;
  Assignquntity: string;
  Filldate: string;
  Scheduleshipdate: string;
  Status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Matdailyview: '', Materialcode: 'WW-PALLET', Materialdec: 'WW-PALLET', Availblequnt: '-5,318', Orderqunty: '60', Assignquntity: '', Filldate: '', Scheduleshipdate:'', Status:'' },

];
