import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { AuthService } from '../../../../core';
import { MaterialPlaningReportService } from '../../../../core/services/material-planing-report.service';
import { OrdermanagementCommonOperation } from '../../../../core/services/order-management-common-operations.service';
import { MaterialPlaningreport } from '../../../../core/models/regularOrder.model';

@Component({
  selector: 'app-material-planning-report',
  templateUrl: './material-planning-report.component.html',
  styleUrls: ['./material-planning-report.component.css']
})
export class MaterialPlanningReportComponent implements OnInit, AfterViewInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  MaterialPlanningReportList: string = 'MaterialPlanningDetailExport';
  LocationTypeList = [];
  LocationList = [];
  selectedItems = [];
  LocationItems = [];
  settings = {};
  filterValue = "";
  count = 6;
  filter: boolean = false;
  panelOpenState: boolean = false;
  SearchcalendarDate: Date;
  ControlPermissions: any = [];
  displayedColumns = [
    'ShipmentNumber',
    'OrderNumber',
    'ShipDate',
    'ShipFrom',
    'ShipTo',
    'Carrier', 'Mode',
    'Equipment', 'Item',
    'ItemQuantity',
    'OrderComment',
    'TransportationComment',
    'LoadingComment'
  ];
  displayedColumnsReplace = [
    'key_ShipmentNumber',
    'key_OrderNo',
    'key_shipDate',
    'key_ShipFrom',
    'key_ShipTo',
    'key_Carrier',
    'key_Mode',
    'key_Equipment',
    'key_Item',
    'key_ItemQuantity',
    'key_OrderComment',
    'key_TransportationComment',
    'key_LoadingComment'
  ];

  MaterialPlanning_DATA: MaterialPlanning[] = [];
  displayedColumns1 = [
    'ShipFrom',
    'item',
    'item1',
    'item2',
    'item3',
    'item4', 'item5',
    'item6', 'item7',
    'item8',
    'item9',
    'item10',
    'item11',
    'item12',
    'item13',
    'item14',
    'item15'
  ];
  displayedColumnsReplace1 = [];

  dataSource = new MatTableDataSource<MaterialPlanning>();
  dataSource1 = new MatTableDataSource<PeriodicElement1>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  ShipType: number;
  isChecked: boolean = false;
  NextNumberofDays: number;
  FromshipdatecalendarDate: string;
  SearchDate: Date;
  LocationFunctionIDs: string;
  isMultiple: boolean = true;
  materialPlaningreport = new MaterialPlaningreport();
  materialSummaryreport = new MaterialPlaningreport();

  columns: Array<any>
  displayedSummaryColumns: Array<any>
  dataSourceSummary: any
  dataSourceSummarys: any
  isSummary: boolean = false;
  isPlaningLocation: boolean;
  async getPageSize() {
    var materialPlaningreport = new MaterialPlaningreport();
    if (this.NextNumberofDays != 0) {
      this.FromshipdatecalendarDate = this.NextNumberofDays.toString();
    }

    if (this.isChecked) {
      this.materialPlaningreport.AssignedToShipment = "AssignedToShipment,SendforShipping,OpenOrderNeedsToBeCompleted";
    }
    else {
      this.materialPlaningreport.AssignedToShipment = "AssignedToShipment,SendforShipping";
    }
    this.materialPlaningreport.pageNo = 0;
    this.materialPlaningreport.pageSize = 0;
    this.materialPlaningreport.filterOn = this.filterValue;
    this.materialPlaningreport.LocationFunctionIDs = this.LocationFunctionIDs;
    this.materialPlaningreport.SearchcalendarDate = this.orderCommonService.convertDatetoStringDate(this.SearchcalendarDate);
    this.materialPlaningreport.FromshipdatecalendarDate = this.FromshipdatecalendarDate;
    this.materialPlaningreport.LoginId = this.authenticationService.currentUserValue.ClientId.toString();

    if (!!this.LocationFunctionIDs) {
      if (this.isMultiple) {
        this.materialPlaningReportService.GetMaterialPlaningreportDetailList(this.materialPlaningreport).toPromise()
          .then(result => {
            this.materialPlaningreport.itemsLength = result.recordCount;
          }
          );
      }
      else {
        this.materialPlaningReportService.GetMaterialSummaryreportDetailList(this.materialPlaningreport)
          .subscribe(result => {

            this.materialSummaryreport.itemsLength = result.recordCount;
          });
      }
    }

    if (this.isMultiple) {
      // default page size
      this.materialPlaningreport.pageSize = await this.materialPlaningReportService.getDefaultPageSize();
      this.materialPlaningreport.pageSizeOptions.push(this.materialPlaningreport.pageSize);
    }
    else {
      this.materialSummaryreport.pageSize = await this.materialPlaningReportService.getDefaultPageSize();
      this.materialSummaryreport.pageSizeOptions.push(this.materialSummaryreport.pageSize);
    }
  }

  onPaginationEvent(event) {
    this.materialPlaningreport.pageNo = event.pageIndex + 1;
    this.materialPlaningreport.pageSize = event.pageSize;
    this.ApplyFilter();
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.materialPlaningreport.sortColumn = event.active;
      this.materialPlaningreport.sortOrder = event.direction.toLocaleUpperCase();
      this.ApplyFilter();
    }
  }

  async applyFilter(filterText: string) {

    this.filterValue = filterText.trim(); // Remove whitespace
    await this.getPageSize();
    this.ApplyFilter();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.ApplyFilter();
    }

  }

  setDateMMddyyyy(date: Date) {

    return new Date(`${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`);
  }


  constructor(private materialPlaningReportService: MaterialPlaningReportService,
    private orderCommonService: OrdermanagementCommonOperation,
    private authenticationService: AuthService) {

  }

  async ngOnInit() {

    this.actionGroupConfig = getGlobalRibbonActions();

    this.settings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      //badgeShowLimit: 1,
      searchBy: ['itemName']
    };

    this.getShipType();
    this.SearchcalendarDate = this.setDateMMddyyyy(new Date());

    this.getPageSize();

    this.getNumberOfDays();
    this.getPageControlsPermissions();

  }

  ngAfterViewInit() {
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.showAction('filter');
    this.btnBar.showAction('export');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
    this.paginator.showFirstLastButtons = true;
  }

  actionHandler(type) { }

  onLocationTypeSelect(item: any) {
    let iDs: string = '';
    this.selectedItems.filter(x => {
      iDs += `${x.id},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
    }
    this.getShipLocation(iDs);
  }
  onDeLocationTypeAll(items: any) { }
  onLocationTypeSelectAll(item: any) {
    let iDs: string = '';
    this.selectedItems.filter(x => {
      iDs += `${x.id},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
    }
    this.getShipLocation(iDs);
  }

  onItemSelect(item: any) {
    let iDs: string = '';
    this.LocationItems.filter(x => {
      iDs += `${x.id},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
    }
    this.LocationFunctionIDs = iDs;

  }
  OnItemDeSelect(item: any) { }
  onItemSelectAll(items: any) {
    let iDs: string = '';
    this.LocationItems.filter(x => {
      iDs += `${x.id},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
    }
    this.LocationFunctionIDs = iDs;
  }
  onDeSelectAll(items: any) { this.LocationFunctionIDs = "";}

  showFilter() {
    this.panelOpenState = !this.panelOpenState
  }

  getShipType() {
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    let Code = "";
    if (this.isMultiple) {
      Code = "MaterialPlaning";
    }
    else {
      Code = "MaterialSummary";
    }
    this.materialPlaningReportService.ShipTypeData(ClientId, Code)
      .subscribe(result => {
        var datas = result.data;
        this.LocationTypeList = [];
        datas.map(item => {
          return {
            itemName: item.name,
            id: Number(item.id)
          };
        }).forEach(x => this.LocationTypeList.push(x));
      });
  }

  getShipLocation(LocationFunctionID) {
    var ClientId = this.authenticationService.currentUserValue.ClientId;

    this.materialPlaningReportService.ShipLocationData(ClientId, LocationFunctionID)
      .subscribe(result => {
        var datas = result.data;
        this.LocationList = [];
        datas.map(item => {
          return {
            itemName: item.name,
            id: Number(item.id)
          };
        }).forEach(x => this.LocationList.push(x));
      });
  }

  MaterialPlanningReport() {
    this.isMultiple = true;
    this.getPageSize();
    this.getShipType();
  }

  MaterialSummary() {
    this.isMultiple = false;
    this.getPageSize();
    this.getShipType();
    this.IncrementDateFormate();
  }
  OpenOrderCheckBox(event: any) {
    if (event) {
      this.isChecked = false;
    }
    else {
      this.isChecked = true;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ApplyFilter() {
    this.IncrementDateFormate();
    if (this.NextNumberofDays != 0) {
      this.FromshipdatecalendarDate = this.NextNumberofDays.toString();
    }

    if (this.isChecked) {
      this.materialPlaningreport.AssignedToShipment = "AssignedToShipment,SendforShipping,OpenOrderNeedsToBeCompleted";
    }
    else {
      this.materialPlaningreport.AssignedToShipment = "AssignedToShipment,SendforShipping";
    }

    this.materialPlaningreport.filterOn = this.filterValue;
    this.materialPlaningreport.LocationFunctionIDs = this.LocationFunctionIDs;
    this.materialPlaningreport.SearchcalendarDate = this.orderCommonService.convertDatetoStringDate(this.SearchcalendarDate);
    this.materialPlaningreport.FromshipdatecalendarDate = this.FromshipdatecalendarDate;
    this.materialPlaningreport.LoginId = this.authenticationService.currentUserValue.ClientId.toString();
    if (!!this.LocationFunctionIDs) {
      if (this.isMultiple) {
        this.materialPlaningReportService.GetMaterialPlaningreportDetailList(this.materialPlaningreport)
          .subscribe(result => {
            this.dataSource.data = [];
            this.MaterialPlanning_DATA = [];

            //this.SalesOrderDetailsBoth = result.data;   
            result.data.forEach((value, index) => {
              this.MaterialPlanning_DATA.push({
                ShipmentNumber: value.shipmentNumber,
                OrderNumber: value.orderNumber,
                ShipDate: value.shipDate,
                ShipFrom: value.shipFrom,
                ShipTo: value.shipTo,
                Carrier: value.carrier,
                Mode: value.mode,
                Equipment: value.equipment,
                Item: value.item,
                ItemQuantity: value.itemQuantity,
                OrderComment: value.orderComment,
                TransportationComment: value.transportationComment,
                LoadingComment: value.loadingComment
              });
            });

            this.dataSource = new MatTableDataSource<MaterialPlanning>();
            this.dataSource.data = this.MaterialPlanning_DATA;
            this.materialPlaningreport.itemsLength = result.recordCount;

          }
          );
      }
      else {
        this.materialPlaningReportService.GetMaterialSummaryreportDetailList(this.materialPlaningreport)
          .subscribe(result => {

            this.materialSummaryreport.itemsLength = result.recordCount;

            const columns = result.data
              .reduce((columns, row) => {
                return [...columns, ...Object.keys(row)]
              }, [])
              .reduce((columns, column) => {
                return columns.includes(column)
                  ? columns
                  : [...columns, column]
              }, [])
            // Describe the columns for <mat-table>.
            this.columns = columns.map(column => {
              return {
                columnDef: column,
                header: column,
                cell: (element: any) => `${element[column] ? element[column] : ``}`
              }
            })
            this.displayedSummaryColumns = this.columns.map(c => c.columnDef);
            // Set the dataSource for <mat-table>.
            this.dataSourceSummarys = result.data;
            this.dataSourceSummary = result.data;

            const rowList = result.data;
            if (rowList.length > 0) {
              this.isSummary = true;
            }
            else {
              this.isSummary = false;
            }
          }
          );
      }
    }

  }

  ResetFilter() {
    this.FromshipdatecalendarDate = "";
    this.selectedItems = [];
    this.LocationItems = [];
    this.SearchcalendarDate = this.setDateMMddyyyy(new Date());
    //this.NextNumberofDays =  this.getNumberOfDays();
    this.isMultiple = true;
    this.isChecked = false;
    this.getNumberOfDays();
  }

  onPaginationSummaryEvent(event) {
    this.materialSummaryreport.pageNo = event.pageIndex + 1;
    this.materialSummaryreport.pageSize = event.pageSize;
    this.ApplyFilter();
  }
  async applySummaryFilter(filterText: string) {

    this.filterValue = filterText.trim(); // Remove whitespace
    await this.getPageSize();
    this.ApplyFilter();

  }

  customSummarySort(event) {
    if (event.active != 'selectRow') {
      this.materialSummaryreport.sortColumn = event.active;
      this.materialSummaryreport.sortOrder = event.direction.toLocaleUpperCase();
      this.ApplyFilter();
    }
  }

  DateFormate(selectedDate: Date) {
    try {
      var date = selectedDate.getDate();
      var month = selectedDate.getMonth() + 1;
      var year = selectedDate.getFullYear();
      return month.toString() + "/" + date.toString() + "/" + year.toString();
    }
    catch (e) {
      var dateNew = new Date(selectedDate);
      var datedd = dateNew.getDate();
      var monthmm = dateNew.getMonth() + 1;
      var yearyy = dateNew.getFullYear();
      return monthmm.toString() + "/" + datedd.toString() + "/" + yearyy.toString();
    }
  }

  IncrementDateFormate() {
    this.displayedColumnsReplace1 = [];
    //this.DateFormate(this.SearchcalendarDate);
    var loop = this.SearchcalendarDate;
    this.displayedColumnsReplace1.push("ShipFrom");
    this.displayedColumnsReplace1.push("Item");

    for (var i = 0; i < Number(this.FromshipdatecalendarDate); i++) {
      let newDate;
      if (i == 0) {
        newDate = loop.setDate(loop.getDate());
      }
      else {
        newDate = loop.setDate(loop.getDate() + 1);
      }

      loop = new Date(newDate);

      this.displayedColumnsReplace1.push(this.DateFormate(loop));
    }
  }

  async getNumberOfDays() {

    this.NextNumberofDays = await this.materialPlaningReportService.getDefaultNumberOfdaysinShipmentMaterialPlaningReport();

  }


  getPageControlsPermissions() {
    var ModuleRoleCode = "MPR";
   
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var LoginId = this.authenticationService.currentUserValue.LoginId;
    this.materialPlaningReportService.getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.ControlPermissions = res.Data;

          //Stock
          var isMaterialPlaningPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("MPR"));
          if (isMaterialPlaningPermission != null && isMaterialPlaningPermission != undefined) {
            if (isMaterialPlaningPermission.length > 0) {
              if ((isMaterialPlaningPermission[0].PermissionType.toLowerCase() == "read and modify") || (isMaterialPlaningPermission[0].PermissionType.toLowerCase() == "read only")) {
                //Show Stock Grid
                this.isPlaningLocation = true;
              } else {
                //Hide Customer
                this.isPlaningLocation = false;
              }
            }
          }
          if (isMaterialPlaningPermission.length == 0) {
            this.isPlaningLocation = false;
          }

          //Customer
          

          

        }
      });
  }
}

export interface MaterialPlanning {
  ShipmentNumber: string;
  OrderNumber: string;
  ShipDate: string;
  ShipFrom: string;
  ShipTo: string;
  Carrier: string;
  Mode: string;
  Equipment: string;
  Item: string;
  ItemQuantity: string;
  OrderComment: string;
  TransportationComment: string;
  LoadingComment: string;

}
export interface PeriodicElement1 {
  ShipFrom: string;
  item: string
  item1: string;
  item2: string;
  item3: string;
  item4: string; item5: string;
  item6: string; item7: string;
  item8: string;
  item9: string;
  item10: string;
  item11: string;
  item12: string;
  item13: string;
  item14: string;
  item15: string;
}




