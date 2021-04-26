import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-setupfilter-ddownload-reports',
  templateUrl: './setupfilter-ddownload-reports.component.html',
  styleUrls: ['./setupfilter-ddownload-reports.component.css']
})
export class SetupfilterDdownloadReportsComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";
  date6: Date;
  required1 = true;

  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;
  constructor(public activeModal: NgbActiveModal) { }

  @Input() filterSettings: string;

  ngOnInit(): void {
    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: false,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      searchBy: ['itemName']
      //disabled: true
    };

  }

  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

}
