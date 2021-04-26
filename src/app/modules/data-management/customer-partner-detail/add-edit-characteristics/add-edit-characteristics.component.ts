import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { DefaultLocationCharacteristicsModel, LocationExistingCharacteristicsModel } from '../../../../core/models/Location';
import { UomService } from '../../../../core/services/uom.service';
@Component({
  selector: 'app-add-edit-characteristics',
  templateUrl: './add-edit-characteristics.component.html',
  styleUrls: ['./add-edit-characteristics.component.css']
})
export class AddEditCharacteristicsComponent implements OnInit {
  @Input("customerId") customerId: number;

  @Input("defaultCharacteristics") defaultCharacteristics: DefaultLocationCharacteristicsModel[] = [];
  @Input("existingCharacteristics") existingCharacteristics: LocationExistingCharacteristicsModel[] = [];

  settingsValueList: any;
  Inactive: boolean = false;
  uomList = [];
  settingsUoMList: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private customerByLocationService: CustomerByLocationService,
    private uomService: UomService
  ) { }



  ngOnInit(): void {
    this.Inactive = this.customerByLocationService.Permission == false ? true : false;
    this.getUomList();
    this.settingsValueList = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      primaryKey: 'controlDatabaseValue',
      labelKey: 'controlDisplayValue'
    };
    this.settingsUoMList = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      primaryKey: 'id',
      labelKey: 'name',
      searchBy: ['name']
      

    };

    
  }

  getUomList() {
    this.uomService.getUomList(this.authenticationService.currentUserValue.ClientId)
      .subscribe(
        (result) => {
          if (result && result.data) {
            this.uomList = result.data;
            this.bindData();
          }
        },
        error => {
          this.toastrService.warning("The UOM is not available. Please contact Tech Support.")
        }
      )
  }
  currentCustomerFuelCostValue: string;
  prevCustomerFuelCostValue: string;
  bindData() {
    var characteristics;
    for (characteristics of this.defaultCharacteristics){
      var findMatch = this.existingCharacteristics.find(x => x.displayName === characteristics.description);

      if (findMatch) {
        if (characteristics.entityPropertyCode == "CustomerFuelCostPassthroughPercent") {
          this.currentCustomerFuelCostValue = findMatch.propertyValue;
        }

        if (characteristics.entityclientPropertyControlValueViewModel
          && characteristics.entityclientPropertyControlValueViewModel.length > 0) {
          var matchedValue = characteristics
            .entityclientPropertyControlValueViewModel
            .find(x => x.controlDisplayValue === findMatch.propertyValue);
          if (matchedValue) {
            characteristics.valueSelected = [];
            characteristics.valueSelected[0] = matchedValue;
          }
         
        } else {
          characteristics.valueSelected = findMatch.propertyValue;
          var uomMatched = this.uomList.find(x => x.name == findMatch.propertiesUom);
          if (uomMatched) {
            characteristics.uomSeleceted = [];
            characteristics.uomSeleceted[0] = uomMatched;
          }
          
          
        }
        characteristics.id = findMatch.id;
      }

    }
  }

  saveCharacteristicsData() {
    var updateList =[];
    this.defaultCharacteristics.forEach(characteristics => {

      if (characteristics.entityPropertyCode == "CustomerFuelCostPassthroughPercent") {
        if (this.currentCustomerFuelCostValue) {
          if (characteristics.valueSelected != this.currentCustomerFuelCostValue) {
            this.prevCustomerFuelCostValue = this.currentCustomerFuelCostValue;
          }
        }
      }

      if (characteristics.entityPropertyCode == "PrevCustomerFuelCostPassthroughPercent") {
        if (this.prevCustomerFuelCostValue) {
          characteristics.valueSelected = this.prevCustomerFuelCostValue;
        }        
      }
      var newItem = new LocationExistingCharacteristicsModel();
      newItem.id = characteristics.id;
      newItem.locationId = this.customerId;
      newItem.entityPropertyID = characteristics.entityPropertyID;
      if (characteristics.valueSelected) {
        if (characteristics.webControlCode == 'DDL') {
          newItem.propertyValue = characteristics.valueSelected[0].controlDatabaseValue;
        } else {
          newItem.propertyValue = characteristics.valueSelected;
        }
        newItem.isDeleted = false;
      } else {
        newItem.propertyValue = '';
        newItem.isDeleted = true;
      }

      if (characteristics.uomSelected && characteristics.uomSelected[0]) {
        newItem.propertiesUom = characteristics.uomSelected[0].id + '';
      }
      if (!newItem.propertyValue )
        newItem.isDeleted = true;
      newItem.updateDateTimeBrowser = new Date();
      newItem.createDateTimeBrowser = new Date();
      newItem.updatedBy = this.authenticationService.currentUserValue.LoginId;
      newItem.createdBy = this.authenticationService.currentUserValue.LoginId;
      updateList.push(newItem);
    });

    this.customerByLocationService.mergeCharacteristicsData(updateList)
      .subscribe(
        (result) => {
          if (result.statusCode == 200 && result.data) {
            this.toastrService.success("The record is saved successfully.");
            this.activeModal.close('success');
          } else {
            this.toastrService.error("The record could not be saved. Please contact Tech Support.");
          }
         
        },
        (error) => {
          this.toastrService.error('The changes could not be saved. Please contact Tech Support.');
        }
      );
  }

}
