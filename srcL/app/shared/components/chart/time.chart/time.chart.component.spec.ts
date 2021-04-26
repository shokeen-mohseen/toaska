import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Time.ChartComponent } from './time.chart.component';

describe('Time.ChartComponent', () => {
  let component: Time.ChartComponent;
  let fixture: ComponentFixture<Time.ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Time.ChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Time.ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
