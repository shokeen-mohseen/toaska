import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCapabilitiesComponent } from './add-capabilities.component';

describe('AddCapabilitiesComponent', () => {
  let component: AddCapabilitiesComponent;
  let fixture: ComponentFixture<AddCapabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCapabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
