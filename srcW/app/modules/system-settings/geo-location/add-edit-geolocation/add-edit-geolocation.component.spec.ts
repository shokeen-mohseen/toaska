import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGeolocationComponent } from './add-edit-geolocation.component';

describe('AddEditGeolocationComponent', () => {
  let component: AddEditGeolocationComponent;
  let fixture: ComponentFixture<AddEditGeolocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditGeolocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
