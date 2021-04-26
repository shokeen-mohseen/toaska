
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { CommonListViewModel, ShipmentworkbenchFilterModel, shipmentworkbenchModel } from '@app/core/models/shipmentworkbench.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { projectkey } from '../../../../../../environments/projectkey';
import { AuthService } from '../../../../../core';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
export interface PeriodicElementManageFilter {
  Id: number;
  FilterName: string;
  DefaultFilter: string;
  FilterExpression: string;
  isEdited: boolean;  
}
export interface PeriodicElement {
  selectRow: string;
  ShipDate: string;
  ReqDeliveryDate: string;
  MustArriveByDate: string;
  PickupAppointment: string;
  DeliveryAppointment: string;
  ActDeliveryDate: string;
  ShipmentNo: string;
  ShipmentType: string;
  ShipFrom: string;
  ShipTo: string;
  Carrier: string;
  Quantity: string;
  TenderStatus: string;
  ShipmentStatus: string;
  ShipmentCondition: string;
  OrderNo: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
  { selectRow: '', ShipDate: '07/08/2020', ReqDeliveryDate: '07/02/2020', MustArriveByDate: '07/08/2020', PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: '412754.0', ShipmentType: 'CPU Order', ShipFrom: 'Tosca San Antonio [Tosca Ltd For Operating Location]', ShipTo: 'HEB MEAT [H.E.B. (CMK) Meat Plant]', Carrier: 'CPU1 - CPU (Customer Pick up)', Quantity: '6,526', TenderStatus: 'Tender Accept', ShipmentStatus: 'Shipped and AP Charges Sent To MAS', ShipmentCondition: 'Shipment Processed', OrderNo: '513934.0' },
];

@Component({
  selector: 'app-shipment-history-list',
  templateUrl: './shipment-history-list.component.html',
  styleUrls: ['./shipment-history-list.component.css']
})
export class ShipmentHistoryListComponent implements OnInit {
  selectedShipmentId: number;
  public dateFormat: String = "MM-dd-yyyy";
  orderNumber: any;
  shipmentWorkbenchHasReadOnlyAccess: boolean = false;
  ShipFromListTemp = [];
  ShipToListTemp = [];

  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };
  //displayedColumns = ['selectRow', 'ShipDate', 'ReqDeliveryDate', 'MustArriveByDate', 'PickupAppointment', 'DeliveryAppointment', 'ActDeliveryDate', 'ShipmentNo', 'ShipmentType', 'ShipFrom', 'ShipTo', 'Carrier', 'Quantity', 'TenderStatus', 'ShipmentStatus', 'ShipmentCondition', 'OrderNo'];
  ////displayedColumns = ['hierarchyname', 'detail'];
  //displayedColumnsReplace = ['selectRow', 'key_ShipDate', 'key_ReqDeliveryDate', 'key_MustArriveByDate', 'key_PickupAppointment', 'key_DeliveryAppointment', 'key_ActDeliveryDate', 'key_ShipmentNo', 'key_ShipmentType', 'key_ShipFrom', 'key_ShipTo', 'key_Carrier', 'key_Quantity', 'key_TenderStatus', 'key_ShipmentStatus', 'key_ShipmentCondition', 'key_OrderNo'];

  shipmentColumns = ['selectRow', 'shipDate', 'requestedDeliveryDate', 'mustArriveByDate', 'pickupAppointment',
    'deliveryAppointment', 'actualDeliveryDate', 'shipmentNumber', 'shipmentType', 'fromLocationName', 'toLocationName', 'isShipWith', 'carrierName',
    'orderQuantity', 'totalShipmentQuantity',
    'tenderStatusName', 'shipmentStatusName', 'conditionName', 'orderNumber', 'purchaseOrderNumber'];
  //'planToShipQuantity',
  shipmentColumns1 = ['selectRow', 'shipDate', 'requestedDeliveryDate', 'mustArriveByDate', 'pickupAppointment',
    'deliveryAppointment', 'actualDeliveryDate', 'shipmentNumber', 'shipmentType', 'fromLocationName', 'toLocationName', 'isShipWith', 'carrierName',
    'orderQuantity', 'totalShipmentQuantity',
    'tenderStatusName', 'shipmentStatusName', 'conditionName', 'orderNumber', 'purchaseOrderNumber'];

  shipmentColumnsNew = ['selectRow', 'key_ShipDate', 'key_RequestedDeliveryDate',
    'key_mabd', 'key_PickupAppointment',
    'key_DeliveryAppointment', 'key_ActualDeliveryDate', 'key_ShipmentNumber',
    'key_ShipmentType', 'key_fromLocationName', 'key_toLocationName',
    'key_ShipWith', 'key_Carriername', 'key_OrderQuantity',
    'key_totalShipmentQuantity', 'key_TenderStatus', 'key_ShipmentStatus',
    'key_ShipmentCondition', 'key_OrderNumber', 'key_purchaseOrderNumber'
  ];
  ManageFilterdisplayedColumns = ['selectRow', 'FilterName', 'DefaultFilter'];



  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  editingShipment: any;
  selectRow: any;
  OrderNo: any;
  clientID: number;
  SelectTab: string;
  ShipmentDetails: any = {};
  SDInbound: any = [];
  SDOutbound: any = [];
  ShipmentDetails1: any = {};
  selectedshipsmentsHistory: any = {};
  SelectedTab: string;
  isPaggingClick: boolean = false;
  orderQuantity: any;
  totalShipmentQuantity: any;
  sendObj: CommonListViewModel = new CommonListViewModel();
  shipmentworkbenchFilterModel: ShipmentworkbenchFilterModel = new ShipmentworkbenchFilterModel();
  //manage custom filter
  FilterName: string;
  DefaultFilter: boolean = false;
  isEditMode = false;
  //selectedCustomFilterMethodMapping: PeriodicElementManageFilter;
  FilterNameEdit: string;
  DefaultFilterEdit: boolean = false;
  IsEditDelete: boolean = true;
  IsSaveCancel: boolean = false;
  CustomFilterId: number;
  activeTab = 'outbound';
  isCustomer: boolean;
  isStockCollection: boolean;
  ManageFilterdSShipment;
  ManageFilter_ELEMENT_DATA: PeriodicElementManageFilter[] = [];
  CustomFilterItemList = [];
  SDManageFilter: any = [];
  selectedCustomFilterMethodMapping: PeriodicElementManageFilter;
  modalRef: NgbModalRef;
  @Output()
  EdittedShipmentNumber: EventEmitter<any> = new EventEmitter<any>();
  ControlPermissions: any = [];
  isEditByLink: boolean = false;
  MaxEditedRecordsCountPreferences: number;
  SelectedsalesOrderCount: number;
  dsSDInbound = new MatTableDataSource<any>();
  dsSDOutbound = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selection1 = new SelectionModel<any>(true, []);
  paginationModel = new shipmentworkbenchModel();
  filterValue = "";


  tabClick(TabName: any) {
    //this.shipmentManagementService.SelectTab = TabName;
    localStorage.SelectedTab = null;
    localStorage.setItem('SelectedTab', TabName);
    this.filterValue = "";
    this.SelectedTab = TabName;
    // this.getPageSize(this.SelectedTab);
    this.GetShipmentDetailsHistory(TabName);

    this.search(TabName);
  }
  

    ngAfterViewInit() {
      this.dsSDInbound.paginator = this.paginator;
      this.dsSDInbound.sort = this.sort;
      this.dsSDOutbound.paginator = this.paginator;
      this.dsSDOutbound.sort = this.sort;
     
    }


  constructor(private router: Router,
    private shipmentManagementService: shipmentManagementService,
    private authService: AuthService, private activatedRoute: ActivatedRoute, public modalService: NgbModal
  ) {
    this.buttonPermission();
    this.selectedShipmentId = parseInt(localStorage.SelectedShipmentId);
    this.SelectedTab = 'outbound';
  
  }

   ngOnInit() {
  
    this.orderNumber = 'orderNumber';
    this.orderQuantity = 'orderQuantity'
    this.totalShipmentQuantity = 'totalShipmentQuantity';

     this.isCustomer = true;
    this.isStockCollection = true;

    this.clientID = this.authService.currentUserValue.ClientId;
    this.selectRow = 'selectRow';
    this.paginationModel.sortOrder = "DESC";
    this.SelectedTab = 'outbound';
    this.GetShipmentDetailsHistory(this.SelectedTab);
     
    this.editingShipment = this.shipmentManagementService.EditingShipment;
    this.dsSDInbound = new MatTableDataSource<any>();
    this.dsSDOutbound = new MatTableDataSource<any>();
    this.ManageFilterdSShipment = new MatTableDataSource<any>(this.SDManageFilter);
  //  this.GetCustomManageFilters();

  }//init() end

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim();
    this.GetShipmentDetailsHistory(this.SelectedTab);
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

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.GetShipmentDetailsHistory(this.SelectedTab);
    }
  }

  search(activeTab) {
    this.activeTab = activeTab;
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authService.currentUserValue.UserId;
    this.authService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all

          if (data != null || data != undefined) {

            var isReadAndModify = false;
            data.forEach(irow => {
              if (irow.PermissionType == "Read and Modify") {
                isReadAndModify = true;
              }
            });

            if (isReadAndModify) {
              this.shipmentWorkbenchHasReadOnlyAccess = false;
              //  this.btnBar.enableAction('edit');
            }
            else {
              this.shipmentWorkbenchHasReadOnlyAccess = true;
              //this.btnBar.disableAction('edit');
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }

  GetShipmentDetailsHistory(tabName: any) {
    this.selection.clear();
    if (!this.isPaggingClick)
      this.paginationModel.filterOn = this.filterValue;

    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.paginationModel.InboundOutbound = tabName;
    this.paginationModel.UpdatedBy = this.authService.currentUserValue.LoginId;
    this.paginationModel.itemsLength = 0;

    this.shipmentManagementService.GetAllShipmentDetailsHistory(this.paginationModel)
      .subscribe(data => {
        if (this.paginationModel.InboundOutbound == "outbound") {
          this.ShipmentDetails = data.data;
          this.paginationModel.itemsLength = data.recordCount;
          this.SDOutbound = data.data;
          this.SDOutbound.forEach(row => {
            if (!(row.shipDate == null || row.shipDate == undefined || row.shipDate == '')) {
              row.shipDate = this.Converttodate(row.shipDate);
            }
            if (!(row.requestedDeliveryDate == null || row.requestedDeliveryDate == undefined || row.requestedDeliveryDate == '')) {
              row.requestedDeliveryDate = this.Converttodate(row.requestedDeliveryDate);
            }
            if (!(row.mustArriveByDate == null || row.mustArriveByDate == undefined || row.mustArriveByDate == '')) {
              row.mustArriveByDate = this.Converttodate(row.mustArriveByDate);
            }
            if (!(row.actualDeliveryDate == null || row.actualDeliveryDate == undefined || row.actualDeliveryDate == '')) {
              row.actualDeliveryDate = this.Converttodate(row.actualDeliveryDate);
            }

            if (!(row.pickupAppointment == null || row.pickupAppointment == undefined || row.pickupAppointment == '')) {
              row.pickupAppointment = this.Converttodate(row.pickupAppointment);
            }
            if (!(row.deliveryAppointment == null || row.deliveryAppointment == undefined || row.deliveryAppointment == '')) {
              row.deliveryAppointment = this.Converttodate(row.deliveryAppointment);
            }
            if (!(row.shipmentNumber == null || row.shipmentNumber == undefined || row.shipmentNumber == '')) {
              row.shipmentNumber = row.shipmentNumber + "." + row.shipmentVersion;
            }
            row.orderNumber = row.orderNumber + "." + row.orderVersionNumber;

            row.isShipWith = row.isShipWith ? "Yes" : "No";
            row.orderQuantity = Math.abs(row.orderQuantity);
            row.totalShipmentQuantity = Math.abs(row.totalShipmentQuantity);
          })
          this.dsSDOutbound = new MatTableDataSource<any>(this.SDOutbound);
          this.reselectShipments();
        }
        else if (this.paginationModel.InboundOutbound == "inbound") {
          this.ShipmentDetails = data.data;
          this.paginationModel.itemsLength = data.recordCount;
          this.SDInbound = data.data;
          this.SDInbound.forEach(row => {
            if (!(row.shipDate == null || row.shipDate == undefined || row.shipDate == '')) {
              row.shipDate = this.Converttodate(row.shipDate);
            }
            if (!(row.requestedDeliveryDate == null || row.requestedDeliveryDate == undefined || row.requestedDeliveryDate == '')) {
              row.requestedDeliveryDate = this.Converttodate(row.requestedDeliveryDate);
            }
            if (!(row.mustArriveByDate == null || row.mustArriveByDate == undefined || row.mustArriveByDate == '')) {
              row.mustArriveByDate = this.Converttodate(row.mustArriveByDate);
            }
            if (!(row.actualDeliveryDate == null || row.actualDeliveryDate == undefined || row.actualDeliveryDate == '')) {
              row.actualDeliveryDate = this.Converttodate(row.actualDeliveryDate);
            }

            if (!(row.pickupAppointment == null || row.pickupAppointment == undefined || row.pickupAppointment == '')) {
              row.pickupAppointment = this.Converttodate(row.pickupAppointment);
            }
            if (!(row.deliveryAppointment == null || row.deliveryAppointment == undefined || row.deliveryAppointment == '')) {
              row.deliveryAppointment = this.Converttodate(row.deliveryAppointment);
            }
            if (!(row.shipmentNumber == null || row.shipmentNumber == undefined || row.shipmentNumber == '')) {
              row.shipmentNumber = row.shipmentNumber + "." + row.shipmentVersion;
            }
            row.orderNumber = row.orderNumber + "." + row.orderVersionNumber;
            row.isShipWith = row.isShipWith ? "Yes" : "No";
            row.orderQuantity = Math.abs(row.orderQuantity);
            row.totalShipmentQuantity = Math.abs(row.totalShipmentQuantity);
          })
          this.dsSDInbound = new MatTableDataSource<any>(this.SDInbound);
          console.log(this.SDInbound);
          this.reselectShipments();
        }

        //setTimeout(() => {
        //  if (!isNaN(this.selectedShipmentId)) {

        //    this.editShipmentChange(this.selectedShipmentId);
        //  }
        //}, 2000);

      });
  }

  reselectShipments() {
    if (this.ShipmentDetails != undefined && this.ShipmentDetails != null) {
      if (this.shipmentManagementService.ShipmentsforEdit.length > 0) {
        this.ShipmentDetails.forEach(row => {
          if (this.shipmentManagementService.ShipmentsforEdit.some(item => item.id === row.id)) { this.selection.select(row) }
        });
      }
    }
  }
  Converttodate(vdatetime: Date) {
    let dt = new Date(vdatetime);
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var date = dt.getDate();
    return month.toString() + "/" + date.toString() + "/" + year.toString();
  }

  selectedvalue(row, checked: boolean) {
    row.IsSelected = checked;

    if (this.ShipmentDetails != undefined && this.ShipmentDetails != null) {
      this.ShipmentDetails.forEach(irow => { if (irow.id == row.id) { this.selection.toggle(irow); } });
      const selectedshipmentsOrder = this.selection.selected.map(({ id, shipmentNumber, shipmentVersion, shipmentStatusName, tenderStatusName, orderID }) => {
        return { id, shipmentNumber, shipmentVersion, shipmentStatusName, tenderStatusName, orderID }
      });
      const selectedshipmentsHistory = selectedshipmentsOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));
      this.SelectedsalesOrderCount = 0;
      this.SelectedsalesOrderCount = selectedshipmentsHistory.length;
      this.shipmentManagementService.ShipmentsforEditHistory = {};
      this.shipmentManagementService.ShipmentsforEditHistory = selectedshipmentsHistory;
      this.shipmentManagementService.SelectTabHistory = "";

    }
  }

  applyGlobalFilter() {
    this.paginationModel.shipmentworkbenchFilterModel = this.shipmentworkbenchFilterModel;
    this.GetShipmentDetailsHistory(this.SelectedTab);
  }

  //manage custom filter
  ResetGlobalFilter() {
    this.shipmentworkbenchFilterModel = new ShipmentworkbenchFilterModel;
    this.paginationModel.shipmentworkbenchFilterModel = null;
    this.CustomFilterId = 0;
    this.GetShipmentDetailsHistory(this.SelectedTab);

  }

  editOrderLink(action, row) {
    localStorage.SelectedTab = null;
    localStorage.setItem('SelectedOrderIdLink', row.orderID);
    localStorage.setItem('SelectedOrderTypeIdLink', row.orderTypeID);
    localStorage.setItem('SelectedTab', this.SelectedTab);
    localStorage.setItem('isOrderLinkClick', 'Yes');
    localStorage.setItem('SelectedOrderType', row.orderType);
    this.router.navigateByUrl('/order-management/order-workbench');
  }
  //CreateNewFilter() {
  //  if (this.FilterName != null && this.FilterName != "") {

  //    var RequestObject = {
  //      FilterName: this.FilterName,
  //      IsDefault: this.DefaultFilter,
  //      FilterExpression: JSON.stringify(this.shipmentworkbenchFilterModel),
  //      UserID: this.authService.currentUserValue.UserId,
  //      ClientID: this.authService.currentUserValue.ClientId,
  //      SelectedTab: this.SelectedTab
  //    };
  //    this.shipmentManagementService.CreateManageFilter(RequestObject)
  //      .subscribe(result => {
  //        if (result.data == true && result.message == "Success") {
  //        //  this.GetCustomManageFilters();
  //          this.FilterName = "";
  //          this.DefaultFilter = false;
  //          this.CustomFilterId = 0;
  //        }
  //      }
  //      );
  //  }
  //}


  //editShipmentChange(shipmentId: number) {
  //  if (shipmentId != 0) {//&& this.isEditByLink == false
  //    this.isEditByLink = true;
  //    var row = null;
  //    if (this.ShipmentDetails != undefined && this.ShipmentDetails != null) {
  //      row = this.ShipmentDetails.find(x => x.id === shipmentId);
  //      this.selectedvalue(row, true);
  //    }
  //    this.EdittedShipmentNumber.emit(shipmentId);
  //    localStorage.SelectedShipmentId = null;
  //    localStorage.SelectedTab = null;
  //    this.selectedShipmentId = 0;
  //  }
  //}


}
