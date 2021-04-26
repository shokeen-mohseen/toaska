import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apt-processing-filter',
  templateUrl: './apt-processing-filter.component.html',
  styleUrls: ['./apt-processing-filter.component.css']
})
export class AptProcessingFilterComponent implements OnInit {
 
  panelOpenState = false;
  constructor() { }

  itemListA = [];

  selectedItemsA = [];
  settingsA = {};

  count = 3;
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];


    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
}
