import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperatingLocationComponent } from './edit-operating-location.component';

describe('EditOperatingLocationComponent', () => {
  let component: EditOperatingLocationComponent;
  let fixture: ComponentFixture<EditOperatingLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOperatingLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOperatingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
