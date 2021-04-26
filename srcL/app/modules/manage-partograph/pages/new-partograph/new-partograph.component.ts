import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-partograph',
  templateUrl: './new-partograph.component.html',
  styleUrls: ['./new-partograph.component.css']
})
export class NewPartographComponent implements OnInit {
  TestingStartdate = new Date();
  constructor() {
    localStorage.removeItem("PartographPatient");
  }

  ngOnInit() {
  }

}
