import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModuleRoleComponent } from './add-module-role.component';

describe('AddModuleRoleComponent', () => {
  let component: AddModuleRoleComponent;
  let fixture: ComponentFixture<AddModuleRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModuleRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModuleRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
