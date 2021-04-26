import { Component, OnInit, Input } from '@angular/core';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { FreightLane } from '../../../../../core/models/FreightLane.model';
import { GeolocationService } from '../../../../../core/services/geolocation.services';
import { AuthService } from '../../../../../core';
import { FreightLaneService } from '@app/core/services/freightlane.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { FreightLaneExcelUpload } from '../../../../../core/models/FreightLaneExcelUpload.model';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
@Component({
  selector: 'app-edit-freightlane',
  templateUrl: './edit-freightlane.component.html',
  styleUrls: ['./edit-freightlane.component.css']
})
export class EditFreightlaneComponent implements OnInit {
  ngForm: FormGroup;
  Inactive: boolean = false;
  displayedColumns = ['selectRow', 'carrier', 'equipmentType', 'ratePerLoad', 'ratePerUom'];
  displayedColumnsReplace = ['selectRow', 'key_Carrier', 'key_Equipment', 'key_Rateperload',
    'key_Rateperuom'];
  dataSource;
  selection = new SelectionModel<FreightLane>(true, []);
  selectRow: any;


  ELEMENT_DATA: FreightLane[] = [];
  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};

  count = 3;
  stateCode: string; countryCode: string; cityCode: string; zipCode: string;
  freightMode: any;
  CarrierList: any = [];
  EquipmentList: any = []; CarrierRateList: any = []; RateperuomList: any = [];
  TravelList: any = []; DistanceUomList: any = [];
  Rateperload: any;
  clientId: number;
  fromGeoLocation: any;
  toGeoLocation: any;
  travelTimeDays:any;
  distance: any;
  FreightDetId: any;
  DistanceUomData = [];

  CarrierData = [];
  Equipment: any;
  Carrier: any;
  EquipmentData = [];
  RateperuomData = [];
  CarrierRateData = [];
  FreightLanemodel: FreightLane;
  @Input() FreightLaneToEdit: FreightLane[];
  selectedFreightLaneToEdit: FreightLane = null;
  selectionIndex = 0;
  GridData = [];
  constructor(

    private freightLaneService: FreightLaneService,
    private geolocation: GeolocationService,

    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public modalService: NgbModal
  ) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.FreightLanemodel = new FreightLane();
    this.FreightLanemodeladd = new FreightLane();

  }

  ItemList: FreightLane[];
  FreightList: FreightLane[];
  ngOnInit(): void {
  
    this.Inactive = this.freightLaneService.Permission == false ? true : false;
    this.selectRow = 'selectRow';
    this.dataSource = new MatTableDataSource<FreightLane>(this.ELEMENT_DATA);

    this.FreightList = [];
    for (var i = 0; i < this.FreightLaneToEdit.length; i++) {
      const freightLane = this.FreightLaneToEdit[i];
      if (!this.FreightList.some(item => item.freightLaneId === freightLane.freightLaneId)) {
        this.FreightList.push(freightLane);
        freightLane.addedlistDisplay = freightLane.fromState + '-' + freightLane.toState + '-' + freightLane.freightMode;
      }
    }

    this.ItemList = new Array<any>();
    this.selectedFreightLane(this.FreightLaneToEdit[0]);
    this.freightLaneService.GetUOMList(this.clientId).subscribe(data => {
      if (data.data != null) {
 
        this.DistanceUomList = data.data;
        this.RateperuomList = data.data;
        this.setSelectedFreightLaneMapping();
      }
    });
    this.freightLaneService.GetEquipmentFreightMode(this.clientId, this.selectedFreightLaneToEdit.freightModeId).subscribe(data => {
      if (data.data != undefined) {
        this.EquipmentList = data.data;
      }
    });
    this.freightLaneService.GetCarrierList(this.clientId).subscribe(data => {
      if (data.data != null) {

        this.CarrierList = data.data;
      }
    });

    this.selectedFreightLaneFromEditList(0, 1);

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
      singleSelection: false,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName'],
      lazyLoading: true,
      addNewItemOnFilter: false
    };

  }
  freightaddlist: FreightLane;
  selectedFreightLaneFromEditList(i, j) {
    this.selectionIndex = i;
    if (j == 1) {
      this.selectedFreightLaneToEdit = this.FreightList[i];
    }
    else {
      this.selectedFreightLaneToEdit = i;
    }

    this.dataSource = new MatTableDataSource<FreightLane>(null);
    this.freightaddlist = new FreightLane();
    this.freightaddlist.fromGeoLocationId = this.selectedFreightLaneToEdit.fromGeoLocationId
    this.freightaddlist.toGeoLocationId = this.selectedFreightLaneToEdit.toGeoLocationId
    this.freightaddlist.freightModeId = this.selectedFreightLaneToEdit.freightModeId
    this.freightLaneService.GetRecordById(this.freightaddlist).subscribe(data => {
      if (data.data != null) {
       
        this.ELEMENT_DATA = [];
        for (var j = 0; j < data.data.length; j++) {
          if (data.data[j].carrierID != 0)
            this.ELEMENT_DATA.push(data.data[j]);
          this.GridData.push(data.data[j]);
        }
        this.dataSource = new MatTableDataSource<FreightLane>(this.ELEMENT_DATA);
      }
    });
    this.duplicate = false;
    this.GridData = [];
    if (this.selectedFreightLaneToEdit != null) {
      if (this.DistanceUomList.length > 0 && this.selectedFreightLaneToEdit.distanceUomid != null) {
        var lista = this.DistanceUomList.find(x => x.id == this.selectedFreightLaneToEdit.distanceUomid);
        if (lista != null) {
          this.DistanceUomData[0] = lista;
        }

      }

      if (this.selectedFreightLaneToEdit.fromGeoLocationId != null) {
        this.fromGeoLocation = this.selectedFreightLaneToEdit.fromCountry + '-' + this.selectedFreightLaneToEdit.fromState + '-' + this.selectedFreightLaneToEdit.fromCity + '-' + this.selectedFreightLaneToEdit.fromZipcode;
      }
      if (this.selectedFreightLaneToEdit.toGeoLocationId != null) {
        this.toGeoLocation = this.selectedFreightLaneToEdit.toCountry + '-' + this.selectedFreightLaneToEdit.toState + '-' + this.selectedFreightLaneToEdit.toCity + '-' + this.selectedFreightLaneToEdit.toZipcode;
      }
      if (this.selectedFreightLaneToEdit.freightMode != null) {
        this.freightMode = this.selectedFreightLaneToEdit.freightMode;
      }
      if (this.selectedFreightLaneToEdit.distance != null) {
        this.distance = this.selectedFreightLaneToEdit.distance;
      }
      if (this.selectedFreightLaneToEdit.travelTimeInDays != null) {
        this.travelTimeDays = this.selectedFreightLaneToEdit.travelTimeInDays;
      }
     
      
    }
  }
  duplicate: boolean;
  setSelectedFreightLaneMapping() {

    if (this.selectedFreightLaneToEdit != null) {
      if (this.DistanceUomList.length > 0 && this.selectedFreightLaneToEdit.distanceUomid != null) {
        var lista = this.DistanceUomList.find(x => x.id == this.selectedFreightLaneToEdit.distanceUomid);
        if (lista != null) {
          this.DistanceUomData[0] = lista;
        }
     
      }

      if (this.selectedFreightLaneToEdit.fromGeoLocationId != null) {
        this.fromGeoLocation = this.selectedFreightLaneToEdit.fromCountry + '-' + this.selectedFreightLaneToEdit.fromState + '-' + this.selectedFreightLaneToEdit.fromCity + '-' + this.selectedFreightLaneToEdit.fromZipcode; 
      }
      if (this.selectedFreightLaneToEdit.toGeoLocationId != null) {
        this.toGeoLocation = this.selectedFreightLaneToEdit.toCountry + '-' + this.selectedFreightLaneToEdit.toState + '-' + this.selectedFreightLaneToEdit.toCity +'-' + this.selectedFreightLaneToEdit.toZipcode;
      }
      if (this.selectedFreightLaneToEdit.freightMode != null) {
        this.freightMode = this.selectedFreightLaneToEdit.freightMode;
      }
      if (this.selectedFreightLaneToEdit.distance != null) {
        this.distance = this.selectedFreightLaneToEdit.distance;
      }
      if (this.selectedFreightLaneToEdit.travelTimeInDays != null) {
        this.travelTimeDays = this.selectedFreightLaneToEdit.travelTimeInDays;
      }
      for (var i = 0; i < this.FreightLaneToEdit.length; i++) {
        this.duplicate = false;
        if (this.FreightLaneToEdit[i].id == this.selectedFreightLaneToEdit.id) {
          let model = new FreightLane();
          model.freightLaneDetId = this.FreightLaneToEdit[i].freightLaneDetId;
          model.carrier = this.FreightLaneToEdit[i].carrier;
          model.equipmentType = this.FreightLaneToEdit[i].equipmentType;
          model.ratePerLoad = this.FreightLaneToEdit[i].ratePerLoad;
          model.ratePerUom = this.FreightLaneToEdit[i].ratePerUom;
          model.carrierID = this.FreightLaneToEdit[i].carrierID;
          model.equipmentTypeID = this.FreightLaneToEdit[i].equipmentTypeID;
          model.costUOMID = this.FreightLaneToEdit[i].costUOMID;
          if (this.GridData.length > 0) {
            for (var j = 0; j < this.GridData.length; j++) {
              if (this.GridData[j].freightLaneDetId == this.FreightLaneToEdit[i].freightLaneDetId) {
                this.duplicate = true;
              }
            }
          }
          if (this.duplicate==false)
          this.GridData.push(model);
        }
      }

     
        this.FillGrid()
      
    }
  }
  removeFreightLaneFromEditList(freightModeRemove: FreightLane) {
    this.FreightList.splice(this.FreightList.findIndex(item => item.id === freightModeRemove.id), 1)
  
  }
  selectedFreightLane(selectedFreightLaneToEdit: FreightLane) {
    this.selectedFreightLaneToEdit = Object.assign({}, selectedFreightLaneToEdit);
  }


  FillGrid() {
 
 
    this.dataSource = new MatTableDataSource<FreightLane>(null);
    this.ELEMENT_DATA = [];

    this.GridData.forEach((v) => {
      this.ELEMENT_DATA.push(v);
    });
    

    if (this.ELEMENT_DATA.length!=1 || this.ELEMENT_DATA[0].carrierID!=0)
      this.dataSource = new MatTableDataSource<FreightLane>(this.ELEMENT_DATA);


  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {}
  OnItemDeSelect(item: any) {}
  onSelectAll(items: any) {}
  onDeSelectAll(items: any) { }
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
          this.FreightDetId = this.ItemList[0].freightLaneDetId;
        }
      }
    }
    else {
      this.toastrService.warning("Please select one record to edit");
      this.popup = false;
    }
  }
  popup: boolean;
  add: boolean;
  FreightLanemodeladd: FreightLane;
  btnAdd(form: NgForm) {
  
   
    this.add = true;
    this.edit = false;
    this.popup = false;
    this.CarrierData.length = 0;
    this.EquipmentData.length = 0;
    this.RateperuomData.length = 0;
    this.Rateperload = null;


    var FreightLane = this.GetAllFreightLaneData();
    if (FreightLane == null) {
      this.toastrService.error("Please fill all mandatory fields to save the record");
      this.popup = false;
      return false;

    }
    else {
      this.freightLaneService.GetUOMList(this.clientId).subscribe(data => {
        if (data.data != null) {

         
          this.RateperuomList = data.data;
          this.RateperuomData = [this.RateperuomList.find(unit => unit.code === 'USD')];
          
        }
      });
      this.freightLaneService.GetEquipmentFreightMode(this.clientId, this.selectedFreightLaneToEdit.freightModeId)
        .subscribe(data => {
        if (data.data != undefined) {
          this.EquipmentList = data.data;
        }
      });
      this.freightLaneService.GetCarrierList(this.clientId).subscribe(data => {
        if (data.data != null) {

          this.CarrierList = data.data;
        }
      });
      this.popup = true;
    }
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
            const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
        

          });
          this.GridData = this.GridData.filter(item => !this.ItemList.includes(item));
          var getmodule = this.ItemList.map(({ id }) => id);
          this.Data = this.Data.filter(x => !getmodule.includes(x.Index));
          this.FillGrid();
          this.ItemList = null;
          
          this.toastrService.success('Record deleted successfully');
          this.ItemList = new Array<any>();  
        }, (reason) => {
        });
        
        
      }

  }
  GetAllFreightLaneData() {


  
    if (this.freightMode!=null) {
      this.FreightLanemodel.freightMode = this.freightMode;
    }
    else
      return null
    if (this.DistanceUomData.length > 0) {
      this.FreightLanemodel.distanceUomid = this.DistanceUomData[0].name;
    }
    else
      return null
    if (this.distance != null) {
      this.FreightLanemodel.distance = this.distance;
    }
    else
      return null
    if (this.travelTimeDays != null) {
      this.FreightLanemodel.travelTimeInDays = this.travelTimeDays;
    }
    else
      return null
   
    return this.FreightLanemodel;

  }
  Validation() {
    if ((this.CarrierData.length <= 0) || (this.EquipmentData.length <= 0) || (this.Rateperload == null) || (this.RateperuomData.length <= 0)) {
      this.toastrService.warning("Please fill all mandatory fields to save the record");
      return false;
    }
   else if (this.GridData.length > 0 && this.ItemList.length == 0) {
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
  save: boolean;
  btnSave() {
  
    this.save = true;
    var validaCarrier = this.Validation();
    if (validaCarrier == true) {
      var id = 0;
      var temData = [];
      var gridTemp = [];
      var that = this;
      that.countId = that.countId + 1;
      let model = new FreightLane();
      
      model.freightLaneDetId = this.FreightDetId;
      model.clientId = this.authenticationService.currentUserValue.ClientId;
      model.carrier = this.CarrierData[0].description;
      model.equipmentType = this.EquipmentData[0].description;
      model.ratePerLoad = Number(this.Rateperload);
      model.ratePerUom = this.RateperuomData[0].description;
      model.carrierID = this.CarrierData[0].id;
      model.equipmentTypeID = this.EquipmentData[0].id;
      //model.costPerUnit = this.RateperuomData[0];
      model.costUOMID = this.RateperuomData[0].id;
      model.createdBy = this.authenticationService.currentUserValue.LoginId;
      model.createDateTimeBrowser = new Date(new Date().toISOString());
      model.updateDateTimeBrowser = new Date(new Date().toISOString());
      model.updatedBy = this.authenticationService.currentUserValue.LoginId;
      //model.Index = that.countId;
      temData.push(model);
      //this.dataSource.data = model;
      id++;
      this.GridData = this.GridData.filter(item => !this.ItemList.includes(item));
      var getmodule = this.ItemList.map(({ id }) => id);
      this.Data = this.Data.filter(x => !getmodule.includes(x.Index));

      temData.forEach(function (s) {
        that.GridData.push(s);
      });
      this.FillGrid()
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

  btnSaveAll(i) {
    var Fillgrid = [];
    var FreightLaneToBeSaved = this.GetAllFreightLaneData();

    if (FreightLaneToBeSaved == null) {
      this.toastrService.error("Please fill all mandatory fields to save the record");
      return false;
    }
    
    else {
      if (i == 3 && this.ELEMENT_DATA.length == 0) {
        let model = new FreightLane();
        model.id = this.selectedFreightLaneToEdit.id;
        model.fromGeoLocationId = this.selectedFreightLaneToEdit.fromGeoLocationId;
        model.toGeoLocationId = this.selectedFreightLaneToEdit.toGeoLocationId;
        model.freightModeId = this.selectedFreightLaneToEdit.freightModeId;
        model.distanceUomid = this.DistanceUomData[0].id;
        model.distance = Number(this.distance);
        model.travelTimeInDays = Number(this.travelTimeDays);
        model.createdBy = this.authenticationService.currentUserValue.LoginId;
        model.createDateTimeBrowser = new Date(new Date().toISOString());
        model.updatedBy = this.authenticationService.currentUserValue.LoginId;
        model.updateDateTimeBrowser = new Date(new Date().toISOString());
        Fillgrid.push(model);
        if (this.save != true) {
          this.ELEMENT_DATA = [];
          Fillgrid.forEach((v) => {
            this.ELEMENT_DATA.push(v);
          });
          Fillgrid = [];
        }
      }
      else {
        this.ELEMENT_DATA[0].id = this.selectedFreightLaneToEdit.id;
        this.ELEMENT_DATA[0].fromGeoLocationId = this.selectedFreightLaneToEdit.fromGeoLocationId;
        this.ELEMENT_DATA[0].toGeoLocationId = this.selectedFreightLaneToEdit.toGeoLocationId;
        this.ELEMENT_DATA[0].freightModeId = this.selectedFreightLaneToEdit.freightModeId;
        this.ELEMENT_DATA[0].distanceUomid = this.DistanceUomData[0].id;
        this.ELEMENT_DATA[0].distance = Number(this.distance);
        this.ELEMENT_DATA[0].travelTimeInDays = Number(this.travelTimeDays);
        this.ELEMENT_DATA[0].createdBy = this.authenticationService.currentUserValue.LoginId;
        this.ELEMENT_DATA[0].createDateTimeBrowser = new Date(new Date().toISOString());
        this.ELEMENT_DATA[0].updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.ELEMENT_DATA[0].updateDateTimeBrowser = new Date(new Date().toISOString());
        Fillgrid.push(this.ELEMENT_DATA[0]);
        if (this.save != true) {
          this.ELEMENT_DATA = [];
          Fillgrid.forEach((v) => {
            this.ELEMENT_DATA.push(v);
          });
          Fillgrid = [];
        }
      }
      this.freightLaneService.UpdateAllData(this.ELEMENT_DATA).subscribe(result => {
        if (result.statusCode == 200) {
          this.toastrService.success("The record is saved successfully")
          this.selectedFreightLaneFromEditList(this.selectionIndex, 1);
    
        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support");

        }
      }
      );
    }
  }
  btnEditNext() {

    this.btnSaveAll(3);
    this.selectNext();
  }
  selectNext() {

    let nextIndex = this.FreightList.findIndex(item => item.id === this.selectedFreightLaneToEdit.id);
    this.FreightList[nextIndex] = { ...this.selectedFreightLaneToEdit };
    if (nextIndex == this.FreightList.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedFreightLaneFromEditList(this.FreightList[nextIndex],2);
  }
  closeTab() {

    this.ItemList = null;
    this.ItemList = new Array<any>();

  }
}
