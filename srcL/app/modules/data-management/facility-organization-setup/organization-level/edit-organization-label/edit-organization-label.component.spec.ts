import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationLabelComponent } from './edit-organization-label.component';

describe('EditOrganizationLabelComponent', () => {
  let component: EditOrganizationLabelComponent;
  let fixture: ComponentFixture<EditOrganizationLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrganizationLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrganizationLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
