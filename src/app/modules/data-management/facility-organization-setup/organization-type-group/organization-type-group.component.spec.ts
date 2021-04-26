import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationTypeGroupComponent } from './organization-type-group.component';

describe('OrganizationTypeGroupComponent', () => {
  let component: OrganizationTypeGroupComponent;
  let fixture: ComponentFixture<OrganizationTypeGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationTypeGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationTypeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
