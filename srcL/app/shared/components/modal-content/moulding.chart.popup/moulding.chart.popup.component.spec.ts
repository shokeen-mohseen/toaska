import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouldingChartPopupComponent } from './moulding.chart.popup.component';

describe('Moulding.Chart.PopupComponent', () => {
  let component: MouldingChartPopupComponent;
  let fixture: ComponentFixture<MouldingChartPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MouldingChartPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouldingChartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
