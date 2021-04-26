import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipFromRoutingComponent } from './ship-from-routing.component';

describe('ShipFromRoutingComponent', () => {
  let component: ShipFromRoutingComponent;
  let fixture: ComponentFixture<ShipFromRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipFromRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipFromRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
