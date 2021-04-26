import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[fixFilterBug]'
})
export class MultiselectFilterFixDirective {
  // trigger an additional change detection cycle
  @HostListener('keydown') onKeydownHandler() {
    setTimeout(() => { });
  }
}
