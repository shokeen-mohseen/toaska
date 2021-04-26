import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { IssueComponent } from '../../../shared/components/issue/issue.component';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  Charges_Description: string;
  Rate: string;
  Rate_Type: string;
  UOM: string;
  Quantity_per_UOM: string;
  Commodity: string;
  Sales_Tax: string;
  Price_Method_Type: string;
  Show_On_BOL: string;
  Auto_Added: string;
  Add_Pallet: string;
  Price_Increase_Method: string;
  Effective_Start: string;
  Effective_End: string;
  Add_New: string;
  Delete: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
  { Charges_Description: 'Alternate Recovery Charge -Egg', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: '' },
 
];

@Component({
  selector: 'app-application-charges',
  templateUrl: './application-charges.component.html',
  styleUrls: ['./application-charges.component.css']
})
export class ApplicationChargesComponent implements OnInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;
  selectRow: any;
  Charges_Description: any;
  Rate: any;
  Rate_Type: any;
  UOM: any;
  Quantity_per_UOM: any;
  Commodity: any;
  Sales_Tax: any;
  Price_Method_Type: any;
  Show_On_BOL: any;
  Auto_Added: any;
  Add_Pallet: any;
  Price_Increase_Method: any;
  Effective_Start: any;
  Effective_End: any;
  Add_New: any;
  Delete: any;
  public date: Date = new Date("12/11/2017 1:00 AM");

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  modalRef: NgbModalRef;
  constructor(private router: Router, public modalService: NgbModal) { }

  IsTosca: boolean;
  ngOnInit() {
    this.selectRow = 'selectRow';
    this.Charges_Description = 'Charges_Description';
    this.Rate = 'Rate';
    this.Rate_Type = 'Rate_Type';
    this.UOM = 'UOM';
    this.Quantity_per_UOM = 'Quantity_per_UOM';
    this.Commodity = 'Commodity';
    this.Sales_Tax = 'Sales_Tax';
    this.Price_Method_Type = 'Price_Method_Type';
    this.Show_On_BOL = 'Show_On_BOL';
    this.Auto_Added = 'Auto_Added';
    this.Add_Pallet = 'Add_Pallet';
    this.Price_Increase_Method = 'Price_Increase_Method';
    this.Effective_Start = 'Effective_Start';
    this.Effective_End = 'Effective_End';
    this.Add_New = 'Add_New';
    this.Delete = 'Delete';
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
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }

  actionHandler(type) {
    if (type === "updateContract") {

    }

  }

  displayedColumns = ['selectRow', 'Charges_Description', 'Rate', 'Rate_Type', 'UOM', 'Quantity_per_UOM', 'Commodity', 'Sales_Tax', 'Price_Method_Type',
    'Show_On_BOL', 'Auto_Added', 'Add_Pallet', 'Price_Increase_Method', 'Effective_Start', 'Effective_End', 'Delete', 'Add_New'];
  displayedColumnsReplace = ['selectRow', 'key_Chargesdescription', 'key_Rate', 'key_RateType', 'key_UOM', 'key_Quantityuom', 'key_Commodity', 'key_Salestax', 'key_Pricetype',
    'key_Ahobol', 'key_Autoadd', 'key_Addpalet', 'key_Priceinc', 'key_EffectiveStart', 'key_EffectiveEnd', 'key_Delete', 'key_Addnew'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.btnBar.showAction('updateContract');
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideTab('key_Data');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
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

  openissue() {
    this.modalRef = this.modalService.open(IssueComponent, { size: 'xl', backdrop: 'static' });
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
  addRow() {
    ELEMENT_DATA.push({ Charges_Description: '', Rate: '', Rate_Type: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax: '', Price_Method_Type: '', Show_On_BOL: '', Auto_Added: '', Add_Pallet: '', Price_Increase_Method: '', Effective_Start: '', Effective_End: '', Delete: '', Add_New: ''})
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }
}

