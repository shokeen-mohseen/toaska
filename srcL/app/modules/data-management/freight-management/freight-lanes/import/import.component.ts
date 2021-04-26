import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import { Observable } from 'rxjs';
import { FreightLaneService } from '@app/core/services/freightlane.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver'; 
import { FreightLane } from '../../../../../core/models/FreightLane.model';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  @ViewChild('fileInput') fileInput;  
  modalRef: NgbModalRef;
  //itemListA = [];
  selectedItemsA = [];
  settingsA = {};
  count = 3;
  title = 'read-excel-in-angular8';
  storeData: any;
  csvData: any;
  jsonData: any;
  textData: any;
  htmlData: any;
  fileUploaded: File;
  failRecords: number;
  successRecords: number;
  totalRecords: number;
  worksheet: any;
  itemListA = [];
  recordsFetched: boolean;
  constructor(private router: Router, public activeModal: NgbActiveModal, private freightLaneService: FreightLaneService, private toastrService: ToastrService, private authenticationService: AuthService) {
    this.itemListA= [{ id: "", name: "" }]}
  //allUsers: Observable<User[]>;  
  ngOnInit(): void {
    bsCustomFileInput.init();

    //this.itemListA = [
    //  { "id": 1, "itemName": "TOSCA_Carrier_Export_Rates" },
    //  { "id": 2, "itemName": "TOSCA_Carrier_Export_Rates" },
    //  { "id": 3, "itemName": "TOSCA_Carrier_Export_Rates" },
    //];
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey: ['name'],
       searchBy: ['name']
    };
  }
//btnImport() {
//  debugger;
//  let formData = new FormData();
//  formData.append('upload', this.fileInput.nativeElement.files[0])

//  this.freightLaneService.UploadExcel(formData).subscribe(result => {
//    //this.message = result.toString();
//    //this.loadAllUser();
//    this.toastrService.success("The excel is imported successfully");
//  });

//}
  //itemListA: [{ id: any, name: string }]
  btnImport()
  {
    if (this.fileUploaded != null) {
      if (this.selectedItemsA.length > 0)
      {
        const data = this.readExcel();
      }
      else {
        // const data = this.readExcel();
        this.toastrService.warning("please select sheet name to import.");
      }
    }
    else {
      // const data = this.readExcel();
      this.toastrService.warning("please select excel to import.");
    }
    
}
  btnBrowse(event: any) {
    this.itemListA = [];
    this.selectedItemsA = [];
    this.fileUploaded = event.target.files[0];
 
   // const data = this.readExcel();
      this.loadDropdown();
  
  }
  data: any;
  loadDropdown() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data1 = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data1.length; ++i) arr[i] = String.fromCharCode(data1[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
     // this.itemListA = workbook.SheetNames;
      for (var i = 0; i < workbook.SheetNames.length; i++)
      {

        this.itemListA[i] = 
          {
            id: i.toString(),
            name: workbook.SheetNames[i].toString()
          }
        
      }
      if (this.itemListA.length == 1)
      {
        var lista = this.itemListA.find(x => x.name == this.itemListA[0].name);
       // if (lista != null) {
          this.selectedItemsA[0] = lista;
       // }
       // this.selectedItemsA[0].name = first_sheet_name;
      }
      //this.worksheet = workbook.Sheets[first_sheet_name];

    
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  readExcel() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data1 = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data1.length; ++i) arr[i] = String.fromCharCode(data1[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      //var first_sheet_name = workbook.SheetNames[0];
      var first_sheet_name = this.selectedItemsA[0].name;
      this.itemListA = workbook.SheetNames;
      this.worksheet = workbook.Sheets[first_sheet_name];
    /* save data */
      let model = new FreightLane();
      model.updateDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
          
      model.updatedBy = this.authenticationService.currentUserValue.LoginId;
      this.data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(this.worksheet, { header: 1 }));
      if (this.data.length > 1)
      {
        if (this.data[1].length >= 1)
        {
      var check = this.data[1][0];
      if (check == "Tosca Data Extract")
      {
        if (this.data.length != 0) {
        this.freightLaneService.UploadExcel(this.data).subscribe(result => {
          this.recordsFetched = true;
          this.failRecords = result.data.failRecords;
          this.successRecords = result.data.successRecords;
          this.totalRecords = result.data.totalRecords;

          this.toastrService.success("The excel is imported successfully");
        });
        }
      }
      else {
        this.toastrService.error("Please select a valid excel");
      }
        }
      else {
        this.toastrService.error("Please select a valid excel");
      }
    }
      else
      {
        this.toastrService.error("Please select a valid excel");
         }
      //return data;
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }



 
 
onAddItemA(data: string) {
  this.count++;
  this.itemListA.push({ "id": this.count, "itemName": data });
  this.selectedItemsA.push({ "id": this.count, "itemName": data });
}

  onItemSelect(item: any) {
    //this.selectedItemsA = item;

  }
OnItemDeSelect(item: any) {}
onSelectAll(items: any) {}
onDeSelectAll(items: any) {}

}
