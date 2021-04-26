import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempProteinVolumeAcetonChartPopupComponent } from './temp.protein.volume.aceton.chart.popup.component';

describe('TempProteinVolumeAcetonChartPopupComponent', () => {
  let component: TempProteinVolumeAcetonChartPopupComponent;
  let fixture: ComponentFixture<TempProteinVolumeAcetonChartPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempProteinVolumeAcetonChartPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempProteinVolumeAcetonChartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
