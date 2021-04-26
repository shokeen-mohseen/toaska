import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OxitocinChartPopupComponent } from './oxitocin.chart.popup.component';

describe('Oxitocin.Chart.PopupComponent', () => {
  let component: OxitocinChartPopupComponent;
  let fixture: ComponentFixture<OxitocinChartPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OxitocinChartPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OxitocinChartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
