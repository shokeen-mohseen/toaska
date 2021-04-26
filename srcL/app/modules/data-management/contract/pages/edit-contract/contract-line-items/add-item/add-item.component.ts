
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { Contract, LineItem, ContractDetails, ContractLineItemDetails } from '@app/core/models/contract.model';
import { AuthService } from '@app/core';
import { ContractService } from '@app/core/services/contract.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ViewItemComponent } from '../view-item/view-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { ContractCommonDataService } from '../../../../../../../core/services/contract-common-data.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
  providers: [DatePipe, ViewItemComponent]
})
export class AddItemComponent implements OnInit {
  object: Contract = new Contract();
  selectRow: any;
  Commodity: any;
  RateType: any;
  Inactive: boolean;
  Rate: any;
  UOM: any;
  Quantity_per_UOM: any;
  Sales_Tax_Price: any;
  MethodType: any;
  ShowOnBOL: any;
  AutoAdded: any;
  AddPallet: any;
  PriceIncreaseMethod: any;
  EffectiveStart: any;
  EffectiveEnd: any;
  Add_New: any;
  Delete: any;
  ELEMENT_DATA1: ContractLineItemDetails[] = [];
  ChargeData = [];
  public countId: number;
  MaterialDescription = [];
  MaterialData = [];
  settingsMaterial = {};
  selectedMaterial = [];
  ChargeDescription = [];
  settingsCharge = {};
  selectedCharge = [];

  commodityData = [];
  priceMethodData = [];
  priceIncreaseMethodData = [];
  salesTaxClass = [];
  UomList = [];
  LineItemViewModel: LineItem[];
  gridTemp: LineItem[]=[];
  Data = [];
  itemListA = [];
  settingsA = {};
  selectedItemsA = [];
  count = 3;
  ContractDetailData = [];
  RateTypeList = [];
  RateTypeListArray = [];
  RateTypeLists = [];
  ContractTypeId: number;
  // @Input() public savedData: Array<any> = [];
  @Input() viewRef: ViewItemComponent;
  @Input() editRef: EditItemComponent;

 
  @ViewChild(MatTable, { static: false }) table;// initialize
  /*onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }*/
  public dateFormat: String = "MM-dd-yyyy";
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date("12/11/2017 1:00 AM");
  constructor(private toastrService: ToastrService, private authService: AuthService, private contractService: ContractService, private datepipe: DatePipe, private contractcommonservicedata: ContractCommonDataService) {
    this.countId = 0;
  }
  ngOnInit(): void {
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.Inactive = this.contractService.Permission == false ? true : false;
    //this.FillData();
    this.selectRow = 'selectRow';
    this.Commodity = 'Commodity';
    this.RateType = 'RateType';
    this.Rate = 'Rate';
    this.UOM = 'UOM';

    this.Quantity_per_UOM = 'Quantity_per_UOM';
    this.Sales_Tax_Price = 'Sales_Tax_Price';
    this.MethodType = 'MethodType';
    this.ShowOnBOL = 'ShowOnBOL';
    this.AutoAdded = 'AutoAdded';
    this.AddPallet = 'AddPallet';
    this.PriceIncreaseMethod = 'PriceIncreaseMethod';
    this.EffectiveStart = 'EffectiveStart';
    this.EffectiveEnd = 'EffectiveEnd';
    this.Add_New = 'Add_New';
    this.Delete = 'Delete';

    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      searchBy: ['itemName'],
      badgeShowLimit: 1
    };
    // searchable dropdown end
  }//init() end
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) { }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }

  displayedColumns = ['Material', 'Charge', 'Rate', 'RateType', 'UOM', 'Quantity_per_UOM', 'Commodity', 'Sales_Tax_Price', 'MethodType',
    'ShowOnBOL', 'AutoAdded', 'AddPallet', 'PriceIncreaseMethod', 'EffectiveStart', 'EffectiveEnd', 'Add_New', 'Delete'];

  displayedColumns1 = ['material', 'charge', 'rate', 'rateType', 'uom', 'quantity_per_UOM', 'commodity', 'sales_Tax_Price', 'methodType',
    'showOnBOL', 'autoAdded', 'addPallet', 'priceIncreaseMethod', 'effectiveStartStr', 'effectiveEndStr'];

  // for grid header
  displayedColumnsReplace = ['key_Material', 'key_Charge',
    'key_Rate', 'key_RateType', 'key_UOM', 'key_Quantityuom', 'key_Commodity',
    'key_SalesTax', 'key_Pricetype',
    'key_ShowOnBOL', 'key_AutoAdded', 'key_Addpalet', 'key_Priceinc',
    'key_EffectiveStart', 'key_EffectiveEnd', 'key_addnew', 'key_Delete'];

  displayedColumnsReplace1 = ['key_Material', 'key_Charge',
    'key_Rate', 'key_RateType', 'key_UOM', 'key_Quantityuom', 'key_Commodity',
    'key_SalesTax', 'key_Pricetype',
    'key_ShowOnBOL', 'key_AutoAdded', 'key_Addpalet', 'key_Priceinc',
    'key_EffectiveStart', 'key_EffectiveEnd'];


  // for adding row
  addRow(modal: LineItem, index: number) {

    var data: LineItem = Object.assign({}, modal);
    data.Id = 0;
    //data.EffectiveStart = null;
    //data.EffectiveEnd = null;
    this.gridTemp.splice((index + 1), 0, data);


    this.RateTypeListArray.splice((index + 1), 0, JSON.parse(JSON.stringify(this.RateTypeListArray[index]))) ;
    this.dataSource = new MatTableDataSource(this.LineItemViewModel);
    this.dataSource.data = this.gridTemp;
    this.table.renderRows();
  }
  //RemoveRow(modal: LineItem) {
  //  this.gridTemp.splice(this.gridTemp.findIndex(item => item.id === modal.Id), 1)
  //  this.dataSource = new MatTableDataSource(this.LineItemViewModel);
  //  this.dataSource.data = this.gridTemp;
  //  this.toastrService.info("Line item removed from the list.");
  //}
  RemoveRow(modal: LineItem) {
   
    var index = this.gridTemp.findIndex(item => item.Id === modal.Id && item.ChargeId == modal.ChargeId);
    this.gridTemp.splice(this.gridTemp.findIndex(item => item.Id === modal.Id && item.ChargeId == modal.ChargeId), 1);
    this.RateTypeListArray.splice((index), 1);
    this.dataSource = new MatTableDataSource<LineItem>(this.gridTemp);
  //  this.gridTemp = [...this.gridTemp];
    this.dataSource.data = this.gridTemp;
    //this.dataSource.connect().next(this.gridTemp);
   // this.dataSource._updateChangeSubscription();
    this.dataSource.connect().next(this.gridTemp);
    this.paginator._changePageSize(this.paginator.pageSize);
    this.toastrService.info("Line item removed from the list.");

   // this.dataSource.paginator = this.paginator;
    //this.viewRef.FillData();

    this.table.renderRows();
  }

  dataSource = new MatTableDataSource<LineItem>(this.LineItemViewModel);
  dataSource1 = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA1);
  selection = new SelectionModel<LineItem>(true, []);
  selection1 = new SelectionModel<LineItem>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  async ngAfterViewInit() {
    await this.getMaterialDescription();
    //this.getChargeDescription();
    await this.getCommodityList();
    await this.getPriceMethodTypeList();
    await this.getPriceIncreaseMethodTypeList();
    await this.getSalesTaxList();
    await this.getUomList();
    await this.getChargeComputationMethod();
    //if (this.contractService.ID != null) {
    //  await this.FillData();
    //}
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
    if (this.contractService.ContractTypeId != null) {
      this.chargeBind();
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource1.filter = filterValue;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  isAllSelected1() {
    const numSelected1 = this.selection1.selected.length;
    const numRows1 = this.dataSource1.data.length;
    return numSelected1 === numRows1;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  //masterToggle1() {
  //   this.isAllSelected1() ?
  //     this.selection1.clear() :
  //     this.dataSource1.data.forEach(row => this.selection1.select(row));
  //}


  async getMaterialDescription() {
    this.contractService.getMaterialDescription(this.object)
      .subscribe(async res => {
        if (res.message == "Success") {
          var material = res.data.sort(this.sortOn("description"));
          this.MaterialData = material;
          this.MaterialDescription = this.MaterialData.map(r => ({ id: r.id, itemName: r.description }));
          this.settingsMaterial = {
            singleSelection: false,
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            searchBy: ['itemName'],
            badgeShowLimit: 1
          };
        }

      });
  }

  chargeBind() {
    this.ContractTypeId = this.contractService.ContractTypeId;
    if (this.ContractTypeId == 1 || this.ContractTypeId == 2) {
      this.object.filterOn = "warehousing";
    }
    else if (this.ContractTypeId == 4) {
      this.object.filterOn = "revenue export";
    }
    else {
      this.object.filterOn = "revenue domestic";
    }

    this.contractService.getChargeDescription(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          var data = res.data.sort(this.sortOn("description"));
          this.ChargeData = res.data;
          this.ChargeDescription = data.map(r => ({ id: r.id, itemName: r.description }));
          this.settingsCharge = {
            singleSelection: false,
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            searchBy: ['itemName'],
            badgeShowLimit: 1
          };
        }
      });

  }
  onChargeBind() {
    if (this.ContractTypeId == null || this.ContractTypeId == 0) {
      this.chargeBind();
    }

  }

  async getCommodityList() {
    this.contractService.getCommodityList(this.object)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.commodityData = res.data;
        }
      });
  }

  async getPriceMethodTypeList() {
    this.contractService.getPriceMethodTypeList(this.object)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.priceMethodData = res.data;
        }
      });
  }

  async getPriceIncreaseMethodTypeList() {
    this.contractService.getPriceIncreaseMethodTypeList(this.object)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.priceIncreaseMethodData = res.data;
        }
      });
  }
  async getSalesTaxList() {
    this.contractService.getSalesTaxList(this.object)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.salesTaxClass = res.data;
        }
      });
  }
  async getUomList() {
    this.contractService.getUomList(this.object)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.UomList = res.data;
        }
      });
  }
  DateFormat(datetime) {
    var date = new Date(datetime);
    let formateddate = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm a');
    return formateddate;
  }
  async getChargeComputationMethod() {
    this.contractService.getChargeComputationMethod()
      .subscribe(async res => {
        if (res.message == "Success") {
          this.RateTypeList = res.data;
          this.RateTypeLists = res.data;
        }
      });
  }

  async getDefaultCommodity(): Promise<void> {
    var that = this;
    await this.contractService.getCommentsLocation(this.contractService.LocationID)
      .toPromise().then(result => {
        if (result.message = "Success") {
          var res = result.data;
          that.gridTemp.forEach(function (v) {
            v.Commodity = res.defaultCommodityID;
          });
        }
      });
  }

  async getDefaultCommodityByMaterial(): Promise<void> {
    var that = this;
    that.gridTemp.forEach(function (v) {
      var commodityid = this.MaterialData.filter(r => (r.id == v.MaterialId));
      v.Commodity = commodityid;
    });
  }

  async PopulateData() {
    var that = this;
    var TemgridTemp = [];
    that.gridTemp = [];
    if (this.selectedMaterial.length > 0) {
      this.selectedMaterial.map(m => {
        var num = 0;
        this.selectedCharge.map(x => {
          let models = new LineItem();
          models.Id = this.countId + 1;
          models.Material = m.itemName;
          models.MaterialId = Number(m.id);
          models.Charge = this.selectedCharge.map(({ itemName }) => itemName)[num];
          models.ChargeId = Number(this.selectedCharge.map(({ id }) => id)[num]);
          models.ContractTypeId = this.contractService.ContractTypeId;
          models.ParentId = this.contractService.ID;
          models.Quantity_per_UOM = "1";
          models.UOM = "220";
          models.Commodity = "";
          models.IsDisabledAddPallet = (Number(this.selectedCharge.map(({ id }) => id)[num]) == 1 || Number(this.selectedCharge.map(({ id }) => id)[num]) == 40) ? false : true;
          models.RateType = "";//String(this.setRateType(Number(this.selectedCharge.map(({ id }) => id)[num])));
          models.PriceIncreaseMethod = "0";
          models.AutoAdded = false;
          models.AddPallet = false;
          models.ShowOnBOL = false;
          if (this.contractcommonservicedata.ContractStartDate != undefined) {
            models.EffectiveStart = this.contractcommonservicedata.ContractStartDate;
          }

          if (this.contractcommonservicedata.ContractEndDate != undefined) {
            models.EffectiveEnd = this.contractcommonservicedata.ContractEndDate;
          }


          TemgridTemp.push(models);
          num++;
          this.countId = this.countId + 1;
        });
      });
    }
    else {
      this.selectedCharge.map(x => {
        let models = new LineItem();
        models.Id = this.countId + 1;
        models.Charge = x.itemName;
        models.ChargeId = Number(x.id);
        models.ContractTypeId = this.contractService.ContractTypeId;
        models.ParentId = this.contractService.ID;
        models.Quantity_per_UOM = "1";
        models.UOM = "220";
        models.Commodity = "";
        models.IsDisabledAddPallet = (Number(x.id) == 1 || Number(x.id) == 40) ? false : true;
        models.RateType = "";//String(this.setRateType(Number(x.id)));
        models.PriceIncreaseMethod = "0";
        models.UOM = "0";
        models.AutoAdded = false;
        models.AddPallet = false;
        models.ShowOnBOL = false;
        if (this.contractcommonservicedata.ContractStartDate != undefined) {
          models.EffectiveStart = this.contractcommonservicedata.ContractStartDate;
        }

        if (this.contractcommonservicedata.ContractEndDate != undefined) {
          models.EffectiveEnd = this.contractcommonservicedata.ContractEndDate;
        }

        TemgridTemp.push(models);
        this.countId = this.countId + 1;
      });
    }

    this.selectedMaterial.length = 0;
    this.selectedCharge.length = 0;


    TemgridTemp.forEach(function (v) {
      that.gridTemp.push(v);
    });
    
    if (this.contractService.ContractTypeId == 1 || this.contractService.ContractTypeId == 2) {
      if (this.selectedMaterial.length > 0) {
        await this.getDefaultCommodityByMaterial();
      }
      else {
        await this.getDefaultCommodity();
      }
    }
    else {
      await this.getDefaultCommodity();
    }
   
    await this.bindRateType();
    that.gridTemp.forEach(function (v) {
      v.RateType = that.ChargeData.filter
        (f => (v.ChargeId === f.id))
        .map(function (a) { return a["chargeComputationMethodId"]; })[0];
    });
    this.dataSource = new MatTableDataSource(this.LineItemViewModel);   
    this.dataSource.data = that.gridTemp;
  }

  FillDataByLocation(ContractId: number) {

    var that = this;
    that.gridTemp = [];
    if (ContractId == 0) {
      this.dataSource = new MatTableDataSource(this.LineItemViewModel);
      this.dataSource.data = that.gridTemp;
      return false;
    }
    var ClientId = this.authService.currentUserValue.ClientId;
    var ContractTypeId = this.contractService.ContractTypeId;
    var parentContractId = this.contractService.ID;
    var ParentId = ContractId;
    this.contractService.getContractDetailsByIds(ClientId, ContractTypeId, ParentId)
      .subscribe(async res => {
        if (res.message == "Success") {
          var Data = [];
          Data = res.data;

          Data.forEach(function (x) {
            let models = new LineItem();
            models.Id = x.id;
            models.ChargeId = x.chargeId;
            
            models.Rate = x.rateValue;
            models.Material = that.MaterialDescription.filter(m => (x.materialId == m.id)).map(({ itemName }) => itemName)[0];
            models.MaterialId = x.materialId;
            models.RateType = x.chargeComputationMethodId;
            models.UOM = x.uomid;
            models.Quantity_per_UOM = x.quantityPerUom;
            models.Commodity = x.commodityId;
            models.PriceIncreaseMethod = x.priceIncreaseMethodTypeId;
            models.Sales_Tax_Price = x.salesTaxClassId;
            models.ShowOnBOL = x.showOnBol;
            models.AutoAdded = x.isRequired;
            models.AddPallet = x.addPalletBags;
            models.MethodType = x.priceMethodTypeId;
            models.EffectiveStart = x.termStartDate;
            models.EffectiveEnd = x.termEndDate;
            models.ContractTypeId = Number(ContractTypeId);
            models.Charge = that.ChargeDescription.filter(c => (x.chargeId == c.id)).map(({ itemName }) => itemName)[0];
            models.ParentId = parentContractId;
            models.Add_New = '';
            models.Delete = '';
            models.IsDeleted = false;
            models.IsDisabledAddPallet = (Number(x.chargeId) == 1 || Number(x.chargeId) == 40) ? false : true
            that.gridTemp.push(models);
          });
          await this.bindRateType();
          this.dataSource = new MatTableDataSource(this.LineItemViewModel);
          this.dataSource.data = that.gridTemp;
        }
      });
  }

  async bindRateType() {
    var that = this;
    var chargeIds = [];
    that.gridTemp.sort((a, b) => (a.ChargeId < b.ChargeId ? -1 : 1));
    chargeIds = that.gridTemp.map(({ ChargeId }) => ChargeId);
    //var data = that.ChargeData.filter(f => chargeIds.includes(f.id)).map(function (a) { return a["chargeComputationMethodId"]; });

   // var allChargesData = that.ChargeData.filter(f => chargeIds.includes(f.id));
   // allChargesData.sort((a, b) => (a.id < b.id ? -1 : 1));
    //var indexs = 0;
    that.gridTemp.forEach((item, index) => {    
      var allChargesData = that.ChargeData.filter(f => (item.ChargeId == f.id))
        .map(function (a) { return a["chargeComputationMappingId"]; })[0];
      //allChargesData.forEach((value) => {
        var data = [];
      var chargeComputationmethods = allChargesData.split(',');

        chargeComputationmethods.forEach((val, inx) => {
          if (data.indexOf(Number(val)) == -1) {
            data.push(Number(val));
          }
        });
        //this.RateTypeList = this.RateTypeLists.filter(r => data.includes(r.id));
      this.RateTypeListArray[index] = this.RateTypeLists.filter(r => data.includes(r.id));       
     // });
      //indexs++;
    });   

    //this.RateTypeList = this.RateTypeLists.filter(r => data.includes(r.id));

  }


  setRateType(chargeId: any) {
    var that = this;
    var charge = Number(chargeId);

    var data = [];
    var dataArray = [];


    
     dataArray = that.ChargeData.filter
      (f => (charge === f.id))
    .map(function (a)
      { return a["chargeComputationMethodId"]; });



    //.map
      //(({ chargeComputationMappingId }) => chargeComputationMappingId);

    //dataArray = String(data1[0]).split(',');

      //.map(function (a)
      //{ return a["chargeComputationMethodId"]; });

    if (dataArray != undefined && dataArray.length > 0) {
      dataArray.forEach((value, index) => {
        if (value != null && value != undefined && value > 0) { data.push(value);}
      });
    }

    //if (data.length == 0) {
    //  var allChargesData = that.ChargeData.filter(f => charge.includes(f.id));
    //  allChargesData.forEach((value, index) => {
    //    if (value.chargeComputationMappingId != null && value.chargeComputationMappingId.length > 0) {
    //      var chargeComputationmethods = value.chargeComputationMappingId.split(',');

    //      chargeComputationmethods.forEach((val, inx) => {
    //        if (data.indexOf(Number(val)) == -1) {
    //          data.push(Number(val));
    //        }
    //      });
    //    }
    //  });
    //}

    return data[0];
  }

  AddData(form: NgForm) {
    var length = this.gridTemp.length;
    this.Data = [];
    if (length == 0) {
      this.toastrService.warning("Please add a charge description.");
      return false;
    }
    for (var i = 0; i < length; i++) {
      //let models = new ContractDetails();
      let models = new ContractLineItemDetails();
      //var datafrid = this.gridTemp[i];
      var contractTId = Number(this.gridTemp[i].ContractTypeId);
      models.id = 0;
      models.chargeID = Number(this.gridTemp[i].ChargeId);
      models.charge = this.gridTemp[i].Charge;
      models.materialID = isNaN(Number(this.gridTemp[i].MaterialId)) ? 0 : Number(this.gridTemp[i].MaterialId);
      models.material = this.gridTemp[i].Material;
      //models.ContractTypeId = contractTId;
      //if (contractTId == 3 || contractTId == 4 || contractTId == 5) {
      //  models.CustomerContractId = Number(this.gridTemp[i].ParentId);
      //}
      //else {
      //  models.BusinessPartnerContractId = Number(this.gridTemp[i].ParentId);
      //}

      models.priceMethodTypeID = isNaN(Number(this.gridTemp[i].MethodType)) ? 0 : Number(this.gridTemp[i].MethodType);


      if (models.priceMethodTypeID > 0) {
        models.methodType = this.priceMethodData.find(x => Number(x.id) == Number(models.priceMethodTypeID))?.description;
      }
      models.uomid = isNaN(Number(this.gridTemp[i].UOM)) ? 0 : Number(this.gridTemp[i].UOM);
      if (models.uomid > 0) {
        models.uom = this.UomList.find(x => Number(x.id) == Number(models.uomid))?.description;
      }

      models.commodityID = isNaN(Number(this.gridTemp[i].Commodity)) ? 0 : Number(this.gridTemp[i].Commodity);

      if (models.commodityID > 0) {
        models.commodity = this.commodityData.find(x => Number(x.id) == Number(models.commodityID))?.name;
      }

      //models.QuantityPerUom = Number(form.controls["txtQuantityperUOM" + i].value);
      models.quantity_per_UOM = isNaN(Number(this.gridTemp[i].Quantity_per_UOM)) ? 0 : Number(this.gridTemp[i].Quantity_per_UOM);

      //models.DetailDescription = "";
      models.effectiveStart = new Date(this.gridTemp[i].EffectiveStart);
      models.effectiveStartStr = (((models.effectiveStart.getMonth() > 8) ? (models.effectiveStart.getMonth() + 1) : ('0' + (models.effectiveStart.getMonth() + 1))) + '/' + ((models.effectiveStart.getDate() > 9) ? models.effectiveStart.getDate() : ('0' + models.effectiveStart.getDate())) + '/' + models.effectiveStart.getFullYear());
      models.effectiveEnd = new Date(this.gridTemp[i].EffectiveEnd);
      models.effectiveEndStr = (((models.effectiveEnd.getMonth() > 8) ? (models.effectiveEnd.getMonth() + 1) : ('0' + (models.effectiveEnd.getMonth() + 1))) + '/' + ((models.effectiveEnd.getDate() > 9) ? models.effectiveEnd.getDate() : ('0' + models.effectiveEnd.getDate())) + '/' + models.effectiveEnd.getFullYear());
      models.rate = Number(this.gridTemp[i].Rate);
      models.rateTypeID = Number(this.gridTemp[i].RateType);

      if (models.rateTypeID > 0) {
        models.rateType = this.RateTypeList.find(x => Number(x.id) == Number(models.rateTypeID))?.description;
      }

      models.showOnBOL = Boolean(this.gridTemp[i].ShowOnBOL) == true ? 1 : 0;
      models.salesTaxClassID = isNaN(Number(this.gridTemp[i].Sales_Tax_Price)) ? 0 : Number(this.gridTemp[i].Sales_Tax_Price);

      if (models.salesTaxClassID > 0) {
        models.sales_Tax_Price = this.salesTaxClass.find(x => Number(x.id) == Number(models.salesTaxClassID))?.name;
      }

      models.priceIncreaseMethodTypeID = isNaN(Number(this.gridTemp[i].PriceIncreaseMethod)) ? 0 : Number(this.gridTemp[i].PriceIncreaseMethod);

      if (models.priceIncreaseMethodTypeID > 0) {
        models.priceIncreaseMethod = this.priceIncreaseMethodData.find(x => Number(x.id) == Number(models.priceIncreaseMethodTypeID))?.description;
      }


      models.addPallet = Boolean(this.gridTemp[i].AddPallet) == true ? 1 : 0;
      models.autoAdded = Boolean(this.gridTemp[i].AutoAdded) == true ? 1 : 0;
      //models.IsDeleted = false;
      models.clientId = this.authService.currentUserValue.ClientId;
      //models.CreatedBy = this.authService.currentUserValue.LoginId;
      //models.CreateDateTimeBrowser = new Date(new Date().toISOString());
      //models.UpdateDateTimeBrowser = new Date(new Date().toISOString());
      this.Data.push(models);
    }
    var datevalidate = false;
    this.Data.forEach(function (x) {
      if (x.effectiveStart > x.effectiveEnd) {
        datevalidate = true;
      }
    });

    if (datevalidate) {
      this.toastrService.error('The effective end date should be greater than or equal to the effective start date.');
      return false;
    }


    var res = this.Data.reduce((acc, obj) => {
      var existItem = acc.find(item => ((item.chargeID == obj.chargeID) && (item.materialID == obj.materialID) && item.effectiveStartStr == obj.effectiveStartStr && item.effectiveEndStr == obj.effectiveEndStr));
      if (existItem) {
        return this.toastrService.error('WARNING: Duplicate items cannot be added with same effective start and end dates.');
      }
      acc.push(obj);
      return acc;
    }, []);

    if (res.length != undefined && !datevalidate) {
      this.Data.forEach((value, index) => {
        this.contractcommonservicedata.FinalContractData.lineItems.push(value);
      });
      this.gridTemp.splice(0, this.gridTemp.length);
      this.Data.splice(0, this.Data.length);
      this.dataSource = new MatTableDataSource();

      this.toastrService.info("New line item added to the list.");

      this.ELEMENT_DATA1 = this.contractcommonservicedata.FinalContractData.lineItems;
      this.dataSource1 = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA1);

      //this.viewRef.FillData();
      //this.editRef.FillData();

    }
  }



  async FillData() {
    if (this.contractcommonservicedata.FinalContractData != undefined && this.contractcommonservicedata.FinalContractData.lineItems != undefined && this.contractcommonservicedata.FinalContractData.lineItems.length > 0) {
      this.ELEMENT_DATA1 = this.contractcommonservicedata.FinalContractData.lineItems;
      this.dataSource1 = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA1);
      
      //this.editRef.FillData();
    }
    else {
      this.dataSource1 = new MatTableDataSource<ContractLineItemDetails>();

    }
    this.viewRef.FillData();
  }
  validNumber = new RegExp(/^\d*\.?\d*$/);
  numberOnly(event, index): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 45) {
      return false;
    }

    if (charCode == 45) {
      // if (this.gridTemp[index].Rate.indexOf('-') > -1)
      //   return false;
    }

    return true;

  }
  sortOn(property) {
    return function (a, b) {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  onEffectiveStart(value: any) {
    var result = this.dataSource.data;
    let LineItemList = [];
    result.map(f => {
      let LineItemSummary: LineItem = new LineItem();
      LineItemSummary = f;
      if (f.Id == value.Id) {
        LineItemSummary.EffectiveStart = value.EffectiveStart;

        if (!!LineItemSummary.EffectiveStart && !!LineItemSummary.EffectiveEnd) {
          if (LineItemSummary.EffectiveStart > LineItemSummary.EffectiveEnd) {
            this.toastrService.warning("End date should be greater than or equal to the Start Date.");
          }
        }
      }
      LineItemList.push(LineItemSummary);
    });
    this.dataSource = new MatTableDataSource<LineItem>(LineItemList);
  }

  onEffectiveEnd(value: any) {
    var result = this.dataSource.data;
    let LineItemList = [];
    result.map(f => {
      let LineItemSummary: LineItem = new LineItem();
      LineItemSummary = f;
      if (f.Id == value.Id) {
        LineItemSummary.EffectiveEnd = value.EffectiveEnd;

        if (!!LineItemSummary.EffectiveEnd && !!LineItemSummary.EffectiveStart) {
          if (LineItemSummary.EffectiveStart > LineItemSummary.EffectiveEnd) {
            this.toastrService.warning("End date should be greater than or equal to the Start Date.");
          }
        }
      }
      LineItemList.push(LineItemSummary);
    });
    this.dataSource = new MatTableDataSource<LineItem>(LineItemList);
  }


  clearAddItemContractLineItem() {
    this.LineItemViewModel = [];
    if (this.contractcommonservicedata.FinalContractData != undefined && this.contractcommonservicedata.FinalContractData.lineItems != undefined && this.contractcommonservicedata.FinalContractData.lineItems.length > 0) {
      this.contractcommonservicedata.FinalContractData.lineItems = [];
    }
    this.ELEMENT_DATA1 = [];
    this.dataSource1 = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA1);

    this.viewRef.clearContractLineItemViewGrid();
  }

}

export interface PeriodicElement {
  Material: string;
  Charge: string;
  Rate: string;
  RateType: string;
  UOM: string;
  Quantity_per_UOM: string;
  Commodity: string;
  Sales_Tax_Price: string;
  PriceIncreaseMethod: string;
  ShowOnBOL: string;
  AutoAdded: string;
  AddPallet: string;
  MethodType: string;
  EffectiveStart: string;
  EffectiveEnd: string;
  Add_New: string;
  Delete: string;
}
export interface PeriodicElement1 {
  ID: number;
  Material: string;
  Charge: string;
  Rate: string;
  RateType: string;
  UOM: string;
  Quantity_per_UOM: string;
  Commodity: string;
  Sales_Tax_Price: string;
  PriceIncreaseMethod: string;
  ShowOnBOL: string;
  AutoAdded: string;
  AddPallet: string;
  MethodType: string;
  EffectiveStart: string;
  EffectiveEnd: string;
}
