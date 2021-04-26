import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditEquipmentMaterialComponent } from '../edit-equipment-material/edit-equipment-material.component';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService } from '../../../../core';
import { EquipmentTypeMaterialPropertyDetailModel, MaterialCommodityMap, CopyEquipmentMaterialPropertyModel } from '../../../../core/models/material.model';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-define-equipment-material',
  templateUrl: './define-equipment-material.component.html',
  styleUrls: ['./define-equipment-material.component.css']
})
export class DefineEquipmentMaterialComponent implements OnInit {

  modalRef: NgbModalRef;
  displayedColumns = ['selectRow', 'Description', 'DefaultCommodity', 'Active', 'uom'];
  dataSource;
  selection = new SelectionModel<EquipmentTypeMaterialPropertyDetailModel>(true, []);
  equipmentTypeMaterialPropertyDetail: EquipmentTypeMaterialPropertyDetailModel = new EquipmentTypeMaterialPropertyDetailModel();
  selectedMaterialToEdit: MaterialCommodityMap = new MaterialCommodityMap();
  copyEquipmentMaterialPropertyModel: CopyEquipmentMaterialPropertyModel = new CopyEquipmentMaterialPropertyModel();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() sendDataToChild: string;
  @Input() sendMatIDToChild: number;
  MaterialNameList = [];
  selectedMatName = [];
  settingsA = {};
  filterValue: string = "";
  isLoading = true;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  //clearFilter(filterValue: string) {
  //  filterValue = "";
  //}

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

  constructor(private router: Router, public modalService: NgbModal,
    private toastrService: ToastrService,
    private materialService: MaterialService, private authenticationService: AuthService) { }

  ngOnInit(): void {
    this.selectedMaterialToEdit.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetail.clientID = this.authenticationService.currentUserValue.ClientId;
    this.dataSource = new MatTableDataSource<EquipmentTypeMaterialPropertyDetailModel>();
    this.selectedMaterialToEdit.pageSize = 0;
    this.getMaterialCommodityList(this.selectedMaterialToEdit);
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      classes: 'right'
    };
  }

  ngOnChanges() {
    debugger
    this.equipmentTypeMaterialPropertyDetail.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetail.materialCode = this.sendDataToChild;
    this.equipmentTypeMaterialPropertyDetail.materialID = this.sendMatIDToChild;
    //this.dataSourceFilterData = [];
    //this.allmaterialPropertyDetail = [];
    //this.sendDataToChild
    //this.ObjMat = { Code: this.sendDataToChild, }
    this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
    console.log("CHANGES")
  }

  onItemSelect(item: any) {
    debugger
    this.isLoading = true;    
    this.copyEquipmentMaterialPropertyModel.MaterialCodeGlobal = this.sendDataToChild;
    this.copyEquipmentMaterialPropertyModel.MaterialCodeDropDown = item.itemName.replace(/\s/g, "");
    this.copyEquipmentMaterialPropertyModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.materialService.getEquipmentMaterialPropertyDetailFromOtherMaterial(this.copyEquipmentMaterialPropertyModel).subscribe(result => {
      this.isLoading = false;
      this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
    },
      err => {
        this.isLoading = false;
      },
    );
  }
  
  openeditEquipment() {
    this.modalRef = this.modalService.open(EditEquipmentMaterialComponent, { size: 'lg', backdrop: 'static' });
    (<EditEquipmentMaterialComponent>this.modalRef.componentInstance).dataToTakeAsInput = this.sendDataToChild;

  }

  getMaterialCommodityList(ObjServ) {
    if (this.MaterialNameList.length == 0) {
      this.materialService.getMaterialCommodityMapList(ObjServ)
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

  getEquipmentTypeMaterialPropertyDetailByCode(objref) {
    this.materialService.getEquipmentTypeMaterialPropertyDetailByCode(objref)
      .subscribe(result => {
        //this.allmaterialPropertyDetail = result.data;
        //result.data.forEach(element => {
        //  if (element.description != 'Active/Non Active' && element.materialPropertyValue != "") {
        //    this.dataSourceFilterData.push(element)
        //  }
        //});
        this.dataSource.data = result.data;
      });
  }

  removeEquipmentTypeMaterialPropertyDetail() {
    var selectedIDs = '';
    if (this.selection.selected.length == 0) {
      this.toastrService.info("Please select at least one record.");
      return false;
    }
    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.id.toString() + ',';
    });
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.materialService.removeEquipmentTypeMaterialPropertyDetail(selectedIDs).subscribe(result => {
        if (result.message == "Success" || result.Message == "Success") {          
          this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
          this.toastrService.success("Record(s) Deleted successfully.");
        }
        else {
          this.toastrService.warning("Something went wrong.");
        }
      }, error => {
        this.toastrService.error("Records saved successfully.");
      });
    }, (reason) => {
    });
  }
}
