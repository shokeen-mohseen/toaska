import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleRolePermissionsComponent } from './module-role-permissions.component';

describe('ModuleRolePermissionsComponent', () => {
  let component: ModuleRolePermissionsComponent;
  let fixture: ComponentFixture<ModuleRolePermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleRolePermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleRolePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
