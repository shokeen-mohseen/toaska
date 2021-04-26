import { ViewChild, Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { OrderManagementComponent } from '../../../modules/order-management/pages/order-management.component';
import { OrderManagementService } from '../../../core/services/order-management.service';
import { OrdermanagementCommonOperation } from '../../../core/services/order-management-common-operations.service';
import { CommonOrderModel } from '../../../core/models/regularOrder.model';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr'
import { DataExportService } from '../../../core/services/DataExport.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialService } from '../../../core/services/material.service';
import { MaterialHierarchyModel, MaterialCommodityMap } from '../../../core/models/material.model';
import { AuthService } from '../../../core';
import { BusinessPartnerService } from '../../../core/services/business-partner.service';
import { BPByLocation } from '../../../core/models/BusinessPartner.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChargeService } from '../../../core/services/charge.service';
import { ContractService } from '../../../core/services/contract.service';
import { FreightLane } from '../../../core/models/FreightLane.model';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { GeolocationService } from '../../../core/services/geolocation.services';
import { FreightLaneService } from '../../../core/services/freightlane.service';



@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.css']
})
export class DataExportComponent implements OnInit {
  displayedColumns = ['createDateTimeBrowser', 'createdBy', 'statusDescription', 'download', 'delete'];
  displayedColumnsReplace = ['key_Datesubmit', 'key_User', 'key_Status', 'key_Download', 'key_Delete'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  materialNamelist = [];
  materialNameMap = {};
  commonOrderModel: CommonOrderModel = new CommonOrderModel();
  materialHierarchyModel = new MaterialHierarchyModel();
  paginationModel = new MaterialCommodityMap();
  paginationModelForBPByLocation: BPByLocation = new BPByLocation();
  public dateFormat: String = "MM-dd-yyyy";
  date6: Date;
  required1 = true;
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


  public DocumentSectionName: string = 'BusinessPartner'

  IsOrderSection: boolean = false;
  IsBusinessPartnerSection: boolean = false;
  IsCustomerPartnerSection: boolean = false;
  IsContractSection: boolean = false;
  IsMaterialSection: boolean = false;
  IsClaimSection: boolean = false;
  IsOrderNumberShow: boolean = false;
  IsOrderExpAllVer: boolean = false;
  IsOrderTypeShow: boolean = false;
  IsMaterailCode: boolean = false;
  IsChargeCategory: boolean = false;
  IsShipmentNumber: boolean = false;
  IsMaterialName: boolean = false;
  IsMaterialHistory: boolean = false;
  IsOrderFromLocationType: boolean = false;
  IsOrderToLocationType: boolean = false;
  IsOrderToLocation: boolean = false;
  IsOrderFromLocation: boolean = false;
  IsBillingEntityCustomer: boolean = false;
  IsBillingEntityBusiness: boolean = false;
  IsSalesManagerOrder: boolean = false;
  IsShipTo: boolean = false;
  IsBusinessPartner: boolean = false;
  IsBusinessPartnerName: boolean = false;
  IsBillingEntity: boolean = false;
  IsCarrierBillingEntity: boolean = false;
  IsGroup: boolean = false;
  IsCustomer: boolean = false;
  IsCustomerBill: boolean = false;
  IsBusinesspart: boolean = false;
  IsContract: boolean = false;
  IsType: boolean = false;
  IsCommodity: boolean = false;
  IsSalesmanager: boolean = false;
  IsClaimstatus: boolean = false;
  IsClaimFor: boolean = false;
  Isclaimdate: boolean = false;
  IsFromDelieverydate: boolean = false;
  IsToDelieverydate: boolean = false;
  IsFrmdatec: boolean = false;
  IsTodatec: boolean = false;
  IsFromschedule: boolean = false;
  IsToshipdate: boolean = false;
  IsFrmschduledate: boolean = false;
  IsToscheduledate: boolean = false;
  IsStatus: boolean = false;
  IsLatestVersion: boolean = false;
  IsExportAllVersion: boolean = false;
  IsBillingEntityCustomerLocation: boolean = false;
  IsSalesManagerCustomerLocation: boolean = false;
  IsSalesManagerContract: boolean = false;
  IsCustomerContract: boolean = false;
  IsBusinessPartnerContract: boolean = false;
  IsContractStart: boolean = false;
  IsContractEnd: boolean = false;
  IsContractExpAllVer: boolean = false;
  IsOrgnization: boolean = false;
  IsFromCountry: boolean = false;
  IsFromState: boolean = false;
  IsFromCity: boolean = false;
  IsFromZip: boolean = false;
  IsToCountry: boolean = false;
  IsToState: boolean = false;
  IsToCity: boolean = false;
  IsToZip: boolean = false;
  IsMode: boolean = false;


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
  constructor(private router: Router, public activeModal: NgbActiveModal,
    private orderservice: OrderManagementService,
    private orderCommonService: OrdermanagementCommonOperation,
    private materialService: MaterialService,
    private authenticationService: AuthService,
    public businessService: BusinessPartnerService,
    private chargeService: ChargeService,
    private contractService: ContractService,
    private freightLaneService: FreightLaneService,
    private geolocation: GeolocationService,
    private dataexportservice: DataExportService, private toaster: ToastrService) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.FreightLanemodel = new FreightLane();
  }
  itemListA = [];
  itemListB = [];
  


  selectedItemsA = [];
  settingsA = {};
  selectedItemsB = [];
  settingsB = {};

  count = 3;
  selectRow: any;
  PopuHeading: string = '';
  OrderTypeData: any[] = [];
  materialHierarchyData$: Observable<any>;
  billEntityData$: Observable<any>;
  materialHierarchyDataModel: any[] = [];
  materialNameData: any[] = [];
  chargeCategoryData: any[] = [];
  chargeCategoryDataModel: any[] = [];
  billingEntityData: any[] = [];
  billingEntityDataModel: any[] = [];
  customerBillingEntityData: any[] = [];
  customerBillingEntityDataModel: any[] = [];
  businessBillingEntityData: any[] = [];
  businessBillingEntityDataModel: any[] = [];
  salesManagerData: any[] = [];
  salesManagerDataModel: any[] = [];
  businessPartnerTypeData: any[] = [];
  businessPartnerTypeDataModel: any[] = [];
  billingEntityCarrierData: any[] = [];
  billingEntityCarrierDataModel: any[] = [];
  materialNameDataModel: any[] = [];
  OrderTypeDataModel: any[] = [];
  ShipToTypeList: any[] = [];
  ShipToTypeListModel: any[] = [];
  ShipFromTypeList: any[] = [];
  ShipFromTypeListModel: any[] = [];
  DocumentList: any[] = [];
  OrderNumbers: string = '';
  fromDelevryDateModel: Date;
  toDelevryDateModel: Date;
  fromOrderDateModel: Date;
  toOrderDateModel: Date;
  fromScheduleDateModel: Date;
  toScheduleDateModel: Date;
  contractTypeListData: any[] = [];
  contractTypeListDataModel: any[] = [];
  contractBusinessPartnerData: any[] = [];
  contractBusinessPartnerDataModel: any[] = [];
  customerListData: any[] = [];
  customerListDataModel: any[] = [];
  frmContractDateModel: Date;
  toContractDateModel: Date;
  ContractAllVersion: boolean;
  IsOrgnizationData: any[] = [];
  IsOrgnizationDataModel: any[] = [];
  FcountryList: any = [];
  FreightModeList: any = [];
  TstateList: any = []; TcityList: any = []; TzipList: any = [];
  TcountryList: any = []; duplicateList: any = [];
  FstateList: any = []; FcityList: any = []; FzipList: any = [];
  selectedCityItems: []; selectedZipItems: []; zipCode: string;
  stateCode: string; countryCode: string; cityCode: string;
  FCountryData = [];
  FStateData = [];
  FCityData = [];
  FZipData = [];
  TCountryData = [];
  TStateData = [];
  TCityData = [];
  TZipData = [];
  FreightModeData = [];
  clientId: number;
  FreightLanemodel: FreightLane;
  ngOnInit(): void {
    const reqBody = {
      ClientId: this.authenticationService.currentUserValue.ClientId,
      SourceSystemId: this.authenticationService.currentUserValue.SourceSystemID,
      DocumentTypeCode: this.DocumentSectionName
    }
    
    if (!this.DocumentSectionName) {
      this.DocumentSectionName = 'ExportInProcess'
    }
    this.materialService.generateAllReportList(reqBody).subscribe(res => {
      this.dataSource.data = res.data;
    })

    this.selectRow = 'selectRow';
    this.itemListA = [
      { "id": 1, "itemName": "Active" },
      { "id": 0, "itemName": "Inactive" }
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
      badgeShowLimit: 2,
      searchBy: ['itemName']
    };
    this.settingsB = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2,
      searchBy: ['itemName']
    };




    switch (this.DocumentSectionName) {

      case 'OrderManagementExport':
        this.IsOrderTypeShow = true;
        this.IsFrmschduledate = true;
        this.IsToscheduledate = true;
        this.IsFrmdatec = true;
        this.IsTodatec = true;
        this.IsToDelieverydate = true;
        this.IsFromDelieverydate = true;
        this.IsOrderFromLocation = true;
        this.IsOrderToLocation = true;
        this.IsOrderExpAllVer = true;
        this.IsBillingEntityCustomer = true;
        this.IsBillingEntityBusiness = true;
        this.IsSalesManagerOrder = true;
        
        break;

      case 'MaterialExport':
        this.IsMaterialName = true;
        this.IsMaterialHistory = true;
        break;

      case 'ChargeExport':
        this.IsChargeCategory = true;
        break;

      case 'BPExport':
        this.IsBillingEntity = true;
        this.IsBusinessPartner = true;
        break;

      case 'CarrierExport':
        this.IsCarrierBillingEntity = true;
        break;
      case 'CustomerLocationExport':
        this.IsBillingEntityCustomerLocation = true;
        this.IsSalesManagerCustomerLocation = true;
        break;
      case 'ContractExport':
        this.IsType = true;
        this.IsSalesManagerContract = true;
        this.IsCustomerContract = true;
        this.IsBusinessPartnerContract = true;
        this.IsCustomerContract = true;
        this.IsContractStart = true;
        this.IsContractEnd = true;
        this.IsContractExpAllVer = true;
        break;
      case 'CreditManagementExport':
        this.IsOrgnization = true;
        break;
      case 'FreightLaneExport':
        this.IsFromCountry = true;
        this.IsFromState = true;
        this.IsFromCity = true;
        this.IsFromZip = true;
        this.IsToCountry = true;
        this.IsToState = true;
        this.IsToCity = true;
        this.IsToZip = true;
        this.IsMode = true;
    }


    this.BindOrderManagmentDropownBind();
    if (this.DocumentSectionName === 'FreightLaneExport') {
      this.FreightLanemodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
      this.GetGeolocation(this.FreightLanemodel);
      this.freightLaneService.GetFreightModeList(this.FreightLanemodel).subscribe(data => {
        if (data.data != null) {
          this.FreightModeList = data.data;
        }
      });
    }
  }

  downloadExcel(path) {
    this.materialService.downloadExcelReport(path).subscribe(data => {
      const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const blob = new Blob([data], { type: contentType });
      // const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const fileName = path.split('/').slice(-1)[0];
      this.saveFile(blob, fileName);
    });
  }

  saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
    }
  }

 
  materialSelectionHandler() {
    const ids = this.materialNameDataModel.map(item => item.id).join(',');
    this.materialHierarchyData$ = this.materialService.getMaterialHierarchy(ids).pipe(map(res => res.data));
  }
  converttoSqlStringWithT(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var minutes = dt.getMinutes();
      var hour1 = hour.toString().padStart(2, "0");
      var minutes1 = dt.getMinutes().toString().padStart(2, "0");
      var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + (date + 1).toString().padStart(2, "0"))
      return datestring;
    }
    return null;
  }
  exportReport() {
    const modal: any = {
      ClientId: this.authenticationService.currentUserValue.ClientId,
      SourceSystemId: this.authenticationService.currentUserValue.SourceSystemID,
      CreatedBy: this.authenticationService.currentUserValue.LoginId,
      CreateDateTimeBrowser: new Date(),
      DocumentTypeCode: this.DocumentSectionName
    }
    if (this.DocumentSectionName === 'MaterialExport') {
      modal.FilterParameter = JSON.stringify({
        MaterialID: this.materialNameDataModel.map(item => item.id).join(','),
        MaterialHierarchyID: this.materialHierarchyDataModel.map(item => item.materialHierarchyID).join(',')
      })
    } else if (this.DocumentSectionName === 'ChargeExport') {
      modal.FilterParameter = JSON.stringify({
        ChargeCategoryId: this.chargeCategoryDataModel.map(item => item.id).join(',')
      })
    } else if (this.DocumentSectionName === 'BPExport') {
      modal.FilterParameter = JSON.stringify({
        BusinessPartnerTypeId: this.businessPartnerTypeDataModel.map(item => item.businessPartnerTypeId).join(','),
        BillingEntityId: this.billingEntityDataModel.map(item => item.billingEntityId).join(',')
      })
    } else if (this.DocumentSectionName === 'CarrierExport') {
      modal.FilterParameter = JSON.stringify({
        BillingEntityId: this.billingEntityCarrierDataModel.map(item => item.billingEntityId).join(',')
      })
    } else if (this.DocumentSectionName === 'OrderManagementExport') {
      modal.FilterParameter = JSON.stringify({
        CustomerBillingEntityId: this.customerBillingEntityDataModel.map(item => item.billingEntityId).join(','),
        BusinessBillingEntityId: this.businessBillingEntityDataModel.map(item => item.billingEntityId).join(','),
        SalesManagerId: this.salesManagerDataModel.map(item => item.Id).join(','),
        OrderTypeID: this.OrderTypeDataModel.map(item => item.code).join(','),
        FromDeleiveryDate: this.converttoSqlStringWithT(this.fromDelevryDateModel),
        ToDeleiveryDate: this.converttoSqlStringWithT(this.toDelevryDateModel),
        FromOrderDate: this.converttoSqlStringWithT(this.fromOrderDateModel),
        ToOrderDate: this.converttoSqlStringWithT(this.toOrderDateModel),
        FromScheduleShipDate: this.converttoSqlStringWithT(this.fromScheduleDateModel),
        ToScheduleShipDate: this.converttoSqlStringWithT(this.toScheduleDateModel)
      })
    } else if (this.DocumentSectionName === 'CustomerLocationExport') {
      modal.FilterParameter = JSON.stringify({
        CustomerBillingEntityId: this.customerBillingEntityDataModel.map(item => item.billingEntityId).join(','),
        SalesManagerId: this.salesManagerDataModel.map(item => item.Id).join(',')
      })
    } else if (this.DocumentSectionName === 'ForecastExport') {
      modal.FilterParameter = JSON.stringify({
        ForecastTypeId: ''
      })
    } else if (this.DocumentSectionName === 'ContractExport') {
      modal.FilterParameter = JSON.stringify({
        ContractTypeId: this.contractTypeListDataModel.map(item => item.id).join(','),
        SalesManagerId: this.salesManagerDataModel.map(item => item.id).join(','),
        BusinessPartnerId: this.businessPartnerTypeDataModel.map(item => item.id).join(','),
        CustomerId: this.customerListDataModel.map(item => item.id).join(','),
        FromContractDate: this.converttoSqlStringWithT(this.frmContractDateModel),
        ToContractDate: this.converttoSqlStringWithT(this.toContractDateModel),
        ContractAllVersion: this.ContractAllVersion
      })
    } else if (this.DocumentSectionName === 'CreditManagementExport') {
      modal.FilterParameter = JSON.stringify({
        OrganizationID: this.IsOrgnizationDataModel.map(item => item.id).join(',')
      })
    } else if (this.DocumentSectionName === 'FreightLaneExport') {
      modal.FilterParameter = JSON.stringify({
        FromCountry: this.FCountryData.map(item => item.id).join(','),
        FromState: this.FStateData.map(item => item.id).join(','),
        FromCity: this.FCityData.map(item => item.id).join(','),
        FromZip: this.FZipData.map(item => item.id).join(','),
        ToCountry: this.TCountryData.map(item => item.id).join(','),
        ToState: this.TStateData.map(item => item.id).join(','),
        ToCity: this.TCityData.map(item => item.id).join(','),
        ToZip: this.TZipData.map(item => item.id).join(','),
        FreightMode: this.FreightModeData.map(item => item.id).join(',')
      })
    }


    this.materialService.generateExcelReport(modal).subscribe(res => {
      const reqBody = {
        ClientId: this.authenticationService.currentUserValue.ClientId,
        SourceSystemId: this.authenticationService.currentUserValue.SourceSystemID,
        DocumentTypeCode: this.DocumentSectionName
      }
      this.materialService.generateAllReportList(reqBody).subscribe(res => {
        this.dataSource.data = res.data;
      })
    });
  }
  BindOrderManagmentDropownBind() {
    if (this.IsOrderTypeShow) { this.BindOrderType(); }
    if (this.IsOrderToLocationType) { this.getShipToType(); }
    if (this.IsOrderFromLocationType) { this.getShipFromType(); }
    if (this.IsMaterialHistory) { this.materialSelectionHandler(); }
    if (this.IsMaterialName) { this.getMaterialCommodityList(); }
    if (this.IsBusinessPartner) { this.getBusinessPartnerType(); }
    if (this.IsBillingEntity) { this.businessPartnerSelectionHandler(); }
    if (this.IsChargeCategory) { this.getChargeCategoryList(); }
    if (this.IsCarrierBillingEntity) { this.getBusinessPartnerGetBillingEntityCarrier(); }
    if (this.IsBillingEntityCustomer) { this.getCustomerBillingEntity(); }
    if (this.IsBillingEntityBusiness) { this.getBusinessBillingEntity(); }
    if (this.IsSalesManagerOrder) { this.getSalesmanagerList(); }
    if (this.IsBillingEntityCustomerLocation) { this.getCustomerBillingEntity(); }
    if (this.IsSalesManagerCustomerLocation) { this.getSalesmanagerList(); }
    if (this.IsType) { this.getContratTypeList(); }
    if (this.IsSalesManagerContract) { this.getSalesmanagerList(); }
    if (this.IsBusinessPartnerContract) { this.getBusinessPartnerType(); }
    if (this.IsCustomerContract) { this.getCustomerShipLocation(); }
    if (this.IsOrgnization) { this.getOrgnizationList(); }
    if (this.IsFromCountry) { this.GetGeolocation(this.FreightLanemodel); }
  }

  BindOrderType() {
    this.orderservice.OrderTypeList().subscribe((result) => {

      if (result.data != undefined) {
        this.OrderTypeData = result.data;
      }
    });
  }

  getMaterialCommodityList() {
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.materialService.getMaterialCommodityMapList(this.paginationModel)
      .subscribe(result => {
        if (result.data != undefined) {
          this.materialNameData = result.data;
        }
      });
  }

  getOrgnizationList() {
    this.businessService.getOrgnizationList(this.authenticationService.currentUserValue.ClientId)
      .subscribe(result => {
        if (result.data != undefined) {
          this.IsOrgnizationData = result.data;
        }
      })
  }

  GetGeolocation(modelgeolocation) {
    this.geolocation.GetGeolocation(modelgeolocation).subscribe(data => {
      if (data.data != null) {
        this.BindGelocation(modelgeolocation, data.data);
      }
    });
  }

  BindGelocation(mdgeolocation: FreightLane, data: any[]) {

    if (mdgeolocation.mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.FcountryList = [];
      this.TcountryList = [];

      this.duplicateList = [];
      for (let i = 0; i < data.length; i++) {

        this.duplicateList.push({

          id: data[i].code,
          itemName: data[i].name

        })
      }
      this.FcountryList = this.duplicateList.filter((n, i) => this.duplicateList.indexOf(n) === i);
      this.TcountryList = this.duplicateList.filter((n, i) => this.duplicateList.indexOf(n) === i);

    }
    else if (mdgeolocation.mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.FstateList = [];
      this.TstateList = [];
      for (let i = 0; i < data.length; i++) {

        this.FstateList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
        this.TstateList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
      }

    }

    else if (mdgeolocation.mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.FcityList = [];
      this.TcityList = [];
      for (let i = 0; i < data.length; i++) {

        this.FcityList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
        this.TcityList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
      }


    }
    else if (mdgeolocation.mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.FzipList = [];
      this.TzipList = [];
      for (let i = 0; i < data.length; i++) {

        this.FzipList.push({
          id: data[i].code,
          itemName: data[i].name,


        })
        this.TzipList.push({
          id: data[i].code,
          itemName: data[i].name,


        })
      }

    }
  }

  FreightLaneChange(data, mode, actualPoint = '') {
    let countryname = data.itemName;
    this.FreightLanemodel.name = countryname;
    this.FreightLanemodel.code = data.id;
    this.FreightLanemodel.mode = mode;

    if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
      this.countryCode = data.id;
      this.FreightLanemodel.code = this.countryCode;
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('StateData').setValue(null);
      //this.geoform.get('CityData').setValue(null);
      //this.addressModel.CountryCode = data.code;
      //this.addressModel.CountryName = data.countryname;
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('CityData').setValue(null);
      //this.geoform.get('StateData').setValue(null);
      this.FreightLanemodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
      this.stateCode = data.id;
      this.FreightLanemodel.code = this.stateCode;
      //this.geoform.get('CountryCode').setValue(data.id);
    }

    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
      this.cityCode = data.id;
      this.FreightLanemodel.code = this.cityCode;
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('CityData').setValue(null);

      //this.geoform.get('StateCode').setValue(data.id);
    }
    else if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipCode = data.id;
      this.FreightLanemodel.code = this.zipCode;
      this.FreightLanemodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;


    }

    if (actualPoint == 'COUNTRY' && data.id == "COUNTRYCODE") {
      //this.geoform.get('CountryCode').enable();
      //this.geoform.get('CountryCode').patchValue('');
    }

    else if (actualPoint == 'STATE' && data.id == "STATECODE") {
      //this.geoform.get('StateCode').enable();
      //this.geoform.get('StateCode').patchValue('');
    }
    else if (actualPoint == 'CITY') {

    }

    this.GetGeolocation(this.FreightLanemodel);
  }
  ToFreightLaneChange(data, mode, actualPoint = '') {
    let countryname = data.itemName;
    this.FreightLanemodel.name = countryname;
    this.FreightLanemodel.code = data.id;
    this.FreightLanemodel.mode = mode;

    if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
      this.countryCode = data.id;
      this.FreightLanemodel.code = this.countryCode;
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('StateData').setValue(null);
      //this.geoform.get('CityData').setValue(null);
      //this.addressModel.CountryCode = data.code;
      //this.addressModel.CountryName = data.countryname;
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('CityData').setValue(null);
      //this.geoform.get('StateData').setValue(null);
      this.FreightLanemodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
      this.stateCode = data.id;
      this.FreightLanemodel.code = this.stateCode;
      //this.geoform.get('CountryCode').setValue(data.id);
    }

    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
      this.cityCode = data.id;
      this.FreightLanemodel.code = this.cityCode;
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('CityData').setValue(null);

      //this.geoform.get('StateCode').setValue(data.id);
    }
    else if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipCode = data.id;
      this.FreightLanemodel.code = this.zipCode;
      this.FreightLanemodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;


    }

    if (actualPoint == 'COUNTRY' && data.id == "COUNTRYCODE") {
      //this.geoform.get('CountryCode').enable();
      //this.geoform.get('CountryCode').patchValue('');
    }

    else if (actualPoint == 'STATE' && data.id == "STATECODE") {
      //this.geoform.get('StateCode').enable();
      //this.geoform.get('StateCode').patchValue('');
    }
    else if (actualPoint == 'CITY') {

    }

    this.GetGeolocation(this.FreightLanemodel);
  }

  getContratTypeList() {
    this.contractService.getContractTypeListNew(this.authenticationService.currentUserValue.ClientId)
      .subscribe(result => {
        if (result.data != undefined) {
          this.contractTypeListData = result.data;
        }
      })
  }

  getContractBusinessPartner() {
    this.contractService.getContractBusinessPartner(this.authenticationService.currentUserValue.ClientId)
      .subscribe(result => {
        if (result.data != undefined) {
          this.contractBusinessPartnerData = result.data;
        }
      })
  }
  getContractCustomer() {
    this.contractService.getCustomerList(this.authenticationService.currentUserValue.ClientId, 'Customer')
      .subscribe(result => {
        if (result.data != undefined) {
          this.customerListData = result.data.map(item => ({ ...item, id: item.billingEntityId }));
        }
      })
  }

  getCustomerShipLocation() {
    this.contractService.GetBillingEntity('Customer', this.authenticationService.currentUserValue.ClientId)
      .subscribe(result => {
        this.customerListData = result;
        this.customerListData = result;
        this.settingsB = {
          singleSelection: false,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          searchBy: ['itemName'],
          badgeShowLimit: 1
        };
      });
  }

  getCustomerBillingEntity() {
    this.businessService.getCustomerBusinessPartnerBillingEntity(this.authenticationService.currentUserValue.ClientId, 'Customer')
      .subscribe(result => {
        if (result.data != undefined) {
          this.customerBillingEntityData = result.data.map(item => ({ ...item, id: item.billingEntityId }));
        }
      })
  }

  getBusinessBillingEntity() {
    this.businessService.getCustomerBusinessPartnerBillingEntity(this.authenticationService.currentUserValue.ClientId, 'BP')
      .subscribe(result => {
        if (result.data != undefined) {
          this.businessBillingEntityData = result.data.map(item => ({ ...item, id: item.billingEntityId }));
        }
      })
  }

  getSalesmanagerList() {
    this.businessService.getSalesmanagerList()
      .subscribe(result => {
      if (result.Data != undefined) {
        this.salesManagerData = result.Data.map(item => ({ ...item, id: item.Id}));;
      }
    })
  }


  getBusinessPartnerType() {
    this.businessService.getLocationFunctionListNew(this.authenticationService.currentUserValue.ClientId)
      .subscribe(result => {
        if (result.data != undefined) {
          this.businessPartnerTypeData = result.data.filter(unit => !(unit.id === 1 || unit.id === 16));
        }
      })
  }

  


  getBusinessPartnerGetBillingEntityCarrier() {
    this.businessService.getBillingEntityCarrier(this.authenticationService.currentUserValue.ClientId)
      .subscribe(result => {
        if (result.data != undefined) {
          this.billingEntityCarrierData = result.data.map(item => ({ ...item, id: item.billingEntityId }));
        }
      })
  }


  businessPartnerSelectionHandler() {
    const ids = this.businessPartnerTypeDataModel.map(item => item.id).join(',');
    this.billEntityData$ = this.businessService.getBillingEntityListNew(this.authenticationService.currentUserValue.ClientId, ids).pipe(map(res => res.data.map(item => ({ ...item, id: item.billingEntityId }))));
  }



  getChargeCategoryList() {
    this.chargeService.getChargeCategoryList()
      .subscribe(result => {
        if (result.data != undefined) {
          this.chargeCategoryData = result.data;
        }
      });
  }




  getShipToType() {
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);//this.orderManagement.ClientId;
    this.ShipToTypeList = [];
    this.orderservice.ShipToTypeAllData(this.commonOrderModel)
      .subscribe(result => {
        var datas = result.data;
        datas.map(item => {
          return {
            name: item.name,
            id: Number(item.id)
          };
        }).forEach(x => this.ShipToTypeList.push(x));
      });
  }

  getShipFromType() {
    this.ShipFromTypeList = [];
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);
    this.orderservice.ShipFromTypeAllData(this.commonOrderModel)
      .subscribe(data => {
        var datas = data.data;
        datas.map(item => {
          return {
            name: item.name,
            id: Number(item.id)
          };
        }).forEach(value => this.ShipFromTypeList.push(value));
      });
  }

  generateExportReport() {

    switch (this.DocumentSectionName) {
      case 'OrderManagementExportReport':
        this.GenerateOrderExcelReport();
        break;
      /*case 'MaterialExport':
        this.exportMaterialReport();
        break;*/
    }

  }


  GenerateOrderExcelReport() {

    var ordertypes: string = '';
    var orderFromLocationType: string = '';
    var orderToLocationType: string = '';

    if (this.OrderTypeData.length == this.OrderTypeDataModel.length) {
      ordertypes = '-1';
    }
    else {
      this.OrderTypeDataModel.forEach((value, index) => {
        if (index == this.OrderTypeDataModel.length - 1) {
          ordertypes = ordertypes + value.id;
        }
        else {
          ordertypes = ordertypes + value.id + ',';
        }
      });
    }

    if (this.ShipFromTypeList.length == this.ShipFromTypeListModel.length) {
      orderFromLocationType = '-1';
    }
    else {
      this.ShipFromTypeListModel.forEach((value, index) => {

        if (index == this.ShipFromTypeListModel.length - 1) {
          orderFromLocationType = orderFromLocationType + value.id;
        } else { orderFromLocationType = orderFromLocationType + value.id + ','; }
      });
    }

    if (this.ShipToTypeList.length == this.ShipToTypeListModel.length) {
      orderToLocationType = '-1';
    }
    else {
      this.ShipToTypeListModel.forEach((value, index) => {

        if (index == this.ShipToTypeListModel.length - 1) {
          orderToLocationType = orderToLocationType + value.id;
        } else { orderToLocationType = orderToLocationType + value.id + ','; }
      });
    }

    var requestedOrderFilter = {
      OrderTypeID: ordertypes,
      OrderNumbers: this.OrderNumbers,
      OrderFromLocationFunctionID: orderFromLocationType,
      OrderToLocationFunctionID: orderToLocationType,

    };




    var filterData = JSON.stringify(requestedOrderFilter);

    this.dataexportservice.GenerateExportReport(filterData, this.DocumentSectionName).subscribe((result) => {

      if (result.data != undefined && result.data.length > 0) {
        this.toaster.success("Documnet added successfully.");
        this.DocumentList.push(result.data);
      }
      else {
        this.toaster.error("something wrong please wait..");
      }

    });



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

}
export interface PeriodicElement {
  selectRow: string;
  Datesubmit: string;
  User: string;
  Status: string;
  download: string;
  delete: string;

}

const ELEMENT_DATA: PeriodicElement[] = [

  { selectRow: '', Datesubmit: '', User: '', Status: '', download: '', delete: '' },

];
