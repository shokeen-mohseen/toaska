import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pulsebp.ChartComponent } from './pulsebp.chart.component';

describe('Pulsebp.ChartComponent', () => {
  let component: Pulsebp.ChartComponent;
  let fixture: ComponentFixture<Pulsebp.ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pulsebp.ChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pulsebp.ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
