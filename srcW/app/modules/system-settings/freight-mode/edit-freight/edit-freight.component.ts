import { Component, OnInit, ViewChild, Input, OnDestroy, EventEmitter } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { FreightModeService } from '../../services/freightmode.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { FreightMode, mapequipmenttypefreightmode, FreightModeEitModel } from '../../modals/freightmode';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActionType } from '../../../../core/models/action-group';
import { User } from '../../../../core';
import { Data } from 'ngx-bootstrap/positioning/models';




@Component({
  selector: 'app-edit-freight',
  templateUrl: './edit-freight.component.html',
  //template: `<app-freight - list (checkBoxClick)="setFreightDetails($event)" > </app-freight-list>`,
  styleUrls: ['./edit-freight.component.css']
})
export class EditFreightComponent implements OnInit, OnDestroy {

  editfrieght: FormBuilder;



  code: string = '';
  name: string = '';
  description: string = '';
  fuelSurFreightModePercentageRate: number = 0;
  milesPerGallon: number = 0;
  milesPerHour: number = 0;
  driverHoursPerDay: number = 0;
  isDeleted: boolean = false;
  clientID: number = 0;
  sourceSystemID: number = 0;
  createdBy: string = '';
  createDateTimeBrowser: Date;
  createDateTimeServer: Date;
  updatedBy: string = '';
  updateDateTimeBrowser: Date
  updateDateTimeServer: Date
  externalSourceFreightModeKey: string = '';
  setupComplete: boolean;
  setupCompleteBy: string;
  setupCompleteDateTime: Data;
  mapEquipmentType: boolean = false;
  modalRef: NgbModalRef;
  FreightViewModel: FreightMode = new FreightMode();
  //@Input() datasource: FreightMode[] = [];
  @Input() datasources: FreightMode[] = [];
  @Input() actionSource: Observable<ActionType>;
  selectedDatasources: FreightMode;
  organizationlist = [];
  FrieghtServiceSubcriber: Subscription;
  currentUser: User;
  next: number = 0;
  localTimeStr: string;
  updateBy: string;
  id: number;
  data: any;
  test: string;
  private countref: Subscription = null;
  emitref: Subscription = null;
  selectedPosition = 0;
  count: any;
  index: number = 0;
    FreightModeID: number;
  equipforfreight: mapequipmenttypefreightmode[] = [];

  subs = new Subscription();

  constructor(private FMservice: FreightModeService, private Toast: ToastrService, private fbbuilder: FormBuilder, private authenticationService: AuthService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public exampleData: Array<Select2OptionData>;
  public options: Options;
  public value: string;

  ngOnInit(): void {
    //debugger;

    this.FreightViewModel = this.datasources[this.selectedPosition];
    //this.FreightViewModel = this.Data();
    console.log("Edit", this.datasources);
    console.log("Freightviewmodel", this.FreightViewModel);

    this.FMservice.setDatasourceFromEditmap([]);
    
    this.subs.add(this.FMservice.datasourceformattable.subscribe(list => {
      this.equipforfreight = list;
    }));
    


    this.options = {
      multiple: true,
      theme: 'classic',
      closeOnSelect: false,
      width: '300',
      tags: true
    };

    this.selected(0);

  }


  openAccordion(action = "") {
    if (action === "mapEquipmentType") {

      this.mapEquipmentType = !this.mapEquipmentType;

    }
  }


  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  private Data(): FreightMode {
    this.FreightViewModel.code = this.name;
    this.FreightViewModel.name = this.name;
    this.FreightViewModel.description = this.name;
    this.FreightViewModel.fuelSurFreightModePercentageRate = this.fuelSurFreightModePercentageRate;
    this.FreightViewModel.milesPerGallon = this.milesPerGallon;
    this.FreightViewModel.milesPerHour = this.milesPerHour;
    this.FreightViewModel.driverHoursPerDay = this.driverHoursPerDay;
    this.FreightViewModel.isDeleted = this.isDeleted;
    this.FreightViewModel.clientID = this.currentUser.ClientId;
    this.FreightViewModel.sourceSystemID = 1;
    this.FreightViewModel.updatedBy = this.currentUser.LoginId;
    this.FreightViewModel.updateDateTimeBrowser = new Date(new Date().toISOString());
    this.FreightViewModel.updateDateTimeServer = new Date(new Date().toISOString());
    this.FreightViewModel.externalSourceFreightModeKey = '';
    return this.FreightViewModel;
  }

  setupCompleteChange() {
    if (this.FreightViewModel.setupComplete) {
      this.FreightViewModel.setupCompleteBy = this.currentUser.LoginId;
      this.FreightViewModel.setupCompleteDateTime = new Date(new Date().toISOString());
    } else {
      this.FreightViewModel.setupCompleteBy = '';
      this.FreightViewModel.setupCompleteDateTime = null;
    }
  }



  selected(i) {
    
    if (i > 1) {
      this.FMservice.entrylist = [];
    }
    this.FreightViewModel = this.datasources[i];
    console.log("Edit selectedDatasources", this.FreightViewModel);
    this.FMservice.entrylist = [];
    this.FMservice.getfreight(this.FreightViewModel);
    this.retrivefreightlist();
    //return this.FreightViewModel;
    //this.next = i;
    //this.setFreightDetails(this.next);
  }

  //setFreightDetails(index: number) {
  //  const nextResult = this.datasources[this.next];
  //  this.name = nextResult.name;
  //  this.FreightViewModel = nextResult;

  //}
  retrivefreightlist() {
    this.FMservice.setDatasourceFromEditmap([]);
    this.equipforfreight = [];
    this.FreightModeID = this.FreightViewModel.id;
    this.subs.add(this.FMservice.getequipfreightIdsbyList(this.FreightModeID).subscribe((result: any) => {
      //debugger
      console.log("result", result);
      if (result && result.data) {
        this.equipforfreight = result.data.sort((a, b) => Number(a.EquipmentTypeID) - Number(b.EquipmentTypeID));
        this.FMservice.setDatasourceFromEditmap(this.equipforfreight);
      }
    }));

    console.log("equipforfreight", this.equipforfreight);
    //  this.equiptypetable();
  }
  removeFreightModeFromEditList(freightModeToRemove: FreightModeEitModel) {

    this.datasources.splice(this.datasources.findIndex(item => item.id === freightModeToRemove.id), 1)
  }

  onSubmit() {
    debugger
    //this.FreightViewModel = this.Data();
    let Freightlist: FreightMode[] = [];
    this.datasources.map(row => {
      let freightView = Object.assign({}, row);
      Freightlist.push(freightView);

    });
    this.subs.add(this.FMservice.updateAllFreight(Freightlist).subscribe(x => {
      console.log(x);
      this.Toast.success('Freight has been update successfully');
      //this.FMservice.entrylist = [];
      this.FMservice.getfreight(this.FreightViewModel);
      
    }));
  }


  
  

  selectcount() {
    this.index = this.index + 1;
    console.log("clicked" + this.index);
    this.selectnext(this.index);
  }

  selectnext(index: number) {

    this.selected(index);

    }
 
}
