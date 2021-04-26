import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ByOrderComponent } from './by-order.component';

describe('ByOrderComponent', () => {
  let component: ByOrderComponent;
  let fixture: ComponentFixture<ByOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ByOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ByOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
