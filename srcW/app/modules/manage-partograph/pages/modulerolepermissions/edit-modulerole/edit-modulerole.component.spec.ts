import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModuleroleComponent } from './edit-modulerole.component';

describe('EditModuleroleComponent', () => {
  let component: EditModuleroleComponent;
  let fixture: ComponentFixture<EditModuleroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModuleroleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
