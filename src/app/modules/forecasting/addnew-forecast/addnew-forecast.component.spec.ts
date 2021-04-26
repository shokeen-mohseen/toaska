import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewForecastComponent } from './addnew-forecast.component';

describe('AddnewForecastComponent', () => {
  let component: AddnewForecastComponent;
  let fixture: ComponentFixture<AddnewForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
