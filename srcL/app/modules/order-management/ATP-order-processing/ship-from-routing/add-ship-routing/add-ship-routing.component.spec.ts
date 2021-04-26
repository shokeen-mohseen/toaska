import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShipRoutingComponent } from './add-ship-routing.component';

describe('AddShipRoutingComponent', () => {
  let component: AddShipRoutingComponent;
  let fixture: ComponentFixture<AddShipRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShipRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShipRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
