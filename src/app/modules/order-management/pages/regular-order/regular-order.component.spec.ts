import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularOrderComponent } from './regular-order.component';

describe('RegularOrderComponent', () => {
  let component: RegularOrderComponent;
  let fixture: ComponentFixture<RegularOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
