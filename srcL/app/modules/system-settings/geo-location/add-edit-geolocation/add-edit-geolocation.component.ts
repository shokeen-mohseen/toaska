import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Geoloction } from '../../../../core/models/geolocation';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { GeolocationService } from '../../../../core/services/geolocation.services';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Geolocation } from '../models/geolocation';
import { GeolocationMappedService } from '../services/geolocation-mapped.service';

@Component({
  selector: 'app-add-edit-geolocation',
  templateUrl: './add-edit-geolocation.component.html',
  styleUrls: ['./add-edit-geolocation.component.css']
})
export class AddEditGeolocationComponent implements OnInit {
  geoform: FormGroup; geolocationInsert: Geolocation;
  selectedCityItems: []; selectedZipItems: []; zipCode: string;
  stateCode: string; countryCode: string; cityCode: string;
  stateList: any = []; cityList: any = []; zipList: any = [];
  countryList: any = []; duplicateList: any = [];
  modalRef: NgbModalRef; clientId: number;
  @Input() addPage: boolean;
  @Input() editPage: boolean;
  geoloctionmodel: Geoloction;
  constructor(
    private geolocationInsertService: GeolocationMappedService,
    private geolocation: GeolocationService,
    private router: Router,
    public modalService: NgbModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private formBuilder: FormBuilder,
  ) {

    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.geoloctionmodel = new Geoloction();
    this.geolocationInsert = new Geolocation();
  }

  itemListA = [];
  selectedItemsA = [];
  settingsA = {};
  settings = {};
  count = 3; 
  ngOnInit(): void {
   
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //searchBy: ['itemName'],
      //lazyLoading: true
    };

    this.settings = {
      singleSelection: true,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //searchBy: ['itemName'],
      //lazyLoading: true
      //disabled: true
    };

    this.buildForm();
    this.geoloctionmodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
    this.GetGeolocation(this.geoloctionmodel);
  }

  private buildForm(): void {

    this.geoform = this.formBuilder.group(
      {
        CountryData: new FormControl(null, [Validators.required]),
        StateData: new FormControl(null, [Validators.required]),
        CityData: new FormControl(null, [Validators.required]),
        ZipData: new FormControl(null, [Validators.required]),
        CountryCode: new FormControl(null, [Validators.required]),
        StateCode: new FormControl(null, [Validators.required]),
        CityCode: new FormControl(null),
        ZipCode: new FormControl(null),
      }
    );

    this.geoform.get('CountryCode').disable();
    this.geoform.get('StateCode').disable();
  }

  get f() {

    return this.geoform.controls;
  }
  GetGeolocation(modelgeolocation) {
    this.geolocation.GetGeolocation(modelgeolocation).subscribe(data => {
      if (data.data != null) {
        this.BindGelocation(modelgeolocation, data.data);
      }
    });
  }

  BindGelocation(mdgeolocation: Geoloction, data: any[]) {


    if (mdgeolocation.mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.countryList = [];


      this.duplicateList = [];
      for (let i = 0; i < data.length; i++) {

        this.duplicateList.push({

          id: data[i].code,
          itemName: data[i].name

        })
      }
      this.countryList = this.duplicateList.filter((n, i) => this.duplicateList.indexOf(n) === i);
      
    }
    else if (mdgeolocation.mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.stateList = [];
      for (let i = 0; i < data.length; i++) {

        this.stateList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
      }
      
    }

    else if (mdgeolocation.mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.cityList = [];
      for (let i = 0; i < data.length; i++) {

        this.cityList.push({
          id: data[i].code,
          itemName: data[i].name,

        })
      }
     

    }
    else if (mdgeolocation.mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipList = [];
      for (let i = 0; i < data.length; i++) {

        this.zipList.push({
          id: data[i].code,
          itemName: data[i].name,


        })
      }
      
    }

  }

  GeolocationChange(data, mode, actualPoint='') {
    let countryname = data.itemName;
    this.geoloctionmodel.name = countryname;
    this.geoloctionmodel.code = data.id;
    this.geoloctionmodel.mode = mode;

    if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.geoloctionmodel.mode = GlobalConstants.DEFAULT_GEOLOCATION_MODE;
      this.countryCode = data.id;
      this.geoloctionmodel.code = this.countryCode;
      this.geoform.get('ZipData').patchValue(null);
      this.geoform.get('StateData').setValue(null);
      this.geoform.get('CityData').setValue(null);
      //this.addressModel.CountryCode = data.code;
      //this.addressModel.CountryName = data.countryname;
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.geoform.get('ZipData').patchValue(null);
      this.geoform.get('CityData').setValue(null);
      this.geoform.get('StateData').setValue(null);
      this.geoloctionmodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
      this.stateCode = data.id;
      this.geoloctionmodel.code = this.stateCode;
      this.geoform.get('CountryCode').setValue(data.id);
    }

    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.geoloctionmodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
      this.cityCode = data.id;
      this.geoloctionmodel.code = this.cityCode;
      this.geoloctionmodel.countryCode = this.geoform.get('CountryCode').value;
      this.geoform.get('ZipData').patchValue(null);
      this.geoform.get('CityData').setValue(null);
      
      this.geoform.get('StateCode').setValue(data.id);
    }
    else if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipCode = data.id;
      this.geoloctionmodel.code = this.zipCode;
      this.geoloctionmodel.mode = GlobalConstants.ZIP_GEOLOCATION_MODE;
      

    }

    if (actualPoint == 'COUNTRY' && data.id == "COUNTRYCODE") {
      this.geoform.get('CountryCode').enable();
      this.geoform.get('CountryCode').patchValue('');
    }
    
    else if (actualPoint == 'STATE' && data.id == "STATECODE") {
      this.geoform.get('StateCode').enable();
      this.geoform.get('StateCode').patchValue('');
    }
    else if (actualPoint == 'CITY') {

    }

    this.GetGeolocation(this.geoloctionmodel);
  }
  countryCodeCount: number = 0;
  stateCodeCount: number = 0;
  
  onAddCountryCode(event: any) {
    this.countryCodeCount = 0;
    if (event.target.value.trim() != "") {
      let countryData: any = this.geoform.get('CountryData').value;
      let countryCode = countryData[0].id; let CountryName = countryData[0].itemName;


      this.countryList.filter(u => {
        //u.id == event.target.value.trim()
        if (u.id.toLowerCase() == event.target.value.trim().toLowerCase()) {
          this.countryCodeCount++;
        }
      });
      if (this.countryCodeCount > 0) {
        this.toastrService.error('Country code already exists.');
        this.geoform.get('CountryCode').setValue("");
        return;
      }
      
      for (var i = 0; i < this.countryList.length; ++i) {
        if (this.countryList[i]['itemName'] === CountryName) {
          this.countryList[i]['id'] = event.target.value.trim();
        }
      }
      
      let data = this.countryList.filter(u => u.id.toLowerCase() == event.target.value.trim().toLowerCase());
      
      this.geoform.get('CountryData').setValue(data);
    }
  }

  onAddStateCode(event: any) {
    this.stateCodeCount = 0;
    if (event.target.value.trim() != "") {

      let StateData: any = this.geoform.get('StateData').value;
      let stateCode = StateData[0].id; let StateName = StateData[0].itemName;

      this.stateList.filter(u => {
        //u.id == event.target.value.trim()
        if (u.id.toLowerCase() == event.target.value.trim().toLowerCase()) {
          this.stateCodeCount++;
        }
      });
      if (this.stateCodeCount > 0) {
        this.toastrService.error('State code already exists.');
        this.geoform.get('StateCode').setValue("");
        return;
      }


      for (var i = 0; i < this.stateList.length; ++i) {
        if (this.stateList[i]['itemName'] === StateName) {
          this.stateList[i]['id'] = event.target.value.trim();
        }
      }

      let data = this.stateList.filter(u => u.id == event.target.value.trim());

      this.geoform.get('StateData').setValue(data);
    }
  }

  onAddItem(data: string, mode) {
    if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.zipList.push({
        id: data,
        itemName: data
      });
    }
    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {


      let stateData: any = this.geoform.get('StateData').value;

      if (stateData != null) {
        this.cityList.push({
          id: data,
          itemName: data + " (" + stateData[0].id + ")"
        });
      }
      else {
        this.cityList.push({
          id: data,
          itemName: data
        });
      }
     
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.stateList.push({
        id: 'STATECODE',
        itemName: data
      });
    }
    else if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.countryList.push({
        id: 'COUNTRYCODE',
        itemName: data

      });
    }


  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
  }
  OnItemDeSelect(item: any, mode) {
    if (mode == GlobalConstants.ZIP_GEOLOCATION_MODE) {
      this.geoform.get('ZipData').patchValue(null);
      this.geoform.get('ZipCode').patchValue(null);
    }
    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.geoform.get('CityData').setValue(null);
      this.geoform.get('ZipData').patchValue(null);
      this.geoform.get('CityCode').setValue(null);
      this.geoform.get('ZipCode').patchValue(null);
      this.zipList = [];
    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {
      this.geoform.get('StateData').setValue(null);
      this.geoform.get('CityData').setValue(null);
      this.geoform.get('ZipData').patchValue(null);
      
      this.geoform.get('StateCode').setValue(null);
      this.geoform.get('CityCode').setValue(null);
      this.geoform.get('ZipCode').patchValue(null);

      this.geoform.get('StateCode').disable();
      this.cityList = [];
      this.zipList = [];
    }
    else if (mode == GlobalConstants.DEFAULT_GEOLOCATION_MODE) {
      this.geoform.get('CountryData').setValue(null);
      this.geoform.get('StateData').setValue(null);
      this.geoform.get('CityData').setValue(null);
      this.geoform.get('ZipData').patchValue(null);
      this.geoform.get('CountryCode').setValue(null);
      this.geoform.get('StateCode').setValue(null);
      this.geoform.get('CityCode').setValue(null);
      this.geoform.get('ZipCode').patchValue(null);

      this.geoform.get('CountryCode').disable();
      this.geoform.get('StateCode').disable();
      this.stateList = [];
      this.cityList = [];
      this.zipList = [];
    }
    else if (mode == GlobalConstants.EXISTING_ADDRESS_MODE) {
      this.geoform.get('CountryData').setValue(null);
      this.geoform.get('StateData').setValue(null);
      this.geoform.get('CityData').setValue(null);
      this.geoform.get('ZipData').patchValue(null);
      this.geoform.get('CountryCode').setValue(null);
      this.geoform.get('StateCode').setValue(null);
      this.geoform.get('CityCode').setValue(null);
      this.geoform.get('ZipCode').patchValue(null);

      this.countryList = [];
      this.stateList = [];
      this.cityList = [];
      this.zipList = [];
    }

  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  SaveGeoLocationData() {
    
    if (this.geoform.invalid) {
      return;
    }

    let countryCode; let CountryName;
    let cityCode; let cityName;
    let stateCode; let stateName;
    let zipCode; let zip;

    let cityData:any = this.geoform.get('CityData').value;
    cityCode = cityData[0].id; cityName = cityData[0].itemName;

    let countryData: any = this.geoform.get('CountryData').value;
    countryCode = countryData[0].id; CountryName = countryData[0].itemName;

    let stateData: any = this.geoform.get('StateData').value;
    stateCode = stateData[0].id; stateName = stateData[0].itemName;

    let zipData: any = this.geoform.get('ZipData').value;
    zipCode = zipData[0].id; zip = zipData[0].itemName;

    this.geolocationInsert.cityCode = cityCode;
    this.geolocationInsert.cityName = cityName;

    this.geolocationInsert.countryCode = countryCode;
    this.geolocationInsert.countryName = CountryName;

    this.geolocationInsert.stateCode = stateCode;
    this.geolocationInsert.stateName = stateName;

    this.geolocationInsert.zipCode = zipCode;
    this.geolocationInsert.sourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;
    this.geolocationInsert.clientId = this.authenticationService.currentUserValue.ClientId;

    console.log(this.geoform.value);
    console.log(this.geolocationInsert);

    this.geolocationInsertService.PostGeolocation(this.geolocationInsert).subscribe(result => {
      // this.countryList = data.data;

      if (result.data != false) {
        this.geoform.reset();
        this.toastrService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);

      }
      else {
        this.toastrService.warning('Already mapped');
      }
    });
  }
    
}
