import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DupicateForecastComponent } from './dupicate-forecast.component';

describe('DupicateForecastComponent', () => {
  let component: DupicateForecastComponent;
  let fixture: ComponentFixture<DupicateForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DupicateForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DupicateForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
