import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnauthorizedAccessComponent } from './unauthorized-access/unauthorized-access.component';

const routes: Routes = [
 
  {
    path: 'unauthorized',
    component: UnauthorizedAccessComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class unauthorizedRouting { }
