import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddeditCharacteristicsComponent } from '../addedit-characteristics/addedit-characteristics.component';
import { OrganizationService } from '../../../../core/services/organization.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../core';
import { OrganizationExistingCharacteristicsModel, DefaultOrganiationCharacteristicsModel } from '../../../../core/models/organization';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

@Component({
  selector: 'app-characteristics-add-edit-panel',
  templateUrl: './characteristics-add-edit-panel.component.html',
  styleUrls: ['./characteristics-add-edit-panel.component.css']
})
export class CharacteristicsAddEditPanelComponent implements OnChanges  {

  @Input() organizationId: number;
  characteristicsList: OrganizationExistingCharacteristicsModel[];
  currentUser: User;
  clientId: number = 0;
  sourceSystemId: number = 0;
  updatedBy: string;
  inActive: boolean;
  updateDateTimeBrowser: Date;
  @Output("statOfCharacteristics") statOfCharacteristics = new EventEmitter<string>();
  defaultCharacteristics: DefaultOrganiationCharacteristicsModel[] = [];
  modalRef: NgbModalRef;
  constructor(public router: Router, public modalService: NgbModal,
    private organizationService: OrganizationService, private authenticationService: AuthService,
    private toastr: ToastrService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.clientId = this.currentUser.ClientId;
    this.sourceSystemId = this.currentUser.SourceSystemID;
    this.updatedBy = this.currentUser.LoginId;
  }

  ngOnChanges(): void {
    this.inActive = this.organizationService.permission ? false : true;
    this.getCharacteristicsList();
    this.getDefaultCharacteristics();
  }
  isAllSelected() {
    return this.characteristicsList.every(x => x.isSelected);
  }
  selectAll() {
    this.characteristicsList.forEach(x => {
      x.isSelected = !x.isSelected;
    });
  }
  select(item: DefaultOrganiationCharacteristicsModel) {
    this.characteristicsList.forEach(x => {
      if (x.id === item.id) {
        x.isSelected = !x.isSelected;
        return;
      }
    })
  }
  isItemSelected() {
    return this.characteristicsList && this.characteristicsList.some(x => x.isSelected);
  }
  getDefaultCharacteristics() {
    this.organizationService.getCharacteristicsListDescription(this.organizationId).subscribe(res => {
      if (res && res.data)
        this.defaultCharacteristics = res.data;
      this.emitStatOfCharacteristics();
    });
  }
  getCharacteristicsList() {
    this.organizationService.getCharacteristicsList(this.organizationId).subscribe(res => {
      this.characteristicsList = res.data.filter(item => item.propertyValue);
      this.emitStatOfCharacteristics();
    });
  }

  deleteSelectedItem() {
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.characteristicsList.forEach(x => {
        if (x.isSelected) {
          this.organizationService
            .deleteCharacteristics({
              OrganizationId: this.organizationId, ID: x.id,
              upatedBy: this.updatedBy, EntityPropertyId: x.entityPropertyID
            }).subscribe(
              result => {
                console.log(result.data);

                this.organizationService.getCharacteristicsList(this.organizationId).subscribe(res => {

                  this.characteristicsList = res.data.filter(item => item.propertyValue);
                  this.emitStatOfCharacteristics();
                })

                this.toastr.success('Characteristics has been deleted successfully.');
              })
        }
      });
    })
  }

  emitStatOfCharacteristics() {
    this.statOfCharacteristics.emit(this.characteristicsList.length + "/" + this.defaultCharacteristics.length)
  }
  
  openCharacteristics() {
    const modalRef = this.modalService.open(AddeditCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.organizationId = this.organizationId;
    modalRef.componentInstance.characteristicsList = this.characteristicsList;
    modalRef.result.then(res => {
      const saveReqBody = res.map(item => {
        return {
          OrganizationId: this.organizationId,
          EntityPropertyId: item.entityPropertyID,
          PropertyValue: item.value,
          ClientId: this.clientId,
          IsDeleted: false,
          SourceSystemID: this.sourceSystemId,
          updatedBy: this.updatedBy,
          updateDateTimeBrowser: new Date(),
          createdBy: item.updatedBy
        }
      });
      this.organizationService.saveCharacteristics(saveReqBody).subscribe(
        result => {
          console.log(result.data);
          this.organizationService.getCharacteristicsList(this.organizationId).subscribe(res => {
            this.characteristicsList = res.data.filter(item => item.propertyValue);
            this.statOfCharacteristics.emit(this.characteristicsList.length + '/' + res.data.length);
          })
        }
          
      )
      this.toastr.success('Characteristics has been saved successfully.');

    })
  }
}

  

