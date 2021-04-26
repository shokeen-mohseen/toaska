import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { unauthorizedRouting } from './unauthorized-routing.module';
import { UnauthorizedAccessComponent } from './unauthorized-access/unauthorized-access.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'app/material/material.module';



@NgModule({
  declarations: [UnauthorizedAccessComponent],
  imports: [
    CommonModule, unauthorizedRouting, SharedModule, MaterialModule
  ]
})
export class UnauthorizedModule { }
