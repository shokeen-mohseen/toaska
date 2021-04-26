import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempratureChartPopupComponent } from './temprature.chart.popup.component';

describe('TempratureChartPopupComponent', () => {
  let component: TempratureChartPopupComponent;
  let fixture: ComponentFixture<TempratureChartPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempratureChartPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempratureChartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
