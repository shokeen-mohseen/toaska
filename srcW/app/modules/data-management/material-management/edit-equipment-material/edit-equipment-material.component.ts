import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
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
import { EquipmentTypeMaterialPropertyDetailModel, UOMModel, SaveUpdateEquipmentMaterialModel } from '../../../../core/models/material.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-edit-equipment-material',
  providers: [DecimalPipe],
  templateUrl: './edit-equipment-material.component.html',
  styleUrls: ['./edit-equipment-material.component.css']
})
export class EditEquipmentMaterialComponent implements OnInit {
  [x: string]: any;
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
  selectedEquipmentTypeString: string="";
  selectedUOM: UOMModel = new UOMModel();
  saveUpdateEquipmentMaterialModel: SaveUpdateEquipmentMaterialModel = new SaveUpdateEquipmentMaterialModel();
  saveUpdateEquipmentMaterialDataSource: SaveUpdateEquipmentMaterialModel[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  UOMList = [];
  sUOM = [];
  equipmentTypeMaterialPropertyDetailPopup: EquipmentTypeMaterialPropertyDetailModel = new EquipmentTypeMaterialPropertyDetailModel();
  originalarrObject = [];
  decimal_value: number = 5.123456789;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
    private _decimalPipe: DecimalPipe,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private materialService: MaterialService) { }

  ngOnInit(): void {
    
    this.getEquipmentType();
    this.dataSource = new MatTableDataSource<EquipmentTypeMaterialPropertyDetailModel>();
    this.settings = {
      singleSelection: false,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2,      
      noDataLabel: "No Data Available"
    };
  }

  onItemSelect() {   
    this.selectedEquipmentTypeString = Array.prototype.map.call(this.selectedEquipmentType, function (item) { return item.id; }).join(",");
  }

  //numberOnly(event) {
  //  debugger
  //  var decimal_formatted =
  //    this._decimalPipe.transform(this.decimal_value, "1.0-0")
  //  console.log(decimal_formatted);
  //  this.equipmentTypeMaterialPropertyDetailPopup.propertyValue = this._decimalPipe.transform(event, "1.0-0");
  //}

  getNewValue(ev: any): any {
    
    //this.equipmentTypeMaterialPropertyDetailPopup.propertyValue = this._decimalPipe.transform(ev, "1.0-0");
  }

  associatedEquipmetMaterial() {
    
    this.currentUser = this.authenticationService.currentUserValue;
    this.equipmentTypeMaterialPropertyDetailPopup.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.materialCode = this.dataToTakeAsInput;
    this.equipmentTypeMaterialPropertyDetailPopup.equipmentTypeIDs = this.selectedEquipmentTypeString;
    this.getAssociatedEquipmentTypeWithMaterialMap(this.equipmentTypeMaterialPropertyDetailPopup);    
  }
  resetFilter() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.equipmentTypeMaterialPropertyDetailPopup.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetailPopup.materialCode = this.dataToTakeAsInput;
    this.equipmentTypeMaterialPropertyDetailPopup.equipmentTypeIDs = "";
    this.selectedEquipmentType = [];
    this.getAssociatedEquipmentTypeWithMaterialMap(this.equipmentTypeMaterialPropertyDetailPopup);
  }

  getAssociatedEquipmentTypeWithMaterialMap(obj) {
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
   
    this.materialService.getUOMList(100)
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
    this.materialService.getAllEquipmentType().subscribe(result => {
      if (result.data != null || result.data != undefined) {
        let datalist: any[] = result.data;
        for (let i = 0; i < datalist.length; i++) {
          this.equipmentTypeList.push({
            id: datalist[i].id,
            itemName: datalist[i].description
          })
        }
      }
    });
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
}

