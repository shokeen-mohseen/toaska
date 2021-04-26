import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditUserListComponent } from './pages/credit-user-list/credit-user-list.component';
const routes: Routes = [
  //   {
  //     path: '',
  //     children: [
  //       {
  //         path: 'budget',
  //         component: BudgetComponent
  //       }
  //     ]
  //   }

  {
    path: '',
    component: CreditUserListComponent
  },
  {
    path: 'credit-management',
    component: CreditUserListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditManagementRoutingModule { }
