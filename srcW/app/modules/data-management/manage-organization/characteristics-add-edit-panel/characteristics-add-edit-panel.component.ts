import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddeditCharacteristicsComponent } from '../addedit-characteristics/addedit-characteristics.component';
import { OrganizationService } from '../../../../core/services/organization.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { OrganizationExistingCharacteristicsModel, DefaultOrganiationCharacteristicsModel } from '../../../../core/models/organization';

@Component({
  selector: 'app-characteristics-add-edit-panel',
  templateUrl: './characteristics-add-edit-panel.component.html',
  styleUrls: ['./characteristics-add-edit-panel.component.css']
})
export class CharacteristicsAddEditPanelComponent implements OnInit {

  @Input() organizationId: number;
  characteristicsList;
  @Output("statOfCharacteristics") statOfCharacteristics = new EventEmitter<string>();
  selectedItem;
  private selectedCheckbox;
  existingCharacteristics: OrganizationExistingCharacteristicsModel[] = [];
  defaultCharacteristics: DefaultOrganiationCharacteristicsModel[] = [];
  
  constructor(public router: Router, public modalService: NgbModal,
    private organizationService: OrganizationService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.organizationService.getCharacteristicsList(this.organizationId).subscribe(res => {
      this.characteristicsList = res.data;
    })
  }

  select(evt, item) {
    if (this.selectedCheckbox && this.selectedCheckbox !== evt.target) {
      this.selectedCheckbox.checked = false;
    }
    if (evt.target.checked) {
      this.selectedItem = item;
      this.selectedCheckbox = evt.target;
    } else {
      this.selectedItem = null;
      this.selectedCheckbox = null;
    }
  }

  deleteSelectedItem() {
    this.organizationService.deleteCharacteristics({ OrganizationId: this.organizationId, EntityPropertyId: this.selectedItem.entityPropertyId })
      .subscribe(
        result => {
          console.log(result.data);
          this.organizationService.getCharacteristicsList(this.organizationId).subscribe(res => {
            this.characteristicsList = res.data;
          })
        })
    this.toastr.success('Characteristics has been delete successfully');
  }
  emitStatOfCharacteristics() {
    this.statOfCharacteristics.emit(this.existingCharacteristics.length + "/" + this.defaultCharacteristics.length)
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
          PropertyValue: item.value
        }
      });
      this.organizationService.saveCharacteristics(saveReqBody).subscribe(
        result => {
          console.log(result.data);
          this.organizationService.getCharacteristicsList(this.organizationId).subscribe(res => {
            this.characteristicsList = res.data;
          })
        }
          
      )
      this.toastr.success('Characteristics has been save successfully');

    })
  }
}

  

