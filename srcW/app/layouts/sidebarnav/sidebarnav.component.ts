import { Component, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { navItemsTosca } from '../../_navTosca';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { User, AuthService } from '@app/core';
import { Router } from '@angular/router';
import { projectkey } from '@env/projectkey';

@Component({
  selector: 'app-sidebarnav',
  templateUrl: './sidebarnav.component.html',
  styleUrls: ['./sidebarnav.component.css']
})
export class SidebarnavComponent implements OnInit {
  //public navItems = navItems;
  public navItem: any;
  public sidebarMinimized = true;
  private navSrv$: Subscription;
  currentUser: User;
  constructor(private ts: TranslateService, private router: Router,
    private authenticationService: AuthService) {
  if (projectkey.projectname == 'tosca') {
    this.navItem = navItemsTosca.map(items => { this.translate(items); return items; });
  }
  else {
    this.navItem = navItems.map(items => { this.translate(items); return items; });
  }
 
}

  ngOnInit(): void {
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
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnDestroy() {
    this.navSrv$.unsubscribe();
  }
  logout() {
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
