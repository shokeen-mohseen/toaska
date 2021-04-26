import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddEditCharacteristicsComponent } from '../add-edit-characteristics/add-edit-characteristics.component';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { LocationExistingCharacteristicsModel } from '../../../../core/models/Location';
import {  LocationPropertyDeleteModel, DefaultLocationCharacteristicsModel } from '../../../../core/models/Location';
import { LocationService } from '../../../../core/services/location.service';
@Component({
  selector: 'app-customer-characteristics-panel',
  templateUrl: './customer-characteristics-panel.component.html',
  styleUrls: ['./customer-characteristics-panel.component.css']
})
export class CustomerCharacteristicsPanelComponent implements OnInit, OnChanges {

  constructor(public modalService: NgbModal,
    private locationService: LocationService,
    private toastrService: ToastrService,
    private customerByLocationService: CustomerByLocationService,
    private authenticationService: AuthService
  ) { }
  modalRef: NgbModalRef;
  @Input("customerId") customerId: number;
  @Output("statOfCharacteristics") statOfCharacteristics = new EventEmitter<string>();
  Inactive: boolean = false;
  existingCharacteristics: LocationExistingCharacteristicsModel[] = [];
  defaultCharacteristics: DefaultLocationCharacteristicsModel[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.customerId && changes.customerId.previousValue) {
      this.getExistingMapping();
    }
  }

  ngOnInit(): void {
    this.getDefaultCharacteristics();
    this.getExistingMapping();
    this.Inactive = this.customerByLocationService.Permission == false ? true : false;
  }

  getExistingMapping() {
    this.locationService.getExistingCharacteristics({
      "LocationId": this.customerId,
      "ClientId": this.authenticationService.currentUserValue.ClientId
    })
      .subscribe((result) => {
        if (result) {
          this.existingCharacteristics = result.data;
          this.emitStatOfCharacteristics();
        }
      });
  }
  emitStatOfCharacteristics() {
    this.statOfCharacteristics.emit(this.existingCharacteristics.length + "/" + this.defaultCharacteristics.length)
  }
  openCharacteristics() {
    this.modalRef = this.modalService.open(AddEditCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.customerId = this.customerId;
    this.modalRef.componentInstance.defaultCharacteristics = this.defaultCharacteristics;
    this.modalRef.componentInstance.existingCharacteristics = this.existingCharacteristics;
    this.modalRef.result.then((data) => {
      this.getExistingMapping();
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAnyUnSelected() {
    return this.existingCharacteristics.some(x => !x.isSelected);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAnyUnSelected() ?
      this.existingCharacteristics.forEach(row => { row.isSelected = true; })
      :
      this.existingCharacteristics.forEach(row => { row.isSelected = false; });
  }

  getDefaultCharacteristics() {
    this.locationService.getDefaultCharacteristics({
      "EntityCode": "Customer", "ClientId": this.authenticationService.currentUserValue.ClientId
    }).subscribe(
      (result) => {
        if (result && result.data) {
          this.defaultCharacteristics = result.data;
          this.emitStatOfCharacteristics();
        }
      },
      error => {
        this.toastrService.warning("The characteristics are not available. Please contact Tech Support.")
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
      this.toastrService.warning("Please select records to delete.");
    }
    else {
      var idstoDelete = new LocationPropertyDeleteModel();
      idstoDelete.locationId = this.customerId;
      idstoDelete.ids = selectedItems.map(x => x.id);
      idstoDelete.deletedBy = this.authenticationService.currentUserValue.LoginId;
      idstoDelete.locationTypeCode = "Customer";
      this.locationService.deleteCharacteristics(idstoDelete)
        .subscribe((result) => {
          if (result.statusCode == 200 && result.data) {
            this.toastrService.success("The records are deleted successfully.");
            this.getExistingMapping();
          } else {
            this.toastrService.error("The records could not be deleted. Please contact Tech Support.");
          }
        });
    }
  }

}
