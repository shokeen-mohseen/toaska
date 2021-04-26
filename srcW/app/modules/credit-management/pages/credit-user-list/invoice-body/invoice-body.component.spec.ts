import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBodyComponent } from './invoice-body.component';

describe('InvoiceBodyComponent', () => {
  let component: InvoiceBodyComponent;
  let fixture: ComponentFixture<InvoiceBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
