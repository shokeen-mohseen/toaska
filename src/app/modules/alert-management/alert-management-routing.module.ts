import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertListComponent } from './pages/alert-list/alert-list.component';
import { AddNewComponent } from './pages/add-new-alert/add-new.component';
import { EditAlertComponent } from './pages/edit-alert/edit-alert.component';
import { AlertHistoryComponent } from './alert-history/alert-history.component';
import { AlertComponent } from './pages/alert.component';
 const routes: Routes = [

   {
     path: 'alert-list',
     component: AlertComponent
   },
   {
     path: 'add-new-alert',
     component: AddNewComponent
   },
   {
     path: 'edit-alert',
     component: EditAlertComponent
   },
   {
     path: 'alert-history',
     component: AlertHistoryComponent
   }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertManagementRoutingModule { }
