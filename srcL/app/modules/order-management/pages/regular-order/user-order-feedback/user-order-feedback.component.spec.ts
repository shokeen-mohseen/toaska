import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderFeedbackComponent } from './user-order-feedback.component';

describe('UserOrderFeedbackComponent', () => {
  let component: UserOrderFeedbackComponent;
  let fixture: ComponentFixture<UserOrderFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOrderFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrderFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
