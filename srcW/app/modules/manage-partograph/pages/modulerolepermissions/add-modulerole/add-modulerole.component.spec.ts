import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModuleroleComponent } from './add-modulerole.component';

describe('AddModuleroleComponent', () => {
  let component: AddModuleroleComponent;
  let fixture: ComponentFixture<AddModuleroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModuleroleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModuleroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
