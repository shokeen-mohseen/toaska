import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { AddEditMapPreferredMaterialsComponent } from '../add-edit-map-preferred-materials/add-edit-map-preferred-materials.component';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { CommonCallListViewModel, LocationConstant, MaterialCallListViewModel } from '../../../../core/models/Location';
import { AuthService } from '../../../../core';
import { ButtonActionType } from '../../../../core/constants/constants';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-map-preferred-materials',
  templateUrl: './map-preferred-materials.component.html',
  styleUrls: ['./map-preferred-materials.component.css']
})
export class MapPreferredMaterialsComponent implements OnInit {

  modalRef: NgbModalRef;
  clientId: number;
  preferredMaterialList: any;
  isMaterialSelected: boolean;
  isMaterialAllSelected: boolean = false;
  @Input() InputlocationId;
  @Input() ScreenAction;
  @Output() listMaterialLength: EventEmitter<any> = new EventEmitter<any>();
  materialIds: string;
  buttonEnableDisable: boolean = true; editbuttonEnableDisable: boolean = true;
  commonCallListViewModel: MaterialCallListViewModel = new MaterialCallListViewModel();
  constructor(private router: Router, private toastrService: ToastrService,private customerbylocationService: CustomerByLocationService,
    public modalService: NgbModal,private authenticationService: AuthService) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    
    
  }

  ngOnInit(): void {
    
    
  }

  ngAfterViewInit(): void {    
    this.commonCallListViewModel.ClientID = this.clientId;
    this.commonCallListViewModel.LocationId = this.InputlocationId;
    this.commonCallListViewModel.PageAction = LocationConstant.PageAction;
    this.BindPreferredMaterialList();
  }
  btn: any
  btn1: any
  btn2: any
  btn3: any
  btn4: any
  openeditEquipment(action) {
    
    
    if (action === ButtonActionType.AddPreferredMaterial) {
      this.modalRef = this.modalService.open(AddEditMapPreferredMaterialsComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.PreferredMaterialList = this.preferredMaterialList;
      this.modalRef.componentInstance.InputlocationId = this.InputlocationId;
      this.modalRef.componentInstance.ScreenAction = this.ScreenAction;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.BindPreferredMaterialList();
        this.buttonEnableDisable = true;
        this.editbuttonEnableDisable = true;
      });
      this.btn = 'btn1'
    }
    else if (action === ButtonActionType.EditPreferredMaterial) {
      if (!!!this.materialIds) {
        this.toastrService.warning('Please Select At least One Record');
        return;
      } else if (!!this.materialIds) {
        const splitContactIds = this.materialIds.split(',');
        if (splitContactIds.length > 1) {
          this.toastrService.warning('Please Select only one Record for edit');
          return;
        }
      }

      this.modalRef = this.modalService.open(AddEditMapPreferredMaterialsComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.pageActionType = LocationConstant.PageAction;
      this.modalRef.componentInstance.InputlocationId = this.InputlocationId;
      this.modalRef.componentInstance.ScreenAction = this.ScreenAction;
      this.modalRef.componentInstance.materialIds = this.materialIds;
      this.modalRef.componentInstance.isEdit = true;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.BindPreferredMaterialList();
        this.buttonEnableDisable = true;
        this.editbuttonEnableDisable = true;
      });
      this.btn = 'btn2'
    }

    else if (action === ButtonActionType.deletePreferredMaterial) {
      //this.btn = 'btn12'
      //this.btn = 'btn4'
      if (!!!this.materialIds) {
        this.toastrService.warning('Please Select At least One Record');
        return;
      }
      if (confirm("Are you sure to delete?")) {
        this.commonCallListViewModel.DeletedBy = this.authenticationService.currentUserValue.LoginId;
        this.commonCallListViewModel.MaterialIds = this.materialIds;
        this.customerbylocationService.deletePreferredMaterialListByIds(this.commonCallListViewModel).subscribe(x => {
          this.BindPreferredMaterialList();
          this.toastrService.success('Preferred material deleted successfully');
          this.buttonEnableDisable = true;
          this.editbuttonEnableDisable = true;
          //this.buttonEnableDisable = true;
        });

        //this.customerbylocationService.deleteUserContactListByIds(this.idsContactDeleted, this.authenticationService.currentUserValue.LoginId).subscribe(x => {
        //  this.getLocationContact();
        //  this.toastrService.success('User Contact deleted successfully');
        //});
      }
    }
    
  }

  BindPreferredMaterialList() {
    
    this.commonCallListViewModel.LocationId = this.InputlocationId;
    this.customerbylocationService.GetPreferredMaterialList(this.commonCallListViewModel)
      .subscribe(
        result => {
          this.preferredMaterialList = result.data          
          this.listMaterialLength.emit(this.preferredMaterialList.length);
        }
    );


    
    
  }
  selectMaterialCheckbox(value: any) {
    this.buttonEnableDisable = true;
    this.preferredMaterialList.forEach(row => {
      if (row.id == value.id)
        row.isSelected = !value.isSelected;
    });

    this.isMaterialSelected = (this.preferredMaterialList.length === (this.preferredMaterialList.filter(x => x.isMaterialSelected == true).length));

    this.setMaterialCheckBoxData();
  }

  idsMaterialDeleted: string = '';
  setMaterialCheckBoxData() {
    let iDs: string = '';
    let i = 0;
    this.materialIds = '';
    this.idsMaterialDeleted = '';
    this.preferredMaterialList.filter(x => {
      if (x.isSelected == true) {
        
        iDs += `${x.id},`;
        this.idsMaterialDeleted += `${x.id},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsMaterialDeleted = this.idsMaterialDeleted.substring(0, this.idsMaterialDeleted.length - 1);
      this.buttonEnableDisable = false;
      this.editbuttonEnableDisable = false;;
      this.materialIds = iDs;
      if (i > 1) {
        this.editbuttonEnableDisable = true;
      }
    }
    else {
      this.buttonEnableDisable = true;
      this.editbuttonEnableDisable = true;
    }
  }

  selectMaterialAll(check: any) {    
    this.isMaterialAllSelected = check.checked;
    this.preferredMaterialList.forEach(row => {
      row.isSelected = this.isMaterialAllSelected;
    });
    this.setMaterialCheckBoxData();
  }
}
