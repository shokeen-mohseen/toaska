import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ShowNotesService } from '../../../core/services/show-notes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core';
import { ShowNotes } from '../../../core/models/show-notes.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() update: boolean = false;
  notesModel = new ShowNotes();
  @Output('getShowNotesList') getShowNotesList: EventEmitter<any> = new EventEmitter();
  @Output('showRefreshedNote') showRefreshedNote: EventEmitter<any> = new EventEmitter();
  @Input() note: ShowNotes;
  enableSubmit: boolean;
  constructor(private showNotesService: ShowNotesService,
    private toastrService: ToastrService,
    private authenticationService: AuthService) { }

  ngOnInit(): void {
    if (this.note != undefined) {
      this.notesModel.description = this.note.description;
      this.notesModel.isUrgent = this.note.isUrgent;
    }    
  }

  updateModel() {
    this.notesModel.id = this.note.id;
    this.notesModel.applicationModuleId = this.note.applicationModuleId;
    this.notesModel.isDeleted = this.note.isDeleted;
    this.notesModel.isRead = false;
    this.notesModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.notesModel.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    this.notesModel.parentCommentId = this.note.parentCommentId;
    this.notesModel.createdBy = this.authenticationService.currentUserValue.LoginId;
    this.notesModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    this.notesModel.createDateTimeBrowserStr = this.showNotesService.convertDatetoStringDate(new Date());
    this.notesModel.createDateTimeServer = new Date();
    this.notesModel.updateDateTimeBrowserStr = this.showNotesService.convertDatetoStringDate(new Date());
    this.notesModel.updateDateTimeServer = new Date();
  }

  saveModel() {
    this.notesModel.applicationModuleId = this.showNotesService.pageid;
    this.notesModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.notesModel.userId = this.authenticationService.currentUserValue.UserId;
    this.notesModel.isDeleted = false;
    this.notesModel.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    this.notesModel.parentCommentId = null;
    this.notesModel.createdBy = this.authenticationService.currentUserValue.LoginId;
    this.notesModel.createDateTimeBrowserStr = this.showNotesService.convertDatetoStringDate(new Date());
    this.notesModel.updateDateTimeBrowserStr = this.showNotesService.convertDatetoStringDate(new Date());
    this.notesModel.createDateTimeServer = new Date();
  }

  public onUrgentChanged(value: boolean) {
    this.notesModel.isUrgent = value;
  }

  onKeyUp(event: any) {
    this.enableSubmit = /[^\s\\]/.test(this.notesModel.description);
  }

  saveNotes() {
    this.saveModel();
    this.showNotesService.saveNotes(this.notesModel).subscribe(x => {
      this.notesModel.isUrgent = false;
      this.notesModel.description = "";
      this.enableSubmit = false;
      this.toastrService.success("Notes added successfully");
      this.getShowNotesList.emit();
    });
  }

  updateNotes() {
    this.updateModel();
    this.showNotesService.updateNotes(this.notesModel).subscribe(x => {
      this.toastrService.success("Notes updated successfully");
      this.showRefreshedNote.emit();
    });
  }
}
