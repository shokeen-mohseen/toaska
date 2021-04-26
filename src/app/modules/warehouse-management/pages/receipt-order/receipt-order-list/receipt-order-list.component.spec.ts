import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptOrderListComponent } from './receipt-order-list.component';

describe('ReceiptOrderListComponent', () => {
  let component: ReceiptOrderListComponent;
  let fixture: ComponentFixture<ReceiptOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
