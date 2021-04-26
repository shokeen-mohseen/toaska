import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBirthingPositionComponent } from './add-birthing-position.component';

describe('AddBirthingPositionComponent', () => {
  let component: AddBirthingPositionComponent;
  let fixture: ComponentFixture<AddBirthingPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBirthingPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBirthingPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
