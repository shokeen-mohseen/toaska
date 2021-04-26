import { Component, ViewChild, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { EditSpecialPrefrenceComponent } from './edit-special-prefrence/edit-special-prefrence.component';
import { PreferenceType, PreferenceTypeViewModel } from '../../../core/models/preferencetype.model';
import { PreferenceTypeCategory } from '../../../core/models/preferencetypecategory.model';
import { PreferenceListComponent } from './preference-list/preference-list.component';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SpecialPreferenceService } from '../services/specialpreference.service';
import { ConfirmDeleteTabledataPopupComponent } from '../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
@Component({
  selector: 'app-special-preference',
  templateUrl: './special-preference.component.html',
  styleUrls: ['./special-preference.component.css'],

})
export class SpecialPreferenceComponent implements OnInit, AfterViewInit {
  Permission: boolean = false;
  dataSource;
  PreferenceTypeSelected: PreferenceType[];
  @Output('SelectedPreferenceGridList') SelectedPreferenceGridList = new EventEmitter<PreferenceType[]>();
  PreferenceTypeCategory: PreferenceTypeCategory = new PreferenceTypeCategory();
  PreferenceType: PreferenceType = new PreferenceType();
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(PreferenceListComponent, { static: false }) PreferenceListComponent: PreferenceListComponent;

  actionGroupConfig;
  SpecialPreferenceList: string = 'SpecialPreferenceExport';
  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;

  modalRef: NgbModalRef;
  IsTosca: boolean;

  tabChange($event) {
    
  }

  actionHandler(type) {
    if (type === 'edit') {
      if (this.PreferenceTypeSelected == null || this.PreferenceTypeSelected.length < 1) {
        this.toastrService.warning("Please select Record to edit");
        return;
      } else if (this.PreferenceTypeSelected.length > 1) {
        this.toastrService.warning("Please select only one Record to edit");
        return;
      }
      else {
      
        this.tab1 = true;
        this.tab2 = true;
        this.tab2Data = true;
        this.modalRef = this.modalService.open(EditSpecialPrefrenceComponent, { size: 'md', backdrop: 'static' });
        this.modalRef.componentInstance.PreferenceType = this.PreferenceTypeSelected[0];
        this.modalRef.result.then((result) => {
      
          this.PreferenceListComponent.getAllPreferenceTypeRecord();
        }, (reason) => {
        });
        
      }
    }
    else if (type === "delete") {
      if (!!this.PreferenceTypeSelected && this.PreferenceTypeSelected.length > 0) {
        this.btn = 'btn3'
        this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
   
          this.PreferenceListComponent.deletePreferenceTypeList(this.PreferenceTypeSelected);
        }, (reason) => {
        });
      }
      else {
        this.toastrService.warning('Please Select At least One module');
        return;
      }
    }
  }

  constructor(private toastrService: ToastrService, private router: Router, public modalService: NgbModal, private authenticationService: AuthService, private specialPreferenceService: SpecialPreferenceService) { }
  btn: any
  tab1: boolean = true;
  tab2: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  ngOnInit(): void {
    this.buttonPermission();
    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: false,
      text: "Select",
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //disabled: true
    };
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {

  }
  OnItemDeSelect(item: any) {

  }
  onSelectAll(items: any) {
 
  }
  onDeSelectAll(items: any) {

  }
  ngAfterViewInit() {
    this.btnBar.hideAction('add');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
    this.btnBar.disableAction('delete');
  }
  buttonPermission() {
  
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authenticationService.currentUserValue.UserId;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          if (data[0].PermissionType == "Read and Modify") {
            this.btnBar.enableAction('add');
            // this.btnBar.enableAction('edit');
           // this.btnBar.enableAction('delete');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
            this.specialPreferenceService.Permission = true;
          }
          else {
            this.btnBar.disableAction('add');
            //this.btnBar.disableAction('edit');
          //  this.btnBar.disableAction('delete');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
            this.specialPreferenceService.Permission = false;
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }
  PreferenceTypeToSelect() {
    return this.PreferenceTypeSelected;
  }
  PreferenceTypeToEdit() {
    return this.PreferenceTypeSelected;
  }

  SelectedPreferenceType(PreferenceTypeToEdit: any) {
    this.PreferenceTypeSelected = PreferenceTypeToEdit;
  }
}
