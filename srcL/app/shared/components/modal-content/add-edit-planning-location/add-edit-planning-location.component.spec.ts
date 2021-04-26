import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlanningLocationComponent } from './add-edit-planning-location.component';

describe('AddEditPlanningLocationComponent', () => {
  let component: AddEditPlanningLocationComponent;
  let fixture: ComponentFixture<AddEditPlanningLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPlanningLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPlanningLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
