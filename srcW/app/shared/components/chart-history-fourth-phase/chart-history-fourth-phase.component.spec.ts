import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHistoryFourthPhaseComponent } from './chart-history-fourth-phase.component';

describe('ChartHistoryFourthPhaseComponent', () => {
  let component: ChartHistoryFourthPhaseComponent;
  let fixture: ComponentFixture<ChartHistoryFourthPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartHistoryFourthPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartHistoryFourthPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
