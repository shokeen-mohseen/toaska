import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { projectkey } from '@env/projectkey';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { 'class': 'global' },
  providers: [NgbTooltipConfig]
})

export class AppComponent implements OnInit {

  isCollapsed: boolean;

  constructor(
    private router: Router,
    config: NgbTooltipConfig
  ) {
    //config.placement = 'right';
    config.container = 'body';
    config.triggers = 'hover';
    this.isCollapsed = true;
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });    
        
    //if (projectkey.projectname == "tosca") {
    //  this.router.navigate(['/auth/tosca-login']);
    //}
  }

}
