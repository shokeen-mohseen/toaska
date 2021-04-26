import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewForecastAsComponent } from './view-forecast-as.component';

describe('ViewForecastAsComponent', () => {
  let component: ViewForecastAsComponent;
  let fixture: ComponentFixture<ViewForecastAsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewForecastAsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewForecastAsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
