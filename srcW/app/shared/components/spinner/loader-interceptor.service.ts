import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  private isSimilarUrl:any = "";
  constructor(private loaderService: LoaderService,private router: Router) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  } 

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // if (req.url.indexOf('http://gatewaydevapi.corp.osoftec.com/api') === -1) {
       
    // }
    try{
        console.log(this.router.routerState.snapshot.url);
        if(this.router.routerState.snapshot.url==this.isSimilarUrl){
            
        }else{
            this.isSimilarUrl = this.router.routerState.snapshot.url;
            this.loaderService.isShowingLoading.next(true);
        }
    }catch(e){}
   
    // limiting one spinner at the app level.
    if (this.requests.length == 0) {
      this.requests.push(req);

      this.loaderService.isLoading.next(true);
    }
    return Observable.create(observer => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
              this.loaderService.isShowingLoading.next(false);
            }
          },
          err => {
            this.removeRequest(req);
            this.loaderService.isShowingLoading.next(false);
          },
          () => {
            this.removeRequest(req);
            this.loaderService.isShowingLoading.next(false);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        this.loaderService.isShowingLoading.next(false);
        subscription.unsubscribe();
      };
    });
  }
}
