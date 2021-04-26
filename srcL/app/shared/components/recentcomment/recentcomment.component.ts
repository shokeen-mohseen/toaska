//TFSID 16635 Rizwan khan 10 July 2020 this is use from display recent comments 
import { Component, OnInit, Input } from '@angular/core';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';

const chartValueFieldCharts = [GlobalConstants.AMNIOTIC, GlobalConstants.MOULDING,
  GlobalConstants.CONTRACTION_PER_10MINS, GlobalConstants.OXYTOCIN, GlobalConstants.DROPS, GlobalConstants.BLOOD_PRESSURE,
  GlobalConstants.PROTEIN, GlobalConstants.ACETON, GlobalConstants.VOlUME, GlobalConstants.TEMPERATURE];

@Component({
  selector: 'app-recentcomment',
  templateUrl: './recentcomment.component.html',
  styleUrls: ['./recentcomment.component.css']
})
export class RecentcommentComponent implements OnInit {
  @Input() posts = [];
  @Input() chartName: string;

  valueField: string = 'yAxisPosition';
 
  // sortedActivities: any = this.posts.slice().sort((a, b) => b.CurrentTime - a.CurrentTime)
  constructor() { }

  ngOnInit(): void {
    // console.log(this.posts)
    if (chartValueFieldCharts.includes(this.chartName)) {
      this.valueField = 'chartValue';
    }
  }

  //TFSID 16635 Rizwan Khan 11 july 2020 Applied Order By Date on Recent Comments

  get sortData() {
    return this.posts.sort((a, b) => {

      return <any>new Date(b.createDateTimeServer) - <any>new Date(a.createDateTimeServer);
    });
  }

  GetTimeZone(dt): any {
   
    return /\((.*)\)/.exec(new Date(dt).toString())[1];
  }

  
}
