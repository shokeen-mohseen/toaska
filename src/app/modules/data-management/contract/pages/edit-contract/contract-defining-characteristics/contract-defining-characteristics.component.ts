import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ResizeEvent } from 'angular-resizable-element';
import { Contract, DefineCharacteristics, ContractViewModel,ContractCharacteriStics } from '@app/core/models/contract.model';
import { AuthService } from '@app/core/services';
import { ContractService } from '@app/core/services/contract.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteTabledataPopupComponent } from '@app/shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { debug } from 'console';
import { ContractCommonDataService } from '../../../../../../core/services/contract-common-data.service';

declare var $: any;

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
  Inactive: boolean;
  itemListA = [];
  settingsA = {};
  selectedItemsA = [];
  count = 3;
  ELEMENT_DATA: ContractCharacteriStics[] = [];
  ELEMENT_DATA1: ContractCharacteriStics[] = [];
  tempGridData: ContractCharacteriStics[] = [];
  //material table code
  //'selectRow',
  displayedColumns = ['selectRow','description', 'value', 'uom'];
  //'selectRow', 
  displayedColumnsReplace = ['selectRow','key_Name', 'key_Value', 'key_UOM'];
  dataSource = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA);
  selection = new SelectionModel<ContractCharacteriStics>(true, []);

  //displayedColumns1 = ['Description', 'Value', 'UOM'];
  displayedColumns1 = ['description', 'value', 'uom'];
  displayedColumnsReplace1 = ['key_Description', 'key_Value', 'key_UOM'];
  dataSource1 = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA1);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() savedData: any;

  public PropertyCounts() : number{
    return this.ELEMENT_DATA != undefined ? this.ELEMENT_DATA.length: 0;
  }
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

  constructor(private toastrService: ToastrService, private router: Router, public modalService: NgbModal, private authService: AuthService, private contractService: ContractService, private contractCommonData: ContractCommonDataService) { }

  ngOnInit(): void {
    this.object.ClientId = this.authService.currentUserValue.ClientId;
    this.Inactive = this.contractService.Permission ? false : true;
    this.getUomList();
    this.getCharacteristics();
    this.selectRow = 'selectRow';
    this.Value = 'Value';
    this.UOM = 'UOM';
  }

  
  modifycharacterstics() {
    var savedElementData = JSON.parse(JSON.stringify(this.ELEMENT_DATA1));
    this.ELEMENT_DATA1.splice(0, this.ELEMENT_DATA1.length);
    if (savedElementData.length > 0) { //&& this.ELEMENT_DATA.length > 0

      savedElementData.forEach((element, index) => {
        var propertyData = this.ELEMENT_DATA.find(x => x.code == element.code);

        if (propertyData != undefined) {
          if (propertyData.code == element.code) {
            element.value = propertyData.value == null ? '' : propertyData.value;
            element.uom = propertyData.uom == null ? '' : propertyData.uom;
          }
        }
        else {
          element.value ='';
          element.uom = '';

        }

      });
      this.ELEMENT_DATA1 = JSON.parse(JSON.stringify(savedElementData));
      this.dataSource1 = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA1);
      this.dataSource1.data = this.ELEMENT_DATA1;

    }

  }


  fillData() {
    if (this.contractService.ID == null || this.contractService.ID == 0) {
      this.ELEMENT_DATA = [];
      this.dataSource = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA);
      this.dataSource.data = this.ELEMENT_DATA;
      return false;
    }

    this.ELEMENT_DATA = this.contractCommonData.FinalContractData.contractCharacterstics;
    this.dataSource = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA );
    this.dataSource.data = this.ELEMENT_DATA ;
    this.tempGridData = this.ELEMENT_DATA;

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
   
    if (this.selection.selected.length > 0) {
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        

        this.selection.selected.forEach((value, index) => {

          var currentIndex = this.ELEMENT_DATA.findIndex(x => Number(x.entityId) == Number(value.entityId));
          this.ELEMENT_DATA.splice(currentIndex, 1);
        });
        this.selection.selected.splice(0, this.selection.selected.length);
        this.selection.clear();
        this.dataSource = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA);
        
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
      this.dataSource = new MatTableDataSource<ContractCharacteriStics>(this.tempGridData);
      this.dataSource.data = this.tempGridData;
    }
    else {
      var Ids = this.selectedItemsA.map(({ id }) => id)
      this.tempGridData = this.ELEMENT_DATA.filter(x => Ids.includes(x.entityId));
      this.dataSource = new MatTableDataSource<ContractCharacteriStics>(this.tempGridData);
      this.dataSource.data = this.tempGridData;
    }

  }


  getCharacteristics() {
    this.contractService.getCharacteristics()
      .subscribe(res => {
      
        if (res.message == "Success") {
          res.data.forEach((value, index) => {
            this.ELEMENT_DATA1.push({ selectRow : false , id: 0, entityId: value.EntityPropertyID, code: value.PropertyCode, description: value.PropertyDescription, value: '', uom: '' })
          })
       
          this.itemListA = res.data.map(r => ({ id: r.EntityPropertyID, itemName: r.PropertyDescription }));
          this.settingsA = {
            singleSelection: false,
            text: "Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1,
            searchBy: ['itemName'],            
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
  numberOnlyPrice(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) ) {
      return false;
    }
    return true;

  }

  validatePrice(quantity) {
    let isQuntityValid = false;
    if (!!quantity) {
      const re = /^-?[0-9]+(.[0-9]{1,2})?$/;
      isQuntityValid = !(re.test(quantity));
    }
    return isQuntityValid;
  }
  isValidInput: number;
  isValidated: number = 1;
  validation(event): boolean {
   
    let isValidated: boolean = true;
    if (this.validatePrice(event)) {
      this.isValidInput = 1;
      isValidated = false;
    } else {
      this.isValidInput = 0;
    }
    if (this.isValidInput === 0) {


      this.isValidated = 1;

    }
    else {
      this.isValidated = 0;
    }

    return isValidated;
  }


  SaveData(form: NgForm) {

    try {
      
      this.ELEMENT_DATA1.forEach((editElement, index) => {

        if (editElement.value != '') {
          var element = this.ELEMENT_DATA.find(x => x.code == editElement.code);

          if (element != undefined) {
            element.value = editElement.value;
            element.uom = editElement.uom;
          }
          else {
            editElement.id = 0;
            editElement.selectRow = '';
            this.ELEMENT_DATA.push(editElement);
          }
        }


      });

      this.contractCommonData.FinalContractData.contractCharacterstics = this.ELEMENT_DATA;

      this.dataSource = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA);

      this.toastrService.info("Define characteristics added.");

      $("#editDefine").modal('hide');
    }
    catch (e) {
      this.toastrService.error("Define characteristics not added.");
    }

    

  }

  clearAllCharacterstics() {
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA);

    //this.ELEMENT_DATA1 = [];
    //this.dataSource1 = new MatTableDataSource<ContractCharacteriStics>(this.ELEMENT_DATA1);
    this.ELEMENT_DATA1.forEach((editElement, index) => {
      editElement.value = '';
      editElement.uom = '';

    });
    this

    if (this.contractCommonData != undefined && this.contractCommonData.FinalContractData != undefined && this.contractCommonData.FinalContractData.contractCharacterstics != undefined) {
      this.contractCommonData.FinalContractData.contractCharacterstics = [];
    }
  }
}


