import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '@app/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientRoleViewModel } from '../model/send-object';
import { ModuleRolePermissionService } from '../services/modulerolepermission.services';

@Component({
  selector: 'app-edit-new-role',
  templateUrl: './edit-new-role.component.html',
  styleUrls: ['./edit-new-role.component.css']
})
export class EditNewRoleComponent implements OnInit {

  @Input() public Id: number;
  @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();
  isName: number = 0;
  isCode: number = 0;
 
  addNewRoleViewModel: ClientRoleViewModel = new ClientRoleViewModel();
  clientRoleViewModelList: ClientRoleViewModel[] = [];
  constructor(
    public activeModal: NgbActiveModal, private authService: AuthService,
    private modulerolePermission: ModuleRolePermissionService
  ) { }

  ngOnInit(): void {
    this.addNewRoleViewModel = new ClientRoleViewModel();
    if (!!this.Id) {
      this.GetUserRoleList();
    }
  }
 

  GetUserRoleList() {
    this.addNewRoleViewModel.ClientId = this.authService.currentUserValue.ClientId;
    this.addNewRoleViewModel.ID = this.Id;
    this.modulerolePermission.GetRole(this.addNewRoleViewModel)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.addNewRoleViewModel = res.Data;
        }
      });
  }
  onSubmit() {
    if (!!!this.Id) {
      this.saveNewRole(false);
    } else {
      this.saveNewRole(true);
    }
  }

  saveNewRole(isSubmit) {
    if (!this.validation()) {
      return;
    }
    else {
      let clientRoleViewModelList: ClientRoleViewModel[] = [];
      if (!!!this.addNewRoleViewModel.Description) {
        this.addNewRoleViewModel.Description = "";
      }
      this.addNewRoleViewModel.ClientId = this.authService.currentUserValue.ClientId;
      this.addNewRoleViewModel.UpdateDateTimeBrowserStr = this.convertDatetoStringDate(new Date());
      this.addNewRoleViewModel.UpdatedBy = this.authService.currentUserValue.LoginId;
      clientRoleViewModelList.push(this.addNewRoleViewModel);
      if (isSubmit) {
        this.modulerolePermission.UpdateNewRole(clientRoleViewModelList)
          .subscribe(res => {
            if (res.Message == "Success") {
              this.passEntry.emit();
              this.activeModal.dismiss('Cross click');
            }});
      }
      else {
       
        this.addNewRoleViewModel.CreateDateTimeBrowserStr = this.convertDatetoStringDate(new Date());
        this.addNewRoleViewModel.CreateDateTimeBrowser = new Date(new Date().toISOString());
        this.addNewRoleViewModel.CreatedBy = this.authService.currentUserValue.LoginId;
        this.modulerolePermission.AddNewRole(clientRoleViewModelList)
          .subscribe(res => {
            if (res.Message == "Success") {
              this.passEntry.emit();
              this.activeModal.dismiss('Cross click');
            }
          });
      }
     
      
    }


  }

  validation(type: any = ''): boolean {
    let isValidated: boolean = true;

    if (!!!this.addNewRoleViewModel.Code) {
      this.isCode = 1;
      isValidated = false;
    }
    else {
      this.isCode = 0;
    }
    if (!!!this.addNewRoleViewModel.Name) {
      this.isName = 1;
      isValidated = false;
    }
    else {
      this.isName = 0;
    }
    return isValidated;
  }

  convertDatetoStringDate(selectedDate: Date) {

    try {
      var date = selectedDate.getDate();
      var month = selectedDate.getMonth() + 1;
      var year = selectedDate.getFullYear();

      var hours = selectedDate.getHours();
      var minuts = selectedDate.getMinutes();
      var seconds = selectedDate.getSeconds();

      return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();
    }
    catch (e) {
      var dateNew = new Date(selectedDate);
      var datedd = dateNew.getDate();
      var monthmm = dateNew.getMonth() + 1;
      var yearyy = dateNew.getFullYear();

      var hourshh = dateNew.getHours();
      var minutsmm = dateNew.getMinutes();
      var secondsss = dateNew.getSeconds();

      return yearyy.toString() + "-" + monthmm.toString() + "-" + datedd.toString() + " " + hourshh.toString() + ":" + minutsmm.toString() + ":" + secondsss.toString();


    }


  }
}

