import { Component, ViewChild, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditDefineEquipmentMaterialComponent } from '../edit-define-equipment-material/edit-define-equipment-material.component';
import { ImportExcelComponent } from '../import-excel/import-excel.component';
import { EquipmentTypeMaterialPropertyDetailModel } from '../../../../core/models/material.model';
import { EquipmentService } from '../../../../core/services/equipment.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { async } from '@angular/core/testing';
import { EquipmentViewModel, CopyEquipmentPropertyModel } from '../../../../core/models/Equipment';

@Component({
  selector: 'app-define-equipment-material',
  templateUrl: './define-equipment-material.component.html',
  styleUrls: ['./define-equipment-material.component.css']
})
export class DefineEquipmentMaterialComponent implements OnInit, AfterViewInit, OnChanges {  
  
  displayedColumns = ['selectRow', 'MaterialDescription', 'Characteristics', 'CharacteristicsValue', 'UOM'];
  dataSource;// = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<EquipmentTypeMaterialPropertyDetailModel>(true, []);
  paginationModel: EquipmentTypeMaterialPropertyDetailModel = new EquipmentTypeMaterialPropertyDetailModel();
  copyEquipmentPropertyModel: CopyEquipmentPropertyModel = new CopyEquipmentPropertyModel()
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() sendDataToChild: string;
  @Input() sendMatIDToChild: number;
  filterValue: string;
  EquipmentNameList = [];
  selectedEquipmentName = [];
  equipmentModel:EquipmentViewModel = new EquipmentViewModel()
  isLoading = true;

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;   
  }

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

  modalRef: NgbModalRef;

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.geteMaterialByEquipmentTypCode();
    }
  }
  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.geteMaterialByEquipmentTypCode();
  }

  constructor(
    public equipmentService: EquipmentService,
    public modalService: NgbModal,
    private toastr: ToastrService,
    private authenticationService: AuthService
  ) { }

  settingsA = {};
  countA = 3;

  countB = 3;

 ngOnInit() {
    //this.selectRow = 'selectRow';
   this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
   this.equipmentModel.clientId = this.authenticationService.currentUserValue.ClientId;
   this.equipmentModel.pageSize = 0;
   this.dataSource = new MatTableDataSource<EquipmentTypeMaterialPropertyDetailModel>();
   this.getEquipmentListDD();
   this.settingsA = {
     singleSelection: false,
     text: "Select",
     enableSearchFilter: true,
     addNewItemOnFilter: true,
     badgeShowLimit: 2,
     noDataLabel: "No Data Available"
   };  
  }

 async ngOnChanges() {
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.equipmentTypeCode = this.sendDataToChild;
    this.paginationModel.equipmentTypeID = this.sendMatIDToChild;
    await this.getPageSize();   
    this.geteMaterialByEquipmentTypCode();
  }

  async getPageSize() {
    await this.equipmentService.totalMatCharCount(this.paginationModel)
      .toPromise().then(result => {
        this.paginationModel.itemsLength = result.data;
      });
    // default page size
    this.paginationModel.pageSize = await this.equipmentService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }

  getEquipmentListDD() {
    this.equipmentService.getEquipmentList(this.equipmentModel)
        .subscribe(data => {
          if (data.data != null || data.data != undefined) {
            let datalist: any[] = data.data;
            for (let i = 0; i < datalist.length; i++) {
              this.EquipmentNameList.push({
                id: datalist[i].id,
                itemName: datalist[i].description
              })
            }
          }
        });  
  }

  onItemSelect(item: any) {
    this.isLoading = true;
    this.copyEquipmentPropertyModel.EquipmentCodeGlobal = this.sendDataToChild;
    this.copyEquipmentPropertyModel.EquipmentCodeDropDown = item.itemName.replace(/\s/g, "");
    this.copyEquipmentPropertyModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.equipmentService.getEquipmentPropertyFromOtherEquipment(this.copyEquipmentPropertyModel).subscribe(result => {
      this.isLoading = false;
      this.geteMaterialByEquipmentTypCode();
    },
      err => {
        this.isLoading = false;
      },
    );
  }
  
  btn: any
  btn1: any
  btn2: any
  btn3: any
  btn4: any

  openeditMaterial(action)
  {

    if (action === "addNew") {
      this.modalRef = this.modalService.open(EditDefineEquipmentMaterialComponent, { size: 'xl', backdrop: 'static' });      
      (<EditDefineEquipmentMaterialComponent>this.modalRef.componentInstance).dataToTakeAsInput = this.sendDataToChild;
      this.modalRef.result.then((result) => {
        //this.dataSourceFilterData = [];
        //this.allmaterialPropertyDetail = [];
        this.geteMaterialByEquipmentTypCode();

      }), (reason) => {
        //this.allmaterialPropertyDetail = [];
      };
      this.btn = 'btn1'
    }
    else if (action === "delete") {      
      this.btn = 'btn2'
    }
    else if (action === "export") {
      this.btn = 'btn3'
    }
    else if (action === "import") {
      this.modalRef = this.modalService.open(ImportExcelComponent, { size: 'md', backdrop: 'static' });
      this.btn = 'btn3'
    }
  }

  geteMaterialByEquipmentTypCode() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.equipmentService.getMaterialsPropertyByEquipmentCode(this.paginationModel)
      .subscribe(result => {        
        this.dataSource.data = result.data;
      });
  }
}
