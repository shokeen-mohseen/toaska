import { Injectable } from '@angular/core';
import { AdjustChargesModel, RateTypeWithUOM, CalculationAmountVM } from '../../core/models/regularOrder.model';
import { BehaviorSubject, of, observable } from 'rxjs';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { OrderManagementService } from './order-management.service';
import { ToastrService } from 'ngx-toastr';
import { OrdermanagementCommonOperation } from './order-management-common-operations.service'; //, CalculationRateType

@Injectable({
  providedIn: 'root'
})
export class OrderManagementAdjustChargesService {

  /// Define All Variables
  private _allAdjustChargesData: AdjustChargesModel[] = [];

  private _MaterialDetails: any[];
  private _ShippingMaterialDetails: any[];
  private _defaultContractChargesData: AdjustChargesModel[] = [];
  private _allChargesSelectedContract: AdjustChargesModel[] = [];

  private _rateTypeWithUOM: RateTypeWithUOM[] = [];
  private PriceMethodData: any[] = [];
  private CommodityData: any[] = [];
  private ChargesData: any[] = [];
  private RateTypeData: any[] = [];
  private _defaultCommodityID: number;
  private _defaultChargeIDForMaterial: number;
  private _defaultChargeNameForMaterial: string;
  private defaultCommodityName: string;
  editIndex: number = -1;
  private _totalAmount = 0;
  private _ShippingOrdersDetails: any[];
  private contractAdjustmentCharges: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private addEditAdjustmentCharges: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  defaultUpdate = this.contractAdjustmentCharges.asObservable();
  addEditAdjustmentChargesFlag = this.addEditAdjustmentCharges.asObservable();

  private currentOrderID: number = 0;
  private currentOrderTypeID: number = 0;
  private currentOrderTypeCode: string = GlobalConstants.Customer;
  private requestedDelieveryDate: string;
  private scheduleShipDate: string;

  private isLocationChangeByUser: boolean = true;
  private isToContractChangeByUser: boolean = true;

  MaxPalletSize: number = 0;
  /// End Here

  // for DOE Calculation
  ChargeRatePerMile: number = 0;
  PerMileCharge: number = 0;
  PassthrowPercentage: number = 0;
  //end Of DOE Variables
  NPMIPallets: number = 0;

  constructor(private orderManagementService: OrderManagementService, private toastrService: ToastrService, private orderCommonService: OrdermanagementCommonOperation) {

    this.editIndex = -1;
    this.orderManagementService.GetPriceMethods()
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.PriceMethodData = result.data == undefined ? result.Data : result.data;
          }
        }
      );

    this.orderManagementService.GetCommodities()
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.CommodityData = result.data == undefined ? result.Data : result.data;
          }
        }
      );

    this.orderManagementService.GetCharges()
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.ChargesData = result.data == undefined ? result.Data : result.data;

            if (this.ChargesData != undefined && this.ChargesData != null) {

              this.ChargesData.forEach((value, index) => {

                if (value.code == GlobalConstants.DefaultMaterialChargeCode) {
                  this._defaultChargeIDForMaterial = value.id;
                  this._defaultChargeNameForMaterial = value.code;
                }

              });

            }

          }
        }
      );


    this.orderManagementService.GetRateType()
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.RateTypeData = result.data == undefined ? result.Data : result.data;
          }
        }
      );

  }


  /// Define All Properties
  get allAdjustChargesData(): AdjustChargesModel[] {
    return this._allAdjustChargesData;
  }
  set allAdjustChargesData(value: AdjustChargesModel[]) {
    this._allAdjustChargesData = value;
  }
  get MaterialDetails(): any[] {
    return this._MaterialDetails;
  }
  set MaterialDetails(value: any[]) {
    this._MaterialDetails = value;
  }
  get ShippingMaterialDetails(): any[] {
    return this._ShippingMaterialDetails;
  }
  set ShippingMaterialDetails(value: any[]) {
    this._ShippingMaterialDetails = value;
  }
  get defaultContractChargesData(): AdjustChargesModel[] {
    return this._defaultContractChargesData;
  }
  set defaultContractChargesData(value: AdjustChargesModel[]) {
    this._defaultContractChargesData = value;
  }

  get SelectedContractCharges(): AdjustChargesModel[] {
    return this._allChargesSelectedContract;
  }
  set SelectedContractCharges(value: AdjustChargesModel[]) {
    this._allChargesSelectedContract = value;
  }
  get rateTypeWithUOM(): any[] {
    return this._rateTypeWithUOM;
  }
  set rateTypeWithUOM(value: any[]) {
    this._rateTypeWithUOM = value;
  }
  get DefaultCommodityID(): number {
    return this._defaultCommodityID;
  }
  set DefaultCommodityID(value: number) {
    this._defaultCommodityID = value;
  }
  get TotalAmount(): number {
    return this._totalAmount;
  }
  set TotalAmount(value: number) {
    this._totalAmount = value;
  }

  get ShippingOrdersDetails(): any[] {
    return this._ShippingOrdersDetails;
  }
  set ShippingOrdersDetails(value: any[]) {
    this._ShippingOrdersDetails = value;
  }

  get IsLocationChangeByUser(): boolean {
    return this.isLocationChangeByUser;
  }
  set IsLocationChangeByUser(value: boolean) {
    this.isLocationChangeByUser = value;
  }

  get IsToContractChangeByUser(): boolean {
    return this.isToContractChangeByUser;
  }
  set IsToContractChangeByUser(value: boolean) {
    this.isToContractChangeByUser = value;
  }

  private _isShipment: boolean = false;
  get IsShipmentCreated(): boolean {
    return this._isShipment;
  }

  set IsShipmentCreated(value: boolean) {
    this._isShipment = value;
  }
  //ShippingOrdersDetails

  get OrderID(): number {
    return Number(this.currentOrderID == undefined ? 0 : this.currentOrderID);
  }

  set OrderID(value: number) {
    this.currentOrderID = Number(value);
  }

  get OrderTypeID(): number {
    return Number(this.currentOrderTypeID == undefined ? 0 : this.currentOrderTypeID);
  }

  set OrderTypeID(value: number) {
    this.currentOrderTypeID = Number(value);
  }

  get OrderTypeCode(): string {
    return this.currentOrderTypeCode;
  }

  set OrderTypeCode(value: string) {
    this.currentOrderTypeCode = value;
  }

  private CurrentOrderStatusCode: string = '';


  get OrderStatusCode(): string {
    return this.currentOrderTypeCode;
  }

  set OrderStatusCode(value: string) {
    this.CurrentOrderStatusCode = value;
  }

  get IsCheckShippedQuanity(): boolean {
    if (this.OrderStatusCode == 'TransferOrderShippedandInventorySentToMAS' || this.OrderStatusCode == 'ShippedInventoryAndARChargesSentToMAS' || this.OrderStatusCode == 'AssignedToShipment' || this.OrderStatusCode == 'ShippedAndUnderReview')
      return true;
    else
      return false;
  }

  get RequestedDelieveryDate(): string {
    return this.requestedDelieveryDate;
  }

  set RequestedDelieveryDate(value: string) {
    this.requestedDelieveryDate = value;
  }

  get ScheduleShipDate(): string {
    return this.scheduleShipDate;
  }

  set ScheduleShipDate(value: string) {
    this.scheduleShipDate = value;
  }

  // End here
  shipToLocationID: number;
  shipFromLocationID: number;
  contractID: number;

  updateContractDefault() {

    var isMaterialSelected = false;

    var materials = [];
    if (this.MaterialDetails != undefined && this.MaterialDetails.length > 0) {
      this.MaterialDetails.forEach((value, index) => {

        var RateTypeData = this.rateTypeWithUOM.find(x => x.code == "PerEA");

        materials.push({
          MaterialID: value.materialID,
          MaterialName: value.name,
          RateType: RateTypeData.name,
          RateTypeID: Number(RateTypeData.id),
          Quantity: value.quantity,
          Type: GlobalConstants.MaterialItem
        });

        isMaterialSelected = true;
      });
    }

    if (this.ShippingMaterialDetails != undefined && this.ShippingMaterialDetails.length > 0) {
      this.ShippingMaterialDetails.forEach((value, index) => {

        //var RateTypeData = this.rateTypeWithUOM.find(x => x.uomid == value.uomid);
        materials.push({
          MaterialID: value.materialID,
          MaterialName: value.name,
          RateType: '',
          RateTypeID: -1,
          Quantity: value.quantity,
          Type: GlobalConstants.PackageItem
        });

      });

    }

    if (!isMaterialSelected && this.contractID == 0 && this.shipToLocationID == 0 && this.OrderTypeCode != GlobalConstants.CustomerReturn) return;

    if (!isMaterialSelected && this.contractID == 0 && this.shipToLocationID == 0 && this.OrderTypeCode == GlobalConstants.CustomerReturn) return;

    var RequestObject = {
      ContractID: Number(this.contractID),
      ShipTOLocationID: Number(this.shipToLocationID),
      ShipFromLocationID: Number(this.shipFromLocationID),
      Materials: materials,
      Code: GlobalConstants.PriceMethodCateoryCode,
      OrderID: null,
      OrderTypeID: null,
      ValidDate : this.RequestedDelieveryDate
    };

    // && (!this.IsLocationChangeByUser  || !this.isToContractChangeByUser)
    if (this.OrderID > 0 ) {
     
      RequestObject.OrderID = this.OrderID;
    }

    if (this.OrderTypeID > 0) {
      RequestObject.OrderTypeID = this.OrderTypeID;
    }



    this.orderManagementService.GetAdjustChargesDefault(RequestObject)
      .subscribe(result => {
        this.allAdjustChargesData = [];
        this.defaultContractChargesData = [];
        this.SelectedContractCharges = [];
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.allAdjustChargesData = <AdjustChargesModel[]>result.data.responseAdjustCharges;
          this.defaultContractChargesData = <AdjustChargesModel[]>result.data.responseContractDefaultRateValue;
          this.SelectedContractCharges = <AdjustChargesModel[]>result.data.allContractDetailValue;


          if (this.allAdjustChargesData != undefined && this.allAdjustChargesData.length > 0 && this.OrderID == undefined && this.OrderID == 0 && this.OrderTypeCode == GlobalConstants.CustomerReturn) {

            this.allAdjustChargesData.forEach((value, index) => {
              value.amount = value.amount * (-1);
            });

          }


          this.calculatetotalAmount();
          this.contractAdjustmentCharges.next(true);

        }
      });

  }



  //this method use to recalculate all the material charges on basis of Material list and pallet list and existing charges list

  reCalculateAllOrder() {

    this.editIndex = -1;

    this.CommodityData.forEach((value, index) => {
      if (value.id == this.DefaultCommodityID) {
        this.defaultCommodityName = value.name;
      }

    });



    if (this.MaterialDetails.length > 0 && this.ShippingMaterialDetails.length > 0) {
      // this section create material if list don't have any charges.
      if (this.allAdjustChargesData.length == 0 && this.defaultContractChargesData.length == 0) {
        // this.CreateAdjustChargesData();
      }
      else {
        this.AdjustmnetChargesRecalcuation();
      }


    }

    this.calculatetotalAmount();
  }




  private AdjustmnetChargesRecalcuation() {
    var tempModifiedAdjustCharges: AdjustChargesModel[] = [];
    var materialQuantity = 0;

    // this section check material one by one it is into grid or not
    this.MaterialDetails.forEach((value, index) => {

      materialQuantity = materialQuantity + (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity));

      //check selected material is autoadded or not.
      var recordIntoDefault = this.defaultContractChargesData.filter(x => x.materialID == value.materialID);

      if (recordIntoDefault != undefined && recordIntoDefault.length > 0) {
        // if the material is auto added then we will seach all chagres auto added or not
        recordIntoDefault.forEach((defaultValue, defaultIndex) => {
          //search material with specific charge is into grid or not
          var recordsintoGrid = this.allAdjustChargesData.find(x => x.materialID == defaultValue.materialID && x.chargeID == defaultValue.chargeID);
          if (recordsintoGrid == undefined) {
            //if the material with specific chagre not into grid then add into grid as well
            var selectedElementNotExistsIntoGrid: AdjustChargesModel = JSON.parse(JSON.stringify(defaultValue));

            

            selectedElementNotExistsIntoGrid.amount = this.CalculatePerRowCharges(selectedElementNotExistsIntoGrid, (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity)))
            selectedElementNotExistsIntoGrid.fullAmount = selectedElementNotExistsIntoGrid.amount + selectedElementNotExistsIntoGrid.overrideAmount;
            selectedElementNotExistsIntoGrid.overrideShowOnBOL = selectedElementNotExistsIntoGrid.showOnBOL;
            tempModifiedAdjustCharges.push(selectedElementNotExistsIntoGrid);
          }
          else {
            // the material with specific chagre already into grid then recalculate the amount again
            var selectedElementExistsIntoGrid: AdjustChargesModel = JSON.parse(JSON.stringify(recordsintoGrid));

            if (!selectedElementExistsIntoGrid.isAutoAddedExclude) {

              selectedElementExistsIntoGrid.amount = this.CalculatePerRowCharges(selectedElementExistsIntoGrid, (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity)));
              selectedElementExistsIntoGrid.fullAmount = selectedElementExistsIntoGrid.amount + selectedElementExistsIntoGrid.overrideAmount;
            }
            selectedElementExistsIntoGrid.overrideShowOnBOL = selectedElementExistsIntoGrid.showOnBOL;
            //temprary hold element for refershing the grid
            tempModifiedAdjustCharges.push(selectedElementExistsIntoGrid);

          }
        });

      }
      else {
        // this section only modify the dropdown and grid will be updated by user.
      }

    });

    /// material calculation end here


    /// shiping material calculation start here
    this.ShippingMaterialDetails.forEach((value, index) => {

      //materialQuantity = materialQuantity + parseInt(value.quantity);

      //check selected material is autoadded or not.
      var recordIntoDefault = this.defaultContractChargesData.filter(x => x.materialID == value.materialID);

      if (recordIntoDefault != undefined && recordIntoDefault.length > 0) {
        // if the material is auto added then we will seach all chagres auto added or not
        recordIntoDefault.forEach((defaultValue, defaultIndex) => {
          //search material with specific charge is into grid or not
          var recordsintoGrid = this.allAdjustChargesData.find(x => x.materialID == defaultValue.materialID && x.chargeID == defaultValue.chargeID);
          if (recordsintoGrid == undefined) {
            //if the material with specific chagre not into grid then add into grid as well
            var selectedElementNotExistsIntoGrid: AdjustChargesModel = JSON.parse(JSON.stringify(defaultValue));


            selectedElementNotExistsIntoGrid.amount = this.CalculatePerRowCharges(selectedElementNotExistsIntoGrid, (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity)));
            selectedElementNotExistsIntoGrid.fullAmount = selectedElementNotExistsIntoGrid.amount + selectedElementNotExistsIntoGrid.overrideAmount;
            selectedElementNotExistsIntoGrid.overrideShowOnBOL = selectedElementNotExistsIntoGrid.showOnBOL;
            tempModifiedAdjustCharges.push(selectedElementNotExistsIntoGrid);
          }
          else {
            // the material with specific chagre already into grid then recalculate the amount again
            var selectedElementNotExistsIntoGrid: AdjustChargesModel = JSON.parse(JSON.stringify(recordsintoGrid));
            if (!selectedElementNotExistsIntoGrid.isAutoAddedExclude) {
              //var CalculateData: CalculationAmountVM = new CalculationAmountVM();

              selectedElementNotExistsIntoGrid.amount = this.CalculatePerRowCharges(selectedElementNotExistsIntoGrid, (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity)));
              selectedElementNotExistsIntoGrid.fullAmount = selectedElementNotExistsIntoGrid.amount + selectedElementNotExistsIntoGrid.overrideAmount;

            }
            selectedElementNotExistsIntoGrid.overrideShowOnBOL = selectedElementNotExistsIntoGrid.showOnBOL;
            //temprary hold element for refershing the grid



            tempModifiedAdjustCharges.push(selectedElementNotExistsIntoGrid);




          }
        });

      }

    });



    // Auto Added Charges which are not exists into gird add them
    var allAutoAddedCharges = this.defaultContractChargesData.filter(x => x.materialID <= 0 && x.chargeID > 0);

    if (allAutoAddedCharges != null && allAutoAddedCharges.length > 0) {
      //Now Check existing Charge into grid or not
      allAutoAddedCharges.forEach((value, index) => {
        var alreadyApplied = this.allAdjustChargesData.find(x => x.materialID == value.materialID && x.chargeID == value.chargeID);
        if (alreadyApplied != null && alreadyApplied != undefined) {
          //Charges already into grid then recalculate amount 
          var exsitingCharge: AdjustChargesModel = JSON.parse(JSON.stringify(alreadyApplied));
          if (!exsitingCharge.isAutoAddedExclude) {


            exsitingCharge.amount = this.CalculatePerRowCharges(exsitingCharge, Number(materialQuantity));

            exsitingCharge.fullAmount = exsitingCharge.amount + exsitingCharge.overrideAmount;
          }
          exsitingCharge.overrideShowOnBOL = exsitingCharge.showOnBOL;
          tempModifiedAdjustCharges.push(exsitingCharge);
        }
        else {

          // this section find chagres not added into grid then add this chagres into grid as well
          var nonExisting: AdjustChargesModel = JSON.parse(JSON.stringify(value));



          nonExisting.amount = this.CalculatePerRowCharges(nonExisting, Number(materialQuantity));
          nonExisting.fullAmount = nonExisting.amount + nonExisting.overrideAmount;
          nonExisting.showOnBOL = nonExisting.overrideShowOnBOL;
          tempModifiedAdjustCharges.push(nonExisting);
        }

      });

    }

    // end of chagre calculation



    // Recalculate the Percentage Charges

    tempModifiedAdjustCharges.forEach((value, index) => {
      if (value.rateTypeName == GlobalConstants.PercentageAmount) {
        this.CalculatePerRowCharges(value, 1);
      }

    });

    if (tempModifiedAdjustCharges.length > 0 && this.defaultContractChargesData != undefined && this.defaultContractChargesData.length > 0) {
      this.allAdjustChargesData.splice(0, this.allAdjustChargesData.length);

      this.allAdjustChargesData = JSON.parse(JSON.stringify(tempModifiedAdjustCharges));
    }





  }


  removeAdjustChargesValue(element: AdjustChargesModel[], isForciable = false) {
    this.editIndex = -1;
    element.forEach((elementvalue, index) => {
      if (element != undefined) {
        if (isForciable) {
          elementvalue.isManual = true;
        }
        var index = this.allAdjustChargesData.indexOf(elementvalue);
        if (elementvalue.isManual) {
          if (index > -1) {
            this.allAdjustChargesData.splice(index, 1);
          }
        }
        else {

          var isAutoAdded;

          if (elementvalue.materialID > 0) {
            isAutoAdded = this.defaultContractChargesData.find(x => x.materialID == elementvalue.materialID && x.chargeID == elementvalue.chargeID);
          }
          else  {
            isAutoAdded = this.defaultContractChargesData.find(x => x.materialID == null && x.chargeID == elementvalue.chargeID);
          }

          if (isAutoAdded != undefined && !isForciable) {
            this.toastrService.info("You can't remove this element, we can set only this chagres as 0.");
            this.allAdjustChargesData[index].isEdited = true;
            this.allAdjustChargesData[index].isAutoAddedExclude = true;
            this.allAdjustChargesData[index].amount = 0;
            this.allAdjustChargesData[index].overrideAmount = 0;
            this.allAdjustChargesData[index].fullAmount = 0;
            this.allAdjustChargesData[index].rateValue = 0;
            this.allAdjustChargesData[index].overrideRateValue = 0;

          }
          else if (elementvalue.materialID <= 0 && isAutoAdded == undefined)
          {
            this.allAdjustChargesData.splice(index, 1);
          }
          else {
            this.toastrService.warning(GlobalConstants.NotRemoved);

          }

        }


        var totalMaterialQuanity: number = 0;

        this.MaterialDetails.forEach((value, index) => {
          totalMaterialQuanity = totalMaterialQuanity + (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity));
        });

        this.allAdjustChargesData.forEach((value, index) => {

          if ((value.materialID <= 0 || value.materialID == null) && value.chargeID > 0) {


            if (!value.isAutoAddedExclude) {

              value.amount = this.CalculatePerRowCharges(value, Number(totalMaterialQuanity));
              value.fullAmount = value.amount + value.overrideAmount;
            }
            else {
              value.amount = value.amount;
              value.overrideAmount = value.amount;
              value.fullAmount = value.fullAmount;
            }
          }
        });

      }
    });

    this.calculatetotalAmount();

    //this.reCalculateAllOrder();

  }

  //this method add material manually into grid source.so we don't need to check default values which is set by contract.
  AddEditMaterialInAdjustCharges(materialId: number, materialName: string, quantity: number, ChargeID: number, ChargeName: string,
    RateTypeID: number, RateTypeName: string, RateValue: any, PriceMethodID: number, PriceMethodName: string,
    CommodityID: number, CommodityName: string, ShowOnBOL: boolean, AdjustmentAmount: number, isMaterial: boolean, isChargeOnly: boolean, EquipmentID: number, ChargeUnit: number
  ) {


    var materialList: any = [];

    this.allAdjustChargesData.forEach((value, index) => {


      if (value.type == GlobalConstants.MaterialItem) {
        materialList.push({
          MaterialID: Number(value.materialID),
          Quantity: (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.orderQuantity)),
          ChargeID: Number(value.chargeID)
        });
      }
    });

    if (materialId > 0 && isMaterial == true) {
      var materialIndex: number = -1;
      materialList.forEach((value, index) => {
        if (value.MaterialID == Number(materialId) && materialIndex == -1) {
          materialIndex = index;
        }
      });


      if (materialIndex > -1) {
        materialList[materialIndex].quantity = Number(quantity);
      }
      else {

        materialList.push({
          MaterialID: Number(materialId),
          Quantity: Number(quantity),
          ChargeID: Number(ChargeID)
        });
      }
    }


    this.AddEditMaterialInAdjustChargesUpdater(materialId, materialName, quantity, ChargeID, ChargeName,
      RateTypeID, RateTypeName, RateValue, PriceMethodID, PriceMethodName,
      CommodityID, CommodityName, ShowOnBOL, AdjustmentAmount, isMaterial, isChargeOnly, EquipmentID, ChargeUnit);
    this.calculatetotalAmount();

  }



  clearPreviousValues() {

    if (this.allAdjustChargesData != undefined && this.allAdjustChargesData.length > 0) { this.allAdjustChargesData.splice(0, this.allAdjustChargesData.length); }
    if (this.defaultContractChargesData != undefined && this.defaultContractChargesData.length > 0) { this.defaultContractChargesData.splice(0, this.defaultContractChargesData.length); }

  }


  private AddEditMaterialInAdjustChargesUpdater(materialId: number, materialName: string, quantity: number, ChargeID: number, ChargeName: string,
    RateTypeID: number, RateTypeName: string, RateValue: any, PriceMethodID: number, PriceMethodName: string,
    CommodityID: number, CommodityName: string, ShowOnBOL: boolean, AdjustmentAmount: number, isMaterial: boolean, isChargeOnly: boolean, EquipmentID: number, ChargeUnit: number
  ) {

    quantity = 0;
    if (materialId != undefined && materialId > 0) {
      this.MaterialDetails.forEach((value, index) => {
        if (value.materialID == materialId) {
          quantity = (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity))
        }
      });
    }
    else {
      quantity = 0;
      this.MaterialDetails.forEach((value, index) => {
        quantity = quantity + (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity))
      });
    }


    var materialExisting = this.editIndex > -1 ? this.allAdjustChargesData[this.editIndex] : this.allAdjustChargesData.find(x => x.materialID == materialId && x.chargeID == ChargeID);

    if (materialExisting != undefined && materialExisting != null) {
      materialExisting.chargeID = Number(ChargeID);
      materialExisting.chargeName = ChargeName;
      if (Number(materialId) > 0) {
        materialExisting.materialName = materialExisting.materialID != materialId ? materialName : materialExisting.materialName;
      }
      else {
        materialExisting.materialName = "";
      }

      materialExisting.materialID = Number(materialId);
      if (this.IsShipmentCreated) {
        materialExisting.shippedQuantity = Number(quantity);
      }
      else {
        materialExisting.orderQuantity = Number(quantity);
      }
     
      materialExisting.overrideRateValue = Number(RateValue);
      materialExisting.overrideShowOnBOL = ShowOnBOL;
      materialExisting.type = isMaterial ? GlobalConstants.MaterialItem : (isChargeOnly ? '' : GlobalConstants.PackageItem);
      materialExisting.chargeUnit = Number(ChargeUnit);


      if (Number(materialExisting.commodityID) != Number(CommodityID)) {
        materialExisting.overrideCommodityID = Number(CommodityID);
        materialExisting.overrideCommodityName = CommodityName;

      }

      if (Number(materialExisting.priceMethodID) != Number(PriceMethodID)) {
        materialExisting.overridePriceMethodID = Number(PriceMethodID);
        materialExisting.overridePriceMethodName = PriceMethodName;

      }

      if (materialExisting.rateTypeID != RateTypeID) {
        materialExisting.overrideRateTypeID = Number(RateTypeID);
        materialExisting.overrideRateTypeName = RateTypeName;

      }

      materialExisting.amount = this.CalculatePerRowCharges(materialExisting, (this.IsShipmentCreated ? Number(materialExisting.shippedQuantity) : Number(materialExisting.orderQuantity)));




      materialExisting.overrideAmount = Number(AdjustmentAmount);

      if (this.OrderTypeCode == GlobalConstants.CustomerReturn) {
       // materialExisting.amount = (-1) * newChargesAdd.amount;
      }

      materialExisting.fullAmount = Number(materialExisting.amount) + Number(materialExisting.overrideAmount);

      materialExisting.isAutoAddedExclude = false;
    }
    else {

      var newChargesAdd = new AdjustChargesModel();
      newChargesAdd.type = isMaterial ? GlobalConstants.MaterialItem : (isChargeOnly ? '' : GlobalConstants.PackageItem);
      newChargesAdd.materialID = Number(materialId);

      if (Number(materialId) > 0) {
        newChargesAdd.materialName = materialName;
      }

      newChargesAdd.chargeID = Number(ChargeID);
      newChargesAdd.chargeName = ChargeName;
      newChargesAdd.isManual = true;
      newChargesAdd.commodityID = Number(CommodityID);
      newChargesAdd.commodityName = CommodityName;
      newChargesAdd.orderQuantity = Number(quantity);
      newChargesAdd.rateTypeID = Number(RateTypeID);
      newChargesAdd.rateTypeName = RateTypeName;
      newChargesAdd.priceMethod = PriceMethodName;
      newChargesAdd.priceMethodID = Number(PriceMethodID);
      newChargesAdd.rateValue = Number(RateValue);
      newChargesAdd.isEdited = true; // for skipping the update value from latest contract.
      newChargesAdd.showOnBOL = ShowOnBOL;
      newChargesAdd.overrideShowOnBOL = ShowOnBOL;
      newChargesAdd.shippedQuantity = 0;
      newChargesAdd.chargeUnit = ChargeUnit;
      if (AdjustmentAmount > 0) {
        newChargesAdd.amount = AdjustmentAmount;
      }
      else {

        newChargesAdd.amount = this.CalculatePerRowCharges(newChargesAdd, (this.IsShipmentCreated ? Number(newChargesAdd.shippedQuantity) : Number(newChargesAdd.orderQuantity)));


      }

      if (this.OrderTypeCode == GlobalConstants.CustomerReturn) {
       // newChargesAdd.amount = (-1) * newChargesAdd.amount;
      }

      newChargesAdd.fullAmount = newChargesAdd.amount + newChargesAdd.overrideAmount;
      newChargesAdd.isAutoAddedExclude = false;
      this.allAdjustChargesData.push(newChargesAdd);
    }

    this.toastrService.info(GlobalConstants.AdjustmentChargesUpdate);
  }

  AddEditMaterialUnSubscribe() {
    this.addEditAdjustmentCharges.unsubscribe();
  }

  public calculatetotalAmount() {

    this.TotalAmount = 0;
    if (this.allAdjustChargesData != undefined && this.allAdjustChargesData != null && this.allAdjustChargesData.length > 0) {
      // Calculate percentage amount
      this.allAdjustChargesData.forEach((value, index) => {
        if (value.rateTypeName == GlobalConstants.PercentageAmount) {
          value.amount = Number(this.CalculatePerRowCharges(value, 0));
          value.fullAmount = Number(value.amount) + Number(value.overrideAmount);

        }

      });


      this.allAdjustChargesData.forEach((value, index) => {

        if (value.type != GlobalConstants.PackageItem && value.priceMethod == GlobalConstants.Billable) {

          this.TotalAmount = this.TotalAmount + Number(value.fullAmount);
        }
      });
    }
  }

  CalculatePerRowCharges(data: AdjustChargesModel, quantity = 0): number {

    var CalculateData: CalculationAmountVM = new CalculationAmountVM();

    CalculateData.Quantity = Number(quantity);
    CalculateData.RateTypeName = (data.overrideRateTypeName != undefined && data.overrideRateTypeName.length > 1 ? data.overrideRateTypeName : data.rateTypeName);
    CalculateData.RateValue = Number(data.overrideRateValue != 0 ? data.overrideRateValue : data.rateValue);
    CalculateData.ChargeUnit = Number(data.chargeUnit);
    var totalPallets = 0;
    
   
    if (data.materialID != undefined && data.materialID > 0) {
      

      this.MaterialDetails.forEach((value, index) => {

        if (Number(value.materialID) == Number(data.materialID)) {
          CalculateData.TotalQuantity = Number(value.quantity);
          CalculateData.TotalPallets = Number(value.pallets == undefined ? value.Pallets : value.pallets);

          if (CalculateData.Quantity == 0) {
            CalculateData.Quantity = this.IsShipmentCreated ? Number(value.shippedQuantity) :  Number(value.quantity);
          }
        }
        
      });

    }
    else if (data.materialID == undefined || (data.materialID != undefined && data.materialID <= 0) || data.materialID == null) {
      var totalQuantity = 0;
      this.MaterialDetails.forEach((value, index) => {
        
        totalQuantity = totalQuantity + (this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity));
      });
      CalculateData.TotalQuantity = totalQuantity;
      
      CalculateData.Quantity = totalQuantity;
    }
    CalculateData.MaxPallets = this.MaxPalletSize;
    CalculateData.TotalAmount = 0;
    this.allAdjustChargesData.forEach((value, index) => {
      if (value.rateTypeName != GlobalConstants.PercentageAmount) {
        CalculateData.TotalAmount = CalculateData.TotalAmount + value.fullAmount;
      }
    });

    this.ShippingMaterialDetails.forEach((value,index) => {
      totalPallets = totalPallets + Number(this.IsShipmentCreated ? Number(value.shippedQuantity) : Number(value.quantity));
    });

    

    CalculateData.TotalPallets = totalPallets + Number(this.NPMIPallets != undefined ? this.NPMIPallets : 0);

    /************** For DOE Charegs Calculation ********************************/
    CalculateData.PerMileCharge = this.PerMileCharge;
    CalculateData.ChargeRatePerMile = this.ChargeRatePerMile;
    CalculateData.PassthrowPercentage = this.PassthrowPercentage;
    /**************************************************************************/

    if (this.OrderTypeCode == GlobalConstants.CustomerReturn || this.OrderTypeCode == GlobalConstants.ChargeOrder) {
      CalculateData.TotalAmount = (-1) * CalculateData.TotalAmount;
    }

    var calculatedAmount = this.orderCommonService.calculateAmount(CalculateData);

    if (this.OrderTypeCode == GlobalConstants.CustomerReturn || this.OrderTypeCode == GlobalConstants.ChargeOrder) {
      calculatedAmount = (-1) * calculatedAmount;
    }

    return calculatedAmount;
  }


  reModifyExistingCharges() {

    var totalChargeAmount = 0;
    this.allAdjustChargesData.forEach((value, index) => {
      if (value.rateTypeName != GlobalConstants.PercentageAmount) {
        value.amount = Number(this.CalculatePerRowCharges(value, 0));

        value.fullAmount = Number(value.amount) + Number(value.overrideAmount);

        totalChargeAmount = totalChargeAmount + Number(value.fullAmount);
      }
      
    });

   

    this.calculatetotalAmount();
  }


  AddExistingMaterial(materialid: number,quantity:number) {
    if (this.defaultContractChargesData != null && this.defaultContractChargesData.length > 0) {
      var materialsData = this.defaultContractChargesData.filter(x => x.materialID == materialid);

      if (materialsData != undefined && materialsData.length > 0) {
        materialsData.forEach((matData, index) => {
          var selectedElementNotExistsIntoGrid: AdjustChargesModel = JSON.parse(JSON.stringify(matData));



          selectedElementNotExistsIntoGrid.amount = this.CalculatePerRowCharges(selectedElementNotExistsIntoGrid, Number(quantity));
          selectedElementNotExistsIntoGrid.fullAmount = selectedElementNotExistsIntoGrid.amount ;
          selectedElementNotExistsIntoGrid.overrideShowOnBOL = selectedElementNotExistsIntoGrid.showOnBOL;
          this.allAdjustChargesData.push(selectedElementNotExistsIntoGrid);
        });

      }

    }
  }

}
