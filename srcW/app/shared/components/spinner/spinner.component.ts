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

  constructor(
    private loaderService: LoaderService
  ) {
    this.loaderService.isLoading.subscribe((v) => {
      //console.log(v);
      this.loading = v;
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
    
  }

}
