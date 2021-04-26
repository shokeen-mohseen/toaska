import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToscaLoginComponent } from './tosca-login.component';

describe('ToscaLoginComponent', () => {
  let component: ToscaLoginComponent;
  let fixture: ComponentFixture<ToscaLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToscaLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToscaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
