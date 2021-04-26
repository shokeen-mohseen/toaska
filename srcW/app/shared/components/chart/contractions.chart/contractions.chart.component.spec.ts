import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Contractions.ChartComponent } from './contractions.chart.component';

describe('Contractions.ChartComponent', () => {
  let component: Contractions.ChartComponent;
  let fixture: ComponentFixture<Contractions.ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Contractions.ChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Contractions.ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
