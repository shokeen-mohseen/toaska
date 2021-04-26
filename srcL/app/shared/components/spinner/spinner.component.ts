import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { projectkey } from 'environments/projectkey';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  loading: boolean;
  IsTosca: boolean;
  spinIcon: string;
  spinnerSource: string;

  constructor(
    private loaderService: LoaderService
  ) {
    
    //var ParentCall = (this.loaderService.mainSource != undefined &&
    //  this.loaderService.mainSource != null && this.loaderService.mainSource != "")
    
    
    this.loaderService.isLoading.subscribe((v) => {
      //console.log(v);
      
      if (this.loaderService.mainSource != undefined && this.loaderService.mainSource != null &&
        this.loaderService.mainSource != "") {
        if (v.source == this.loaderService.mainSource) {
          this.loading = v.status;
          if (v.status == false) {
            
            this.loaderService.mainSource = "";
          }
        }
        else
          this.loading = true;
      }
      else
        this.loading = v.status;
      //this.spinIcon = 'assets/images/partoFav.png';
    });
  }

  ngOnInit(): void {

    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
      this.spinIcon = 'assets/images/tosca.png';
    }
    else {
      this.IsTosca = false;
      this.spinIcon = 'assets/images/partoFav.png';
    }
  }

  ngOnDestroy(): void {
    this.loaderService.isLoading.unsubscribe();
  }

}
