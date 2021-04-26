import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CervixDescent.Chart.PopupComponent } from './cervix-descent.chart.popup.component';

describe('CervixDescent.Chart.PopupComponent', () => {
  let component: CervixDescent.Chart.PopupComponent;
  let fixture: ComponentFixture<CervixDescent.Chart.PopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CervixDescent.Chart.PopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CervixDescent.Chart.PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
