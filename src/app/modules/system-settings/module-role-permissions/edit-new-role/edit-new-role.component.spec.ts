import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewRoleComponent } from './edit-new-role.component';

describe('EditNewRoleComponent', () => {
  let component: EditNewRoleComponent;
  let fixture: ComponentFixture<EditNewRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNewRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNewRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
