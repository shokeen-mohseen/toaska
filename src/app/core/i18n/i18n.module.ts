//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16470
//Logic Description: This i18n module purpose to convert application into user navtive language.
//chnges en to englsih, hi to hindi, also rename json file | WI 16910 | 21-07-2020 | Amit Agrahari

import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService, MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';
import { PartographMissingTranslationHandler } from './PartographMissingTranslationHandler.services';

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      //missingTranslationHandler: { provide: MissingTranslationHandler, useClass: PartographMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient]
      }
      
    }),
    TranslateCacheModule.forRoot({
      cacheService: {
        provide: TranslateCacheService,
        useFactory: translateCacheFactory,
        deps: [TranslateService, TranslateCacheSettings]
      },
      cacheMechanism: 'Cookie'
    })
  ],
  exports: [TranslateModule]
})

export class I18nModule {
  constructor(
    translate: TranslateService,
    translateCacheService: TranslateCacheService
  ) {
    translateCacheService.init();
    translate.addLangs(['English', 'Hindi']);
    const browserLang = translateCacheService.getCachedLanguage() || translate.getBrowserLang();
    translate.use(browserLang.match(/English|Hindi/) ? browserLang : 'English');
  }
}

//Developer Name: Rizwan Khan
//Date: June 6, 2020
//TFS ID: 16494
//Logic Description: use for store language preferences in browser or cache.

export function translateCacheFactory(
  translateService: TranslateService,
  translateCacheSettings: TranslateCacheSettings
) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}

export function translateLoaderFactory(httpClient: HttpClient) {
   return new TranslateHttpLoader(httpClient);
}

//TFS ID: 16494

// TFSID 16470
