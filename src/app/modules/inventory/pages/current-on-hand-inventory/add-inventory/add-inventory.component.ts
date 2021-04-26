import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../../core';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { InventoryModel, CommonModel } from '../../../../../core/models/inventory.model';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {
  locationFunctionList = [];
  selectedLocationFunction = [];

  locationList = [];
  selectedLocation = [];

  materialList = [];
  selectedMaterial = [];

  Matsettings = {};
  LFsettings = {};
  Locsettings = {};

  model = new InventoryModel();
  commonModel = new CommonModel();
  currentUser: User;

  constructor(private inventoryService: InventoryService,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    this.commonModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.getLocationFunction();
    this.getMaterial();
    this.getUOMList();   
    this.DDsettings();
  }

  onLocationFunctionSelect(item: any) {
    this.locationList = [];
    this.commonModel.LocationFunctionId = item.id;
    this.getLocationbyLocationFunction();
  }
  OnLocationFunctionDeSelect(item: any) {
    this.locationList = [];
  }
  onLocationFunctionDeSelectAll(items: any) {
    this.locationList = [];
  }
  onAddItem(data: string) {
  }
  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }

  DDsettings() {
    this.LFsettings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey: 'name',
      searchBy: ['name'],
      noDataLabel: "No Data Available"
    }
    this.Locsettings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey: 'name',
      searchBy: ['name'],
      noDataLabel: "No Data Available"
    }    
    this.Matsettings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey: 'name',
      searchBy: ['name'],
      noDataLabel: "No Data Available"
    };
  }

  getLocationFunction() {
    this.inventoryService.GetLocationFunction(this.commonModel)
      .subscribe(result => {
        this.locationFunctionList = result.data;
      });
  }

  getLocationbyLocationFunction() {
    this.inventoryService.GetLocationbyLocationFunction(this.commonModel)
      .subscribe(result => {
        this.locationList = result.data;
      });
  }

  getMaterial() {
    this.inventoryService.getMaterialList(this.commonModel)
      .subscribe(result => {
        this.materialList = result.data;
      });
  }

  saveCurrentOnHandMaterial() {
    this.setDataModel();
    this.inventoryService.saveCurrentMaterialOnhand(this.model).subscribe(result => {
      if (result.data == false) {
        this.toastrService.info('Inventory already exists.');
      }
      else {
        this.toastrService.success('Record saved successfully.');
        this.close();
      }
    });
  }

  getUOMList() {    
    this.inventoryService.getUOMList(this.commonModel)
      .subscribe(result => {
        if (result.data != null || result.data != undefined) {
          result.data.forEach(element => {
            if (element.code === 'EA') {
              this.model.uom = element.name;
              this.model.quantityUOMID = element.id;
            }
          });
        }
      });
  }

  setDataModel() {
    this.model.locationID = this.selectedLocation.map(function (x) { return x.id; })[0];
    this.model.materialID = this.selectedMaterial.map(function (x) { return x.id; })[0];
    this.model.isDeleted = false;
    this.model.clientID = this.currentUser.ClientId;
    this.model.sourceSystemID = this.currentUser.SourceSystemID;
    this.model.updatedBy = this.currentUser.LoginId;
    this.model.createdBy = this.currentUser.LoginId;
  }

  close() {
    this.activeModal.close();
  }
}
