import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { DasboardLayoutComponent } from './layouts/dasboard-layout/dasboard-layout.component';
import { PagenotfoundComponent } from './shared/components/pagenotfound/pagenotfound.component';

import { CONTENT_ROUTES } from '@app/shared/routes/content-layout.routes';

import { AuthGuard } from '@app/core/guards/auth.guard';
import { ToscaLayoutComponent } from './layouts/tosca-layout/tosca-layout.component';
import { projectkey } from '../environments/projectkey';
//import { NoAuthGuard } from '@app/core/guards/no-auth.guard';

const routes: Routes = [

  
  {
    path: '',
    redirectTo:'/arcpartograph',
    pathMatch: 'full',
    
  },
  {
    path: 'arcpartograph',
    component: DasboardLayoutComponent,
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
 
  {
    path: 'pagenotfound',
    component: PagenotfoundComponent,
    pathMatch: 'full'
  },

  
  {
    path: '',
    //component: ContentLayoutComponent,
    component: projectkey.projectname == 'tosca' ? ToscaLayoutComponent : ContentLayoutComponent,
    canActivate: [AuthGuard], // Should be replaced with actual auth guard
    children: CONTENT_ROUTES
  },
  
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: './modules/auth/auth.module#AuthModule'
  },
  // Fallback when no prior routes is matched
  { path: '**', redirectTo: 'pagenotfound', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
