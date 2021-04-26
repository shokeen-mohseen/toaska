import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { CustomerByLocationForecastMaterailAddModel } from '../../../../core/models/CustomerByLocation.model';
@Component({
  selector: 'app-add-map-forecast-material',
  templateUrl: './add-map-forecast-material.component.html',
  styleUrls: ['./add-map-forecast-material.component.css']
})
export class AddMapForecastMaterialComponent implements OnInit {

  modalRef: NgbModalRef;
  @Input() IdSelected: number;
  @Input() ExclusionList = [];

  materialList = [];
  selectedMaterial = [];
  settingsMaterial = {};
  clientId: number;
  constructor(private router: Router,
       private customerbylocationService: CustomerByLocationService,
        private toastrService: ToastrService,
        private authenticationService: AuthService
    , public activeModal: NgbActiveModal) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
  }


  ngOnInit(): void {

    this.getMaterialList();

    this.settingsMaterial = {
      singleSelection: false,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey:"name"
    };


  }

  getMaterialList() {
    var exclusionId = this.ExclusionList.map(x => x.materialId);
    this.customerbylocationService.GetMaterialList(0, 0, this.clientId)
      .subscribe(
        result => {
          if (!!result.data) {
            // remove material which are already associated with the IdSelected.
            if (exclusionId && exclusionId.length > 0) {
              this.materialList = result.data.filter(x => !exclusionId.includes(x.id));
            } else {
              this.materialList = result.data;
            }
           
          }
        }
      );
  }
  selectedMaterialIds: string = '';
  onMaterialSelect(item: any) {
     
    this.selectedMaterialIds += `${item.id},`;
  }

  isMaterialNotSelected() {
    return this.selectedMaterial.length == 0;
  }

  saveForecastMaterial() {
    if (this.selectedMaterialIds) {
      var objToSave = new CustomerByLocationForecastMaterailAddModel();
      objToSave.clientId = this.clientId;
      objToSave.locationId = this.IdSelected;
      objToSave.selectedMaterialIds = this.selectedMaterialIds;
      objToSave.updateDateTimeBrowser = new Date();
      objToSave.createDateTimeBrowser = new Date();
      objToSave.updatedBy = this.authenticationService.currentUserValue.LoginId;
      objToSave.createdBy = this.authenticationService.currentUserValue.LoginId;
      this.customerbylocationService.addCustomerLocationForecastMaterial(objToSave)
        .subscribe(result => {
          if (result.statusCode == 200 && result.data) {
            this.toastrService.success("Added successfully.");
          } else {
            this.toastrService.error("Adding Forecast Material failed. Please try again later.");
          }
          this.activeModal.close("success");
        });
    }
    else
    {
      this.toastrService.error("Select material to add.");
    }
   
  }

}
