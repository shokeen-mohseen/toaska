import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHistoryThirdPhaseComponent } from './chart-history-third-phase.component';

describe('ChartHistoryThirdPhaseComponent', () => {
  let component: ChartHistoryThirdPhaseComponent;
  let fixture: ComponentFixture<ChartHistoryThirdPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartHistoryThirdPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartHistoryThirdPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
