import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastUpdateComponent } from './forecast-update.component';

describe('ForecastUpdateComponent', () => {
  let component: ForecastUpdateComponent;
  let fixture: ComponentFixture<ForecastUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
