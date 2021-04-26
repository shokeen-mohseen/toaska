import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditchargeComponent } from './add-editcharge.component';

describe('AddEditchargeComponent', () => {
  let component: AddEditchargeComponent;
  let fixture: ComponentFixture<AddEditchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
