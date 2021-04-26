import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { UiSwitchModule } from 'ngx-ui-switch';

import { MaterialModule } from 'app/material/material.module';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ExistingUserComponent } from './pages/user-list/existing-user/existing-user.component';
import { NewUsersComponent } from './pages/user-list/new-users/new-users.component';
import { LockedUsersComponent } from './pages/user-list/locked-users/locked-users.component';
import { DeclinedUsersComponent } from './pages/user-list/declined-users/declined-users.component';
import { EditUsersComponent } from './pages/user-list/edit-users/edit-users.component';
import { AddUsersComponent } from './pages/user-list/add-users/add-users.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserListComponent, ExistingUserComponent, NewUsersComponent, LockedUsersComponent, DeclinedUsersComponent, EditUsersComponent, AddUsersComponent],
  imports: [
    UserManagementRoutingModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    UiSwitchModule
  ],
  exports: [
    ExistingUserComponent,
    NewUsersComponent,
    LockedUsersComponent,
    DeclinedUsersComponent,
    EditUsersComponent,
    AddUsersComponent
  ]
})
export class UserManagementModule { }
