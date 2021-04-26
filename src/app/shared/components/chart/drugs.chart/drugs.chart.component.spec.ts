import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Drugs.ChartComponent } from './drugs.chart.component';

describe('Drugs.ChartComponent', () => {
  let component: Drugs.ChartComponent;
  let fixture: ComponentFixture<Drugs.ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Drugs.ChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Drugs.ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
