import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../core';
import { ContractService } from '../../../core/services/contract.service';

export interface PeriodicElement {
  datetime: string;
  user: string;
  status: string;
  download: string;
  delete: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { datetime: '03/16/2021 01:17 PM', user: 'lampsdemo@adectec.com', status: 'Available', download: '', delete: '' },
  { datetime: '03/16/2021 01:17 PM', user: 'lampsdemo@adectec.com', status: 'Submitted', download: '', delete: '' },
  { datetime: '03/16/2021 01:17 PM', user: 'lampsdemo@adectec.com', status: 'InProcess', download: '', delete: '' }
];

@Component({
  selector: 'app-operational-export',
  templateUrl: './operational-export.component.html',
  styleUrls: ['./operational-export.component.css']
})
export class OperationalExportComponent implements OnInit {

  itemListA = [];
  selectedItemsA = [];
  settingsA = {};
  count = 3;

  download: any;
  delete: any;
  export: any;

  public DocumentSectionTitle: string;

  displayedColumns = ['datetime', 'user', 'status', 'download', 'delete'];
  displayedColumnsReplace = ['key_Datesubmit', 'key_User', 'key_Status', 'key_Download', 'key_Delete'];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  customFilterItemListData: any[] = [];
  customFilterItemListDataModel: any[] = [];
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

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private authenticationService: AuthService,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.getApplyCustomFilterList();
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
    ];
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

    this.download = 'download';
    this.delete = 'delete';
    this.export = 'export';
  }

  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    this.selectedItemsA = item;

  }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }

  getApplyCustomFilterList() {
    let code = "";
    if (this.DocumentSectionTitle == "Order") {
      code = 'SalesOrder,StockTransfer';
    }
    if (this.DocumentSectionTitle == "Shipment") {
      code = 'Shipment';
    }
    this.contractService.GetAllCustomManageFilters(this.authenticationService.currentUserValue.ClientId,
      this.authenticationService.currentUserValue.UserId, code
    )
      .subscribe(result => {
        if (result.data != undefined) {
          var datas = result.data;
          datas.map(item => {
            return {
              name: item.filterName,
              id: Number(item.id)
            };
          }).forEach(value => this.customFilterItemListData.push(value));
        }
      })
  }
}
