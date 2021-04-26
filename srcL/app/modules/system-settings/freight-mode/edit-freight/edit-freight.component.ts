import { Component, OnInit, ViewChild, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import moment from 'moment';
import { FreightModeService } from '../../services/freightmode.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { FreightMode, mapequipmenttypefreightmode, FreightModeEitModel } from '../../modals/freightmode';
import { FormBuilder, NgForm, FormGroup } from '@angular/forms';
import { ActionType } from '../../../../core/models/action-group';
import { User } from '../../../../core';
import { Data } from 'ngx-bootstrap/positioning/models';
import { ManageFreightModeStateService } from '../freightMode-state.service';




@Component({
  selector: 'app-edit-freight',
  templateUrl: './edit-freight.component.html',
  //template: `<app-freight - list (checkBoxClick)="setFreightDetails($event)" > </app-freight-list>`,
  styleUrls: ['./edit-freight.component.css']
})
export class EditFreightComponent implements OnInit, OnDestroy {

  mapEquipmentType: boolean = false;
  modalRef: NgbModalRef;
  FreightViewModel: FreightMode = new FreightMode();
  freightModal: FreightMode[];
  inActive: boolean;
  lastUpdate: string; lastUpdatedBy: string; IsLastUpdated: boolean = false;
  //@Input() datasource: FreightMode[] = [];
  datasources: FreightMode[] = [];
  @Output('checkBoxClick') checkBoxClick = new EventEmitter<FreightMode[]>();
  currentUser: User;
  index: number = 0;
  equipforfreight: mapequipmenttypefreightmode[] = [];

  subs = new Subscription();

  @Input() isAddNew: boolean;
  editMode = true;

  constructor(private FMservice: FreightModeService, private Toast: ToastrService,
    private fbbuilder: FormBuilder, private authenticationService: AuthService,
    private freightModeState: ManageFreightModeStateService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnDestroy(): void {
    // this.freightModeState.selectedFreightModes = [];
    this.subs.unsubscribe();
  }

  public exampleData: Array<Select2OptionData>;
  public options: Options;
  public value: string;

  ngOnInit(): void {
    this.inActive = this.FMservice.permission ? false : true;

    if (this.isAddNew) {
      this.isAddNew = true;
      this.editMode = false;
    } else {
      this.datasources = this.freightModeState.selectedFreightModes;
      if (this.datasources.length) {
        this.selected(0);
      }

      let m1 = moment(this.FreightViewModel.updateDateTimeBrowser).format('MMMM DD, YYYY hh:mm A');
      let timeZone = moment.tz.guess();
      var timeZoneOffset = new Date(this.FreightViewModel.updateDateTimeBrowser).getTimezoneOffset();
      timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);
      this.lastUpdate = m1 + " " + timeZone;
      this.FreightViewModel.updatedBy = this.currentUser.LoginId;
    }
    //this.FreightViewModel = this.Data();

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

  }


  openAccordion(action = "") {
    if (action === "mapEquipmentType") {

      this.mapEquipmentType = !this.mapEquipmentType;

    }
  }


  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  //@ViewChild(MapEquipmentTypeComponent) lis: MapEquipmentTypeComponent;

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
    this.FMservice.entrylist = [];
    this.FMservice.getfreight(this.FreightViewModel);
    this.retrivefreightlist();
    this.editMode = true;
  }

  retrivefreightlist() {
    
    this.FMservice.setDatasourceFromEditmap([]);
    this.equipforfreight = [];
    this.subs.add(this.FMservice.getequipfreightIdsbyList(this.FreightViewModel.id).subscribe((result: any) => {

      if (result && result.data) {
        this.equipforfreight = result.data.sort((a, b) => Number(a.EquipmentTypeID) - Number(b.EquipmentTypeID));
        this.FMservice.setDatasourceFromEditmap(this.equipforfreight);
        //await this.lis.getPageSize();
      }
    }));

  }
  removeFreightModeFromEditList(freightModeToRemove: FreightModeEitModel) {
    this.datasources.splice(this.datasources.findIndex(item => item.id === freightModeToRemove.id), 1)
    this.checkBoxClick.emit(this.datasources);
  }

  onSubmit(formGroup: FormGroup, moveNext = false) {
    if (formGroup.invalid) {
      this.Toast.error('Required fields must be filled.');
      return;
    }
    let Freightlist: FreightMode[] = [this.FreightViewModel];
    this.FreightViewModel.code = this.FreightViewModel.name;
    this.FreightViewModel.description = this.FreightViewModel.name;
    this.FreightViewModel.clientID = this.currentUser.ClientId;
    this.FreightViewModel.updatedBy = this.currentUser.LoginId;
    this.FreightViewModel.sourceSystemID = this.currentUser.SourceSystemID;
    this.FreightViewModel.createdBy = this.currentUser.LoginId;
    this.FreightViewModel.createDateTimeBrowser = new Date();
    //  this.FreightViewModel.createDateTimeServer = new Date(new Date().toISOString());
    this.FreightViewModel.updateDateTimeBrowser = new Date();
    this.FreightViewModel.updatedDateTimeBrowserStr = new Date().toUTCString();
    if (this.editMode) {


      this.subs.add(this.FMservice.updateAllFreight(Freightlist).subscribe(x => {
        this.Toast.success('Freight lane has been update successfully');
        this.FMservice.getfreight(this.FreightViewModel);
        this.FreightViewModel.updateDateTimeServer = new Date();
        this.FreightViewModel.updateDateTimeBrowser = new Date();
        let m1 = moment(this.FreightViewModel.updateDateTimeBrowser).format('MMMM DD, YYYY hh:mm A');
        let timeZone = moment.tz.guess();
        var timeZoneOffset = new Date(this.FreightViewModel.updateDateTimeBrowser).getTimezoneOffset();
        timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);
        this.lastUpdate = m1 + " " + timeZone;
        this.FreightViewModel.updatedBy = this.currentUser.LoginId;
        if (moveNext) {
          this.moveNext();
        }
      }));
    } else {
      
   //   this.FreightViewModel.updateDateTimeServer = new Date(new Date().toISOString());
      this.FreightViewModel.externalSourceFreightModeKey = '';
      this.subs.add(this.FMservice.addAllFreight([this.FreightViewModel]).subscribe(x => {
        this.Toast.success('Freight has been added successfully');
        this.FreightViewModel.id = x.data[0].id;
        this.FMservice.getfreight(this.FreightViewModel);
        this.datasources.push(this.FreightViewModel);
        this.moveNext();
        formGroup.reset();
      }));
    }

  }

  private moveNext() {
    if (this.isAddNew) {
      this.FreightViewModel = new FreightMode();

      this.editMode = false;
      return;
    }
    this.index = this.index === this.datasources.length - 1 ? 0 : this.index + 1;
    this.selected(this.index);

  }

}
