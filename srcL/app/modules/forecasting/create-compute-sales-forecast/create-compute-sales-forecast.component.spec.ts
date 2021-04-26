import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComputeSalesForecastComponent } from './create-compute-sales-forecast.component';

describe('CreateComputeSalesForecastComponent', () => {
  let component: CreateComputeSalesForecastComponent;
  let fixture: ComponentFixture<CreateComputeSalesForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateComputeSalesForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComputeSalesForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
