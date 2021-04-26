import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { IssueComponent } from '../../../../shared/components/issue/issue.component';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { AuthService } from '../../../../core';
import { MaterialCommodityMap } from '../../../../core/models/material.model';
import { MaterialListComponent } from '../material-list/material-list.component';
import { ToastrService } from 'ngx-toastr';
import { MaterialService } from '../../../../core/services/material.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  modalRef: NgbModalRef;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  IsTosca: boolean;

  materialsSelected: MaterialCommodityMap[];
  DefaultCount: number = 0;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild(MaterialListComponent, { static: false }) materialListComponent: MaterialListComponent;

  
  constructor(private router: Router,
    public modalService: NgbModal,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
    private materialService: MaterialService) { }

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

  tabChange($event) {
    if ($event.index === 0) {
      //this.materialsSelected == null;
      this.tab1Data = true;
      this.materialListComponent.setRowSelection();
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
    else if ($event.index === 2) {
      this.tab3Data = true;
    }
  }
  ngAfterViewInit(): void {
    this.btnBar.disableAction('add');
    this.btnBar.hideTab('key_View');
  }

  actionHandler(type) {
    if (type === "add") {
      this.tab1 = true;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 1;
      this.tab2Data = true;
      this.tab1Data = false;
      this.tab3Data = false;
    }
    else if (type === "edit") {
      if (this.materialsSelected == null || this.materialsSelected.length < 1) {
        this.toastrService.warning("Please select a material to edit");
        return;
      }
      else {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 2;
        this.tab3Data = true;
        this.tab1Data = false;
        this.tab2Data = true;
      }

    }
    else if (type === "active") {
       
      this.setSelectedMaterialsStatus(true);
    } else if (type === "inactive") {
       
      this.setSelectedMaterialsStatus(false);
      //this.materialListComponent.
    }
    else {     
      this.materialListComponent.RemoveSelectedMaterial();
    }
  }
  closeTab(action) {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.selectedMaterials([]);
    this.refresh();
  }
  openissue() {
    this.modalRef = this.modalService.open(IssueComponent, { size: 'xl', backdrop: 'static' });
  }

  setSelectedMaterialsStatus(isActive: boolean) {
     
    if (this.materialsSelected != null && this.materialsSelected.length > 0) {
      this.materialsSelected.forEach(x => {       
        x.isActive = isActive;
        x.updatedBy = this.authenticationService.currentUserValue.LoginId;
        x.createDateTimeBrowser = new Date();
        x.updateDateTimeBrowser = new Date();
      });
      this.materialService.editSaveMaterialCommodity(this.materialsSelected).subscribe(result => {
        if (result.statusCode == 200) {
          this.toastrService.success((isActive ? 'Activation' : 'Inactivation') + " successful.")
          this.refresh();
        } else {
          this.toastrService.error((isActive ? 'Activation' : 'Inactivation') + " failed. Please try again later.");
          this.refresh();
        }
      }
      );
    } else {
      this.toastrService.warning("Please select materials for " + (isActive ? 'activation.' : 'inactivation.'));
    }

  }

  materialsToSelect() {
    return this.materialsSelected;
  }

  materialsToEdit() {
    return this.materialsSelected;
  }

 selectedMaterials(materialsToEdit: any) {
    this.materialsSelected = materialsToEdit;
   // this.DefaultCount = await this.materialService.getMaxEditedRecordsCount();
   //this.materialsSelected = this.materialsSelected.slice(0, this.DefaultCount);
  }


  refresh() {
    //this.selectedMaterials([]);
    this.materialListComponent.getMaterialCommodityList();
  }

  buttonPermission() {
     
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
            //this.btnBar.enableAction('add');
            this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');

          }
          else {
            //this.btnBar.disableAction('add');
            this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');


          }
        }
      });

  }
}
