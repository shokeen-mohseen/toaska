import { Component, ViewChild, OnInit, Input } from '@angular/core';
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
export class EditDefineEquipmentMaterialComponent implements OnInit {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
  countA = 3;

  selectedItemsB = [];
  settingsB = {};
  countB = 3;

  ngOnInit(): void {
    this.materialDDModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.materialDDModel.pageSize = 0;
    this.getMaterialCommodityList();
    this.dataSource = new MatTableDataSource<MaterialPropertyDetailByEquipmentModel>();    

    this.itemListB = [
      { "id": 1, "itemName": "52700-08-01" },
      { "id": 2, "itemName": "AK-BULK" },
      { "id": 3, "itemName": "AK-BULK-FIN" }
    ];

    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

  }

  onItemSelect(item: any) {
    debugger
    this.selectedMaterialString = Array.prototype.map.call(this.selectedMatName, function (item) { return item.id; }).join(",");   
  }  

  associatedEquipmetMaterial() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.equipmentTypeMaterialPropertyDetailPopup.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.equipmentTypeCode = this.dataToTakeAsInput;
    this.equipmentTypeMaterialPropertyDetailPopup.MaterialIDs = this.selectedMaterialString;
    this.getAssociatedMaterialWithEquipmentTypeMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  getAssociatedMaterialWithEquipmentTypeMap(obj) {
    this.equipmentService.getMaterialPropertyDetailByEquipmentForPopUP(obj).subscribe(result => {
      this.dataSource.data = result.data;
      const datad = this.dataSource.data;
      const datab = [];
      datad.forEach(item => datab.push(Object.assign({}, item)));
      datad.forEach(item => this.originalarrObject.push(Object.assign({}, item)));
    });
    this.getUOMList();
  }

  resetFilter() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.equipmentTypeMaterialPropertyDetailPopup.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.equipmentTypeCode = this.dataToTakeAsInput;
    this.equipmentTypeMaterialPropertyDetailPopup.MaterialIDs = "";
    this.selectedMatName = [];
    this.getAssociatedMaterialWithEquipmentTypeMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  saveUpdateEquipmentMaterialProperty() {
    const changedarrObject = this.dataSource.data;
    const origenalobject = this.originalarrObject;
    var result = changedarrObject.filter(function (o1: { propertyValue: string, propertiesUOM: string }) {
      return !origenalobject.some(function (o2: { propertyValue: string, propertiesUOM: string }) {
        return (o1.propertyValue === o2.propertyValue) && (o1.propertiesUOM === o2.propertiesUOM);
      });
    });
    result;
    result.forEach(item => {
      this.setDataModel(item);
    });
    this.materialService.saveUpdateEquipmentMaterialProperty(this.saveUpdateEquipmentMaterialDataSource).subscribe(result => {
      this.toastrService.success("saved successfully");
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
            let datalist: any[] = data.data;
            for (let i = 0; i < datalist.length; i++) {
              this.MaterialNameList.push({
                id: datalist[i].id,
                itemName: datalist[i].name
              })
            }
          }
        });
    }
  }


  close() {   
    this.activeModal.close();
  }
}
