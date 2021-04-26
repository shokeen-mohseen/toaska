
import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Subscription } from 'rxjs';

import { LoaderService } from '@app/shared/components/spinner/loader.service';

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { projectkey } from '@env/projectkey';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { User, AuthService } from '@app/core';
import { delay } from 'rxjs/operators';
import { navItemsTosca } from './_navTosca';
import { navItems } from './_nav';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { LoadingController } from '@ionic/angular';
import { DataService } from '@app/shared/services/data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { 'class': 'global' },
  providers: [NgbTooltipConfig]
})

export class AppComponent implements OnInit {

    loading: any;
    IsTosca: boolean;
    IsloaingStart: boolean=false;
    spinIcon: string;
    isCollapsed: boolean;
  
    currentUser: User;
    hideSubMenu=[];
    innerHideSubMenu=[];
    tnavItem = JSON.parse(JSON.stringify(navItemsTosca.map(items => { this.translate(items); return items; })));
    public navItem: any;
    private navSrv$: Subscription;
  constructor(
    private loaderService: LoaderService,
    private _loader: LoaderService,
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthService,
    private router: Router,
    config: NgbTooltipConfig,
    private ts: TranslateService,
    public loadingController: LoadingController,
    private dataService:DataService
  ) { 
        config.container = 'body';
        config.triggers = 'hover';
        this.isCollapsed = true;
        
        if (projectkey.projectname == 'tosca') {
            this.navItem = navItemsTosca.map(items => { this.translate(items); return items; });
          }
          else {
            this.navItem = navItems.map(items => { this.translate(items); return items; });
          }
          
    this.initializeApp();
    // this.loaderService.isShowingLoading.subscribe((v) => {
    //     console.log(v)
    //     if(this.IsloaingStart ==v)
    //     return;
        
    //     if(v){
    //         this.presentLoading();
    //     }else{
    //         this.dismisLoading();
    //     }
    //     this.IsloaingStart = v;
       
    //   });
  }
  
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 50000
    });
    
    await this.loading.present().then((res)=>{
    console.log("then");
    });
    console.log("After then");
    if(this.IsloaingStart==false){
        this.dismisLoading();
    }
  
    const { role, data } = await this.loading.onDidDismiss();
    this.IsloaingStart = false;
    console.log('Loading dismissed!');
  }
  async dismisLoading(){
        setTimeout(() => {
                try{this.loading.dismiss();}catch(e){}
                
        }, 2000);
        
  }
  ngOnDestroy() {
    this.navSrv$.unsubscribe();
  }
  ngOnInit() {
      
    if (projectkey.projectname == "tosca") {
        this.IsTosca = true;
        this.spinIcon = 'assets/images/tosca.png';
      }
      else {
        this.IsTosca = false;
        this.spinIcon = 'assets/images/partoFav.png';
      }
      
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      }); 
      this.navSrv$= this.ts.onLangChange.subscribe((event: LangChangeEvent) => {
        // TFSID 16469 Dynamic menu set text according to language selection
         if (projectkey.projectname == 'tosca') {
           this.navItem = JSON.parse(JSON.stringify(navItemsTosca.map(items => { this.translate(items); return items; })));
         }
         else {
           this.navItem = JSON.parse(JSON.stringify(navItems.map(items => { this.translate(items); return items; })));
         }
     });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  
   // add translator key
   translate(item): void {
    if ('key' in item) {
      const trans = this.ts.instant(`${item.key}`);
      if (trans !== `${item.key}`) {
        item.name = trans;
      }
    }
    if (item.children && item.children.length > 0) {
      
      item.children.flatMap((child: any) => this.translate(child));

    }
  }
  
  logout() {
    this.menu.enable(false);
    setTimeout(() => {
        this.menu.enable(true);
    }, 1000);
    this.authenticationService.logout();
    this.currentUser = null;
    //for tosca redirection
    if (projectkey.projectname == 'tosca') {
      this.router.navigate(['/auth/tosca-login']);
    }
    else {
      this.router.navigate(['/auth/login']);
    }
  }

}
