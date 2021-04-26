import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrganizationLabelComponent } from './add-organization-label.component';

describe('AddOrganizationLabelComponent', () => {
  let component: AddOrganizationLabelComponent;
  let fixture: ComponentFixture<AddOrganizationLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrganizationLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrganizationLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
