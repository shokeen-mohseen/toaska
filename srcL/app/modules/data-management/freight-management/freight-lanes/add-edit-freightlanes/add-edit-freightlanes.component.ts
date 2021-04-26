import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { GeolocationService } from '../../../../../core/services/geolocation.services';
import { FreightLaneService } from '@app/core/services/freightlane.service';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
import { FreightLane } from '../../../../../core/models/FreightLane.model';
import { AuthService } from '../../../../../core';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { CustomerByLocationService } from '../../../../../core/services/customer-by-location.service';
import { MaterialCallListViewModel, LocationConstant, LocationListViewModel, ToFromLocationViewModel, LocationAverageShipFromMileMappingViewModel } from '../../../../../core/models/Location';
/*import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';*/

@Component({
  selector: 'app-add-edit-freightlanes',
  templateUrl: './add-edit-freightlanes.component.html',
  styleUrls: ['./add-edit-freightlanes.component.css']
})
export class AddEditFreightlanesComponent implements OnInit {
  isDisabledContent: boolean = true;

  displayedColumns = ['selectRow', 'carrier', 'equipmentType', 'ratePerLoad', 'ratePerUom'];
  displayedColumnsReplace = ['selectRow', 'key_Carrier', 'key_Equipment', 'key_Rateperload',
    'key_Rateperuom'];
  dataSource;
  selection = new SelectionModel<FreightLane>(true, []);
  selectRow: any;
  ELEMENT_DATA: FreightLane[] = [];
  FreightLanelist: FreightLane = new FreightLane();
  tofromLocationViewModel: ToFromLocationViewModel = new ToFromLocationViewModel();
  shipFromMileMappingViewModel: LocationAverageShipFromMileMappingViewModel = new LocationAverageShipFromMileMappingViewModel();
  commonCallListViewModel: MaterialCallListViewModel = new MaterialCallListViewModel();
  constructor(private customerbylocationService: CustomerByLocationService,
    private ptService: PreferenceTypeService,
    private freightLaneService: FreightLaneService,
    private geolocation: GeolocationService,
    private toastrService: ToastrService,
    private authenticationService: AuthService) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.FreightLanemodel = new FreightLane();
    this.addlist = 1;
    this. addedlist= 0;
  }
 public addlist: number;
  public addedlist: number;
  stateCode: string; countryCode: string; cityCode: string; zipCode: string;
  Equipment: any;
  Carrier: any;
  fromGeoLocation: any;
  toGeoLocation: any;
  TravelTime: any;
  Distance: any;
  freightMode: any;
  DistanceUOM: any;
  FgeolocList: any = [];
  TgeolocList: any = [];
  FreightModeList: any = [];
  CarrierList: any = [];
  EquipmentList: any = [];
  CarrierRateList: any = [];
  RateperuomList: any = [];
  DistanceUomList: any = [];
  duplicateList: any = [];
  Rateperload: any;
  clientId: number;
  FgeolocData = [];
  TgeolocData = [];
  DistanceUomData = [];
  FreightModeData = [];
  CarrierData = [];
  EquipmentData = [];
  RateperuomData = [];
  CarrierRateData = [];
  DistanceUomListIteam = []
  fromGeoLocationId: any;
  toGeoLocationId: any;
  freightModeId: any;
  DistanceUOMId: any;
  FreightLanemodel: FreightLane;
  FreightLane: FreightLane[];
  settingsA = {};
  settingsB = {};
  count = 3;
  ItemList: FreightLane[];
  list: boolean;
  clientid = this.authenticationService.currentUserValue.ClientId;
  masterToggle() {
   
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.isSelected = true;
        this.ItemList.push(row);

      });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  onSelectionChange(row: FreightLane, checked: boolean) {

    row.isSelected = checked;
    this.selection.toggle(row);
    if (checked == true || this.selection.selected.length > 0) {
      this.ItemList.push(row);
    }
    else {

      this.ItemList = this.ItemList.filter(m => m != row);
    }

  }
  ngOnInit(): void {


    this.list = true;
    this.view = false;
    this.selectRow = 'selectRow';
    this.dataSource = new MatTableDataSource<FreightLane>(this.ELEMENT_DATA);

    this.ItemList = new Array<any>();
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName'],
      lazyLoading: true,
      addNewItemOnFilter: true
    };

    this.settingsB = {
      singleSelection: true,
      text: 'Select',
      enableSearchFilter: true,
      labelKey: ['geoLocation'],
      searchBy: ['geoLocation'] 
      //singleSelection: false,
      //text: "Select",
      ////selectAllText: 'Select All',
      ////unSelectAllText: 'UnSelect All',
      //enableSearchFilter: true,
      //searchBy: ['itemName'],
      //lazyLoading: true,
      //addNewItemOnFilter: false
    };

    this.freightLaneService.GetGeoLocationList(this.authenticationService.currentUserValue.ClientId).subscribe(data => {
      if (data.data != null) {
    
        this.FgeolocList = data.data;
        this.TgeolocList = data.data;
      
      }
    });
    this.freightLaneService.GetFreightModeList(this.clientid).subscribe(data => {
      if (data.data != null) {
        this.FreightModeList = data.data;
      }
    });

    
    this.freightLaneService.GetCarrierList(this.clientid).subscribe(data => {
      if (data.data != null) {

        this.CarrierList = data.data;
      }
    });
    this.freightLaneService.GetUOMList(this.clientid).subscribe(data => {
      if (data.data != null) {

        this.DistanceUomList = data.data;
        this.RateperuomList = data.data;

        this.DistanceUomData = [this.DistanceUomList.find(unit => unit.code === 'Miles')];
        //this.RateperuomList = this.DistanceUomData;
        this.RateperuomData = [this.RateperuomList.find(unit => unit.code === 'USD')];

      }
    });
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


  }
  onAddItemA(data: string) {
    this.count++;

  }
  onAddItemB(data: string) {
    this.count++;
   
  }
  onFreightModeItemSelect(item: any) {

    this.FreightLanemodel = new FreightLane();
    var fgeoloc = this.FgeolocData[0].id;
    var tgeoloc = this.TgeolocData[0].id;
    
    this.FreightLanemodel.fromGeoLocationId = fgeoloc;
    this.FreightLanemodel.toGeoLocationId = tgeoloc;
    this.FreightLanemodel.freightModeId = this.FreightModeData[0].id;
    this.freightLaneService.GetEquipmentFreightMode(this.clientid, this.FreightLanemodel.freightModeId).subscribe(data => {
      if (data.data != null) {
        this.EquipmentList = data.data;
      }
    });
    this.freightLaneService.GetFreightModeddl(this.FreightLanemodel).subscribe(data => {
      if (data.data != null) {
     
        if (data.data.length > 0) {
          this.toastrService.warning("This freight lane already exists. Please edit it from the freight lanes list");
          this.FreightModeData = [];
          this.freightLaneService.GetFreightModeList(this.clientid).subscribe(data => {
            if (data.data != null) {
              this.FreightModeList = data.data;
            }
          });
        }
      }
    });

  }
  onItemSelect(item: any) { }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }
  Validation() {
    if ((this.CarrierData.length <= 0) || (this.EquipmentData.length <= 0) || (this.Rateperload == null) || (this.RateperuomData.length <= 0)) {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
   else if (this.GridData.length > 0 && this.ItemList.length==0) {
      for (var i = 0; i < this.GridData.length; i++) {
        if (this.GridData[i].carrierID == this.CarrierData[0].id && this.GridData[i].equipmentTypeID == this.EquipmentData[0].id) {
          this.toastrService.warning("Selected Carrier and Equipment Type already exists.");
          return false;
        }
      }
    }

    return true;
  }
  public countId: number;
  GridData = [];

  btnSave() {

    if (this.Validation()) {

      var id = 0;
      var temData = [];
      var gridTemp = [];
      var that = this;
      that.countId = that.countId + 1;
      let model = new FreightLane();
      if (this.FgeolocData != null && this.FgeolocData.length!=0) {
        model.fromGeoLocationId = this.FgeolocData[0].id;
        model.fromGeoLocation = this.FgeolocData[0].geoLocation;
      }
      if (this.TgeolocData != null && this.TgeolocData.length!=0) {
        model.toGeoLocationId = this.TgeolocData[0].id;
        model.toGeoLocation = this.TgeolocData[0].geoLocation;
      }
      if (this.FreightModeData != null && this.FreightModeData.length!=0) {
        model.freightModeId = this.FreightModeData[0].id;
        model.freightMode = this.FreightModeData[0].name;
      }
      if (this.DistanceUomData != null && this.DistanceUomData.length!=0) {
        model.distanceUomid = this.DistanceUomData[0].id;
        model.distanceUOM = this.DistanceUomData[0].name;
      }
      model.distance = Number(this.Distance);
      model.travelTimeInDays = Number(this.TravelTime);
      model.clientId = this.authenticationService.currentUserValue.ClientId;
      model.carrier = this.CarrierData[0].description;
      model.equipmentType = this.EquipmentData[0].description;
      model.ratePerLoad = Number(this.Rateperload);
      model.ratePerUom = this.RateperuomData[0].description;
      model.carrierID = this.CarrierData[0].id;
      model.equipmentTypeID = this.EquipmentData[0].id;
      model.costUOMID = this.RateperuomData[0].id;
      model.createdBy = this.authenticationService.currentUserValue.LoginId;
      model.createDateTimeBrowser = new Date(new Date().toISOString());
      model.updateDateTimeBrowser = new Date(new Date().toISOString());
      model.updatedBy = this.authenticationService.currentUserValue.LoginId;

      model.addlist = this.addlist;
      temData.push(model);
  
      id++;

      this.GridData = this.GridData.filter(item => !this.ItemList.includes(item));
      var getmodule = this.ItemList.map(({ id }) => id);
      this.Data = this.Data.filter(x => !getmodule.includes(x.Index));

      temData.forEach(function (s) {
        that.GridData.push(s);
      });
      this.FillGrid();

      if (this.ItemList.length == 0) {
        this.Carrier = null;
        this.Equipment = null;
        this.Rateperload = null;
        this.CarrierData = [];
        this.EquipmentData = [];
      }
      this.ItemList = new Array<any>();

      this.btnSaveAll(2);
    }
    
  }
  FillGrid() {
    this.ELEMENT_DATA = [];
    this.GridData.forEach((v) => {
      this.ELEMENT_DATA.push(v);
    });
    this.dataSource = new MatTableDataSource<FreightLane>(this.ELEMENT_DATA);
  }
  GetAllFreightLaneData() {
    if (this.fromGeoLocationId!=null && (this.FgeolocData == null || this.view==true)) {
      this.FreightLanemodel.fromGeoLocationId = this.fromGeoLocationId;
    }
    else if (this.FgeolocData!=null && this.FgeolocData.length > 0) {
      this.FreightLanemodel.fromGeoLocationId = this.FgeolocData[0].id;
    }
    else
      return null
    if (this.toGeoLocationId != null && (this.TgeolocData == null || this.view == true)) {
      this.FreightLanemodel.toGeoLocationId = this.toGeoLocationId;
    }
    else if (this.TgeolocData != null && this.TgeolocData.length > 0) {
      this.FreightLanemodel.toGeoLocationId = this.TgeolocData[0].id;
    }
    else
      return null
    if (this.freightModeId !=null && (this.FreightModeData == null || this.view == true)) {
      this.FreightLanemodel.freightMode = this.freightModeId;
    }
    else if (this.FreightModeData != null && this.FreightModeData.length > 0) {
      this.FreightLanemodel.freightMode = this.FreightModeData[0].name;
    }
    else
      return null
    if (this.DistanceUOMId !=null && (this.DistanceUomData == null || this.view == true)) {
      this.FreightLanemodel.distanceUomid = this.DistanceUOMId;
    }
    else if (this.DistanceUomData != null && this.DistanceUomData.length > 0) {
      this.FreightLanemodel.distanceUomid = this.DistanceUomData[0].name;
    }
    else
      return null
    if (this.Distance!="" && this.Distance!= null) {
      this.FreightLanemodel.distance = this.Distance;
    }
    else
      return null
    if (this.TravelTime!="" && this.TravelTime != null) {
      this.FreightLanemodel.travelTimeInDays = this.TravelTime;
    }
    else
      return null

    return this.FreightLanemodel;
    
  }
  Data = [];
  btnDelete() {

    if (!this.ItemList.length) {
      this.toastrService.warning('Please select a record to delete');
    }
    else {


      const ids = this.ItemList.map(i => i.freightLaneDetId).join(',');
      this.freightLaneService.deleteFreightLaneDet(ids).subscribe(x => {
        const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
        this.toastrService.success('Record deleted successfully');
      });
      this.GridData = this.GridData.filter(item => !this.ItemList.includes(item));
      var getmodule = this.ItemList.map(({ id }) => id);
      this.Data = this.Data.filter(x => !getmodule.includes(x.Index));
      this.FillGrid();
      this.ItemList = null;
    }

  }
  GridData1 = [];
  savedisable: boolean;
  btnSaveAll(i) {
    var Fillgrid = [];
    if ( this.fromGeoLocation != null) {
      if (i == 1 || i==3) {

        let model = new FreightLane();
        model.fromGeoLocation = this.fromGeoLocation;
        model.toGeoLocation = this.toGeoLocation;
        model.freightMode = this.freightMode;
        model.fromGeoLocationId = this.fromGeoLocationId;
        model.toGeoLocationId = this.toGeoLocationId;
        model.freightModeId = this.freightModeId;
        model.distanceUomid = this.DistanceUOMId;
        model.distanceUOM = this.DistanceUOM;
        model.distance = Number(this.Distance);
        model.travelTimeInDays = Number(this.TravelTime);

        model.updatedBy = this.authenticationService.currentUserValue.LoginId;
        model.updateDateTimeBrowser = new Date();

        var fsplit = this.fromGeoLocation.split('-');
        var tsplit = this.toGeoLocation.split('-');


        model.addedlistDisplay = fsplit[1] + '-' + tsplit[1] + '-' + this.freightMode;
        Fillgrid.push(model);
        this.ELEMENT_DATA = [];
        Fillgrid.forEach((v) => {
          this.ELEMENT_DATA.push(v);
        });
        Fillgrid = [];
        Fillgrid.forEach((v) => {
          this.FreightLanelist2.push(v);
        });
      }
      else {
        this.ELEMENT_DATA[0].fromGeoLocation = this.fromGeoLocation;
        this.ELEMENT_DATA[0].toGeoLocation = this.toGeoLocation;
        this.ELEMENT_DATA[0].freightMode = this.freightMode;
        this.ELEMENT_DATA[0].fromGeoLocationId = this.fromGeoLocationId;
        this.ELEMENT_DATA[0].toGeoLocationId = this.toGeoLocationId;
        this.ELEMENT_DATA[0].freightModeId = this.freightModeId;
        this.ELEMENT_DATA[0].distanceUomid = this.DistanceUOMId;
        this.ELEMENT_DATA[0].distanceUOM = this.DistanceUOM;
        this.ELEMENT_DATA[0].distance = Number(this.Distance);
        this.ELEMENT_DATA[0].travelTimeInDays = Number(this.TravelTime);
        this.ELEMENT_DATA[0].updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.ELEMENT_DATA[0].updateDateTimeBrowser = new Date();
        var fsplit = this.fromGeoLocation.split('-');
        var tsplit = this.toGeoLocation.split('-');
        this.ELEMENT_DATA[0].addedlistDisplay = fsplit[1] + '-' + tsplit[1] + '-' + this.freightMode;
        Fillgrid.push(this.ELEMENT_DATA[0]);
      }

   
      this.freightLaneService.UpdateAllData(this.ELEMENT_DATA).subscribe(result => {
        if (result.statusCode == 200) {
          this.toastrService.success("The record is saved successfully")

          if (i == 2)
            this.selected(this.ELEMENT_DATA[0], 2);

        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support");

        }
      }
      );
    }
    else {
      var FreightLaneToBeSaved = this.GetAllFreightLaneData();

      if (FreightLaneToBeSaved == null) {
        this.toastrService.warning("Please fill all mandatory fields to save the record");
        return false;
    }
   
      if (this.ELEMENT_DATA.length != 0) {
        if (i == 1 || i == 3) {
          let model = new FreightLane()

          model.fromGeoLocation = this.FgeolocData[0].geoLocation;
          model.toGeoLocation = this.TgeolocData[0].geoLocation;
          model.freightMode = this.FreightModeData[0].name;
          model.fromGeoLocationId = this.FgeolocData[0].id;
          model.toGeoLocationId = this.TgeolocData[0].id;
          model.freightModeId = this.FreightModeData[0].id;
          model.distanceUomid = this.DistanceUomData[0].id;
          model.distanceUOM = this.DistanceUomData[0].name;
          model.distance = Number(this.Distance);
          model.travelTimeInDays = Number(this.TravelTime);
          model.createdBy = this.authenticationService.currentUserValue.LoginId;
          model.createDateTimeBrowser = new Date();
          model.updatedBy = this.authenticationService.currentUserValue.LoginId;
          model.updateDateTimeBrowser = new Date();
          var fsplit = this.FgeolocData[0].geoLocation.split('-');
          var tsplit = this.TgeolocData[0].geoLocation.split('-');
          model.addedlistDisplay = fsplit[1] + '-' + tsplit[1] + '-' + this.FreightModeData[0].name;
          Fillgrid.push(model);
          this.ELEMENT_DATA = [];
          Fillgrid.forEach((v) => {
            this.ELEMENT_DATA.push(v);
          });
          Fillgrid = [];
          Fillgrid.forEach((v) => {
            this.FreightLanelist2.push(v);
          });
        }
        else {
          this.ELEMENT_DATA[0].fromGeoLocation = this.FgeolocData[0].geoLocation;
          this.ELEMENT_DATA[0].toGeoLocation = this.TgeolocData[0].geoLocation;
          this.ELEMENT_DATA[0].freightMode = this.FreightModeData[0].name;
          this.ELEMENT_DATA[0].fromGeoLocationId = this.FgeolocData[0].id;
          this.ELEMENT_DATA[0].toGeoLocationId = this.TgeolocData[0].id;
          this.ELEMENT_DATA[0].freightModeId = this.FreightModeData[0].id;
          this.ELEMENT_DATA[0].distanceUomid = this.DistanceUomData[0].id;
          this.ELEMENT_DATA[0].distanceUOM = this.DistanceUomData[0].name;
          this.ELEMENT_DATA[0].distance = Number(this.Distance);
          this.ELEMENT_DATA[0].travelTimeInDays = Number(this.TravelTime);
          this.ELEMENT_DATA[0].createdBy = this.authenticationService.currentUserValue.LoginId;
          this.ELEMENT_DATA[0].createDateTimeBrowser = new Date();
          this.ELEMENT_DATA[0].updatedBy = this.authenticationService.currentUserValue.LoginId;
          this.ELEMENT_DATA[0].updateDateTimeBrowser = new Date();
          var fsplit = this.FgeolocData[0].geoLocation.split('-');
          var tsplit = this.TgeolocData[0].geoLocation.split('-');
          this.ELEMENT_DATA[0].addedlistDisplay = fsplit[1] + '-' + tsplit[1] + '-' + this.FreightModeData[0].name;
          Fillgrid.push(this.ELEMENT_DATA[0]);
        }
        
  
        this.freightLaneService.SaveAllData(this.ELEMENT_DATA).subscribe(result => {
          if (result.statusCode == 200) {
            this.toastrService.success("The record is saved successfully")
            if (i == 2)
              this.selected(this.ELEMENT_DATA[0], 2);

          } else {
            this.toastrService.error("The record could not be saved. Please contact Tech Support");

          }
        }
        );
      }
      else {
        var Freight = [];
          var that = this;
        let FreightLanemodel = new FreightLane();
        FreightLanemodel.fromGeoLocation = this.FgeolocData[0].geoLocation;
        FreightLanemodel.toGeoLocation = this.TgeolocData[0].geoLocation;
        FreightLanemodel.freightMode = this.FreightModeData[0].name;
        FreightLanemodel.fromGeoLocationId = this.FgeolocData[0].id;
        FreightLanemodel.toGeoLocationId = this.TgeolocData[0].id;
        FreightLanemodel.freightModeId = this.FreightModeData[0].id;
        FreightLanemodel.distanceUomid = this.DistanceUomData[0].id;
        FreightLanemodel.distanceUOM = this.DistanceUomData[0].name;
        FreightLanemodel.distance = Number(this.Distance);
        FreightLanemodel.travelTimeInDays = Number(this.TravelTime);
        FreightLanemodel.createdBy = this.authenticationService.currentUserValue.LoginId;
        FreightLanemodel.createDateTimeBrowser = new Date();
        FreightLanemodel.updatedBy = this.authenticationService.currentUserValue.LoginId;
        FreightLanemodel.updateDateTimeBrowser = new Date();
        var fsplit = this.FgeolocData[0].geoLocation.split('-');
        var tsplit = this.TgeolocData[0].geoLocation.split('-');
        FreightLanemodel.addedlistDisplay = fsplit[1]+ '-' + tsplit[1]+'-'+this.FreightModeData[0].name;
        this.ELEMENT_DATA = [];
        this.ELEMENT_DATA.push(FreightLanemodel);
      
        Freight.push(FreightLanemodel);
        Freight.forEach(function (s) {
          that.GridData1.push(s);
        });
        Freight.forEach(function (s) {
          that.FreightLanelist2.push(s);
        });

        this.freightLaneService.SaveAllData(this.ELEMENT_DATA).subscribe(result => {
          if (result.statusCode == 200) {
            this.toastrService.success("The record is saved successfully")
            if (i == 2)
              this.selected(this.ELEMENT_DATA[0], 2);

          } else {
            this.toastrService.error("The record could not be saved. Please contact Tech Support");

          }
        }
        );
      }
    }

    this.popup = true;
   
    if (this.iselected == true && i == 1) {
      this.list = false;
      this.view = true;
      this.iselected = false;
      this.savedisable = false;
    }
    else if (i == 1 && this.FgeolocData != null) {
      this.list = false;
      this.view = true;

      this.savedisable = false;
      this.selected(this.ELEMENT_DATA[0], 2);
    }
    else if (i == 2 && this.FgeolocData != null) {
      if (this.FgeolocData.length > 0) {
        this.list = true;
        this.view = false;
 
        this.savedisable = true;
    
      }
    }
    else if (i == 2) {
      this.list = false;
      this.view = true;
      
    }
    else if (i == 3) {
      this.list = true;
      this.view = false;
    }
    this.selectedFreightLaneToEdit(this.ELEMENT_DATA[0]);
  }
  
  fromlocationId: number;
  toFromLocationData: any;
  locationId: number;

  GetDistance() {

    this.FreightLanemodel = new FreightLane();
    var fgeoloc = this.FgeolocData[0].id;
    var tgeoloc = this.TgeolocData[0].id;
    this.FreightLanemodel.fromGeoLocationId = fgeoloc;
    this.FreightLanemodel.toGeoLocationId = tgeoloc;
    this.FreightLanemodel.freightModeId = this.FreightModeData[0].id;
    this.freightLaneService.GetDistance(this.FreightLanemodel).subscribe(data => {
      if (data.data != null) {
        if (data.data.length > 0) {
          this.Distance = data.data[0].distances;
          this.TravelTime = data.data[0].transitDays;

        }
      }
    });
   }
  edit: boolean;
  btnEdit() {
    this.CarrierData = [];
    this.EquipmentData = [];
    this.RateperuomData = [];
    if (this.ItemList.length > 0) {

      this.edit = true;
      this.add = false;
      this.popup = true;
      if (this.ItemList[0] != null) {
        if (this.CarrierList.length > 0 && this.ItemList[0].carrierID != null) {
          var lista = this.CarrierList.find(x => x.id == this.ItemList[0].carrierID);
          if (lista != null) {
            this.CarrierData[0] = lista;
            this.Carrier = this.CarrierData[0].name;
          }

        }
        if (this.EquipmentList.length > 0 && this.ItemList[0].equipmentTypeID != null) {
          var lista = this.EquipmentList.find(x => x.id == this.ItemList[0].equipmentTypeID);
          if (lista != null) {
            this.EquipmentData[0] = lista;
            this.Equipment = this.EquipmentData[0].name;
          }
        }
        if (this.RateperuomList.length > 0 && this.ItemList[0].ratePerUom != null) {
          var lista = this.RateperuomList.find(x => x.id == this.ItemList[0].costUOMID);
          if (lista != null) {
            this.RateperuomData[0] = lista;
          }
        }
        if (this.ItemList[0].ratePerLoad != null) {
          this.Rateperload = this.ItemList[0].ratePerLoad;
        }
        if (this.ItemList[0].freightLaneDetId != null) {
        }
      }
    }
    else {
      this.toastrService.warning("Please select one record to edit");
    }
   
  }
  add: boolean;
  popup: boolean;
  btnAdd() {
    this.add = true;
    this.edit = false;
    this.popup = false;
    if (this.CarrierData!=null)
      this.CarrierData.length = 0;
    if (this.EquipmentData != null)
      this.EquipmentData.length = 0;
    if (this.RateperuomData != null)
    this.RateperuomData.length = 0;
    this.Rateperload = null;
    this.popup = false;
    var FreightLane = this.GetAllFreightLaneData();
    this.freightLaneService.GetUOMList(this.clientid).subscribe(data => {
      if (data.data != null) {

        this.RateperuomList = data.data;

        this.RateperuomData = [this.RateperuomList.find(unit => unit.code === 'USD')];

      }
    });
    if (FreightLane == null) {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      this.popup = false;
      return false;
     
    }
    else {
      this.popup = true;
    }
  }
  addFreight: any;
  btnCancel() {

    this.addFreight.close();
  }


  FreightLanelist1: FreightLane[] = [];
  FreightLanelist2: FreightLane[] = [];

  duplicate: number;
  entry: boolean;
  selectNext(ngform:NgForm) {
    var FreightLaneToBeSaved = this.GetAllFreightLaneData();

    if (FreightLaneToBeSaved == null) {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    else {
      this.isDisabledContent = false;
      this.list = true;
      this.view = false;
      this.entry = true;
      if (this.fromGeoLocation == null) {
        this.addlist = this.addlist + 1;
      }
      else {
        this.FreightLanelist1 = [];
      }
      for (var i = 0; i < this.ELEMENT_DATA.length; i++) {
        this.FreightLanelist1.push(this.ELEMENT_DATA[i]);
      }
      if (this.fromGeoLocation == null) {
        for (var j = 0; j < this.ELEMENT_DATA.length; j++) {
          if (j != 0)
            var list = this.ELEMENT_DATA[j - 1].addlist;
          if ((j == 0) || (this.ELEMENT_DATA[j].addlist != list))
            this.FreightLanelist2.push(this.ELEMENT_DATA[j]);
          this.entry = false;
        }
      }
      this.btnSaveAll(3);
      if (this.entry == true) {
        this.GridData1 = this.GridData1.filter(item => !this.FreightLanelist2.includes(item));
        for (var i = 0; i < this.GridData1.length; i++) {
          this.FreightLanelist2.push(this.GridData1[i]);
        }
      }
      this.ELEMENT_DATA = [];
      this.GridData = [];

      this.dataSource = null;
      this.dataSource = new MatTableDataSource<FreightLane>(null);
      this.popup = true;
      this.list = true;
      this.view = false;
      this.FgeolocData = [];
      this.TgeolocData = [];
      this.FreightModeData = [];
      this.DistanceUomData = [];
      this.freightLaneService.GetGeoLocationList(this.authenticationService.currentUserValue.ClientId).subscribe(data => {
        if (data.data != null) {

          this.FgeolocList = data.data;
          this.TgeolocList = data.data;

        }
      });
      this.freightLaneService.GetFreightModeList(this.clientid).subscribe(data => {
        if (data.data != null) {
          this.FreightModeList = data.data;
        }
      });
      this.freightLaneService.GetUOMList(this.clientid).subscribe(data => {
        if (data.data != null) {

          this.DistanceUomList = data.data;
     
        }
      });
      ngform.reset();

    }
  }
  closeTab() {


  }
  selectedFreightLaneToEdit(selectedFreightLaneToEdit: FreightLane) {
    this.selectedFreightLane = Object.assign({}, selectedFreightLaneToEdit);
  }
  view: boolean;
  freightaddlist: FreightLane;
  selectedFreightLane: FreightLane;
  iselected: boolean;
  selected(i,j) {
    if (j == 1) {
   
      
      this.selectedFreightLaneToEdit(this.FreightLanelist2[i]);
      this.selectedFreightLane.addedlistDisplay = this.FreightLanelist2[i].addedlistDisplay;
      i = this.FreightLanelist2[i];
    }
    else {
      this.selectedFreightLaneToEdit(i);
      this.selectedFreightLane.addedlistDisplay = i.addedlistDisplay;
    }
    this.iselected = true;
    this.freightaddlist = new FreightLane();
    this.list = false;
    this.view = true;
    this.ELEMENT_DATA = [];
    this.freightaddlist.fromGeoLocationId = i.fromGeoLocationId;
    this.freightaddlist.toGeoLocationId = i.toGeoLocationId;
    this.freightaddlist.freightModeId = i.freightModeId;
   // this.freightaddlist.addedlistDisplay = i.addedlistDisplay;
    this.freightLaneService.GetRecordById(this.freightaddlist).subscribe(data => {
      if (data.data != null) {
        for (var j = 0; j < data.data.length; j++) {
          if (data.data[j].carrierID != 0)
            this.ELEMENT_DATA.push(data.data[j]);
        }
        this.dataSource = new MatTableDataSource<FreightLane>(this.ELEMENT_DATA);
      }
    });
    this.addedlist = i.addlist;
    this.fromGeoLocation =i.fromGeoLocation;
    this.toGeoLocation = i.toGeoLocation;
    this.freightMode = i.freightMode;
    this.fromGeoLocationId = i.fromGeoLocationId;
    this.toGeoLocationId = i.toGeoLocationId;
    this.freightModeId = i.freightModeId;
    this.Distance = i.distance;
    this.TravelTime = i.travelTimeInDays;
    this.DistanceUOM =i.distanceUOM;
    this.DistanceUOMId = i.distanceUomid;
    this.GridData = this.ELEMENT_DATA;
    this.ItemList = new Array<any>();
    this.savedisable = false;
  }
  removeFreightLaneFromEditList(freightModeToRemove: FreightLane) {
    this.FreightLanelist2.splice(this.FreightLanelist2.findIndex(item => item.addedlistDisplay === freightModeToRemove.addedlistDisplay), 1)
  }
}
    







