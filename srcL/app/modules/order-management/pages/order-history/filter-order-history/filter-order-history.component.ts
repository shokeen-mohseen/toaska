import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderHistoryService } from '../../../../../core/services/order-history.service';
import { CommonOrderModel, OrderWorkbenchFilterModal } from '../../../../../core/models/regularOrder.model';
import { UserRolesListViewModel } from '../../../../../core';
import { ToastrService } from 'ngx-toastr';
import { OrderHistoryListComponent } from '../order-history-list/order-history-list.component';
@Component({
  selector: 'app-filter-order-history',
  templateUrl: './filter-order-history.component.html',
  styleUrls: ['./filter-order-history.component.css']
})
export class FilterOrderHistoryComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";

  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };
  constructor(private router: Router, private orderHistoryService: OrderHistoryService, private toastrService: ToastrService, private orderHistoryListComponent: OrderHistoryListComponent) { }

  //Globle Filter
  //UOMData: any;
  //SelectUOM: number;
  //Equipmentvalidate: boolean;
  //Ordervalidate: boolean;
  //NewOrder: number;
  OrderTypeData: string[] = [];
  CarrierData: string[] = [];
  OrderStatusData = [];
  ShipFromTypeList = [];
  ShipToTypeList = [];
  OrderConditionDataList: any = [];
  commonOrderModel: CommonOrderModel = new CommonOrderModel();
  userRolesListViewModel: UserRolesListViewModel = new UserRolesListViewModel();
  orderHistoryFilterModal: OrderWorkbenchFilterModal = new OrderWorkbenchFilterModal();
  AllVersionDataList = [{ id: 0, name: 'All Version' }, { id: 1, name: 'Latest Version' }];
  ShipFromList = [];
  ShipFromListTemp = [];
  MaterialData: any[] = [];
  ShipToList = [];
  ShipToListTemp = [];
  SourceData = [];
  InvoiceNoList = [];
  SalesManagersData: string[] = [];


  //skills: '';
  //skill: '';
  //skill1: '';
  //skill2: '';
  //skill3: '';
  //skill4: '';
  //skill5: '';
  //skill6: '';
  //skill7: '';
  //skill8: '';
  //skill9: '';
  //skill10: '';
  //skill11: '';
  //skill12: '';

  //selectedItems = [];
  //itemList = [];

  settings = {};

  //selectedItemsCheck = [];
  //itemListCheck = [];
  //settingsCheck = {};

  //count = 3;


  ngOnInit(): void {
    this.BindPreLoadDataOnPage();
    //// for searchable dropdown
    //this.itemList = [
    //  { "id": 1, "itemName": "option1" },
    //  { "id": 2, "itemName": "option2" },
    //  { "id": 3, "itemName": "option3" },
    //  { "id": 4, "itemName": "option4" },
    //  { "id": 5, "itemName": "option5" },
    //  { "id": 6, "itemName": "option6" }
    //];
    //this.selectedItems = [];

    this.settings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 1,
      searchBy: ['itemName']
    };
    // for checkbox with multiselect
    //this.itemListCheck = [
    //  { "id": 1, "itemName": "option11" },
    //  { "id": 2, "itemName": "option22" },
    //  { "id": 3, "itemName": "option33" },
    //  { "id": 4, "itemName": "option44" },
    //  { "id": 5, "itemName": "option55" },
    //  { "id": 6, "itemName": "option66" }
    //];
    //this.selectedItemsCheck = [];
    //this.settingsCheck = {
    //  singleSelection: false,
    //  text: "Select",
    //  selectAllText: 'Select All',
    //  unSelectAllText: 'UnSelect All',
    //  enableSearchFilter: true,
    //  badgeShowLimit: 2,
    //  searchBy: ['itemName']
    //};

    // searchable dropdown end

  }//init() end
  //onAddItem(data: string) {
  //  this.count++;
  //  this.itemList.push({ "id": this.count, "itemName": data });
  //  this.selectedItems.push({ "id": this.count, "itemName": data });
  //}
  //onAddItemCheck(data: string) {
  //  this.count++;
  //  this.itemListCheck.push({ "id": this.count, "itemName": data });
  //  this.selectedItemsCheck.push({ "id": this.count, "itemName": data });
  //}

  //onItemSelect(item: any) {
  //  console.log(item);
  //}
  //OnItemDeSelect(item: any) {
  //  console.log(item);
  //}
  //onSelectAll(items: any) {
  //  console.log(items);
  //}
  //onDeSelectAll(items: any) {
  //  console.log(items);
  //}


  //Globle Filter Start
  BindPreLoadDataOnPage() {

    this.OrderTypeData = [];
    this.orderHistoryService.OrderTypeList().pipe()
      .subscribe(
        result => {
          var datas = result.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.OrderTypeData.push(value));
        });
    this.orderHistoryService.CarrierListAll()
      .subscribe(
        data => {
          var datas = data.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.CarrierData.push(value));
        });
    this.userRolesListViewModel.clientId = parseInt(localStorage.clientId);
    this.userRolesListViewModel.userId = parseInt(localStorage.userId);
    this.BindSalesManagersList(this.userRolesListViewModel);
    this.GetStatus();
    this.getShipFromType();
    this.OrderConditionList();
    this.getShipToType();
    this.BindAllFromShipLocation(1);
    this.bindDataForShipToType(6);
    this.BindMaterialList();
    this.getAllInvoiceNo();
    this.getSourceDataList();
  }

  GetStatus() {
    this.OrderStatusData = [];
    this.orderHistoryService.OrderStatusAllList()
      .subscribe(
        data => {
          var datas = data.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.OrderStatusData.push(value));
        });
  }

  getShipFromType() {
    this.ShipFromTypeList = [];
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);
    this.orderHistoryService.ShipFromTypeAllData(this.commonOrderModel)
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

  OrderConditionList() {
    this.orderHistoryService.OrderConditionList()
      .subscribe(
        data => {
          var datas = data.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.OrderConditionDataList.push(value));
        });
  }

  getShipToType() {
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);
    this.ShipToTypeList = [];
    this.orderHistoryService.ShipToTypeAllData(this.commonOrderModel)
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

  BindAllFromShipLocation(LocationFunctionFromID) {
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);
    this.ShipFromList = [];
    this.orderHistoryService.ShipFromLocationAllData(this.commonOrderModel).pipe()
      .subscribe(result => {
        var datas = result.data;
        datas.map(item => {
          return {
            name: item.name,
            id: Number(item.id),
            locationFunctionID: item.locationFunctionID
          };
        }).forEach(value => this.ShipFromListTemp.push(value));
        // this.ShipFromListTemp = this.ShipFromList;
      });
  }

  bindDataForShipToType(shipto: number) {
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);
    this.orderHistoryService.ShipToLocationAllData(this.commonOrderModel)
      .subscribe(result => {
        var datas = result.data;
        this.ShipToList = [];
        datas.map(item => {
          return {
            name: item.name,
            id: Number(item.id),
            locationFunctionID: item.locationFunctionID
          };
        }).forEach(x => this.ShipToListTemp.push(x));
        //this.ShipToListTemp = this.ShipToList;
      });
  }

  BindMaterialList() {
    this.orderHistoryService.GetMaterialList()
      .subscribe(
        result => {
          var datas = result.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.MaterialData.push(value));
        }
      );
  }

  getAllInvoiceNo() {
    this.InvoiceNoList = [];
    this.orderHistoryService.InvoiceDataList(parseInt(localStorage.clientId))
      .subscribe(data => {
        var datas = data.data;
        datas.map(item => {
          return {
            name: item.InvoiceNo,
            id: Number(item.ID)
          };
        }).forEach(value => this.InvoiceNoList.push(value));
      });
  }

  getSourceDataList() {
    this.SourceData = [];
    this.orderHistoryService.SourceDataList(parseInt(localStorage.clientId))
      .subscribe(data => {
        var datas = data.data;
        datas.map(item => {
          return {
            name: item.Code,
            id: Number(item.Id)
          };
        }).forEach(value => this.SourceData.push(value));
      });
  }

  BindSalesManagersList(userRolesListViewModel: UserRolesListViewModel) {
    this.orderHistoryService.SalesManagersList("salesmanager")
      .subscribe(
        data => {
          var datas = data.Data;
          datas.map(item => {
            return {
              name: item.FirstName + " " + item.LastName,
              id: Number(item.Id)
            };
          }).forEach(value => this.SalesManagersData.push(value));
        });
  }

  onScheduledShipDateChange(args) {
    this.orderHistoryFilterModal.ScheduledShipDateN = args.value;
  }
  onReqDeliveryDateChange(args) {
    this.orderHistoryFilterModal.ReqDeliveryDateN = args.value;
  }
  onMustArriveByDateChange(args) {
    this.orderHistoryFilterModal.MustArriveByDateN = args.value;
  }

  ApplyGlobalFilter() {

    if (this.orderHistoryFilterModal.ScheduledShipDateN != undefined && this.orderHistoryFilterModal.ReqDeliveryDateN != undefined) {
      if (this.orderHistoryFilterModal.ScheduledShipDateN.length > 0 && this.orderHistoryFilterModal.ReqDeliveryDateN.length > 0) {
        if (new Date(this.orderHistoryFilterModal.ScheduledShipDateN[0]) >= new Date(this.orderHistoryFilterModal.ReqDeliveryDateN[0])) {
          this.toastrService.error("Scheduled ShipDate can not be greater then Request Delivery Date.");
          return;
        }
      }
    }

    this.orderHistoryListComponent.orderHistoryFilterModal = this.orderHistoryFilterModal;
    this.orderHistoryListComponent.getSalesOrderHistoryDataList();

  }

  ResetGlobalFilter() {
    this.orderHistoryFilterModal = new OrderWorkbenchFilterModal();
    this.orderHistoryFilterModal.ScheduledShipDateN = null;
    this.orderHistoryListComponent.orderHistoryFilterModal = this.orderHistoryFilterModal;
    this.orderHistoryListComponent.getSalesOrderHistoryDataList();
  }

  OnOrderTypeSelect(item: any) { }
  OnOrderTypeDeSelect(item: any) { }
  OnSalesManagersDeSelect(item: any) { }
  OnCarrierDeSelect(item: any) { }
  OnMaterialDeSelect(item: any) { }
  OnShipToDeSelect(item: any) { }
  OnShipToSelect(event) { }
  OnShipFromDeSelect(item: any) { }
  OnShipFromSelect(event) { }
  OnShipFromTypeDeSelect(item: any) {
    var tempArr = [];
    this.ShipFromList = [];
    //To DeSelect
    for (var i = 0; i < this.orderHistoryFilterModal.selectedShipFromTypeItems.length; i++) {
      for (var j = 0; j < this.ShipFromListTemp.length; j++) {
        if (this.ShipFromListTemp[j].locationFunctionID == this.orderHistoryFilterModal.selectedShipFromTypeItems[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipFromListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipFromListTemp[j]);
        }
      }
    }
    this.ShipFromList = [];
    this.ShipFromList = tempArr;    
  }

  OnShipFromTypeSelect(event) {
    var tempArr = [];
    //To filter ship from location in tha bases of selected ship type value
    for (var i = 0; i < this.orderHistoryFilterModal.selectedShipFromTypeItems.length; i++) {
      for (var j = 0; j < this.ShipFromListTemp.length; j++) {
        if (this.ShipFromListTemp[j].locationFunctionID == this.orderHistoryFilterModal.selectedShipFromTypeItems[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipFromListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipFromListTemp[j]);
        }
      }
    }
    this.ShipFromList = [];
    this.ShipFromList = tempArr;   
  }

  OnShipFromTypeSelectAll(items: any, str: any) {
    var tempArr = [];
    this.ShipFromList = [];
    //To All Select
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; j < this.ShipFromListTemp.length; j++) {
        if (this.ShipFromListTemp[j].locationFunctionID == items[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipFromListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipFromListTemp[j]);
        }
      }
    }
    this.ShipFromList = [];
    this.ShipFromList = tempArr;
  }
  OnShipFromTypeDeSelectAll(items: any) {
    this.ShipFromList = [];
    this.orderHistoryFilterModal.selectedShipFromItems = [];
  }

  OnShipToTypeDeSelect(item: any) {
    var tempArr = [];
    this.ShipToList = [];
    //To DeSelect
    for (var i = 0; i < this.orderHistoryFilterModal.selectedShipToTypeItems.length; i++) {
      for (var j = 0; j < this.ShipToListTemp.length; j++) {
        if (this.ShipToListTemp[j].locationFunctionID == this.orderHistoryFilterModal.selectedShipToTypeItems[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipToListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipToListTemp[j]);
        }
      }
    }
    this.ShipToList = [];
    this.ShipToList = tempArr;   
  }

  OnShipToTypeSelect(event) {
    var tempArr = [];
    this.ShipToList = [];
    //To filter ship to location in tha bases of selected ship type value
    for (var i = 0; i < this.orderHistoryFilterModal.selectedShipToTypeItems.length; i++) {
      for (var j = 0; j < this.ShipToListTemp.length; j++) {
        if (this.ShipToListTemp[j].locationFunctionID == this.orderHistoryFilterModal.selectedShipToTypeItems[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipToListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipToListTemp[j]);
        }
      }
    }
    this.ShipToList = [];
    this.ShipToList = tempArr;  
  }

  OnShipToTypeSelectAll(items: any) {
    var tempArr = [];
    this.ShipToList = [];
    //To All Select
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; j < this.ShipToListTemp.length; j++) {
        if (this.ShipToListTemp[j].locationFunctionID == items[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipToListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipToListTemp[j]);
        }
      }
    }
    this.ShipToList = [];
    this.ShipToList = tempArr;
  }
  OnShipToTypeDeSelectAll(items: any) {
    this.ShipToList = [];
    this.orderHistoryFilterModal.selectedShipToItems = [];
  }

  OnOrderConditionDeSelect(item: any) { }
  OnOrderConditionSelect(event) { }
  OnInvoiceNoDeSelect(item: any) { }
  OnInvoiceNoSelect(event) { }
  OnVersionDeSelect(item: any) { }
  OnVersionSelect(event) { }
  OnOrderStatusDeSelect(item: any) { }
  OnOrderStatusSelect(event) { }
  OnMaterialSelect(event) { }
  OnSalesManagersSelect(event) { }
  OnCarrierSelect(event) { }
  OnSourceSelect(event) { }
  OnSourceDeSelect(event) { }

}
