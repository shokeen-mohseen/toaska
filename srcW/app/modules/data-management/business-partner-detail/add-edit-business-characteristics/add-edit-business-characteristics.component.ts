import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { BusinessPartnerExistingCharacteristicsModel } from '../../../../core/models/BusinessPartner.model';
import { DefaultLocationCharacteristicsModel, LocationExistingCharacteristicsModel } from '../../../../core/models/Location';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { UomService } from '../../../../core/services/uom.service';
@Component({
  selector: 'app-add-edit-business-characteristics',
  templateUrl: './add-edit-business-characteristics.component.html',
  styleUrls: ['./add-edit-business-characteristics.component.css']
})
export class AddEditBusinessCharacteristicsComponent implements OnInit {

  @Input("businessPartnerId") businessPartnerId: number;
  @Input("businessPartnerTypeCode") businessPartnerTypeCode: string;

  @Input("defaultCharacteristics") defaultCharacteristics: DefaultLocationCharacteristicsModel[] = [];
  @Input("existingCharacteristics") existingCharacteristics: BusinessPartnerExistingCharacteristicsModel[] = [];

  settingsValueList: any;

  uomList = [];
  settingsUoMList: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private businessPartnerService: BusinessPartnerService,
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
        if (characteristics.webControlCode == "DDL"  && characteristics.entityclientPropertyControlValueViewModel
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
    var updateList = [];
    this.defaultCharacteristics.forEach(characteristics => {
      var newItem = new BusinessPartnerExistingCharacteristicsModel();
      newItem.id = characteristics.id;

      if (this.businessPartnerTypeCode === "Carrier") {
        newItem.carrierId = this.businessPartnerId;
      }
      else {
        newItem.locationId = this.businessPartnerId;
      }
      newItem.entityPropertyID = characteristics.entityPropertyID;
      if (characteristics.valueSelected) {
        if (Array.isArray(characteristics.valueSelected)) {
          newItem.propertyValue = characteristics.valueSelected[0].controlDisplayValue;
        } else {
          newItem.propertyValue = characteristics.valueSelected;
        }
        newItem.isDeleted = false;
      } else {
        newItem.propertyValue = '';
        newItem.isDeleted = true;
      }

      if (characteristics.uomSeleceted && characteristics.uomSeleceted[0]) {
        newItem.propertiesUom = characteristics.uomSeleceted[0].id;
      }
      newItem.updateDateTimeBrowser = new Date();
      newItem.createDateTimeBrowser = new Date();
      newItem.updatedBy = this.authenticationService.currentUserValue.LoginId;
      newItem.createdBy = this.authenticationService.currentUserValue.LoginId;
      updateList.push(newItem);
    });
    if (this.businessPartnerTypeCode === "Carrier") {
      this.businessPartnerService.mergeCarrierCharacteristicsData(updateList)
        .subscribe(
          (result) => {
            if (result.statusCode == 200 && result.data) {
              this.toastrService.success("Saved successful.");
              this.activeModal.close('success');
            } else {
              this.toastrService.error("Saving failed. Please try again later.");
            }

          },
          (error) => {
            this.toastrService.error('Error while saving changes, please try again later.');
          }
        );
    } else {
      this.businessPartnerService.mergeCharacteristicsData(updateList)
        .subscribe(
          (result) => {
            if (result.statusCode == 200 && result.data) {
              this.toastrService.success("Saved successful.");
              this.activeModal.close('success');
            } else {
              this.toastrService.error("Saving failed. Please try again later.");
            }

          },
          (error) => {
            this.toastrService.error('Error while saving changes, please try again later.');
          }
        );
    }
   
  }

}
