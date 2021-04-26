import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddEditDefineCharacteristicsComponent } from '../add-edit-define-characteristics/add-edit-define-characteristics.component';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService } from '../../../../core';
import { MaterialCommodityMap, MaterialPropertyDetailModel, MaterialPropertyDetailEditModel, CopyMaterialPropertyModel } from '../../../../core/models/material.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

@Component({
  selector: 'app-define-characteristics',
  templateUrl: './define-characteristics.component.html',
  styleUrls: ['./define-characteristics.component.css']
})
export class DefineCharacteristicsComponent implements OnInit {
  @Input() materialCode: string;
  modalRef: NgbModalRef;
  displayedColumns = ['selectRow', 'Description', 'DefaultCommodity', 'Active'];
  dataSource;//= new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<MaterialPropertyDetailModel>(true, []);
  selectedMaterialToEdit: MaterialCommodityMap = new MaterialCommodityMap();
  materialPropertyDetail: MaterialPropertyDetailModel = new MaterialPropertyDetailModel();
  copyMatPropertyDetail: CopyMaterialPropertyModel = new CopyMaterialPropertyModel();
  allmaterialPropertyDetail: MaterialPropertyDetailEditModel[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  settingsA = {};
  settingsB = {};
  ObjServ = {};
  @Input() sendDataToChild: string;
  @Input() sendMatIDToChild: number;
  ObjMat = {}
  MaterialCharList = [];
  selectedMatChar = [];
  MaterialNameList = [];
  selectedMatName = [];
  dataSourceFilterData = [];
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
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; });
  }
  isLinear = false;

  constructor(private router: Router, public modalService: NgbModal,
    private toastrService: ToastrService,
    private materialService: MaterialService, private authenticationService: AuthService) { }

  ngOnInit(): void {
   
    //this.ObjMat = null;
    this.selectedMaterialToEdit.clientID = this.authenticationService.currentUserValue.ClientId;
    this.materialPropertyDetail.clientId = this.authenticationService.currentUserValue.ClientId;
    this.selectedMaterialToEdit.pageSize = 0;
    this.getMaterialCommodityList(this.selectedMaterialToEdit)
    //this.getMaterialpropertyList(this.ObjServ);
    //this.ObjMat = {
    //  Code: this.sendDataToChild,
    //}
    //this.getMaterialpropertyDetalList(this.ObjMat);
    this.dataSource = new MatTableDataSource<MaterialPropertyDetailModel>();
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      classes: 'right'
    };
    this.settingsB = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2,
      labelKey: "description",
      noDataLabel: "No Data Available"
    };
  }

  //ngAfterViewInit() {
  //  
  //  this.sendDataToChild
  //  this.ObjMat = { Code: this.sendDataToChild, }
  //  this.getMaterialpropertyDetalList(this.ObjMat);
  //}

  ngOnChanges() {
    
    this.materialPropertyDetail.clientId = this.authenticationService.currentUserValue.ClientId;
    this.materialPropertyDetail.code = this.sendDataToChild;
    this.materialPropertyDetail.materialID = this.sendMatIDToChild;
    this.dataSourceFilterData = [];
    this.allmaterialPropertyDetail = [];
    //this.sendDataToChild
    //this.ObjMat = { Code: this.sendDataToChild, }
    this.getMaterialpropertyDetalList(this.materialPropertyDetail);
    console.log("CHANGES")
  }

  onItemSelect(item: any) {
    
    this.isLoading = true;
    this.dataSourceFilterData = [];
    this.copyMatPropertyDetail.Second = item.id;
    this.copyMatPropertyDetail.First = this.sendMatIDToChild;
    this.materialService.getMaterialPropertyDetailFromOtherMaterial(this.copyMatPropertyDetail).subscribe(result => {
      this.isLoading = false;
      this.getMaterialpropertyDetalList(this.materialPropertyDetail);
    },
      err => {
        this.isLoading = false;
      },
    );    
  }

  editDefinechar() {
    this.modalRef = this.modalService.open(AddEditDefineCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
    (<AddEditDefineCharacteristicsComponent>this.modalRef.componentInstance).dataToTakeAsInput = this.allmaterialPropertyDetail;
    this.modalRef.result.then((result) => {
      
      this.dataSourceFilterData = [];
      this.allmaterialPropertyDetail = [];
      this.getMaterialpropertyDetalList(this.materialPropertyDetail);
      
    }), (reason) => {
      
    //this.allmaterialPropertyDetail = [];
    };
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

  getMaterialpropertyDetalList(objref) {   
    this.materialService.getMaterialPropertyDetailByCode(objref)
      .subscribe(result => {        
        this.allmaterialPropertyDetail = result.data;
        result.data.forEach(element => {          
          if (element.description != 'Active/Non Active' && element.materialPropertyValue != "") {
            this.dataSourceFilterData.push(element)
          }
        });
        this.dataSource.data = this.dataSourceFilterData;
      });
  }

  removeMaterialPropertyDetail() {
    var selectedIDs = '';
    if (this.selection.selected.length == 0) {
      this.toastrService.info("Please select at least one record.");
      return false;
    }
    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.matpDID.toString() + ',';
    });
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.materialService.removeMaterialPropertyDetail(selectedIDs).subscribe(result => {
        if (result.message == "Success" || result.Message == "Success") {
          this.dataSourceFilterData = [];
          this.allmaterialPropertyDetail = [];
          this.getMaterialpropertyDetalList(this.materialPropertyDetail);
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
