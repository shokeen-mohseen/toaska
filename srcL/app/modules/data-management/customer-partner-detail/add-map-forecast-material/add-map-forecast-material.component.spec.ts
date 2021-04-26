import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapForecastMaterialComponent } from './add-map-forecast-material.component';

describe('AddMapForecastMaterialComponent', () => {
  let component: AddMapForecastMaterialComponent;
  let fixture: ComponentFixture<AddMapForecastMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapForecastMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapForecastMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
