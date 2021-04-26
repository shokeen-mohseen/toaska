import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-filter-order-history',
  templateUrl: './filter-order-history.component.html',
  styleUrls: ['./filter-order-history.component.css']
})
export class FilterOrderHistoryComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";

  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };
  constructor(private router: Router) { }
  skills: '';
  skill: '';
  skill1: '';
  skill2: '';
  skill3: '';
  skill4: '';
  skill5: '';
  skill6: '';
  skill7: '';
  skill8: '';
  skill9: '';
  skill10: '';
  skill11: '';
  skill12: '';

  selectedItems = [];
  itemList = [];

  settings = {};

  selectedItemsCheck = [];
  itemListCheck = [];
  settingsCheck = {};

  count = 3;


  ngOnInit(): void {
    // for searchable dropdown
    this.itemList = [
      { "id": 1, "itemName": "option1" },
      { "id": 2, "itemName": "option2" },
      { "id": 3, "itemName": "option3" },
      { "id": 4, "itemName": "option4" },
      { "id": 5, "itemName": "option5" },
      { "id": 6, "itemName": "option6" }
    ];
    this.selectedItems = [];

    this.settings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 1
    };
    // for checkbox with multiselect
    this.itemListCheck = [
      { "id": 1, "itemName": "option11" },
      { "id": 2, "itemName": "option22" },
      { "id": 3, "itemName": "option33" },
      { "id": 4, "itemName": "option44" },
      { "id": 5, "itemName": "option55" },
      { "id": 6, "itemName": "option66" }
    ];
    this.selectedItemsCheck = [];
    this.settingsCheck = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2
    };

    // searchable dropdown end

  }//init() end
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onAddItemCheck(data: string) {
    this.count++;
    this.itemListCheck.push({ "id": this.count, "itemName": data });
    this.selectedItemsCheck.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

}
