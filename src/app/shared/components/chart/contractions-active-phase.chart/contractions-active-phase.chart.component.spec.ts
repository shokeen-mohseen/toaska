import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractionsActivePhaseChartComponent } from './contractions-active-phase.chart.component';

describe('ContractionsActivePhaseChartComponent', () => {
  let component: ContractionsActivePhaseChartComponent;
  let fixture: ComponentFixture<ContractionsActivePhaseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContractionsActivePhaseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractionsActivePhaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
