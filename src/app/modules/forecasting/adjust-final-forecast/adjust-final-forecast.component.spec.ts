import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustFinalForecastComponent } from './adjust-final-forecast.component';

describe('AdjustFinalForecastComponent', () => {
  let component: AdjustFinalForecastComponent;
  let fixture: ComponentFixture<AdjustFinalForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustFinalForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustFinalForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
