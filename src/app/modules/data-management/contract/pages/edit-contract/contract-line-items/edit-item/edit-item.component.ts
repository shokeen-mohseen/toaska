import { Component, ViewChild, OnInit, Input } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '@app/core/services/contract.service';
import { AuthService } from '@app/core/services';
import { LineItem, Contract, ContractDetails, ContractLineItemDetails } from '@app/core/models/contract.model';
import { FormGroup, FormArray, FormBuilder, NgForm } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewItemComponent } from '../view-item/view-item.component';
import { ContractCommonDataService } from '../../../../../../../core/services/contract-common-data.service';
import { ContractLineItemsComponent } from '../contract-line-items.component';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  selectRow: any;
  object: Contract = new Contract();
  //editlineitemform: FormGroup;
  Inactive: boolean;
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
  RateTypeLists = [];
  RateTypeListArray = [];
  modalRef: NgbModalRef; 
  //ELEMENT_DATA: PeriodicElement[] = [];
  ELEMENT_DATA: ContractLineItemDetails[] = [];

  public dateFormat: String = "MM-dd-yyyy";
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date("12/11/2017 1:00 AM");

  @Input() viewRef: ViewItemComponent;
 // @Input() addRef: AddItemComponent;

  ngOnInit() {
   
    this.selectRow = 'selectRow';
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.Inactive = this.contractService.Permission == false ? true : false;  

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

  displayedColumns = ['Material', 'Charge', 'Commodity', 'RateType', 'Rate', 'UOM', 'Quantity_per_UOM', 'Sales_Tax_Price',
    'MethodType', 'ShowOnBOL', 'AutoAdded', 'AddPallet', 'PriceIncreaseMethod', 'EffectiveStart', 'EffectiveEnd', 'Add_New', 'Delete'];
 
  displayedColumnsReplace = ['key_Material', 'key_Charge',
    'key_Commodity', 'key_RateType', 'key_Rate', 'key_UOM',
    'key_Quantityuom', 'key_SalesTax',
    'key_Pricetype', 'key_ShowOnBOL', 'key_AutoAdded', 'key_Addpalet',
    'key_Priceinc', 'key_EffectiveStart', 'key_EffectiveEnd',
    'key_add', 'key_Delete'];

  @ViewChild('table', { static: true }) table;
  // for adding row
  addRow(modal: ContractLineItemDetails, index: number) {
    var data: ContractLineItemDetails = Object.assign({}, modal);

    var tempLineItem: ContractLineItemDetails[] = JSON.parse(JSON.stringify(this.ELEMENT_DATA));

    //for (var i = 0; i < this.ELEMENT_DATA.length+1; i++)
    //{
    //  if ((index + 1) == i) {
    //    tempLineItem.push(data);       
    //  }
    //}

    this.ELEMENT_DATA.splice(0, this.ELEMENT_DATA.length);
    //this.ELEMENT_DATA = JSON.parse(JSON.stringify(tempLineItem));

    data.id = 0;
    //data.EffectiveStart = null;
    //data.EffectiveEnd = null; 
    tempLineItem.splice((index + 1), 0, data);
    this.RateTypeListArray.splice((index + 1), 0, JSON.parse(JSON.stringify(this.RateTypeListArray[index])));
    //this.RateTypeListArray[index + 1] = JSON.parse(JSON.stringify(this.RateTypeListArray[index]));
    this.ELEMENT_DATA = JSON.parse(JSON.stringify(tempLineItem));
    
    this.dataSource = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA);
    tempLineItem.splice(0, tempLineItem.length);
    //this.dataSource.data = this.ELEMENT_DATA;
    this.table.renderRows();

    

  }
  

  RemoveRow(modal: ContractLineItemDetails) {


    this.ELEMENT_DATA.splice(this.ELEMENT_DATA.findIndex(item => item.id === modal.id && item.materialID == modal.materialID && item.chargeID == modal.chargeID && item.effectiveEndStr == modal.effectiveEndStr && item.effectiveStartStr == modal.effectiveStartStr), 1);
    this.dataSource = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA);
    var index = this.contractmodelservice.FinalContractData.lineItems.findIndex(item => item.id === modal.id && item.materialID == modal.materialID && item.chargeID == modal.chargeID && item.effectiveEndStr == modal.effectiveEndStr && item.effectiveStartStr == modal.effectiveStartStr);
    this.RateTypeListArray.splice((index + 1), 1);
    this.contractmodelservice.FinalContractData.lineItems.splice(this.contractmodelservice.FinalContractData.lineItems.findIndex(item => item.id === modal.id && item.materialID == modal.materialID && item.chargeID == modal.chargeID && item.effectiveEndStr == modal.effectiveEndStr && item.effectiveStartStr == modal.effectiveStartStr), 1);

    
    
    this.toastrService.info("Line item removed from the list.");


    //this.viewRef.FillData();

    this.table.renderRows();  
  }

  //dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  dataSource = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA);
  //selection = new SelectionModel<PeriodicElement>(true, []);
  selection = new SelectionModel<ContractLineItemDetails>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 


  async ngAfterViewInit() {
    await this.getMaterialDescription();
    await this.getChargeDescription();
    await this.getCommodityList();
    await this.getPriceMethodTypeList();
    await this.getPriceIncreaseMethodTypeList();
    await this.getSalesTaxList();
    await this.getUomList();
    this.getChargeComputationMethod();
    if (this.contractService.ID != null) {
     //await this.FillData();
    }
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

  constructor(private fb: FormBuilder, public modalService: NgbModal, private toastrService: ToastrService, private authService: AuthService, private contractService: ContractService, private contractmodelservice: ContractCommonDataService) { }


  async getMaterialDescription() {
    this.contractService.getMaterialDescription(this.object)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.MaterialDescription = res.data;
        }

      });
  }
  async getChargeDescription() {
    this.contractService.getChargeDescription(this.object)
      .subscribe(async res => {
        if (res.message == "Success") {
          this.ChargeDescription = res.data;
        }
      });
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

  getPriceIncreaseMethodTypeList() {
    this.contractService.getPriceIncreaseMethodTypeList(this.object)
      .subscribe(res => {
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
  
  async getChargeComputationMethod() {
    this.contractService.getChargeComputationMethod()
      .subscribe(async res => {
        if (res.message == "Success") {
          this.RateTypeList = res.data;
          this.RateTypeLists = res.data;
        }
      });
  }
  async bindRateType() {
    var that = this;
    var chargeIds = [];
    chargeIds = that.ELEMENT_DATA.map(({ chargeID }) => chargeID);
    //var data = that.ChargeData.filter(f => chargeIds.includes(f.id)).map(function (a) { return a["chargeComputationMethodId"]; });

    var allChargesData = that.ChargeDescription.filter(f => chargeIds.includes(f.id));

    

    allChargesData.forEach((value, index) => {
      var data = [];
      var chargeComputationmethods = value.chargeComputationMappingId.split(',');
      //var cIndex = that.ELEMENT_DATA.findIndex(a => a.chargeID == value.id);
      

      chargeComputationmethods.forEach((val, inx) => {
        if (data.indexOf(Number(val)) == -1) {
          data.push(Number(val));
        }
      });
      this.RateTypeList = this.RateTypeLists.filter(r => data.includes(r.id));
      that.ELEMENT_DATA.forEach((x, i) => {
        if (x.chargeID == value.id) {
          this.RateTypeListArray[i] = this.RateTypeList;
        }
      });
      
    });

    

  }

  async FillData() {
    //alert(1);
    if (this.contractmodelservice.FinalContractData != undefined && this.contractmodelservice.FinalContractData.lineItems.length > 0) {
      this.ELEMENT_DATA = JSON.parse(JSON.stringify(this.contractmodelservice.FinalContractData.lineItems));

      //this.ELEMENT_DATA.forEach()

      //this.ELEMENT_DATA.forEach(row => {
      //  //if (row.id == value.id)
      //  //  row.isSelected = !value.isSelected;
      //  row.rateType = this.setRateType(row.chargeID);
      //});
      await this.bindRateType();
      this.dataSource = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA);
      
    }
  }

  setRateType(chargeId: any, index: any) {
   
    var that = this;
    var charge = Number(chargeId);

    
    var dataArray = [];

    var data1 = that.ChargeDescription.filter
      (f => (charge === f.id)).map
      (({ chargeComputationMappingId }) => chargeComputationMappingId);

    dataArray = String(data1[0]).split(',');

    var allChargesData = that.ChargeDescription.filter(f => (f.id == chargeId));

    var data = [];

    allChargesData.forEach((value, index) => {
      if (value.chargeComputationMappingId != null) {
        var chargeComputationmethods = value.chargeComputationMappingId.split(',');

        chargeComputationmethods.forEach((val, inx) => {
          if (data.indexOf(Number(val)) == -1) {
            data.push(Number(val));
          }
        });
      }
      

      
      
    });
    if (data.length != 0)
      this.RateTypeList = this.RateTypeLists.filter(r => data.includes(r.id));
    else
      this.RateTypeList = [];

    this.RateTypeListArray[index] = this.RateTypeList;
    //this.table.renderRows();
    //RateType.Value
  }


  //async FillData() {   
    //var ClientId = this.authService.currentUserValue.ClientId;
    //this.ContractTypeId = this.contractService.ContractTypeId;
    //this.ParentId = this.contractService.ID;
    //this.contractService.getContractDetailsByIds(ClientId, this.ContractTypeId, this.ParentId)
    //  .subscribe(async res => {
    //    if (res.message == "Success") {
    //      this.ELEMENT_DATA = [];
    //      res.data.forEach((value, index) => {
    //        this.ELEMENT_DATA.push({
    //          Id: value.id,
    //          Material: value.materialId,
    //          Charge: value.chargeId,
    //          Rate: value.rateValue,
    //          RateType: value.chargeComputationMethodId,
    //          UOM: value.uomid,
    //          Quantity_per_UOM: value.quantityPerUom,
    //          Commodity: value.commodityId,
    //          Sales_Tax_Price: value.salesTaxClassId,
    //          PriceIncreaseMethod: value.priceIncreaseMethodTypeId,
    //          ShowOnBOL: value.showOnBol,
    //          AutoAdded: value.isRequired,
    //          AddPallet: value.addPalletBags,
    //          MethodType: value.priceMethodTypeId,
    //          EffectiveStart: value.termStartDate,
    //          EffectiveEnd: value.termEndDate,
    //          Add_New:'',
    //          Delete: '',
    //          IsDeleted: false,
    //          IsDisabledAddPallet: (Number(value.chargeId) == 1 || Number(value.chargeId) == 40) ? false : true
    //        })
    //      })
    //     // this.editlineitemform.setControl('albums', res.data);
    //      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    //      this.dataSource.data = this.ELEMENT_DATA;
          
    //    }
    //  });
  //}
  
  AddData(form: NgForm) {
    this.Data = [];
    for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
      let models = new ContractLineItemDetails();
      var contractTId = this.contractService.ContractTypeId;
      models.id = this.ELEMENT_DATA[i].id;
      models.chargeID = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtCharge" + i].value) : Number(this.ELEMENT_DATA[i].chargeID);
      if (models.chargeID > 0) {
        models.charge = this.ChargeDescription.find(x => Number(x.id) == Number(models.chargeID))?.description;
      }
      models.materialID = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtMaterial" + i].value) : Number(this.ELEMENT_DATA[i].materialID);
      if (models.materialID > 0) {
        models.material = this.MaterialDescription.find(x => Number(x.id) == Number(models.materialID))?.description;
      }

      //models.ContractTypeId = contractTId;
      //if (contractTId == 3 || contractTId == 4 || contractTId == 5) {
      //  models.CustomerContractId = this.contractService.ID;
      //}
      //else {
      //  models.BusinessPartnerContractId = this.contractService.ID;
      //}

      models.priceMethodTypeID = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtMethodType" + i].value) : Number(this.ELEMENT_DATA[i].priceMethodTypeID);

      if (models.priceMethodTypeID > 0) {
        models.methodType = this.priceMethodData.find(x => Number(x.id) == Number(models.priceMethodTypeID))?.description;
      }

      models.uomid = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtUOM" + i].value) : Number(this.ELEMENT_DATA[i].uomid);
      if (models.uomid > 0) {
        models.uom = this.UomList.find(x => Number(x.id) == Number(models.uomid))?.description;
      }

      models.commodityID = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtCommodity" + i].value) : Number(this.ELEMENT_DATA[i].commodityID);
      if (models.commodityID > 0) {
        models.commodity = this.commodityData.find(x => Number(x.id) == Number(models.commodityID))?.name;
      }

      //models.QuantityPerUom = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtQuantityperUOM" + i].value) : Number(this.ELEMENT_DATA[i].quantity_per_UOM);
      models.quantity_per_UOM = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtQuantityperUOM" + i].value) : Number(this.ELEMENT_DATA[i].quantity_per_UOM);
      //models.quantity_per_UOM = models.QuantityPerUom.toString();

      //models.DetailDescription = "";
      models.effectiveStart = this.ELEMENT_DATA[i].IsDeleted == false ? new Date(form.controls["txtEffectiveStart" + i].value) : new Date(this.ELEMENT_DATA[i].effectiveStart);
      models.effectiveEnd = this.ELEMENT_DATA[i].IsDeleted == false ? new Date(form.controls["txtEffectiveEnd" + i].value) : new Date(this.ELEMENT_DATA[i].effectiveEnd);
      
      models.effectiveStartStr = (((models.effectiveStart.getMonth() > 8) ? (models.effectiveStart.getMonth() + 1) : ('0' + (models.effectiveStart.getMonth() + 1))) + '/' + ((models.effectiveStart.getDate() > 9) ? models.effectiveStart.getDate() : ('0' + models.effectiveStart.getDate())) + '/' + models.effectiveStart.getFullYear());
      
      models.effectiveEndStr = (((models.effectiveEnd.getMonth() > 8) ? (models.effectiveEnd.getMonth() + 1) : ('0' + (models.effectiveEnd.getMonth() + 1))) + '/' + ((models.effectiveEnd.getDate() > 9) ? models.effectiveEnd.getDate() : ('0' + models.effectiveEnd.getDate())) + '/' + models.effectiveEnd.getFullYear());


      models.rate = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtRate" + i].value) : Number(this.ELEMENT_DATA[i].rate);
      models.rateTypeID = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtRateType" + i].value) : Number(this.ELEMENT_DATA[i].rateTypeID);
      
      if (models.rateTypeID > 0) {
        models.rateType = this.RateTypeLists.find(x => Number(x.id) == Number(models.rateTypeID))?.description;
      }

      models.showOnBOL = this.ELEMENT_DATA[i].IsDeleted == false ? (Boolean(form.controls["txtShowOnBOL" + i].value) == true ? 1 : 0) : Number(this.ELEMENT_DATA[i].showOnBOL);
      models.salesTaxClassID = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtSalesTaxPrice" + i].value) : Number(this.ELEMENT_DATA[i].salesTaxClassID);
      if (models.salesTaxClassID > 0) {
        models.sales_Tax_Price = this.salesTaxClass.find(x => Number(x.id) == Number(models.salesTaxClassID))?.name;
      }
      models.priceIncreaseMethodTypeID = this.ELEMENT_DATA[i].IsDeleted == false ? Number(form.controls["txtPriceIncreaseMethod" + i].value) : Number(this.ELEMENT_DATA[i].priceIncreaseMethodTypeID);

      if (models.priceIncreaseMethodTypeID > 0) {
        models.priceIncreaseMethod = this.priceIncreaseMethodData.find(x => Number(x.id) == Number(models.priceIncreaseMethodTypeID))?.description;
      }

      models.addPallet = this.ELEMENT_DATA[i].IsDeleted == false ? (Boolean(form.controls["txtAddPallet" + i].value) == true ? 1 : 0) : Number(this.ELEMENT_DATA[i].addPallet);
      models.autoAdded = this.ELEMENT_DATA[i].IsDeleted == false ? (Boolean(form.controls["txtAutoAdded" + i].value) == true ? 1 : 0) : Number(this.ELEMENT_DATA[i].autoAdded);
      //models.IsDeleted = this.ELEMENT_DATA[i].IsDeleted;
      models.clientId = this.authService.currentUserValue.ClientId;
      //models.UpdatedBy = this.authService.currentUserValue.LoginId;
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
     var existItem = acc.find(item => (item.chargeID == obj.chargeID && item.materialID == obj.materialID && item.effectiveStartStr == obj.effectiveStartStr && item.effectiveEndStr == obj.effectiveEndStr));
      if (existItem) {
        return this.toastrService.error('WARNING: Duplicate charge items cannot be added with same effective start and end dates.');       
      }
      acc.push(obj);
      return acc;
   }, []);

    if (res.length != undefined && !datevalidate) {
      this.contractmodelservice.FinalContractData.lineItems.splice(0, this.contractmodelservice.FinalContractData.lineItems.length);
      this.Data.forEach((value, index) => {
        this.contractmodelservice.FinalContractData.lineItems.push(value);

      });

          
      this.toastrService.info("Line item added.");
     //this.contractService.SaveContractDetails(this.Data)
     // .subscribe(res => {
     //   if (res.message == "Success") {
     //     this.toastrService.success("Line Item Saved");
     //     //this.ContractDetailData.push(res);
     //     //this.Data.length = 0;
     //     //this.dataSource = new MatTableDataSource(this.LineItemViewModel);
     //     //this.dataSource.data = this.Data;
     //     this.FillData();
     //     this.viewRef.FillData();
     //    // this.addRef.FillData();
     //   }
     // });
    }
  }
  trackByFn(index, item) {
    return index;
  }

  onEffectiveStart(value: any) {    
    var result = this.dataSource.data;
    let LineItemList = [];
    result.map(f => {
      let LineItemSummary: ContractLineItemDetails = new ContractLineItemDetails();
      LineItemSummary = f;
      if (f.id == value.Id) {
        LineItemSummary.effectiveStart = value.effectiveStart;

        if (!!LineItemSummary.effectiveStart && !!LineItemSummary.effectiveEnd) {
          if (LineItemSummary.effectiveStart > LineItemSummary.effectiveEnd) {
            this.toastrService.warning("End date is should be greater than or equal to the Start Date.");
          }
        }
      }
      LineItemList.push(LineItemSummary);
    });
    this.dataSource = new MatTableDataSource<ContractLineItemDetails>(LineItemList);
  }

  onEffectiveEnd(value: any) {
    var result = this.dataSource.data;
    let LineItemList = [];
    result.map(f => {
      let LineItemSummary: ContractLineItemDetails = new ContractLineItemDetails();
      LineItemSummary = f;
      if (f.id == value.Id) {
        LineItemSummary.effectiveEnd = value.effectiveEnd;

        if (!!LineItemSummary.effectiveEnd && !!LineItemSummary.effectiveStart) {
          if (LineItemSummary.effectiveStart > LineItemSummary.effectiveEnd) {
            this.toastrService.warning("End date is always greater than or equal to Start Date");
          }
        }
      }
      LineItemList.push(LineItemSummary);
    });
    this.dataSource = new MatTableDataSource<ContractLineItemDetails>(LineItemList);
  }

  clearEditLineitemGrid() {
    if (this.contractmodelservice.FinalContractData != undefined && this.contractmodelservice.FinalContractData.lineItems != undefined && this.contractmodelservice.FinalContractData.lineItems.length > 0) {
      this.contractmodelservice.FinalContractData.lineItems = [];
    }
    
    this.ELEMENT_DATA.splice(0, this.ELEMENT_DATA.length);
    this.dataSource = new MatTableDataSource<ContractLineItemDetails>(this.ELEMENT_DATA);
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
  IsDeleted: boolean;
  IsDisabledAddPallet: boolean;
}

//const ELEMENT_DATA: PeriodicElement[] = [
//  { Id:0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete:'' },
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: ''},
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: ''},
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: ''},
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: '' },
//  { Id: 0,Material: '', Charge: '', Commodity: '', RateType: '', Rate: '', UOM: '', Quantity_per_UOM: '', Sales_Tax_Price: '', MethodType: '', ShowOnBOL: '', AutoAdded: '', AddPallet: '', PriceIncreaseMethod: '', EffectiveStart: '', EffectiveEnd: '', Add_New: '', Delete: '' },

//];
