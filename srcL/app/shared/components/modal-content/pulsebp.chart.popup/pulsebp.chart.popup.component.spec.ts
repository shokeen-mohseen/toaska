import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsebpChartPopupComponent } from './pulsebp.chart.popup.component';

describe('PulsebpChartPopupComponent', () => {
  let component: PulsebpChartPopupComponent;
  let fixture: ComponentFixture<PulsebpChartPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PulsebpChartPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulsebpChartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
