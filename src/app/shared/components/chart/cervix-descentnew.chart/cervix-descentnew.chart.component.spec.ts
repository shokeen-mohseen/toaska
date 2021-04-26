import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CervixDescentnewChartComponent } from './cervix-descentnew.chart.component';

describe('CervixDescentnewChartComponent', () => {
  let component: CervixDescentnewChartComponent;
  let fixture: ComponentFixture<CervixDescentnewChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CervixDescentnewChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CervixDescentnewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
