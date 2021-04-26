import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastMappingComponent } from './forecast-mapping.component';

describe('ForecastMappingComponent', () => {
  let component: ForecastMappingComponent;
  let fixture: ComponentFixture<ForecastMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
