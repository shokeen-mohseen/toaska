import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToscaForgotPasswordComponent } from './tosca-forgot-password.component';

describe('ToscaForgotPasswordComponent', () => {
  let component: ToscaForgotPasswordComponent;
  let fixture: ComponentFixture<ToscaForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToscaForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToscaForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
