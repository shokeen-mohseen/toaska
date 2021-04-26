import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeTypeComponent } from './charge-type.component';

describe('ChargeTypeComponent', () => {
  let component: ChargeTypeComponent;
  let fixture: ComponentFixture<ChargeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
