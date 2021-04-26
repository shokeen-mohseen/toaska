import { Component, ViewChild, OnInit, Input, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../core';
import { MaterialService } from '../../../../core/services/material.service';
import { EquipmentTypeMaterialPropertyDetailModel, MaterialCommodityMap, UOMModel, SaveUpdateEquipmentMaterialModel } from '../../../../core/models/material.model';
import { MaterialPropertyDetailByEquipmentModel } from '../../../../core/models/Equipment';
import { EquipmentService } from '../../../../core/services/equipment.service';


@Component({
  selector: 'app-edit-define-equipment-material',
  templateUrl: './edit-define-equipment-material.component.html',
  styleUrls: ['./edit-define-equipment-material.component.css']
})
export class EditDefineEquipmentMaterialComponent implements OnInit, AfterViewInit {
  @Input() dataToTakeAsInput: string;
  materialDDModel = new MaterialCommodityMap();
  displayedColumns = ['MaterialDescription', 'Characteristics', 'CharacteristicsValue', 'UOM'];
  dataSource;
  currentUser: User;
  MaterialNameList = [];
  selectedMatName = [];
  selectedMaterialString: string = "";
  selectedMaterial = [];
  originalarrObject = [];
  selectedUOM: UOMModel = new UOMModel();
  saveUpdateEquipmentMaterialModel: SaveUpdateEquipmentMaterialModel = new SaveUpdateEquipmentMaterialModel();
  saveUpdateEquipmentMaterialDataSource: SaveUpdateEquipmentMaterialModel[] = [];
  UOMList = [];
  sUOM = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  equipmentTypeMaterialPropertyDetailPopup: MaterialPropertyDetailByEquipmentModel = new MaterialPropertyDetailByEquipmentModel();
  filterValue = "";

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace    
    this.getAssociatedMaterialWithEquipmentTypeMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getAssociatedMaterialWithEquipmentTypeMap(this.equipmentTypeMaterialPropertyDetailPopup);
    }
  }
  constructor(
    public equipmentService: EquipmentService,
    private router: Router, public modalService: NgbModal,
    private toastrService: ToastrService,
    public activeModal: NgbActiveModal,
    private materialService: MaterialService, private authenticationService: AuthService
  ) { }

  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};

 async ngOnInit() {
    this.materialDDModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.pageSize = await this.equipmentService.getDefaultPageSize();    
    this.materialDDModel.pageSize = 0;
    this.getMaterialCommodityList();
    this.dataSource = new MatTableDataSource<MaterialPropertyDetailByEquipmentModel>();

    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 2,
      labelKey: "name",
      searchBy: ['name'],
      enableCheckAll: false
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      searchBy: ['name'],
      addNewItemOnFilter: false
    };

  }

  async getPageSize() {
    await this.equipmentService.getTotalCountMatProDetailByEquipment(this.equipmentTypeMaterialPropertyDetailPopup)
      .toPromise().then(result => {
        this.equipmentTypeMaterialPropertyDetailPopup.itemsLength = result.data;
      });
    // default page size
    this.equipmentTypeMaterialPropertyDetailPopup.pageSize = await this.equipmentService.getDefaultPageSize();
    this.equipmentTypeMaterialPropertyDetailPopup.pageSizeOptions.push(this.equipmentTypeMaterialPropertyDetailPopup.pageSize);
  }

  onItemSelect(item: any) {
    this.selectedMaterialString = Array.prototype.map.call(this.selectedMatName, function (item) { return item.id; }).join(",");
  }

  async associatedEquipmetMaterial() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.equipmentTypeMaterialPropertyDetailPopup.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.equipmentTypeCode = this.dataToTakeAsInput;
    this.equipmentTypeMaterialPropertyDetailPopup.MaterialIDs = this.selectedMaterialString;    
    await this.getPageSize();
    this.getAssociatedMaterialWithEquipmentTypeMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  getAssociatedMaterialWithEquipmentTypeMap(obj) {
    this.equipmentTypeMaterialPropertyDetailPopup.filterOn = this.filterValue;
    this.equipmentService.getMaterialPropertyDetailByEquipmentForPopUP(obj).subscribe(result => {      
      this.dataSource.data = result.data;
      const datad = this.dataSource.data;
      const datab = [];
      datad.forEach(item => datab.push(Object.assign({}, item)));
      datad.forEach(item => this.originalarrObject.push(Object.assign({}, item)));
    });
    this.getUOMList();
  }

  customSort(event) {
    if (event.active != 'selectRow') {      
      if (event.active === 'Characteristics') {
        event.active = 'EntityPropertyDescription';
      }
      if (event.active === 'CharacteristicsValue') {
        event.active = 'PropertyValue';
      }
      if (event.active === 'UOM') {
        event.active = 'PropertiesUOM';
      }
      this.equipmentTypeMaterialPropertyDetailPopup.sortColumn = event.active;
      this.equipmentTypeMaterialPropertyDetailPopup.sortOrder = event.direction.toLocaleUpperCase();
      this.getAssociatedMaterialWithEquipmentTypeMap(this.equipmentTypeMaterialPropertyDetailPopup);
    }
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.equipmentTypeMaterialPropertyDetailPopup.pageNo = event.pageIndex + 1;
    this.equipmentTypeMaterialPropertyDetailPopup.pageSize = event.pageSize;
    this.getAssociatedMaterialWithEquipmentTypeMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  resetFilter() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.equipmentTypeMaterialPropertyDetailPopup.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.equipmentTypeCode = this.dataToTakeAsInput;
    this.equipmentTypeMaterialPropertyDetailPopup.MaterialIDs = "";
    this.selectedMatName = [];
    this.equipmentTypeMaterialPropertyDetailPopup.itemsLength = 0;
    //this.filterValue = "";
    this.getAssociatedMaterialWithEquipmentTypeMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  saveUpdateEquipmentMaterialProperty() {
    const changedarrObject = this.dataSource.data;
    changedarrObject.forEach(item => {
      this.setDataModel(item);
    });
    this.materialService.saveUpdateEquipmentMaterialProperty(this.saveUpdateEquipmentMaterialDataSource).subscribe(result => {
      this.toastrService.success("saved successfully");
      this.originalarrObject = [];
      this.saveUpdateEquipmentMaterialDataSource = [];
      this.close();
    });
  }

  setDataModel(editmodel: EquipmentTypeMaterialPropertyDetailModel) {
    this.saveUpdateEquipmentMaterialModel = {
      id: editmodel.id,
      MaterialID: editmodel.materialID,
      EntityPropertyID: editmodel.entityPropertyID,
      EquipmentTypeID: editmodel.equipmentTypeID,
      PropertyValue: editmodel.propertyValue,
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

  getUOMList() {
    this.materialService.getUOMList(this.authenticationService.currentUserValue.ClientId)
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

  getMaterialCommodityList() {
    if (this.MaterialNameList.length == 0) {
      this.materialService.getMaterialCommodityMapList(this.materialDDModel)
        .subscribe(data => {
          if (data.data != null || data.data != undefined) {
            this.MaterialNameList = data.data;
          }
        });
    }
  }

  close() {
    this.activeModal.close();
  }
}

