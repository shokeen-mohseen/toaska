import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { BusinessPartnerExistingCharacteristicsModel } from '../../../../core/models/BusinessPartner.model';
import { DefaultLocationCharacteristicsModel, LocationExistingCharacteristicsModel, LocationPropertyDeleteModel } from '../../../../core/models/Location';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { LocationService } from '../../../../core/services/location.service';
import { AddEditBusinessCharacteristicsComponent } from '../add-edit-business-characteristics/add-edit-business-characteristics.component';

@Component({
  selector: 'app-business-characteristics-panel',
  templateUrl: './business-characteristics-panel.component.html',
  styleUrls: ['./business-characteristics-panel.component.css']
})
export class BusinessCharacteristicsPanelComponent implements OnInit {
  constructor(public modalService: NgbModal,
    private locationService: LocationService,
    private businessPartnerService: BusinessPartnerService,
    private toastrService: ToastrService,
    private authenticationService: AuthService
  ) { }
  modalRef: NgbModalRef;
  @Input("getCharacteristicsById") getCharacteristicsById: number;
  @Input("locationTypeCode") businessPartnerTypeCode: string;
  @Output("statOfCharacteristics") statOfCharacteristics = new EventEmitter<string>();
  
  existingCharacteristics: BusinessPartnerExistingCharacteristicsModel[] = [];
  defaultCharacteristics: DefaultLocationCharacteristicsModel[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.getCharacteristicsById && changes.getCharacteristicsById.previousValue) {
      this.getExistingMapping();
    }
  }

  ngOnInit(): void {
    this.getDefaultCharacteristics();
    this.getExistingMapping();
  }

  getExistingMapping() {
    if (this.businessPartnerTypeCode === 'Carrier') {
      this.businessPartnerService.getExistingCarrierCharacteristics({
        "CarrierId": this.getCharacteristicsById,
        "ClientId": this.authenticationService.currentUserValue.ClientId
      })
        .subscribe((result) => {
          if (result) {
            this.existingCharacteristics = result.data;
            this.emitStatOfCharacteristics();
          }
        });
    } else {
      this.locationService.getExistingCharacteristics({
        "LocationId": this.getCharacteristicsById,
        "ClientId": this.authenticationService.currentUserValue.ClientId
      })
        .subscribe((result) => {
          if (result) {
            this.existingCharacteristics = result.data;
            this.emitStatOfCharacteristics();
          }
        });
    }
  }
  emitStatOfCharacteristics() {
    this.statOfCharacteristics.emit(this.existingCharacteristics.length + "/" + this.defaultCharacteristics.length)
  }
  openCharacteristics() {
    this.modalRef = this.modalService.open(AddEditBusinessCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.businessPartnerId = this.getCharacteristicsById;
    this.modalRef.componentInstance.businessPartnerTypeCode = this.businessPartnerTypeCode;
    this.modalRef.componentInstance.defaultCharacteristics = this.defaultCharacteristics;
    this.modalRef.componentInstance.existingCharacteristics = this.existingCharacteristics;
    this.modalRef.result.then((result) => {
      if (result === 'success') {
        this.getExistingMapping(); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }

  getDefaultCharacteristics() {
    var entityCode = this.businessPartnerTypeCode === "Carrier" ? "Carrier" : "BusinessPartner";
    this.locationService.getDefaultCharacteristics({
      "EntityCode": entityCode, "ClientId": this.authenticationService.currentUserValue.ClientId
    }).subscribe(
      (result) => {
        if (result && result.data) {
          this.defaultCharacteristics = result.data;
          this.emitStatOfCharacteristics();
        }
      },
      error => {
        this.toastrService.warning("Error getting characteristics ")
      }

    )
  }
  selectRow(item: LocationExistingCharacteristicsModel) {

    this.existingCharacteristics.forEach(x => {
      if (x.id === item.id) {
        x.isSelected = !x.isSelected;
        return;
      }
    })
  }
  deleteCharacteristics() {
    var selectedItems = this.existingCharacteristics.filter(x => x.isSelected);
    if (!selectedItems || selectedItems.length == 0) {
      this.toastrService.warning("Please select items to delete.");
    }
    else {
      var idstoDelete = new LocationPropertyDeleteModel();
      idstoDelete.locationId = this.getCharacteristicsById;
      idstoDelete.ids = selectedItems.map(x => x.id);
      idstoDelete.deletedBy = this.authenticationService.currentUserValue.LoginId;
      idstoDelete.locationTypeCode = this.businessPartnerTypeCode;
      if (this.businessPartnerTypeCode === "Carrier") {
        this.businessPartnerService.deleteCarrierCharacteristics(idstoDelete)
          .subscribe((result) => {
            if (result.statusCode == 200 && result.data) {
              this.toastrService.success("Deleted successfully.");
              this.getExistingMapping();
            } else {
              this.toastrService.error("Deletion failed. Please try again later.");
            }
          });
      }
      else {
        this.locationService.deleteCharacteristics(idstoDelete)
          .subscribe((result) => {
            if (result.statusCode == 200 && result.data) {
              this.toastrService.success("Deleted successfully.");
              this.getExistingMapping();
            } else {
              this.toastrService.error("Deletion failed. Please try again later.");
            }
          });
      }
      
    }
  }
}
