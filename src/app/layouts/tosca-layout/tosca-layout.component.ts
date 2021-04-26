import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { projectkey } from '@env/projectkey';
import { DataService } from '@app/shared/services';
import { Location } from '@angular/common';


@Component({
  selector: 'app-tosca-layout',
  templateUrl: './tosca-layout.component.html',
  styleUrls: ['./tosca-layout.component.css']
})
export class ToscaLayoutComponent implements OnInit, OnDestroy{
  IsTosca: boolean;
  public sidebarMinimized = false;
  isShowNotificationBtn:boolean=false;
  isShowBackBtn:boolean=false;
  theme = 'my-light-theme';
  isDarkTheme: Observable<boolean>;

  favIcon: HTMLLinkElement = this.document.querySelector('#appIcon');
counter:number=0;
 
  constructor(@Inject(DOCUMENT) private document: Document,
  private location: Location,
  private dataService:DataService,
    private renderer: Renderer2, private titleService: Title) {
    titleService.setTitle("LAMPS Tosca");
    dataService.getNotificationMenuShow().subscribe(isShow => {
      this.isShowNotificationBtn = isShow;
  });
  dataService.getIsShownBackbtn().subscribe(isShow => {
      this.isShowBackBtn = isShow;
  });
  dataService.getShowNotificationCounter().subscribe((v) => {
        this.counter = v;     
  })
  }

  goBack() {
    this.location.back();
  }
  
  async presentPopover(ev: any) {
    this.dataService.updateIsShownotesin(true);
  // const popover = await this.popoverController.create({
  //   component: ShowNotesComponent,
  //   cssClass: 'my-custom-class',
  //   event: ev,
  //   translucent: true
  // });
  // return await popover.present();
}
  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'tosca');
    this.favIcon.href = 'assets/images/tosca.png';
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'tosca');
  }



  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  // onThemeChange(theme: boolean) {
  //   this.themeService.setDarkTheme(theme);
  //   this.theme = (theme) ? 'my-dark-theme' : 'my-light-theme';
  //   console.log(theme);
  //   if (this.overlayContainer) {
  //     const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
  //     const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
  //     if (themeClassesToRemove.length) {
  //       overlayContainerClasses.remove(...themeClassesToRemove);
  //     }
  //     overlayContainerClasses.add(this.theme);
  //   }
  // }

}
