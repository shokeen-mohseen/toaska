import { Component, OnInit, ViewChild, Input, DoCheck, AfterViewChecked, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FreightMode, equipmenttype, mapequipmenttypefreightmode, FreightModeEitModel } from '../../modals/freightmode';
import { FreightModeService } from '../../services/freightmode.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, NgForm, FormGroup, FormControl } from '@angular/forms';
import { AuthService, User } from '../../../../core';
import { Subscription, Observable } from 'rxjs';
import { Item } from 'angular2-multiselect-dropdown';
import { AppSidebarNavItemsComponent } from '@coreui/angular/lib/sidebar/app-sidebar-nav/app-sidebar-nav-items.component';
import { MatTableDataSource } from '@angular/material/table';
import { concat } from 'rxjs/operators';
import { ActionType } from '../../../../core/models/action-group';




export class PeriodicElement {
  id: any;
  code: string;
  name: string;
  description: string;
  fuelSurFreightModePercentageRate: number;
  milesPerGallon: number;
  milesPerHour: number;
  driverHoursPerDay: number;
  isDeleted: boolean;
  clientID: number;
  sourceSystemID: number;
  createdBy: string;
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  updatedBy: string;
  updateDateTimeServer: Date;
  updateDateTimeBrowser: Date;


}

@Component({
  selector: 'app-add-freight',
  templateUrl: './add-freight.component.html',
  styleUrls: ['./add-freight.component.css']
})
export class AddFreightComponent implements OnInit {
  name: string = '';
  description: string = '';
  fuelSurFreightModePercentageRate: number;
  milesPerGallon: number;
  milesPerHour: number;
  driverHoursPerDay: number;
  isDeleted: boolean = false;
  clientID: number = 0;
  sourceSystemID: number;
  createdBy: string = '';
  createDateTimeBrowser: Date
  createDateTimeServer: Date
  updatedBy: string = '';
  setupComplete: boolean = false;
  setupCompleteDateTime: Date;
  setupCompleteBy: string;
  updateDateTimeBrowser: Date
  updateDateTimeServer: Date
  externalSourceFreightModeKey: string = '';
  isduplicate: boolean;
  commonViewModel: FreightMode = new FreightMode();
  viewModelObject: PeriodicElement[] = [];
  freightForm: FormGroup;
  FrieghtServiceSubcriber: Subscription;
  freightViewModel: FreightMode = new FreightMode();
  @Input() dataSource: FreightMode[] = [];
  datamodel1 = new MatTableDataSource<PeriodicElement>(this.viewModelObject);
  //@Input() datasources: FreightMode[] = [];
  @Output() freightmodeid = new EventEmitter<any>();
  @Input() actionSource: Observable<ActionType>;
  freightid: number;
  massage = null;
  mapEquipmentType: boolean = false;
  indexId: number = 0;
  next: number = 0;
  isSelectdRow: boolean = false;
  currentUser: User;
  Name: string;
  Dname: string = '';
  tname: string[] = [];
  sname: string[] = [];

  freightViewModellist: FreightMode[] = [];
  datasourcelist: FreightMode[] = [];
  allfreight: FreightMode[] = [];
  //sidellist: Array<any>[] = [];
  sidellist: FreightMode[] = [];
  sidellistlastfive: FreightMode[] = [];
  sidellistlastfiveasend: FreightMode[] = [];
  sidellistlastfivedesc: FreightMode[] = [];
    e1: () => FreightMode;
  sortarray: FreightMode[] = [];
  array_last_five: FreightMode[] = [];
  isDuplicateSidelistAndFridge: boolean = false;
  i: number;
  public myform: FormGroup;
  equiplist: equipmenttype[] = [];
  equipforfreight: mapequipmenttypefreightmode[] = [];
    
  //sidellist: FreightMode[] = [];
  constructor(private freightmodeService: FreightModeService, private authenticationService: AuthService, private toastr: ToastrService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }
  

  ngOnInit(): void {
    this.getfreightlist();
    this.freightmodeService.datasourceformattable.subscribe(list => this.equiplist = list);
    
  }

  openAccordion(action = "") {
    if (action === "mapEquipmentType") {

      this.mapEquipmentType = !this.mapEquipmentType;

    }
  }

  getfreightlist() {
    

    this.freightmodeService.getAll(this.commonViewModel).subscribe((e1: any) => {
      
      //console.log("e1", e1);
      

      //console.log("response", e1.data);
      e1.data.forEach(element => {
        
        this.sidellist.push(element);
      });

      this.sidellist = this.sidellist.sort((a, b) => Number(a.id) - Number(b.id));     
    }
    );
  }

  getRequiredErrorMessage(field) {
    return this.myform.get(field).hasError('required') ? 'You must enter a value' : '';
  }

  addFreight(isSubmit: boolean = false): boolean {
    this.freightViewModel = this.Data();
    this.isDuplicateSidelistAndFridge = this.isDuplicateSidelistAndFridgeviewmodellist()
    if (this.isDuplicateSidelistAndFridge == false) {
      this.dataSource.push(Object.assign({}, this.freightViewModel));
      this.isduplicate = false;
    } else {
      //this.toastr.error('User already exist');
      this.isduplicate = true;
      this.dataSource.pop();
      this.freightViewModellist.pop();
   }
    if (!isSubmit)
      this.toastr.success('User is saved successfully.');
    return true;
  }
  private Data(): FreightMode {
    this.freightViewModel.code = this.name;
    this.freightViewModel.name = this.name;
    this.freightViewModel.description = this.name;
    this.freightViewModel.fuelSurFreightModePercentageRate = this.fuelSurFreightModePercentageRate;
    this.freightViewModel.milesPerGallon = this.milesPerGallon;
    this.freightViewModel.milesPerHour = this.milesPerHour;
    this.freightViewModel.driverHoursPerDay = this.driverHoursPerDay;
    this.freightViewModel.isDeleted = this.isDeleted;
    this.freightViewModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.freightViewModel.sourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;
    this.freightViewModel.createdBy = this.authenticationService.currentUserValue.LoginId;
    this.freightViewModel.setupComplete = this.setupComplete;
    this.freightViewModel.setupCompleteBy = this.setupCompleteBy;
    this.freightViewModel.setupCompleteDateTime = this.setupCompleteDateTime;
    this.freightViewModel.createDateTimeBrowser = new Date(new Date().toISOString());
    this.freightViewModel.createDateTimeServer = new Date(new Date().toISOString());
    this.freightViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    this.freightViewModel.updateDateTimeBrowser = new Date(new Date().toISOString());
    this.freightViewModel.updateDateTimeServer = new Date(new Date().toISOString());
    this.freightViewModel.externalSourceFreightModeKey = '';
    console.log("Freightviewmodel", this.freightViewModel);
    return this.freightViewModel;
    
  }

  selected(i) {

    if (i > 1) {
      this.freightmodeService.entrylist = [];
    }
    this.freightViewModel = this.dataSource[i];
    this.freightmodeService.entrylist = [];
    this.freightmodeService.getfreight(this.freightViewModel);
    this.retrivefreightlist();
  }

  setupCompleteChange() {
    if (this.setupComplete) {
      this.setupCompleteBy = this.currentUser.LoginId;
      this.setupCompleteDateTime = new Date(new Date().toISOString());
    } else {
      this.setupCompleteBy = '';
      this.setupCompleteDateTime = null;
    }
  }

  private isDuplicateSidelistAndFridgeviewmodellist(): boolean {
    for (let j = 0; j < this.sidellist.length; j++) {     

      if (this.sidellist[j].name == this.freightViewModel.name)
        return true;
     
    }
    return false;
  }
  selectedUser(index: number) {
    if (index > 1) {
      this.freightViewModel = this.dataSource[index];
    }
    else {
      this.freightViewModel = this.dataSource[index];
    }
  }
  setUserDetails(index: number) {

    const nextResult = this.dataSource[this.next];
    this.freightViewModel = Object.assign(new FreightMode(), nextResult);
  }
  selectPrev(el) {
    el.selectedIndex -= 1;
  }
  onSubmit() {
    if (this.addFreight(true) && this.isduplicate == false) {
      
        this.i = this.dataSource.length - 1;
      this.datasourcelist.push(this.dataSource[this.i]);      
      this.freightmodeService.addAllFreight(this.dataSource).subscribe(x => {
        
        this.toastr.success('User is saved successfully.');
        this.dataSource[this.i].id = x.data[0].id;
        this.sidellist.push(this.dataSource[this.i]);
        this.sidellistlastfive.push(this.dataSource[this.i]);
        console.log("sidelistlastfive", this.sidellistlastfive);
        this.dataSource = [];
        // this.sidellist = [];
        //this.getfreightlist();
        this.useraddsuccess();  
      });
      //console.log("output freightViewModellist", this.freightViewModellist);
    } else {
      this.toastr.error('User already exists.');
    }
  }
  useradd() {
    if (this.addFreight(true) && this.isduplicate == false) {
     
      if (this.dataSource.length == 1) {
        this.i = 0;
      }
      else if (this.dataSource.length > 1) {
        this.i = this.dataSource.length - 1;

      }      
      this.datasourcelist.push(this.dataSource[this.i]);
      //console.log("datasourelist before input", this.i);
      //console.log("datasoure before insert", this.dataSource)
      //console.log("datasourelist before insert",this.datasourcelist)
      this.freightmodeService.addAllFreight(this.dataSource).subscribe(x => {
        
        console.log("useradd", x);
        this.dataSource[this.i].id = 0;
        //console.log("output freightview model", this.freightViewModel);
        //console.log("output datasource", this.dataSource);
        this.toastr.success('User is saved successfully.');
        //this.sidellistlastfive.push(this.dataSource[0]);
        this.sidellist.push(this.dataSource[this.i]);

        this.sidellistlastfive.push(this.dataSource[this.i]);
        //if (this.sidellist.length < 6) {
        //  this.sidellistlastfive.shift();
        //}

        console.log("sidelistlastfive", this.sidellistlastfive);
        //console.log("sidellist", this.sidellist);
        this.dataSource = [];
        this.sidellist = [];
        //this.getfreightlist();
        this.useraddsuccess();
        console.log("sidelist after freight created", this.sidellist);
      });
      
      //console.log("output freightViewModellist", this.freightViewModellist);
    } else {
      this.toastr.error('User already exists.');
    }
   
  }

  useraddsuccess() {

    this.freightmodeService.getAll(this.freightViewModel).subscribe((e1: any) => {

      //console.log("e1", e1);
      //console.log("response", e1.data);
      e1.data.forEach(element => {
        this.sidellist.push(element);
      });

      this.sidellist = this.sidellist.sort((a, b) => Number(a.id) - Number(b.id));
      this.freightid = this.sidellist[(this.sidellist.length - 1)].id;
      
      this.freightViewModel.id = this.sidellist[(this.sidellist.length - 1)].id;
      this.freightViewModel.code = this.name;
      this.freightViewModel.name = this.name;
      this.freightViewModel.description = this.name;
      this.freightViewModel.fuelSurFreightModePercentageRate = this.fuelSurFreightModePercentageRate;
      this.freightViewModel.milesPerGallon = this.milesPerGallon;
      this.freightViewModel.milesPerHour = this.milesPerHour;
      this.freightViewModel.driverHoursPerDay = this.driverHoursPerDay;
      this.freightViewModel.isDeleted = this.isDeleted;
      this.freightViewModel.clientID = this.authenticationService.currentUserValue.ClientId;
      this.freightViewModel.sourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;
      this.freightViewModel.createdBy = this.authenticationService.currentUserValue.LoginId;
      this.freightViewModel.createDateTimeBrowser = new Date(new Date().toISOString());
      this.freightViewModel.createDateTimeServer = new Date(new Date().toISOString());
      this.freightViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
      this.freightViewModel.updateDateTimeBrowser = new Date(new Date().toISOString());
      this.freightViewModel.updateDateTimeServer = new Date(new Date().toISOString());
      this.freightViewModel.externalSourceFreightModeKey = '';

      console.log("sidelist id ", this.sidellist[(this.sidellist.length - 1)].id);
      console.log("Freightviewmodel ", this.freightViewModel);
      this.freightmodeService.getfreight(this.sidellist[(this.sidellist.length-1)]);
      this.retrivefreightlist();


    });
    this.freightmodeService.getfreight(this.sidellist.slice(-1)[0]);
    this.retrivefreightlist();

  }
  removeFreightModeFromEditList(freightModeToRemove: FreightModeEitModel) {

    this.dataSource.splice(this.dataSource.findIndex(item => item.id === freightModeToRemove.id), 1)
  }
  retrivefreightlist() {
    this.freightmodeService.setDatasourceFromEditmap([]);
    this.freightmodeService.getequipfreightIdsbyList(this.sidellist.slice(-1)[0].id).subscribe((result: any) => {
      console.log("result", result);
      if (result && result.data) {
        this.equipforfreight = result.data.sort((a, b) => Number(a.EquipmentTypeID) - Number(b.EquipmentTypeID));
        this.freightmodeService.setDatasourceFromEditmap(this.equipforfreight);
      }
    });
  }

  selectnext(index: number) {

    this.selected(index);

  }

 }

  

  
