import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewChargeComponent } from './addnew-charge.component';

describe('AddnewChargeComponent', () => {
  let component: AddnewChargeComponent;
  let fixture: ComponentFixture<AddnewChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
