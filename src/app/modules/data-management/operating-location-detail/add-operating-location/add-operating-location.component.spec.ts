import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOperatingLocationComponent } from './add-operating-location.component';

describe('AddOperatingLocationComponent', () => {
  let component: AddOperatingLocationComponent;
  let fixture: ComponentFixture<AddOperatingLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOperatingLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOperatingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
