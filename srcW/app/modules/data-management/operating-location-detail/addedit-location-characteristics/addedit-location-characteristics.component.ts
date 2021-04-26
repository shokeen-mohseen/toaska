import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultLocationCharacteristicsModel } from '../../../../core/models/Location';
import { LocationExistingCharacteristicsModel } from '../../../../core/models/CustomerByLocation.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';

import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { UomService } from '../../../../core/services/uom.service';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
@Component({
  selector: 'app-addedit-location-characteristics',
  templateUrl: './addedit-location-characteristics.component.html',
  styleUrls: ['./addedit-location-characteristics.component.css']
})

export class AddeditLocationCharacteristicsComponent implements OnInit {
  @Input("locationId") locationId: number; @Input("isEditRights") isEditRights: boolean;
  @Input("defaultCharacteristics") defaultCharacteristics: DefaultLocationCharacteristicsModel[] = [];
  @Input("existingCharacteristics") existingCharacteristics: LocationExistingCharacteristicsModel[] = [];

  settingsValueList: any;

  uomList = [];
  settingsUoMList: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private customerByLocationService: CustomerByLocationService,
    private uomService: UomService
  ) { }



  ngOnInit(): void {

    this.getUomList();
    this.settingsValueList = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      primaryKey: 'controlDatabaseValue',
      labelKey: 'controlDisplayValue'
    };
    this.settingsUoMList = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      primaryKey: 'id',
      labelKey: 'name'
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
          this.toastrService.warning("Error getting UOM list.")
        }
      )
  }

  bindData() {
    var characteristics;
    for (characteristics of this.defaultCharacteristics) {
      var findMatch = this.existingCharacteristics.find(x => x.displayName === characteristics.description);

      if (findMatch) {
        if (characteristics.webControlCode == "DDL" && characteristics.entityclientPropertyControlValueViewModel
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

  //bindData() {
  //  var characteristics;
  //  for (characteristics of this.defaultCharacteristics) {
  //    var findMatch = this.existingCharacteristics.find(x => x.displayName === characteristics.description);

  //    if (findMatch) {
  //      if (characteristics.entityclientPropertyControlValueViewModel
  //        && characteristics.entityclientPropertyControlValueViewModel.length > 0) {
  //        var matchedValue = characteristics
  //          .entityclientPropertyControlValueViewModel
  //          .find(x => x.controlDisplayValue === findMatch.propertyValue);
  //        if (matchedValue) {
  //          characteristics.valueSelected = [];
  //          characteristics.valueSelected[0] = matchedValue;
  //        }

  //      } else {
  //        characteristics.valueSelected = findMatch.propertyValue;
  //        var uomMatched = this.uomList.find(x => x.name == findMatch.propertiesUom);
  //        if (uomMatched) {
  //          characteristics.uomSeleceted = [];
  //          characteristics.uomSeleceted[0] = uomMatched;
  //        }


  //      }
  //      characteristics.id = findMatch.id;
  //    }

  //  }
  //}

  saveCharacteristicsData() {
    if (!this.isEditRights) {
      return;
    }
    debugger;
    var updateList = [];
    this.defaultCharacteristics.forEach(characteristics => {
      var newItem = new LocationExistingCharacteristicsModel();
      newItem.id = characteristics.id;
      newItem.locationId = this.locationId;
      newItem.entityPropertyID = characteristics.entityPropertyID;
      if (characteristics.valueSelected) {
        if (Array.isArray(characteristics.valueSelected)) {
          newItem.propertyValue = characteristics.valueSelected[0].controlDisplayValue;
        } else {
          newItem.propertyValue = characteristics.valueSelected;
        }
      } else {
        newItem.propertyValue = '';
      }

      if (characteristics.uomSelected && characteristics.uomSelected[0]) {
        newItem.propertiesUom = (characteristics.uomSelected[0].id).toString();
      }
      if (!newItem.propertyValue)
        newItem.isDeleted = true;
      newItem.updateDateTimeBrowser = new Date();
      newItem.createDateTimeBrowser = new Date();
      newItem.updatedBy = this.authenticationService.currentUserValue.LoginId;
      newItem.createdBy = this.authenticationService.currentUserValue.LoginId;
      updateList.push(newItem);
    });
      this.customerByLocationService.UpdateOperatingLocationCharacteristics(updateList)
        .subscribe(
          (result) => {
            if (result.statusCode == 200 && result.data) {
              this.toastrService.success(GlobalConstants.SUCCESS_MESSAGE);
              this.passEntry.emit(1);
              this.activeModal.dismiss('Cross click');
            } else {
              this.toastrService.error(GlobalConstants.error_message);
            }

          },
          (error) => {
            this.toastrService.error(GlobalConstants.error_message);
          }
        );
    }
  

}
