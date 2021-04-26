import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { ToastrService } from 'ngx-toastr';
import { EquipmentViewModel } from '../../../core/models/Equipment';
import { AuthService } from '../../../core';
import { EquipmentService } from '../../../core/services/equipment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment-type',
  templateUrl: './equipment-type.component.html',
  styleUrls: ['./equipment-type.component.css']
})
export class EquipmentTypeComponent implements OnInit, AfterViewInit {
  addPage: boolean = false;
  editPage: boolean = false;
  equipmentTypesSelected: EquipmentViewModel[];
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  equipmentViewModel: EquipmentViewModel = new EquipmentViewModel();
  actionGroupConfig;

  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
    else if ($event.index === 2) {
      this.tab3Data = true;
    }
  }

  actionHandler(type) {
    if (type === "add") {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = false;
      this.tab3Data = false;
      this.tab2Data = true;
      this.addPage = true;
      this.editPage = false;

    } else if (type === "edit") {
      if (this.equipmentTypesSelected == null || this.equipmentTypesSelected.length < 1) {
        this.toastrService.warning("Please select a equipmentType to edit");
        return;
      }
      this.selectedIdsfromList
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 1;
      this.tab3Data = true;
      this.tab2Data = false;
      this.tab1Data = false;
      this.addPage = false;
      this.editPage = true;

    } else if (type === "delete") {    
      if (this.selectedIdsfromList == null || this.selectedIdsfromList == "") {
        this.toastrService.warning("Please select a record to edit.");
        return;
      }
      if (confirm("Are you sure to delete?")) {
        this.equipmentViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.equipmentViewModel.selectedIds = this.selectedIdsfromList;
        this.equipmentService.deleteEquipmentById(this.equipmentViewModel).subscribe(x => {
          ///this.getFuelPriceList();
          this.toastrService.success('Record(s) deleted successfully');
          //this.buttonEnableDisable = true;
        });
      }

    } else if (type === "export") {
    }
  }

  closeTab() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.selectedEquipmentTypes([]);
  }

  modalRef: NgbModalRef;
  IsTosca: boolean;
  constructor(private router: Router,
    public modalService: NgbModal,
    private toastrService: ToastrService,
    private equipmentService: EquipmentService,
    private authenticationService: AuthService
  ) { }

  ngOnInit(): void {
    this.buttonPermission();
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }

  ngAfterViewInit() {
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }
  selectedIdsfromList: string;
  getSelectedIds(value: any) {
    this.selectedIdsfromList = value;    
  }

  equipmentsInEdit(){
    return this.equipmentTypesSelected;
  }
  equipmentTypesToEdit() {
    return this.equipmentTypesSelected;
  }

  selectedEquipmentTypes(equipmentTypesToEdit: any) {
    this.equipmentTypesSelected = equipmentTypesToEdit;
  }

  buttonPermission() {
    debugger
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all
          if (!data || data[0].PermissionType == "Read and Modify") {
            this.btnBar.enableAction('add');
            this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');
          }
          else {
            this.btnBar.disableAction('add');
            this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
          }
        }
      });

  }
}
