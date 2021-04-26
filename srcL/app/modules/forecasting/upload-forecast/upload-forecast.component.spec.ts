import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadForecastComponent } from './upload-forecast.component';

describe('UploadForecastComponent', () => {
  let component: UploadForecastComponent;
  let fixture: ComponentFixture<UploadForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
