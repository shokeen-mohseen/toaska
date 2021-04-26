import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationLabelListComponent } from './organization-label-list.component';

describe('OrganizationLabelListComponent', () => {
  let component: OrganizationLabelListComponent;
  let fixture: ComponentFixture<OrganizationLabelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationLabelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationLabelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
