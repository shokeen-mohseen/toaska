import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { AddNewTypeComponent } from '../add-new-type/add-new-type.component';
import { Commodity, CommodityEitModel, CommodityNewModel } from '../../../../core/models/commodity.model';
import { CommodityListComponent } from '../commodity-list/commodity-list.component';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import { CommodityService } from '../../../../core/services/commodity.service';
@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.css']
})
export class CommodityComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  modalRef: NgbModalRef;  
  ItemList: CommodityNewModel[];
  DefaultCount: number = 0;
  @ViewChild(CommodityListComponent) commodityList: CommodityListComponent;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  IsTosca: boolean;
  constructor(private router: Router,
    private toastrService: ToastrService,
    public modalService: NgbModal,
    private authenticationService: AuthService,
    private commodityService: CommodityService) { }

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
       
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
    else if ($event.index === 2) {
      this.ItemList == null;      
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

    } else if (type === "edit") {
       
      if (this.ItemList == null || this.ItemList.length < 1) {
        this.toastrService.warning("Please select a commodity to edit");
        return;
      } else {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;
      }
    }
    else if (type === "addnewtype") {
      this.modalRef = this.modalService.open(AddNewTypeComponent, { size: 'lg', backdrop: 'static' });
    }
    else if (type === "delete") {
      this.commodityList.RemoveSelectedCommodity();
    }
  }

  closeTab() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    this.SelectedCommodities([]);
  }

  ngAfterViewInit() {
    this.btnBar.hideAction('active');
    this.btnBar.hideAction('inactive');
    this.btnBar.showAction('addnewtype');
    this.btnBar.hideTab('key_View');
  }
 
  commodityToEdit() {
    return this.ItemList;
  }

  async SelectedCommodities(dataSources: any) {
    this.ItemList = dataSources;
    this.DefaultCount = await this.commodityService.getMaxEditedRecordsCount();    
    this.ItemList = this.ItemList.slice(0, this.DefaultCount);
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
            this.btnBar.enableAction('add');
            this.btnBar.enableAction('edit');
            this.btnBar.enableAction('delete');
            this.btnBar.enableAction('addnewtype');
          }
          else {
            this.btnBar.disableAction('add');
            this.btnBar.disableAction('edit');
            this.btnBar.disableAction('delete');
            this.btnBar.disableAction('addnewtype');
          }
        }
      });

  }
}
