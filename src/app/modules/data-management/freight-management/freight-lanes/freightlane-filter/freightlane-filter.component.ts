import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { GeolocationService } from '../../../../../core/services/geolocation.services';
import { FreightLaneService } from '@app/core/services/freightlane.service';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
import { FreightLane } from '../../../../../core/models/FreightLane.model';
import { AuthService } from '../../../../../core';
import { NgForm } from '@angular/forms';
import { Form } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FreightLanesListComponent } from '../freight-lanes-list/freight-lanes-list.component';

@Component({
  selector: 'app-freightlane-filter',
  templateUrl: './freightlane-filter.component.html',
  styleUrls: ['./freightlane-filter.component.css']
})
export class FreightlaneFilterComponent implements OnInit {
  @ViewChild(FreightLanesListComponent, { static: false }) freightLanesListComponent: FreightLanesListComponent;
  @Output('FreightLaneFilter') FreightLaneFilter = new EventEmitter<FreightLane[]>();
  @Output('FreightLaneResetFilter') FreightLaneResetFilter = new EventEmitter<string>();
  panelOpenState = false;
  selectedCityItems: []; selectedZipItems: []; zipCode: string;
  stateCode: string; countryCode: string; cityCode: string;
  FstateList: any = []; FcityList: any = []; FzipList: any = [];
  FcountryList: any = []; FreightModeList: any = []; CarrierList: any = [];
  EquipmentList: any = [];
  TstateList: any = []; TcityList: any = []; TzipList: any = [];
  TcountryList: any = [];duplicateList: any = [];
  clientId: number;
  FCountryData = [];
  FStateData = [];
  FCityData = [];
  FZipData = [];
  TCountryData = [];
  TStateData = [];
  TCityData = [];
  TZipData = [];
  FreightModeData = [];
  CarrierData = [];
  EquipmentData = [];
  FreightLanemodel: FreightLane;
  settingsA = {};
  settingsB = {};
  count = 3;
  ngForm: FormGroup;
  selectRow: any;
  constructor(private ptService: PreferenceTypeService,
    private freightLaneService: FreightLaneService,
    private geolocation: GeolocationService,
    private authenticationService: AuthService) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.FreightLanemodel = new FreightLane();
  } 
  ngOnInit(): void {
    this.selectRow = 'selectRow';

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName'],
      addNewItemOnFilter: false
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName'],     
      addNewItemOnFilter: false
    };
    this.FreightLanemodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
    this.GetGeolocation(this.FreightLanemodel);
    this.freightLaneService.GetFreightModeList(this.clientId).subscribe(data => {
      if (data.data != null) {
        this.FreightModeList = data.data;
        this.FreightModeList.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
      }
    });
    this.freightLaneService.GetEquipmentList(this.clientId).subscribe(data => {
      if (data.data != null) {
        this.EquipmentList = data.data;
        this.EquipmentList.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
      }
    });
    this.freightLaneService.GetCarrierList(this.clientId).subscribe(data => {
      if (data.data != null) {

        this.CarrierList = data.data;
      }
    });
  }
  GetGeolocation(modelgeolocation) {
    this.geolocation.GetGeolocation(modelgeolocation).subscribe(data => {
      if (data.data != null) {
        this.BindGelocation(modelgeolocation, data.data);
      }
    });
  }

  BindGelocation(mdgeolocation: FreightLane, data: any[]) {

    if (mdgeolocation.mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.FcountryList = [];
      this.TcountryList = [];

      this.duplicateList = [];
      for (let i = 0; i < data.length; i++) {

        this.duplicateList.push({

          id: data[i].code,
          itemName: data[i].name

        })
      }
      this.FcountryList = this.duplicateList.filter((n, i) => this.duplicateList.indexOf(n) === i);
      this.TcountryList = this.duplicateList.filter((n, i) => this.duplicateList.indexOf(n) === i);

    }
    else if (mdgeolocation.mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.FstateList = [];
      this.TstateList = [];
      for (let i = 0; i < data.length; i++) {

        this.FstateList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
        this.TstateList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
      }

    }

    else if (mdgeolocation.mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.FcityList = [];
      this.TcityList = [];
      for (let i = 0; i < data.length; i++) {

        this.FcityList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
        this.TcityList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
      }


    }
    else if (mdgeolocation.mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.FzipList = [];
      this.TzipList = [];
      for (let i = 0; i < data.length; i++) {

        this.FzipList.push({
          id: data[i].code,
          itemName: data[i].name,


        })
        this.TzipList.push({
          id: data[i].code,
          itemName: data[i].name,


        })
      }

    }
  }

  FreightLaneChange(data, mode, actualPoint = '') {
    
    let countryname = data.itemName;
    this.FreightLanemodel.name = countryname;
    this.FreightLanemodel.code = data.id;
    this.FreightLanemodel.mode = mode;

    if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
      this.countryCode = data.id;
      this.FreightLanemodel.code = this.countryCode;
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('StateData').setValue(null);
      //this.geoform.get('CityData').setValue(null);
      //this.addressModel.CountryCode = data.code;
      //this.addressModel.CountryName = data.countryname;
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('CityData').setValue(null);
      //this.geoform.get('StateData').setValue(null);
      this.FreightLanemodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
      this.stateCode = data.id;
      this.FreightLanemodel.code = this.stateCode;
      this.FreightLanemodel.countryCode = data.id;
    //  this.geoform.get('CountryCode').setValue(data.id);
    }

    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
      this.cityCode = data.id;
      this.FreightLanemodel.code = this.cityCode;
     // this.FreightLanemodel.countryCode = this.geoform.get('CountryCode').value;
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('CityData').setValue(null);

      //this.geoform.get('StateCode').setValue(data.id);
    }
    else if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipCode = data.id;
      this.FreightLanemodel.code = this.zipCode;
      this.FreightLanemodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;


    }

    if (actualPoint == 'COUNTRY' && data.id == "COUNTRYCODE") {
      //this.geoform.get('CountryCode').enable();
      //this.geoform.get('CountryCode').patchValue('');
    }

    else if (actualPoint == 'STATE' && data.id == "STATECODE") {
      //this.geoform.get('StateCode').enable();
      //this.geoform.get('StateCode').patchValue('');
    }
    else if (actualPoint == 'CITY') {

    }

    this.GetGeolocation(this.FreightLanemodel);
  }

  ToFreightLaneChange(data, mode, actualPoint = '') {
    let countryname = data.itemName;
    this.FreightLanemodel.name = countryname;
    this.FreightLanemodel.code = data.id;
    this.FreightLanemodel.mode = mode;

    if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
      this.countryCode = data.id;
      this.FreightLanemodel.code = this.countryCode;
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('StateData').setValue(null);
      //this.geoform.get('CityData').setValue(null);
      //this.addressModel.CountryCode = data.code;
      //this.addressModel.CountryName = data.countryname;
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('CityData').setValue(null);
      //this.geoform.get('StateData').setValue(null);
      this.FreightLanemodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
      this.stateCode = data.id;
      this.FreightLanemodel.code = this.stateCode;
      //this.geoform.get('CountryCode').setValue(data.id);
    }

    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
      this.cityCode = data.id;
      this.FreightLanemodel.code = this.cityCode;
      //this.geoform.get('ZipData').patchValue(null);
      //this.geoform.get('CityData').setValue(null);

      //this.geoform.get('StateCode').setValue(data.id);
    }
    else if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipCode = data.id;
      this.FreightLanemodel.code = this.zipCode;
      this.FreightLanemodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;


    }

    if (actualPoint == 'COUNTRY' && data.id == "COUNTRYCODE") {
      //this.geoform.get('CountryCode').enable();
      //this.geoform.get('CountryCode').patchValue('');
    }

    else if (actualPoint == 'STATE' && data.id == "STATECODE") {
      //this.geoform.get('StateCode').enable();
      //this.geoform.get('StateCode').patchValue('');
    }
    else if (actualPoint == 'CITY') {

    }

    this.GetGeolocation(this.FreightLanemodel);
  }


  btnResetFilter(form: NgForm) {
    //this.FCountryData.length = 0;
    form.resetForm();
    this.FreightLaneResetFilter.emit("reset");

  }
  btnApplyFilter(form: NgForm) {
    
    if (this.FCountryData != null && this.FCountryData.length > 0)
      this.FreightLanemodel.fromCountry = this.FCountryData[0].itemName;
    else
      this.FreightLanemodel.fromCountry = '';

    if (this.FStateData != null && this.FStateData.length > 0)
      this.FreightLanemodel.fromState = this.FStateData[0].itemName;
    else
      this.FreightLanemodel.fromState = '';

    if (this.FCityData != null && this.FCityData.length > 0)
      this.FreightLanemodel.fromCity = this.FCityData[0].itemName;
    else
      this.FreightLanemodel.fromCity = '';

    if (this.FZipData != null && this.FZipData.length > 0)
      this.FreightLanemodel.fromZipcode = this.FZipData[0].itemName;
    else
      this.FreightLanemodel.fromZipcode = '';

    if (this.TCountryData!=null && this.TCountryData.length > 0)
      this.FreightLanemodel.toCountry = this.TCountryData[0].itemName;
    else
      this.FreightLanemodel.toCountry = '';

    if (this.TStateData!=null && this.TStateData.length > 0)
      this.FreightLanemodel.toState = this.TStateData[0].itemName;
    else
      this.FreightLanemodel.toState = '';

    if (this.TCityData!=null && this.TCityData.length > 0)
      this.FreightLanemodel.toCity = this.TCityData[0].itemName;
    else
      this.FreightLanemodel.toCity = '';

    if (this.TZipData!=null && this.TZipData.length > 0)
      this.FreightLanemodel.toZipcode = this.TZipData[0].itemName;
    else
      this.FreightLanemodel.toZipcode = '';
    if (this.FreightModeData!=null && this.FreightModeData.length > 0)
      this.FreightLanemodel.freightMode = this.FreightModeData[0].name;
    else
      this.FreightLanemodel.freightMode = '';

    if (this.CarrierData!=null && this.CarrierData.length > 0)
      this.FreightLanemodel.carrier = this.CarrierData[0].name;
    else
      this.FreightLanemodel.carrier = '';

    if (this.EquipmentData!=null && this.EquipmentData.length > 0)
      this.FreightLanemodel.equipmentType = this.EquipmentData[0].name;
    else
      this.FreightLanemodel.equipmentType = '';


    this.freightLaneService.GetFilterData(this.FreightLanemodel).subscribe(data => {
      if (data.data != null) {
        this.FreightLaneFilter.emit(data.data);

      }
    });
 
  }
  onAddItemA(data: string) {
    this.count++;

  }
  onAddItemB(data: string) {
    this.count++;

  }
  onItemSelect(item: any) {


  }
  OnItemDeSelect(item: any) {

  }
  onSelectAll(items: any) {

  }
  onDeSelectAll(items: any) {

  }

}
