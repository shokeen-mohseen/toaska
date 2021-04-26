import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { User, AuthService } from '@app/core';
import { projectkey } from 'environments/projectkey';
import { ActionGroupTab, ActionItem, ActionType } from '../../../core/models/action-group';
import { PartographSetupComponent } from '@app/modules/data-management/partograph-setup/partograph-setup.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from '@app/modules/auth/pages/change-password/change-password.component';
import { DataExportComponent } from '../data-export/data-export.component';
import { IssueComponent } from '../issue/issue.component';
import { TopButtonBarService } from './top-btn.serrvice';
import { FeedbackComponent } from '../feedback/feedback.component';

import html2canvas from 'html2canvas';
import { ShareScreenComponent } from '../share-screen/share-screen.component';
import { Router } from '@angular/router';
import { LoaderService } from '../spinner/loader.service';
import { SpinnerObject } from '../../../core/models/SpinnerObject.model';
import { MessageService } from '../../../core/services/message.service';
import { ForecastService } from '../../../core/services/forecast.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-top-btn-group',
  templateUrl: './top-btn-group.component.html',
  styleUrls: ['./top-btn-group.component.css']
})
export class TopBtnGroupComponent implements OnInit, AfterViewInit {
  @Input() actionGroupConfig: ActionGroupTab[];
  @Output() action: EventEmitter<string> = new EventEmitter();
  @Input() withTab: boolean = true;
  @Input() ParentPageName: string = '';
  
  private so: SpinnerObject = new SpinnerObject();
  IsTosca: boolean;
  modalRef: NgbModalRef;
  currentUser: User;
  LockTooltip: string;
  UnlockTooltip: string;
  PublishTooltip: string;
  userMessages: any = [];

  private actionItemsMap: { [type: string]: ActionItem } = {};
  constructor(
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    private forecastService: ForecastService,
    private topButtonBarService: TopButtonBarService,
    public modalService: NgbModal,
    private route: Router,
    private router: Router,
    private authenticationService: AuthService,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.getMessages();

    this.actionGroupConfig = JSON.parse(JSON.stringify(this.actionGroupConfig));
    this.actionGroupConfig.forEach(tab => {
      tab.actionGroups.forEach(group => {
        group.forEach(actionItem => {
          this.actionItemsMap[actionItem.type] = actionItem;
          if (actionItem.menu) {
            actionItem.menu.forEach(menuItem => {
              this.actionItemsMap[menuItem.type] = menuItem
            });
          }
        });
      });
    });

    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }

  }

  actionHandler(type: ActionType): void {
    this.action.emit(type);
    this.topButtonBarService.action(type);

    if (type === 'setupWizard') {
      this.modalRef = this.modalService.open(PartographSetupComponent, { size: 'lg', backdrop: 'static' });
    }
    else if (type === 'changePassword') {
      this.modalRef = this.modalService.open(ChangePasswordComponent, { size: 'md', backdrop: 'static' });
    }
    else if (type === 'export' ) {
      if (this.ParentPageName == "ForecastReviewExport") {        
        if (this.forecastService.forecastId == 0) {
          this.toastrService.warning(this.getMessage("SelectOneForecast"));
        }
        else {
          this.modalRef = this.modalService.open(DataExportComponent, { size: 'xl', backdrop: 'static' });
        }

      } else if (this.ParentPageName == "ForecastCompareExport") {
        if (this.forecastService.forecastCId == 0) {
          this.toastrService.warning(this.getMessage("SelectTwoForecast"));
        }
        else {
          this.modalRef = this.modalService.open(DataExportComponent, { size: 'xl', backdrop: 'static' });
        }

      }
      else {
        this.modalRef = this.modalService.open(DataExportComponent, { size: 'xl', backdrop: 'static' });
      }
      
      this.modalRef.componentInstance.DocumentSectionName = this.ParentPageName;
      
      let pageTitle = document.querySelectorAll('h5')[0].innerText;
      //document.getElementById('pageTittleText').innerHTML = pageTitle;
      this.modalRef.componentInstance.DocumentSectionTitle = pageTitle;
    }
    else if (type === 'operationalExport') {
      this.modalRef = this.modalService.open(DataExportComponent, { size: 'xl', backdrop: 'static' });
      if (this.ParentPageName == "OrderManagementExport") {
        this.modalRef.componentInstance.DocumentSectionTitle = "Order Operational Export"
        this.modalRef.componentInstance.DocumentSectionName = "OrderManagementOperationalExport";
      }
      else if (this.ParentPageName == "ShipmentExport") {
        this.modalRef.componentInstance.DocumentSectionTitle = "Shipment Operational Export"
        this.modalRef.componentInstance.DocumentSectionName = "ShipmentOperationalExport";
      }

      
    }
    else if (type === 'issue') {
      this.modalRef = this.modalService.open(IssueComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type === 'share') {
      this.so.status = true;
      this.so.source = "share"
      this.loaderService.mainSource = this.so.source;
      this.loaderService.isLoading.next(this.so);

      //html2canvas(document.body).then(function (canvas) {
      //  document.getElementById('screenShot').appendChild(canvas)
      //});

      //html2canvas(document.getElementById('takeScreenShot')).then(function (canvas) {
      //  document.querySelector('#screenShot').appendChild(canvas)
      //});

      this.modalRef = this.modalService.open(ShareScreenComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type === 'feedback') {
      this.modalRef = this.modalService.open(FeedbackComponent, { size: 'lg', backdrop: 'static' });

    }
    else if (type === 'alerts') {
      let url = '/alert-management/alert-history'
      this.route.navigate([url]);
    }
    else if (type === 'logout') {
      this.authenticationService.logout();
      this.currentUser = null;
      this.router.navigate(['/auth/tosca-login']);
    }
  }

  enableAction(type: ActionType): void {
    this.actionItemsMap[type].disabled = false;
  }

  disableAction(type: ActionType): void {
    this.actionItemsMap[type].disabled = true;
  }

  showAction(type: ActionType): void {
    this.actionItemsMap[type].hidden = false;
  }

  hideAction(type: ActionType): void {
    try{this.actionItemsMap[type].hidden = true;}catch(e){}
    
  }

  hideTab(lable: string): void {
    this.actionGroupConfig.find(tab => tab.label === lable).hidden = true;
  }

  showTab(lable: string): void {
    this.actionGroupConfig.find(tab => tab.label === lable).hidden = false;
  }

  activateAction(type: ActionType): void {
    this.actionItemsMap[type].active = true;
  }

  inactivateAction(type: ActionType): void {
    this.actionItemsMap[type].active = false;
  }


  ngAfterViewInit() {

    //Home buttons Hide Globally    
    this.hideAction('workBench');
    this.hideAction('back');
    this.hideAction('refresh');
    this.hideAction('cancel');
    this.hideAction('showDetails');
    this.hideAction('invoice');
    this.hideAction('duplicateForecast');
    this.hideAction('deleteSelectedRow');
    this.hideAction('deleteSelectedForecast');
    this.hideAction('regularOrder');
    this.hideAction('bulkOrder');
    this.hideAction('copy');
    this.hideAction('updateContract');
    this.hideAction('homeCancel');
    this.hideAction('save');
    this.hideAction('saveAndNotify');
    this.hideAction('addRow');
    this.hideAction('addForecast');

    //Data buttons Hide Globally
    this.hideAction('import');
    this.hideAction('filter');
    this.hideAction('void');
    this.hideAction('duplicateForecast');
    this.hideAction('importforecast');
    this.hideAction('importTransplaceTemplate');
    this.hideAction('exportTransplaceTemplate');
    this.hideAction('operationalExport');

    //Action buttons Hide Globally
    this.hideAction('approve');
    this.hideAction('declined');
    this.hideAction('accept');
    this.hideAction('lock');
    this.hideAction('unlock');
    this.hideAction('resetPassword');
    this.hideAction('edittype');
    this.hideAction('addnewtype');
    this.hideAction('calculate');
    this.hideAction('flex');
    this.hideAction('AdjustFinalForecast');
    this.hideAction('publish');
    this.hideAction('mapping');
    this.hideAction('orderCancel');
    this.hideAction('approveAndMas');
    this.hideAction('resendToMas');
    this.hideAction('shipWith');
    this.hideAction('recurrence');
    this.hideAction('tender');
    this.hideAction('ship');
    this.hideAction('tonu');
    this.hideAction('document');
    this.hideAction('chargeType');
    this.hideAction('ChargeCategory');
    this.hideAction('MapComputation');
    this.hideAction('receive');
    this.hideAction('compute');
    this.hideAction('associate');
    this.hideAction('updateForecast');
    this.hideAction('addNewRole');

    //View buttons Hide Globally
    this.hideAction('viewForecastAs');
    this.hideAction('graph');


    if (this.IsTosca) {
      this.hideAction('notification');
      this.hideAction('setupWizard');
      this.hideAction('language');
      this.hideAction('userName');
    }
    if (!this.IsTosca) {
      this.hideAction('issue');
      this.hideAction('alerts');
    }

  }

  getMessages() {
    this.messageService.getMessagesByModuleCode("CSFOR", parseInt(localStorage.clientId)).subscribe(
      result => {
        if (result.data) {
          this.userMessages = result.data;

          if (this.userMessages.length > 0) {
            this.LockTooltip = this.getMessage("LockToolTip");
            this.UnlockTooltip = this.getMessage("UnlockToolTip");
            this.PublishTooltip = this.getMessage("PublishToolTip");
          }
        }
      }
    );
  }
  getMessage(messageCode: string) {
    if (this.userMessages) {
      return this.userMessages.find(x => x.code == messageCode)?.message1;
    }
    return '';
  }
}
