import { NgModule } from '@angular/core';

import { MyModalComponent } from './modals/my-modal.component';

import { HomeComponent } from './pages/home.component';
import { HomeRoutingModule } from './home-routing.module';

import { SharedModule } from '@app/shared';
import { DummyPageModule } from './dummy/dummy.module';
@NgModule({
    declarations: [
    HomeComponent,
        MyModalComponent
    ],
    imports: [
    
    SharedModule,
        DummyPageModule,
        HomeRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: [MyModalComponent]
})
export class HomeModule {}
