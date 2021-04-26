import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreferenceType } from '../../../../core/models/preferencetype.model';
import { PreferenceTypeCategory } from '../../../../core/models/preferencetypecategory.model';
import { SpecialPreferenceService } from '../../services/specialpreference.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { PreferenceListComponent } from '../preference-list/preference-list.component';
import { FormGroup } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-special-prefrence',
  templateUrl: './edit-special-prefrence.component.html',
  styleUrls: ['./edit-special-prefrence.component.css']
})
export class EditSpecialPrefrenceComponent implements OnInit {
  Inactive: boolean = false;
  PreferenceType: PreferenceType;
  @ViewChild(PreferenceListComponent, { static: false }) PreferenceListComponent: PreferenceListComponent;
  @Input() PreferenceTypeSelected: PreferenceType[];
  preferenceType: PreferenceType = new PreferenceType();

  itemListA = [];
  selectedItemsA = [];
  countA = 6;
  txtUserPreference: any;
  txtUserPreferenceId: number;
  itemListB = [];
  selectedItemsB = [];
  settingsB = {};
  countB = 6;
  ddlTrue: boolean;
  txtTrue: boolean;
  selectedPreferenceTypeToEdit: PreferenceType;
  ddSettings = {
    singleSelection: true,
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    addNewItemOnFilter: true,
    labelKey: "name"
  };
  

  

  constructor(private toastrService: ToastrService,
    private authenticationService: AuthService,
    private specialPreferenceService: SpecialPreferenceService,
    public activeModal: NgbActiveModal
  ) {
   
  }
  
  ngOnInit(): void {
    this.Inactive = this.specialPreferenceService.Permission == false ? true : false;
    
    if (this.PreferenceType.webControlTypeID) {

      this.ddSettings.singleSelection = this.PreferenceType.webControlTypeID !== 12;

      let service: Observable<any>, clientId = this.authenticationService.currentUserValue.ClientId;

      if (this.PreferenceType.code === 'DefaultCarrier') {
        service = this.specialPreferenceService.getCarrierList(clientId);
      } else if (this.PreferenceType.code === 'DefaultEquipmentType') {
        service = this.specialPreferenceService.getEquipmentTypeList(clientId);
      } else if (this.PreferenceType.code === 'DefaultPallet') {
        service = this.specialPreferenceService.getMaterialList(0, 1, clientId);
      } else if (this.PreferenceType.code === 'CPUCarrier') {
        service = this.specialPreferenceService.getCarrierList(clientId);
      } else if (this.PreferenceType.code === 'DefaultShipToLocationForCollectionOrder') {
        service = this.specialPreferenceService.getOperatingLocation(clientId)
      }
      
      service.subscribe(res => {
        this.itemListA = res.data;
        const ids = this.PreferenceType.userPreferenceModifiedValueIDs.split(',').map(id => parseInt(id, 10));
        this.selectedItemsA = this.itemListA.filter(item => ids.includes(item.id));
        if (res.data.length && res.data[0]['locationDescription']) {
          this.ddSettings = { ...this.ddSettings, labelKey: 'locationDescription' };
        }
      })
    }
    

    this.selectedPreferenceType(this.PreferenceType);
    this.bindUserPreferenceValue();
  }

  

  bindUserPreferenceValue() {
   
    if (this.PreferenceType.userPreferenceModifiedValue == "Yes") {
      this.txtUserPreferenceId = this.PreferenceType.id;
      this.selectedItemsA[0] = this.itemListA.find(x => x.id == 1);
      this.ddlTrue= true;
      this.txtTrue= false;
    }
    else if (this.PreferenceType.userPreferenceModifiedValue == "No")
    {
      this.txtUserPreferenceId = this.PreferenceType.id;
      this.selectedItemsA[0] = this.itemListA.find(x => x.id == 2);
      this.ddlTrue = true;
      this.txtTrue = false;
    }
    else {
      this.txtUserPreference = this.PreferenceType.userPreferenceModifiedValue;
      this.txtUserPreferenceId = this.PreferenceType.id;
      this.ddlTrue = false;
      this.txtTrue = true;
    }
  }
  selectedPreferenceType(selectedPreferenceTypeToEdit: PreferenceType) {
    this.selectedPreferenceTypeToEdit = Object.assign({}, selectedPreferenceTypeToEdit);
  }
  onAddItem(data: string) {
    this.countA++;
    this.itemListA.push({ "id": this.countA, "itemName": data });
    this.selectedItemsA.push({ "id": this.countA, "itemName": data });
    this.itemListB.push({ "id": this.countB, "itemName": data });
    this.selectedItemsB.push({ "id": this.countB, "itemName": data });
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
  Update(form: NgForm) {
    if (this.txtUserPreference != null || this.txtUserPreference === null) {
      this.selectedPreferenceTypeToEdit.Id = this.PreferenceType.id;
      if (this.selectedPreferenceTypeToEdit.webControlTypeID) {
        this.selectedPreferenceTypeToEdit.ModifiedValue = this.selectedItemsA.map(item => item.id).join(',');
      } else {
        this.selectedPreferenceTypeToEdit.ModifiedValue = this.txtUserPreference;
      }

    }
    this.selectedPreferenceTypeToEdit.UpdatedBy = this.authenticationService.currentUserValue.LoginId;
    this.selectedPreferenceTypeToEdit.UpdateDateTimeBrowser = new Date();
    this.specialPreferenceService.updatePreferenceType(this.selectedPreferenceTypeToEdit).subscribe(result => {
        if (result.statusCode == 200) {
         
          this.toastrService.success("The record is saved successfully.");
          this.activeModal.close(form);
          this.PreferenceListComponent.getAllPreferenceTypeRecord();
          form.resetForm();

        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support.");

        }
      }
      );
      return true;
  }

  }


