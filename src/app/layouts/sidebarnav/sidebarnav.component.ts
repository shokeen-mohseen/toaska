import { Component, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { navItemsTosca } from '../../_navTosca';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { User, AuthService } from '@app/core';
import { Router } from '@angular/router';
import { projectkey } from '@env/projectkey';
import { moduleRole } from '@app/modules/system-settings/module-role-permissions/model/send-object';
import { Attribute } from '@angular/compiler';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-sidebarnav',
  templateUrl: './sidebarnav.component.html',
  styleUrls: ['./sidebarnav.component.css']
})
export class SidebarnavComponent implements OnInit {
 
  public navItem: any = [];
  public sidebarMinimized = true;
  private navSrv$: Subscription;
  currentUser: User;
  
  ItemList: moduleRole[];
 
  itemsfinal: any[];
  constructor(private ts: TranslateService, private router: Router,
    private authenticationService: AuthService
    ) {
    
  }

  async ngOnInit() {
    this.ItemList = new Array<any>();
    await this.showMenuItem();
    this.navSrv$ = await this.ts.onLangChange.subscribe(async (event: LangChangeEvent) => {
      await this.showMenuItem();
    });
  }

  async showMenuItem() {
    await this.authenticationService.GetModuleWiseMenu(this.authenticationService.currentUserValue.ClientId, this.authenticationService.currentUserValue.UserId)
      .toPromise().then(res => {
        if (res.Message == "Success") {
          res.Data.forEach((value, index) => {

            this.ItemList.push({ ID: value.Id, Module: value.Module, Role: value.Role, Permission: value.Permission, UpdatedBy: (value.UpdatedBy == null || value.UpdatedBy == "") ? value.CreatedBy : value.UpdatedBy, UpdateDateTimeServer: value.UpdateDateTimeServer,IsSelected:false })
          })
          if (projectkey.projectname == 'tosca') {
            this.navItem = JSON.parse(JSON.stringify(navItemsTosca.map(items => { this.translate(items); return items; })));
          }
          else {
            this.navItem = JSON.parse(JSON.stringify(navItems.map(items => { this.translate(items); return items; })));
          }
          this.navItem.forEach(x => {
            //if (x.icon === 'beta') {
            //  x.attributes.disabled = 'disabled';
            //}
            if (x.children && x.children.length > 0) {              
              x.children.forEach(y => {
                if (y.children && y.children.length > 0) {
                  y.children.forEach(z => {
                    const name1 = z.name.toLowerCase();                    
                    const q1 = this.ItemList.find(a => a.Module.toLowerCase() === name1);
                    if (q1 === undefined || z.icon ==='beta') {
                      z.attributes.disabled = 'disabled';
                    }
                    else {
                      z.attributes.disabled = '';
                    }
                  })
                }
                else {
                  const name2 = y.name.toLowerCase();
                  const q2 = this.ItemList.find(b => b.Module.toLowerCase() === name2);
                  if (q2 === undefined || y.icon === 'beta') {
                    y.attributes.disabled = 'disabled';
                  }
                  else {
                    y.attributes.disabled = '';
                  }
                }
              })
            }
            else {
              const name3 = x.name.toLowerCase();
              const q3 = this.ItemList.find(c => c.Module.toLowerCase() === name3);
              if (q3 === undefined) {
                x.attributes.disabled = 'disabled';
              }
              else {
                x.attributes.disabled = '';
              }
            }
          })
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
   // this.navSrv$.unsubscribe();
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
