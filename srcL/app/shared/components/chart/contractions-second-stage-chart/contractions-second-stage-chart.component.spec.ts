import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractionsSecondStageChartComponent } from './contractions-second-stage-chart.component';

describe('ContractionsSecondStageChartComponent', () => {
  let component: ContractionsSecondStageChartComponent;
  let fixture: ComponentFixture<ContractionsSecondStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractionsSecondStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractionsSecondStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
