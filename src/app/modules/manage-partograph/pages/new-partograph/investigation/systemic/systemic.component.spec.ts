import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemicComponent } from './systemic.component';

describe('SystemicComponent', () => {
  let component: SystemicComponent;
  let fixture: ComponentFixture<SystemicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
