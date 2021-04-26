import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { projectkey } from 'environments/projectkey';
import { DataService } from '@app/shared/services/data.service';
@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.css']
})
export class ContentLayoutComponent implements OnInit, OnDestroy {
  public sidebarMinimized = false;
  IsTosca: boolean;
  theme = 'my-light-theme';
  isDarkTheme: Observable<boolean>;
  counter:number=0;
  favIcon: HTMLLinkElement = this.document.querySelector('#appIcon');

  constructor(@Inject(DOCUMENT) private document: Document,
  private dataService:DataService,
    private renderer: Renderer2, private titleService: Title) {
    titleService.setTitle("Lamps Partograph");
    dataService.getShowNotificationCounter().subscribe((v) => {
        this.counter = v;     
    })
   
  }

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'partograph');
    this.favIcon.href = 'assets/images/partoFav.png';
    if (projectkey.projectname == "tosca") {
        this.IsTosca = true;
      }
      else {
        this.IsTosca = false;
      }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'partograph');
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
