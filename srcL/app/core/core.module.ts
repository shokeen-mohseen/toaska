import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
// import i18nmoule 
import { I18nModule } from './i18n/i18n.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// used to create fake backend
import { fakeBackendProvider } from './interceptors/FakeBackendInterceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthGuard, NoAuthGuard, RoleGuard } from './guards';
import { NgxSpinnerModule } from 'ngx-spinner';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { ClientSideErrorsHandler } from './services/errorhandler.service';
import { ErrorsService } from './services/error.service';
import { ToastService } from './services/alert.service';
import { PreferenceTypeService } from './services';
@NgModule({
   imports: [
      HttpClientModule,
      I18nModule,
      NgxSpinnerModule
    ],
    providers: [
        AuthGuard,
        NoAuthGuard,
       RoleGuard,
      ErrorsService,
      // add toast service by rizwan khan 10 july 2020
      ToastService,
      PreferenceTypeService,
        {
         provide: ErrorHandler,
          useClass: ClientSideErrorsHandler,
        },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
       // provider used to create fake backend
        fakeBackendProvider,
     
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
