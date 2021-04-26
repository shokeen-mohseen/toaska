import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHistoryActivePhaseComponent } from './chart-history-active-phase.component';

describe('ChartHistoryActivePhaseComponent', () => {
  let component: ChartHistoryActivePhaseComponent;
  let fixture: ComponentFixture<ChartHistoryActivePhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartHistoryActivePhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartHistoryActivePhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
