import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustShippingMaterialsComponent } from './adjust-shipping-materials.component';

describe('AdjustShippingMaterialsComponent', () => {
  let component: AdjustShippingMaterialsComponent;
  let fixture: ComponentFixture<AdjustShippingMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustShippingMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustShippingMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
