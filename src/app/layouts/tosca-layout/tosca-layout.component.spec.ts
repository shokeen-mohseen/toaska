import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToscaLayoutComponent } from './tosca-layout.component';

describe('ToscaLayoutComponent', () => {
  let component: ToscaLayoutComponent;
  let fixture: ComponentFixture<ToscaLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToscaLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToscaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
