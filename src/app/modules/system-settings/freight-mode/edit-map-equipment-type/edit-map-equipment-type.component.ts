import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'select2';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FreightModeService } from '../../services/freightmode.service';
import { FreightMode,equipmenttype, mapequipmenttypefreightmode } from '../../modals/freightmode';

import { UseraccessService, AuthService, RolesViewModel, UserRolesListViewModel } from '../../../../core';
import {  ToastrService } from 'ngx-toastr';




export class equipmenttype1 {


  public Id: number;
  public EquipmentClassId: number;
  public Code: string;
  public Name: string;
  public Description: string;
  public MaxPalletQty: number;
  public LeastFillPalletQty: number;
  public IsDeleted: boolean;
  public ClientId: number;
  public SourceSystemId: number;
  public UpdatedBy: string;
  public UpdateDateTimeServer: Date;
  public UpdateDateTimeBrowser: Date;
  public CreatedBy: string;
  public CreateDateTimeBrowser: Date;
  public CreateDateTimeServer: Date;

}

export interface PeriodicElement {
  id: number;
  EquipmentType: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  //{ EquipmentType: 'IMDLContainer' },
  //{ EquipmentType: 'IMDLContainer60' }
];

@Component({
  selector: 'app-edit-map-equipment-type',
  templateUrl: './edit-map-equipment-type.component.html',
  styleUrls: ['./edit-map-equipment-type.component.css']
})
export class EditMapEquipmentTypeComponent implements OnInit {

  displayedColumns = ['EquipmentType'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @Input('item') fid: number;
  subs = new Subscription();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  equiplist: equipmenttype[] = [];
  public mapData: any[];
  public options: Options;
  @Input() dataSource1: mapequipmenttypefreightmode[] = [];

  equipmentlist: equipmenttype = new equipmenttype();
  @Input() data: mapequipmenttypefreightmode[] = [];
    id: number;
  FreightModeID: number;
  Freightmodelid: any[] = [];

  alreadySelectedItems: any[];
  commonViewModel = {
    ClientId: this.authenticationService.currentUserValue.ClientId,
    FreightModeID: this.freightservice.entrylist[0].id,
    PageNumber: 1,
    PageSize: 10,
    ItemsLength: 10,
    PageSizeOptions: [10, 20, 30, 40, 50],
    SortOrder: "ASC",
    SortColumn: '',
    FilterOn: ''
  };
  

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
    public activeModal: NgbActiveModal, public freightservice: FreightModeService, private authenticationService: AuthService,
    private toastr: ToastrService
  ) { }

  
  
  itemListA = [];
  selectedItemsA = [];
  settings = {};
  count = 3;

  ngOnInit(): void {
    this.dataSource.data = [];
    this.getequiplistlist();

    //this.itemListA = [{"id": this.itemListA[0].Id, }];

    this.settings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],      
      badgeShowLimit: 3
    };
    this.Freightmodelid = this.freightservice.entrylist;
    this.Freightmodelid.map(val => {val.id = val.id });


    
  }

  onAddItem(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onItemSelect() {
    this.dataSource.data = this.selectedItemsA.map((item) => ({id: item.id, EquipmentType: item.itemName }));
  }

  getequiplistlist() {
    
    this.freightservice.getAllequip().subscribe((e1: any) => {
      this.equiplist = e1.data.sort((a, b) => Number(a.Id) - Number(b.Id));
      this.itemListA = this.equiplist.map((val: any) => ({itemName: val.name, id: val.id}));
      
      this.freightservice.getequiplist(this.equiplist);

      const subs = this.freightservice.datasourceformattable.subscribe(list => {
        this.alreadySelectedItems = list;
        const selectedNames = list.map(item => item.equipmentTypeName);
        this.itemListA = this.itemListA.filter(item => !selectedNames.includes(item.itemName));
        subs.unsubscribe();
      });

    }
    );
  }
  close() {
    this.freightservice.getMapEquipmentTypeByFreightMode(this.commonViewModel)
      .subscribe(result => {      
        this.freightservice.setDatasourceFromEditmap(result.data);
        this.freightservice.count = result.data.length;
      });    
    
    this.activeModal.close();
   
  }
  private Datas(equipmentTypeID): mapequipmenttypefreightmode {
    const model: mapequipmenttypefreightmode = new mapequipmenttypefreightmode();
    model.FreightModeID = this.freightservice.entrylist[0].id;
    model.EquipmentTypeID = equipmentTypeID;
    model.IsDeleted = false;
    model.ClientId = this.authenticationService.currentUserValue.ClientId;
    model.SourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    model.CreatedBy = this.authenticationService.currentUserValue.LoginId;
    model.CreateDateTimeBrowser = new Date(new Date().toISOString());
    model.CreateDateTimeServer = new Date(new Date().toISOString());
    model.UpdatedBy = this.authenticationService.currentUserValue.LoginId;
    model.UpdateDateTimeBrowser = new Date(new Date().toISOString());
    model.UpdateDateTimeServer = new Date(new Date().toISOString());
    return model;
  }

  onfinish() {        
    if (!this.selectedItemsA.length) {
      this.toastr.warning('Please select an equipment.');
      return;
    }
    this.dataSource1 = [];
    for (let i = 0; i < this.selectedItemsA.length; i++) {
      this.dataSource1.push(this.Datas(this.selectedItemsA[i].id));
    }
    this.freightservice.addAllFreightequipmenttype(this.dataSource1).subscribe(x => {
      this.toastr.success('User is saved successfully.');
      const dataForGrid = this.selectedItemsA.map((item, i) => {
        return { ...this.dataSource1[i], equipmentTypeName: item.itemName, id: x.data[i].id };
      });
      this.freightservice.setDatasourceFromEditmap([...this.alreadySelectedItems, ...dataForGrid]);
      this.activeModal.close();
    });
  }
}

  
