import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { from } from 'rxjs';

import { ToscaLoginComponent } from './tosca/tosca-login/tosca-login.component';
import { ToscaForgotPasswordComponent } from './tosca/tosca-forgot-password/tosca-forgot-password.component';
import { ToscaRegisterComponent } from './tosca/tosca-register/tosca-register.component';
import { CheckLogin } from '@app/shared/check-login.service';
 
const routes: Routes = [
 
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,canLoad: [CheckLogin]
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'forgotpassword',
        component: ForgotpasswordComponent
      },
      {
        path: 'tosca-login',
        component: ToscaLoginComponent,canLoad: [CheckLogin]
      },
      {
        path: 'tosca-forgot-password',
        component: ToscaForgotPasswordComponent
      },
      {
        path: 'tosca-register',
        component: ToscaRegisterComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
