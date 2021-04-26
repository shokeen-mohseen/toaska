import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patientinformation',
  templateUrl: './patientinformation.component.html',
  styleUrls: ['./patientinformation.component.css']
})
export class PatientinformationComponent implements OnInit {
  statusn: boolean = false;
  statusc: boolean = false;
  statusm: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
  show:string='View More'

toggleDisplay(){
	if(this.show == 'View More')
	{
		this.show = 'Close'
	}
	else
	{
		this.show = 'View More'
	}
  }

  //Toggle Status
  selectStatus(status) {
    if (status == 1) {
      this.statusn = false;
      this.statusm = true;
      this.statusc = false;
    }
    else if (status == 2) {
      this.statusm = false;
      this.statusn = false;
      this.statusc = true;
    }
    else if (status == 3) {
      this.statusn = true;
      this.statusm = false;
      this.statusc = false;
    }
  }

}
