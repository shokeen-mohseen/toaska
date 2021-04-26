import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtpOrderDetailPopupComponent } from './atp-order-detail-popup.component';

describe('AtpOrderDetailPopupComponent', () => {
  let component: AtpOrderDetailPopupComponent;
  let fixture: ComponentFixture<AtpOrderDetailPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtpOrderDetailPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtpOrderDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
