import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
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
  ItemList: mapequipmenttypefreightmode[] = [];
  FreightviewModeID : FreightMode[]  = [];

  displayedColumns = ['selectRow','EquipmentTypeName'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    dataforfreightid: any[]=[];
    List: any;
  FreightModeID: number;

    product: freightid[] = [];
    itemList: freightid[] = [] ;
  equipforfreight: mapequipmenttypefreightmode[] = [];
    equiplist: equipmenttype[] = [];
  filteredKeywords: any;
  ResultArrayObjOne: equipmenttype[] = [];
   test: string;

  ngAfterViewInit() {
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    console.log("selected item", this.selection);
    //this.equiptypetable();
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

  btn: any
  btn1: any
  btn2: any
  btn3: any
  btn4: any
  btn5: any

  
  constructor(
    public modalService: NgbModal, public freightservice: FreightModeService, private toastr: ToastrService
  ) {}
  

  ngOnInit(): void {

    this.freightservice.datasourceformattable.subscribe(res => {
      this.dataSource.data = res;
    });
    
    this.FreightModeID = this.freightservice.entrylist[0].id;
    this.retrivefreightlist(); 

    console.log("datasource data:", this.dataSource);
    //console.log("itemlist:", this.ItemList);
    console.log("Freight data:", this.freightservice.datasourceformattable[0]);
    console.log("Freight data from service:", this.freightservice.datasourceformattable);
    //this.dataSource.data.push({ ID: , EquipmentTypeName: });
    this.dataSource._updateChangeSubscription();
    
    
  }
 

  retrivefreightlist() {

    this.freightservice.getequipfreightIdsbyList(this.FreightModeID).subscribe((result: any) => {
      //debugger
      console.log("result", result);
      if (result.data) {
        this.equipforfreight = result.data.sort((a, b) => Number(a.EquipmentTypeID) - Number(b.EquipmentTypeID));
        this.freightservice.setDatasourceFromEditmap(this.equipforfreight);
      }
      
    });
    
  //  this.equiptypetable();
  }

  selectedCheckbox(e: any, selectedData) {

    //debugger
    console.log('selecteddata checked', e.checked);
    console.log('selecteddata', e, selectedData);

    //if (selectedData.index != 0 ) {

    //  this.updatetest(value, selectedData);
    if (e.checked == true) {
      this.ItemList.push(selectedData);


      console.log('checked', selectedData)
      console.log('selectedData id  ', selectedData.id);
    }
    else {
      console.log('unchecked', selectedData)
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
    console.log('output', this.ItemList)
    //var list = new Array({ "ids:"});
    var list: String[]=[];

    // this.ItemList.forEach(value => list.push(value.id));

    for (let i = 0; i < this.ItemList.length; i++) {
      console.log('list  ' + i, this.ItemList[i].id);
      list.push(this.ItemList[i].id.toString());

    }

    console.log('list  ', list);


    var temp = list.join(",");
    console.log('temp ', temp);
    console.log('final value ',"{IDS:" + temp + "}");
    this.test = ('{"IDs": "'+ temp +'" }');
    console.log('test ', this.test);
    



    //let others = [];
    //this.ItemList.map(item => {
    //  return {
    //    ids: item.ID
    //  }
    //}).forEach(Item = > others.push(Item));
  }
  
  ondelete() {
    if (this.ItemList.length -1 < 0) {
      this.toastr.warning('Please select any one ');

    }
    this.freightservice.deleteAllFreightequipmenttype(this.test).subscribe(x => {
      console.log("delete", x);

      const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
      this.freightservice.setDatasourceFromEditmap(newList);
      this.ItemList = [];
      this.toastr.success('Equipment type deleted successfully');
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
