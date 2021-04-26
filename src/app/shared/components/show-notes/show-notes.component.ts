import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { projectkey } from 'environments/projectkey';
import { ShowNotes, CommonModel, UserModel } from '../../../core/models/show-notes.model';
import { User, AuthService } from '../../../core';
import { Router } from '@angular/router';
import { ShowNotesService } from '../../../core/services/show-notes.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '@app/shared/services';

@Component({
  selector: 'app-show-notes',
  templateUrl: './show-notes.component.html',
  styleUrls: ['./show-notes.component.css']
})
export class ShowNotesComponent implements OnInit,AfterViewInit {
  status: boolean = false;
  notesModel = new ShowNotes();
  notesModellist: ShowNotes[] = [];
  currentUser: User;
  IsTosca: boolean;
  urgentCount: number = 0;
  normalCount: number = 0;
  totalCount: number = 0;
  urgentData = [];
  update: boolean;
  Inactive: boolean;
  userName: string = '';
  commonModel = new CommonModel();
  usermodel = new UserModel();
  loginid: string = '';

  maxNumberOfCharacters = 5;

  constructor(private router: Router,
    private showNotesService: ShowNotesService,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private dataService:DataService
  ) { 
    dataService.getIsShownotesin().subscribe(isShow => {
      this.openNotes();
  });
  }
  ngAfterViewInit(){
    try{
      console.log("ngAfterViewInit");
      this.dataService.updateNotification(true);
    }catch(e){}
   
  }

  ngOnDestroy() {
    try{
      console.log("ngOnDestroy");
      this.dataService.updateNotification(false);
      this.status = false;
    }catch(e){}
   
  }

  async ngOnInit() {
    this.loginid = this.authenticationService.currentUserValue.LoginId;
    await this.showNotesService.checkUserRole();
    await this.showNotesService.getPageID();
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.notesModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.notesModel.createdBy = this.authenticationService.currentUserValue.LoginId;
    this.notesModel.applicationModuleId = this.showNotesService.pageid;
    this.getShowNotesList();
    this.Inactive = this.showNotesService.deleteAllbtn;
  }

  public onUrgentChanged(value: boolean) {
    this.notesModel.isUrgent = value;
  }

  getShowNotesList() {
    this.showNotesService.GetAllDisplayNotes(this.notesModel)
      .subscribe(result => {
        if (result.data != null || result.data != undefined) {
          this.notesModellist = result.data;
          this.countUrgent();
          this.countNormal();
          this.totalAllCount();
        }
      });
  }
  public onReadChanged(value: boolean,model:ShowNotes) {
    this.notesModel.isRead = value;
    this.notesModel.id = model.id;
    this.notesModel.isUrgent = false;
    this.showNotesService.updateReadStatus(this.notesModel).subscribe(x => {
      //this.toastrService.success("Read successfully");
      this.getShowNotesList();
    });
  }
  countUrgent() {
    this.commonModel.applicationModuleId = this.showNotesService.pageid;
    this.commonModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.showNotesService.countUrgent(this.commonModel).subscribe(result => {
      if (result.data != null || result.data != undefined) {
        this.urgentCount = result.data;
      }
    });
  }

  countNormal() {
    this.commonModel.applicationModuleId = this.showNotesService.pageid;
    this.commonModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.showNotesService.countNormal(this.commonModel).subscribe(result => {
      if (result.data != null || result.data != undefined) {
        this.normalCount = result.data;
      }
    });
  }

  totalAllCount() {
    this.commonModel.applicationModuleId = this.showNotesService.pageid;
    this.commonModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.showNotesService.countTotal(this.commonModel).subscribe(result => {
      if (result.data != null || result.data != undefined) {
        this.totalCount = result.data;
      }
    });
  }

  DeleteComment(id: number) {
    this.notesModel.id = id;    
    this.showNotesService.deleteComment(this.notesModel).subscribe(result => {
      if (result) {
        this.getShowNotesList();
        this.toastrService.success("Note(s) deleted successfully");
      }
      else {
        this.toastrService.warning("An error occurred during this operation. Please contact Tech Support");
      }
    });
  }

  DeleteAllComment(id: number) {
    this.notesModel.id = id;
    this.notesModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.showNotesService.removeAllComment(this.notesModel).subscribe(result => {
      if (result.message == "Success" || result.Message == "Success") {
        this.getShowNotesList();
        this.toastrService.success("Note(s) deleted successfully");
      }
      else {
        this.toastrService.warning("An error occurred during this operation. Please contact Tech Support");
      }
    });
  }

  openNotes() {
    //this.status = !this.status;
    document.querySelector('.hide').classList.toggle('expand');
  }

  edit(id: number) {
    this.update = true;
    this.notesModellist.map((row) => {
      if (row.id === id) { row.isEditableMode = true; }
      else { row.isEditableMode = false }
      return row;
    });
  }
}
