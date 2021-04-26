import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffRoleComponent } from './add-staff-role.component';

describe('AddStaffRoleComponent', () => {
  let component: AddStaffRoleComponent;
  let fixture: ComponentFixture<AddStaffRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStaffRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStaffRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
