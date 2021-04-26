import { Component, OnInit, OnChanges, Input, EventEmitter, SimpleChanges, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddeditLocationCharacteristicsComponent } from '../addedit-location-characteristics/addedit-location-characteristics.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { LocationExistingCharacteristicsModel } from '../../../../core/models/CustomerByLocation.model';
import { DefaultLocationCharacteristicsModel, LocationPropertyDeleteModel } from '../../../../core/models/Location';
import { LocationService } from '../../../../core/services/location.service';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { projectkey } from '../../../../../environments/projectkey';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-operating-characteristics-panel',
  templateUrl: './operating-characteristics-panel.component.html',
  styleUrls: ['./operating-characteristics-panel.component.css']
})

export class OperatingCharacteristicsPanelComponent implements OnInit, OnChanges {

  constructor(private router: Router,public modalService: NgbModal,
    private locationService: LocationService,
    private toastrService: ToastrService,
    private authenticationService: AuthService
  ) { }
  modalRef: NgbModalRef;
  isEditRights: boolean;
  @Input("locationId") locationId: number;
  @Output("statOfCharacteristics") statOfCharacteristics = new EventEmitter<string>();

  existingCharacteristics: LocationExistingCharacteristicsModel[] = [];
  defaultCharacteristics: DefaultLocationCharacteristicsModel[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.locationId && changes.locationId.previousValue) {
      this.ModulePermission();
      this.getExistingMapping();
    }
  }

  ngOnInit(): void {
    console.log("locationId Charateristics");
    console.log(this.locationId);
    this.ModulePermission();
    this.getDefaultCharacteristics();
    this.getExistingMapping();
  }

  getExistingMapping() {

    debugger;

    this.locationService.getExistingCharacteristics({
      "LocationId": this.locationId,
      "ClientId": this.authenticationService.currentUserValue.ClientId
    }).subscribe((result) => {
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
    this.modalRef = this.modalService.open(AddeditLocationCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.locationId = this.locationId;
    this.modalRef.componentInstance.defaultCharacteristics = this.defaultCharacteristics;
    this.modalRef.componentInstance.existingCharacteristics = this.existingCharacteristics;
    this.modalRef.componentInstance.isEditRights = this.isEditRights;
    this.modalRef.result.then((data) => {
      this.getExistingMapping();
    });
    this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.getExistingMapping();
    });
  }

  getDefaultCharacteristics() {
    this.locationService.getDefaultCharacteristics({
      "EntityCode": "Location", "ClientId": this.authenticationService.currentUserValue.ClientId
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

    if (!this.isEditRights) {      
      this.toastrService.warning(GlobalConstants.Authentication_message);
      return;
    }

    var selectedItems = this.existingCharacteristics.filter(x => x.isSelected);
    if (!selectedItems || selectedItems.length == 0) {
      this.toastrService.warning(GlobalConstants.select_checkbox_messageon_grid);
    }
    else {
      var idstoDelete = new LocationPropertyDeleteModel();
      idstoDelete.locationId = this.locationId;
      idstoDelete.ids = selectedItems.map(x => x.id);
      idstoDelete.deletedBy = this.authenticationService.currentUserValue.LoginId;
      idstoDelete.locationTypeCode = "Location";

      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        this.locationService.deleteCharacteristics(idstoDelete)
          .subscribe((result) => {

            if (result.statusCode == 200 && result.data) {
              this.toastrService.success(GlobalConstants.Characteristics_delete_Record_message);
              this.getExistingMapping();
            } else {
              this.toastrService.error(GlobalConstants.error_message);
            }

          //  if (result.message == "Success" || result.Message == "Success") {
          //  this.getCommodity();
          //  this.toastrService.success("Record(s) Deleted successfully.");
          //}
          //else {
          //  this.toastrService.warning("Something went wrong.");
          //}
        }, error => {
              this.toastrService.error(GlobalConstants.error_message);
        });
      }, (reason) => {
      });


      //this.locationService.deleteCharacteristics(idstoDelete)
      //  .subscribe((result) => {
      //    if (result.statusCode == 200 && result.data) {
      //      this.toastrService.success("Deleted successfully.");
      //      this.getExistingMapping();
      //    } else {
      //      this.toastrService.error("Deletion failed. Please try again later.");
      //    }
      //  });
    }
  }

  ModulePermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;

    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;

          if (data != null) {
            if (data != undefined) {
              if (data.length > 0) {

                if (data[0].PermissionType == "Read and Modify") {
                  this.isEditRights = true;
                }
                else {
                  this.isEditRights = false;

                }

              }
              else {
                this.isEditRights = false;
              }
            }
            else {
              this.isEditRights = false;

            }
          }
          else {
            this.isEditRights = false;

          }
        }
      });

  }
}
