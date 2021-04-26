import { Component, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import { modelCommon, Feedback } from '../../../core/models/Feedback.model';
import { AuthService } from '../../../core';
import { FeedbackService } from '../../../core/services/feedback.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  modalRef: NgbModalRef;
  feedback = new Feedback();
  model = new modelCommon();
  userName: string = '';
  loginID: string = '';
  currentDateTime: Date;
  ModuleList = [];
  selectedModule = [];
  maxChars = 2000;
  description = '';
  chars = 0;
  settingsA = {};
  enableSubmit = false;
  //atleastOneAlpha=[];

  constructor(private router: Router,
    private toastrService: ToastrService,
    public activeModal: NgbActiveModal,
    private authservices: AuthService,
    private feedbackservice: FeedbackService) { }

  ngOnInit(): void {
    this.loginID = this.authservices.currentUserValue.LoginId;
    this.currentDateTime = new Date();
    this.getUserName();
    bsCustomFileInput.init();
    this.ApplicationModule();
    this.DDSetting();
  }
  onAddItemA(data: string) {
  }
  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }

  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

  DDSetting() {
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName']
    };
  }
  onKeyUp(event: any) {
    this.enableSubmit = /^\S.*$/.test(this.feedback.description);
  }
  ApplicationModule() {
    this.model.clientId = this.authservices.currentUserValue.ClientId;
    this.feedbackservice.GetModuleList(this.model)
      .subscribe(apm => {
        this.ModuleList = apm;
      });
  }

  getUserName() {
    var id = this.authservices.currentUserValue.UserId.toString();
    this.feedbackservice.getUserDetailById(id).subscribe(result => {
      if (result.Data != null || result.Data != undefined) {
        this.userName = result.Data.FirstName + ' ' + result.Data.LastName;
      }
    });
  }

  setData() {    
    //this.atleastOneAlpha = this.feedback.description.match(".*[a-zA-Z]+.*");
    //if (this.atleastOneAlpha === null) {
    //  this.toastrService.warning("Please type a message to continue.");
    //}    
      this.feedback.applicationModuleId = this.selectedModule.map(function (x) { return x.id; })[0];
      this.feedback.clientId = this.authservices.currentUserValue.ClientId;
      this.feedback.userId = this.authservices.currentUserValue.UserId;
      this.feedback.isDeleted = false;
      this.feedback.sourceSystemId = this.authservices.currentUserValue.SourceSystemID;
      this.feedback.createdBy = this.authservices.currentUserValue.LoginId;
      this.feedback.createDateTimeBrowser = new Date();
      this.feedback.createDateTimeServer = new Date();
  }

  valueChange() {
    this.description = this.feedback.description;
  }

  saveFeedback() {
    this.setData();
    this.feedbackservice.saveFeedback(this.feedback).subscribe(x => {
      this.feedback.description = "";
      this.selectedModule = [];
      this.description = '';
      if (x.data===1) {
        this.toastrService.success("Feedback sent successfully");
        this.close();
      } else {
        this.toastrService.error("Feedback save failed");
      }
    });
  }

  close() {
    this.activeModal.close();
  }
}
