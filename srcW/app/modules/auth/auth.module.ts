import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { SharedModule } from '@app/shared';

import { AuthRoutingModule } from './auth-routing.module';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { MultipleClientComponent } from './pages/multiple-client/multiple-client.component';
import { ToscaLoginComponent } from './tosca/tosca-login/tosca-login.component';
import { ToscaForgotPasswordComponent } from './tosca/tosca-forgot-password/tosca-forgot-password.component';
import { ToscaRegisterComponent } from './tosca/tosca-register/tosca-register.component';
import { WelcomeModalComponent } from './tosca/welcome-modal/welcome-modal.component';
 

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotpasswordComponent,
    ChangePasswordComponent,
    MultipleClientComponent,
    ToscaLoginComponent,
    ToscaForgotPasswordComponent,
    ToscaRegisterComponent,
    WelcomeModalComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
   exports: [
     ChangePasswordComponent,
     MultipleClientComponent
  ]
})
export class AuthModule { }
