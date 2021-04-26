import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelSurchargeComponent } from './fuel-surcharge.component';

describe('FuelSurchargeComponent', () => {
  let component: FuelSurchargeComponent;
  let fixture: ComponentFixture<FuelSurchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelSurchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelSurchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
