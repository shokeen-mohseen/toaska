import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipRoutingListComponent } from './ship-routing-list.component';

describe('ShipRoutingListComponent', () => {
  let component: ShipRoutingListComponent;
  let fixture: ComponentFixture<ShipRoutingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipRoutingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipRoutingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
