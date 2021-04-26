import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentHistoryListComponent } from './shipment-history-list.component';

describe('ShipmentHistoryListComponent', () => {
  let component: ShipmentHistoryListComponent;
  let fixture: ComponentFixture<ShipmentHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
