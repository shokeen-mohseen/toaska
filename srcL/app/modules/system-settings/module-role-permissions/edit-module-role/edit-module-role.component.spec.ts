import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModuleRoleComponent } from './edit-module-role.component';

describe('EditModuleRoleComponent', () => {
  let component: EditModuleRoleComponent;
  let fixture: ComponentFixture<EditModuleRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModuleRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
