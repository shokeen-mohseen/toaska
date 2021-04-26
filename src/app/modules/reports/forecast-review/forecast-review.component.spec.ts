import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastReviewComponent } from './forecast-review.component';

describe('ForecastReviewComponent', () => {
  let component: ForecastReviewComponent;
  let fixture: ComponentFixture<ForecastReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
