import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastCompareComponent } from './forecast-compare.component';

describe('ForecastCompareComponent', () => {
  let component: ForecastCompareComponent;
  let fixture: ComponentFixture<ForecastCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
