import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationLevelComponent } from './organization-level.component';

describe('OrganizationLevelComponent', () => {
  let component: OrganizationLevelComponent;
  let fixture: ComponentFixture<OrganizationLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
