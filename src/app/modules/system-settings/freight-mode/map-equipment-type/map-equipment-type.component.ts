import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditMapEquipmentTypeComponent, equipmenttype1 } from '../edit-map-equipment-type/edit-map-equipment-type.component';
import { FreightModeService } from '../../services/freightmode.service';
import { regularOrderModel } from '../../../../core/models/regularOrder.model';
import { FreightMode, equipmenttype, mapequipmenttypefreightmode } from '../../modals/freightmode';
import { ToastrService } from 'ngx-toastr';
import { identifierModuleUrl } from '@angular/compiler';
import { Item } from 'angular2-multiselect-dropdown';
import { stringify } from '@angular/compiler/src/util';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { AuthService, PreferenceTypeService } from '../../../../core';
import { PaginationModel } from '../../../../core/models/Pagination.Model';



export class freightid {
   FreightModeID: number; 
}

export interface PeriodicElement {  
  ID: number;
  FreightModeID: number;
  EquipmentTypeID: number;
  IsDeleted: boolean;
  ClientId: number;
  SourceSystemId: number;
  CreatedBy: string;
  CreateDateTimeBrowser: Date;
  CreateDateTimeServer: Date;
  UpdatedBy: string;
  UpdateDateTimeBrowser: Date;
  UpdateDateTimeServer: Date;
  equipmentTypeName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  //{ selectRow: '', EquipmentType: 'IMDLContainer' },
  //{ selectRow: '', EquipmentType: 'IMDLContainer60' },
  //{ selectRow: '', EquipmentType: 'Flatbed Tall' },
  //{ selectRow: '', EquipmentType: 'DRYVANS' }
];

@Component({
  selector: 'app-map-equipment-type',
  templateUrl: './map-equipment-type.component.html',
  styleUrls: ['./map-equipment-type.component.css']
})
export class MapEquipmentTypeComponent implements OnInit, AfterViewInit {
  
  regularOrderData: regularOrderModel = new regularOrderModel();
  EquipmentTypeData: any;
  FreightModeID: number;
  @Input() sendIDToChild: number;
  filterValue = "";
  ItemList: mapequipmenttypefreightmode[] = [];
  FreightviewModeID: FreightMode[] = [];
  inActive: boolean;
  displayedColumns = ['selectRow','EquipmentTypeName'];
  dataSource = new MatTableDataSource<mapequipmenttypefreightmode>([]);
  selection = new SelectionModel<mapequipmenttypefreightmode>(true, []);

  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    dataforfreightid: any[]=[];
  List: any;
  product: freightid[] = [];
    itemList: freightid[] = [] ;
  equipforfreight: mapequipmenttypefreightmode[] = [];
    equiplist: equipmenttype[] = [];
  filteredKeywords: any;
  ResultArrayObjOne: equipmenttype[] = [];
  commonViewModel = {
    ClientId: this.authenticationService.currentUserValue.ClientId,
    FreightModeID: this.FreightModeID,
    PageNumber: 1,
    PageSize: 10,
    ItemsLength: 10,
    PageSizeOptions: [10, 20, 30, 40, 50],
    SortOrder: "ASC",
    SortColumn: '',
    FilterOn: ''
  };
   test: string;
  constructor(
    public modalService: NgbModal, public freightservice: FreightModeService,
    private toastr: ToastrService, private authenticationService: AuthService,
    public ptService: PreferenceTypeService
  ) { }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    
    //this.equiptypetable();
  }
  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.commonViewModel.FilterOn = this.filterValue;
    await this.getPageSize();
    this.geteMapEquipmentTypeByFreightModeId();
  }
  //applyFilter(filterText: string) {
  //  this.filterValue = filterText.trim(); // Remove whitespace
  //  this.geteMapEquipmentTypeByFreightModeId();
  //}

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.geteMapEquipmentTypeByFreightModeId();
    }
  }


  onSelectionChange(row: any) {
    // row.IsSeleted = checked;
    this.selection.toggle(row);
  }
  masterToggle() {
    this.isAllSelecteds() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => { this.selection.select(row); (row as any).isSelected = true; });
  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelecteds() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  customSort(event) {
      this.commonViewModel.SortColumn = event.active;
      this.commonViewModel.SortOrder = event.direction.toLocaleUpperCase();
      this.geteMapEquipmentTypeByFreightModeId();
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  //masterToggle() {
  //  this.isAllSelected() ?
  //    this.selection.clear() :
  //    this.dataSource.data.forEach(row => this.selection.select(row));
  //}


  async ngOnChanges(changes: SimpleChanges) {
    this.commonViewModel.FreightModeID = changes.sendIDToChild.currentValue;
    this.commonViewModel.ClientId = this.authenticationService.currentUserValue.ClientId;
    await this.getPageSize();
    this.geteMapEquipmentTypeByFreightModeId();
    //this.getEquipmentListDD();
    //this.EquipmentListDDSetting();
  }

  async getPageSize() {
    this.commonViewModel.ClientId = this.authenticationService.currentUserValue.ClientId;
    this.commonViewModel.PageNumber = 0;
    this.commonViewModel.PageSize = 0;
    await this.freightservice.getMapEquipmentTypeByFreightMode(this.commonViewModel).toPromise()
      .then(result => {
        this.commonViewModel.ItemsLength = result.recordCount;
      });
    // default page size
    this.commonViewModel.PageSize = await this.freightservice.getDefaultPageSize();
    this.commonViewModel.PageSizeOptions.push(this.commonViewModel.PageSize);
    this.paginator.pageIndex = 0;
  }

  //async getPageSize() {
  //  await this.freightservice.getTotalCountMappedEquipment(this.authenticationService.currentUserValue.ClientId, this.FreightModeID)
  //    .toPromise().then(result => {
  //      this.commonViewModel.ItemsLength = result.data;
  //    });
  //  // default page size
  //  this.commonViewModel.PageSize = await this.freightservice.getDefaultPageSize();
  //  // this.commonViewModel.PageSizeOptions.push(this.commonViewModel.PageSize);
  //}


  modalRef: NgbModalRef;

  btn: any
  btn1: any
  btn2: any
  btn3: any
  btn4: any
  btn5: any

  
 
  

 async ngOnInit() {
   this.FreightModeID = this.freightservice.entrylist[0].id;
   this.commonViewModel.FreightModeID = this.FreightModeID;
   await this.getPageSize();
   this.geteMapEquipmentTypeByFreightModeId();
   this.retrivefreightlist();
    this.inActive = this.freightservice.permission ? false : true;
    this.freightservice.datasourceformattable.subscribe(res => {
      this.dataSource.data = res;
    });
    
    //this.retrivefreightlist(); 
   
    //this.dataSource.data.push({ ID: , EquipmentTypeName: });
    this.dataSource._updateChangeSubscription();
    
    
  }
  async geteMapEquipmentTypeByFreightModeId() {
    this.selection.clear();
    this.commonViewModel.FilterOn = this.filterValue;
    this.freightservice.getMapEquipmentTypeByFreightMode(this.commonViewModel)
      .subscribe(async result => {
        this.dataSource.data = result.data;
        this.freightservice.count = result.data.length;
      });    
  }

  retrivefreightlist() {

    this.freightservice.getequipfreightIdsbyList(this.FreightModeID).subscribe((result: any) => {
     
      
      if (result.data) {
        this.equipforfreight = result.data.sort((a, b) => Number(a.EquipmentTypeID) - Number(b.EquipmentTypeID));
        this.freightservice.setDatasourceFromEditmap(this.equipforfreight);
      }
      this.paginator.showFirstLastButtons = true;
    });
    
  //  this.equiptypetable();
  }
  //getTotalMappedRecords() {
  //  this.freightservice.getTotalCountMappedEquipment(this.authenticationService.currentUserValue.ClientId, this.FreightModeID)
  //    .subscribe(result => {
  //      this.commonViewModel.ItemsLength = Number(result.data);
  //      this.getDefaultPageSize();
  //    });
  //}

  //getDefaultPageSize() {
  //  this.ptService.getPreferenceTypeByCode("PageSize")
  //    .subscribe(result => {
  //      this.commonViewModel.PageSize = Number(result.data.preferenceValue);
  //      this.geteMapEquipmentTypeByFreightModeId();
  //      this.retrivefreightlist();
  //    });
  //}

  onPaginationEvent(event) {
    this.commonViewModel.FilterOn = this.filterValue;
    this.commonViewModel.PageNumber = event.pageIndex + 1;
    if (this.commonViewModel.PageNumber > this.commonViewModel.ItemsLength / event.pageSize) {
      this.commonViewModel.PageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.commonViewModel.PageSize = event.pageSize;
    }
    this.geteMapEquipmentTypeByFreightModeId();
    this.commonViewModel.PageSize = event.pageSize;
    
  }
  selectedCheckbox(e: any, selectedData) {

    //if (selectedData.index != 0 ) {

    //  this.updatetest(value, selectedData);
    if (e.checked == true) {
      this.ItemList.push(selectedData);

    }
    else {
      
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
    
    //var list = new Array({ "ids:"});
    var list: String[]=[];

    // this.ItemList.forEach(value => list.push(value.id));

    for (let i = 0; i < this.ItemList.length; i++) {
      
      list.push(this.ItemList[i].id.toString());

    }
    
    


    var temp = list.join(",");
    
    this.test = ('{"IDs": "'+ temp +'" }');

    //let others = [];
    //this.ItemList.map(item => {
    //  return {
    //    ids: item.ID
    //  }
    //}).forEach(Item = > others.push(Item));
  }
  
  ondelete() {
    if (!this.selection.selected.length) {
      this.toastr.warning('Please select a record.');
      return false;
    }
    const ids = this.selection.selected.map(item => item.id).join(',');
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.freightservice.deleteAllFreightequipmenttype(ids).subscribe(async x => {
        var selected = this.selection.selected.map(function (a) { return a["id"]; });;
        await this.getPageSize();
        await this.geteMapEquipmentTypeByFreightModeId();
        const newList = this.dataSource.data.filter(item => !selected.includes(item.id));
        this.freightservice.setDatasourceFromEditmap(newList);
        this.freightservice.count = newList.length;
        this.selection.clear();
        this.toastr.success('Equipment type deleted successfully.');
    }, (reason) => {
    });
    });


  }



 



//  let data = [{
//  "name": "Btech",
//  "courseid": "1",
//  "courserating": 5,
//  "points": "100",
//  "type": "computers"
//},

//let other = []; // your other array...

//data.map(item => {
//  return {
//    courseid: item.courseid,
//    name: item.name
//  }
//}).forEach(item => other.push(item));

//console.log(JSON.stringify(other))
//// => [{"courseid":"1","name":"Btech"},{"courseid":"2","name":"BCom"}]




  openEditEquipmentType(action) {
    if (action === "addNew") {
      this.modalRef = this.modalService.open(EditMapEquipmentTypeComponent, { size: 'md', backdrop: 'static' });
      this.btn = 'btn1';
      this.modalRef.result.then(async () => {
        await this.getPageSize();
        this.freightservice.datasourceformattable.subscribe(res => {
          this.dataSource.data = res;
        });
      });

    } else if (action === "edit") {
      this.modalRef = this.modalService.open(EditMapEquipmentTypeComponent, { size: 'md', backdrop: 'static' });
      this.btn = 'btn2';

    } else if (action === "delete") {
      this.btn = 'btn3';
    } else if (action === "export") {
      this.btn = 'btn4';
    } else if (action === "import") {
      this.btn = 'btn5';
    }
  }

}
export class Id {
  constructor(public Ids: any) {
  }
}
