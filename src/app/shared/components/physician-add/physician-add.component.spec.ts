import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianAddComponent } from './physician-add.component';

describe('PhysicianAddComponent', () => {
  let component: PhysicianAddComponent;
  let fixture: ComponentFixture<PhysicianAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
