import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToscaRegisterComponent } from './tosca-register.component';

describe('ToscaRegisterComponent', () => {
  let component: ToscaRegisterComponent;
  let fixture: ComponentFixture<ToscaRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToscaRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToscaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
