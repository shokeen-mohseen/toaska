import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-help-preference',
  templateUrl: './help-preference.component.html',
  styleUrls: ['./help-preference.component.css']
})
export class HelpPreferenceComponent implements OnInit {
  @Input("PreferenceDetailDescription") PreferenceDetailDescription: string;
  constructor(public activeModal: NgbActiveModal) { }
  txtPreferenceComment: string;
  ngOnInit(): void {
    this.txtPreferenceComment = this.PreferenceDetailDescription;
  }

}
