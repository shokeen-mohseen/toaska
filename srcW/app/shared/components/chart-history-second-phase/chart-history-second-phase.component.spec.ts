import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHistorySecondPhaseComponent } from './chart-history-second-phase.component';

describe('ChartHistorySecondPhaseComponent', () => {
  let component: ChartHistorySecondPhaseComponent;
  let fixture: ComponentFixture<ChartHistorySecondPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartHistorySecondPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartHistorySecondPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
