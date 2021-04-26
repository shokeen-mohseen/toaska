import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: FindPartographComponent
  // },
  // {
  //   path: 'new-partograph',
  //   component: NewPartographComponent
  // }

  {
    path: 'user-list',
    component: UserListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
