import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { ContractService } from '@app/core/services/contract.service';
import { AuthService, PreferenceTypeService } from '@app/core';
import { Contract, ContractViewModel } from '@app/core/models/contract.model';
import { DatePipe } from '@angular/common'
import { ToastrService } from 'ngx-toastr';
import { ContractCommonDataService } from '../../../../../core/services/contract-common-data.service';

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.css'],
  providers: [DatePipe]
})
export class ContractListComponent implements OnInit {

  btnEdit = function () {
    this.router.navigateByUrl('/data-management/contract/edit-contract');
  };

  //material table code

  displayedColumns = ['selectRow', 'Contract_Type', 'Contract_No', 'Version', 'Description', 'Billing_Entity', 'Customer_Ship_To_Location', 'Business_Partner', 'Customer_Code',
    'Effective_Start', 'Effective_End', 'EarliestPriceEnd', 'Evergreen', 'End_Alert_Days', 'Status', 'ContractApproved', 'Approved_Datetime'];

  displayedColumnsHeader = [
    'selectRow', 'key_ContractType', 'key_ContractNo', 'key_Version',
    'key_Description', 'key_BillingEntity', 'key_CustomerShipToLocation',
    'key_BusinessPartner', 'key_Customer_Code',
    'key_EffectiveStart', 'key_EffectiveEnd', 'key_EarliestPriceEnd',
    'key_Evergreen', 'key_EndAlertDays', 'key_Status', 'key_ContractApproved',
    'key_Approved_Datetime'
  ];

  //ELEMENT_DATA: PeriodicElement[];
  dataSource = new MatTableDataSource<ContractViewModel>();
  selection = new SelectionModel<ContractViewModel>(true, []);
  contractObject: Contract = new Contract();
  filterValue = "";
  isAllSelected: boolean = false;
  ItemList: ContractViewModel[];
  Data: ContractViewModel[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('checkBoxClick') checkBoxClick = new EventEmitter<any>();

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim();
    this.contractObject.filterOn = this.filterValue;
    await this.getPageSize();
    this.FillGrid();
  }

  clearFilter(filterText: string) {
    if (!filterText) {
      this.filterValue = "";
      this.FillGrid();
    }

  }

  async getPageSize() {
    this.contractObject.ClientId = this.authService.currentUserValue.ClientId;
    this.contractObject.pageNo = 0;
    this.contractObject.pageSize = 0;
    await this.contractService.getContractList(this.contractObject).toPromise()
      .then(result => {
        this.contractObject.itemsLength = result.recordCount;
      });
    // default page size
    this.contractObject.pageSize = await this.contractService.getDefaultPageSize();
    this.contractObject.pageSizeOptions.push(this.contractObject.pageSize);
    // initial load should sort by last updated by at first
    //this.contractObject.sortColumn = 'UpdateDateTimeServer';
    //this.contractObject.sortOrder = 'Desc';
    this.paginator.pageIndex = 0;
  }

  masterToggle() {
    this.isAllSelected ?
      this.ItemList.length = 0 :
      this.dataSource.data.forEach(row => { this.selectedAllData(row); this.selection.isSelected(row); });
  }
  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }
  constructor(private router: Router, private toastrService: ToastrService, private authService: AuthService, private contractService: ContractService, private ptService: PreferenceTypeService, private datepipe: DatePipe,private ContractCommonService: ContractCommonDataService) { }
  selectRow: any;
  Status: any;
  EarliestPriceEnd: any;
  ContractApproved: any;

  async ngOnInit() {
    this.contractObject.ClientId = this.authService.currentUserValue.ClientId;
    //this.getTotalRecords();
    this.ItemList = new Array<any>();
    this.selectRow = 'selectRow';
    this.Status = 'Status';
    this.EarliestPriceEnd = 'EarliestPriceEnd';
    this.ContractApproved = 'ContractApproved';
    await this.getPageSize();
    this.FillGrid();
  }


  onPaginationEvent(event) {
    this.contractObject.filterOn = this.filterValue;
    this.contractObject.pageNo = event.pageIndex + 1;
    if (this.contractObject.pageNo > this.contractObject.itemsLength / event.pageSize) {
      this.contractObject.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.contractObject.pageSize = event.pageSize;
    }
    this.FillGrid();
    this.contractObject.pageSize = event.pageSize;
  }
  selectedAllData(selectedData) {
    this.ItemList.push(selectedData);
    this.dataemit();
  }
  dataemit() {
    this.checkBoxClick.emit(this.ItemList);
    this.ContractCommonService.EditContractList = this.ItemList;
  }
  selectAll(check: any) {
    this.selection.clear();
    this.isAllSelected = check.checked;
    this.dataSource.data.forEach(row => {
      row.IsSelected = this.isAllSelected;
      this.selection.toggle(row);
      if (check.checked) { this.ItemList.push(row); this.checkBoxClick.emit(this.ItemList); }
    });
    if (!check.checked) { this.ItemList.length = 0; this.checkBoxClick.emit(this.ItemList); }

    this.ContractCommonService.EditContractList = this.ItemList;
  }

  selectedCheckbox(e: any, selectedData) {
    selectedData.IsSelected = e.checked;
    if (e.checked == true) {
      this.ItemList.push(selectedData);
    }
    else {
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
    this.dataemit();

    
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.contractObject.sortColumn = event.active;
      this.contractObject.sortOrder = event.direction.toLocaleUpperCase();
      this.FillGrid();
    }
  }

  FillGrid() {
    this.selection.clear();
    this.contractObject.filterOn = this.filterValue;
    this.contractService.getContractList(this.contractObject)
      .subscribe(res => {
        this.Data = [];
        if (res.message == "Success") {
          res.data.forEach((value, index) => {
            this.Data.push({
              ID: value.id, Contract_Type: value.contract_Type,
              Contract_No: value.contract_No,
              ContractTypeId: value.contractTypeId,
              ClientID: value.clientID,
              Version: value.version,
              Description: value.description,
              Billing_Entity: value.billing_Entity,
              Customer_Ship_To_Location: value.customer_Ship_To_Location,
              Business_Partner: value.business_Partner,
              Customer_Code: value.customer_Code,
              Effective_Start: this.DateFormat(value.effective_Start),
              Effective_End: this.DateFormat(value.effective_End),
              EarliestPriceEnd: this.DateFormat(value.earliestPriceEnd),
              Evergreen: value.evergreen,
              End_Alert_Days: value.end_Alert_Days,
              Status: value.status,
              ContractApproved: value.contractApproved,
              LocationStatus: value.locationStatus,
              LocationSetupComplete: value.locationSetupComplete,
              Approved_Datetime: value.approved_Datetime == null ? "" : this.datepipe.transform(value.approved_Datetime, 'MM/dd/yyyy hh:mm:ss a'),
              IsSelected: false
            });
          })
          //this.isAllSelected = false;
          //this.dataSource = new MatTableDataSource<PeriodicElement>();
          this.dataSource = new MatTableDataSource<ContractViewModel>();
          this.dataSource.data = this.Data;
          this.paginator.showFirstLastButtons = true;
          //this.dataSource.sort = this.sort;
        }
      });

  }
  RemoveContract() {
    var sendData = [];
    var check = false;
    this.ItemList.forEach(function (x) {
      if (x.ContractApproved == "Yes") {
        check = true;
        return;
      }
      sendData.push({
        ID: x.ID,
        ContractTypeId: x.ContractTypeId,
        ContractApproved: x.ContractApproved
      });

    });
    if (check) {
      this.toastrService.error("Information: Approved contract cannot be deleted.");
      return false;
    }
    this.contractService.DeleteContract(sendData)
      .subscribe(res => {
        if (res.message == "Success") {
          this.toastrService.success("Contract deleted successfully");
          this.ItemList.length = 0;
          this.FillGrid();
        }

      });
  }
  ActiveContracts() {
    var sendData = [];
    var check = false;
    this.ItemList.forEach(function (x) {
      if (x.LocationStatus == false || x.LocationSetupComplete == false) {
        check = true;
        return;
      }
      sendData.push({
        ID: x.ID,
        ContractTypeId: x.ContractTypeId
      });
    });
    if (check) {
      this.toastrService.error("Information: The contract cannot be activated as the location is either inactive or not setup completely.");
      return false;
    }
    this.contractService.ActiveContracts(sendData)
      .subscribe(res => {
        if (res.message == "Success") {
          this.toastrService.success("Contract activated successfully.");
          this.ItemList.length = 0;
          this.FillGrid();
        }

      });
  }
  InactiveContracts() {
    var sendData = [];
    this.ItemList.forEach(function (x) {
      sendData.push({
        ID: x.ID,
        ContractTypeId: x.ContractTypeId
      });
    });
    this.contractService.InactiveContracts(sendData)
      .subscribe(res => {
        if (res.message == "Success") {
          this.toastrService.success("Contract de-activated successfully.");
          this.ItemList.length = 0;
          this.FillGrid();
        }

      });
  }
  DateFormat(datetime) {
    if (datetime == null)
      return null;
    var date = new Date(datetime);
    let formateddate = this.datepipe.transform(date, 'MM/dd/yyyy');
    return formateddate;
  }
 /* onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }*/
}

