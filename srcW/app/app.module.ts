import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { TranslateLoader, TranslateModule, TranslateService, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
//import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { IonicModule } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderService } from '@app/shared/components/spinner/loader.service';
import { LoaderInterceptor } from '@app/shared/components/spinner/loader-interceptor.service';

import { DashboardModule } from './dashboard/dashboard.module';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { PagenotfoundComponent } from './shared/components/pagenotfound/pagenotfound.component';
import { AuthModule } from './modules/auth/auth.module';
// layout
import { DasboardLayoutComponent } from './layouts/dasboard-layout/dasboard-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { NavComponent } from './layouts/nav/nav.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SidebarnavComponent } from './layouts/sidebarnav/sidebarnav.component';
import { RightpanelComponent } from './layouts/rightpanel/rightpanel.component';
import { FooterComponent } from './layouts/footer/footer.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// Import 3rd party components

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';


// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { ToastrModule } from 'ngx-toastr';
import { MomentModule } from 'ngx-moment';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToscaLayoutComponent } from './layouts/tosca-layout/tosca-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    DasboardLayoutComponent,
    ContentLayoutComponent,
    NavComponent,
    FooterComponent,
    AuthLayoutComponent,
    SidebarnavComponent,
    RightpanelComponent,
    PagenotfoundComponent,
    ToscaLayoutComponent
    
  ],
  imports: [
    // angular
    BrowserModule,
     // 3rd party
    CoreModule,
    DashboardModule,
    AuthModule,
    IonicModule.forRoot(),
     //TranslateModule,
    // core & shared
   
  
    SharedModule,

    // app
    AppRoutingModule,

    BrowserAnimationsModule,
  
    NgbModule,

    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    }), MaterialModule,
    FlexLayoutModule,
 
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    InAppBrowser, SplashScreen, StatusBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

