
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { Contract, LineItem, ContractDetails } from '@app/core/models/contract.model';
import { AuthService } from '@app/core';
import { ContractService } from '@app/core/services/contract.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ViewItemComponent } from '../view-item/view-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';

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
  ELEMENT_DATA1: PeriodicElement1[] = [];

  public countId: number;
  MaterialDescription= [];
  settingsMaterial = {};
  selectedMaterial = [];
  ChargeDescription= [];
  settingsCharge = {};
  selectedCharge = [];
  commodityData = [];
  priceMethodData = [];
  priceIncreaseMethodData = [];
  salesTaxClass = [];
  UomList = [];
  LineItemViewModel: LineItem[];
  gridTemp = [];
  Data = [];
  itemListA = [];
  settingsA = {};
  selectedItemsA = [];
  count = 3;
  ContractDetailData = [];
  RateTypeList = [];
  ContractTypeId: number;
 // @Input() public savedData: Array<any> = [];
  @Input() viewRef: ViewItemComponent;
  @Input() editRef: EditItemComponent;

  @Input() savedData2: any;
  

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
  public dateFormat: String = "MM-dd-yyyy";
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date("12/11/2017 1:00 AM");
  constructor(private toastrService: ToastrService, private authService: AuthService, private contractService: ContractService,  private datepipe: DatePipe) {
    this.countId = 0;
  }
  ngOnInit(): void { 
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.getMaterialDescription();
    //this.getChargeDescription();
    this.getCommodityList();
    this.getPriceMethodTypeList();
    this.getPriceIncreaseMethodTypeList();
    this.getSalesTaxList();
    this.getUomList();
    this.getChargeComputationMethod();
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
    // for searchable dropdown
    this.itemListA = [
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
      badgeShowLimit: 1
    };
    // searchable dropdown end
  }//init() end
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {}
  OnItemDeSelect(item: any) {}
  onSelectAll(items: any) {}
  onDeSelectAll(items: any) {}

  displayedColumns = ['selectRow', 'Material', 'Charge', 'Rate', 'RateType', 'UOM', 'Quantity_per_UOM', 'Commodity', 'Sales_Tax_Price', 'MethodType',
    'ShowOnBOL', 'AutoAdded', 'AddPallet', 'PriceIncreaseMethod', 'EffectiveStart', 'EffectiveEnd', 'Add_New','Delete'];

  displayedColumns1 = ['selectRow', 'Material', 'Charge', 'Rate', 'RateType', 'UOM', 'Quantity_per_UOM', 'Commodity', 'Sales_Tax_Price', 'MethodType',
    'ShowOnBOL', 'AutoAdded', 'AddPallet', 'PriceIncreaseMethod', 'EffectiveStart', 'EffectiveEnd'];

  // for grid header
  displayedColumnsReplace = ['selectRow', 'key_Material', 'key_Charge',
    'key_Rate', 'key_RateType', 'key_UOM', 'key_Quantityuom', 'key_Commodity',
    'key_SalesTax',    'key_Pricetype',
    'key_ShowOnBOL', 'key_AutoAdded', 'key_Addpalet', 'key_Priceinc',
    'key_EffectiveStart', 'key_EffectiveEnd', 'key_addnew', 'key_Delete'];

  displayedColumnsReplace1 = ['selectRow', 'key_Material', 'key_Charge',
    'key_Rate', 'key_RateType', 'key_UOM', 'key_Quantityuom', 'key_Commodity',
    'key_SalesTax', 'key_Pricetype',
    'key_ShowOnBOL', 'key_AutoAdded', 'key_Addpalet', 'key_Priceinc',
    'key_EffectiveStart', 'key_EffectiveEnd'];


  // for adding row
  addRow(modal: LineItem) {
    this.gridTemp.push(modal);
    this.dataSource = new MatTableDataSource(this.LineItemViewModel);
    this.dataSource.data = this.gridTemp;
  }
  RemoveRow(modal: LineItem) {
    this.gridTemp.splice(this.gridTemp.findIndex(item => item.id === modal.Id), 1)
    this.dataSource = new MatTableDataSource(this.LineItemViewModel);
    this.dataSource.data = this.gridTemp;
  }

  //addRow1() {
  //  ELEMENT_DATA1.push({
  //    Material: 'Material', Charge: 'Alternate Recovery Charge - Egg1', Rate: '', RateType: '', UOM: '', Quantity_per_UOM: '', Commodity: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: ''
  //  })
  //  this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
  //}

  dataSource = new MatTableDataSource<LineItem>(this.LineItemViewModel);
  dataSource1 = new MatTableDataSource<PeriodicElement1>(this.ELEMENT_DATA1);
  selection = new SelectionModel<LineItem>(true, []);
  selection1 = new SelectionModel<LineItem>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(EditItemComponent) EditItem: EditItemComponent;
  //@ViewChild(ViewItemComponent) ViewItem: ViewItemComponent;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
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
 

  getMaterialDescription() {
    this.contractService.getMaterialDescription(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          var data = res.data;
          this.MaterialDescription = data.map(r => ({ id: r.id, itemName: r.description }));
          this.settingsMaterial = {
            singleSelection: false,
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1
          };
        }
       
      });
  }

  onChargeBind() {
    this.ContractTypeId = this.contractService.ContractTypeId; 
    if (this.ContractTypeId == 4 || this.ContractTypeId == 5) {
      this.object.filterOn = "warehousing";
    }
    else {
      this.object.filterOn = "revenue";
    }
    
    this.contractService.getChargeDescription(this.object)
      .subscribe(res => {
         if (res.message == "Success") {
          var data = res.data;
          this.ChargeDescription = data.map(r => ({ id: r.id, itemName: r.description }));
          this.settingsCharge = {
            singleSelection: false,
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1
          };
        }
      });
  }

  getCommodityList() {
    this.contractService.getCommodityList(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          this.commodityData = res.data;
        }
      });
  }

  getPriceMethodTypeList() {
    this.contractService.getPriceMethodTypeList(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          this.priceMethodData = res.data;
        }
      });
  }

  getPriceIncreaseMethodTypeList() {
    this.contractService.getPriceIncreaseMethodTypeList(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          this.priceIncreaseMethodData = res.data;
        }
      });
  }
  getSalesTaxList() {
    this.contractService.getSalesTaxList(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          this.salesTaxClass = res.data;
        }
      });
  }
  getUomList() {
    this.contractService.getUomList(this.object)
      .subscribe(res => {
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
  getChargeComputationMethod() {
    this.contractService.getChargeComputationMethod()
      .subscribe(res => {
        if (res.message == "Success") {
          this.RateTypeList = res.data;
        }
      });
  }


  PopulateData() {
    this.savedData2 = this.contractService.savedData;
    var that = this;
    var TemgridTemp = [];
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
          models.ContractTypeId = Number(this.savedData2.contractTypeId);
          models.ParentId = Number(this.savedData2.id);
          models.Quantity_per_UOM = "1";
          models.UOM = "70";
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
        models.ContractTypeId = Number(this.savedData2.contractTypeId);
        models.ParentId = Number(this.savedData2.id);
        TemgridTemp.push(models);        
        this.countId = this.countId + 1;
      });
    }
    this.selectedMaterial.length = 0;
    this.selectedCharge.length = 0;


    TemgridTemp.forEach(function (v) {
      that.gridTemp.push(v);
    });
    this.dataSource = new MatTableDataSource(this.LineItemViewModel);
    this.dataSource.data = that.gridTemp;  
  }

  AddData(form: NgForm) {

    var length = this.gridTemp.length;
    for (let i = 0; i < length; i++) {
      let models = new ContractDetails();
      //var datafrid = this.gridTemp[i];
      var contractTId = Number(this.gridTemp[i].ContractTypeId);
      models.ChargeId = Number(this.gridTemp[i].ChargeId);
      models.MaterialId = Number(this.gridTemp[i].MaterialId);
      models.ContractTypeId = contractTId;
      if (contractTId == 1 || contractTId == 2 || contractTId == 3) {
        models.CustomerContractId = Number(this.gridTemp[i].ParentId);
      }
      else {
        models.BusinessPartnerContractId = Number(this.gridTemp[i].ParentId);
      }

      models.PriceMethodTypeId = Number(form.controls["txtMethodType" + i].value);
      models.Uomid = Number(form.controls["txtUOM" + i].value);
      models.CommodityId = Number(form.controls["txtCommodity" + i].value);
      models.QuantityPerUom = Number(form.controls["txtQuantityperUOM" + i].value);
      models.DetailDescription = "";
      models.TermStartDate = new Date(form.controls["txtEffectiveStart" + i].value);
      models.TermEndDate = new Date(form.controls["txtEffectiveEnd" + i].value);
      models.RateValue = Number(form.controls["txtRate" + i].value);
      models.ChargeComputationMethodId = Number(form.controls["txtRateType" + i].value);
      models.ShowOnBol = Boolean(form.controls["txtShowOnBOL" + i].value)== true?1:0;
      models.SalesTaxClassId = Number(form.controls["txtSalesTaxPrice" + i].value);
      models.PriceIncreaseMethodTypeId = Number(form.controls["txtPriceIncreaseMethod" + i].value);
      models.AddPalletBags = Boolean(form.controls["txtAddPallet" + i].value)==true?1:0;
      models.ShippingInstructionsNotRequired = Boolean(form.controls["txtAutoAdded" + i].value)
      models.IsDeleted = false;
      models.ClientId = this.authService.currentUserValue.ClientId;
      models.CreatedBy = this.authService.currentUserValue.LoginId;
      models.CreateDateTimeBrowser = new Date(new Date().toISOString());
      models.UpdateDateTimeBrowser = new Date(new Date().toISOString());
      this.Data.push(models);      
    }
    this.contractService.SaveContractDetails(this.Data)
      .subscribe(res => {
        if (res.message == "Success") {
          this.toastrService.success("Line Item Saved");
          //this.ContractDetailData.push(res);
          this.Data.length = 0;
          this.dataSource = new MatTableDataSource(this.LineItemViewModel);
          this.dataSource.data = this.Data;
          this.FillData();
        }
      });
  }

  FillData() {
    var that = this;
    this.savedData2 = this.contractService.savedData;
    var ClientId = this.authService.currentUserValue.ClientId;
    var ContractTypeId = Number(that.savedData2.contractTypeId);
    var ParentId = Number(that.savedData2.id);
    this.contractService.getContractDetails(ClientId, ContractTypeId, ParentId)
      .subscribe(res => {
        if (res.message == "Success") {
          res.data.forEach((value, index) => {
            this.ELEMENT_DATA1.push({
              ID: value.id, Material: value.material,
              Charge: value.charge,
              Rate: value.rate,
              RateType: value.rateType,
              UOM: value.uom,
              Quantity_per_UOM: value.quantity_per_UOM,
              Commodity: value.commodity,
              Sales_Tax_Price: value.sales_Tax_Price,
              PriceIncreaseMethod: value.priceIncreaseMethod,
              ShowOnBOL: value.showOnBOL ==1 ? 'Yes' : 'No',
              AutoAdded: value.isRequired == 1 ? 'Yes' : 'No',
              AddPallet: value.addPallet == 1 ? 'Yes' : 'No',
              MethodType: value.methodType,
              EffectiveStart: this.DateFormat(value.effectiveStart),
              EffectiveEnd: this.DateFormat(value.effectiveEnd)
            })
          })

          this.dataSource1 = new MatTableDataSource<PeriodicElement1>();
          this.dataSource1.data = this.ELEMENT_DATA1;
          this.viewRef.FillData();
          this.editRef.FillData();
        }
      });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !=46) {
      return false;
    }
    return true;

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
