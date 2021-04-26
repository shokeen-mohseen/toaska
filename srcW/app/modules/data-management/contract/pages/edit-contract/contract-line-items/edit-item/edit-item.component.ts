import { Component, ViewChild, OnInit, Input } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '@app/core/services/contract.service';
import { AuthService } from '@app/core/services';
import { LineItem, Contract, ContractDetails } from '@app/core/models/contract.model';
import { FormGroup, FormArray, FormBuilder, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  selectRow: any;
  object: Contract = new Contract();
  //editlineitemform: FormGroup;
  savedData: any;
  editForm: NgForm;
  ContractTypeId: number;
  ParentId: number;
  Material: any;
  Charge: any;
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
  MaterialDescription = [];
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
  gridTemp = [];
  Data = [];
  itemListA = [];
  settingsA = {};
  selectedItemsA = [];
  count = 3;
  ContractDetailData = [];
  RateTypeList = [];

  ELEMENT_DATA: PeriodicElement[] = [];

  public dateFormat: String = "MM-dd-yyyy";
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date("12/11/2017 1:00 AM");

  ngOnInit() {
   // debugger;
    this.savedData = this.savedData2;
    this.selectRow = 'selectRow';
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.getMaterialDescription();
    this.getChargeDescription();
    this.getCommodityList();
    this.getPriceMethodTypeList();
    this.getPriceIncreaseMethodTypeList();
    this.getSalesTaxList();
    this.getUomList();
    this.getChargeComputationMethod();

    

    this.Material = 'Material';
    this.Charge = 'Charge';
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
    setTimeout(() => {
      if (this.savedData2 != null) {
        this.FillData();
      }
    }, 5000);
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

  displayedColumns = ['selectRow', 'Material', 'Charge', 'Commodity', 'RateType', 'Rate', 'UOM', 'Quantity_per_UOM', 'Sales_Tax_Price',
    'MethodType', 'ShowOnBOL', 'AutoAdded', 'AddPallet', 'PriceIncreaseMethod', 'EffectiveStart', 'EffectiveEnd', 'Add_New', 'Delete'];
 
  displayedColumnsReplace = ['selectRow', 'key_Material', 'key_Charge',
    'key_Commodity', 'key_RateType', 'key_Rate', 'key_UOM',
    'key_Quantityuom', 'key_SalesTax',
    'key_Pricetype', 'key_ShowOnBOL', 'key_AutoAdded', 'key_Addpalet',
    'key_Priceinc', 'key_EffectiveStart', 'key_EffectiveEnd',
    'key_addnew', 'key_Delete'];

  // for adding row
  addRow(modal: LineItem) {
    modal.Id = 0;
    this.ELEMENT_DATA.push(modal);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() savedData2: any;


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

  constructor(private fb: FormBuilder,private toastrService: ToastrService, private authService: AuthService, private contractService: ContractService) { }


  getMaterialDescription() {
    this.contractService.getMaterialDescription(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          this.MaterialDescription = res.data;
        }

      });
  }
  getChargeDescription() {
    this.contractService.getChargeDescription(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          this.ChargeDescription = res.data;
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
  
  getChargeComputationMethod() {
    this.contractService.getChargeComputationMethod()
      .subscribe(res => {
        if (res.message == "Success") {
          this.RateTypeList = res.data;
        }
      });
  }

  FillData() {
    this.savedData = this.contractService.savedData;
    var ClientId = this.authService.currentUserValue.ClientId;
    this.ContractTypeId = Number(this.savedData.contractTypeId);
    this.ParentId =  Number(this.savedData.id);
    this.contractService.getContractDetailsByIds(ClientId, this.ContractTypeId, this.ParentId)
      .subscribe(res => {
       // debugger;
        if (res.message == "Success") {
          this.ELEMENT_DATA = [];
          res.data.forEach((value, index) => {
            this.ELEMENT_DATA.push({
              Id: value.id,
              Material: value.materialId,
              Charge: value.chargeId,
              Rate: value.rateValue,
              RateType: value.chargeComputationMethodId,
              UOM: value.uomid,
              Quantity_per_UOM: value.quantityPerUom,
              Commodity: value.commodityId,
              Sales_Tax_Price: value.salesTaxClassId,
              PriceIncreaseMethod: value.priceIncreaseMethodTypeId,
              ShowOnBOL: value.showOnBol,
              AutoAdded: value.shippingInstructionsNotRequired,
              AddPallet: value.addPalletBags,
              MethodType: value.priceMethodTypeId,
              EffectiveStart: value.termStartDate,
              EffectiveEnd: value.termEndDate,
              Add_New:'',
              Delete:''
            })
          })
         // this.editlineitemform.setControl('albums', res.data);
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.data = this.ELEMENT_DATA;
          
        }
      });
  }
  
  AddData(form: NgForm) {
    var length = this.gridTemp.length;
    for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
      let models = new ContractDetails();
      //var datafrid = this.gridTemp[i];
      var contractTId = this.ContractTypeId;
      models.Id = this.ELEMENT_DATA[i].Id;
      models.ChargeId = Number(form.controls["txtCharge" + i].value);
      models.MaterialId = Number(form.controls["txtMaterial" + i].value);
      models.ContractTypeId = contractTId;
      if (contractTId == 1 || contractTId == 2 || contractTId == 3) {
        models.CustomerContractId = Number(this.ParentId);
      }
      else {
        models.BusinessPartnerContractId = Number(this.ParentId);
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
      models.ShowOnBol = Boolean(form.controls["txtShowOnBOL" + i].value) == true ? 1 : 0;
      models.SalesTaxClassId = Number(form.controls["txtSalesTaxPrice" + i].value);
      models.PriceIncreaseMethodTypeId = Number(form.controls["txtPriceIncreaseMethod" + i].value);
      models.AddPalletBags = Boolean(form.controls["txtAddPallet" + i].value) == true ? 1 : 0;
      models.ShippingInstructionsNotRequired = Boolean(form.controls["txtAutoAdded" + i].value)
      models.IsDeleted = false;
      models.ClientId = this.authService.currentUserValue.ClientId;
      models.UpdatedBy = this.authService.currentUserValue.LoginId;
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
          //this.Data.length = 0;
          //this.dataSource = new MatTableDataSource(this.LineItemViewModel);
          //this.dataSource.data = this.Data;
          this.FillData();
        }
      });
  }
}

export interface PeriodicElement {
  Id: number;
  Material: string;
  Charge: string;
  Commodity: string;
  RateType: string;
  Rate: string;
  UOM: string;
  Quantity_per_UOM: string;
  Sales_Tax_Price: string;
  MethodType: string;
  ShowOnBOL: string;
  AutoAdded: string;
  AddPallet: string;
  PriceIncreaseMethod: string;
  EffectiveStart: string;
  EffectiveEnd: string;
  Add_New: string;
  Delete: string;
}

//const ELEMENT_DATA: PeriodicElement[] = [
//  { Id:0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete:'' },
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: ''},
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: ''},
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: ''},
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: '' },
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: '' },

//];
