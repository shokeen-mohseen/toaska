import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ViewItemComponent } from './view-item/view-item.component';
import { ContractObjectViewModel } from '../../../../../../core/models/contract.model';
import { ContractService } from '../../../../../../core/services/contract.service';
import { AuthService } from '../../../../../../core/services';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
declare var $: any;

@Component({
  selector: 'app-contract-line-items',
  templateUrl: './contract-line-items.component.html',
  styleUrls: ['./contract-line-items.component.css']
})
export class ContractLineItemsComponent implements OnInit {
 

  itemListA = [];

  settingsA = {};

  selectedItemsA = [];
  savedData2: any;
  count = 3;
  object: ContractObjectViewModel = new ContractObjectViewModel();
  ContractDescription = [];
  settingsCharge = {};
  selectedContract = [];
  constructor(private authService: AuthService, private contractService: ContractService) { }
  ContractId: number;
  ContractTypeId: number;
  @Input() savedData: any;

  @ViewChild(ViewItemComponent) viewItem: ViewItemComponent;
  @ViewChild(AddItemComponent) addItem: AddItemComponent;
  @ViewChild(EditItemComponent) editItem: EditItemComponent;

  ngOnInit(): void {
      // for searchable dropdown
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    //setTimeout(() => {
      
    //  this.savedData2 = this.savedData;
    //  if (this.savedData != null) {

    //   // this.ViewItem.FillData();
    //    this.contractService.LocationID = this.contractService.savedData.locationId;
    //    this.ContractId = this.contractService.savedData.id;
    //    this.getContractList();
    //  }
    //}, 5000);
   
      // searchable dropdown end
  }//init() end

  //ngAfterViewInit() {
  //  this.ContractId = 
  //}
    onAddItemA(data: string) {
      this.count++;
      this.itemListA.push({ "id": this.count, "itemName": data });
      this.selectedItemsA.push({ "id": this.count, "itemName": data });
    }
  onItemSelect(item: any) {
    if (this.selectedContract.length > 0) {
      var cId = this.selectedContract.map(function (a) { return a["id"]; });
      this.addItem.FillDataByLocation(Number(cId));
    }
  }
  OnItemDeSelect(item: any) {
    if (this.selectedContract.length > 0) {
      var cId = this.selectedContract.map(function (a) { return a["id"]; });
      this.addItem.FillDataByLocation(Number(cId));
    }
  }
    onSelectAll(items: any) {
      if (this.selectedContract.length > 0) {
      var cId = this.selectedContract.map(function (a) { return a["id"]; });
      this.addItem.FillDataByLocation(Number(cId));
    }
  }
  onDeSelectAll(items: any) {
    this.addItem.FillDataByLocation(0);
  }

  setChargeList() {
   
    //this.addItem.ContractTypeId = this.ContractTypeId;
    //this.addItem.getChargeDescription();
  }
  setChildComponent(IsAdd:number = 0) {
   
   // this.editItem.FillData();
    this.addItem.FillData();
    this.viewItem.FillData();

    if (IsAdd == 1) {
      this.settingsCharge = {
        singleSelection: true,
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        searchBy: ['itemName'],
        classes: 'right',
        disabled: false
      };
    }
    else {
      this.settingsCharge = {
        singleSelection: true,
        text: "Select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        searchBy: ['itemName'],
        classes: 'right',
        disabled: true
      };
    }


  }
  openViewTable() {
    $("#view-tab").click();
  }
  displayeditlineitem() {
    this.editItem.FillData();

    this.settingsCharge = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      searchBy: ['itemName'],
      classes: 'right',
      disabled: true
    };
  }

  


  clearAllChildGrid() {
    
    this.addItem.clearAddItemContractLineItem();
    this.viewItem.clearContractLineItemViewGrid();
    this.editItem.clearEditLineitemGrid();
  }


  resetSelectedContractValue() {
    if (this.selectedContract != undefined && this.selectedContract.length > 0) { this.selectedContract.splice(0, this.selectedContract.length); }

  }

  getContractList() {
    if (this.contractService.ID == undefined || this.contractService.ID == null || this.contractService.ID == 0) {      
     // return false;

      this.contractService.ID = 0;
    }
    var contractType = this.contractService.ContractTypeId;
    this.object.ContractTypeId = contractType;
    this.object.Id = this.contractService.ID;
    this.object.LocationId = this.contractService.LocationID;
    this.contractService.GetChargesAndCharacteristicsFrom(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          var data = res.data;
          this.ContractDescription = data.map(r => ({ id: r.ID, itemName: r.Description }));
          this.settingsCharge = {
            singleSelection: true,
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            searchBy: ['itemName'],            
            classes: 'right',
            disabled : true
          };


          this.addItem.chargeBind();
        }
      });
  }
}
