import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OriginOfGoods } from '../../../../core/models/OriginOfGoods.model';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { OriginOfGoodsListComponent } from './origin-of-goods-list/origin-of-goods-list.component';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
@Component({
  selector: 'app-origin-of-goods',
  templateUrl: './origin-of-goods.component.html',
  styleUrls: ['./origin-of-goods.component.css']
})
export class OriginOfGoodsComponent implements OnInit, AfterViewInit {
  modalRef: NgbModalRef; 

  OriginOfGoodsSelected: OriginOfGoods[];

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @ViewChild(OriginOfGoodsListComponent, { static: false }) originOfGoodsListComponent: OriginOfGoodsListComponent;
  actionGroupConfig;
  constructor(
    private toastrService: ToastrService, private router: Router, private authenticationService: AuthService, public modalService: NgbModal,
  
  ) { }
  btn: any
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

    }
    else if (type === "edit") {
      debugger;
      if (this.OriginOfGoodsSelected == null || this.OriginOfGoodsSelected.length < 1) {
        this.toastrService.warning("Please select Record to edit");
        return;
      } else if (this.OriginOfGoodsSelected.length > 1)
      {
        this.toastrService.warning("Please select only one Record to edit");
        return;
      }
      else {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = true;
        this.tabGroup.selectedIndex = 1;
        this.tab3Data = true;
        this.tab2Data = false;
        this.tab1Data = false;
      }
    }
    else if (type === "delete") {
      debugger;
      if (!!this.OriginOfGoodsSelected && this.OriginOfGoodsSelected.length > 0) {
        this.btn = 'btn3'
        this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          debugger;
          this.originOfGoodsListComponent.deleteOriginOfGoodsList(this.OriginOfGoodsSelected);
        }, (reason) => {
        });
      }
      else {
        this.toastrService.warning('Please Select At least One module');
        return;
      }

    }
    else if (type === "export") {

      

    }
  }

  closeTab() {
    debugger;
    this.OriginOfGoodsSelected = null;
 
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
    //this.refresh();
  }

  IsTosca: boolean;

  refresh() {
    this.SelectedMaterial([]);
    this.originOfGoodsListComponent.getOriginOfGoodsList();
  }

  ngOnInit(): void {
    debugger;
    this.buttonPermission();
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }
  buttonPermission() {
    debugger;
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
  OriginOfGoodsToSelect() {
    return this.OriginOfGoodsSelected;
  }
  OriginOfGoodsToEdit() {
    return this.OriginOfGoodsSelected;
  }

  SelectedMaterial(OriginOfGoodsToEdit: any) {
    this.OriginOfGoodsSelected = OriginOfGoodsToEdit;
  }
  ngAfterViewInit() {
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

}
