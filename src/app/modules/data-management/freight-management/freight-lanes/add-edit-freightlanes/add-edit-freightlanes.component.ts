import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
import { ConfirmDeleteTabledataPopupComponent } from '../../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';


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
  selectRow = 'selectRow';
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
    public modalService: NgbModal,
    private authenticationService: AuthService) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.FreightLanemodel = new FreightLane();
    this.addlist = 1;
    this.addedlist = 0;
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
  ItemList: FreightLane[] = [];
  clientid = this.authenticationService.currentUserValue.ClientId;
  popup: boolean = true;
  masterToggle() {

    this.isAllSelected() ?
      this.clearAllSelectedRows() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.isSelected = true;
        this.ItemList.push(row);

      });
  }
  clearAllSelectedRows() {
    this.selection.clear();
    if (this.ItemList != undefined && this.ItemList != null && this.ItemList.length > 0)
      this.ItemList.splice(0, this.ItemList.length);
  }
  public IsLineItemDisable(): boolean {
    if (this.fromGeoLocation != undefined && this.toGeoLocation != undefined && this.freightMode != undefined)
      return false;
    else if (this.FgeolocData != undefined && this.FgeolocData.length > 0 && this.TgeolocData != undefined && this.TgeolocData.length > 0 && this.FreightModeData != undefined && this.FreightModeData.length > 0)
      return false
    else
      return true;

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  onSelectionChange(row: FreightLane, checked: boolean) {

    row.isSelected = checked;
    this.selection.toggle(row);

    if (this.ItemList == null || this.ItemList == undefined) {
      this.ItemList = [];
    }

    if (checked == true) {
      if (this.ItemList.indexOf(row) == -1) {
        this.ItemList.push(row);
      }
    }
    else {

      if (this.ItemList.length > 1) {
        this.ItemList = this.ItemList.filter(m => m != row);
      }
      else {
        this.ItemList.splice(0, 1);
      }
    }

  }
  ngOnInit(): void {
    this.editMode = false;
    this.dataSource = new MatTableDataSource<FreightLane>(this.ELEMENT_DATA);

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
    };

    this.freightLaneService.GetGeoLocationList(this.authenticationService.currentUserValue.ClientId).subscribe(data => {
      if (data.data != null) {

        this.FgeolocList = data.data;
        this.TgeolocList = data.data;
        this.FgeolocList.sort((a, b) => {
          if (a.geoLocation < b.geoLocation) {
            return -1;
          }
          if (a.geoLocation > b.geoLocation) {
            return 1;
          }
          return 0;
        })
        this.TgeolocList.sort((a, b) => {
          if (a.geoLocation < b.geoLocation) {
            return -1;
          }
          if (a.geoLocation > b.geoLocation) {
            return 1;
          }
          return 0;
        })

      }
    });
    this.freightLaneService.GetFreightModeList(this.clientid).subscribe(data => {
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
        this.DistanceUomList.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
        this.RateperuomData.sort((a, b) => {
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

    }
    else if (mode == GlobalConstants.STATE_GEOLOCATION_MODE) {

      this.FreightLanemodel.mode = GlobalConstants.STATE_GEOLOCATION_MODE;
      this.stateCode = data.id;
      this.FreightLanemodel.code = this.stateCode;
    }

    else if (mode == GlobalConstants.CITY_GEOLOCATION_MODE) {
      this.FreightLanemodel.mode = GlobalConstants.CITY_GEOLOCATION_MODE;
      this.cityCode = data.id;
      this.FreightLanemodel.code = this.cityCode;

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
    this.EquipmentList = [];
    this.freightLaneService.GetEquipmentFreightMode(this.clientid, this.FreightLanemodel.freightModeId).subscribe(data => {
      if (data.data) {
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
    else if (this.GridData.length > 0 && this.ItemList.length == 0 && this.CurrentIndex > -1) {


      for (var i = 0; i < this.GridData.length; i++) {

        if (i != this.CurrentIndex) {
          if (this.GridData[i].carrierID == this.CarrierData[0].id && this.GridData[i].equipmentTypeID == this.EquipmentData[0].id) {
            this.toastrService.warning("Selected Carrier and Equipment Type already exists.");
            return false;
          }
        }
      }
    }

    return true;
  }

  GridData = [];

  btnSave() {

    if (this.Validation()) {

      let model = new FreightLane();
      if (this.FgeolocData.length) {
        model.fromGeoLocationId = this.FgeolocData[0].id;
        model.fromGeoLocation = this.FgeolocData[0].geoLocation;
      }
      if (this.TgeolocData.length) {
        model.toGeoLocationId = this.TgeolocData[0].id;
        model.toGeoLocation = this.TgeolocData[0].geoLocation;
      }
      if (this.FreightModeData.length) {
        model.freightModeId = this.FreightModeData[0].id;
        model.freightMode = this.FreightModeData[0].name;
      }
      if (this.DistanceUomData.length) {
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
      model.createDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
      model.updateDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date()); ``
      model.updatedBy = this.authenticationService.currentUserValue.LoginId;
      model.addlist = this.addlist;

      /*this.GridData = this.GridData.filter(item => !this.ItemList.includes(item));
      var getmodule = this.ItemList.map(({ id }) => id);
      this.Data = this.Data.filter(x => !getmodule.includes(x.Index));

      this.GridData.push(model);

      this.FillGrid();

      if (!this.ItemList.length) {
        this.Carrier = null;
        this.Equipment = null;
        this.Rateperload = null;
        this.CarrierData = [];
        this.EquipmentData = [];
      }
      this.ItemList = new Array<any>();*/
      if (this.CurrentIndex == -1) {
        this.Carrier = null;
        this.Equipment = null;
        this.Rateperload = null;
        this.CarrierData = [];
        this.EquipmentData = [];
      }

      if (this.ELEMENT_DATA.length > 0) {
        var exists = this.ELEMENT_DATA.findIndex(x => x.carrierID == model.carrierID && x.equipmentTypeID == model.equipmentTypeID);
        if (exists != this.CurrentIndex) {
          this.toastrService.error("Selected Carrier and Equipment combination already exists.");
          return false;

        }

      }

      //if (this.CurrentIndex == -1) {
      this.btnSaveAll(model);
      //}
      //else {
      //  this.btnUpdateLineItems(this.CurrentIndex, model);
      //}
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
    if (this.fromGeoLocationId != null && (this.FgeolocData == null || this.editMode)) {
      this.FreightLanemodel.fromGeoLocationId = this.fromGeoLocationId;
    }
    else if (this.FgeolocData != null && this.FgeolocData.length > 0) {
      this.FreightLanemodel.fromGeoLocationId = this.FgeolocData[0].id;
    }
    else
      return null
    if (this.toGeoLocationId != null && (this.TgeolocData == null || this.editMode)) {
      this.FreightLanemodel.toGeoLocationId = this.toGeoLocationId;
    }
    else if (this.TgeolocData != null && this.TgeolocData.length > 0) {
      this.FreightLanemodel.toGeoLocationId = this.TgeolocData[0].id;
    }
    else
      return null
    if (this.freightModeId != null && (this.FreightModeData == null || this.editMode)) {
      this.FreightLanemodel.freightMode = this.freightModeId;
    }
    else if (this.FreightModeData != null && this.FreightModeData.length > 0) {
      this.FreightLanemodel.freightMode = this.FreightModeData[0].name;
    }
    else
      return null
    if (this.DistanceUOMId != null && (this.DistanceUomData == null || this.editMode)) {
      this.FreightLanemodel.distanceUomid = this.DistanceUOMId;
    }
    else if (this.DistanceUomData != null && this.DistanceUomData.length > 0) {
      this.FreightLanemodel.distanceUomid = this.DistanceUomData[0].name;
    }
    else
      return null
    if (this.Distance != "" && this.Distance != null) {
      this.FreightLanemodel.distance = this.Distance;
    }
    else
      return null
    if ((this.TravelTime != "" || this.TravelTime == 0) && this.TravelTime != null) {
      this.FreightLanemodel.travelTimeInDays = this.TravelTime;
    }
    else
      return null

    return this.FreightLanemodel;

  }
  Data = [];
  modalRef: NgbModalRef;
  btnDelete() {

    if (!this.ItemList.length) {
      this.toastrService.warning('Please select a record to delete');
    }
    else {
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {


        const ids = this.ItemList.map(i => i.freightLaneDetId).join(',');
        this.freightLaneService.deleteFreightLaneDet(ids).subscribe(x => {
          //const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
          this.ELEMENT_DATA[0].freightModeId = this.freightModeId;
          this.selectedFreightLaneToEdit(this.ELEMENT_DATA[0]);

          this.GridData = this.GridData.filter(item => !this.ItemList.includes(item));
          var getmodule = this.ItemList.map(({ id }) => id);
          this.Data = this.Data.filter(x => !getmodule.includes(x.Index));
          //this.FillGrid();
          this.ItemList = null;

          this.toastrService.success('Record deleted successfully');
        });

      });
    }

  }
  GridData1 = [];
  savedisable: boolean;
  btnSaveAll(model: FreightLane = null, next = false) {
    model = model || new FreightLane();
    if (this.fromGeoLocation) {



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
      model.updateDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
      var fsplit = this.fromGeoLocation.split('-');
      var tsplit = this.toGeoLocation.split('-');
      model.addedlistDisplay = fsplit[1] + '-' + tsplit[1] + '-' + this.freightMode;

      if (this.CurrentIndex == -1) {
        this.ELEMENT_DATA.push(JSON.parse(JSON.stringify(model)));
      }
      else {
        this.ELEMENT_DATA[this.CurrentIndex].carrierID = model.carrierID;
        this.ELEMENT_DATA[this.CurrentIndex].carrier = model.carrier;
        this.ELEMENT_DATA[this.CurrentIndex].equipmentTypeID = model.equipmentTypeID;
        this.ELEMENT_DATA[this.CurrentIndex].equipmentType = model.equipmentType;
        this.ELEMENT_DATA[this.CurrentIndex].ratePerLoad = model.ratePerLoad;
        this.ELEMENT_DATA[this.CurrentIndex].ratePerUom = model.ratePerUom;

      }


      this.ELEMENT_DATA.forEach((value, index) => {
        value.createDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
        value.updateDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
      });


      // this.freightLaneService.UpdateAllData([model]).subscribe(result => {
      this.freightLaneService.UpdateAllData(this.ELEMENT_DATA).subscribe(result => {
        if (result.statusCode == 200) {
          this.toastrService.success("The record is saved successfully")

          if (!this.FreightLanelist2.some(item => item.addedlistDisplay === model.addedlistDisplay)) {
            // this.GridData1.push(model);
            this.FreightLanelist2.push(model);
          }
          else {
            this.FreightLanelist2.forEach((value, index) => {
              if (value.addedlistDisplay == model.addedlistDisplay) {
                value.distance = model.distance;
                value.travelTime = model.travelTime;
                value.travelTimeInDays = model.travelTimeInDays;
              }
            });
          }

          this.selected(model);


        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support");

        }
      }
      );
    }
    else {
      var FreightLaneToBeSaved = this.GetAllFreightLaneData();

      if (!FreightLaneToBeSaved) {
        this.toastrService.warning("Please fill all mandatory fields to save the record");
        return false;
      }

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
      model.createDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
      model.updatedBy = this.authenticationService.currentUserValue.LoginId;
      model.updateDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
      var fsplit = this.FgeolocData[0].geoLocation.split('-');
      var tsplit = this.TgeolocData[0].geoLocation.split('-');
      model.addedlistDisplay = fsplit[1] + '-' + tsplit[1] + '-' + model.freightMode;


      this.freightLaneService.SaveAllData([model]).subscribe(result => {
        if (result.statusCode == 200) {
          this.toastrService.success("The record is saved successfully")
          this.CurrentIndex = -1;
          if (!this.FreightLanelist2.some(item => item.addedlistDisplay === model.addedlistDisplay)) {
            this.GridData1.push(model);
            this.FreightLanelist2.push(model);
          }
          this.selected(model);
        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support");
        }
      });
    }

    /*if (this.iselected && i == 1) {
      this.list = false;
      this.view = true;
      this.iselected = false;
      this.savedisable = false;
    }
    else if (i == 1 && this.FgeolocData) {
      this.list = false;
      this.view = true;

      this.savedisable = false;
      this.selected(this.ELEMENT_DATA[0], 2);
    }
    else if (i == 2 && this.FgeolocData) {
      if (this.FgeolocData.length) {
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
    }*/
    // this.selectedFreightLaneToEdit(this.ELEMENT_DATA[0]);
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

  CurrentIndex: number = -1;

  btnEdit() {
    this.CarrierData = [];
    this.EquipmentData = [];
    this.RateperuomData = [];
    if (this.ItemList.length) {


      this.edit = true;
      this.add = false;
      this.popup = true;
      if (this.CarrierList.length && this.ItemList[0].carrierID != null) {
        var lista = this.CarrierList.find(x => x.id == this.ItemList[0].carrierID);
        if (lista != null) {
          this.CarrierData[0] = lista;
          this.Carrier = this.CarrierData[0].name;
        }

      }
      if (this.EquipmentList.length && this.ItemList[0].equipmentTypeID != null) {
        var lista = this.EquipmentList.find(x => x.id == this.ItemList[0].equipmentTypeID);
        if (lista != null) {
          this.EquipmentData[0] = lista;
          this.Equipment = this.EquipmentData[0].equimentDescription;
        }
      }
      if (this.RateperuomList.length && this.ItemList[0].ratePerUom != null) {
        var lista = this.RateperuomList.find(x => x.id == this.ItemList[0].costUOMID);
        if (lista != null) {
          this.RateperuomData[0] = lista;
        }
      }
      if (this.ItemList[0].ratePerLoad != null) {
        this.Rateperload = this.ItemList[0].ratePerLoad;
      }

      if (this.GridData != undefined && this.GridData.length > 0) {
        this.CurrentIndex = this.GridData.findIndex(x => x.carrierID == this.ItemList[0].carrierID && x.equipmentTypeID == this.ItemList[0].equipmentTypeID);
      }

      if (this.CurrentIndex == -1 && this.ELEMENT_DATA != undefined && this.ELEMENT_DATA.length > 0) {
        this.CurrentIndex = this.ELEMENT_DATA.findIndex(x => x.carrierID == this.ItemList[0].carrierID && x.equipmentTypeID == this.ItemList[0].equipmentTypeID);
      }



    }
    else {
      this.toastrService.warning("Please select one record to edit");
      this.popup = false;
    }

  }
  add: boolean;
  btnAdd() {
    this.add = true;
    this.edit = false;
    this.popup = true;
    if (this.CarrierData != null)
      this.CarrierData.length = 0;
    if (this.EquipmentData != null)
      this.EquipmentData.length = 0;
    if (this.RateperuomData != null)
      this.RateperuomData.length = 0;
    this.Rateperload = null;
    var FreightLane = this.GetAllFreightLaneData();
    this.freightLaneService.GetUOMList(this.clientid).subscribe(data => {
      if (data.data != null) {

        this.RateperuomList = data.data;

        this.RateperuomData = [this.RateperuomList.find(unit => unit.code === 'USD')];
        this.RateperuomData.sort((a, b) => {
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
    if (FreightLane == null) {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
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
  selectNext(ngform: NgForm) {

    var saveWithoutCarrier: boolean = false;

    var FreightLaneToBeSaved = this.GetAllFreightLaneData();

    if (FreightLaneToBeSaved == null) {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
    else {
      this.isDisabledContent = false;
      this.editMode = false;
      this.entry = true;
      if (this.fromGeoLocation == null) {
        this.addlist = this.addlist + 1;
      }
      else {
        this.FreightLanelist1 = [];
      }

      if (this.ELEMENT_DATA == undefined) {
        this.ELEMENT_DATA = [];
      }
      let model = new FreightLane();
      if (this.ELEMENT_DATA.length == 0) {

        saveWithoutCarrier = true;

        if (this.FgeolocData.length) {
          model.fromGeoLocationId = this.FgeolocData[0].id;
          model.fromGeoLocation = this.FgeolocData[0].geoLocation;

        }
        if (this.TgeolocData.length) {
          model.toGeoLocationId = this.TgeolocData[0].id;
          model.toGeoLocation = this.TgeolocData[0].geoLocation;

        }
        if (this.FreightModeData.length) {
          model.freightModeId = this.FreightModeData[0].id;
          model.freightMode = this.FreightModeData[0].name;
        }
        if (this.DistanceUomData.length) {
          model.distanceUomid = this.DistanceUomData[0].id;
          model.distanceUOM = this.DistanceUomData[0].name;
        }
        model.distance = Number(this.Distance);
        model.travelTimeInDays = Number(this.TravelTime);
        model.clientId = this.authenticationService.currentUserValue.ClientId;

        if (this.CarrierData != null && this.CarrierData != undefined && this.CarrierData.length > 0) {
          model.carrier = this.CarrierData[0].description;
          model.carrierID = this.CarrierData[0].id;
        }
        if (this.EquipmentData != null && this.EquipmentData != undefined && this.EquipmentData.length > 0) {
          model.equipmentType = this.EquipmentData[0].description;
          model.equipmentTypeID = this.EquipmentData[0].id;
        }
        if (this.Rateperload != null && this.Rateperload > 0)
          model.ratePerLoad = Number(this.Rateperload);
        if (this.RateperuomData != undefined && this.RateperuomData != null && this.RateperuomData.length > 0) {
          model.ratePerUom = this.RateperuomData[0].description;
          model.costUOMID = this.RateperuomData[0].id;
        }

        model.createdBy = this.authenticationService.currentUserValue.LoginId;
        model.createDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
        model.updateDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date()); ``
        model.updatedBy = this.authenticationService.currentUserValue.LoginId;
        var fsplit = this.FgeolocData[0].geoLocation.split('-');
        var tsplit = this.TgeolocData[0].geoLocation.split('-');
        model.addedlistDisplay = fsplit[1] + '-' + tsplit[1] + '-' + model.freightMode;




        this.ELEMENT_DATA.push(model);
      }



      //this.btnSaveAll();


      this.ELEMENT_DATA.forEach((value, index) => {
        value.createDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
        value.updateDateTimeBrowserStr = this.freightLaneService.convertDatetoStringDate(new Date());
      });

      if (saveWithoutCarrier) {
        this.freightLaneService.SaveAllData(this.ELEMENT_DATA).subscribe(result => {
          if (result.statusCode == 200) {
            this.toastrService.success("The record is saved successfully")
            if (this.FreightLanelist2.length == 0 || !this.FreightLanelist2.some(item => item.addedlistDisplay === model.addedlistDisplay)) {
              this.GridData1.push(model);
              this.FreightLanelist2.push(model);
            }
            this.selectedFreightLane = { ...model };
            this.resetAllFrieghtLaneData(ngform);

          } else {
            this.toastrService.error("The record could not be saved. Please contact Tech Support");

          }
        });
      }
      else {

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


        // this.freightLaneService.UpdateAllData([model]).subscribe(result => {
        this.freightLaneService.UpdateAllData(this.ELEMENT_DATA).subscribe(result => {
          if (result.statusCode == 200) {
            this.toastrService.success("The record is saved successfully");




            this.resetAllFrieghtLaneData(ngform);

          } else {
            this.toastrService.error("The record could not be saved. Please contact Tech Support");

          }
        }
        );


      }


    }
  }

  resetAllFrieghtLaneData(ngform: NgForm) {
    if (this.FreightLanelist2 != undefined && this.FreightLanelist2.length > 0) {
      this.FreightLanelist2.forEach((value, index) => {
        if (this.ELEMENT_DATA != undefined && this.ELEMENT_DATA.length > 0) {
          if (value.addedlistDisplay == this.ELEMENT_DATA[0].addedlistDisplay) {
            value.distance = this.ELEMENT_DATA[0].distance;
            value.travelTimeInDays = this.ELEMENT_DATA[0].travelTimeInDays;
            value.travelTime = this.ELEMENT_DATA[0].travelTime;
          }
        }

      });
    }


    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<FreightLane>(this.ELEMENT_DATA);
    this.editMode = false;
    this.FgeolocData = [];
    this.TgeolocData = [];
    this.FreightModeData = [];
    this.fromGeoLocation = null;
    this.fromGeoLocationId = 0;
    this.toGeoLocation = null;
    this.toGeoLocationId = 0;
    this.CurrentIndex = -1;

    this.freightLaneService.GetGeoLocationList(this.authenticationService.currentUserValue.ClientId).subscribe(data => {
      if (data.data != null) {

        this.FgeolocList = data.data;
        this.TgeolocList = data.data;


        this.FgeolocList.sort((a, b) => {
          if (a.geoLocation < b.geoLocation) {
            return -1;
          }
          if (a.geoLocation > b.geoLocation) {
            return 1;
          }
          return 0;
        })
        this.TgeolocList.sort((a, b) => {
          if (a.geoLocation < b.geoLocation) {
            return -1;
          }
          if (a.geoLocation > b.geoLocation) {
            return 1;
          }
          return 0;
        })

      }
    });
    this.freightLaneService.GetFreightModeList(this.clientid).subscribe(data => {
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
    ngform.reset();
    this.freightLaneService.GetUOMList(this.clientid).subscribe(data => {
      if (data.data != null) {

        this.DistanceUomList = data.data;
        this.DistanceUomData = [this.DistanceUomList.find(unit => unit.code === 'Miles')];
        this.DistanceUomList.sort((a, b) => {
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




  }

  closeTab() {
    this.CurrentIndex = -1;
  }

  selectedFreightLaneToEdit(freightLane: FreightLane) {
    this.selectedFreightLane = { ...freightLane };
    const freightaddlist = new FreightLane();
    freightaddlist.fromGeoLocationId = freightLane.fromGeoLocationId;
    freightaddlist.toGeoLocationId = freightLane.toGeoLocationId;
    freightaddlist.freightModeId = freightLane.freightModeId;
    this.ELEMENT_DATA = [];
    // this.freightaddlist.addedlistDisplay = i.addedlistDisplay;selectedFreightLaneToEdit
    this.freightLaneService.GetRecordById(freightaddlist).subscribe(res => {
      if (res.data) {
        const records = res.data.filter(rec => rec.carrierID !== 0);
        this.ELEMENT_DATA = <FreightLane[]>records;
        this.dataSource = new MatTableDataSource<FreightLane>(records);
      }
    });
  }
  editMode: boolean;
  freightaddlist: FreightLane;
  selectedFreightLane: FreightLane;
  selected(freightLane) {
    this.selectedFreightLaneToEdit(freightLane);

    this.editMode = true;

    this.addedlist = freightLane.addlist;
    this.fromGeoLocation = freightLane.fromGeoLocation;
    this.toGeoLocation = freightLane.toGeoLocation;
    this.freightMode = freightLane.freightMode;
    this.fromGeoLocationId = freightLane.fromGeoLocationId;
    this.toGeoLocationId = freightLane.toGeoLocationId;
    this.freightModeId = freightLane.freightModeId;
    this.Distance = freightLane.distance;
    this.TravelTime = freightLane.travelTimeInDays;
    this.DistanceUOM = freightLane.distanceUOM;
    this.DistanceUOMId = freightLane.distanceUomid;
    // this.GridData = this.ELEMENT_DATA;
    this.ItemList = [];
    this.FgeolocData = [];
    this.TgeolocData = [];
    this.FreightModeData = [];
    this.savedisable = false;

    var selectedFromGoeLocation = this.FgeolocList.find(x => Number(x.id) == Number(this.fromGeoLocationId));
    if (selectedFromGoeLocation != undefined && selectedFromGoeLocation != null) {
      this.FgeolocData.push(selectedFromGoeLocation);
    }

    var selectedToGoeLocation = this.TgeolocList.find(x => Number(x.id) == Number(this.toGeoLocationId));
    if (selectedToGoeLocation != undefined && selectedToGoeLocation != null) {
      this.TgeolocData.push(selectedToGoeLocation);
    }

    var selectedfrieghtmode = this.FreightModeList.find(x => x.id == freightLane.freightModeId);
    if (selectedfrieghtmode != undefined && selectedfrieghtmode != null) {
      this.FreightModeData.push(selectedfrieghtmode);
    }




  }

  removeFreightLaneFromEditList(freightModeToRemove: FreightLane) {
    this.FreightLanelist2.splice(this.FreightLanelist2.findIndex(item => item.addedlistDisplay === freightModeToRemove.addedlistDisplay), 1)
  }
}








