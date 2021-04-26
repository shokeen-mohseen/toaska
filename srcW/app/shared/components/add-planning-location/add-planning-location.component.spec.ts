import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanningLocationComponent } from './add-planning-location.component';

describe('AddPlanningLocationComponent', () => {
  let component: AddPlanningLocationComponent;
  let fixture: ComponentFixture<AddPlanningLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlanningLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlanningLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
