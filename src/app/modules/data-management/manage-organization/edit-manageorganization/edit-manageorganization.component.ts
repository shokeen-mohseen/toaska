import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { AddeditCharacteristicsComponent } from '../addedit-characteristics/addedit-characteristics.component';
import { Organization } from '../../../../core/models/organization';
import { OrganizationService } from '../../../../core/services/organization.service';
import { ManageOrganizationStateService } from '../manage-organization-state.service';
@Component({
  selector: 'app-edit-manageorganization',
  templateUrl: './edit-manageorganization.component.html',
  styleUrls: ['./edit-manageorganization.component.css']
})
export class EditManageorganizationComponent implements OnInit {
  listaddresstLen: number;
  @Output('selectedOrgnizations') selectedOrgnizations = new EventEmitter<Organization[]>();
  organizationCategoryList = [];
  organizationCategorySelected = [];
  statOfCharacteristics: string = "0/0";
  organizationTypeList = [];
  organizationTypeSelected = [];
  organizationDefaultComputationMethodList = [];
  modalRef: NgbModalRef;
  selectedOrganizationToEdit: Organization = null;
  organizationsToEdit: Organization[];
  contactCount = 0;

  constructor(public router: Router, public modalService: NgbModal,
    private organizationService: OrganizationService, private manageOrgState: ManageOrganizationStateService) {
    this.listaddresstLen = 0;
  }

  controlType: string;
  itemListA = [];
  itemListB = [];
  inActive: boolean;
  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};

  count = 3;

  ngOnInit(): void {
    this.inActive = this.organizationService.permission ? false : true;
    this.organizationsToEdit = this.manageOrgState.seletedOrganizations;
    if (this.organizationsToEdit && this.organizationsToEdit[0]) {
      if (this.organizationsToEdit.length > 20) {
        this.organizationsToEdit = this.organizationsToEdit.slice(0, 20);
      }
      this.selectedOrganization(this.organizationsToEdit[0]);
    }


    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

  }

  async setOrganizationToEdit() {
    var defaultCount = await this.organizationService.getMaxEditedRecordsCount();
    this.organizationsToEdit = this.organizationsToEdit.slice(0, defaultCount);
    this.selectedOrgnizations.emit(this.organizationsToEdit);
  }

  GetCountAddress(event): number {
    this.listaddresstLen = event;
    return this.listaddresstLen
  }

  selectNext() {
    let nextIndex = this.organizationsToEdit.map(function (x) { return x.id; }).indexOf(this.selectedOrganizationToEdit.id);
    if (nextIndex == this.organizationsToEdit.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedOrganization(this.organizationsToEdit[nextIndex]);
  }

  selectedOrganization(selectedOrganizationToEdit: Organization) {
    this.selectedOrganizationToEdit = { ...selectedOrganizationToEdit };
  }

  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  openCharacteristics() {
    this.modalRef = this.modalService.open(AddeditCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
  }
  removeOrganizationFromEditList(organizationToRemove: Organization) {
    this.organizationsToEdit.splice(this.organizationsToEdit.findIndex(item => item.id === organizationToRemove.id), 1)
    this.selectedOrgnizations.emit(this.organizationsToEdit);
  }

  setContactCount(value: number) {
    this.contactCount = value;
  }
  setStatOfCharacteristics(stat: string) {
    this.statOfCharacteristics = stat;
  }

}
