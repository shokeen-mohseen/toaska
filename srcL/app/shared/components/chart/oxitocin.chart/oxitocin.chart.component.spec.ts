import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OxitocinChartComponent } from './oxitocin.chart.component';

describe('Oxitocin.ChartComponent', () => {
  let component: OxitocinChartComponent;
  let fixture: ComponentFixture<OxitocinChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OxitocinChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OxitocinChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
