import { Component, OnInit, ViewChild, Input, HostListener, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Options } from 'select2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '../../../../core';
import { MaterialService } from '../../../../core/services/material.service';
import { ToastrService } from 'ngx-toastr';
import { EquipmentTypeMaterialPropertyDetailModel, UOMModel, SaveUpdateEquipmentMaterialModel, commonModel } from '../../../../core/models/material.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-edit-equipment-material',
  providers: [DecimalPipe],
  templateUrl: './edit-equipment-material.component.html',
  styleUrls: ['./edit-equipment-material.component.css']
})
export class EditEquipmentMaterialComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  isSaving: boolean = true;
  @Input() dataToTakeAsInput: string;
  public options: Options;
  public exampleData: any;
  displayedColumns = ['Equipment', 'Characteristics', 'CharacteristicsValue', 'uom'];
  dataSource; //= new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<EquipmentTypeMaterialPropertyDetailModel>(true, []);
  settings = {};
  currentUser: User;
  equipmentTypeList = [];
  selectedEquipmentType = [];
  selectedEquipmentTypeString: string = "";
  selectedUOM: UOMModel = new UOMModel();
  commonmodel = new commonModel();
  saveUpdateEquipmentMaterialModel: SaveUpdateEquipmentMaterialModel = new SaveUpdateEquipmentMaterialModel();
  saveUpdateEquipmentMaterialDataSource: SaveUpdateEquipmentMaterialModel[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  UOMList = [];
  sUOM = [];
  equipmentTypeMaterialPropertyDetailPopup: EquipmentTypeMaterialPropertyDetailModel = new EquipmentTypeMaterialPropertyDetailModel();
  originalarrObject = [];
  //decimal_value: number = 5.123456789;
  filterValue = "";

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }
  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace    
    this.getAssociatedEquipmentTypeWithMaterialMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getAssociatedEquipmentTypeWithMaterialMap(this.equipmentTypeMaterialPropertyDetailPopup);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isLinear = false;

  constructor(private router: Router,    
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private materialService: MaterialService) { }

  async ngOnInit() {
    this.isSaving = false;
    this.commonmodel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.pageSize = await this.materialService.getDefaultPageSize();
    this.getEquipmentType();
    this.dataSource = new MatTableDataSource<EquipmentTypeMaterialPropertyDetailModel>();
    this.settings = {
      singleSelection: false,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 1,
      labelKey: "description",
      searchBy: ['description'],
      noDataLabel: "No Data Available",
      enableCheckAll: false
    };
  }

  onItemSelect() {
    this.selectedEquipmentTypeString = Array.prototype.map.call(this.selectedEquipmentType, function (item) { return item.id; }).join(",");
  }

  async getPageSize() {
    await this.materialService.getTotalCountEquipTyMatPropDetailForPopUP(this.equipmentTypeMaterialPropertyDetailPopup)
      .toPromise().then(result => {
        this.equipmentTypeMaterialPropertyDetailPopup.itemsLength = result.data;
      });
    // default page size
    this.equipmentTypeMaterialPropertyDetailPopup.pageSize = await this.materialService.getDefaultPageSize();
    this.equipmentTypeMaterialPropertyDetailPopup.pageSizeOptions.push(this.equipmentTypeMaterialPropertyDetailPopup.pageSize);
  }

  //getNewValue(ev: any): any {

  //  //this.equipmentTypeMaterialPropertyDetailPopup.propertyValue = this._decimalPipe.transform(ev, "1.0-0");
  //}

  async associatedEquipmetMaterial() {
    this.isSaving = true;
    this.currentUser = this.authenticationService.currentUserValue;
    this.equipmentTypeMaterialPropertyDetailPopup.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.materialCode = this.dataToTakeAsInput;
    this.equipmentTypeMaterialPropertyDetailPopup.equipmentTypeIDs = this.selectedEquipmentTypeString;
    await this.getPageSize();
    this.getAssociatedEquipmentTypeWithMaterialMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      if (event.active === 'Equipment') {
        event.active = 'EquipmentTypeDescription';
      }
      if (event.active === 'Characteristics') {
        event.active = 'EntityPropertyDescription';
      }
      if (event.active === 'CharacteristicsValue') {
        event.active = 'PropertyValue';
      }
      if (event.active === 'uom') {
        event.active = 'PropertiesUOM';
      }
      this.equipmentTypeMaterialPropertyDetailPopup.sortColumn = event.active;
      this.equipmentTypeMaterialPropertyDetailPopup.sortOrder = event.direction.toLocaleUpperCase();
      this.getAssociatedEquipmentTypeWithMaterialMap(this.equipmentTypeMaterialPropertyDetailPopup);
    }
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.equipmentTypeMaterialPropertyDetailPopup.pageNo = event.pageIndex + 1;
    this.equipmentTypeMaterialPropertyDetailPopup.pageSize = event.pageSize;
    this.getAssociatedEquipmentTypeWithMaterialMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  resetFilter() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.equipmentTypeMaterialPropertyDetailPopup.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.materialCode = this.dataToTakeAsInput;
    this.equipmentTypeMaterialPropertyDetailPopup.equipmentTypeIDs = "";
    this.selectedEquipmentType = [];
    this.equipmentTypeMaterialPropertyDetailPopup.itemsLength = 0;
    this.getAssociatedEquipmentTypeWithMaterialMap(this.equipmentTypeMaterialPropertyDetailPopup);
    this.isSaving = false;
  }

  getAssociatedEquipmentTypeWithMaterialMap(obj) {
    this.equipmentTypeMaterialPropertyDetailPopup.filterOn = this.filterValue;
    this.materialService.getEquipmentTypeMaterialPropertyDetailForPopUP(obj).subscribe(result => {
      this.dataSource.data = result.data;
      const datad = this.dataSource.data;
      const datab = [];
      datad.forEach(item => datab.push(Object.assign({}, item)));
      datad.forEach(item => this.originalarrObject.push(Object.assign({}, item)));      
    });
    this.getUOMList();
  }

  getUOMList() {
    const clientid = this.authenticationService.currentUserValue.ClientId;
    this.materialService.getUOMList(clientid)
      .subscribe(result => {
        if (result.data != null || result.data != undefined) {
          let datalist: any[] = result.data;
          for (let i = 0; i < datalist.length; i++) {
            this.UOMList.push({
              id: datalist[i].id,
              itemName: datalist[i].name
            })
          }
        }
      });
  }

  getEquipmentType() {
    this.materialService.getEquipmentList(this.commonmodel).subscribe(result => {
      if (result.data != null || result.data != undefined) {
        this.equipmentTypeList = result.data;
      }
    });
  }

  close() {
    this.activeModal.close();
  }

  saveUpdateEquipmentMaterialProperty() {
    this.isSaving = false;
    const changedarrObject = this.dataSource.data;
    changedarrObject.forEach(item => {
      this.setDataModel(item);
    });
    this.materialService.saveUpdateEquipmentMaterialProperty(this.saveUpdateEquipmentMaterialDataSource).subscribe(result => {
      this.toastrService.success("saved successfully");
      this.originalarrObject = [];
      this.saveUpdateEquipmentMaterialDataSource = [];
      this.isSaving = true;
      this.close();
    });
  }

  setDataModel(editmodel: EquipmentTypeMaterialPropertyDetailModel) {
    this.saveUpdateEquipmentMaterialModel = {
      id: editmodel.id,
      MaterialID: editmodel.materialID,
      EntityPropertyID: editmodel.entityPropertyID,
      EquipmentTypeID: editmodel.equipmentTypeID,
      PropertyValue: editmodel.propertyValue == "" ? null : editmodel.propertyValue,
      PropertiesUOM: editmodel.propertiesUOM,
      IsDeleted: editmodel.isDeleted,
      ClientID: this.currentUser.ClientId,
      SourceSystemID: this.currentUser.SourceSystemID,
      UpdatedBy: this.currentUser.LoginId,
      CreateDateTimeServer: new Date(),
      CreateDateTimeBrowser: new Date(),
      CreatedBy: this.currentUser.LoginId,
      UpdateDateTimeBrowser: new Date(),
      UpdateDateTimeServer: new Date()
    } as SaveUpdateEquipmentMaterialModel;
    this.saveUpdateEquipmentMaterialDataSource.push(this.saveUpdateEquipmentMaterialModel);
  }
  CalculateValue(element: any, value: any) {
    var data = [];
    var finaldata = [];
    finaldata = this.dataSource.data;
    data = this.dataSource.data;
    data = data.filter(x => ( x.equipmentTypeCode == element.equipmentTypeCode ));
    var NumberofUnitsonaPallet = data.filter(p => (p.entityPropertyCode == "Number of Units on a Pallet")).map(function (a) { return a["propertyValue"]; });
    var NumberofPalletsinanEquipment = data.filter(p => (p.entityPropertyCode == "Number of Pallets in an Equipment")).map(function (a) { return a["propertyValue"]; });
    var NumberofUnitsinanEquipment = (Number(NumberofUnitsonaPallet) * Number(NumberofPalletsinanEquipment))//data.filter(p => (p.entityPropertyCode == "Number of Units in an Equipment"));
       
      finaldata.forEach(s => {
        if (s.equipmentTypeCode == element.equipmentTypeCode && s.entityPropertyCode == "Number of Units in an Equipment") {
          s.propertyValue = NumberofUnitsinanEquipment == 0 ? "" : String(NumberofUnitsinanEquipment);
        }
      });
    this.dataSource.data = finaldata;
  }
}

