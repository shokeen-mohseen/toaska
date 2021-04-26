import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsChartPopupComponent } from './drugs.chart.popup.component';

describe('Drugs.Chart.PopupComponent', () => {
  let component: DrugsChartPopupComponent;
  let fixture: ComponentFixture<DrugsChartPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugsChartPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsChartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
