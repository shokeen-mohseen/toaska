import { Component, OnInit, Input, OnChanges, EventEmitter, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddMapForecastMaterialComponent } from '../add-map-forecast-material/add-map-forecast-material.component';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { LocationForecastMaterialModel, LocationDeleteModel } from '../../../../core/models/Location';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
@Component({
  selector: 'app-map-forecast-material-panel',
  templateUrl: './map-forecast-material-panel.component.html',
  styleUrls: ['./map-forecast-material-panel.component.css']
})
export class MapForecastMaterialPanelComponent implements OnInit, OnChanges {
  modalRef: NgbModalRef;
  @Input("customerId") customerId: number;
  @Output("setCountOfForecastMaterial") setCountOfForecastMaterial = new EventEmitter<number>();;
  data: LocationForecastMaterialModel[] = [];

  constructor(public modalService: NgbModal,
      private customerbylocationService: CustomerByLocationService,
      private toastrService: ToastrService,
      private authenticationService: AuthService)
  {

  }
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.customerId
      && changes.customerId.currentValue) {
      this.getForecastMaterialData();
    }
   
  }

  getForecastMaterialData() {
    if (this.customerId) {
      this.customerbylocationService.getForecastMaterialByLocation(this.customerId)
        .subscribe((result) => {
          this.data = result.data;
          this.setCountOfForecastMaterial.emit(this.data.length);
        })
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAnyUnSelected() {
    return this.data.some(x => !x.isSelected);    
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAnyUnSelected() ?
      this.data.forEach(row => { row.isSelected = true; })
      :
      this.data.forEach(row => { row.isSelected = false; });
  }

  selectRow(item: LocationForecastMaterialModel) {

    this.data.forEach(x => {
      if (x.id == item.id) {
        x.isSelected = !x.isSelected;
        return;
      }
    })
  }

  isNoRecordSelected() {
    return this.data.every(x => !x.isSelected) ;
  }

  deleteLocationForcastMapping() {
    var selectedItems = this.data.filter(x => x.isSelected);
    if (!selectedItems || selectedItems.length == 0) {
      this.toastrService.warning("Please select items to delete.");
    }
    else
    {
      var idstoDelete = new LocationDeleteModel();
      idstoDelete.ids = selectedItems.map(x => x.id);
      idstoDelete.deletedBy = this.authenticationService.currentUserValue.LoginId;
      this.customerbylocationService.deleteForecastMaterialByLocation(idstoDelete)
        .subscribe((result) => {
          if (result.statusCode == 200 && result.data) {
            this.toastrService.success("Deleted successfully.");
            this.getForecastMaterialData();
          } else {
            this.toastrService.error("Deletion failed. Please try again later.");
          }
        });
    }
  }
  openMapforcast() {
    this.modalRef = this.modalService.open(AddMapForecastMaterialComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.IdSelected = this.customerId;
    this.modalRef.componentInstance.ExclusionList = this.data;
    this.modalRef.result.then((result) => {
      if (result === 'success') {
        this.getForecastMaterialData(); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }
}
