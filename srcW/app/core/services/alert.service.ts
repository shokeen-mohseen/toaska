import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable()
export class ToastService {

  options: IndividualConfig;

  constructor(
    private toastr: ToastrService
  ) {
    this.options = this.toastr.toastrConfig;
    this.options.positionClass = 'toast-top-center';
    this.options.timeOut = 8500;
  }

  showToast(title, message, type) {
    this.toastr.show(message, title, this.options, 'toast-' + type);
  }

  showHTMLMessage(message, title) {
    this.toastr.success(message, title, {
      enableHtml: true
    })
  }

}


// toast.service.ts
//import { Injectable, TemplateRef } from '@angular/core';

//@Injectable()
//export class ToastService {

//  toasts: any[] = [];

//  // Push new Toasts to array with content and options
//  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
   
//    this.toasts.push({ textOrTpl, ...options });
//  }

//  // Callback method to remove Toast DOM element from view
//  remove(toast) {
//    this.toasts = this.toasts.filter(t => t !== toast);
//  }
//}
