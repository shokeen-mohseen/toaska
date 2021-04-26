import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';

@Component({
  selector: 'app-upload-forecast',
  templateUrl: './upload-forecast.component.html',
  styleUrls: ['./upload-forecast.component.css']
})
export class UploadForecastComponent implements OnInit {

  itemListA = [];
  selectedItemsA = [];
  settingsA = {};
  count = 3;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    bsCustomFileInput.init();

    this.itemListA = [
      { "id": 1, "itemName": "Sheet Name" },
      { "id": 2, "itemName": "Sheet Name" },
      { "id": 3, "itemName": "Sheet Name" },
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
    this.selectedItemsA = item;

  }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }

}
