import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ViewItemComponent } from './view-item/view-item.component';
import { Contract } from '../../../../../../core/models/contract.model';
import { ContractService } from '../../../../../../core/services/contract.service';
import { AuthService } from '../../../../../../core/services';


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
  object: Contract = new Contract();
  ContractDescription = [];
  settingsCharge = {};
  selectedContract = [];
  constructor(private authService: AuthService, private contractService: ContractService) { }

  ContractTypeId: number;
  @Input() savedData: any;

  @ViewChild('ViewItem') ViewItem: ViewItemComponent;
  //@ViewChild(AddItemComponent) addItem: AddItemComponent;
  ngOnInit(): void {
      // for searchable dropdown
   
   
    setTimeout(() => {      
      this.object.ClientId = this.authService.currentUserValue.ClientId;
      this.savedData2 = this.savedData;
      if (this.savedData != null) {

       // this.ViewItem.FillData();
        this.contractService.LocationID = this.contractService.savedData.locationId;
        this.getContractList();
      }
    }, 5000);
   
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
  onDeSelectAll(items: any) { }

  setChargeList() {
    debugger;
    //this.addItem.ContractTypeId = this.ContractTypeId;
    //this.addItem.getChargeDescription();
  }

  getContractList() {
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.object.LocationID = this.contractService.LocationID;
    this.contractService.getContractList(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          var data = res.data;
          this.ContractDescription = data.map(r => ({ id: r.locationID, itemName: r.contract_No }));
          this.ContractDescription = this.ContractDescription.filter(
            (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
          );
          
          this.settingsCharge = {
            singleSelection: true,
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1,
            classes: 'right'
          };
        }
      });
  }
}
