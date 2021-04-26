import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderWorkbechComponent } from './purchase-order-workbech.component';

describe('PurchaseOrderWorkbechComponent', () => {
  let component: PurchaseOrderWorkbechComponent;
  let fixture: ComponentFixture<PurchaseOrderWorkbechComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderWorkbechComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderWorkbechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
