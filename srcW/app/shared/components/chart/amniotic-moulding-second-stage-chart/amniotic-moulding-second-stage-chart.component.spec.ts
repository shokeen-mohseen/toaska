import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmnioticMouldingSecondStageChartComponent } from './amniotic-moulding-second-stage-chart.component';

describe('AmnioticMouldingSecondStageChartComponent', () => {
  let component: AmnioticMouldingSecondStageChartComponent;
  let fixture: ComponentFixture<AmnioticMouldingSecondStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmnioticMouldingSecondStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmnioticMouldingSecondStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
