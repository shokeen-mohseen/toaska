import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-multiple-client',
  templateUrl: './multiple-client.component.html',
  styleUrls: ['./multiple-client.component.css']
})
export class MultipleClientComponent implements OnInit {
  ClientSubscriptionform: FormGroup;
  Client: any;
  ClientId: string;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.ClientSubscriptionform = this.formBuilder.group({
      ClientsCode: ['', Validators.required]
    });
   
    this.authService.getClient()
      .subscribe(
        data => {
          this.Client = data.Data;
        });
  }
  selectClientsCode(event) {
    var drpdata = this.ClientSubscriptionform.controls.ClientsCode.value;
    if (this.ClientSubscriptionform.invalid || drpdata == "") {
      return;
    }
    this.ClientId = event.target.value;
  }
  Next() {
    this.activeModal.dismiss('Cross click');
    localStorage.setItem('clientId', this.ClientId);
    this.router.navigate(['/dashboard/home']);
  }

}
