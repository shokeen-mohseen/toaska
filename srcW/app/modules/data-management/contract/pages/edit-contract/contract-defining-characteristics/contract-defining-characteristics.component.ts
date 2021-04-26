import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ResizeEvent } from 'angular-resizable-element';
import { Contract, DefineCharacteristics, ContractViewModel } from '@app/core/models/contract.model';
import { AuthService } from '@app/core/services';
import { ContractService } from '@app/core/services/contract.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteTabledataPopupComponent } from '@app/shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

@Component({
  selector: 'app-contract-defining-characteristics',
  templateUrl: './contract-defining-characteristics.component.html',
  styleUrls: ['./contract-defining-characteristics.component.css']
})
export class ContractDefiningCharacteristicsComponent implements OnInit {
  modalRef: NgbModalRef;
  object: Contract = new Contract();
  ContractViewModel: ContractViewModel = new ContractViewModel();
  UomList = [];
  itemListA = [];
  settingsA = {};
  selectedItemsA = [];
  count = 3;
  ELEMENT_DATA: PeriodicElement[] = [];
  ELEMENT_DATA1: PeriodicElement[] = [];
  tempGridData: PeriodicElement[] = [];
  //material table code

  displayedColumns = ['selectRow', 'Description', 'Value', 'UOM'];
 
  displayedColumnsReplace = ['selectRow', 'key_Name', 'key_Value', 'key_UOM'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  displayedColumns1 = ['Description', 'Value', 'UOM'];
  displayedColumnsReplace1 = ['key_Description', 'key_Value', 'key_UOM'];
  dataSource1 = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA1);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() savedData: any;
 

  ngAfterViewInit() {
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
  selectRow: any;
  Value: any;
  UOM: any;

  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }

  constructor(private toastrService: ToastrService, private router: Router, public modalService: NgbModal, private authService: AuthService, private contractService: ContractService) { }

  /*editDefinechar() {
    this.modalRef = this.modalService.open(EditDefineCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
  }*/
  ngOnInit(): void {
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.getUomList();
    this.getCharacteristics();
    this.selectRow = 'selectRow';
    this.Value = 'Value';
    this.UOM = 'UOM';
    setTimeout(() => {
      if (this.savedData != null) {
        this.fillData();
      }
    }, 5000);
  }

  fillData() {
    
    this.ContractViewModel.ClientID = this.authService.currentUserValue.ClientId;
    this.ContractViewModel.ID = Number(this.savedData.id);
    this.ContractViewModel.ContractTypeId = Number(this.savedData.contractTypeId);
    this.contractService.GetDefineCharacteristics(this.ContractViewModel)
      .subscribe(res => {
        if (res.message == "Success") {
         
          //this.ELEMENT_DATA1 = [];
          var returnData = [];
          res.data.forEach((value, index) => {
            returnData.push({ Id: value.id, EntityId: value.entityPropertyId, Code: this.ELEMENT_DATA1[index].Code, Description: this.ELEMENT_DATA1[index].Description, Value: value.propertyValue, UOM: value.propertiesUom });
          });
          this.ELEMENT_DATA = [];
          returnData.forEach((value, index) => {
            this.ELEMENT_DATA.push({ Id: value.Id, EntityId: value.EntityId, Code: value.Code, Description: value.Description, Value: value.Value, UOM: value.UOM });
            
            if (value.EntityId == this.ELEMENT_DATA1[index].EntityId) {
              this.ELEMENT_DATA1[index].Id = value.Id;
              this.ELEMENT_DATA1[index].Value = value.Value;
              this.ELEMENT_DATA1[index].UOM = value.UOM;
            }
          });

          //this.dataSource1 = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
          //this.dataSource1.data = this.ELEMENT_DATA;
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
          this.dataSource.data = this.ELEMENT_DATA;
          this.tempGridData = this.ELEMENT_DATA;        
          
        }
      });
  }

  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    this.filterData();
  }
  OnItemDeSelect(item: any) {
    this.filterData();
  }
  onSelectAll(items: any) {
    this.filterData();
  }
  onDeSelectAll(items: any) {
    this.filterData();
  }

  RemoveItem() {
    var SendObject = [];
    var data = this.selection.selected;
    if (data.length > 0) {
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        for (let i = 0; i < data.length; i++) {
          let models = new DefineCharacteristics();
          models.Id = data[i].Id;
          models.ContractTypeId = Number(this.savedData.contractTypeId);
          models.EntityPropertyId = data[i].EntityId;
          SendObject.push(models);
        }
        this.contractService.DeleteDefiningCharacteristics(SendObject)
          .subscribe(res => {
            if (res.message == "Success") {
              this.toastrService.success("Data is deleted.");
              this.tempGridData = this.tempGridData.filter(x => !data.includes(x));
              this.dataSource = new MatTableDataSource<PeriodicElement>(this.tempGridData);
              this.dataSource.data = this.tempGridData;
            }
          });
      }, (reason) => {
      });
    }
    else {
      this.toastrService.warning('Please Select At least One data');
      return;
    }
  }
  getUomList() {
    this.contractService.getUomList(this.object)
      .subscribe(res => {
        if (res.message == "Success") {
          this.UomList = res.data;
        }
      });
  }
  filterData() {
    if (this.selectedItemsA.length == 0) {
      this.tempGridData = this.ELEMENT_DATA;
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.tempGridData);
      this.dataSource.data = this.tempGridData;
    }
    else {
      var Ids = this.selectedItemsA.map(({ id }) => id)
      this.tempGridData = this.ELEMENT_DATA.filter(x => Ids.includes(x.EntityId));
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.tempGridData);
      this.dataSource.data = this.tempGridData;
    }

  }


  getCharacteristics() {
    this.contractService.getCharacteristics()
      .subscribe(res => {
        if (res.message == "Success") {
          res.data.forEach((value, index) => {
            this.ELEMENT_DATA1.push({ Id: 0, EntityId: value.EntityPropertyID, Code: value.PropertyCode,Description: value.PropertyDescription, Value: '', UOM: '' })
          })
          this.dataSource1 = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA1);
          this.dataSource1.data = this.ELEMENT_DATA1;          
          this.itemListA = res.data.map(r => ({ id: r.EntityPropertyID, itemName: r.PropertyDescription }));
          this.settingsA = {
          singleSelection: false,
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
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  SaveData(form: NgForm) {
    var Data = [];
    var length = this.ELEMENT_DATA1.length;
    for (let i = 0; i < length; i++) {
      let models = new DefineCharacteristics();
      models.Id = this.ELEMENT_DATA1[i].Id;
      var contractType = Number(this.savedData.contractTypeId);
      models.ContractTypeId = contractType;
      if (contractType == 1 || contractType == 2 || contractType == 3) {
        models.CustomerContractId = Number(this.savedData.id);
      }
      else {
        models.BusinessPartnerContractId = Number(this.savedData.id);
      }
      models.EntityPropertyId = this.ELEMENT_DATA1[i].EntityId;
      models.PropertyValue = form.controls["txtValue" + i].value;
      if (i == 3) {
        models.PropertiesUom = form.controls["txtUOM" + i].value;
      }
      models.IsDeleted = false;
      models.ClientId = this.authService.currentUserValue.ClientId;
      models.CreatedBy = this.authService.currentUserValue.LoginId;
      models.CreateDateTimeBrowser = new Date(new Date().toISOString());
      models.UpdateDateTimeBrowser = new Date(new Date().toISOString());
      Data.push(models);
    }
    this.contractService.SaveDefineCharacteristics(Data)
      .subscribe(res => {
        if (res.message == "Success") {
          this.toastrService.success("Define Characteristics saved");
          //this.ELEMENT_DATA1 = [];
          var returnData = [];
          res.data.forEach((value, index) => {
            returnData.push({ Id: value.id, EntityId: value.entityPropertyId, Code: this.ELEMENT_DATA1[index].Code, Description: this.ELEMENT_DATA1[index].Description, Value: value.propertyValue, UOM: value.propertiesUom });
          });
          this.ELEMENT_DATA = [];
          returnData.forEach((value, index) => {
            this.ELEMENT_DATA.push({ Id: value.Id, EntityId: value.EntityId, Code: value.Code, Description: value.Description, Value: value.Value, UOM: value.UOM })
          });
          this.dataSource1 = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
          this.dataSource1.data = this.ELEMENT_DATA;
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
          this.dataSource.data = this.ELEMENT_DATA;
          this.tempGridData = this.ELEMENT_DATA;
        }
      });
  }
}

//export interface PeriodicElement {
//  //Id: number;
//  Name: string;
//  Value: string;
//  UOM: string;
//}
//const ELEMENT_DATA: PeriodicElement[] = [
//  { Name: 'Evergreen', Value: 'Yes', UOM: 'Percent' },
//  { Name: '	Contract Category', Value: 'Exclusive', UOM: '' },
//  { Name: 'Price Increase', Value: '4', UOM: '1' },
//  { Name: '	Auto-Renewal Notification', Value: 'Days 120', UOM: 'Percent' }
//];

export interface PeriodicElement {
  Id: number;
  EntityId: number;
  Code: string;
  Description: string;
  Value: string;
  UOM: string;
}
//const ELEMENT_DATA1: PeriodicElement1[] = [
  //{ Description: 'Auto-Renewal Notification Days', Value: '', UOM: '' },
  //{ Description: 'Contract Category', Value: '', UOM: '' },
  //{ Description: 'Evergreen', Value: '', UOM: '' },
  //{ Description: 'Price Increase', Value: '', UOM: '' }
//];
