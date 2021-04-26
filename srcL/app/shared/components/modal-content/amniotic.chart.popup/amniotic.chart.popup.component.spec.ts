import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmnioticChartPopupComponent } from './amniotic.chart.popup.component';

describe('Amniotic.Chart.PopupComponent', () => {
  let component: AmnioticChartPopupComponent;
  let fixture: ComponentFixture<AmnioticChartPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AmnioticChartPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmnioticChartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
