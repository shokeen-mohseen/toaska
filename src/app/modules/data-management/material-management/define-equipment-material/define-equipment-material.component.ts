import { Component, OnInit, ViewChild, Input, AfterViewInit, OnChanges } from '@angular/core';
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
export class DefineEquipmentMaterialComponent implements OnInit, AfterViewInit, OnChanges {

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
  filterValue = "";
  isLoading = true;
  Inactive: boolean;

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
    }
  }

  customSort(event) {    
    if (event.active != 'selectRow') {
      if (event.active === 'Description') {
        event.active = 'EquipmentTypeDescription';
      }
      if (event.active === 'DefaultCommodity') {
        event.active = 'EntityPropertyDescription';
      }
      if (event.active === 'Active') {
        event.active = 'PropertyValue';
      }
      if (event.active === 'uom') {
        event.active = 'PropertiesUOM';
      }
      this.equipmentTypeMaterialPropertyDetail.sortColumn = event.active;
      this.equipmentTypeMaterialPropertyDetail.sortOrder = event.direction.toLocaleUpperCase();
      this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
    }
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.equipmentTypeMaterialPropertyDetail.pageNo = event.pageIndex + 1;
    this.equipmentTypeMaterialPropertyDetail.pageSize = event.pageSize;
    this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
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

  constructor(private router: Router, public modalService: NgbModal,
    private toastrService: ToastrService,
    private materialService: MaterialService, private authenticationService: AuthService) { }

  ngOnInit() {
    this.equipmentTypeMaterialPropertyDetail.clientID = this.authenticationService.currentUserValue.ClientId;
    this.selectedMaterialToEdit.clientID = this.authenticationService.currentUserValue.ClientId;    
    this.Inactive = this.materialService.permission == false ? true : false;
    this.dataSource = new MatTableDataSource<EquipmentTypeMaterialPropertyDetailModel>();
    this.selectedMaterialToEdit.pageSize = 0;
    this.getMaterialCommodityList(this.selectedMaterialToEdit);
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      labelKey: "name",
      searchBy: ['name'],
      classes: 'right',
      disabled: this.Inactive ? true : false
    };
  }

 async ngOnChanges() {
    this.equipmentTypeMaterialPropertyDetail.clientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentTypeMaterialPropertyDetail.materialCode = this.sendDataToChild;
    this.equipmentTypeMaterialPropertyDetail.materialID = this.sendMatIDToChild;    
    await this.getPageSize();
   this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);    
  }

  async getPageSize() {
    await this.materialService.totalEquipCharCount(this.equipmentTypeMaterialPropertyDetail)
      .toPromise().then(result => {
        this.equipmentTypeMaterialPropertyDetail.itemsLength = result.data;
      });
    // default page size
    this.equipmentTypeMaterialPropertyDetail.pageSize = await this.materialService.getDefaultPageSize();
    this.equipmentTypeMaterialPropertyDetail.pageSizeOptions.push(this.equipmentTypeMaterialPropertyDetail.pageSize);
  }

  onItemSelect(item: any) {
    this.isLoading = true;    
    this.copyEquipmentMaterialPropertyModel.MaterialCodeGlobal = this.sendDataToChild;
    this.copyEquipmentMaterialPropertyModel.MaterialCodeDropDown = item.name.replace(/\s/g, "");
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
    this.modalRef.result.then(async (result) => {
      this.equipmentTypeMaterialPropertyDetail.clientID = this.authenticationService.currentUserValue.ClientId;
      this.equipmentTypeMaterialPropertyDetail.sortColumn = 'UpdateDateTimeServer';
      this.equipmentTypeMaterialPropertyDetail.sortOrder = 'Desc';
      await this.getPageSize();
      this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
    }), (reason) => {
    };
  }

  getMaterialCommodityList(ObjServ) {   
      this.materialService.getMaterialCommodityMapList(ObjServ)
        .subscribe(data => {
          if (data.data != null || data.data != undefined) {
            this.MaterialNameList = data.data;            
          }
        });
  }

  getEquipmentTypeMaterialPropertyDetailByCode(objRef) {
    this.selection.clear();
    this.equipmentTypeMaterialPropertyDetail.filterOn = this.filterValue;
    this.materialService.getEquipmentTypeMaterialPropertyDetailByCode(objRef)
      .subscribe(result => {        
        this.dataSource.data = result.data;
      });
  }

  removeEquipmentTypeMaterialPropertyDetail() {
    var selectedIDs = '';
    if (this.selection.selected.length == 0) {
      this.toastrService.info("Please select at least one record");
      return false;
    }
    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.id.toString() + ',';
    });
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.materialService.removeEquipmentTypeMaterialPropertyDetail(selectedIDs).subscribe(async result => {
        if (result.message == "Success" || result.Message == "Success") {
          this.equipmentTypeMaterialPropertyDetail.clientID = this.authenticationService.currentUserValue.ClientId;
          await this.getPageSize();
          this.getEquipmentTypeMaterialPropertyDetailByCode(this.equipmentTypeMaterialPropertyDetail);
          this.toastrService.success("The records are deleted successfully.");
        }
        else {
          this.toastrService.warning("An error occurred during this operation. Please contact Tech Support.");
        }
      }, error => {        
      });
    }, (reason) => {
    });
  }
}
