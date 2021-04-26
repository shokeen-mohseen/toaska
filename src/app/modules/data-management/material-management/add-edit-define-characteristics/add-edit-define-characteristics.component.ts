import { Component, OnInit, ViewChild, Input, HostListener, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialService } from '../../../../core/services/material.service';
import { MaterialPropertyModel, UOMModel, MaterialPropertyDetailModel, MaterialPropertyDetailEditModel, SaveUpdateModel } from '../../../../core/models/material.model';
import { AuthService, User } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-add-edit-define-characteristics',
  templateUrl: './add-edit-define-characteristics.component.html',
  styleUrls: ['./add-edit-define-characteristics.component.css']
})
export class AddEditDefineCharacteristicsComponent implements OnInit {
  @Input() dataToTakeAsInput: MaterialPropertyDetailEditModel[] = [];
  datas: MaterialPropertyDetailModel = new MaterialPropertyDetailModel();
  field = {};
  ObjServ = {};
  xyzc: any;
  currentUser: User;
  displayedColumns = ['description', 'materialPropertyValue', 'materialPropertyValueUOM'];
  dataSource;//= new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<MaterialPropertyDetailEditModel>(true, []);
  materialProperty: MaterialPropertyDetailEditModel = new MaterialPropertyDetailEditModel()
  saveUpdateModel: SaveUpdateModel = new SaveUpdateModel();
  saveUpdateDataSource: SaveUpdateModel[] = [];
  selectedUOM: UOMModel = new UOMModel();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  UOMList = [];
  sUOM = [];
  MatControlval = [];
  MaterialCharList = [];
  settings = {};
  originalarrObject = [];
    elementRef: any;
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
    private el: ElementRef,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private materialService: MaterialService,
    private authenticationService: AuthService,) { }

  ngOnInit(): void {
   
    this.currentUser = this.authenticationService.currentUserValue;
    this.materialProperty.clientId = this.authenticationService.currentUserValue.ClientId;
    this.getdecimalValue();
    //this.dataSource = new MatTableDataSource<MaterialPropertyDetailEditModel>();
    //this.dataToTakeAsInput
    this.selectedUOM.clientId = this.authenticationService.currentUserValue.ClientId;
    this.getMaterialpropertyList()
    //this.getUOMList();

    this.settings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

  }


  decimalValue: number;
  getdecimalValue() {
    this.materialService.getPrefrenceValueByCode(GlobalConstants.decimalCode)
      .subscribe(
        result => {
          this.decimalValue = result.data.preferenceValue;
          //alert(this.decimalValue);
        }
      );
  }
  

  close() {
   
    this.activeModal.close();
  }

  getMaterialpropertyList() {
   
    const datad = this.dataToTakeAsInput.filter(x => (x.code != 'Active') && (x.code != 'PercentageToReserve'));
    const datab = [];
    datad.forEach(item => datab.push(Object.assign({}, item)));
    datad.forEach(item => this.originalarrObject.push(Object.assign({}, item)));
    this.dataSource = new MatTableDataSource<MaterialPropertyDetailEditModel>(datab);
    this.getUOMList();
    this.getMaterialPropControlValue();
  }

  onChange(newValue) {
    
    console.log(newValue);
    if (newValue=='Yes') {
      this.materialProperty.materialPropertyValue = "1";
    }
    else {
      this.materialProperty.materialPropertyValue = "0";
    }
  }

  getMaterialPropControlValue() {
    this.materialService.getMaterialPropertControlVal()
      .subscribe(
        result => {
          if (result.data != null || result.data != undefined) {
            let datalist: any[] = result.data;
            for (let i = 0; i < datalist.length; i++) {
              this.MatControlval.push({
                id: datalist[i].id,
                itemName: datalist[i].controlDisplayValue
              })
            }
          }                
        });      
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

  saveUpdateMaterialPropertyDetail() {    
    const changedarrObject = this.dataSource.data;
    const origenalobject = this.originalarrObject;
    //var props = ['materialID', 'materialPropertyID','materialPropertyValue','materialPropertyValueUOM'];

    var result = changedarrObject.filter(function (o1: { controlDisplayValue: string, materialPropertyValue: string, materialPropertyValueUOM: string }) {     
      return !origenalobject.some(function (o2: { controlDisplayValue: string, materialPropertyValue: string, materialPropertyValueUOM: string }) {        
        return ((o1.controlDisplayValue === o2.controlDisplayValue) && (o1.materialPropertyValue === o2.materialPropertyValue) && (o1.materialPropertyValueUOM === o2.materialPropertyValueUOM));
      });
    });    
    result.forEach(item => {
      this.setDataModel(item);
    });     
    this.materialService.saveUpdateMaterialPropertyDetail(this.saveUpdateDataSource).subscribe(result => {
      this.toastrService.success("saved successfully");
      //this.saveUpdateDataSource = [];
      this.activeModal.close();
    });
  }

  edit(x: number, row) {
    
    this.setDataModel(row);
  }

  getRecord(row) {
    
    this.setDataModel(row);
  }

  setDataModel(editmodel: MaterialPropertyDetailEditModel) {
    if (editmodel.code == 'IsClean') {
      if (editmodel.controlDisplayValue == 'Yes') {
        editmodel.materialPropertyValue = "1";
      }
      else {
        editmodel.materialPropertyValue = "0";
      }
    }
    
    this.saveUpdateModel = {
      id: editmodel.matpDID,
      MaterialID: editmodel.materialID,
      MaterialPropertyID: editmodel.materialPropertyID,
      MaterialPropertyValue: editmodel.materialPropertyValue,
      MaterialPropertyValueUOM: editmodel.materialPropertyValueUOM,
      ValidationID: editmodel.validationID,
      IsVisible: editmodel.isVisible,
      IsEditable: editmodel.isEditable,
      RequiredUom: editmodel.requiredUom,
      IsDeleted: editmodel.isDeleted,
      ClientId: this.currentUser.ClientId,
      SourceSystemID: editmodel.sourceSystemId,
      UpdatedBy: this.currentUser.LoginId,
      CreateDateTimeServer: new Date(),
      CreateDateTimeBrowser: new Date(),
      CreatedBy: this.currentUser.LoginId,
      UpdateDateTimeBrowser: new Date(),
      UpdateDateTimeServer: new Date()
    } as SaveUpdateModel;
    this.saveUpdateDataSource.push(this.saveUpdateModel);
  }
}
