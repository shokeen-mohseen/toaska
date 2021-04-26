//TFSID 16470 Missing key handler for i18n language translator
import { Injectable } from '@angular/core';
import { MissingTranslationHandlerParams } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})

export class PartographMissingTranslationHandler {
  public alternativeJson = {
    value1: 'default1'
  }

  handle(params: MissingTranslationHandlerParams): string {
    //console.log(params.key)
      return this.alternativeJson[params.key];
  }
}
