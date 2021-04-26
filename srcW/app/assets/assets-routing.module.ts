import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatTabGlobalComponent } from './mat-tab-global/mat-tab-global.component';
import { BodyWithoutHeaderComponent } from './body-without-header/body-without-header.component';
import { AngularPdfComponent } from './angular-pdf/angular-pdf.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { MultiselectDropdownComponent } from './multiselect-dropdown/multiselect-dropdown.component';

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
    path: 'global-use',
    component: MatTabGlobalComponent
  },
  {
    path: 'new-design',
    component: BodyWithoutHeaderComponent
  },
  {
    path: 'pdf',
    component: AngularPdfComponent
  },
  {
    path: 'date-picker',
    component: DatepickerComponent
  },
  {
    path: 'dropdown',
    component: MultiselectDropdownComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
