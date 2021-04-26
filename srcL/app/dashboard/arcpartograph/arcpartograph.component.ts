import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { projectkey } from '@env/projectkey';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-arcpartograph',
  templateUrl: './arcpartograph.component.html',
  styleUrls: ['./arcpartograph.component.css']
})
export class ArcpartographComponent implements OnInit {

  constructor(public translate: TranslateService, private router: Router) { }
  
  ngOnInit(): void {
   //AOS.init();
    if (projectkey.projectname == "tosca") {
      this.router.navigate(['/auth/tosca-login']);
    }
  }
  
  switchLang(lang: string) {
    this.translate.use(lang);
  }

  toHome() {
    document.getElementById("carouselExampleCaptions").scrollIntoView({ behavior: "smooth" });

  }
  toAbout() {
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
  }
  toProduct() {
    document.getElementById("product").scrollIntoView({ behavior: "smooth" });
  }
  toPrice() {
    document.getElementById("price").scrollIntoView({ behavior: "smooth" });
  }
  toContact() {
    document.getElementById("contacts").scrollIntoView({ behavior: "smooth" });
  }




}
